import { db, pool } from "./db";
import { users } from "@shared/schema";
import { sql } from "drizzle-orm";

/**
 * Migration script to update database tables
 * This will add the new columns to the users table
 */
async function migrateDatabase() {
  console.log('Starting database migration...');
  
  try {
    // Check if email column exists
    const checkEmailColumn = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'email'
    `);
    
    // If email column doesn't exist, we need to add all new columns
    if (checkEmailColumn.rowCount === 0) {
      console.log('Adding new columns to users table...');
      
      await pool.query(`
        ALTER TABLE users
        ADD COLUMN email TEXT UNIQUE,
        ADD COLUMN display_name TEXT,
        ADD COLUMN bio TEXT,
        ADD COLUMN profile_image TEXT,
        ADD COLUMN tezos_wallet_address TEXT,
        ADD COLUMN ethereum_wallet_address TEXT,
        ADD COLUMN website TEXT,
        ADD COLUMN twitter TEXT,
        ADD COLUMN instagram TEXT,
        ADD COLUMN is_email_verified BOOLEAN DEFAULT false,
        ADD COLUMN verification_token TEXT,
        ADD COLUMN reset_password_token TEXT,
        ADD COLUMN reset_password_expires TIMESTAMP,
        ADD COLUMN created_at TIMESTAMP DEFAULT NOW(),
        ADD COLUMN updated_at TIMESTAMP DEFAULT NOW()
      `);
      
      // Update existing users with placeholder emails
      // For production, you would want to notify users to set their real emails
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
      
      console.log('Migration completed successfully!');
    } else {
      console.log('Migration not needed - email column already exists');
    }
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