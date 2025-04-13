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
  
  // Use a CORS proxy for OBJKT.com images
  if (url.includes('objkt.com')) {
    return `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
  }
  
  // Return original URL for other sources
  return url;
}
