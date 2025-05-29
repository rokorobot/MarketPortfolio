import { db } from "./db";
import { categories, portfolioItems } from "@shared/schema";
import { eq } from "drizzle-orm";
import { fetchObjktCollectionProfile } from './objkt-service';

/**
 * Migration script to update collections with authentic descriptions from OBJKT
 * This fixes collections that have the generic "Collection imported from Tezos blockchain" description
 */
export async function migrateCollectionDescriptions() {
  console.log("Starting collection description migration...");
  
  try {
    // Get all categories with the generic description
    const collectionsToUpdate = await db
      .select()
      .from(categories)
      .where(eq(categories.description, "Collection imported from Tezos blockchain"));

    console.log(`Found ${collectionsToUpdate.length} collections with generic descriptions`);

    for (const collection of collectionsToUpdate) {
      try {
        console.log(`Processing collection: ${collection.name}`);
        
        // Get items from this collection to find contract address
        const items = await db
          .select()
          .from(portfolioItems)
          .where(eq(portfolioItems.category, collection.name))
          .limit(1);

        if (items.length === 0) {
          console.log(`No items found for collection: ${collection.name}`);
          continue;
        }

        // Parse metadata to get contract address
        const metadata = JSON.parse(items[0].externalMetadata || '{}');
        const contractAddress = metadata.collection?.address;

        if (!contractAddress || !contractAddress.startsWith('KT1')) {
          console.log(`No valid contract address for collection: ${collection.name}`);
          continue;
        }

        console.log(`Fetching OBJKT data for contract: ${contractAddress}`);
        
        // Fetch authentic collection data from OBJKT
        const profileData = await fetchObjktCollectionProfile(contractAddress);
        
        if (profileData && profileData.description) {
          // Update the collection description
          await db
            .update(categories)
            .set({ 
              description: profileData.description,
              // Also update name and image if they've improved
              ...(profileData.name && { name: profileData.name }),
              ...(profileData.collectionImage && { imageUrl: profileData.collectionImage })
            })
            .where(eq(categories.id, collection.id));

          // If the name changed, update all portfolio items to use the new name
          if (profileData.name && profileData.name !== collection.name) {
            await db
              .update(portfolioItems)
              .set({ category: profileData.name })
              .where(eq(portfolioItems.category, collection.name));

            console.log(`Updated collection "${collection.name}" -> "${profileData.name}" with authentic description`);
          } else {
            console.log(`Updated description for collection: ${collection.name}`);
          }
        } else {
          console.log(`No authentic description found for collection: ${collection.name}`);
        }

        // Add small delay to avoid overwhelming the API
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        console.error(`Error processing collection ${collection.name}:`, error);
      }
    }
    
    console.log("Collection description migration completed successfully!");
    return { 
      success: true, 
      message: `Updated descriptions for ${collectionsToUpdate.length} collections`,
      updatedCount: collectionsToUpdate.length
    };
  } catch (error) {
    console.error("Error during collection description migration:", error);
    throw error;
  }
}