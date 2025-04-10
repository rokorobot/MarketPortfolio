import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
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

// User roles
export const USER_ROLES = ["admin", "guest"] as const;
export const roleSchema = z.enum(USER_ROLES);
export type Role = z.infer<typeof roleSchema>;

// User table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("guest"),
  isActive: boolean("is_active").notNull().default(true),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;