import { 
  portfolioItems, type PortfolioItem, type InsertPortfolioItem, 
  users, type User, type InsertUser, 
  shareLinks, type ShareLink, type InsertShareLink, 
  categories, type CategoryModel, type InsertCategory,
  siteSettings, type SiteSetting, type InsertSiteSetting
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sql } from "drizzle-orm";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface IStorage {
  // Portfolio items
  getItems(): Promise<PortfolioItem[]>;
  getItemsPaginated(page: number, pageSize: number): Promise<PaginatedResult<PortfolioItem>>;
  getItem(id: number): Promise<PortfolioItem | undefined>;
  getItemsByCategory(category: string): Promise<PortfolioItem[]>;
  getItemsByCategoryPaginated(category: string, page: number, pageSize: number): Promise<PaginatedResult<PortfolioItem>>;
  createItem(item: InsertPortfolioItem): Promise<PortfolioItem>;
  updateItem(id: number, item: Partial<PortfolioItem>): Promise<PortfolioItem>;
  deleteItem(id: number): Promise<boolean>;
  
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  validateUser(username: string, password: string): Promise<User | null>;
  
  // Share links
  createShareLink(shareLink: InsertShareLink): Promise<ShareLink>;
  getShareLinkByCode(shareCode: string): Promise<ShareLink | undefined>;
  getShareLinksByItemId(itemId: number): Promise<ShareLink[]>;
  deleteShareLink(id: number): Promise<boolean>;
  incrementShareLinkClicks(shareCode: string): Promise<void>;
  
  // Categories
  getCategories(): Promise<CategoryModel[]>;
  getCategory(id: number): Promise<CategoryModel | undefined>;
  getCategoryByName(name: string): Promise<CategoryModel | undefined>;
  createCategory(category: InsertCategory): Promise<CategoryModel>;
  updateCategory(id: number, category: Partial<CategoryModel>): Promise<CategoryModel>;
  deleteCategory(id: number): Promise<boolean>;
  
  // Site Settings
  getSiteSettings(): Promise<SiteSetting[]>;
  getSiteSettingByKey(key: string): Promise<SiteSetting | undefined>;
  createSiteSetting(setting: InsertSiteSetting): Promise<SiteSetting>;
  updateSiteSetting(key: string, value: string): Promise<SiteSetting>;
  deleteSiteSetting(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getItems(): Promise<PortfolioItem[]> {
    return await db.select()
      .from(portfolioItems)
      .orderBy(desc(portfolioItems.createdAt)); // Show most recently created items first
  }
  
  async getItemsPaginated(page: number, pageSize: number): Promise<PaginatedResult<PortfolioItem>> {
    // Ensure valid page and pageSize
    const validPage = Math.max(1, page);
    const validPageSize = Math.max(1, Math.min(100, pageSize)); // Limit max page size to 100
    
    // Calculate offset
    const offset = (validPage - 1) * validPageSize;
    
    // Get total count
    const countResult = await db.select({ count: sql`count(*)` }).from(portfolioItems);
    const total = Number(countResult[0].count);
    
    // Get items for current page
    const items = await db.select()
      .from(portfolioItems)
      .limit(validPageSize)
      .offset(offset)
      .orderBy(desc(portfolioItems.createdAt)); // Latest items first
    
    // Calculate total pages
    const totalPages = Math.ceil(total / validPageSize);
    
    return {
      items,
      total,
      page: validPage,
      pageSize: validPageSize,
      totalPages
    };
  }
  
  async getItemsByCategoryPaginated(category: string, page: number, pageSize: number): Promise<PaginatedResult<PortfolioItem>> {
    // Ensure valid page and pageSize
    const validPage = Math.max(1, page);
    const validPageSize = Math.max(1, Math.min(100, pageSize)); // Limit max page size to 100
    
    // Calculate offset
    const offset = (validPage - 1) * validPageSize;
    
    // Get total count for this category
    const countResult = await db.select({ count: sql`count(*)` })
      .from(portfolioItems)
      .where(eq(portfolioItems.category, category));
    
    const total = Number(countResult[0].count);
    
    // Get items for current page
    const items = await db.select()
      .from(portfolioItems)
      .where(eq(portfolioItems.category, category))
      .limit(validPageSize)
      .offset(offset)
      .orderBy(desc(portfolioItems.createdAt)); // Latest items first
    
    // Calculate total pages
    const totalPages = Math.ceil(total / validPageSize);
    
    return {
      items,
      total,
      page: validPage,
      pageSize: validPageSize,
      totalPages
    };
  }
  
  // Site Settings methods
  async getSiteSettings(): Promise<SiteSetting[]> {
    return await db.select().from(siteSettings);
  }
  
  async getSiteSettingByKey(key: string): Promise<SiteSetting | undefined> {
    const [setting] = await db.select().from(siteSettings).where(eq(siteSettings.key, key));
    return setting;
  }
  
  async createSiteSetting(setting: InsertSiteSetting): Promise<SiteSetting> {
    const [newSetting] = await db.insert(siteSettings).values(setting).returning();
    return newSetting;
  }
  
  async updateSiteSetting(key: string, value: string): Promise<SiteSetting> {
    // Check if setting exists
    const existingSetting = await this.getSiteSettingByKey(key);
    
    if (existingSetting) {
      // Update existing setting
      const [updatedSetting] = await db.update(siteSettings)
        .set({ value, updatedAt: new Date() })
        .where(eq(siteSettings.key, key))
        .returning();
      
      return updatedSetting;
    } else {
      // Create new setting if it doesn't exist
      return await this.createSiteSetting({ key, value });
    }
  }
  
  async deleteSiteSetting(id: number): Promise<boolean> {
    try {
      const deleted = await db.delete(siteSettings)
        .where(eq(siteSettings.id, id))
        .returning();
      
      return deleted.length > 0;
    } catch (error) {
      console.error("Error deleting site setting:", error);
      return false;
    }
  }

  async getItem(id: number): Promise<PortfolioItem | undefined> {
    const [item] = await db.select().from(portfolioItems).where(eq(portfolioItems.id, id));
    return item;
  }

  async getItemsByCategory(category: string): Promise<PortfolioItem[]> {
    return await db.select()
      .from(portfolioItems)
      .where(eq(portfolioItems.category, category))
      .orderBy(desc(portfolioItems.createdAt)); // Show most recently created items first
  }

  async createItem(item: InsertPortfolioItem): Promise<PortfolioItem> {
    const [newItem] = await db.insert(portfolioItems).values(item).returning();
    return newItem;
  }
  
  async deleteItem(id: number): Promise<boolean> {
    try {
      const deleted = await db.delete(portfolioItems)
        .where(eq(portfolioItems.id, id))
        .returning();
      
      return deleted.length > 0;
    } catch (error) {
      console.error("Error deleting item:", error);
      return false;
    }
  }
  
  async updateItem(id: number, itemData: Partial<PortfolioItem>): Promise<PortfolioItem> {
    // Clean up any unwanted properties that shouldn't be updated (like id)
    const { id: _, ...dataToUpdate } = itemData as any;
    
    // Update the item
    const [updatedItem] = await db.update(portfolioItems)
      .set(dataToUpdate)
      .where(eq(portfolioItems.id, id))
      .returning();
    
    return updatedItem;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values({
      ...userData,
      password: await hashPassword(userData.password)
    }).returning();
    return user;
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.getUserByUsername(username);
    if (!user) return null;
    
    const isValidPassword = await comparePasswords(password, user.password);
    if (!isValidPassword) return null;
    
    return user;
  }
  
  // Share links methods
  async createShareLink(shareLink: InsertShareLink): Promise<ShareLink> {
    // Prepare the data to insert with a share code
    const dataToInsert = {
      itemId: shareLink.itemId,
      shareCode: shareLink.shareCode || randomBytes(6).toString('hex'),
      customTitle: shareLink.customTitle,
      customDescription: shareLink.customDescription,
      customImageUrl: shareLink.customImageUrl,
      expiresAt: shareLink.expiresAt
    };
    
    const [newShareLink] = await db.insert(shareLinks)
      .values(dataToInsert)
      .returning();
      
    return newShareLink;
  }
  
  async getShareLinkByCode(shareCode: string): Promise<ShareLink | undefined> {
    const [shareLink] = await db.select()
      .from(shareLinks)
      .where(eq(shareLinks.shareCode, shareCode));
    
    // Check if the link has expired
    if (shareLink && shareLink.expiresAt) {
      const expiryDate = new Date(shareLink.expiresAt);
      if (expiryDate < new Date()) {
        return undefined; // Link has expired
      }
    }
    
    return shareLink;
  }
  
  async getShareLinksByItemId(itemId: number): Promise<ShareLink[]> {
    return await db.select()
      .from(shareLinks)
      .where(eq(shareLinks.itemId, itemId));
  }
  
  async deleteShareLink(id: number): Promise<boolean> {
    try {
      const deleted = await db.delete(shareLinks)
        .where(eq(shareLinks.id, id))
        .returning();
      
      return deleted.length > 0;
    } catch (error) {
      console.error("Error deleting share link:", error);
      return false;
    }
  }
  
  async incrementShareLinkClicks(shareCode: string): Promise<void> {
    const shareLink = await this.getShareLinkByCode(shareCode);
    if (!shareLink) return;
    
    await db.update(shareLinks)
      .set({ clicks: shareLink.clicks + 1 })
      .where(eq(shareLinks.shareCode, shareCode));
  }
  
  // Category methods
  async getCategories(): Promise<CategoryModel[]> {
    return await db.select().from(categories);
  }
  
  async getCategory(id: number): Promise<CategoryModel | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category;
  }
  
  async getCategoryByName(name: string): Promise<CategoryModel | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.name, name));
    return category;
  }
  
  async createCategory(category: InsertCategory): Promise<CategoryModel> {
    // Ensure createdById is set (if not provided, use a default admin ID)
    const categoryWithCreatedBy = {
      ...category,
      createdById: category.createdById || 1, // Default to user ID 1 if not provided
    };
    
    const [newCategory] = await db.insert(categories).values(categoryWithCreatedBy).returning();
    return newCategory;
  }
  
  async updateCategory(id: number, categoryData: Partial<CategoryModel>): Promise<CategoryModel> {
    // Clean up any unwanted properties that shouldn't be updated (like id)
    const { id: _, ...dataToUpdate } = categoryData as any;
    
    // Update the category
    const [updatedCategory] = await db.update(categories)
      .set(dataToUpdate)
      .where(eq(categories.id, id))
      .returning();
    
    return updatedCategory;
  }
  
  async deleteCategory(id: number): Promise<boolean> {
    try {
      const deleted = await db.delete(categories)
        .where(eq(categories.id, id))
        .returning();
      
      return deleted.length > 0;
    } catch (error) {
      console.error("Error deleting category:", error);
      return false;
    }
  }

  async initialize() {
    const items = await this.getItems();
    if (items.length === 0) {
      await db.insert(portfolioItems).values([
        {
          title: "Digital Art Collection #1",
          description: "Unique digital artwork featuring abstract patterns",
          imageUrl: "https://images.unsplash.com/photo-1493723843671-1d655e66ac1c",
          category: "Digital Art",
          marketplaceUrl1: "https://objkt.com/asset/123456",
          marketplaceUrl2: "https://opensea.io/assets/ethereum/123456",
          marketplaceName1: "OBJKT",
          marketplaceName2: "OpenSea"
        },
        {
          title: "NFT Series: Creative Space",
          description: "Part of the creative space collection",
          imageUrl: "https://images.unsplash.com/photo-1472289065668-ce650ac443d2",
          category: "Photography",
          marketplaceUrl1: "https://objkt.com/asset/789012",
          marketplaceUrl2: "https://foundation.app/123456",
          marketplaceName1: "OBJKT",
          marketplaceName2: "Foundation"
        },
        {
          title: "Digital Masterpiece",
          description: "Unique digital creation with modern elements",
          imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40",
          category: "Digital Art",
          marketplaceUrl1: "https://superrare.com/artwork/123456",
          marketplaceUrl2: "https://opensea.io/assets/ethereum/789012",
          marketplaceName1: "SuperRare",
          marketplaceName2: "OpenSea"
        }
      ]);
    }
    
    // Create default admin user if none exists
    const adminExists = await this.getUserByUsername("rokoroko");
    if (!adminExists) {
      await this.createUser({
        username: "rokoroko",
        password: "rokorobot", // This will be hashed before storage
        role: "admin",
        isActive: true
      });
      console.log("Created default admin user: rokoroko / rokorobot");
    }
  }
}

export const storage = new DatabaseStorage();
// Initialize the database with sample data
storage.initialize().catch(console.error);