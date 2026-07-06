import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { connectMongoDB } from "./server/db.js"; // Wait, we can import connectMongoDB from server/db.ts
import { db } from "./server/db.js";
import routes from "./server/routes.js";

// Load environment variables
dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Attempt to connect to MongoDB
  await connectMongoDB();

  // Express Middlewares
  app.use(express.json());

  // Mount API Endpoints
  app.use("/api", routes);

  // Serve static assets or Vite middleware depending on environment
  if (process.env.NODE_ENV !== "production") {
    console.log("🛠️ Starting server in DEVELOPMENT mode with Vite Middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("🚀 Starting server in PRODUCTION mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`📡 Full-stack Bakery Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("💥 Critical Server Startup Error:", err);
});
