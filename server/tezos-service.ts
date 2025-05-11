import axios from 'axios';
import { portfolioItems, InsertPortfolioItem } from '@shared/schema';
import { storage } from './storage';

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
 * Fetch NFTs owned by a Tezos wallet address
 * @param walletAddress - The Tezos wallet address
 * @returns Promise with an array of NFTs owned by the wallet
 */
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
      creatorImage = processIpfsUrl(metadata.creators[0].profile_image || metadata.creators[0].profileImage || '');
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
    
    collectionImage = processIpfsUrl(collectionImageUrl);
    
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

export async function fetchTezosNFTs(walletAddress: string): Promise<TezosNFT[]> {
  try {
    // Validate Tezos wallet address format
    if (!walletAddress.startsWith('tz1') && !walletAddress.startsWith('tz2') && !walletAddress.startsWith('tz3')) {
      throw new Error('Invalid Tezos wallet address format');
    }

    const url = `https://api.tzkt.io/v1/tokens/balances?account=${walletAddress}&token.standard=fa2&balance.ne=0`;
    const response = await axios.get(url);
    
    const nfts: TezosNFT[] = response.data.map((token: any) => {
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
    const collectionGroups = new Map<string, TezosNFT[]>();
    for (const nft of nfts) {
      if (nft.collection) {
        if (!collectionGroups.has(nft.collection)) {
          collectionGroups.set(nft.collection, []);
        }
        collectionGroups.get(nft.collection)?.push(nft);
      }
    }
    
    // For collections with no image, try to use an image from one of the NFTs
    for (const [collection, collectionNfts] of collectionGroups.entries()) {
      // Skip collections that already have images
      if (collectionNfts[0].collectionImage) continue;
      
      // Find the first NFT with an image
      const nftWithImage = collectionNfts.find(nft => nft.image);
      if (nftWithImage && nftWithImage.image) {
        // Use this image for all NFTs in this collection
        const collectionImage = nftWithImage.image;
        for (const nft of collectionNfts) {
          nft.collectionImage = collectionImage;
        }
      }
    }
    
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
 * @returns Promise with an array of imported portfolio items
 */
export async function importTezosNFTsToPortfolio(
  walletAddress: string, 
  userId: number,
  selectedNftIds?: string[]
): Promise<number> {
  try {
    const nfts = await fetchTezosNFTs(walletAddress);
    
    // Filter NFTs if specific ones were selected
    const nftsToImport = selectedNftIds 
      ? nfts.filter(nft => selectedNftIds.includes(nft.id))
      : nfts;
    
    let importedCount = 0;
    
    // Import each NFT as a portfolio item
    for (const nft of nftsToImport) {
      // Check if this NFT is already imported for this user
      const existingItems = await storage.getItemsByExternalId(nft.id, userId);
      
      if (existingItems.length === 0) {
        // Create a new portfolio item
        const portfolioItem: InsertPortfolioItem = {
          title: nft.name || 'Untitled NFT',
          description: nft.description || '',
          imageUrl: nft.image || '',
          category: 'NFT',
          tags: ['tezos', 'nft', nft.marketplace?.toLowerCase() || 'objkt'].filter(Boolean),
          author: nft.creator || 'Unknown Creator',
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
            tokenId: nft.tokenId
          }),
          userId: userId
        };
        
        await storage.createItem(portfolioItem, userId);
        importedCount++;
      }
    }
    
    return importedCount;
  } catch (error: any) {
    console.error('Error importing Tezos NFTs to portfolio:', error);
    throw new Error(`Failed to import NFTs: ${error.message}`);
  }
}