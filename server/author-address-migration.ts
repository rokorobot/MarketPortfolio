import { db } from "./db";
import { portfolioItems } from "@shared/schema";
import { eq, like } from "drizzle-orm";
import { fetchObjktAuthorProfile } from "./objkt-service";

/**
 * Migration script to update truncated Tezos addresses with full addresses
 * and fetch profile images from OBJKT
 */
export async function migrateAuthorAddresses() {
  console.log("Starting author address migration...");
  
  try {
    // Get all items with truncated Tezos addresses
    const itemsWithTruncatedAddresses = await db
      .select()
      .from(portfolioItems)
      .where(like(portfolioItems.author, "tz1%...%"));

    console.log(`Found ${itemsWithTruncatedAddresses.length} items with truncated addresses`);

    for (const item of itemsWithTruncatedAddresses) {
      try {
        // Parse external metadata to get full address
        const metadata = JSON.parse(item.externalMetadata || '{}');
        const fullAddress = metadata.creator?.address;
        
        if (fullAddress && fullAddress.startsWith('tz1') && fullAddress.length > 20) {
          console.log(`Updating ${item.author} -> ${fullAddress}`);
          
          // Update the author field with full address
          await db
            .update(portfolioItems)
            .set({ author: fullAddress })
            .where(eq(portfolioItems.id, item.id));
          
          // Try to fetch profile image from OBJKT
          try {
            const profileImage = await fetchObjktAuthorProfileImage(fullAddress);
            if (profileImage) {
              await db
                .update(portfolioItems)
                .set({ authorProfileImage: profileImage })
                .where(eq(portfolioItems.id, item.id));
              
              console.log(`✓ Updated profile image for ${fullAddress}`);
            }
          } catch (error) {
            console.log(`⚠ Could not fetch profile image for ${fullAddress}:`, error);
          }
        }
      } catch (error) {
        console.error(`Error processing item ${item.id}:`, error);
      }
    }
    
    console.log("Author address migration completed successfully!");
  } catch (error) {
    console.error("Error during author address migration:", error);
    throw error;
  }
}