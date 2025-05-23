import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Processes an image URL to handle CORS issues, particularly for OBJKT.com images
 * @param url The original image URL
 * @returns A processed URL that can be used in img tags
 */
export function getProxiedImageUrl(url: string): string {
  if (!url) return '';
  
  // Replace OBJKT URLs with placeholder images
  if (url.includes('objkt.com') || url.includes('assets.objkt.media')) {
    // Return a placeholder image from placehold.co based on the original URL
    // Using a hash of the URL to get a consistent color for the same images
    const hash = stringToSimpleHash(url);
    const color = hashToColor(hash);
    
    // Get a descriptive name from the URL
    let nameText = "OBJKT";
    if (url.includes('collection')) {
      nameText = "Collection";
    } else if (url.includes('profile')) {
      nameText = "Profile";
    } else if (url.includes('thumb400')) {
      nameText = "Art";
    }
    
    // Create a placeholder image with the extracted name
    return `https://placehold.co/400x400/${color}/white?text=${nameText}`;
  }
  
  // Return original URL for other sources
  return url;
}

/**
 * Simple hash function to convert a string to a number
 * @param str Input string
 * @returns A simple numeric hash
 */
function stringToSimpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Convert a hash number to a hex color
 * @param hash Numeric hash
 * @returns Hex color string
 */
function hashToColor(hash: number): string {
  // Use the hash to generate a dark color
  const r = (hash & 0xFF) % 100; // Limit to darker colors (0-100)
  const g = ((hash >> 8) & 0xFF) % 100;
  const b = ((hash >> 16) & 0xFF) % 100;
  
  // Convert to hex
  return `${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}
