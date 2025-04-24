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
    
    let migrationPerformed = false;
    
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
      
      migrationPerformed = true;
      console.log('User table migration completed successfully!');
    } else {
      console.log('User migration not needed - email column already exists');
    }
    
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
    
    if (migrationPerformed) {
      console.log('All migrations completed successfully!');
    } else {
      console.log('No migrations needed.');
    }
    
    return migrationPerformed;
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