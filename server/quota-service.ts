import { db } from "./db";
import { users, portfolioItems } from "@shared/schema";
import { eq, sum, count } from "drizzle-orm";

export interface UserQuotaInfo {
  userId: number;
  username: string;
  subscriptionType: string;
  maxItems: number | null;
  maxStorageMB: number | null;
  currentItems: number;
  currentStorageUsedMB: number;
  itemsRemaining: number | null;
  storageRemainingMB: number | null;
  isAtItemLimit: boolean;
  isAtStorageLimit: boolean;
  canUpload: boolean;
}

export interface QuotaLimits {
  freeMaxItems: number;
  freeMaxStorageMB: number;
  creatorMaxItems: number;
  creatorMaxStorageMB: number;
  collectorMaxItems: number;
  collectorMaxStorageMB: number;
}

export class QuotaService {
  /**
   * Get quota information for a specific user
   */
  async getUserQuotaInfo(userId: number): Promise<UserQuotaInfo | null> {
    // Get user data
    const [user] = await db
      .select({
        userId: users.id,
        username: users.username,
        subscriptionType: users.subscriptionType,
        maxItems: users.maxItems,
        maxStorageMB: users.maxStorageMB,
        currentStorageUsedMB: users.currentStorageUsedMB,
        role: users.role
      })
      .from(users)
      .where(eq(users.id, userId));

    if (!user) {
      return null;
    }

    // Count current items
    const [itemCount] = await db
      .select({ count: count() })
      .from(portfolioItems)
      .where(eq(portfolioItems.userId, userId));

    const currentItems = itemCount?.count || 0;

    // For unlimited users (admins, paid users)
    if (user.subscriptionType === 'unlimited' || user.subscriptionType === 'paid' || 
        user.role === 'admin' || user.role === 'superadmin') {
      return {
        userId: user.userId,
        username: user.username,
        subscriptionType: user.subscriptionType,
        maxItems: null,
        maxStorageMB: null,
        currentItems,
        currentStorageUsedMB: user.currentStorageUsedMB || 0,
        itemsRemaining: null,
        storageRemainingMB: null,
        isAtItemLimit: false,
        isAtStorageLimit: false,
        canUpload: true
      };
    }

    // Calculate remaining quotas
    const itemsRemaining = user.maxItems ? Math.max(0, user.maxItems - currentItems) : null;
    const storageRemainingMB = user.maxStorageMB ? Math.max(0, user.maxStorageMB - (user.currentStorageUsedMB || 0)) : null;

    const isAtItemLimit = user.maxItems ? currentItems >= user.maxItems : false;
    const isAtStorageLimit = user.maxStorageMB ? (user.currentStorageUsedMB || 0) >= user.maxStorageMB : false;

    return {
      userId: user.userId,
      username: user.username,
      subscriptionType: user.subscriptionType,
      maxItems: user.maxItems,
      maxStorageMB: user.maxStorageMB,
      currentItems,
      currentStorageUsedMB: user.currentStorageUsedMB || 0,
      itemsRemaining,
      storageRemainingMB,
      isAtItemLimit,
      isAtStorageLimit,
      canUpload: !isAtItemLimit && !isAtStorageLimit
    };
  }

  /**
   * Check if user can upload a new item with given size
   */
  async canUserUpload(userId: number, itemSizeMB: number = 0): Promise<{ canUpload: boolean; reason?: string }> {
    const quota = await this.getUserQuotaInfo(userId);
    
    if (!quota) {
      return { canUpload: false, reason: "User not found" };
    }

    // Unlimited users can always upload
    if (quota.maxItems === null && quota.maxStorageMB === null) {
      return { canUpload: true };
    }

    // Check item limit
    if (quota.isAtItemLimit) {
      return { 
        canUpload: false, 
        reason: `You've reached your item limit of ${quota.maxItems} items. Upgrade to add more items.` 
      };
    }

    // Check storage limit
    if (quota.maxStorageMB && (quota.currentStorageUsedMB + itemSizeMB) > quota.maxStorageMB) {
      return { 
        canUpload: false, 
        reason: `This upload would exceed your storage limit of ${quota.maxStorageMB}MB. Upgrade for more storage.` 
      };
    }

    return { canUpload: true };
  }

  /**
   * Update user's storage usage
   */
  async updateUserStorageUsage(userId: number, additionalMB: number): Promise<void> {
    await db
      .update(users)
      .set({
        currentStorageUsedMB: additionalMB
      })
      .where(eq(users.id, userId));
  }

  /**
   * Set quota limits for a user (superadmin only)
   */
  async setUserQuota(userId: number, maxItems: number | null, maxStorageMB: number | null, subscriptionType?: string): Promise<boolean> {
    try {
      const updateData: any = {
        maxItems,
        maxStorageMB
      };

      if (subscriptionType) {
        updateData.subscriptionType = subscriptionType;
      }

      await db
        .update(users)
        .set(updateData)
        .where(eq(users.id, userId));

      return true;
    } catch (error) {
      console.error('Error setting user quota:', error);
      return false;
    }
  }

  /**
   * Set default quota limits for all users of a specific role
   */
  async setDefaultQuotaForRole(role: string, maxItems: number, maxStorageMB: number): Promise<boolean> {
    try {
      await db
        .update(users)
        .set({
          maxItems,
          maxStorageMB
        })
        .where(eq(users.role, role));

      return true;
    } catch (error) {
      console.error('Error setting default quota for role:', error);
      return false;
    }
  }

  /**
   * Get quota usage statistics for admin dashboard
   */
  async getQuotaStatistics(): Promise<{
    totalUsers: number;
    freeUsers: number;
    paidUsers: number;
    usersAtItemLimit: number;
    usersAtStorageLimit: number;
    averageItemsPerUser: number;
    averageStoragePerUserMB: number;
  }> {
    // Get all users with their current usage
    const allUsers = await db
      .select({
        subscriptionType: users.subscriptionType,
        maxItems: users.maxItems,
        maxStorageMB: users.maxStorageMB,
        currentStorageUsedMB: users.currentStorageUsedMB,
        userId: users.id
      })
      .from(users);

    // Count items per user
    const itemCounts = await db
      .select({
        userId: portfolioItems.userId,
        itemCount: count()
      })
      .from(portfolioItems)
      .groupBy(portfolioItems.userId);

    const itemCountMap = new Map(itemCounts.map(ic => [ic.userId, ic.itemCount]));

    let usersAtItemLimit = 0;
    let usersAtStorageLimit = 0;
    let totalItems = 0;
    let totalStorageMB = 0;

    allUsers.forEach(user => {
      const userItemCount = itemCountMap.get(user.userId) || 0;
      totalItems += userItemCount;
      totalStorageMB += user.currentStorageUsedMB || 0;

      // Check if at limits
      if (user.maxItems && userItemCount >= user.maxItems) {
        usersAtItemLimit++;
      }
      if (user.maxStorageMB && (user.currentStorageUsedMB || 0) >= user.maxStorageMB) {
        usersAtStorageLimit++;
      }
    });

    const freeUsers = allUsers.filter(u => u.subscriptionType === 'free').length;
    const paidUsers = allUsers.filter(u => u.subscriptionType === 'paid' || u.subscriptionType === 'unlimited').length;

    return {
      totalUsers: allUsers.length,
      freeUsers,
      paidUsers,
      usersAtItemLimit,
      usersAtStorageLimit,
      averageItemsPerUser: allUsers.length > 0 ? Math.round(totalItems / allUsers.length) : 0,
      averageStoragePerUserMB: allUsers.length > 0 ? Math.round(totalStorageMB / allUsers.length) : 0
    };
  }

  /**
   * Get users who are close to their limits (for proactive upgrade prompts)
   */
  async getUsersNearLimits(itemThreshold: number = 0.8, storageThreshold: number = 0.8): Promise<Array<{
    userId: number;
    username: string;
    itemUsagePercent: number;
    storageUsagePercent: number;
  }>> {
    const userTable = users;
    const userList = await db
      .select({
        userId: userTable.id,
        username: userTable.username,
        maxItems: userTable.maxItems,
        maxStorageMB: userTable.maxStorageMB,
        currentStorageUsedMB: userTable.currentStorageUsedMB,
        subscriptionType: userTable.subscriptionType
      })
      .from(userTable)
      .where(eq(userTable.subscriptionType, 'free'));

    const itemCounts = await db
      .select({
        userId: portfolioItems.userId,
        itemCount: count()
      })
      .from(portfolioItems)
      .groupBy(portfolioItems.userId);

    const itemCountMap = new Map(itemCounts.map(ic => [ic.userId, ic.itemCount]));

    const nearLimitUsers: Array<{
      userId: number;
      username: string;
      itemUsagePercent: number;
      storageUsagePercent: number;
    }> = [];

    userList.forEach((user: any) => {
      const userItemCount = itemCountMap.get(user.userId) || 0;
      const itemUsagePercent = user.maxItems ? userItemCount / user.maxItems : 0;
      const storageUsagePercent = user.maxStorageMB ? (user.currentStorageUsedMB || 0) / user.maxStorageMB : 0;

      if (itemUsagePercent >= itemThreshold || storageUsagePercent >= storageThreshold) {
        nearLimitUsers.push({
          userId: user.userId,
          username: user.username,
          itemUsagePercent: Math.round(itemUsagePercent * 100) / 100,
          storageUsagePercent: Math.round(storageUsagePercent * 100) / 100
        });
      }
    });

    return nearLimitUsers;
  }
}

export const quotaService = new QuotaService();