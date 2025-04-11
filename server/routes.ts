import type { Express, Request, Response, NextFunction } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { PORTFOLIO_CATEGORIES, insertPortfolioItemSchema, insertUserSchema, insertShareLinkSchema, insertCategorySchema } from "@shared/schema";
import { UploadedFile } from "express-fileupload";
import path from "path";
import crypto from "crypto";
import { generateTagsFromImage, generateTagsFromText } from "./openai-service";
// Import both email services so we can choose between them
import { sendContactFormEmail as sendGridEmail } from "./sendgrid-service";
import { sendContactFormEmail as nodeMailerEmail } from "./nodemailer-service";
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
    const { category, page = '1', pageSize } = req.query;
    
    try {
      // Get items_per_page from site settings if pageSize isn't provided
      let pageSizeNum: number;
      
      if (pageSize) {
        pageSizeNum = parseInt(pageSize as string) || 24;
      } else {
        // Try to get items_per_page from settings
        const itemsPerPageSetting = await storage.getSiteSettingByKey('items_per_page');
        pageSizeNum = itemsPerPageSetting?.value ? parseInt(itemsPerPageSetting.value) || 24 : 24;
      }
      
      // Parse page parameter
      const pageNum = parseInt(page as string) || 1;
      
      // If category is provided, use category-specific pagination
      if (category && typeof category === 'string') {
        const result = await storage.getItemsByCategoryPaginated(category, pageNum, pageSizeNum);
        res.json(result);
      } else {
        // Use general pagination
        const result = await storage.getItemsPaginated(pageNum, pageSizeNum);
        res.json(result);
      }
    } catch (error) {
      console.error('Error fetching paginated items:', error);
      res.status(500).json({ message: 'Error fetching items' });
    }
  });

  // Get all category options for the dropdown menu
  app.get("/api/category-options", async (_req, res) => {
    try {
      // Get all categories from the database
      const categories = await storage.getCategories();
      
      // Extract the category names
      const categoryNames = categories.map(cat => cat.name);
      
      // Use only database categories now (no built-in categories)
      res.json(categoryNames);
    } catch (error) {
      console.error("Error fetching category options:", error);
      // Return empty array if database query fails
      res.json([]);
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
    }
  });
  
  // Get all items for a specific category
  app.get("/api/items/category/:category", async (req, res) => {
    try {
      const categoryName = req.params.category;
      
      // First convert the slug format (lowercase-with-dashes) back to the actual category name
      // Get all categories to find a match
      const categories = await storage.getCategories();
      
      // Find the category that matches the slug
      let targetCategory = null;
      for (const category of categories) {
        const slug = category.name.replace(/\s+/g, '-').toLowerCase();
        if (slug === categoryName) {
          targetCategory = category.name;
          break;
        }
      }
      
      // If no matching category found, look for exact match
      if (!targetCategory) {
        targetCategory = categoryName;
      }
      
      const items = await storage.getItemsByCategory(targetCategory);
      res.json(items);
    } catch (error) {
      console.error("Error fetching items by category:", error);
      res.status(500).json({ message: "Failed to fetch items for category" });
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
  
  // Special endpoint for updating showcase interval - available to all logged-in users
  app.post("/api/showcase-interval", requireAuth, async (req, res) => {
    try {
      const { value } = req.body;
      
      if (!value) {
        return res.status(400).json({ message: "Interval value is required" });
      }
      
      // Validate the value (should be a number between 3000 and 30000)
      const intervalValue = parseInt(value);
      if (isNaN(intervalValue) || intervalValue < 3000 || intervalValue > 30000) {
        return res.status(400).json({ 
          message: "Showcase interval must be between 3 and 30 seconds"
        });
      }
      
      // Check the current setting
      const currentSetting = await storage.getSiteSettingByKey('showcase_interval');
      console.log('Current showcase_interval:', currentSetting?.value);
      
      // Update the setting
      const setting = await storage.updateSiteSetting('showcase_interval', value);
      console.log('Updated showcase_interval to:', setting.value);
      
      res.status(200).json(setting);
      
      // Log success for clarity
      console.log(`User ${req.session.username} (${req.session.userRole}) updated showcase interval to ${setting.value}ms`);
    } catch (error) {
      console.error("Error updating showcase interval:", error);
      res.status(500).json({ message: "Error updating showcase interval" });
    }
  });
  
  // Admin-only site settings
  app.post("/api/site-settings", requireAuth, requireAdmin, async (req, res) => {
    try {
      const { key, value } = req.body;
      
      if (!key) {
        return res.status(400).json({ message: "Key is required" });
      }
      
      // For security, don't allow overriding showcase_interval through this endpoint
      if (key === 'showcase_interval') {
        return res.status(400).json({ 
          message: "Please use the dedicated /api/showcase-interval endpoint"
        });
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
        // Try to send email via Nodemailer (preferred method)
        console.log("Attempting to send email via Nodemailer...");
        const result = await nodeMailerEmail(name, email, message, adminEmail);
        
        if (result) {
          res.status(200).json({ 
            success: true, 
            message: "Your message has been sent successfully! Check the console for the Ethereal email preview link."
          });
        } else {
          // Fallback to SendGrid if Nodemailer fails
          console.log("Nodemailer failed, trying SendGrid as fallback...");
          const sendGridResult = await sendGridEmail(name, email, message, adminEmail);
          
          if (sendGridResult) {
            res.status(200).json({ 
              success: true, 
              message: "Your message has been sent successfully via SendGrid!"
            });
          } else {
            // Both methods failed, log the message as fallback
            console.log("======= CONTACT FORM SUBMISSION (FALLBACK) =======");
            console.log(`From: ${name} (${email})`);
            console.log(`To: ${adminEmail}`);
            console.log(`Message: ${message}`);
            console.log("=======================================");
            
            // For demo purposes, return success even though both email methods failed
            res.status(200).json({ 
              success: true, 
              message: "Your message has been received and logged (both email services failed, but we've saved your message)."
            });
          }
        }
      } catch (emailError) {
        console.error("Error sending email:", emailError);
        
        // Fallback to storing the message in logs for demonstration purposes
        console.log("======= CONTACT FORM SUBMISSION (FALLBACK) =======");
        console.log(`From: ${name} (${email})`);
        console.log(`To: ${adminEmail}`);
        console.log(`Message: ${message}`);
        console.log("==================================================");
        
        // For demo purposes, return success even though email sending failed
        res.status(200).json({ 
          success: true, 
          message: "Your message has been received and logged (email sending failed, but we've saved your message)." 
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
  
  // Favorites endpoints
  
  // Toggle favorite status for an item
  app.post("/api/favorites/toggle/:itemId", requireAuth, async (req, res) => {
    try {
      const itemId = parseInt(req.params.itemId);
      if (isNaN(itemId)) {
        return res.status(400).json({ message: "Invalid item ID" });
      }

      const userId = req.session.userId!;
      const isFavorited = await storage.toggleFavorite(userId, itemId);
      res.json({ isFavorited });
    } catch (error) {
      console.error("Error toggling favorite:", error);
      res.status(500).json({ message: "Failed to toggle favorite status" });
    }
  });
  
  // Check if an item is favorited by the current user
  app.get("/api/favorites/check/:itemId", requireAuth, async (req, res) => {
    try {
      const itemId = parseInt(req.params.itemId);
      if (isNaN(itemId)) {
        return res.status(400).json({ message: "Invalid item ID" });
      }

      const userId = req.session.userId!;
      const isFavorited = await storage.isFavorited(userId, itemId);
      res.json({ isFavorited });
    } catch (error) {
      console.error("Error checking favorite status:", error);
      res.status(500).json({ message: "Failed to check favorite status" });
    }
  });
  
  // Get all favorite items for the current user
  app.get("/api/favorites", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const favorites = await storage.getUserFavorites(userId);
      res.json(favorites);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      res.status(500).json({ message: "Failed to fetch favorites" });
    }
  });

  return createServer(app);
}