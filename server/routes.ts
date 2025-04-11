import type { Express, Request, Response, NextFunction } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { PORTFOLIO_CATEGORIES, insertPortfolioItemSchema, insertUserSchema, insertShareLinkSchema, insertCategorySchema } from "@shared/schema";
import { UploadedFile } from "express-fileupload";
import path from "path";
import crypto from "crypto";
import { generateTagsFromImage, generateTagsFromText } from "./openai-service";
import { sendContactFormEmail } from "./sendgrid-service";
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

  // Get all category options for the dropdown menu
  app.get("/api/category-options", async (_req, res) => {
    try {
      // Get all categories from the database
      const categories = await storage.getCategories();
      
      // Extract the category names
      const categoryNames = categories.map(cat => cat.name);
      
      // Combine with built-in categories
      const allCategoryOptions = Array.from(new Set([...categoryNames, ...PORTFOLIO_CATEGORIES]));
      
      res.json(allCategoryOptions);
    } catch (error) {
      console.error("Error fetching category options:", error);
      // Fallback to built-in categories if database query fails
      res.json(PORTFOLIO_CATEGORIES);
    }
  });
  
  // Get all categories from the database
  app.get("/api/categories", async (_req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });
  
  // Get a specific category by ID
  app.get("/api/categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
      
      const category = await storage.getCategory(id);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      res.json(category);
    } catch (error) {
      console.error("Error fetching category:", error);
      res.status(500).json({ message: "Failed to fetch category" });
    }
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
        author: req.body.author !== undefined ? req.body.author : existingItem.author, // Handle null/empty author values
        authorUrl: req.body.authorUrl !== undefined ? req.body.authorUrl : existingItem.authorUrl, // Handle null/empty authorUrl values
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
  
  // Category endpoints
  
  // Create a new category (admin only)
  app.post("/api/categories", requireAuth, requireAdmin, async (req, res) => {
    try {
      // Validate the input data
      const categoryData = insertCategorySchema.parse(req.body);
      
      // Check if a category with the same name already exists
      const existingCategory = await storage.getCategoryByName(categoryData.name);
      if (existingCategory) {
        return res.status(400).json({ message: "A category with this name already exists" });
      }
      
      // Add the user ID of the creator
      categoryData.createdById = req.session.userId!;
      
      // Create the category
      const newCategory = await storage.createCategory(categoryData);
      res.status(201).json(newCategory);
    } catch (error) {
      console.error("Error creating category:", error);
      res.status(400).json({ message: "Invalid category data" });
    }
  });
  
  // Update a category (admin only)
  app.patch("/api/categories/:id", requireAuth, requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
      
      // Get current category to ensure it exists
      const existingCategory = await storage.getCategory(id);
      if (!existingCategory) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      // If name is being updated, check for duplicates
      if (req.body.name && req.body.name !== existingCategory.name) {
        const nameExists = await storage.getCategoryByName(req.body.name);
        if (nameExists) {
          return res.status(400).json({ message: "A category with this name already exists" });
        }
      }
      
      // Only allow updating specific fields
      const updateData = {
        name: req.body.name || existingCategory.name,
        description: req.body.description !== undefined ? req.body.description : existingCategory.description,
      };
      
      // Update the category
      const updatedCategory = await storage.updateCategory(id, updateData);
      res.status(200).json(updatedCategory);
    } catch (error) {
      console.error("Error updating category:", error);
      res.status(500).json({ message: "Failed to update category" });
    }
  });
  
  // Delete a category (admin only)
  app.delete("/api/categories/:id", requireAuth, requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
      
      // Check if the category exists
      const category = await storage.getCategory(id);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      // Delete the category
      const success = await storage.deleteCategory(id);
      if (success) {
        res.status(200).json({ message: "Category deleted successfully" });
      } else {
        res.status(500).json({ message: "Failed to delete category" });
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Site Settings routes
  app.get("/api/site-settings", async (req, res) => {
    try {
      const settings = await storage.getSiteSettings();
      
      // Convert to a more user-friendly object format
      const settingsObject = settings.reduce((acc, setting) => {
        acc[setting.key] = setting.value;
        return acc;
      }, {} as Record<string, string | null>);
      
      res.json(settingsObject);
    } catch (error) {
      console.error("Error fetching site settings:", error);
      res.status(500).json({ message: "Error fetching site settings" });
    }
  });
  
  app.get("/api/site-settings/:key", async (req, res) => {
    try {
      const { key } = req.params;
      const setting = await storage.getSiteSettingByKey(key);
      
      if (!setting) {
        return res.status(404).json({ message: "Setting not found" });
      }
      
      res.json(setting);
    } catch (error) {
      console.error(`Error fetching site setting ${req.params.key}:`, error);
      res.status(500).json({ message: "Error fetching site setting" });
    }
  });
  
  app.post("/api/site-settings", requireAuth, requireAdmin, async (req, res) => {
    try {
      const { key, value } = req.body;
      
      if (!key) {
        return res.status(400).json({ message: "Key is required" });
      }
      
      const setting = await storage.updateSiteSetting(key, value);
      res.status(200).json(setting);
    } catch (error) {
      console.error("Error creating/updating site setting:", error);
      res.status(500).json({ message: "Error creating/updating site setting" });
    }
  });
  
  // Contact form endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      // Validate input
      const contactSchema = z.object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        email: z.string().email("Please enter a valid email address"),
        message: z.string().min(10, "Message must be at least 10 characters"),
      });
      
      const { name, email, message } = contactSchema.parse(req.body);
      
      // Get admin email from site settings
      const settings = await storage.getSiteSettings();
      const settingsObj = settings.reduce((acc, setting) => {
        acc[setting.key] = setting.value;
        return acc;
      }, {} as Record<string, string | null>);
      
      const adminEmail = settingsObj.email_contact;
      
      if (!adminEmail) {
        return res.status(500).json({ 
          success: false, 
          message: "Contact email not configured. Please set up the email_contact in site settings." 
        });
      }
      
      try {
        // Send email
        const result = await sendContactFormEmail(name, email, message, adminEmail);
        
        if (result) {
          res.status(200).json({ 
            success: true, 
            message: "Your message has been sent successfully!" 
          });
        } else {
          console.error("Failed to send email via SendGrid");
          res.status(500).json({ 
            success: false, 
            message: "Failed to send email. Please try again later."
          });
        }
      } catch (emailError) {
        console.error("Error sending email:", emailError);
        res.status(500).json({ 
          success: false, 
          message: "Failed to send email: " + (emailError instanceof Error ? emailError.message : "Unknown error")
        });
      }
    } catch (error) {
      console.error("Contact form error:", error);
      
      if (error instanceof z.ZodError) {
        // Handle validation errors
        const errorMessages = error.errors.map(err => `${err.path}: ${err.message}`).join(', ');
        return res.status(400).json({ 
          success: false, 
          message: "Validation error",
          errors: errorMessages
        });
      }
      
      res.status(500).json({ 
        success: false, 
        message: "An unexpected error occurred. Please try again later."
      });
    }
  });

  return createServer(app);
}