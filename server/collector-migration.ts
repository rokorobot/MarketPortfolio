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
      await sql`
        CREATE TABLE IF NOT EXISTS "item_collectors" (
          "item_id" integer NOT NULL,
          "collector_id" integer NOT NULL,
          "created_at" timestamp DEFAULT now() NOT NULL,
          CONSTRAINT "item_collectors_pkey" PRIMARY KEY ("item_id", "collector_id"),
          CONSTRAINT "item_collectors_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "portfolio_items" ("id") ON DELETE CASCADE,
          CONSTRAINT "item_collectors_collector_id_fkey" FOREIGN KEY ("collector_id") REFERENCES "users" ("id") ON DELETE CASCADE
        )
      `.execute(pool);
      
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
  const result = await sql`
    SELECT EXISTS (
      SELECT FROM pg_tables
      WHERE schemaname = 'public'
      AND tablename = ${tableName}
    )
  `.execute(pool);
  
  return result[0]?.exists || false;
}