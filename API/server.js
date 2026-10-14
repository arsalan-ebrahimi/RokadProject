import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables before any module reads process.env
dotenv.config({ path: path.join(__dirname, "config.env") });

// Fail fast in production if critical variables are missing
if (process.env.NODE_ENV === "production") {
  const requiredEnv = ["DATA_BASE", "JWT_SECRET"];
  const missing = requiredEnv.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    console.error(`❌ CRITICAL: Missing required environment variables in production: ${missing.join(", ")}`);
    process.exit(1);
  }
}

import app from "./app.js";
import mongoose from "mongoose";

const PORT = Number(process.env.PORT) || 5000;
let server;

mongoose
  .connect(process.env.DATA_BASE)
  .then(() => {
    console.log("✅ Database connected successfully (RokadProject)");

    server = app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });

    // Server Timeouts: prevent slowloris and stale socket starvation
    server.headersTimeout = 65000;
    server.requestTimeout = 60000;
    server.keepAliveTimeout = 61000;
  })
  .catch((error) => {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  });

// Process-level unhandled rejection handler
process.on("unhandledRejection", (err) => {
  console.error("💥 UNHANDLED REJECTION! Shutting down gracefully...", err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

// Process-level uncaught exception handler
process.on("uncaughtException", (err) => {
  console.error("💥 UNCAUGHT EXCEPTION! Shutting down immediately...", err);
  process.exit(1);
});

// Graceful shutdown on SIGTERM / SIGINT
const handleShutdown = (signal) => {
  console.log(`\n👋 ${signal} received. Closing HTTP server gracefully...`);
  if (server) {
    server.close(async () => {
      console.log("🔒 HTTP server closed.");
      try {
        await mongoose.connection.close();
        console.log("💾 MongoDB connection closed.");
      } catch (err) {
        console.error("Error closing MongoDB connection:", err);
      }
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

process.on("SIGTERM", () => handleShutdown("SIGTERM"));
process.on("SIGINT", () => handleShutdown("SIGINT"));