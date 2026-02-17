import { createApp } from "./app.js";
import { initDb } from "./db/index.js";

const PORT = process.env.PORT || 3001;

// Initialize database before starting server
try {
  initDb();
  const app = createApp();
  app.listen(PORT, () => console.log(`[api] http://localhost:${PORT}`));
} catch (error) {
  console.error("Failed to start server:", error);
  process.exit(1);
}
