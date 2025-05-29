import { db } from "./db";
import { portfolioItems, categories } from "@shared/schema";
import { eq, like } from "drizzle-orm";

/**
 * Migration script to update truncated collection names with full contract addresses
 */
export async function migrateCollectionAddresses() {
  console.log("Starting collection address migration...");
  
  try {
    // Get all items with truncated collection addresses
    const itemsWithTruncatedCollections = await db
      .select()
      .from(portfolioItems)
      .where(like(portfolioItems.category, "Collection KT1%...%"));

    console.log(`Found ${itemsWithTruncatedCollections.length} items with truncated collection addresses`);

    for (const item of itemsWithTruncatedCollections) {
      try {
        // Parse external metadata to get full contract address
        const metadata = JSON.parse(item.externalMetadata || '{}');
        const fullContractAddress = metadata.collection?.address;
        
        if (fullContractAddress && fullContractAddress.startsWith('KT1') && fullContractAddress.length > 20) {
          console.log(`Updating collection ${item.category} -> ${fullContractAddress}`);
          
          // Update the category field with the full contract address
          await db
            .update(portfolioItems)
            .set({ category: fullContractAddress })
            .where(eq(portfolioItems.category, item.category));
          
          // Also update the categories table to match
          await db
            .update(categories)
            .set({ name: fullContractAddress })
            .where(eq(categories.name, item.category));
          
          console.log(`Successfully updated collection: ${item.category} -> ${fullContractAddress}`);
        } else {
          console.log(`No valid contract address found for ${item.category}`);
        }
      } catch (error) {
        console.error(`Error processing item ${item.id}:`, error);
      }
    }
    
    console.log("Collection address migration completed successfully!");
    return { success: true, message: "Collection addresses updated successfully" };
  } catch (error) {
    console.error("Error during collection migration:", error);
    throw error;
  }
}