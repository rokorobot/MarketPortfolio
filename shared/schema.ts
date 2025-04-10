import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
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
export type CategoryEnum = z.infer<typeof categorySchema>;

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

// Share links table
export const shareLinks = pgTable("share_links", {
  id: serial("id").primaryKey(),
  itemId: integer("item_id").notNull(),
  shareCode: text("share_code").notNull().unique(),
  customTitle: text("custom_title"),
  customDescription: text("custom_description"),
  customImageUrl: text("custom_image_url"),
  createdAt: text("created_at").notNull().default(new Date().toISOString()),
  expiresAt: text("expires_at"),
  clicks: integer("clicks").notNull().default(0),
});

export const insertShareLinkSchema = createInsertSchema(shareLinks).omit({
  id: true,
  createdAt: true,
  clicks: true,
})
.extend({
  // Make shareCode optional since we will generate it on the server if not provided
  shareCode: z.string().optional(),
});

export type InsertShareLink = z.infer<typeof insertShareLinkSchema>;
export type ShareLink = typeof shareLinks.$inferSelect;

// Categories table
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  createdById: integer("created_by_id").notNull(),
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
  createdAt: true,
}).extend({
  createdById: z.number().optional(), // Make optional for client-side usage, server will set it
});

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type CategoryModel = typeof categories.$inferSelect;

// Site Settings table
export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertSiteSettingSchema = createInsertSchema(siteSettings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertSiteSetting = z.infer<typeof insertSiteSettingSchema>;
export type SiteSetting = typeof siteSettings.$inferSelect;