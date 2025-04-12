import axios from 'axios';
import { JSDOM } from 'jsdom';

/**
 * Extract author profile image from OBJKT.com profile URL
 * @param objktProfileUrl - The URL to an OBJKT.com profile
 * @returns Promise with the profile image URL or null if not found
 */
export async function extractObjktProfileImage(objktProfileUrl: string): Promise<string | null> {
  try {
    // Validate if the URL is from OBJKT.com
    if (!objktProfileUrl || !objktProfileUrl.includes('objkt.com')) {
      console.log('Not an OBJKT.com URL:', objktProfileUrl);
      return null;
    }

    console.log('Fetching profile image from OBJKT.com URL:', objktProfileUrl);

    // Fetch the HTML content of the profile page
    const response = await axios.get(objktProfileUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (response.status !== 200) {
      console.log('Failed to fetch OBJKT.com profile, status:', response.status);
      return null;
    }

    const html = response.data;
    
    // Use JSDOM to parse the HTML content
    const dom = new JSDOM(html);
    const document = dom.window.document;

    // Look for the profile image in typical locations on OBJKT.com
    // This selector might need adjustment if OBJKT.com changes their HTML structure
    const profileImageElement = document.querySelector('img[alt="avatar"]') ||
                               document.querySelector('img.avatar') ||
                               document.querySelector('.profile-avatar img') ||
                               document.querySelector('.user-profile img');

    if (profileImageElement) {
      const imageUrl = profileImageElement.getAttribute('src');
      if (imageUrl) {
        // If it's a relative URL, convert to absolute
        if (imageUrl.startsWith('/')) {
          return `https://objkt.com${imageUrl}`;
        }
        return imageUrl;
      }
    }

    console.log('Profile image not found on OBJKT.com page');
    return null;
  } catch (error) {
    console.error('Error extracting profile image from OBJKT.com:', error);
    return null;
  }
}