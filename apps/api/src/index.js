import { createApp } from "./app.js";
import { initDb } from "./db/index.js";

const PORT = process.env.PORT || 3001;

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

// Initialize database before starting server
try {
  await initDb();
  const app = createApp();
  app.listen(PORT, () => console.log(`[api] http://localhost:${PORT}`));
} catch (error) {
  console.error("Failed to start server:", error);
  process.exit(1);
}
