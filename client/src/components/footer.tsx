import { Mail, Instagram } from "lucide-react";
import { XLogo } from "./x-logo";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";

export function Footer() {
  const currentYear = new Date().getFullYear();

  // Fetch site settings for social media links
  const { data: settings } = useQuery<Record<string, string | null>, Error>({
    queryKey: ['/api/site-settings'],
    queryFn: async () => {
      const res = await fetch('/api/site-settings');
      if (!res.ok) {
        return {};
      }
      return await res.json() as Record<string, string | null>;
    }
  });

  // Default social links if not configured
  const twitterUrl = settings?.twitter_url || "https://twitter.com";
  const instagramUrl = settings?.instagram_url || "https://instagram.com";
  const emailContact = settings?.email_contact || "contact@example.com";

  return (
    <footer className="mt-auto py-6 border-t">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Copyright - aligned with left part of showcased items */}
          <div className="text-sm text-muted-foreground order-2 md:order-1 text-center md:text-left">
            © {currentYear} Portfolio Showcase. All rights reserved.
          </div>
          
          {/* Social media icons - centered */}
          <div className="flex justify-center items-center space-x-6 order-1 md:order-2">
            {twitterUrl && (
              <a 
                href={twitterUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
            )}
            {instagramUrl && (
              <a 
                href={instagramUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
            )}
            {emailContact && (
              <a 
                href={`mailto:${emailContact}`} 
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Email"
              >
                <Mail size={20} />
              </a>
            )}
          </div>
          
          {/* Navigation links - right-aligned */}
          <div className="flex justify-center md:justify-end items-center space-x-4 text-sm order-3">
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            <Link href="/favorites" className="text-muted-foreground hover:text-foreground transition-colors">
              Favorites
            </Link>
            <Link href="/collections" className="text-muted-foreground hover:text-foreground transition-colors">
              Collections
            </Link>
            <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}