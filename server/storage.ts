import { portfolioItems, type PortfolioItem, type InsertPortfolioItem } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getItems(): Promise<PortfolioItem[]>;
  getItem(id: number): Promise<PortfolioItem | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getItems(): Promise<PortfolioItem[]> {
    return await db.select().from(portfolioItems);
  }

  async getItem(id: number): Promise<PortfolioItem | undefined> {
    const [item] = await db.select().from(portfolioItems).where(eq(portfolioItems.id, id));
    return item;
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
          objktUrl: "https://objkt.com/sample1",
          openSeaUrl: "https://opensea.io/sample1"
        },
        {
          title: "NFT Series: Creative Space",
          description: "Part of the creative space collection",
          imageUrl: "https://images.unsplash.com/photo-1472289065668-ce650ac443d2",
          objktUrl: "https://objkt.com/sample2",
          openSeaUrl: "https://opensea.io/sample2"
        },
        {
          title: "Digital Masterpiece",
          description: "Unique digital creation with modern elements",
          imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40",
          objktUrl: "https://objkt.com/sample3",
          openSeaUrl: "https://opensea.io/sample3"
        }
      ]);
    }
  }
}

export const storage = new DatabaseStorage();
// Initialize the database with sample data
storage.initialize().catch(console.error);