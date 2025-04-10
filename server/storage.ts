import { portfolioItems, type PortfolioItem, type InsertPortfolioItem, users, type User, type InsertUser, shareLinks, type ShareLink, type InsertShareLink } from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";
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

export interface IStorage {
  // Portfolio items
  getItems(): Promise<PortfolioItem[]>;
  getItem(id: number): Promise<PortfolioItem | undefined>;
  getItemsByCategory(category: string): Promise<PortfolioItem[]>;
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
}

export class DatabaseStorage implements IStorage {
  async getItems(): Promise<PortfolioItem[]> {
    return await db.select().from(portfolioItems);
  }

  async getItem(id: number): Promise<PortfolioItem | undefined> {
    const [item] = await db.select().from(portfolioItems).where(eq(portfolioItems.id, id));
    return item;
  }

  async getItemsByCategory(category: string): Promise<PortfolioItem[]> {
    return await db.select().from(portfolioItems).where(eq(portfolioItems.category, category));
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