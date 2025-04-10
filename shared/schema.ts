import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const portfolioItems = pgTable("portfolio_items", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  category: text("category").notNull(),
  tags: text("tags").array(),
  marketplaceUrl1: text("marketplace_url1"),
  marketplaceUrl2: text("marketplace_url2"),
  marketplaceName1: text("marketplace_name1"),
  marketplaceName2: text("marketplace_name2"),
});

export const insertPortfolioItemSchema = createInsertSchema(portfolioItems).omit({
  id: true,
});

export type InsertPortfolioItem = z.infer<typeof insertPortfolioItemSchema>;
export type PortfolioItem = typeof portfolioItems.$inferSelect;

// Predefined categories for consistency
export const PORTFOLIO_CATEGORIES = [
  "Digital Art",
  "Photography",
  "3D Models",
  "Music",
  "Collectibles",
  "Gaming Assets",
] as const;

export const categorySchema = z.enum(PORTFOLIO_CATEGORIES);
export type Category = z.infer<typeof categorySchema>;