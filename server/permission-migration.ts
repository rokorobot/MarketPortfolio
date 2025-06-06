import { db } from "./db";

/**
 * Migration script to create the item_permissions table for granular access control
 */
export async function migrateItemPermissions() {
  try {
    console.log('Starting item permissions migration...');

    // Check if the table already exists
    const tableExists = await checkTableExists('item_permissions');
    
    if (tableExists) {
      console.log('item_permissions table already exists');
      return;
    }

    // Create the item_permissions table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS item_permissions (
        id SERIAL PRIMARY KEY,
        item_id INTEGER NOT NULL REFERENCES portfolio_items(id) ON DELETE CASCADE,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        ownership_type TEXT NOT NULL DEFAULT 'viewer',
        permission_level TEXT NOT NULL DEFAULT 'view',
        granted_by INTEGER REFERENCES users(id),
        granted_at TIMESTAMP DEFAULT NOW(),
        expires_at TIMESTAMP,
        is_active BOOLEAN NOT NULL DEFAULT true,
        UNIQUE(user_id, item_id)
      )
    `);

    // Create indexes for better performance
    await db.execute(`
      CREATE INDEX IF NOT EXISTS idx_item_permissions_item_id ON item_permissions(item_id);
    `);
    
    await db.execute(`
      CREATE INDEX IF NOT EXISTS idx_item_permissions_user_id ON item_permissions(user_id);
    `);

    await db.execute(`
      CREATE INDEX IF NOT EXISTS idx_item_permissions_active ON item_permissions(is_active);
    `);

    // Create automatic ownership permissions for existing items
    await db.execute(`
      INSERT INTO item_permissions (item_id, user_id, ownership_type, permission_level, granted_by, is_active)
      SELECT 
        pi.id as item_id,
        pi.user_id,
        'owner' as ownership_type,
        'full' as permission_level,
        pi.user_id as granted_by,
        true as is_active
      FROM portfolio_items pi
      WHERE pi.user_id IS NOT NULL
      ON CONFLICT (user_id, item_id) DO NOTHING
    `);

    console.log('Item permissions migration completed successfully!');
  } catch (error) {
    console.error('Error during item permissions migration:', error);
    throw error;
  }
}

/**
 * Check if a table exists in the database
 */
async function checkTableExists(tableName: string): Promise<boolean> {
  try {
    const result = await db.execute(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = '${tableName}'
      )
    `);
    
    return result.rows?.[0]?.exists === true;
  } catch (error) {
    console.error(`Error checking if table ${tableName} exists:`, error);
    return false;
  }
}