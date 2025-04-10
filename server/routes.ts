import type { Express, Request, Response } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { PORTFOLIO_CATEGORIES, insertPortfolioItemSchema } from "@shared/schema";
import { UploadedFile } from "express-fileupload";
import path from "path";
import crypto from "crypto";

// Type definition for the extended request with files
interface FileRequest extends Request {
  files?: {
    image?: UploadedFile | UploadedFile[];
  };
}

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

  // Upload image endpoint
  app.post("/api/upload", (req: Request, res: Response) => {
    try {
      const filesReq = req as FileRequest;
      if (!filesReq.files || !filesReq.files.image) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      
      const imageFile = filesReq.files.image as UploadedFile;
      
      // Generate unique filename
      const fileExtension = path.extname(imageFile.name);
      const hashedFileName = crypto.randomBytes(16).toString('hex') + fileExtension;
      const uploadPath = path.join(process.cwd(), 'uploads', hashedFileName);
      
      // Move the file
      imageFile.mv(uploadPath, (err) => {
        if (err) {
          return res.status(500).json({ message: "Error uploading file", error: err });
        }
        
        // Return the file path that can be used to access the image
        res.json({ 
          imagePath: `/uploads/${hashedFileName}`,
          message: "File uploaded successfully" 
        });
      });
    } catch (error) {
      res.status(500).json({ message: "Error processing upload", error });
    }
  });

  app.post("/api/items", async (req, res) => {
    try {
      const newItem = insertPortfolioItemSchema.parse(req.body);
      const item = await storage.createItem(newItem);
      res.status(201).json(item);
    } catch (error) {
      res.status(400).json({ message: "Invalid item data" });
    }
  });

  return createServer(app);
}