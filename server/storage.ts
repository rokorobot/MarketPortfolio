import { 
  portfolioItems, type PortfolioItem, type InsertPortfolioItem, 
  users, type User, type InsertUser, 
  shareLinks, type ShareLink, type InsertShareLink, 
  categories, type CategoryModel, type InsertCategory,
  siteSettings, type SiteSetting, type InsertSiteSetting,
  favorites, type Favorite, type InsertFavorite,
  itemCollectors, type ItemCollector, type InsertItemCollector
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, asc, sql, isNotNull, ne } from "drizzle-orm";
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
  getItems(userId?: number, userRole?: string): Promise<PortfolioItem[]>;
  getItemsPaginated(page: number, pageSize: number, userId?: number, userRole?: string): Promise<PaginatedResult<PortfolioItem>>;
  getItem(id: number): Promise<PortfolioItem | undefined>;
  getItemsByCategory(category: string): Promise<PortfolioItem[]>;
  getItemsByCategoryPaginated(category: string, page: number, pageSize: number, userId?: number, userRole?: string): Promise<PaginatedResult<PortfolioItem>>;
  getUniqueAuthors(): Promise<{name: string, count: number, profileImage: string | null}[]>;
  getItemsByAuthor(authorName: string, userId?: number, userRole?: string): Promise<PortfolioItem[]>;
  getItemsByExternalId(externalId: string, userId?: number): Promise<PortfolioItem[]>;
  createItem(item: InsertPortfolioItem, userId?: number): Promise<PortfolioItem>;
  updateItem(id: number, item: Partial<PortfolioItem>): Promise<PortfolioItem>;
  deleteItem(id: number): Promise<boolean>;
  updateItemsOrder(items: {id: number, displayOrder: number}[]): Promise<boolean>;
  
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByVerificationToken(token: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<User>): Promise<User>;
  validateUser(username: string, password: string): Promise<User | null>;
  resendVerificationEmail(userId: number): Promise<boolean>;
  
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
  updateCategoriesOrder(categories: {id: number, displayOrder: number}[]): Promise<boolean>;
  
  // Site Settings
  getSiteSettings(): Promise<SiteSetting[]>;
  getSiteSettingByKey(key: string): Promise<SiteSetting | undefined>;
  createSiteSetting(setting: InsertSiteSetting): Promise<SiteSetting>;
  updateSiteSetting(key: string, value: string): Promise<SiteSetting>;
  deleteSiteSetting(id: number): Promise<boolean>;
  
  // Favorites
  toggleFavorite(userId: number, itemId: number): Promise<boolean>;
  isFavorited(userId: number, itemId: number): Promise<boolean>;
  getUserFavorites(userId: number): Promise<PortfolioItem[]>;
  updateFavoritesOrder(userId: number, items: {id: number, displayOrder: number}[]): Promise<boolean>;
  
  // Item collectors
  assignCollectorToItem(itemId: number, collectorId: number): Promise<boolean>;
  removeCollectorFromItem(itemId: number, collectorId: number): Promise<boolean>;
  getItemCollectors(itemId: number): Promise<User[]>;
  getCollectorItems(collectorId: number): Promise<PortfolioItem[]>;
  
  // Author profile management
  updateAuthorProfileImage(authorName: string, profileImage: string | null): Promise<boolean>;
  updateAuthorName(oldName: string, newName: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  /**
   * Get items by external ID (used for NFT imports)
   * @param externalId - The external ID of the item
   * @param userId - Optional user ID to filter by
   * @returns Promise with portfolio items
   */
  async getItemsByExternalId(externalId: string, userId?: number): Promise<PortfolioItem[]> {
    try {
      if (userId) {
        // If userId is provided, filter by both externalId and userId
        const items = await db.select()
          .from(portfolioItems)
          .where(
            and(
              eq(portfolioItems.externalId, externalId),
              eq(portfolioItems.userId, userId)
            )
          );
        return items;
      } else {
        // Otherwise just filter by externalId
        const items = await db.select()
          .from(portfolioItems)
          .where(eq(portfolioItems.externalId, externalId));
        return items;
      }
    } catch (error) {
      console.error("Error fetching items by external ID:", error);
      return [];
    }
  }
  /**
   * Get all items - if userId is provided, only returns items associated with that user
   * Admin users can see all items
   */
  async getItems(userId?: number, userRole?: string): Promise<PortfolioItem[]> {
    // If admin user or no user ID specified, return all items
    if (userRole === 'admin' || !userId) {
      return await db.select()
        .from(portfolioItems)
        .orderBy(portfolioItems.displayOrder);
    }
    
    // Check if the user is a creator or collector
    if (userRole === 'creator' || userRole === 'collector') {
      // For creators and collectors, find:
      // 1. Items where the user is the creator (userId matches)
      // 2. Items where the user is a collector (via itemCollectors table)
      
      // First get items created by this user
      const createdItems = await db.select()
        .from(portfolioItems)
        .where(eq(portfolioItems.userId, userId));
      
      // Then get items where the user is a collector
      const collectedItems = await db.select({
        item: portfolioItems
      })
      .from(itemCollectors)
      .innerJoin(portfolioItems, eq(itemCollectors.itemId, portfolioItems.id))
      .where(eq(itemCollectors.collectorId, userId));
      
      // Combine both sets, removing duplicates by ID
      const itemMap = new Map();
      
      // Add created items to the map
      createdItems.forEach(item => {
        itemMap.set(item.id, item);
      });
      
      // Add collected items to the map (will overwrite any duplicates)
      collectedItems.forEach(result => {
        itemMap.set(result.item.id, result.item);
      });
      
      // Convert the map back to an array and sort by display order
      return Array.from(itemMap.values())
        .sort((a, b) => a.displayOrder - b.displayOrder);
    }
    
    // For other user roles, return only items associated with this user as creator
    return await db.select()
      .from(portfolioItems)
      .where(eq(portfolioItems.userId, userId))
      .orderBy(portfolioItems.displayOrder);
  }
  
  /**
   * Get items with pagination - if userId is provided, only returns items associated with that user
   * Admin users can see all items
   */
  async getItemsPaginated(page: number, pageSize: number, userId?: number, userRole?: string): Promise<PaginatedResult<PortfolioItem>> {
    // Ensure valid page and pageSize
    const validPage = Math.max(1, page);
    const validPageSize = Math.max(1, Math.min(100, pageSize)); // Limit max page size to 100
    
    // Calculate offset
    const offset = (validPage - 1) * validPageSize;
    
    // Get total count
    let countResult;
    let items;
    
    // If admin user or no user ID specified, query all items
    if (userRole === 'admin' || !userId) {
      countResult = await db.select({ count: sql`count(*)` }).from(portfolioItems);
      
      items = await db.select()
        .from(portfolioItems)
        .limit(validPageSize)
        .offset(offset)
        .orderBy(portfolioItems.displayOrder);
    } else {
      // Otherwise, query only user's items
      countResult = await db.select({ count: sql`count(*)` })
        .from(portfolioItems)
        .where(eq(portfolioItems.userId, userId));
      
      items = await db.select()
        .from(portfolioItems)
        .where(eq(portfolioItems.userId, userId))
        .limit(validPageSize)
        .offset(offset)
        .orderBy(portfolioItems.displayOrder);
    }
    
    const total = Number(countResult[0].count);
    const totalPages = Math.ceil(total / validPageSize);
    
    return {
      items,
      total,
      page: validPage,
      pageSize: validPageSize,
      totalPages
    };
  }
  
  async getItemsByCategoryPaginated(category: string, page: number, pageSize: number, userId?: number, userRole?: string): Promise<PaginatedResult<PortfolioItem>> {
    // Ensure valid page and pageSize
    const validPage = Math.max(1, page);
    const validPageSize = Math.max(1, Math.min(100, pageSize)); // Limit max page size to 100
    
    // Calculate offset
    const offset = (validPage - 1) * validPageSize;
    
    // Get total count for this category
    let countResult;
    let items;
    
    // If admin user or no user ID specified, query all items in the category
    if (userRole === 'admin' || !userId) {
      countResult = await db.select({ count: sql`count(*)` })
        .from(portfolioItems)
        .where(eq(portfolioItems.category, category));
      
      items = await db.select()
        .from(portfolioItems)
        .where(eq(portfolioItems.category, category))
        .limit(validPageSize)
        .offset(offset)
        .orderBy(portfolioItems.displayOrder);
    } else {
      // Otherwise, query only user's items in the category
      countResult = await db.select({ count: sql`count(*)` })
        .from(portfolioItems)
        .where(
          and(
            eq(portfolioItems.category, category),
            eq(portfolioItems.userId, userId)
          )
        );
      
      items = await db.select()
        .from(portfolioItems)
        .where(
          and(
            eq(portfolioItems.category, category),
            eq(portfolioItems.userId, userId)
          )
        )
        .limit(validPageSize)
        .offset(offset)
        .orderBy(portfolioItems.displayOrder);
    }
    
    const total = Number(countResult[0].count);
    
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
    // Ensure id is a valid number
    if (isNaN(id) || id <= 0) {
      return undefined;
    }
    
    const [item] = await db.select().from(portfolioItems).where(eq(portfolioItems.id, id));
    return item;
  }

  async getItemsByCategory(category: string): Promise<PortfolioItem[]> {
    return await db.select()
      .from(portfolioItems)
      .where(eq(portfolioItems.category, category))
      .orderBy(portfolioItems.displayOrder); // Order by display order
  }
  
  async getUniqueAuthors(): Promise<{name: string, count: number, profileImage: string | null}[]> {
    // First, get all non-null, non-empty authors and count their items
    const authorsWithCounts = await db.select({
      name: portfolioItems.author,
      count: sql<number>`count(*)::int`
    })
    .from(portfolioItems)
    .where(
      and(
        isNotNull(portfolioItems.author),
        ne(portfolioItems.author, '')
      )
    )
    .groupBy(portfolioItems.author)
    .orderBy(portfolioItems.author);
    
    // Filter out any null authors
    const filteredAuthors = authorsWithCounts.filter(author => author.name !== null);
    
    // For each author, find the first item with a profile image
    const authorsWithImages = await Promise.all(
      filteredAuthors.map(async (author) => {
        const [firstItemWithImage] = await db.select({
          profileImage: portfolioItems.authorProfileImage
        })
        .from(portfolioItems)
        .where(
          and(
            eq(portfolioItems.author, author.name as string),
            isNotNull(portfolioItems.authorProfileImage)
          )
        )
        .limit(1);
        
        return {
          name: author.name as string,
          count: author.count,
          profileImage: firstItemWithImage?.profileImage || null
        };
      })
    );
    
    return authorsWithImages;
  }
  
  async getItemsByAuthor(authorName: string, userId?: number, userRole?: string): Promise<PortfolioItem[]> {
    // If admin user or no user ID specified, return all items by this author
    if (userRole === 'admin' || !userId) {
      return await db.select()
        .from(portfolioItems)
        .where(eq(portfolioItems.author, authorName))
        .orderBy(portfolioItems.displayOrder);
    }
    
    // Otherwise, return only items by this author that belong to the current user
    return await db.select()
      .from(portfolioItems)
      .where(
        and(
          eq(portfolioItems.author, authorName),
          eq(portfolioItems.userId, userId)
        )
      )
      .orderBy(portfolioItems.displayOrder);
  }

  async createItem(item: InsertPortfolioItem, userId?: number): Promise<PortfolioItem> {
    // Include the userId in the item data if provided
    const itemData = userId ? { ...item, userId } : item;
    
    const [newItem] = await db.insert(portfolioItems).values(itemData).returning();
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
    // Ensure id is a valid number
    if (isNaN(id) || id <= 0) {
      return undefined;
    }
    
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }
  
  async getUserByVerificationToken(token: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.verificationToken, token));
    return user;
  }
  
  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    // Clean up any unwanted properties that shouldn't be updated (like id)
    const { id: _, ...dataToUpdate } = userData as any;
    
    // Update the user
    const [updatedUser] = await db.update(users)
      .set({
        ...dataToUpdate,
        updatedAt: new Date()
      })
      .where(eq(users.id, id))
      .returning();
    
    return updatedUser;
  }
  
  async resendVerificationEmail(userId: number): Promise<boolean> {
    const user = await this.getUser(userId);
    if (!user || user.isEmailVerified) {
      return false;
    }
    
    // Generate a new verification token
    const verificationToken = randomBytes(32).toString('hex');
    
    // Update the user with the new token
    await this.updateUser(userId, { verificationToken });
    
    // The actual email sending will be handled by the controller
    return true;
  }

  async createUser(userData: InsertUser): Promise<User> {
    // If password is not already hashed, hash it
    let passwordToStore = userData.password;
    if (!passwordToStore.includes('.')) {
      passwordToStore = await hashPassword(passwordToStore);
    }
    
    const [user] = await db.insert(users).values({
      ...userData,
      password: passwordToStore
    }).returning();
    return user;
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    console.log(`Validating user ${username} with password of length ${password.length}`);
    const user = await this.getUserByUsername(username);
    console.log(`User lookup result: ${user ? 'Found user with ID ' + user.id : 'No user found'}`);
    
    if (!user) return null;
    
    try {
      console.log(`Comparing passwords for user ${username}`);
      
      // Special case for temporary password during development
      if (user.password === 'temp_password_hash' && password === 'password') {
        console.log(`Using temporary password for ${username} during development`);
        
        // Update user password with proper hash format for future logins
        const hashedPassword = await hashPassword(password);
        await this.updateUser(user.id, { password: hashedPassword });
        console.log(`Updated password format for user ${username}`);
        
        return user;
      }
      
      // Regular password comparison
      if (user.password.includes('.')) {
        const isValidPassword = await comparePasswords(password, user.password);
        console.log(`Password validation result for ${username}: ${isValidPassword ? 'Valid' : 'Invalid'}`);
        
        if (!isValidPassword) return null;
      } else {
        console.log(`Password format invalid for ${username}`);
        return null;
      }
      
      return user;
    } catch (error) {
      console.error(`Error comparing passwords for user ${username}:`, error);
      return null;
    }
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
    // Ensure id is a valid number
    if (isNaN(id) || id <= 0) {
      return undefined;
    }
    
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
  
  /**
   * Update the display order of multiple categories
   * @param categories - Array of category IDs and their new display order
   * @returns Promise with boolean success status
   */
  async updateCategoriesOrder(categoriesOrder: {id: number, displayOrder: number}[]): Promise<boolean> {
    try {
      // Use a transaction to ensure all updates succeed or fail together
      await db.transaction(async (tx) => {
        for (const cat of categoriesOrder) {
          await tx.update(categories)
            .set({ displayOrder: cat.displayOrder })
            .where(eq(categories.id, cat.id));
        }
      });
      
      return true;
    } catch (error) {
      console.error("Error updating categories order:", error);
      return false;
    }
  }

  // Favorites methods
  async toggleFavorite(userId: number, itemId: number): Promise<boolean> {
    try {
      // Check if already favorited
      const isFavorite = await this.isFavorited(userId, itemId);
      
      if (isFavorite) {
        // Remove from favorites
        await db.delete(favorites)
          .where(and(
            eq(favorites.userId, userId),
            eq(favorites.itemId, itemId)
          ));
        return false; // No longer favorited
      } else {
        // Add to favorites
        await db.insert(favorites)
          .values({
            userId,
            itemId,
          });
        return true; // Now favorited
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      return false;
    }
  }
  
  async isFavorited(userId: number, itemId: number): Promise<boolean> {
    const [favorite] = await db.select()
      .from(favorites)
      .where(and(
        eq(favorites.userId, userId),
        eq(favorites.itemId, itemId)
      ));
    
    return !!favorite;
  }
  
  async getUserFavorites(userId: number): Promise<PortfolioItem[]> {
    // Join favorites and portfolio items to get all favorited items
    const items = await db.select()
      .from(portfolioItems)
      .innerJoin(favorites, eq(portfolioItems.id, favorites.itemId))
      .where(eq(favorites.userId, userId))
      .orderBy(portfolioItems.displayOrder);
    
    // Map to PortfolioItem format
    return items.map(item => item.portfolio_items);
  }
  
  /**
   * Update the display order of portfolio items that are in a user's favorites
   * 
   * Note: This is currently unused as we're using the regular updateItemsOrder method
   * for both regular items and favorites
   * 
   * @param userId - The ID of the user whose favorites are being reordered
   * @param items - Array of item IDs and their new display order values
   * @returns Promise with boolean success status
   */
  async updateFavoritesOrder(userId: number, items: { id: number, displayOrder: number }[]): Promise<boolean> {
    if (!items || items.length === 0) {
      return false;
    }

    try {
      // First, check that all items are actually favorited by this user
      for (const item of items) {
        const isFavorited = await this.isFavorited(userId, item.id);
        if (!isFavorited) {
          console.warn(`Item ${item.id} is not in user ${userId}'s favorites, skipping`);
          continue;
        }
        
        // Update the display order for this item
        await db.update(portfolioItems)
          .set({ displayOrder: item.displayOrder })
          .where(eq(portfolioItems.id, item.id));
      }
      
      return true;
    } catch (error) {
      console.error("Error updating favorites order:", error);
      throw error;
    }
  }
  
  async updateAuthorProfileImage(authorName: string, profileImage: string | null): Promise<boolean> {
    try {
      // Update all items with this author name to have the same profile image
      await db.update(portfolioItems)
        .set({ authorProfileImage: profileImage })
        .where(eq(portfolioItems.author, authorName));
      
      return true;
    } catch (error) {
      console.error("Error updating author profile image:", error);
      return false;
    }
  }
  
  /**
   * Update an author's name across all portfolio items
   * @param oldName - The current name of the author
   * @param newName - The new name to give the author
   * @returns Promise with boolean success status
   */
  async updateAuthorName(oldName: string, newName: string): Promise<boolean> {
    try {
      if (!oldName || !newName) {
        throw new Error('Both old and new author names are required');
      }
      
      // Get the existing author profile image to maintain it during the name change
      const items = await db.select({ authorProfileImage: portfolioItems.authorProfileImage })
        .from(portfolioItems)
        .where(eq(portfolioItems.author, oldName))
        .limit(1);
      
      const profileImage = items.length > 0 ? items[0].authorProfileImage : null;
      
      // Update all items with this author name
      await db.update(portfolioItems)
        .set({ 
          author: newName, 
          // Keep the same profile image
          authorProfileImage: profileImage 
        })
        .where(eq(portfolioItems.author, oldName));
      
      console.log(`Updated author name from "${oldName}" to "${newName}" with profile image: ${profileImage}`);
      return true;
    } catch (error) {
      console.error('Error updating author name:', error);
      return false;
    }
  }
  
  async updateItemsOrder(items: {id: number, displayOrder: number}[]): Promise<boolean> {
    try {
      // Use a transaction to ensure all updates succeed or fail together
      await db.transaction(async (tx) => {
        for (const item of items) {
          await tx.update(portfolioItems)
            .set({ displayOrder: item.displayOrder })
            .where(eq(portfolioItems.id, item.id));
        }
      });
      
      return true;
    } catch (error) {
      console.error("Error updating items order:", error);
      return false;
    }
  }
  
  // Item collectors methods
  async assignCollectorToItem(itemId: number, collectorId: number): Promise<boolean> {
    try {
      // Check if the relationship already exists
      const existing = await db.select()
        .from(itemCollectors)
        .where(
          and(
            eq(itemCollectors.itemId, itemId),
            eq(itemCollectors.collectorId, collectorId)
          )
        );
      
      // If relationship doesn't exist, create it
      if (existing.length === 0) {
        await db.insert(itemCollectors)
          .values({ itemId, collectorId })
          .returning();
      }
      
      return true;
    } catch (error) {
      console.error("Error assigning collector to item:", error);
      return false;
    }
  }
  
  async removeCollectorFromItem(itemId: number, collectorId: number): Promise<boolean> {
    try {
      await db.delete(itemCollectors)
        .where(
          and(
            eq(itemCollectors.itemId, itemId),
            eq(itemCollectors.collectorId, collectorId)
          )
        );
      
      return true;
    } catch (error) {
      console.error("Error removing collector from item:", error);
      return false;
    }
  }
  
  async getItemCollectors(itemId: number): Promise<User[]> {
    try {
      const result = await db.select({
        user: users
      })
      .from(itemCollectors)
      .innerJoin(users, eq(itemCollectors.collectorId, users.id))
      .where(eq(itemCollectors.itemId, itemId));
      
      return result.map(r => r.user);
    } catch (error) {
      console.error("Error getting item collectors:", error);
      return [];
    }
  }
  
  async getCollectorItems(collectorId: number): Promise<PortfolioItem[]> {
    try {
      const result = await db.select({
        item: portfolioItems
      })
      .from(itemCollectors)
      .innerJoin(portfolioItems, eq(itemCollectors.itemId, portfolioItems.id))
      .where(eq(itemCollectors.collectorId, collectorId))
      .orderBy(portfolioItems.displayOrder);
      
      return result.map(r => r.item);
    } catch (error) {
      console.error("Error getting collector items:", error);
      return [];
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
          marketplaceName2: "OpenSea",
          displayOrder: 0
        },
        {
          title: "NFT Series: Creative Space",
          description: "Part of the creative space collection",
          imageUrl: "https://images.unsplash.com/photo-1472289065668-ce650ac443d2",
          category: "Photography",
          marketplaceUrl1: "https://objkt.com/asset/789012",
          marketplaceUrl2: "https://foundation.app/123456",
          marketplaceName1: "OBJKT",
          marketplaceName2: "Foundation",
          displayOrder: 1
        },
        {
          title: "Digital Masterpiece",
          description: "Unique digital creation with modern elements",
          imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40",
          category: "Digital Art",
          marketplaceUrl1: "https://superrare.com/artwork/123456",
          marketplaceUrl2: "https://opensea.io/assets/ethereum/789012",
          marketplaceName1: "SuperRare",
          marketplaceName2: "OpenSea",
          displayOrder: 2
        }
      ]);
    }
    
    // Create default admin user if none exists
    const adminExists = await this.getUserByUsername("creator");
    if (!adminExists) {
      await this.createUser({
        username: "creator",
        password: "creator123", // This will be hashed before storage
        email: "admin@portfolio.com",
        displayName: "Admin Creator",
        role: "admin",
        isEmailVerified: true,
        isActive: true
      });
      console.log("Created default creator account (admin role)");
    }
    
    // Create default visitor user if none exists
    const visitorExists = await this.getUserByUsername("visitor");
    if (!visitorExists) {
      await this.createUser({
        username: "visitor",
        password: "visitor123", // This will be hashed before storage
        email: "visitor@portfolio.com",
        displayName: "Guest Visitor",
        role: "visitor",
        isEmailVerified: true,
        isActive: true
      });
      console.log("Created default visitor account (visitor role)");
    }
  }
}

import { migrateDatabase } from "./migration";

export const storage = new DatabaseStorage();

// Run migration first, then initialize the database with sample data
async function setupDatabase() {
  try {
    // First run migration to ensure database schema is up to date
    await migrateDatabase();
    
    // Then initialize with sample data
    await storage.initialize();
  } catch (error) {
    console.error("Database setup failed:", error);
  }
}

// Run the setup
setupDatabase().catch(console.error);