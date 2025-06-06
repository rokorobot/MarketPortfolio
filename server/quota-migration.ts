import { db } from "./db";

/**
 * Migration script to add quota management fields to users table
 */
export async function migrateUserQuotas() {
  try {
    console.log('Starting user quotas migration...');

    // Check if columns exist before adding them
    const subscriptionTypeExists = await checkColumnExists('users', 'subscription_type');
    const maxItemsExists = await checkColumnExists('users', 'max_items');
    const maxStorageMBExists = await checkColumnExists('users', 'max_storage_mb');
    const currentStorageUsedMBExists = await checkColumnExists('users', 'current_storage_used_mb');
    const quotaResetDateExists = await checkColumnExists('users', 'quota_reset_date');

    if (!subscriptionTypeExists) {
      await db.execute(`ALTER TABLE users ADD COLUMN subscription_type TEXT NOT NULL DEFAULT 'free'`);
      console.log('Added subscription_type column');
    }

    if (!maxItemsExists) {
      await db.execute(`ALTER TABLE users ADD COLUMN max_items INTEGER DEFAULT 10`);
      console.log('Added max_items column');
    }

    if (!maxStorageMBExists) {
      await db.execute(`ALTER TABLE users ADD COLUMN max_storage_mb INTEGER DEFAULT 50`);
      console.log('Added max_storage_mb column');
    }

    if (!currentStorageUsedMBExists) {
      await db.execute(`ALTER TABLE users ADD COLUMN current_storage_used_mb INTEGER DEFAULT 0`);
      console.log('Added current_storage_used_mb column');
    }

    if (!quotaResetDateExists) {
      await db.execute(`ALTER TABLE users ADD COLUMN quota_reset_date TIMESTAMP`);
      console.log('Added quota_reset_date column');
    }

    // Update existing users to have proper quotas based on their role
    await db.execute(`
      UPDATE users 
      SET 
        max_items = CASE 
          WHEN role IN ('admin', 'superadmin') THEN NULL 
          WHEN role = 'creator' THEN 25
          WHEN role = 'collector' THEN 15
          ELSE 10 
        END,
        max_storage_mb = CASE 
          WHEN role IN ('admin', 'superadmin') THEN NULL 
          WHEN role = 'creator' THEN 100
          WHEN role = 'collector' THEN 75
          ELSE 50 
        END,
        subscription_type = CASE 
          WHEN role IN ('admin', 'superadmin') THEN 'unlimited'
          ELSE 'free' 
        END
      WHERE subscription_type = 'free' OR subscription_type IS NULL
    `);

    console.log('User quotas migration completed successfully!');
  } catch (error) {
    console.error('Error during user quotas migration:', error);
    throw error;
  }
}

/**
 * Check if a column exists in a table
 */
async function checkColumnExists(tableName: string, columnName: string): Promise<boolean> {
  try {
    const result = await db.execute(`
      SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = '${tableName}' 
        AND column_name = '${columnName}'
      )
    `);
    
    return result.rows?.[0]?.exists === true;
  } catch (error) {
    console.error(`Error checking if column ${columnName} exists in ${tableName}:`, error);
    return false;
  }
}