import { portfolioItems, type PortfolioItem, type InsertPortfolioItem } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getItems(): Promise<PortfolioItem[]>;
  getItem(id: number): Promise<PortfolioItem | undefined>;
  getItemsByCategory(category: string): Promise<PortfolioItem[]>;
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

  // Initialize with sample data
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
  }
}

export const storage = new DatabaseStorage();
// Initialize the database with sample data
storage.initialize().catch(console.error);