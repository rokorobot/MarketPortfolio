import { useQuery } from "@tanstack/react-query";
import { PortfolioGrid, PortfolioGridSkeleton } from "@/components/portfolio-grid";
import { Layout } from "@/components/layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, Heart } from "lucide-react";
import type { PortfolioItem } from "@shared/schema";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Card } from "@/components/ui/card";

export default function Favorites() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState<PortfolioItem[]>([]);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const { user } = useAuth();
  
  // Fetch favorite items
  const { data: favoriteItems, isLoading } = useQuery<PortfolioItem[]>({
    queryKey: ["/api/favorites"],
    enabled: !!user, // Only run query if user is logged in
  });
  
  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchQuery]);
  
  // Filter items based on search query
  useEffect(() => {
    if (!favoriteItems) {
      setFilteredItems([]);
      return;
    }
    
    if (!debouncedSearchQuery) {
      setFilteredItems(favoriteItems);
      return;
    }
    
    const query = debouncedSearchQuery.toLowerCase();
    const filtered = favoriteItems.filter(item => {
      const titleMatch = item.title.toLowerCase().includes(query);
      const descriptionMatch = item.description.toLowerCase().includes(query);
      const authorMatch = item.author?.toLowerCase().includes(query) || false;
      
      // Check if any tag matches the search query
      const tagMatch = item.tags?.some(tag => 
        tag.toLowerCase().includes(query)
      ) || false;
      
      return titleMatch || descriptionMatch || authorMatch || tagMatch;
    });
    
    setFilteredItems(filtered);
  }, [favoriteItems, debouncedSearchQuery]);
  
  // If user is not logged in, show message
  if (!user) {
    return (
      <Layout>
        <div className="max-w-lg mx-auto text-center py-12">
          <Heart className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h1 className="text-3xl font-bold mb-2">My Favorites</h1>
          <p className="text-muted-foreground mb-6">
            Please sign in to view and manage your favorite items.
          </p>
          <Button onClick={() => window.location.href = '/auth'}>
            Sign In
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex items-center mb-8">
        <Heart className="h-8 w-8 mr-3 text-primary" />
        <h1 className="text-4xl font-bold">My Favorites</h1>
      </div>
      
      {/* Search input */}
      <div className="relative w-full md:w-72 mb-6">
        <Input
          type="text"
          placeholder="Search in your favorites..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pr-10"
        />
        {searchQuery ? (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full"
            onClick={() => setSearchQuery("")}
          >
            <X className="h-4 w-4" />
          </Button>
        ) : (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
        )}
      </div>
      
      {isLoading ? (
        <PortfolioGridSkeleton showShowcaseButton={false} />
      ) : filteredItems.length > 0 ? (
        <PortfolioGrid items={filteredItems} showShowcaseButton={false} />
      ) : (
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center justify-center">
            <Heart className="h-16 w-16 text-muted-foreground mb-4" />
            {debouncedSearchQuery ? (
              <>
                <h3 className="text-xl font-medium mb-2">No matching favorites found</h3>
                <p className="text-muted-foreground mb-4">
                  Try a different search term or browse all your favorites.
                </p>
                <Button variant="outline" onClick={() => setSearchQuery("")}>
                  Clear Search
                </Button>
              </>
            ) : (
              <>
                <h3 className="text-xl font-medium mb-2">You haven't added any favorites yet</h3>
                <p className="text-muted-foreground mb-4">
                  Click the heart icon on any portfolio item to add it to your favorites.
                </p>
                <Button onClick={() => window.location.href = '/'}>
                  Browse Portfolio
                </Button>
              </>
            )}
          </div>
        </Card>
      )}
    </Layout>
  );
}