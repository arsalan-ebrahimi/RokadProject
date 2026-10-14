import express from "express";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { catchError, HandleERROR } from "vanta-api";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./Utils/Swagger.js";

import qs from "qs";
import { exportValidation } from "./Middleware/ExportValidation.js";
import {
  securityHeaders,
  corsMiddleware,
  globalLimiter,
  authLimiter,
  writeLimiter,
  uploadLimiter,
  noSqlSanitizer,
  vantaQueryAuditor,
  hppGuard,
  securityErrorHandler,
} from "./Middleware/security.js";

import authRouter from "./Modules/Auth/Auth.js";
import userRouter from "./Modules/User/User.js";
import blogRouter from "./Modules/Blog/Blog.js";
import uploadRouter from "./Modules/Upload/Upload.js";
import commentRouter from "./Modules/Comment/Comment.js";
import awardRouter from "./Modules/Award/Award.js";
import studentRouter from "./Modules/Student/Student.js";
import eventRouter from "./Modules/Event/Event.js";
import seoRouter from "./Modules/Seo/Seo.js";

const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

// Load environment configuration
dotenv.config({ path: path.join(__dirname, "config.env") });

const app = express();

// Disable X-Powered-By header at the Express framework level
app.disable("x-powered-by");

// ==============================================================================
// MIDDLEWARE PIPELINE (Order is strictly defined and verified)
// ==============================================================================

// 1. TRUST PROXY & QUERY PARSER LIMITS
// WHY: Must be configured before rate-limiters or IP checks so req.ip is correctly
// derived from reverse proxy hops (avoids express-rate-limit permissive proxy errors).
const trustProxyConfig = process.env.TRUST_PROXY
  ? isNaN(Number(process.env.TRUST_PROXY))
    ? process.env.TRUST_PROXY
    : Number(process.env.TRUST_PROXY)
  : 1;
app.set("trust proxy", trustProxyConfig);

// WHY: Custom query parser enforces depth, array, and parameter limits, and explicitly
// disables prototype pollution (allowPrototypes: false) while maintaining compatibility
// with vanta-api array filters and operators.
app.set("query parser", (str) =>
  qs.parse(str, {
    depth: 10,
    parameterLimit: 1000,
    arrayLimit: 100,
    allowPrototypes: false,
  })
);

// 2. HELMET-EQUIVALENT SECURITY HEADERS
// WHY: Security headers (CSP, nosniff, frame protection, CORP) must be attached
// to EVERY response, including early rejections (400, 429, 404).
app.use(securityHeaders);

// 3. STRICT CORS
// WHY: CORS preflight (OPTIONS) and access headers must run early to allow
// authorized cross-origin Admin/frontends while immediately halting unauthorized origins.
app.use(corsMiddleware);

// 4. GLOBAL BASELINE RATE LIMITER
// WHY: Generous IP-based baseline rate limiter protects the server from volumetric DoS
// before CPU/memory-intensive body parsing and database operations.
app.use(globalLimiter);

// 5. REQUEST LOGGING
// WHY: Logging runs after rate-limiting so volumetric flooding does not exhaust disk/console logs.
app.use(morgan("dev"));

// 6. BODY PARSERS (with per-route limits)
// WHY: Strict JSON parsing rejects raw primitives. The blog route receives a larger 5mb
// limit for rich-text HTML articles, while all other routes default to 100kb.
app.use("/api/blog", express.json({ limit: "5mb", strict: true }));
app.use(express.json({ limit: "100kb", strict: true }));
app.use(express.urlencoded({ extended: true, limit: "100kb", parameterLimit: 1000 }));

// 7. STATIC FILE SERVING (Uploads)
// WHY: Served with Cross-Origin-Resource-Policy: cross-origin so the Admin dashboard
// and client frontends on separate origins can render uploaded images without browser CORP blocks.
app.use(
  express.static(path.join(__dirname, "Public"), {
    dotfiles: "ignore",
    index: false,
    setHeaders: (res) => {
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
      res.setHeader("X-Content-Type-Options", "nosniff");
    },
  })
);

// 8. NOSQL INJECTION SANITIZER & VANTA-API QUERY AUDITOR & HPP GUARD
// WHY: Express 5 compatible in-place sanitizer and auditor. Rejects $-prefixed keys,
// prototype pollution, and dangerous operators (regex, where, expr) before routes execute.
app.use(noSqlSanitizer);
app.use(vantaQueryAuditor);
app.use(hppGuard);

// 9. AUTHENTICATION VALIDATION (JWT verification)
// WHY: Decodes Bearer token into req.userId and req.role prior to controller execution.
app.use(exportValidation);

// 10. HEALTH CHECK ENDPOINT
// WHY: Lightweight liveness/readiness probe for monitoring and reverse proxies.
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// 11. ROUTE GROUPS WITH ROUTE-SPECIFIC RATE LIMITERS
// WHY: Tiers apply strict limits to auth (brute-force defense), uploads (disk defense),
// and write operations, while keeping reads fast and unhindered.
app.use("/api/auth", authLimiter, authRouter);
app.use("/api/upload", uploadLimiter, uploadRouter);
app.use("/api/blog", writeLimiter, blogRouter);
app.use("/api/user", writeLimiter, userRouter);
app.use("/api/comment", writeLimiter, commentRouter);
app.use("/api/award", writeLimiter, awardRouter);
app.use("/api/student", writeLimiter, studentRouter);
app.use("/api/event", writeLimiter, eventRouter);
app.use("/api/seo", writeLimiter, seoRouter);

// 12. SWAGGER DOCUMENTATION
// WHY: Mounted with scoped relaxed CSP for Swagger UI interactive rendering.
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 13. 404 NOT FOUND HANDLER
// WHY: Catches any unmatched route and returns a structured 404 HandleERROR.
app.use((req, res, next) => {
  return next(new HandleERROR("مسیر مورد نظر یافت نشد", 404));
});

// 14. GLOBAL ERROR HANDLER
// WHY: Uniform error response formatter, suppressing internal server stack traces in production.
app.use(securityErrorHandler);

export default app;