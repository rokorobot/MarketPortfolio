import { Mail, Twitter, Instagram } from "lucide-react";
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
      <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-muted-foreground">
          © {currentYear} Portfolio Showcase. All rights reserved.
        </div>
        
        <div className="flex items-center space-x-6">
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
        
        <div className="flex items-center space-x-4 text-sm">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
            Home
          </Link>
          <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
            About
          </Link>
          <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}