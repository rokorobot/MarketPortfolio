import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import * as http from 'http';
import { pool } from './db';

/**
 * Image synchronization service to copy missing images from Render deployment
 */
export class ImageSyncService {
  private renderBaseUrl = 'https://nftfolio-backend.onrender.com';
  private localUploadsDir = path.join(process.cwd(), 'uploads');
  private s3Bucket = process.env.AWS_S3_BUCKET;
  private s3AccessKey = process.env.AWS_ACCESS_KEY_ID;
  private s3SecretKey = process.env.AWS_SECRET_ACCESS_KEY;

  constructor() {
    // Ensure uploads directory exists
    if (!fs.existsSync(this.localUploadsDir)) {
      fs.mkdirSync(this.localUploadsDir, { recursive: true });
    }
  }

  /**
   * Download an image from a URL and save it locally
   */
  private async downloadImage(imageUrl: string, localPath: string): Promise<boolean> {
    return new Promise((resolve) => {
      const protocol = imageUrl.startsWith('https:') ? https : http;
      
      const request = protocol.get(imageUrl, (response) => {
        if (response.statusCode === 200) {
          const writeStream = fs.createWriteStream(localPath);
          response.pipe(writeStream);
          
          writeStream.on('finish', () => {
            writeStream.close();
            resolve(true);
          });
          
          writeStream.on('error', () => {
            resolve(false);
          });
        } else {
          resolve(false);
        }
      });
      
      request.on('error', () => {
        resolve(false);
      });
      
      // Set timeout
      request.setTimeout(10000, () => {
        request.destroy();
        resolve(false);
      });
    });
  }

  /**
   * Get all image paths referenced in the database
   */
  private async getImagePathsFromDatabase(): Promise<string[]> {
    try {
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
      console.error('Failed to get image paths from database:', error);
      return [];
    }
  }

  /**
   * Check which image files are missing locally
   */
  private getMissingImages(imagePaths: string[]): string[] {
    const missingImages: string[] = [];
    
    for (const imagePath of imagePaths) {
      if (imagePath.startsWith('/uploads/')) {
        const localPath = path.join(this.localUploadsDir, path.basename(imagePath));
        if (!fs.existsSync(localPath)) {
          missingImages.push(imagePath);
        }
      }
    }
    
    return missingImages;
  }

  /**
   * Clean up database references to missing images
   */
  async cleanupMissingImageReferences(): Promise<void> {
    console.log('Cleaning up database references to missing images...');
    
    // Get all image paths from database
    const imagePaths = await this.getImagePathsFromDatabase();
    const missingImages = this.getMissingImages(imagePaths);
    
    if (missingImages.length === 0) {
      console.log('All image references point to existing files');
      return;
    }
    
    console.log(`Found ${missingImages.length} broken image references, updating database...`);
    
    // Update portfolio_items to remove broken author profile image references
    for (const imagePath of missingImages) {
      try {
        await pool.query(
          'UPDATE portfolio_items SET author_profile_image = NULL WHERE author_profile_image = $1',
          [imagePath]
        );
      } catch (error) {
        console.error(`Failed to clean up reference ${imagePath}:`, error);
      }
    }
    
    // Update categories to remove broken image references
    for (const imagePath of missingImages) {
      try {
        await pool.query(
          'UPDATE categories SET image_url = NULL WHERE image_url = $1',
          [imagePath]
        );
      } catch (error) {
        console.error(`Failed to clean up category reference ${imagePath}:`, error);
      }
    }
    
    console.log('Database cleanup complete - broken image references removed');
  }

  /**
   * Generate placeholder images for missing author profile images
   */
  private async generatePlaceholderImages(): Promise<void> {
    console.log('Generating placeholder images for missing author profiles...');
    
    // Get all authors without profile images due to missing files
    const result = await pool.query(`
      SELECT DISTINCT author, author_profile_image 
      FROM portfolio_items 
      WHERE author IS NOT NULL 
      AND author_profile_image IS NOT NULL
    `);
    
    let generatedCount = 0;
    
    for (const row of result.rows) {
      const imagePath = row.author_profile_image;
      const authorName = row.author;
      
      if (imagePath && imagePath.startsWith('/uploads/')) {
        const localPath = path.join(this.localUploadsDir, path.basename(imagePath));
        
        if (!fs.existsSync(localPath)) {
          // Generate a simple placeholder image or use a deterministic approach
          await this.createAuthorPlaceholder(authorName, localPath);
          generatedCount++;
        }
      }
    }
    
    console.log(`Generated ${generatedCount} placeholder images for authors`);
  }

  /**
   * Create a placeholder image for an author
   */
  private async createAuthorPlaceholder(authorName: string, localPath: string): Promise<void> {
    // Create a simple SVG placeholder with the author's initials
    const initials = authorName.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
    const backgroundColor = this.getColorFromName(authorName);
    
    const svgContent = `
      <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="${backgroundColor}"/>
        <text x="100" y="120" font-family="Arial, sans-serif" font-size="60" fill="white" text-anchor="middle">${initials}</text>
      </svg>
    `;
    
    try {
      fs.writeFileSync(localPath, svgContent);
      console.log(`Created placeholder for ${authorName}: ${path.basename(localPath)}`);
    } catch (error) {
      console.error(`Failed to create placeholder for ${authorName}:`, error);
    }
  }

  /**
   * Generate a color based on author name for consistent placeholders
   */
  private getColorFromName(name: string): string {
    const colors = [
      '#4F46E5', '#7C3AED', '#EC4899', '#EF4444', 
      '#F59E0B', '#10B981', '#06B6D4', '#8B5CF6'
    ];
    
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  }

  /**
   * Apply the same shared approach we use for NFTs - clean database consistency
   */
  async synchronizeImages(): Promise<void> {
    console.log('Applying shared database approach for image consistency...');
    
    // Clean up broken references to maintain database integrity
    await this.cleanupMissingImageReferences();
    
    console.log('Image synchronization complete using shared database approach');
  }

  /**
   * Verify all database-referenced images exist locally
   */
  async verifyImageIntegrity(): Promise<{ total: number; missing: number; present: number }> {
    const imagePaths = await this.getImagePathsFromDatabase();
    const missingImages = this.getMissingImages(imagePaths);
    
    return {
      total: imagePaths.length,
      missing: missingImages.length,
      present: imagePaths.length - missingImages.length
    };
  }

  /**
   * Get statistics about local image files
   */
  async getImageStats(): Promise<any> {
    try {
      const files = fs.readdirSync(this.localUploadsDir);
      const imageFiles = files.filter(file => 
        /\.(jpg|jpeg|png|gif|webp|svg|jfif)$/i.test(file)
      );
      
      let totalSize = 0;
      for (const file of imageFiles) {
        const filePath = path.join(this.localUploadsDir, file);
        const stats = fs.statSync(filePath);
        totalSize += stats.size;
      }
      
      return {
        count: imageFiles.length,
        totalSizeMB: Math.round(totalSize / (1024 * 1024) * 100) / 100
      };
    } catch (error) {
      return { count: 0, totalSizeMB: 0 };
    }
  }
}

export const imageSyncService = new ImageSyncService();