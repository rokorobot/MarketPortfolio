import { Pool } from '@neondatabase/serverless';

/**
 * Migration script to create the favorites table if it doesn't exist
 */
export async function migrateFavorites() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  try {
    console.log("Starting favorites table migration...");
    
    // Check if favorites table exists
    const tableExistsQuery = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'favorites'
      );
    `;
    
    const result = await pool.query(tableExistsQuery);
    const tableExists = result.rows[0].exists;
    
    if (!tableExists) {
      console.log("Creating favorites table...");
      
      // Create the favorites table
      const createTableQuery = `
        CREATE TABLE public.favorites (
          user_id character varying NOT NULL,
          item_id integer NOT NULL,
          created_at timestamp without time zone DEFAULT now() NOT NULL,
          PRIMARY KEY (user_id, item_id)
        );
      `;
      
      await pool.query(createTableQuery);
      console.log("Favorites table created successfully!");
    } else {
      console.log("Favorites table already exists");
    }
    
    console.log("Favorites migration completed successfully!");
  } catch (error) {
    console.error("Error during favorites migration:", error);
  } finally {
    await pool.end();
  }
}
