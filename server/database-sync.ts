import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Database synchronization service to ensure consistent data across environments
 * This ensures both Replit and Render deployments use the same database instance
 */

interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl: boolean;
}

/**
 * Parse DATABASE_URL into connection components
 */
function parseDatabaseUrl(url: string): DatabaseConfig {
  const parsed = new URL(url);
  return {
    host: parsed.hostname,
    port: parseInt(parsed.port) || 5432,
    database: parsed.pathname.slice(1),
    username: parsed.username,
    password: parsed.password,
    ssl: parsed.searchParams.get('ssl') !== 'false'
  };
}

/**
 * Ensure both environments use the same shared PostgreSQL database
 */
export class DatabaseSyncService {
  private primaryPool: Pool;
  private config: DatabaseConfig;

  constructor() {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is required for database sync');
    }

    this.config = parseDatabaseUrl(process.env.DATABASE_URL);
    this.primaryPool = new Pool({
      host: this.config.host,
      port: this.config.port,
      database: this.config.database,
      user: this.config.username,
      password: this.config.password,
      ssl: this.config.ssl ? { rejectUnauthorized: false } : false,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
  }

  /**
   * Test database connectivity
   */
  async testConnection(): Promise<boolean> {
    try {
      const client = await this.primaryPool.connect();
      await client.query('SELECT 1');
      client.release();
      console.log('✅ Database connection successful');
      return true;
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      return false;
    }
  }

  /**
   * Sync uploaded images to shared storage
   * This ensures both environments can access the same image files
   */
  async syncImageFiles(): Promise<void> {
    try {
      const uploadsDir = path.join(process.cwd(), 'uploads');
      
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
        console.log('📁 Created uploads directory');
      }

      // Get all image references from database
      const result = await this.primaryPool.query(`
        SELECT DISTINCT author_profile_image as image_path 
        FROM portfolio_items 
        WHERE author_profile_image IS NOT NULL
        UNION
        SELECT DISTINCT image_url as image_path 
        FROM categories 
        WHERE image_url IS NOT NULL
      `);

      const imagePaths = result.rows.map(row => row.image_path).filter(Boolean);
      console.log(`📸 Found ${imagePaths.length} image references in database`);

      // Verify local image files exist
      const missingImages: string[] = [];
      for (const imagePath of imagePaths) {
        if (imagePath.startsWith('/uploads/')) {
          const localPath = path.join(process.cwd(), imagePath.substring(1));
          if (!fs.existsSync(localPath)) {
            missingImages.push(imagePath);
          }
        }
      }

      if (missingImages.length > 0) {
        console.log(`⚠️  Missing ${missingImages.length} image files locally`);
        console.log('Missing images:', missingImages.slice(0, 5).join(', '));
      } else {
        console.log('✅ All database-referenced images exist locally');
      }

    } catch (error) {
      console.error('❌ Image sync failed:', error);
    }
  }

  /**
   * Initialize shared database connection for the application
   */
  async initializeSharedDatabase(): Promise<Pool> {
    const isConnected = await this.testConnection();
    if (!isConnected) {
      throw new Error('Cannot establish connection to shared database');
    }

    await this.syncImageFiles();
    
    console.log('🔄 Shared database initialized successfully');
    return this.primaryPool;
  }

  /**
   * Get database statistics
   */
  async getDatabaseStats(): Promise<any> {
    try {
      const stats = await this.primaryPool.query(`
        SELECT 
          (SELECT COUNT(*) FROM portfolio_items) as total_items,
          (SELECT COUNT(DISTINCT author) FROM portfolio_items WHERE author IS NOT NULL) as total_authors,
          (SELECT COUNT(*) FROM categories) as total_categories,
          (SELECT COUNT(*) FROM users) as total_users
      `);
      
      return stats.rows[0];
    } catch (error) {
      console.error('Failed to get database stats:', error);
      return null;
    }
  }

  /**
   * Clean up database connections
   */
  async close(): Promise<void> {
    await this.primaryPool.end();
  }
}

export const databaseSync = new DatabaseSyncService();