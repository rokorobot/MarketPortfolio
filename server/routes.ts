import type { Express, Request, Response, NextFunction } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { PORTFOLIO_CATEGORIES, insertPortfolioItemSchema, insertUserSchema, insertShareLinkSchema } from "@shared/schema";
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
  
  // Update portfolio item (admin only)
  app.patch("/api/items/:id", requireAuth, requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid item ID" });
      }
      
      // Get current item to ensure it exists
      const existingItem = await storage.getItem(id);
      if (!existingItem) {
        return res.status(404).json({ message: "Item not found" });
      }
      
      // Only allow updating specific fields
      const updateData = {
        title: req.body.title || existingItem.title,
        description: req.body.description || existingItem.description,
        category: req.body.category || existingItem.category,
        tags: req.body.tags || existingItem.tags,
        marketplaceUrl1: req.body.marketplaceUrl1 || existingItem.marketplaceUrl1,
        marketplaceUrl2: req.body.marketplaceUrl2 || existingItem.marketplaceUrl2,
        marketplaceName1: req.body.marketplaceName1 || existingItem.marketplaceName1,
        marketplaceName2: req.body.marketplaceName2 || existingItem.marketplaceName2,
      };
      
      // Update the item
      const updatedItem = await storage.updateItem(id, updateData);
      res.status(200).json(updatedItem);
    } catch (error) {
      console.error("Error updating item:", error);
      res.status(500).json({ message: "Failed to update item" });
    }
  });
  
  // Share link endpoints
  
  // Create a share link for an item
  app.post("/api/share-links", requireAuth, async (req, res) => {
    try {
      const shareData = insertShareLinkSchema.parse(req.body);
      
      // Verify that the item exists
      const item = await storage.getItem(shareData.itemId);
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }
      
      // Generate a unique share code if not provided
      if (!shareData.shareCode) {
        shareData.shareCode = crypto.randomBytes(6).toString('hex');
      }
      
      const shareLink = await storage.createShareLink(shareData);
      
      // Construct the full shareable URL
      const protocol = req.get('x-forwarded-proto') || req.protocol;
      const host = req.get('host');
      const shareUrl = `${protocol}://${host}/share/${shareLink.shareCode}`;
      
      res.status(201).json({
        ...shareLink,
        shareUrl
      });
    } catch (error) {
      console.error("Error creating share link:", error);
      res.status(400).json({ message: "Invalid share link data" });
    }
  });
  
  // Get all share links for an item
  app.get("/api/items/:id/share-links", requireAuth, async (req, res) => {
    try {
      const itemId = parseInt(req.params.id);
      if (isNaN(itemId)) {
        return res.status(400).json({ message: "Invalid item ID" });
      }
      
      const shareLinks = await storage.getShareLinksByItemId(itemId);
      
      // Add the full URL to each share link
      const protocol = req.get('x-forwarded-proto') || req.protocol;
      const host = req.get('host');
      const shareLinksWithUrl = shareLinks.map(link => ({
        ...link,
        shareUrl: `${protocol}://${host}/share/${link.shareCode}`
      }));
      
      res.json(shareLinksWithUrl);
    } catch (error) {
      console.error("Error fetching share links:", error);
      res.status(500).json({ message: "Failed to fetch share links" });
    }
  });
  
  // Get a shared item by share code
  app.get("/api/share/:shareCode", async (req, res) => {
    try {
      const { shareCode } = req.params;
      
      // Look up the share link
      const shareLink = await storage.getShareLinkByCode(shareCode);
      if (!shareLink) {
        return res.status(404).json({ message: "Share link not found or expired" });
      }
      
      // Increment the click counter
      await storage.incrementShareLinkClicks(shareCode);
      
      // Get the original item
      const item = await storage.getItem(shareLink.itemId);
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }
      
      // Return the original item with custom preview info if available
      const sharedItem = {
        ...item,
        customTitle: shareLink.customTitle || item.title,
        customDescription: shareLink.customDescription || item.description,
        customImageUrl: shareLink.customImageUrl || item.imageUrl,
        shareCode: shareLink.shareCode,
        clicks: shareLink.clicks + 1 // Include the incremented click count
      };
      
      res.json(sharedItem);
    } catch (error) {
      console.error("Error fetching shared item:", error);
      res.status(500).json({ message: "Failed to fetch shared item" });
    }
  });
  
  // Delete a share link
  app.delete("/api/share-links/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid share link ID" });
      }
      
      const success = await storage.deleteShareLink(id);
      if (success) {
        res.status(200).json({ message: "Share link deleted successfully" });
      } else {
        res.status(500).json({ message: "Failed to delete share link" });
      }
    } catch (error) {
      console.error("Error deleting share link:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  return createServer(app);
}