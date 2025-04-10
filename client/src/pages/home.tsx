import { useQuery } from "@tanstack/react-query";
import { PortfolioGrid, PortfolioGridSkeleton } from "@/components/portfolio-grid";
import { CategoryFilter } from "@/components/category-filter";
import { Layout } from "@/components/layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, User } from "lucide-react";
import type { PortfolioItem } from "@shared/schema";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState<PortfolioItem[]>([]);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [selectedAuthor, setSelectedAuthor] = useState<string | null>(null);
  const [, setLocation] = useLocation();
  
  // Get URL parameters on component mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const authorParam = params.get('author');
    if (authorParam) {
      setSelectedAuthor(authorParam);
    }
  }, []);

  // Debounce search query to avoid too many filter operations
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300) as unknown as number;

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: items, isLoading } = useQuery<PortfolioItem[]>({
    queryKey: ["/api/items", selectedCategory],
    queryFn: async ({ queryKey }) => {
      const category = queryKey[1] as string | null;
      const url = category && typeof category === 'string'
        ? `/api/items?category=${encodeURIComponent(category)}`
        : "/api/items";
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch items");
      return response.json();
    },
  });

  // Filter items based on search query and selected author
  useEffect(() => {
    if (!items) return;

    let filtered = [...items];
    
    // Filter by author if selected
    if (selectedAuthor) {
      filtered = filtered.filter(item => 
        item.author && item.author.toLowerCase() === selectedAuthor.toLowerCase()
      );
    }
    
    // Then filter by search query
    if (debouncedSearchQuery) {
      const query = debouncedSearchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(query) || 
        item.description.toLowerCase().includes(query) ||
        (item.tags && item.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    }
    
    setFilteredItems(filtered);
  }, [items, debouncedSearchQuery, selectedAuthor]);

  return (
    <Layout>
      <h1 className="text-4xl font-bold mb-8">Featured Work</h1>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        {/* Left side: Category filter */}
        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
        />
        
        {/* Right side: Search input */}
        <div className="relative w-full md:w-72">
          <Input
            type="text"
            placeholder="Search title, description, tags..."
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
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </Button>
          ) : (
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </div>
      
      {/* Show active author filter if any */}
      {selectedAuthor && (
        <div className="mb-4 flex items-center">
          <Badge variant="secondary" className="flex gap-2 py-1.5 pl-2">
            <User className="h-4 w-4" />
            <span>Author: {selectedAuthor}</span>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-5 w-5 -mr-1.5 hover:bg-muted" 
              onClick={() => {
                setSelectedAuthor(null);
                setLocation("/"); // Clear the URL parameter
              }}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        </div>
      )}
      
      {isLoading ? (
        <PortfolioGridSkeleton />
      ) : (
        <>
          {/* Show search results if searching */}
          {debouncedSearchQuery && (
            <p className="mb-4 text-sm text-muted-foreground">
              Found {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'} 
              matching "{debouncedSearchQuery}"
            </p>
          )}
          
          {/* Show author filter results if no items found */}
          {selectedAuthor && filteredItems.length === 0 && !debouncedSearchQuery && (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">
                No works found by author "{selectedAuthor}".
              </p>
            </div>
          )}
          
          <PortfolioGrid items={filteredItems.length > 0 ? filteredItems : (items || [])} />
        </>
      )}
    </Layout>
  );
}