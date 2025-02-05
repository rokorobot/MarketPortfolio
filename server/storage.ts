import { portfolioItems, type PortfolioItem, type InsertPortfolioItem } from "@shared/schema";

export interface IStorage {
  getItems(): Promise<PortfolioItem[]>;
  getItem(id: number): Promise<PortfolioItem | undefined>;
}

export class MemStorage implements IStorage {
  private items: Map<number, PortfolioItem>;

  constructor() {
    this.items = new Map([
      [1, {
        id: 1,
        title: "Professional Workspace",
        description: "Modern office setup featuring minimalist design",
        imageUrl: "https://images.unsplash.com/photo-1493723843671-1d655e66ac1c",
        amazonUrl: "https://amazon.com/sample",
        etsyUrl: "https://etsy.com/sample"
      }],
      [2, {
        id: 2,
        title: "Creative Workspace",
        description: "Artistic workspace with natural lighting",
        imageUrl: "https://images.unsplash.com/photo-1472289065668-ce650ac443d2",
        amazonUrl: "https://amazon.com/sample2",
        etsyUrl: "https://etsy.com/sample2"
      }],
      [3, {
        id: 3,
        title: "Business Meeting",
        description: "Corporate meeting space with modern amenities",
        imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40",
        amazonUrl: "https://amazon.com/sample3",
        etsyUrl: "https://etsy.com/sample3"
      }],
      [4, {
        id: 4,
        title: "Tech Setup",
        description: "Modern technology workspace",
        imageUrl: "https://images.unsplash.com/photo-1483058712412-4245e9b90334",
        amazonUrl: "https://amazon.com/sample4",
        etsyUrl: "https://etsy.com/sample4"
      }],
      [5, {
        id: 5,
        title: "Motivation",
        description: "Inspirational workspace decor",
        imageUrl: "https://images.unsplash.com/photo-1504805572947-34fad45aed93",
        amazonUrl: "https://amazon.com/sample5",
        etsyUrl: "https://etsy.com/sample5"
      }],
      [6, {
        id: 6,
        title: "Studio Space",
        description: "Professional photography studio",
        imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173",
        amazonUrl: "https://amazon.com/sample6",
        etsyUrl: "https://etsy.com/sample6"
      }],
      [7, {
        id: 7,
        title: "Desk Setup",
        description: "Minimal desk arrangement",
        imageUrl: "https://images.unsplash.com/photo-1453928582365-b6ad33cbcf64",
        amazonUrl: "https://amazon.com/sample7",
        etsyUrl: "https://etsy.com/sample7"
      }],
      [8, {
        id: 8,
        title: "Creative Corner",
        description: "Artistic workspace corner",
        imageUrl: "https://images.unsplash.com/photo-1497005367839-6e852de72767",
        amazonUrl: "https://amazon.com/sample8",
        etsyUrl: "https://etsy.com/sample8"
      }]
    ]);
  }

  async getItems(): Promise<PortfolioItem[]> {
    return Array.from(this.items.values());
  }

  async getItem(id: number): Promise<PortfolioItem | undefined> {
    return this.items.get(id);
  }
}

export const storage = new MemStorage();
