import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";

export function registerRoutes(app: Express) {
  app.get("/api/items", async (_req, res) => {
    const items = await storage.getItems();
    res.json(items);
  });

  app.get("/api/items/:id", async (req, res) => {
    const item = await storage.getItem(parseInt(req.params.id));
    if (!item) {
      res.status(404).json({ message: "Item not found" });
      return;
    }
    res.json(item);
  });

  return createServer(app);
}
