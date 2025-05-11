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
  marketplace?: string;
  marketplaceUrl?: string;
}

/**
 * Fetch NFTs owned by a Tezos wallet address
 * @param walletAddress - The Tezos wallet address
 * @returns Promise with an array of NFTs owned by the wallet
 */
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
      let imageUrl = token.token?.metadata?.displayUri || token.token?.metadata?.artifactUri || token.token?.metadata?.thumbnailUri;
      if (imageUrl && imageUrl.startsWith('ipfs://')) {
        imageUrl = imageUrl.replace('ipfs://', 'https://ipfs.io/ipfs/');
      }
      
      // Determine marketplace link (OBJKT is common for Tezos)
      const objktUrl = token.token?.contract?.address && token.token?.tokenId 
        ? `https://objkt.com/asset/${token.token.contract.address}/${token.token.tokenId}`
        : undefined;
      
      return {
        id: `${token.token?.contract?.address}_${token.token?.tokenId}`,
        name: token.token?.metadata?.name || 'Untitled NFT',
        description: token.token?.metadata?.description || '',
        image: imageUrl,
        contract: token.token?.contract?.address,
        tokenId: token.token?.tokenId,
        creator: token.token?.metadata?.creators?.[0] || token.token?.metadata?.creator || '',
        marketplace: 'OBJKT',
        marketplaceUrl: objktUrl
      };
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