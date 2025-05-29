import axios from 'axios';
import { JSDOM } from 'jsdom';
import crypto from 'crypto';

/**
 * Fetch author profile image from OBJKT API using Tezos address
 * @param tezosAddress - The Tezos address (tz1...)
 * @returns Promise with the IPFS profile image URL or null
 */
export async function fetchObjktAuthorProfileImage(tezosAddress: string): Promise<string | null> {
  if (!tezosAddress || !tezosAddress.startsWith('tz1')) {
    return null;
  }

  try {
    console.log('Fetching author profile from OBJKT for address:', tezosAddress);
    
    // Try OBJKT v2 API first
    try {
      const v2Response = await axios.get(`https://data.objkt.com/v2/accounts/${tezosAddress}`);
      console.log('V2 API response for', tezosAddress, ':', JSON.stringify(v2Response.data, null, 2));
      
      if (v2Response.data?.avatar) {
        const avatarUri = v2Response.data.avatar;
        console.log('Found avatar in V2 API:', avatarUri);
        // Convert IPFS URI to HTTP URL if needed
        if (avatarUri.startsWith('ipfs://')) {
          return `https://ipfs.io/ipfs/${avatarUri.replace('ipfs://', '')}`;
        }
        return avatarUri;
      }
    } catch (v2Error) {
      console.log(`V2 API failed for ${tezosAddress}:`, v2Error.message);
      console.log('Trying GraphQL...');
    }

    // Fallback to GraphQL query
    const query = `
      query GetUser($address: String!) {
        user(where: {address: {_eq: $address}}) {
          address
          name
          description
          avatar_uri
        }
      }
    `;

    const response = await axios.post('https://data.objkt.com/v3/graphql', {
      query,
      variables: { address: tezosAddress }
    });

    if (response.data?.data?.user?.[0]?.avatar_uri) {
      const avatarUri = response.data.data.user[0].avatar_uri;
      
      // Convert IPFS URI to HTTP URL if needed
      if (avatarUri.startsWith('ipfs://')) {
        return `https://ipfs.io/ipfs/${avatarUri.replace('ipfs://', '')}`;
      }
      
      return avatarUri;
    }

    console.log('No profile image found for address:', tezosAddress);
    return null;
  } catch (error) {
    console.error('Error fetching OBJKT author profile:', error);
    return null;
  }
}

/**
 * Extract author profile image from OBJKT.com profile URL or generate one
 * @param objktProfileUrl - The URL to an OBJKT.com profile
 * @returns Promise with the profile image URL or a generated one
 */
export async function extractObjktProfileImage(objktProfileUrl: string): Promise<string | null> {
  // If it's not an OBJKT URL or extraction fails, we'll fall back to generated avatar
  if (!objktProfileUrl || !objktProfileUrl.includes('objkt.com')) {
    console.log('Not an OBJKT.com URL, using fallback image generation:', objktProfileUrl);
    return generateAvatarFromName(getNameFromUrl(objktProfileUrl));
  }

  try {
    console.log('Attempting to fetch profile image from OBJKT.com URL:', objktProfileUrl);

    // Note: Since OBJKT.com uses client-side rendering, our server-side HTML scraping 
    // approach doesn't work reliably. Instead, we'll generate a consistent avatar
    // based on the profile URL, which ensures each author has a unique but consistent image.
    
    // Extract username from URL for better avatar generation
    const username = getNameFromUrl(objktProfileUrl);
    console.log('Extracted username for avatar generation:', username);
    
    // Generate avatar based on username
    const avatarUrl = generateAvatarFromName(username);
    
    console.log('Generated profile avatar for OBJKT user:', avatarUrl);
    return avatarUrl;
  } catch (error) {
    console.error('Error processing OBJKT.com profile image:', error);
    // Fall back to a generated avatar
    return generateAvatarFromName(getNameFromUrl(objktProfileUrl));
  }
}

/**
 * Extract username from OBJKT.com URL
 * @param url - The OBJKT.com profile URL
 * @returns Extracted username or a fallback
 */
function getNameFromUrl(url: string): string {
  if (!url) return 'unknown';
  
  try {
    // Handle different OBJKT URL formats
    if (url.includes('objkt.com/profile/')) {
      // Format: https://objkt.com/profile/username/created
      const parts = url.split('/');
      const profileIndex = parts.indexOf('profile');
      if (profileIndex >= 0 && profileIndex + 1 < parts.length) {
        return parts[profileIndex + 1];
      }
    } else if (url.includes('objkt.com/user/')) {
      // Format: https://objkt.com/user/username
      const parts = url.split('/');
      const userIndex = parts.indexOf('user');
      if (userIndex >= 0 && userIndex + 1 < parts.length) {
        return parts[userIndex + 1];
      }
    }
    
    // Fallback: extract last part of URL
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/').filter(p => p);
    if (pathParts.length > 0) {
      return pathParts[pathParts.length - 1];
    }
    
    // Last resort: use domain
    return urlObj.hostname;
  } catch (e) {
    console.error('Error parsing URL:', e);
    return 'unknown';
  }
}

/**
 * Generate a deterministic avatar URL based on name/username
 * @param name - The name to generate avatar for
 * @returns URL to a generated avatar
 */
function generateAvatarFromName(name: string): string {
  // Create a hash of the name for consistency
  const hash = crypto.createHash('md5').update(name || 'anonymous').digest('hex');
  
  // Create a vibrant color from the hash
  const hue = parseInt(hash.substring(0, 2), 16) % 360;
  const saturation = 80 + (parseInt(hash.substring(2, 4), 16) % 20);
  const lightness = 45 + (parseInt(hash.substring(4, 6), 16) % 10);
  
  // Use a reliable free avatar service - this one generates robot/monster avatars
  // using the hash as seed, ensuring consistency for the same username
  return `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(hash)}&backgroundColor=ffb8d9,b8c0ff,bbd0ff,c8b6ff&textureChance=50&mouthChance=100&sidesChance=50&scale=150&h=${hue}&s=${saturation}&l=${lightness}`;
}