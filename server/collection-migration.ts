import { db } from "./db";
import { portfolioItems, categories } from "@shared/schema";
import { eq, like } from "drizzle-orm";

/**
 * Migration script to update collections that show Tezos contract addresses (KT1/KT2) 
 * with proper collection names fetched from OBJKT
 */
export async function migrateCollectionAddresses() {
  console.log("Starting collection address migration...");
  
  try {
    // Get all categories that are just Tezos contract addresses (KT1... or KT2...)
    // These need to be updated with proper collection names from OBJKT
    const kt1Categories = await db
      .select()
      .from(categories)
      .where(like(categories.name, "KT1%"));
    
    const kt2Categories = await db
      .select()
      .from(categories)
      .where(like(categories.name, "KT2%"));
    
    const addressCategories = [...kt1Categories, ...kt2Categories];

    console.log(`Found ${addressCategories.length} collections with just Tezos addresses`);

    let updated = 0;
    let failed = 0;

    for (const category of addressCategories) {
      try {
        console.log(`Processing collection address: ${category.name}`);
        
        // Import OBJKT service to fetch proper collection name
        const { fetchObjktCollectionProfile } = await import('./objkt-service');
        
        // Try to fetch collection data from OBJKT using the contract address
        const objktData = await fetchObjktCollectionProfile(category.name);
        
        if (objktData && objktData.name && objktData.name !== category.name) {
          console.log(`Updating collection ${category.name} -> ${objktData.name}`);
          
          // Update the categories table with the proper name
          await db
            .update(categories)
            .set({ 
              name: objktData.name,
              description: objktData.description || category.description,
              imageUrl: objktData.collectionImage || category.imageUrl
            })
            .where(eq(categories.id, category.id));
          
          // Update all portfolio items that reference this category
          await db
            .update(portfolioItems)
            .set({ category: objktData.name })
            .where(eq(portfolioItems.category, category.name));
          
          console.log(`Successfully updated collection: ${category.name} -> ${objktData.name}`);
          updated++;
        } else {
          console.log(`No collection data found on OBJKT for ${category.name}`);
          failed++;
        }
      } catch (error) {
        console.error(`Error processing collection ${category.name}:`, error);
        failed++;
      }
    }
    
    console.log(`Collection address migration completed! Updated: ${updated}, Failed: ${failed}`);
    return { success: true, updated, failed, message: `Updated ${updated} collections, ${failed} failed` };
  } catch (error) {
    console.error("Error during collection migration:", error);
    throw error;
  }
}