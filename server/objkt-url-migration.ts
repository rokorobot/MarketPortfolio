import { db } from "./db";
import { portfolioItems } from "@shared/schema";
import { eq, and, isNull } from "drizzle-orm";

/**
 * Migration script to add OBJKT marketplace URLs to existing imported NFTs
 * This adds the direct OBJKT page links for NFTs that were imported from Tezos
 */
export async function migrateObjktUrls() {
  console.log("Starting OBJKT URL migration...");
  
  try {
    // Get all items that were imported from Tezos but either don't have marketplace URLs 
    // or have old OBJKT format URLs that need updating
    const itemsToUpdate = await db
      .select()
      .from(portfolioItems)
      .where(eq(portfolioItems.externalSource, "tezos"));

    console.log(`Found ${itemsToUpdate.length} Tezos items to check for OBJKT URL updates`);

    let updatedCount = 0;

    for (const item of itemsToUpdate) {
      try {
        // Parse metadata to get contract and token ID
        const metadata = JSON.parse(item.externalMetadata || '{}');
        const contract = metadata.contract;
        const tokenId = metadata.tokenId;

        if (contract && tokenId) {
          const newObjktUrl = `https://objkt.com/tokens/${contract}/${tokenId}`;
          
          // Check if URL needs updating (either missing or using old format)
          const needsUpdate = !item.marketplaceUrl1 || 
                             item.marketplaceUrl1?.includes('/asset/') || 
                             item.marketplaceUrl1 !== newObjktUrl;
          
          if (needsUpdate) {
            // Update the item with new OBJKT URL format in the correct fields
            await db
              .update(portfolioItems)
              .set({ 
                marketplaceUrl1: newObjktUrl,
                marketplaceName1: 'OBJKT'
              })
              .where(eq(portfolioItems.id, item.id));

            console.log(`Updated item ${item.id} (${item.title}) with OBJKT URL: ${newObjktUrl}`);
            updatedCount++;
          }
        } else {
          console.log(`Missing contract/tokenId for item ${item.id}: ${item.title}`);
        }
        
      } catch (error) {
        console.error(`Error processing item ${item.id}:`, error);
      }
    }
    
    console.log(`OBJKT URL migration completed successfully! Updated ${updatedCount} items.`);
    return { 
      success: true, 
      message: `Updated OBJKT URLs for ${updatedCount} imported NFTs`,
      updatedCount
    };
  } catch (error) {
    console.error("Error during OBJKT URL migration:", error);
    throw error;
  }
}