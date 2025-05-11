import { db, pool } from "./db";
import { users } from "@shared/schema";
import { sql } from "drizzle-orm";
import { migrateNFTFields } from "./nft-migration";

/**
 * Migration script to update database tables
 * This will add the new columns to the users table
 */
async function migrateDatabase() {
  console.log('Starting database migration...');
  
  try {
    // Define all expected user columns and their definitions
    const userColumns = {
      "password": "TEXT NOT NULL DEFAULT 'temp_password_hash'",
      "email": "TEXT UNIQUE",
      "display_name": "TEXT",
      "bio": "TEXT",
      "profile_image": "TEXT",
      "tezos_wallet_address": "TEXT",
      "ethereum_wallet_address": "TEXT",
      "website": "TEXT",
      "twitter": "TEXT",
      "instagram": "TEXT",
      "is_email_verified": "BOOLEAN DEFAULT false",
      "verification_token": "TEXT",
      "reset_password_token": "TEXT",
      "reset_password_expires": "TIMESTAMP",
      "created_at": "TIMESTAMP DEFAULT NOW()",
      "updated_at": "TIMESTAMP DEFAULT NOW()",
      "is_active": "BOOLEAN DEFAULT true"
    };
    
    // Get existing columns
    const existingColumns = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users'
    `);
    
    const existingColumnNames = existingColumns.rows.map(row => row.column_name);
    const missingColumns: string[] = [];
    
    // Check which columns are missing
    Object.keys(userColumns).forEach(columnName => {
      if (!existingColumnNames.includes(columnName)) {
        missingColumns.push(columnName);
      }
    });
    
    // Add missing columns if needed
    if (missingColumns.length > 0) {
      console.log(`Adding missing columns to users table: ${missingColumns.join(', ')}`);
      
      // Build ALTER TABLE statement dynamically
      let alterStatement = 'ALTER TABLE users ';
      const alterClauses = missingColumns.map(columnName => 
        `ADD COLUMN ${columnName} ${userColumns[columnName as keyof typeof userColumns]}`
      );
      
      alterStatement += alterClauses.join(', ');
      
      // Execute the ALTER TABLE statement
      await pool.query(alterStatement);
      console.log('Missing columns added successfully!');
      
      // If email column was just added, update it with placeholder values and make it NOT NULL
      if (missingColumns.includes("email")) {
        // Update existing users with placeholder emails
        await pool.query(`
          UPDATE users 
          SET email = username || '@placeholder.com',
              is_email_verified = true
          WHERE email IS NULL
        `);
        
        // Now make email column NOT NULL
        await pool.query(`
          ALTER TABLE users
          ALTER COLUMN email SET NOT NULL
        `);
        
        console.log('Email column initialized with placeholder values and set to NOT NULL');
      }
    } else {
      console.log('All essential columns already exist in users table');
    }
    
    // Track if any migrations were performed
    let migrationPerformed = missingColumns.length > 0;
    
    // Check if user_id column exists in portfolio_items table
    const checkUserIdColumn = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'portfolio_items' AND column_name = 'user_id'
    `);
    
    if (checkUserIdColumn.rowCount === 0) {
      console.log('Adding user_id column to portfolio_items table...');
      
      await pool.query(`
        ALTER TABLE portfolio_items
        ADD COLUMN user_id INTEGER REFERENCES users(id) ON DELETE SET NULL
      `);
      
      // Assign all existing items to the first admin user if available
      await pool.query(`
        UPDATE portfolio_items 
        SET user_id = (SELECT id FROM users WHERE role = 'admin' ORDER BY id LIMIT 1)
        WHERE user_id IS NULL
      `);
      
      migrationPerformed = true;
      console.log('Portfolio items table migration completed successfully!');
    } else {
      console.log('Items migration not needed - user_id column already exists');
    }
    
    // Migrate NFT-related columns
    const nftMigrationPerformed = await migrateNFTFields();
    
    if (migrationPerformed || nftMigrationPerformed) {
      console.log('All migrations completed successfully!');
    } else {
      console.log('No migrations needed.');
    }
    
    return migrationPerformed || nftMigrationPerformed;
  } catch (error) {
    console.error('Error during migration:', error);
    throw error;
  } finally {
    // Keep the pool open for other operations
  }
}

// Export the migration function
export { migrateDatabase };

// Run migration if needed - this will be handled from storage.ts
// No need for direct execution check in ES modules