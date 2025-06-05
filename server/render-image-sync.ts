import { pool } from './db';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Service to synchronize images from Render deployment to Replit
 * Since Render doesn't serve images externally, we need to use database-based transfer
 */
export class RenderImageSyncService {
  private localUploadsDir = path.join(process.cwd(), 'uploads');

  constructor() {
    if (!fs.existsSync(this.localUploadsDir)) {
      fs.mkdirSync(this.localUploadsDir, { recursive: true });
    }
  }

  /**
   * Create a table to store image data in the database for cross-environment transfer
   */
  async createImageDataTable(): Promise<void> {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS image_data_transfer (
          id SERIAL PRIMARY KEY,
          image_path VARCHAR(255) UNIQUE NOT NULL,
          image_data BYTEA NOT NULL,
          content_type VARCHAR(100) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('Image data transfer table created/verified');
    } catch (error) {
      console.error('Failed to create image data table:', error);
    }
  }

  /**
   * Store image file data in database (to be run on Render)
   */
  async storeImageInDatabase(imagePath: string): Promise<boolean> {
    try {
      const fullPath = path.join(process.cwd(), imagePath.startsWith('/') ? imagePath.slice(1) : imagePath);
      
      if (!fs.existsSync(fullPath)) {
        console.log(`Image not found: ${fullPath}`);
        return false;
      }

      const imageData = fs.readFileSync(fullPath);
      const contentType = this.getContentType(imagePath);

      await pool.query(`
        INSERT INTO image_data_transfer (image_path, image_data, content_type)
        VALUES ($1, $2, $3)
        ON CONFLICT (image_path) DO UPDATE SET
          image_data = EXCLUDED.image_data,
          content_type = EXCLUDED.content_type,
          created_at = CURRENT_TIMESTAMP
      `, [imagePath, imageData, contentType]);

      console.log(`Stored image data for: ${imagePath}`);
      return true;
    } catch (error) {
      console.error(`Failed to store image ${imagePath}:`, error);
      return false;
    }
  }

  /**
   * Retrieve and save image from database (to be run on Replit)
   */
  async retrieveImageFromDatabase(imagePath: string): Promise<boolean> {
    try {
      const result = await pool.query(
        'SELECT image_data, content_type FROM image_data_transfer WHERE image_path = $1',
        [imagePath]
      );

      if (result.rows.length === 0) {
        console.log(`No data found for: ${imagePath}`);
        return false;
      }

      const { image_data, content_type } = result.rows[0];
      const fileName = path.basename(imagePath);
      const localPath = path.join(this.localUploadsDir, fileName);

      fs.writeFileSync(localPath, image_data);
      console.log(`Retrieved and saved: ${fileName}`);
      return true;
    } catch (error) {
      console.error(`Failed to retrieve image ${imagePath}:`, error);
      return false;
    }
  }

  /**
   * Get content type based on file extension
   */
  private getContentType(filePath: string): string {
    const ext = path.extname(filePath).toLowerCase();
    const contentTypes: { [key: string]: string } = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml',
      '.jfif': 'image/jpeg'
    };
    return contentTypes[ext] || 'application/octet-stream';
  }

  /**
   * Get all image paths that should exist
   */
  async getAllImagePaths(): Promise<string[]> {
    try {
      // Get the original image paths before cleanup
      const result = await pool.query(`
        SELECT DISTINCT author_profile_image as image_path 
        FROM portfolio_items 
        WHERE author_profile_image IS NOT NULL
        UNION
        SELECT DISTINCT image_url as image_path 
        FROM categories 
        WHERE image_url IS NOT NULL
      `);

      return result.rows.map(row => row.image_path).filter(Boolean);
    } catch (error) {
      console.error('Failed to get image paths:', error);
      return [];
    }
  }

  /**
   * Check which images are available in the transfer table
   */
  async getAvailableImagesInDatabase(): Promise<string[]> {
    try {
      const result = await pool.query('SELECT image_path FROM image_data_transfer');
      return result.rows.map(row => row.image_path);
    } catch (error) {
      console.error('Failed to check available images:', error);
      return [];
    }
  }

  /**
   * Download all available images from database
   */
  async downloadAllAvailableImages(): Promise<void> {
    console.log('Checking for images available in database...');
    
    await this.createImageDataTable();
    
    const availableImages = await this.getAvailableImagesInDatabase();
    console.log(`Found ${availableImages.length} images available for download`);

    if (availableImages.length === 0) {
      console.log('No images found in database transfer table');
      console.log('Images need to be uploaded from Render deployment first');
      return;
    }

    let downloadedCount = 0;
    for (const imagePath of availableImages) {
      const fileName = path.basename(imagePath);
      const localPath = path.join(this.localUploadsDir, fileName);
      
      // Only download if we don't already have the file
      if (!fs.existsSync(localPath)) {
        const success = await this.retrieveImageFromDatabase(imagePath);
        if (success) {
          downloadedCount++;
        }
      }
    }

    console.log(`Downloaded ${downloadedCount} new images from database`);
  }
}

export const renderImageSync = new RenderImageSyncService();