import axios from 'axios';
import { portfolioItems, InsertPortfolioItem, InsertCategory } from '@shared/schema';
import { storage } from './storage';

/**
 * Clean up a collection name, especially for wallet/contract addresses
 * @param name - The original collection name
 * @returns A cleaner, more user-friendly name
 */
function cleanCollectionName(name: string): string {
  // Check if it looks like a wallet or contract address
  if (name.startsWith('KT1') || name.startsWith('tz1') || name.startsWith('tz2') || name.startsWith('tz3')) {
    // If it's a long address, shorten it for display
    // Return "Collection" followed by shortened address
    return `Collection ${name.substring(0, 5)}...${name.substring(name.length - 4)}`;
  }
  
  // Return the original name if it's not an address
  return name;
}

export interface TezosNFT {
  id: string;
  name?: string;
  description?: string;
  image?: string;
  contract?: string;
  tokenId?: string;
  creator?: string;
  creatorName?: string;
  creatorAddress?: string;
  creatorImage?: string;
  collection?: string;
  collectionName?: string;
  collectionImage?: string;
  collectionAddress?: string;
  marketplace?: string;
  marketplaceUrl?: string;
}

/**
 * Process IPFS URL to get a usable HTTP URL
 * @param ipfsUrl - IPFS URL to process
 * @returns HTTP URL for the IPFS content
 */
function processIpfsUrl(ipfsUrl: string | undefined): string | undefined {
  if (!ipfsUrl) return undefined;
  
  if (ipfsUrl.startsWith('ipfs://')) {
    return ipfsUrl.replace('ipfs://', 'https://ipfs.io/ipfs/');
  }
  
  return ipfsUrl;
}

/**
 * Get information about a creator from various metadata sources
 * @param metadata - NFT metadata object
 * @returns Structured creator information
 */
function extractCreatorInfo(metadata: any): { 
  creator: string, 
  creatorName?: string, 
  creatorAddress?: string,
  creatorImage?: string 
} {
  // Try to get creator from various metadata fields
  const creatorAddress = metadata?.creators?.[0] || metadata?.creator || metadata?.minter || '';
  let creatorName = '';
  let creatorImage = '';
  
  // Check if there's a creators array with detailed info
  if (Array.isArray(metadata?.creators) && metadata.creators.length > 0) {
    if (typeof metadata.creators[0] === 'object') {
      creatorName = metadata.creators[0].name || metadata.creators[0].alias || '';
      const imageUrl = processIpfsUrl(metadata.creators[0].profile_image || metadata.creators[0].profileImage || '');
      creatorImage = imageUrl || '';
    }
  }
  
  // Check other possible metadata fields for creator name
  if (!creatorName) {
    creatorName = metadata?.artist || metadata?.author || '';
  }
  
  // If we have a Tezos address but no name, try to format it nicely
  if (!creatorName && creatorAddress && creatorAddress.startsWith('tz')) {
    // Shorten the address for display: tz1abc...xyz
    creatorName = `${creatorAddress.substring(0, 6)}...${creatorAddress.substring(creatorAddress.length - 4)}`;
  }
  
  return {
    creator: creatorName || creatorAddress || 'Unknown Creator',
    creatorName,
    creatorAddress,
    creatorImage
  };
}

/**
 * Extract collection information from token data
 * @param token - Token data from API
 * @returns Collection information
 */
function extractCollectionInfo(token: any): {
  collection?: string,
  collectionName?: string,
  collectionImage?: string,
  collectionAddress?: string
} {
  // Try to get collection info from various metadata fields
  let collectionAddress = token?.token?.contract?.address;
  let collectionName = '';
  let collectionImage = '';
  let collection = '';
  
  // Check common metadata fields for collection info
  if (token?.token?.metadata) {
    const metadata = token.token.metadata;
    
    // Common collection name fields
    collectionName = metadata?.collection_name || 
                     metadata?.collectionName ||
                     metadata?.collection?.name || 
                     metadata?.series || 
                     '';
    
    // Common collection image fields
    const collectionImageUrl = metadata?.collection_image || 
                             metadata?.collectionImage ||
                             metadata?.collection?.image ||
                             metadata?.collection?.thumbnail ||
                             '';
    
    const imageUrl = processIpfsUrl(collectionImageUrl);
    collectionImage = imageUrl || '';
    
    // If we have a name, use it as the collection identifier
    if (collectionName) {
      collection = collectionName;
    }
  }
  
  // If we still don't have a collection name but have a contract, use it
  if (!collectionName && collectionAddress) {
    // Try to get a friendly name from the contract alias if available
    collectionName = token?.token?.contract?.alias || 
                    `Collection ${collectionAddress.substring(0, 6)}...${collectionAddress.substring(collectionAddress.length - 4)}`;
  }
  
  // If we don't have a collection identifier yet, use the address
  if (!collection && collectionAddress) {
    collection = collectionAddress;
  }
  
  return {
    collection,
    collectionName,
    collectionImage,
    collectionAddress
  };
}

/**
 * Fetch NFTs owned by a Tezos wallet address with pagination support
 * @param walletAddress - The Tezos wallet address
 * @param limit - Optional maximum number of NFTs to fetch (default: 500)
 * @param offset - Optional starting position for fetching NFTs (default: 0)
 * @returns Promise with an array of NFTs owned by the wallet
 */
export async function fetchTezosNFTs(walletAddress: string, limit = 500, offset = 0): Promise<TezosNFT[]> {
  try {
    // Validate Tezos wallet address format
    if (!walletAddress.startsWith('tz1') && !walletAddress.startsWith('tz2') && !walletAddress.startsWith('tz3')) {
      throw new Error('Invalid Tezos wallet address format');
    }

    // Pagination parameters
    const pageSize = 100; // TzKT API default page size is 100
    const maxPages = Math.ceil(limit / pageSize);
    let allTokens: any[] = [];
    
    // Calculate starting page based on offset
    const startPage = Math.floor(offset / pageSize);
    let currentPage = startPage;
    let hasMorePages = true;
    
    console.log(`Fetching up to ${limit} NFTs for wallet ${walletAddress} starting from offset ${offset} (max ${maxPages} pages)...`);
    
    // Fetch tokens with pagination
    while (hasMorePages && currentPage < startPage + maxPages) {
      const pageOffset = currentPage * pageSize;
      const url = `https://api.tzkt.io/v1/tokens/balances?account=${walletAddress}&token.standard=fa2&balance.ne=0&offset=${pageOffset}&limit=${pageSize}`;
      
      console.log(`Fetching page ${currentPage + 1} (offset: ${pageOffset})...`);
      const response = await axios.get(url);
      
      if (response.data.length === 0) {
        hasMorePages = false;
      } else {
        allTokens = [...allTokens, ...response.data];
        currentPage++;
      }
      
      // Short delay to avoid rate limiting
      if (hasMorePages && currentPage < startPage + maxPages) {
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }
    
    console.log(`Successfully fetched ${allTokens.length} NFTs starting from offset ${offset}`);
    
    // Apply the real offset within the first page if needed
    if (offset > 0 && offset % pageSize !== 0) {
      const inPageOffset = offset % pageSize;
      allTokens = allTokens.slice(inPageOffset);
      console.log(`Applied in-page offset of ${inPageOffset}, resulting in ${allTokens.length} NFTs`);
    }
    
    // Limit the number of tokens according to requested limit
    if (allTokens.length > limit) {
      allTokens = allTokens.slice(0, limit);
      console.log(`Limited result to ${limit} NFTs as requested`);
    }
    
    const nfts: TezosNFT[] = allTokens.map((token: any) => {
      // Process IPFS URLs
      const imageUrl = processIpfsUrl(
        token.token?.metadata?.displayUri || 
        token.token?.metadata?.artifactUri || 
        token.token?.metadata?.thumbnailUri
      );
      
      // Determine marketplace link (OBJKT is common for Tezos)
      const objktUrl = token.token?.contract?.address && token.token?.tokenId 
        ? `https://objkt.com/asset/${token.token.contract.address}/${token.token.tokenId}`
        : undefined;
      
      // Extract creator information
      const { creator, creatorName, creatorAddress, creatorImage } = 
        extractCreatorInfo(token.token?.metadata);
        
      // Extract collection information
      const { collection, collectionName, collectionImage, collectionAddress } =
        extractCollectionInfo(token);
      
      return {
        id: `${token.token?.contract?.address}_${token.token?.tokenId}`,
        name: token.token?.metadata?.name || 'Untitled NFT',
        description: token.token?.metadata?.description || '',
        image: imageUrl,
        contract: token.token?.contract?.address,
        tokenId: token.token?.tokenId,
        creator,
        creatorName,
        creatorAddress,
        creatorImage,
        collection,
        collectionName,
        collectionImage,
        collectionAddress,
        marketplace: 'OBJKT',
        marketplaceUrl: objktUrl
      };
    });
    
    // Group NFTs by collection for additional processing
    const collections = new Map<string, TezosNFT[]>();
    nfts.forEach(nft => {
      if (nft.collection) {
        if (!collections.has(nft.collection)) {
          collections.set(nft.collection, []);
        }
        collections.get(nft.collection)?.push(nft);
      }
    });
    
    // For collections with no image, try to use an image from one of the NFTs
    collections.forEach((collectionNfts, collectionKey) => {
      // Skip collections that already have images
      if (collectionNfts[0].collectionImage) return;
      
      // Find the first NFT with an image
      const nftWithImage = collectionNfts.find(nft => nft.image);
      if (nftWithImage && nftWithImage.image) {
        // Use this image for all NFTs in this collection
        const collectionImage = nftWithImage.image;
        collectionNfts.forEach(nft => {
          nft.collectionImage = collectionImage;
        });
      }
    });
    
    return nfts;
  } catch (error: any) {
    console.error('Error fetching Tezos NFTs:', error);
    throw new Error(`Failed to fetch Tezos NFTs: ${error.message}`);
  }
}

/**
 * Import NFTs from Tezos to the portfolio
 * @param walletAddress - The Tezos wallet address
 * @param userId - The user ID to associate the NFTs with
 * @param selectedNftIds - Optional array of NFT IDs to import (if not provided, imports all)
 * @param limit - Optional maximum number of NFTs to fetch (default: 500)
 * @returns Promise with number of imported items
 */
export async function importTezosNFTsToPortfolio(
  walletAddress: string, 
  userId: number,
  selectedNftIds?: string[],
  limit = 500
): Promise<{imported: number, skipped: number, details: Array<{id: string, title: string, skipped: boolean}>}> {
  try {
    const nfts = await fetchTezosNFTs(walletAddress, limit);
    
    // Filter NFTs if specific ones were selected
    const nftsToImport = selectedNftIds 
      ? nfts.filter(nft => selectedNftIds.includes(nft.id))
      : nfts;
    
    let importedCount = 0;
    let skippedCount = 0;
    const importDetails: Array<{id: string, title: string, skipped: boolean}> = [];
    
    // Get existing categories to match with collections
    const existingCategories = await storage.getCategories();
    const categoryNames = new Set(existingCategories.map(c => c.name.toLowerCase()));
    
    // Track collections to create for any new collections found
    const newCollectionsMap = new Map<string, InsertCategory>();
    
    // Process collections first (so they can be assigned as categories)
    nftsToImport.forEach(nft => {
      if (nft.collectionName && 
          !categoryNames.has(nft.collectionName.toLowerCase()) && 
          !newCollectionsMap.has(nft.collectionName.toLowerCase())) {
        
        // Clean up the collection name if it's a contract address to make it more user-friendly
        let cleanName = nft.collectionName;
        if (cleanName.startsWith('KT1') || cleanName.startsWith('tz1') || cleanName.startsWith('tz2') || cleanName.startsWith('tz3')) {
          cleanName = `Collection ${cleanName.substring(0, 5)}...${cleanName.substring(cleanName.length - 4)}`;
        }
        
        newCollectionsMap.set(nft.collectionName.toLowerCase(), {
          name: cleanName,
          description: `Collection imported from Tezos blockchain`,
          imageUrl: nft.collectionImage || null,
          createdById: userId
        });
      }
    });
    
    // Create any new collections as categories
    const newCollections = Array.from(newCollectionsMap.values());
    for (const collection of newCollections) {
      try {
        await storage.createCategory(collection);
        console.log(`Created new category for collection: ${collection.name}`);
      } catch (error) {
        console.error(`Failed to create category for collection ${collection.name}:`, error);
      }
    }
    
    // Refresh categories after adding new ones
    const updatedCategories = await storage.getCategories();
    
    // Pre-check all NFTs to identify existing ones
    const existingNftMap = new Map<string, boolean>();
    
    // Get all existing NFT IDs for this user in a single efficient query
    const allExistingNftIds = await Promise.all(
      nftsToImport.map(nft => storage.getItemsByExternalId(nft.id, userId))
    );
    
    // Build a map of existing NFT IDs
    nftsToImport.forEach((nft, index) => {
      if (allExistingNftIds[index].length > 0) {
        existingNftMap.set(nft.id, true);
      }
    });
    
    console.log(`Found ${existingNftMap.size} already imported NFTs out of ${nftsToImport.length} selected`);
    
    // Import each NFT as a portfolio item
    for (const nft of nftsToImport) {
      const nftTitle = nft.name || 'Untitled NFT';
      
      // Check if this NFT is already imported for this user
      if (existingNftMap.has(nft.id)) {
        console.log(`Skipping already imported NFT: ${nftTitle} (ID: ${nft.id})`);
        skippedCount++;
        importDetails.push({
          id: nft.id,
          title: nftTitle,
          skipped: true
        });
        continue;
      }
      
      // Determine category - use collection name if available, otherwise "NFT"
      let category = 'NFT';
      if (nft.collectionName) {
        // Clean up the collection name if needed
        const cleanName = cleanCollectionName(nft.collectionName);
        
        // First, try to find an exact match with the cleaned name
        let matchedCategory = updatedCategories.find(
          c => c.name.toLowerCase() === cleanName.toLowerCase()
        );
        
        // If no match with clean name, try the original collection name
        if (!matchedCategory) {
          matchedCategory = updatedCategories.find(
            c => c.name.toLowerCase() === nft.collectionName?.toLowerCase()
          );
        }
        
        if (matchedCategory) {
          category = matchedCategory.name;
        }
      }
      
      // Build tags
      const tags = ['tezos', 'nft'];
      
      // Add marketplace to tags if available
      if (nft.marketplace?.toLowerCase()) {
        tags.push(nft.marketplace.toLowerCase());
      }
      
      // Add collection to tags if available and different from category
      if (nft.collectionName && nft.collectionName.toLowerCase() !== category.toLowerCase()) {
        tags.push(nft.collectionName);
      }
      
      // Use better creator name if available
      const author = nft.creatorName || nft.creator || 'Unknown Creator';
      
      // Create a new portfolio item
      const portfolioItem: InsertPortfolioItem = {
        title: nftTitle,
        description: nft.description || '',
        imageUrl: nft.image || '',
        category,
        tags: tags.filter(Boolean),
        author,
        dateCreated: new Date(),
        status: 'published',
        marketplaceUrl: nft.marketplaceUrl || '',
        marketplaceName: nft.marketplace || 'OBJKT',
        price: null,
        currency: 'XTZ',
        isSold: false,
        displayOrder: 0,
        externalId: nft.id,
        externalSource: 'tezos',
        externalMetadata: JSON.stringify({
          contract: nft.contract,
          tokenId: nft.tokenId,
          creator: {
            name: nft.creatorName,
            address: nft.creatorAddress,
            image: nft.creatorImage
          },
          collection: {
            name: nft.collectionName,
            address: nft.collectionAddress,
            image: nft.collectionImage
          }
        }),
        userId
      };
      
      await storage.createItem(portfolioItem, userId);
      importedCount++;
      
      importDetails.push({
        id: nft.id,
        title: nftTitle,
        skipped: false
      });
    }
    
    return {
      imported: importedCount,
      skipped: skippedCount,
      details: importDetails
    };
  } catch (error: any) {
    console.error('Error importing Tezos NFTs to portfolio:', error);
    throw new Error(`Failed to import NFTs: ${error.message}`);
  }
}