import type { Express, Request, Response, NextFunction } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { PORTFOLIO_CATEGORIES, insertPortfolioItemSchema, insertUserSchema } from "@shared/schema";
import { UploadedFile } from "express-fileupload";
import path from "path";
import crypto from "crypto";
import { generateTagsFromImage, generateTagsFromText } from "./openai-service";
import session from "express-session";
import { z } from "zod";

// Extend express-session with our custom properties
declare module 'express-session' {
  interface SessionData {
    userId?: number;
    username?: string;
    userRole?: string;
  }
}

// Type definition for the extended request with files
interface FileRequest extends Request {
  files?: {
    image?: UploadedFile | UploadedFile[];
  };
}

// Session-enabled request type
declare global {
  namespace Express {
    interface User {
      id: number;
      username: string;
      role: string;
    }
  }
}

// Auth middleware
function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (req.session && req.session.userId) {
    return next();
  }
  return res.status(401).json({ message: "Authentication required" });
}

// Admin role middleware
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.session && req.session.userRole === 'admin') {
    return next();
  }
  return res.status(403).json({ message: "Admin access required" });
}

export function registerRoutes(app: Express) {
  // Set up session
  app.use(session({
    secret: process.env.SESSION_SECRET || 'portfolio-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
  }));
  
  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
      }
      
      const user = await storage.validateUser(username, password);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Set session data
      req.session.userId = user.id;
      req.session.username = user.username;
      req.session.userRole = user.role;
      
      return res.json({
        id: user.id,
        username: user.username,
        role: user.role
      });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "Login failed" });
    }
  });
  
  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.clearCookie('connect.sid');
      return res.json({ message: "Logged out successfully" });
    });
  });
  
  app.post("/api/auth/register", async (req, res) => {
    try {
      // Only admin can create new users
      if (req.session.userRole !== 'admin') {
        return res.status(403).json({ message: "Admin access required for registration" });
      }
      
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByUsername(userData.username);
      
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      const user = await storage.createUser(userData);
      return res.status(201).json({
        id: user.id,
        username: user.username,
        role: user.role
      });
    } catch (error) {
      console.error("Registration error:", error);
      return res.status(400).json({ message: "Invalid user data" });
    }
  });
  
  app.get("/api/auth/me", async (req, res) => {
    if (!req.session || !req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    const user = await storage.getUser(req.session.userId);
    if (!user) {
      req.session.destroy(() => {});
      return res.status(401).json({ message: "User not found" });
    }
    
    return res.json({
      id: user.id,
      username: user.username,
      role: user.role
    });
  });
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

  // Upload image endpoint - admin only
  app.post("/api/upload", requireAuth, requireAdmin, (req: Request, res: Response) => {
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

  // API endpoint for tag suggestions from image
  app.post("/api/suggest-tags", async (req, res) => {
    try {
      const { imagePath, title, description } = req.body;
      
      if (!imagePath) {
        // If no image is provided, generate tags based on text only
        if (!title && !description) {
          return res.status(400).json({ message: "No content provided for tag suggestions" });
        }
        
        const tags = await generateTagsFromText(title || "", description || "");
        return res.json({ tags });
      }
      
      // If image path is provided, use it for tag generation along with text
      const absoluteImagePath = path.join(process.cwd(), imagePath.replace(/^\//, ''));
      const tags = await generateTagsFromImage(absoluteImagePath, title || "", description || "");
      res.json({ tags });
    } catch (error) {
      console.error("Error suggesting tags:", error);
      res.status(500).json({ message: "Error generating tag suggestions" });
    }
  });

  app.post("/api/items", requireAuth, requireAdmin, async (req, res) => {
    try {
      const newItem = insertPortfolioItemSchema.parse(req.body);
      const item = await storage.createItem(newItem);
      res.status(201).json(item);
    } catch (error) {
      res.status(400).json({ message: "Invalid item data" });
    }
  });
  
  app.delete("/api/items/:id", requireAuth, requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid item ID" });
      }
      
      const item = await storage.getItem(id);
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }
      
      const success = await storage.deleteItem(id);
      if (success) {
        res.status(200).json({ message: "Item deleted successfully" });
      } else {
        res.status(500).json({ message: "Failed to delete item" });
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  return createServer(app);
}