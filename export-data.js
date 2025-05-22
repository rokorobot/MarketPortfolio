import { Pool } from 'pg';
import fs from 'fs';

// Development database (source)
const devPool = new Pool({ 
  connectionString: process.env.DATABASE_URL
});

// Production database (destination)
const prodPool = new Pool({
  connectionString: 'postgresql://nftfolio_user:r4lPj6IPQsnSDRV8LgOozwJ4mggnWOsi@dpg-d0npfdruibrs738s6fsg-a/nftfolio',
  ssl: { rejectUnauthorized: false }
});

async function exportAndImportData() {
  try {
    console.log('🔄 Starting data migration...');

    // Export data from development database
    console.log('📤 Exporting data from development database...');
    
    const users = await devPool.query('SELECT * FROM users');
    const categories = await devPool.query('SELECT * FROM categories ORDER BY id');
    const portfolioItems = await devPool.query('SELECT * FROM portfolio_items ORDER BY id');
    const siteSettings = await devPool.query('SELECT * FROM site_settings ORDER BY id');

    console.log(`📊 Found data to migrate:
    - ${users.rows.length} users
    - ${categories.rows.length} categories  
    - ${portfolioItems.rows.length} portfolio items
    - ${siteSettings.rows.length} site settings`);

    // Clear production database first (only existing tables)
    console.log('🧹 Clearing production database...');
    await prodPool.query('TRUNCATE TABLE portfolio_items, categories, users, site_settings RESTART IDENTITY CASCADE');

    // Import users first (referenced by other tables)
    console.log('👥 Importing users...');
    for (const user of users.rows) {
      await prodPool.query(`
        INSERT INTO users (username, password, email, first_name, last_name, bio, profile_image_url, role, display_name, tezos_wallet_address, ethereum_wallet_address, website, twitter, instagram, created_at, updated_at, is_active, profile_image, is_email_verified, verification_token, reset_password_token, reset_password_expires)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)
      `, [user.username, user.password, user.email, user.first_name, user.last_name, user.bio, user.profile_image_url, user.role, user.display_name, user.tezos_wallet_address, user.ethereum_wallet_address, user.website, user.twitter, user.instagram, user.created_at, user.updated_at, user.is_active, user.profile_image, user.is_email_verified, user.verification_token, user.reset_password_token, user.reset_password_expires]);
    }

    // Import categories
    console.log('📂 Importing categories...');
    for (const category of categories.rows) {
      await prodPool.query(`
        INSERT INTO categories (name, description, created_at, created_by_id, image_url, display_order)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [category.name, category.description, category.created_at, category.created_by_id, category.image_url, category.display_order]);
    }

    // Import portfolio items
    console.log('🎨 Importing portfolio items...');
    for (const item of portfolioItems.rows) {
      await prodPool.query(`
        INSERT INTO portfolio_items (title, description, image_url, category, marketplace_url1, marketplace_url2, marketplace_name1, marketplace_name2, tags, author, author_url, created_at, updated_at, author_profile_image, display_order, user_id, external_id, external_source, external_metadata, marketplace_url, marketplace_name, price, currency, is_sold, date_created, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26)
      `, [item.title, item.description, item.image_url, item.category, item.marketplace_url1, item.marketplace_url2, item.marketplace_name1, item.marketplace_name2, item.tags, item.author, item.author_url, item.created_at, item.updated_at, item.author_profile_image, item.display_order, item.user_id, item.external_id, item.external_source, item.external_metadata, item.marketplace_url, item.marketplace_name, item.price, item.currency, item.is_sold, item.date_created, item.status]);
    }

    // Import site settings
    console.log('⚙️ Importing site settings...');
    for (const setting of siteSettings.rows) {
      await prodPool.query(`
        INSERT INTO site_settings (key, value, created_at, updated_at)
        VALUES ($1, $2, $3, $4)
      `, [setting.key, setting.value, setting.created_at, setting.updated_at]);
    }

    console.log('✅ Data migration completed successfully!');
    console.log('🚀 Your portfolio is now live with all your curated collections!');

  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await devPool.end();
    await prodPool.end();
  }
}

exportAndImportData();