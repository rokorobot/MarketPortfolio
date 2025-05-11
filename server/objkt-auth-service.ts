import axios from 'axios';

// OBJKT OAuth configuration
// Note: In a production environment, these would be stored as environment variables
const OBJKT_CLIENT_ID = 'nftfolio-app';
const OBJKT_CLIENT_SECRET = 'client_secret';  // This would be a real secret in production
const OBJKT_REDIRECT_URI = 'http://localhost:5000/import-nfts';
const OBJKT_AUTH_URL = 'https://objkt.com/oauth/authorize';
const OBJKT_TOKEN_URL = 'https://objkt.com/oauth/token';
const OBJKT_API_URL = 'https://objkt.com/api/v1';

/**
 * Generate an OAuth authorization URL for OBJKT
 * @returns The URL to redirect the user to for OBJKT authentication
 */
export function generateObjktAuthUrl(): string {
  const params = new URLSearchParams({
    client_id: OBJKT_CLIENT_ID,
    redirect_uri: OBJKT_REDIRECT_URI,
    response_type: 'code',
    scope: 'read_nfts',  // Scope to request read access to user's NFTs
  });

  return `${OBJKT_AUTH_URL}?${params.toString()}`;
}

/**
 * Exchange an OAuth code for an access token
 * @param code - The authorization code received from OBJKT
 * @returns Access token and user information
 */
export async function exchangeCodeForToken(code: string): Promise<{
  accessToken: string;
  refreshToken: string;
  profile: any;
}> {
  try {
    // Exchange the code for an access token
    const tokenResponse = await axios.post(OBJKT_TOKEN_URL, {
      grant_type: 'authorization_code',
      client_id: OBJKT_CLIENT_ID,
      client_secret: OBJKT_CLIENT_SECRET,
      code,
      redirect_uri: OBJKT_REDIRECT_URI,
    });

    const { access_token, refresh_token } = tokenResponse.data;

    // Fetch the user's profile
    const profileResponse = await axios.get(`${OBJKT_API_URL}/user/profile`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    return {
      accessToken: access_token,
      refreshToken: refresh_token,
      profile: profileResponse.data,
    };
  } catch (error: any) {
    console.error('Error exchanging code for token:', error.response?.data || error.message);
    throw new Error('Failed to authenticate with OBJKT');
  }
}

/**
 * Fetch user's NFTs from OBJKT
 * @param accessToken - The OAuth access token
 * @returns Array of NFTs owned by the user
 */
export async function fetchUserNfts(accessToken: string): Promise<any[]> {
  try {
    const response = await axios.get(`${OBJKT_API_URL}/user/nfts`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Process the NFTs to match our expected format
    const nfts = response.data.items.map((nft: any) => ({
      id: `${nft.fa2_address}_${nft.token_id}`,
      name: nft.name || 'Untitled NFT',
      description: nft.description || '',
      image: nft.display_uri || nft.artifact_uri || nft.thumbnail_uri,
      contract: nft.fa2_address,
      tokenId: nft.token_id,
      creator: nft.creator?.name || nft.artist_profile?.name || 'Unknown Creator',
      marketplace: 'OBJKT',
      marketplaceUrl: `https://objkt.com/asset/${nft.fa2_address}/${nft.token_id}`,
    }));

    return nfts;
  } catch (error: any) {
    console.error('Error fetching user NFTs:', error.response?.data || error.message);
    throw new Error('Failed to fetch NFTs from OBJKT');
  }
}

// Note: In a real implementation, you would store these tokens securely
// and handle token refresh when they expire
let tokenStore: Record<string, { accessToken: string; refreshToken: string }> = {};

/**
 * Store a user's OBJKT tokens
 * @param userId - The ID of the user in our system
 * @param tokens - The access and refresh tokens
 */
export function storeUserTokens(userId: number, tokens: { accessToken: string; refreshToken: string }): void {
  tokenStore[userId.toString()] = tokens;
}

/**
 * Get a user's stored OBJKT access token
 * @param userId - The ID of the user in our system
 * @returns The access token or null if not found
 */
export function getUserAccessToken(userId: number): string | null {
  const userTokens = tokenStore[userId.toString()];
  return userTokens?.accessToken || null;
}