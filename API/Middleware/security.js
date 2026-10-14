import cors from "cors";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import { HandleERROR } from "vanta-api";

/**
 * ==============================================================================
 * Comprehensive Security Module for Rokad API
 * 
 * Includes:
 * 1. Security Headers (Helmet-equivalent with strict CSP & scoped relaxations)
 * 2. Express 5 compatible in-place NoSQL injection sanitizer & Prototype pollution guard
 * 3. Vanta-API query parameter auditor (operators, sensitive fields, sort, search cap)
 * 4. HTTP Parameter Pollution (HPP) normalization
 * 5. Tiered Rate Limiting (Global, Auth, Write, Upload, Preview)
 * 6. Strict CORS Configuration
 * ==============================================================================
 */

// ------------------------------------------------------------------------------
// CONSTANTS & ALLOW-LISTS
// ------------------------------------------------------------------------------

/** Prototype pollution forbidden keys */
const PROTOTYPE_POLLUTION_KEYS = new Set(["__proto__", "constructor", "prototype"]);

/** Dangerous query operators that should never be executed via client queries */
const DANGEROUS_OPERATORS = new Set([
  "regex",
  "$regex",
  "where",
  "$where",
  "expr",
  "$expr",
  "accumulator",
  "$accumulator",
  "function",
  "$function",
  "jsonSchema",
  "$jsonSchema",
]);

/** Legitimate allowed operators for vanta-api queries */
const ALLOWED_QUERY_OPERATORS = new Set([
  "eq",
  "ne",
  "gt",
  "gte",
  "lt",
  "lte",
  "in",
  "nin",
  "exists",
  "size",
]);

/** Sensitive fields that clients must never filter, sort, or select on */
const FORBIDDEN_FIELDS = new Set([
  "password",
  "token",
  "tokens",
  "code",
  "otp",
  "passwordResetToken",
  "__v",
]);

// Rate Limit Constants with Environment Overrides
export const RATE_LIMIT_CONFIG = {
  globalWindowMs: Number(process.env.RATE_LIMIT_GLOBAL_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  globalMax: Number(process.env.RATE_LIMIT_GLOBAL_MAX) || 1000,

  authWindowMs: Number(process.env.RATE_LIMIT_AUTH_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  authMax: Number(process.env.RATE_LIMIT_AUTH_MAX) || 20,

  writeWindowMs: Number(process.env.RATE_LIMIT_WRITE_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  writeMax: Number(process.env.RATE_LIMIT_WRITE_MAX) || 300,

  uploadWindowMs: Number(process.env.RATE_LIMIT_UPLOAD_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  uploadMax: Number(process.env.RATE_LIMIT_UPLOAD_MAX) || 60,

  previewWindowMs: Number(process.env.RATE_LIMIT_PREVIEW_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  previewMax: Number(process.env.RATE_LIMIT_PREVIEW_MAX) || 100,
};

// ------------------------------------------------------------------------------
// 1. HELMET-EQUIVALENT SECURITY HEADERS MIDDLEWARE
// ------------------------------------------------------------------------------

/**
 * Attaches enterprise security headers to every response.
 * Tailored for a JSON API with scoped relaxations for Swagger UI and static files.
 */
export const securityHeaders = (req, res, next) => {
  // Disable X-Powered-By header
  res.removeHeader("X-Powered-By");

  // Prevent MIME-sniffing
  res.setHeader("X-Content-Type-Options", "nosniff");

  // Frame protection (clickjacking mitigation)
  res.setHeader("X-Frame-Options", "DENY");

  // Referrer Policy
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

  // Disable DNS prefetching
  res.setHeader("X-DNS-Prefetch-Control", "off");

  // Prevent IE from executing downloads in site's context
  res.setHeader("X-Download-Options", "noopen");

  // Restrict Adobe Flash / Acrobat cross-domain policies
  res.setHeader("X-Permitted-Cross-Domain-Policies", "none");

  // Disable obsolete and vulnerable browser XSS auditors
  res.setHeader("X-XSS-Protection", "0");

  // Isolate origin browsing context
  res.setHeader("Origin-Agent-Cluster", "?1");

  // Cross-Origin Opener Policy
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");

  // Cross-Origin Resource Policy (default same-origin, overridden to cross-origin on static assets)
  res.setHeader("Cross-Origin-Resource-Policy", "same-origin");

  // Strict Content-Security-Policy for API endpoints
  if (req.path.startsWith("/api-docs")) {
    // Relaxed CSP for Swagger UI documentation
    res.setHeader(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self'"
    );
  } else {
    // Strict CSP for JSON API endpoints
    res.setHeader(
      "Content-Security-Policy",
      "default-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'"
    );
  }

  // HSTS (HTTP Strict Transport Security): Only in production when actually served over HTTPS
  const isHttps = req.secure || req.headers["x-forwarded-proto"] === "https";
  if (process.env.NODE_ENV === "production" && isHttps) {
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  }

  next();
};

// ------------------------------------------------------------------------------
// 2. CORS CONFIGURATION
// ------------------------------------------------------------------------------

const parseAllowedOrigins = () => {
  const envOrigins = process.env.CORS_ORIGIN;
  if (!envOrigins) {
    return ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"];
  }
  return envOrigins.split(",").map((o) => o.trim()).filter(Boolean);
};

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (curl, server-to-server, mobile native) with no origin
    if (!origin) return callback(null, true);

    const allowed = parseAllowedOrigins();
    // Strict origin matching: never permit '*' when credentials are true
    if (allowed.includes(origin)) {
      return callback(null, true);
    }
    return callback(new HandleERROR("دسترسی از این مبدا مجاز نمی‌باشد (CORS Error)", 403));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
  ],
  exposedHeaders: [
    "RateLimit-Limit",
    "RateLimit-Remaining",
    "RateLimit-Reset",
    "Retry-After",
  ],
  optionsSuccessStatus: 204,
});

// ------------------------------------------------------------------------------
// 3. NOSQL INJECTION & PROTOTYPE POLLUTION SANITIZER (EXPRESS 5 COMPATIBLE)
// ------------------------------------------------------------------------------

/**
 * Checks if a key contains dangerous operators ($ prefix) or prototype pollution properties.
 * Handles bracket and dot notation (e.g., "constructor.prototype", "user[$ne]", "a.__proto__.b")
 * while preserving legitimate dotted paths (e.g., "address.city", "teams.firstTeam.name").
 */
const isDangerousKey = (key) => {
  if (typeof key !== "string") return false;
  if (key.startsWith("$")) return true;
  const segments = key.split(/[.\[\]]/).filter(Boolean);
  return segments.some((seg) => seg.startsWith("$") || PROTOTYPE_POLLUTION_KEYS.has(seg));
};

/**
 * Checks an object recursively for $-prefixed keys or prototype pollution keys.
 * Operates safely on arrays, objects, and nested objects.
 */
const hasInjectionPayload = (obj) => {
  if (!obj || typeof obj !== "object") return false;

  if (Array.isArray(obj)) {
    for (const item of obj) {
      if (hasInjectionPayload(item)) return true;
    }
    return false;
  }

  const keys = Object.getOwnPropertyNames(obj);
  for (const key of keys) {
    if (isDangerousKey(key)) {
      return true;
    }
    if (hasInjectionPayload(obj[key])) {
      return true;
    }
  }

  return false;
};

/**
 * Express 5 compatible middleware:
 * Operates in-place on req.body, req.params, and req.query.
 * Rejects with 400 Bad Request if any $-prefixed or prototype pollution key is detected.
 */
export const noSqlSanitizer = (req, res, next) => {
  try {
    if (req.body && hasInjectionPayload(req.body)) {
      return res.status(400).json({
        success: false,
        message: "درخواست نامعتبر است (ورودی غیرمجاز در بدنه درخواست شناسایی شد)",
        statusCode: 400,
      });
    }

    if (req.params && hasInjectionPayload(req.params)) {
      return res.status(400).json({
        success: false,
        message: "درخواست نامعتبر است (پارامتر مسیر غیرمجاز شناسایی شد)",
        statusCode: 400,
      });
    }

    if (req.query && hasInjectionPayload(req.query)) {
      return res.status(400).json({
        success: false,
        message: "درخواست نامعتبر است (پارامتر جستجوی غیرمجاز شناسایی شد)",
        statusCode: 400,
      });
    }

    next();
  } catch (err) {
    return next(new HandleERROR("خطا در اعتبارسنجی ساختار ورودی", 400));
  }
};

// ------------------------------------------------------------------------------
// 4. VANTA-API QUERY PARAMETER AUDITOR
// ------------------------------------------------------------------------------

/**
 * In-place auditor for req.query to prevent vanta-api operator abuse and data exfiltration.
 * 
 * 1. Closes operator exposure: Operators arrive without $ (field[op]=value).
 *    Blocks dangerous operators (regex, where, expr) with 400.
 * 2. Restricts operators to ALLOWED_QUERY_OPERATORS.
 * 3. Removes forbidden fields from filter query parameters.
 * 4. Sanitizes req.query.sort to prevent sorting by password hashes or tokens.
 * 5. Sanitizes req.query.fields to prevent selecting forbidden fields.
 * 6. Length-caps and sanitizes req.query.q to protect against ReDoS.
 */
export const vantaQueryAuditor = (req, res, next) => {
  if (!req.query || typeof req.query !== "object") {
    return next();
  }

  // 1. Audit req.query.q (Global Search)
  if (req.query.q !== undefined) {
    const rawQ = String(req.query.q);
    // Cap length to 100 characters max to prevent ReDoS / memory stress
    req.query.q = rawQ.slice(0, 100).trim();
  }

  // 2. Audit req.query.sort
  if (typeof req.query.sort === "string") {
    const parts = req.query.sort
      .split(",")
      .map((part) => part.trim())
      .filter((part) => {
        const cleanField = part.replace(/^[-+]/, "").toLowerCase();
        return !FORBIDDEN_FIELDS.has(cleanField);
      });

    if (parts.length > 0) {
      req.query.sort = parts.join(",");
    } else {
      delete req.query.sort;
    }
  }

  // 3. Audit req.query.fields
  if (typeof req.query.fields === "string") {
    const parts = req.query.fields
      .split(",")
      .map((field) => field.trim())
      .filter((field) => {
        const cleanField = field.replace(/^[-+]/, "").toLowerCase();
        return !FORBIDDEN_FIELDS.has(cleanField);
      });

    if (parts.length > 0) {
      req.query.fields = parts.join(",");
    } else {
      delete req.query.fields;
    }
  }

  // 4. Audit query filter fields and bracket operators
  for (const [key, value] of Object.entries(req.query)) {
    if (["page", "limit", "sort", "fields", "populate", "q"].includes(key)) {
      continue;
    }

    // Check if key itself targets a forbidden field (including nested paths like user.password)
    const rootField = key.split("[")[0].replace(/^[-+]/, "").toLowerCase();
    const parts = rootField.split(".");
    if (parts.some((p) => FORBIDDEN_FIELDS.has(p))) {
      delete req.query[key];
      continue;
    }

    // Check bracket operators in raw key names like `field[regex]`
    const bracketMatch = key.match(/^(.+)\[\$?(\w+)\]$/);
    if (bracketMatch) {
      const [, fieldName, op] = bracketMatch;
      const cleanOp = op.replace(/^\$/, "").toLowerCase();

      if (DANGEROUS_OPERATORS.has(cleanOp)) {
        return res.status(400).json({
          success: false,
          message: `اپراتور نامعتبر یا غیرمجاز است: ${cleanOp}`,
          statusCode: 400,
        });
      }

      if (!ALLOWED_QUERY_OPERATORS.has(cleanOp)) {
        delete req.query[key];
        continue;
      }

      const fieldParts = fieldName.toLowerCase().split(".");
      if (fieldParts.some((p) => FORBIDDEN_FIELDS.has(p))) {
        delete req.query[key];
        continue;
      }
    }

    // Check parsed nested objects like `req.query.field = { regex: '...' }`
    if (value && typeof value === "object" && !Array.isArray(value)) {
      for (const op of Object.keys(value)) {
        const cleanOp = op.replace(/^\$/, "").toLowerCase();

        if (DANGEROUS_OPERATORS.has(cleanOp)) {
          return res.status(400).json({
            success: false,
            message: `اپراتور نامعتبر یا غیرمجاز است: ${cleanOp}`,
            statusCode: 400,
          });
        }

        if (!ALLOWED_QUERY_OPERATORS.has(cleanOp)) {
          delete value[op];
        }
      }

      if (Object.keys(value).length === 0) {
        delete req.query[key];
      }
    }
  }

  next();
};

// ------------------------------------------------------------------------------
// 5. HTTP PARAMETER POLLUTION (HPP) NORMALIZER
// ------------------------------------------------------------------------------

/**
 * Normalizes duplicated query parameters.
 * Whitelists comma-separated string parameters while selecting the last occurrence
 * for single-value parameters (page, limit, q, id, sort, fields) to prevent type errors.
 */
export const hppGuard = (req, res, next) => {
  if (!req.query || typeof req.query !== "object") return next();

  const singleValueFields = ["page", "limit", "q", "id", "sort", "fields"];

  for (const field of singleValueFields) {
    if (Array.isArray(req.query[field])) {
      // Pick the last provided parameter value
      req.query[field] = req.query[field][req.query[field].length - 1];
    }
  }

  next();
};

// ------------------------------------------------------------------------------
// 6. PRODUCTION-READY GLOBAL ERROR FORMATTER
// ------------------------------------------------------------------------------

/**
 * Ensures error responses strictly adhere to project's standard JSON schema
 * and suppresses internal server stack traces and driver errors in production.
 */
export const securityErrorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  let message = err.message || "خطای ناشناخته در سرور رخ داده است";

  // Suppress internal system stack traces / database errors in production
  if (process.env.NODE_ENV === "production" && statusCode === 500) {
    message = "خطای داخلی در سرور رخ داده است. لطفاً کمی بعد تلاش کنید.";
  }

  res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
};

// ------------------------------------------------------------------------------
// 7. TIERED RATE LIMITERS
// ------------------------------------------------------------------------------

/**
 * Standard 429 Error Handler formatted to match project's JSON error structure.
 */
const rateLimitHandler = (req, res, next, options) => {
  res.status(options.statusCode).json({
    success: false,
    message: options.message || "تعداد درخواست‌های شما بیش از حد مجاز است. لطفاً کمی بعد دوباره تلاش کنید.",
    statusCode: options.statusCode,
  });
};

/**
 * Baseline Global Rate Limiter: Generous per-IP baseline.
 * Exempts health check and swagger documentation.
 */
export const globalLimiter = rateLimit({
  windowMs: RATE_LIMIT_CONFIG.globalWindowMs,
  max: RATE_LIMIT_CONFIG.globalMax,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  statusCode: 429,
  message: "تعداد درخواست‌های سرور بیش از حد مجاز است. لطفاً کمی بعد تلاش کنید.",
  handler: rateLimitHandler,
  skip: (req) => {
    // Health checks and documentation UI are exempt from global rate limiting
    return req.path === "/health" || req.path.startsWith("/api-docs");
  },
});

/**
 * Strict Auth Rate Limiter:
 * Keyed by IP + normalized phoneNumber to prevent distributed brute-forcing
 * as well as targeted credential stuffing. Successful logins are skipped.
 */
export const authLimiter = rateLimit({
  windowMs: RATE_LIMIT_CONFIG.authWindowMs,
  max: RATE_LIMIT_CONFIG.authMax,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  statusCode: 429,
  skipSuccessfulRequests: true, // Only count failed authentication attempts
  message: "تعداد تلاش‌های ناموفق ورود بیش از حد مجاز است. لطفاً ۱۵ دقیقه دیگر تلاش کنید.",
  handler: rateLimitHandler,
  keyGenerator: (req) => {
    const rawIp = req.ip || "127.0.0.1";
    const phone = req.body?.phoneNumber ? String(req.body.phoneNumber).trim().toLowerCase() : "";
    return phone ? `${ipKeyGenerator(rawIp)}_${phone}` : ipKeyGenerator(rawIp);
  },
});

/**
 * Moderate Write Route Rate Limiter:
 * Applied to POST, PUT, PATCH, DELETE operations.
 */
export const writeLimiter = rateLimit({
  windowMs: RATE_LIMIT_CONFIG.writeWindowMs,
  max: RATE_LIMIT_CONFIG.writeMax,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  statusCode: 429,
  message: "تعداد عملیات‌های ثبت یا ویرایش بیش از حد مجاز است. لطفاً کمی بعد دوباره تلاش کنید.",
  handler: rateLimitHandler,
  skip: (req) => {
    // Skip GET, HEAD, OPTIONS
    return req.method === "GET" || req.method === "HEAD" || req.method === "OPTIONS";
  },
});

/**
 * Stricter Upload Rate Limiter:
 * Applied to file upload endpoints to prevent disk exhaustion.
 */
export const uploadLimiter = rateLimit({
  windowMs: RATE_LIMIT_CONFIG.uploadWindowMs,
  max: RATE_LIMIT_CONFIG.uploadMax,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  statusCode: 429,
  message: "تعداد فایل‌های آپلود شده بیش از حد مجاز است. لطفاً کمی بعد دوباره تلاش کنید.",
  handler: rateLimitHandler,
});

/**
 * Stricter Preview Rate Limiter:
 * Applied to heavy preview or HTML rendering operations.
 */
export const previewLimiter = rateLimit({
  windowMs: RATE_LIMIT_CONFIG.previewWindowMs,
  max: RATE_LIMIT_CONFIG.previewMax,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  statusCode: 429,
  message: "تعداد پیش‌نمایش‌های درخواستی بیش از حد مجاز است.",
  handler: rateLimitHandler,
});
