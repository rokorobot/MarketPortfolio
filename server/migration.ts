import { db, pool } from "./db";
import { users, sessions } from "@shared/schema";
import { sql } from "drizzle-orm";

/**
 * Migration script to update database tables for Replit Auth
 * This will:
 * 1. Create the sessions table for Replit Auth
 * 2. Update the users table structure to support Replit Auth
 * 3. Migrate existing users and relationships 
 */
async function migrateDatabase() {
  console.log('Starting database migration for Replit Auth...');
  
  try {
    let migrationPerformed = false;
    
    // Check if sessions table exists
    const checkSessionsTable = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name = 'sessions'
    `);
    
    // Create sessions table if it doesn't exist
    if (checkSessionsTable.rowCount === 0) {
      console.log('Creating sessions table for Replit Auth...');
      
      await pool.query(`
        CREATE TABLE sessions (
          sid VARCHAR PRIMARY KEY,
          sess JSONB NOT NULL,
          expire TIMESTAMP NOT NULL
        )
      `);
      
      await pool.query(`
        CREATE INDEX "IDX_session_expire" ON sessions (expire)
      `);
      
      migrationPerformed = true;
      console.log('Sessions table created successfully!');
    } else {
      console.log('Sessions table already exists');
    }
    
    // Check if first_name column exists in users table
    const checkFirstNameColumn = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'first_name'
    `);
    
    // Check if profile_image_url column exists
    const checkProfileImageUrlColumn = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'profile_image_url'
    `);
    
    // If necessary columns don't exist, we need to modify the users table
    if (checkFirstNameColumn.rowCount === 0 || checkProfileImageUrlColumn.rowCount === 0) {
      console.log('Migrating users table to support Replit Auth...');
      
      // First, create a temporary backup of the users table
      await pool.query(`
        CREATE TABLE users_backup AS 
        SELECT * FROM users
      `);
      
      console.log('Created users_backup table');
      
      // Then create a temporary new users table with varchar ID
      await pool.query(`
        CREATE TABLE users_new (
          id VARCHAR PRIMARY KEY NOT NULL,
          username VARCHAR UNIQUE NOT NULL,
          email VARCHAR UNIQUE,
          first_name VARCHAR,
          last_name VARCHAR,
          bio TEXT,
          profile_image_url VARCHAR,
          role TEXT NOT NULL DEFAULT 'visitor',
          display_name TEXT,
          tezos_wallet_address TEXT,
          ethereum_wallet_address TEXT,
          website TEXT,
          twitter TEXT,
          instagram TEXT,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW(),
          is_active BOOLEAN NOT NULL DEFAULT true
        )
      `);
      
      console.log('Created new users table with updated schema');
      
      // Migrate data from old to new table, converting IDs to strings
      await pool.query(`
        INSERT INTO users_new (
          id, username, email, bio, role, display_name, 
          tezos_wallet_address, ethereum_wallet_address, 
          website, twitter, instagram, created_at, updated_at, is_active
        )
        SELECT 
          id::VARCHAR, username, email, bio, role, display_name, 
          tezos_wallet_address, ethereum_wallet_address, 
          website, twitter, instagram, created_at, updated_at, is_active
        FROM users_backup
      `);
      
      console.log('Migrated user data to new table');
      
      // Update profile_image_url from profile_image if it exists
      const checkProfileImageColumn = await pool.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'users_backup' AND column_name = 'profile_image'
      `);
      
      if (checkProfileImageColumn.rowCount > 0) {
        await pool.query(`
          UPDATE users_new
          SET profile_image_url = users_backup.profile_image
          FROM users_backup
          WHERE users_new.id = users_backup.id::VARCHAR
        `);
        console.log('Migrated profile images to profile_image_url');
      }
      
      // Now update the foreign keys in other tables
      
      // Update portfolio_items
      await pool.query(`
        ALTER TABLE portfolio_items 
        DROP CONSTRAINT IF EXISTS portfolio_items_user_id_fkey
      `);
      
      await pool.query(`
        ALTER TABLE portfolio_items 
        ALTER COLUMN user_id TYPE VARCHAR USING user_id::VARCHAR
      `);
      
      console.log('Updated portfolio_items foreign key');
      
      // Update favorites
      await pool.query(`
        CREATE TABLE favorites_new (
          user_id VARCHAR NOT NULL,
          item_id INTEGER NOT NULL,
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          PRIMARY KEY (user_id, item_id)
        )
      `);
      
      await pool.query(`
        INSERT INTO favorites_new (user_id, item_id, created_at)
        SELECT user_id::VARCHAR, item_id, created_at
        FROM favorites
      `);
      
      console.log('Created new favorites table with updated schema');
      
      // Update categories
      await pool.query(`
        ALTER TABLE categories
        ALTER COLUMN created_by_id TYPE VARCHAR USING created_by_id::VARCHAR
      `);
      
      console.log('Updated categories foreign key');
      
      // Drop the old users and favorites tables
      await pool.query(`DROP TABLE users CASCADE`);
      await pool.query(`DROP TABLE favorites CASCADE`);
      
      // Rename new tables to original names
      await pool.query(`ALTER TABLE users_new RENAME TO users`);
      await pool.query(`ALTER TABLE favorites_new RENAME TO favorites`);
      
      // Add foreign key constraints back
      await pool.query(`
        ALTER TABLE portfolio_items
        ADD CONSTRAINT portfolio_items_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      `);
      
      await pool.query(`
        ALTER TABLE favorites
        ADD CONSTRAINT favorites_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      `);
      
      await pool.query(`
        ALTER TABLE favorites
        ADD CONSTRAINT favorites_item_id_fkey 
        FOREIGN KEY (item_id) REFERENCES portfolio_items(id) ON DELETE CASCADE
      `);
      
      await pool.query(`
        ALTER TABLE categories
        ADD CONSTRAINT categories_created_by_id_fkey 
        FOREIGN KEY (created_by_id) REFERENCES users(id) ON DELETE CASCADE
      `);
      
      migrationPerformed = true;
      console.log('Users table migration completed successfully!');
    } else {
      console.log('Users table already has Replit Auth structure');
    }
    
    if (migrationPerformed) {
      console.log('All Replit Auth migrations completed successfully!');
    } else {
      console.log('No migrations needed for Replit Auth.');
    }
    
    return migrationPerformed;
  } catch (error) {
    console.error('Error during Replit Auth migration:', error);
    throw error;
  }
}

// Export the migration function
export { migrateDatabase };

// Run migration if needed - this will be handled from storage.ts
// No need for direct execution check in ES modules