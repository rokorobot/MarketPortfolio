import { db, pool } from './db';
import { sql } from 'drizzle-orm';
import { itemCollectors } from '../shared/schema';

/**
 * Migration script to add item_collectors table
 * This enables tracking which users are collectors of which items
 */
export async function migrateItemCollectors() {
  try {
    console.log('Starting item collectors migration...');
    
    // Check if the item_collectors table exists
    const tableExists = await checkTableExists('item_collectors');
    
    if (!tableExists) {
      // Create the item_collectors table
      // First check the data type of the users.id column
      const userIdTypeResult = await pool.query(`
        SELECT data_type 
        FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'id'
      `);
      
      const userIdType = userIdTypeResult.rows[0]?.data_type || 'integer';
      console.log(`Detected users.id type: ${userIdType}`);
      
      // Create the item_collectors table with matching collector_id type
      await pool.query(`
        CREATE TABLE IF NOT EXISTS "item_collectors" (
          "item_id" integer NOT NULL,
          "collector_id" ${userIdType} NOT NULL,
          "created_at" timestamp DEFAULT now() NOT NULL,
          CONSTRAINT "item_collectors_pkey" PRIMARY KEY ("item_id", "collector_id"),
          CONSTRAINT "item_collectors_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "portfolio_items" ("id") ON DELETE CASCADE,
          CONSTRAINT "item_collectors_collector_id_fkey" FOREIGN KEY ("collector_id") REFERENCES "users" ("id") ON DELETE CASCADE
        )
      `);
      
      console.log('Created item_collectors table successfully');
    } else {
      console.log('item_collectors table already exists');
    }
    
    console.log('Item collectors migration completed successfully!');
    return true;
  } catch (error) {
    console.error('Error performing item collectors migration:', error);
    return false;
  }
}

/**
 * Check if a table exists in the database
 * @param tableName - The name of the table to check
 * @returns A boolean indicating if the table exists
 */
async function checkTableExists(tableName: string): Promise<boolean> {
  const result = await pool.query(`
    SELECT EXISTS (
      SELECT FROM pg_tables
      WHERE schemaname = 'public'
      AND tablename = $1
    )
  `, [tableName]);
  
  return result.rows[0]?.exists || false;
}