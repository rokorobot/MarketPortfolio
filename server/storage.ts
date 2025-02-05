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
          title: "Professional Workspace",
          description: "Modern office setup featuring minimalist design",
          imageUrl: "https://images.unsplash.com/photo-1493723843671-1d655e66ac1c",
          amazonUrl: "https://amazon.com/sample",
          etsyUrl: "https://etsy.com/sample"
        },
        {
          title: "Creative Workspace",
          description: "Artistic workspace with natural lighting",
          imageUrl: "https://images.unsplash.com/photo-1472289065668-ce650ac443d2",
          amazonUrl: "https://amazon.com/sample2",
          etsyUrl: "https://etsy.com/sample2"
        },
        {
          title: "Business Meeting",
          description: "Corporate meeting space with modern amenities",
          imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40",
          amazonUrl: "https://amazon.com/sample3",
          etsyUrl: "https://etsy.com/sample3"
        }
      ]);
    }
  }
}

export const storage = new DatabaseStorage();
// Initialize the database with sample data
storage.initialize().catch(console.error);