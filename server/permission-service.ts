import { db } from "./db";
import { itemPermissions, portfolioItems, users, type PermissionLevel, type OwnershipType } from "@shared/schema";
import { eq, and, or } from "drizzle-orm";

export interface UserPermissions {
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canShare: boolean;
  canGrantPermissions: boolean;
  ownershipType: OwnershipType | null;
  permissionLevel: PermissionLevel;
}

export class PermissionService {
  /**
   * Get user's permissions for a specific item
   */
  async getUserItemPermissions(itemId: number, userId: number | null, userRole?: string): Promise<UserPermissions> {
    // If no user, return visitor permissions (can only view)
    if (!userId) {
      return {
        canView: true,
        canEdit: false,
        canDelete: false,
        canShare: false,
        canGrantPermissions: false,
        ownershipType: null,
        permissionLevel: "view"
      };
    }

    // First check if user is the original uploader
    const [item] = await db
      .select({ userId: portfolioItems.userId })
      .from(portfolioItems)
      .where(eq(portfolioItems.id, itemId));

    if (!item) {
      return this.noPermissions();
    }

    // Check if user has visitor role - visitors can only view and favorite
    if (userRole === 'visitor') {
      return {
        canView: true,
        canEdit: false,
        canDelete: false,
        canShare: false,
        canGrantPermissions: false,
        ownershipType: null,
        permissionLevel: "view"
      };
    }

    // For creators/collectors, check if they own the item
    // Only item owners can edit/delete their own items
    if (userRole === 'creator' || userRole === 'collector') {
      if (item.userId === userId) {
        // User owns this item - full permissions
        return {
          canView: true,
          canEdit: true,
          canDelete: true,
          canShare: true,
          canGrantPermissions: true,
          ownershipType: "owner",
          permissionLevel: "full"
        };
      } else {
        // User doesn't own this item - view only
        return {
          canView: true,
          canEdit: false,
          canDelete: false,
          canShare: false,
          canGrantPermissions: false,
          ownershipType: null,
          permissionLevel: "view"
        };
      }
    }

    // Original uploader always has full ownership
    if (item.userId === userId) {
      return {
        canView: true,
        canEdit: true,
        canDelete: true,
        canShare: true,
        canGrantPermissions: true,
        ownershipType: "owner",
        permissionLevel: "full"
      };
    }

    // Check explicit permissions
    const [permission] = await db
      .select()
      .from(itemPermissions)
      .where(
        and(
          eq(itemPermissions.itemId, itemId),
          eq(itemPermissions.userId, userId),
          eq(itemPermissions.isActive, true)
        )
      );

    if (!permission) {
      return this.noPermissions();
    }

    // Check if permission has expired
    if (permission.expiresAt && new Date(permission.expiresAt) < new Date()) {
      return this.noPermissions();
    }

    return this.mapPermissionLevelToCapabilities(
      permission.permissionLevel as PermissionLevel,
      permission.ownershipType as OwnershipType
    );
  }

  /**
   * Check if user has admin privileges
   */
  async isUserAdmin(userId: number): Promise<boolean> {
    const [user] = await db
      .select({ role: users.role })
      .from(users)
      .where(eq(users.id, userId));

    return user?.role === 'admin' || user?.role === 'superadmin';
  }

  /**
   * Grant permission to a user for an item
   */
  async grantPermission(
    itemId: number,
    targetUserId: number,
    grantedByUserId: number,
    ownershipType: OwnershipType,
    permissionLevel: PermissionLevel,
    expiresAt?: Date
  ): Promise<boolean> {
    // Verify the granter has permission to grant permissions
    const granterPermissions = await this.getUserItemPermissions(itemId, grantedByUserId);
    const isAdmin = await this.isUserAdmin(grantedByUserId);

    if (!granterPermissions.canGrantPermissions && !isAdmin) {
      return false;
    }

    try {
      await db
        .insert(itemPermissions)
        .values({
          itemId,
          userId: targetUserId,
          ownershipType,
          permissionLevel,
          grantedBy: grantedByUserId,
          expiresAt,
          isActive: true
        })
        .onConflictDoUpdate({
          target: [itemPermissions.userId, itemPermissions.itemId],
          set: {
            ownershipType,
            permissionLevel,
            grantedBy: grantedByUserId,
            expiresAt,
            isActive: true,
            grantedAt: new Date()
          }
        });

      return true;
    } catch (error) {
      console.error('Error granting permission:', error);
      return false;
    }
  }

  /**
   * Revoke permission from a user for an item
   */
  async revokePermission(itemId: number, targetUserId: number, revokedByUserId: number): Promise<boolean> {
    // Verify the revoker has permission to revoke permissions
    const revokerPermissions = await this.getUserItemPermissions(itemId, revokedByUserId);
    const isAdmin = await this.isUserAdmin(revokedByUserId);

    if (!revokerPermissions.canGrantPermissions && !isAdmin) {
      return false;
    }

    try {
      await db
        .update(itemPermissions)
        .set({ isActive: false })
        .where(
          and(
            eq(itemPermissions.itemId, itemId),
            eq(itemPermissions.userId, targetUserId)
          )
        );

      return true;
    } catch (error) {
      console.error('Error revoking permission:', error);
      return false;
    }
  }

  /**
   * Get all users with permissions for an item
   */
  async getItemCollaborators(itemId: number): Promise<Array<{
    userId: number;
    username: string;
    ownershipType: OwnershipType;
    permissionLevel: PermissionLevel;
    grantedAt: Date;
    grantedBy: number | null;
  }>> {
    const collaborators = await db
      .select({
        userId: itemPermissions.userId,
        username: users.username,
        ownershipType: itemPermissions.ownershipType,
        permissionLevel: itemPermissions.permissionLevel,
        grantedAt: itemPermissions.grantedAt,
        grantedBy: itemPermissions.grantedBy
      })
      .from(itemPermissions)
      .innerJoin(users, eq(itemPermissions.userId, users.id))
      .where(
        and(
          eq(itemPermissions.itemId, itemId),
          eq(itemPermissions.isActive, true)
        )
      );

    return collaborators.map(c => ({
      ...c,
      ownershipType: c.ownershipType as OwnershipType,
      permissionLevel: c.permissionLevel as PermissionLevel,
      grantedAt: c.grantedAt || new Date()
    }));
  }

  /**
   * Check if user can perform specific action on item
   */
  async canUserPerformAction(
    itemId: number,
    userId: number,
    action: 'view' | 'edit' | 'delete' | 'share' | 'grant_permissions'
  ): Promise<boolean> {
    // Admin override
    if (await this.isUserAdmin(userId)) {
      return true;
    }

    const permissions = await this.getUserItemPermissions(itemId, userId);

    switch (action) {
      case 'view':
        return permissions.canView;
      case 'edit':
        return permissions.canEdit;
      case 'delete':
        return permissions.canDelete;
      case 'share':
        return permissions.canShare;
      case 'grant_permissions':
        return permissions.canGrantPermissions;
      default:
        return false;
    }
  }

  /**
   * Automatically grant ownership permission when user uploads/imports an item
   */
  async grantOwnershipOnUpload(itemId: number, userId: number): Promise<void> {
    // The original userId field in portfolioItems already handles this,
    // but we can also create an explicit permission entry for consistency
    try {
      await db
        .insert(itemPermissions)
        .values({
          itemId,
          userId,
          ownershipType: "owner",
          permissionLevel: "full",
          grantedBy: userId, // Self-granted
          isActive: true
        })
        .onConflictDoNothing(); // Don't overwrite if already exists
    } catch (error) {
      // Silent fail - the userId field provides ownership anyway
      console.warn('Could not create explicit ownership permission:', error);
    }
  }

  /**
   * Map permission level to actual capabilities
   */
  private mapPermissionLevelToCapabilities(
    permissionLevel: PermissionLevel,
    ownershipType: OwnershipType
  ): UserPermissions {
    const basePermissions = {
      ownershipType,
      permissionLevel
    };

    switch (permissionLevel) {
      case "none":
        return {
          ...basePermissions,
          canView: false,
          canEdit: false,
          canDelete: false,
          canShare: false,
          canGrantPermissions: false
        };

      case "view":
        return {
          ...basePermissions,
          canView: true,
          canEdit: false,
          canDelete: false,
          canShare: false,
          canGrantPermissions: false
        };

      case "comment":
        return {
          ...basePermissions,
          canView: true,
          canEdit: false,
          canDelete: false,
          canShare: false,
          canGrantPermissions: false
        };

      case "edit":
        return {
          ...basePermissions,
          canView: true,
          canEdit: true,
          canDelete: false,
          canShare: ownershipType === "owner",
          canGrantPermissions: false
        };

      case "full":
        return {
          ...basePermissions,
          canView: true,
          canEdit: true,
          canDelete: ownershipType === "owner",
          canShare: true,
          canGrantPermissions: ownershipType === "owner"
        };

      default:
        return this.noPermissions();
    }
  }

  /**
   * Return no permissions
   */
  private noPermissions(): UserPermissions {
    return {
      canView: false,
      canEdit: false,
      canDelete: false,
      canShare: false,
      canGrantPermissions: false,
      ownershipType: null,
      permissionLevel: "none"
    };
  }
}

export const permissionService = new PermissionService();