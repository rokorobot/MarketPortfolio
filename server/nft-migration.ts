import { db } from "./db";
import { sql } from "drizzle-orm";

/**
 * Migration script to add NFT-related columns to portfolio_items table
 */
export async function migrateNFTFields() {
  console.log("Starting NFT fields migration...");
  
  try {
    // Check for external_id column
    const hasExternalId = await checkColumnExists('portfolio_items', 'external_id');
    if (!hasExternalId) {
      console.log("Adding external_id column to portfolio_items table");
      await db.execute(sql`ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS external_id TEXT`);
    }
    
    // Check for external_source column
    const hasExternalSource = await checkColumnExists('portfolio_items', 'external_source');
    if (!hasExternalSource) {
      console.log("Adding external_source column to portfolio_items table");
      await db.execute(sql`ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS external_source TEXT`);
    }
    
    // Check for external_metadata column
    const hasExternalMetadata = await checkColumnExists('portfolio_items', 'external_metadata');
    if (!hasExternalMetadata) {
      console.log("Adding external_metadata column to portfolio_items table");
      await db.execute(sql`ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS external_metadata TEXT`);
    }
    
    // Check for marketplace_url column
    const hasMarketplaceUrl = await checkColumnExists('portfolio_items', 'marketplace_url');
    if (!hasMarketplaceUrl) {
      console.log("Adding marketplace_url column to portfolio_items table");
      await db.execute(sql`ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS marketplace_url TEXT`);
    }
    
    // Check for marketplace_name column
    const hasMarketplaceName = await checkColumnExists('portfolio_items', 'marketplace_name');
    if (!hasMarketplaceName) {
      console.log("Adding marketplace_name column to portfolio_items table");
      await db.execute(sql`ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS marketplace_name TEXT`);
    }
    
    // Check for price column
    const hasPrice = await checkColumnExists('portfolio_items', 'price');
    if (!hasPrice) {
      console.log("Adding price column to portfolio_items table");
      await db.execute(sql`ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS price TEXT`);
    }
    
    // Check for currency column
    const hasCurrency = await checkColumnExists('portfolio_items', 'currency');
    if (!hasCurrency) {
      console.log("Adding currency column to portfolio_items table");
      await db.execute(sql`ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS currency TEXT`);
    }
    
    // Check for is_sold column
    const hasIsSold = await checkColumnExists('portfolio_items', 'is_sold');
    if (!hasIsSold) {
      console.log("Adding is_sold column to portfolio_items table");
      await db.execute(sql`ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS is_sold BOOLEAN DEFAULT FALSE`);
    }
    
    // Check for date_created column
    const hasDateCreated = await checkColumnExists('portfolio_items', 'date_created');
    if (!hasDateCreated) {
      console.log("Adding date_created column to portfolio_items table");
      await db.execute(sql`ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS date_created TIMESTAMP`);
    }
    
    // Check for status column
    const hasStatus = await checkColumnExists('portfolio_items', 'status');
    if (!hasStatus) {
      console.log("Adding status column to portfolio_items table");
      await db.execute(sql`ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft'`);
    }
    
    console.log("NFT fields migration completed successfully");
    return true;
  } catch (error) {
    console.error("Error during NFT fields migration:", error);
    return false;
  }
}

/**
 * Check if a column exists in a table
 * @param tableName - The name of the table
 * @param columnName - The name of the column to check
 * @returns A boolean indicating if the column exists
 */
async function checkColumnExists(tableName: string, columnName: string): Promise<boolean> {
  try {
    const result = await db.execute(sql`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = ${tableName}
      AND column_name = ${columnName}
    `);
    
    return result.rows.length > 0;
  } catch (error) {
    console.error(`Error checking if column ${columnName} exists in table ${tableName}:`, error);
    return false;
  }
}