import { db } from './db';
import { sql } from 'drizzle-orm';

/**
 * Migration script to create the favorites table if it doesn't exist
 */
export async function migrateFavorites() {
  try {
    console.log("Starting favorites table migration...");
    
    // Check if favorites table exists using Drizzle
    const tableExistsResult = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'favorites'
      ) as exists;
    `);
    
    const tableExists = tableExistsResult.rows[0]?.exists;
    
    if (!tableExists) {
      console.log("Creating favorites table...");
      
      // Create the favorites table using Drizzle
      await db.execute(sql`
        CREATE TABLE public.favorites (
          user_id character varying NOT NULL,
          item_id integer NOT NULL,
          created_at timestamp without time zone DEFAULT now() NOT NULL,
          PRIMARY KEY (user_id, item_id)
        );
      `);
      
      console.log("Favorites table created successfully!");
    } else {
      console.log("Favorites table already exists");
    }
    
    console.log("Favorites migration completed successfully!");
  } catch (error) {
    console.error("Error during favorites migration:", error);
  }
}
