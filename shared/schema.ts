import { pgTable, text, serial, integer, boolean, timestamp, primaryKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const portfolioItems = pgTable("portfolio_items", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  author: text("author"),
  authorUrl: text("author_url"),
  authorProfileImage: text("author_profile_image"),
  imageUrl: text("image_url").notNull(),
  category: text("category").notNull(),
  tags: text("tags").array(),
  marketplaceUrl1: text("marketplace_url1"),
  marketplaceUrl2: text("marketplace_url2"),
  marketplaceName1: text("marketplace_name1"),
  marketplaceName2: text("marketplace_name2"),
  displayOrder: integer("display_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  // NFT-specific fields
  externalId: text("external_id"),  // For tracking external NFT IDs (contract+tokenId)
  externalSource: text("external_source"), // Source of the NFT (tezos, ethereum, etc)
  externalMetadata: text("external_metadata"), // JSON string with raw metadata
  // Marketplace-specific fields
  marketplaceUrl: text("marketplace_url"), // Simplified single marketplace URL
  marketplaceName: text("marketplace_name"), // Simplified single marketplace name
  price: text("price"), // Price as string to handle various formats
  currency: text("currency"), // Currency code (XTZ, ETH, etc)
  isSold: boolean("is_sold").default(false), // Whether the NFT has been sold
  dateCreated: timestamp("date_created"), // Date the NFT was created
  status: text("status").default("draft"), // Status (draft, published, archived)
  // Add user ID to track who added this item
  userId: integer("user_id").references(() => users.id, { onDelete: 'set null' }),
});

export const insertPortfolioItemSchema = createInsertSchema(portfolioItems).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertPortfolioItem = z.infer<typeof insertPortfolioItemSchema>;
export type PortfolioItem = typeof portfolioItems.$inferSelect;

// No predefined categories, dynamic from database only
export const PORTFOLIO_CATEGORIES: string[] = [];

// Using a simple string type for categories now
export const categorySchema = z.string();
export type CategoryEnum = string; // Changed from enum to string type

// User roles
export const USER_ROLES = ["admin", "creator", "collector", "visitor"] as const;
export const roleSchema = z.enum(USER_ROLES);
export type Role = z.infer<typeof roleSchema>;

// User types - used for signup process
export const USER_TYPES = ["creator_collector", "visitor"] as const;
export const userTypeSchema = z.enum(USER_TYPES);
export type UserType = z.infer<typeof userTypeSchema>;

// User table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("visitor"),
  email: text("email").notNull().unique(),
  displayName: text("display_name"),
  bio: text("bio"),
  profileImage: text("profile_image"),
  tezosWalletAddress: text("tezos_wallet_address"),
  ethereumWalletAddress: text("ethereum_wallet_address"),
  website: text("website"),
  twitter: text("twitter"),
  instagram: text("instagram"),
  isEmailVerified: boolean("is_email_verified").notNull().default(false),
  verificationToken: text("verification_token"),
  resetPasswordToken: text("reset_password_token"),
  resetPasswordExpires: timestamp("reset_password_expires"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
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
  imageUrl: text("image_url"),
  displayOrder: integer("display_order").default(0),
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

// Favorites table - junction table between users and portfolio items
export const favorites = pgTable("favorites", {
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  itemId: integer("item_id").notNull().references(() => portfolioItems.id, { onDelete: 'cascade' }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.userId, table.itemId] })
  };
});

export const insertFavoriteSchema = createInsertSchema(favorites).omit({
  createdAt: true,
});

export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;
export type Favorite = typeof favorites.$inferSelect;

// Item collectors table - to track which collectors are associated with which items
export const itemCollectors = pgTable("item_collectors", {
  itemId: integer("item_id").notNull().references(() => portfolioItems.id, { onDelete: 'cascade' }),
  collectorId: integer("collector_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.itemId, table.collectorId] })
  };
});

export const insertItemCollectorSchema = createInsertSchema(itemCollectors).omit({
  createdAt: true,
});

export type InsertItemCollector = z.infer<typeof insertItemCollectorSchema>;
export type ItemCollector = typeof itemCollectors.$inferSelect;