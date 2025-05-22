import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import fileUpload from "express-fileupload";
import path from "path";
import { migrateDatabase } from "./migration";
import { migrateNFTFields } from "./nft-migration";
import { migrateItemCollectors } from "./collector-migration";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(fileUpload({
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max file size
  createParentPath: true
}));

// Serve uploaded files with caching
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads'), {
  maxAge: '1d', // Cache assets for 1 day
  setHeaders: (res, path) => {
    // Images can be cached more aggressively
    if (path.endsWith('.jpg') || path.endsWith('.jpeg') || path.endsWith('.png') || 
        path.endsWith('.gif') || path.endsWith('.webp')) {
      res.setHeader('Cache-Control', 'public, max-age=86400'); // 1 day
    }
  }
}));

// Cache middleware for static assets
app.use((req, res, next) => {
  const path = req.path;
  // Check if request is for a static asset (exclude API routes and HTML routes)
  if (!path.startsWith('/api/') && !path.endsWith('/')) {
    const fileExt = path.split('.').pop()?.toLowerCase();
    if (fileExt) {
      // Set varying cache headers based on file type
      if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'ico'].includes(fileExt)) {
        // Images
        res.setHeader('Cache-Control', 'public, max-age=604800'); // 7 days
      } else if (['css', 'js'].includes(fileExt)) {
        // CSS and JS assets
        res.setHeader('Cache-Control', 'public, max-age=86400'); // 1 day
      } else if (['woff', 'woff2', 'ttf', 'eot', 'otf'].includes(fileExt)) {
        // Fonts
        res.setHeader('Cache-Control', 'public, max-age=2592000'); // 30 days
      }
    }
  }
  next();
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Only run migrations in development environment
  if (process.env.NODE_ENV !== 'production') {
    console.log('Starting database migration...');
    await migrateDatabase();
    await migrateNFTFields();
    await migrateItemCollectors();
    console.log('All migrations completed successfully!');
  } else {
    console.log('Production environment detected - skipping migrations');
  }
  
  const server = registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client
  const PORT = 5000;
  server.listen(PORT, "0.0.0.0", () => {
    log(`serving on port ${PORT} (http://localhost:${PORT})`);
  });
})();
