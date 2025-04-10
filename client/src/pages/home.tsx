import { useQuery } from "@tanstack/react-query";
import { PortfolioGrid, PortfolioGridSkeleton } from "@/components/portfolio-grid";
import { CategoryFilter } from "@/components/category-filter";
import { Layout } from "@/components/layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import type { PortfolioItem } from "@shared/schema";
import { useState, useEffect } from "react";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState<PortfolioItem[]>([]);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

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

  // Filter items based on search query
  useEffect(() => {
    if (!items) return;

    if (!debouncedSearchQuery) {
      setFilteredItems(items);
      return;
    }

    const query = debouncedSearchQuery.toLowerCase();
    const filtered = items.filter(item => 
      item.title.toLowerCase().includes(query) || 
      item.description.toLowerCase().includes(query) ||
      (item.tags && item.tags.some(tag => tag.toLowerCase().includes(query)))
    );
    
    setFilteredItems(filtered);
  }, [items, debouncedSearchQuery]);

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
            placeholder="Search items..."
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
      
      {isLoading ? (
        <PortfolioGridSkeleton />
      ) : (
        <>
          {debouncedSearchQuery && (
            <p className="mb-4 text-sm text-muted-foreground">
              Found {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'} 
              matching "{debouncedSearchQuery}"
            </p>
          )}
          <PortfolioGrid items={filteredItems.length > 0 ? filteredItems : (items || [])} />
        </>
      )}
    </Layout>
  );
}