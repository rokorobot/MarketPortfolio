import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import type { CategoryModel } from "@shared/schema";
import { useEffect, useState } from "react";

interface CategoryFilterProps {
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
}

// Empty fallback categories list
const DEFAULT_CATEGORIES: string[] = [];

export function CategoryFilter({ selectedCategory, onCategorySelect }: CategoryFilterProps) {
  const [displayCategories, setDisplayCategories] = useState<string[]>([]);
  
  // Get all category options (combined from database and hardcoded)
  const { data: categoryOptions, isLoading, isError } = useQuery<string[]>({
    queryKey: ["/api/category-options"],
  });
  
  useEffect(() => {
    console.log("API category options:", categoryOptions);
    
    // If we have data from API, use it
    if (categoryOptions && categoryOptions.length > 0) {
      setDisplayCategories(categoryOptions);
    } else if (isError || !categoryOptions) {
      // Fallback to default categories if API fails or returns empty
      setDisplayCategories(DEFAULT_CATEGORIES);
    }
  }, [categoryOptions, isError]);

  if (isLoading && displayCategories.length === 0) {
    return <div className="text-sm text-muted-foreground">Loading categories...</div>;
  }

  return (
    <div className="flex items-center gap-3 mb-6">
      <Button
        variant={selectedCategory === null ? "default" : "outline"}
        onClick={() => onCategorySelect(null)}
        className="font-semibold"
      >
        All
      </Button>
      
      {/* Collection dropdown selector */}
      <div className="relative">
        <select 
          className="pl-4 pr-10 py-2 border-2 rounded-md focus:outline-none appearance-none bg-background border-input focus:border-ring text-sm"
          value={selectedCategory || ""}
          onChange={(e) => onCategorySelect(e.target.value || null)}
        >
          <option value="">Select Collection...</option>
          {displayCategories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-foreground">
          <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
    </div>
  );
}
