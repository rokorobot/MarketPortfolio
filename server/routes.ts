import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { PORTFOLIO_CATEGORIES } from "@shared/schema";

export function registerRoutes(app: Express) {
  app.get("/api/items", async (req, res) => {
    const { category } = req.query;

    if (category && typeof category === 'string') {
      const items = await storage.getItemsByCategory(category);
      res.json(items);
    } else {
      const items = await storage.getItems();
      res.json(items);
    }
  });

  app.get("/api/categories", (_req, res) => {
    res.json(PORTFOLIO_CATEGORIES);
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