import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import type { CategoryModel } from "@shared/schema";
import { useEffect, useState } from "react";

interface CategoryFilterProps {
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
}

// Hardcoded categories as a fallback
const DEFAULT_CATEGORIES = [
  "Digital Art", 
  "Photography", 
  "3D Models", 
  "Music", 
  "Collectibles", 
  "Gaming Assets"
];

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
    <div className="flex gap-2 flex-wrap mb-6">
      <Button
        variant={selectedCategory === null ? "default" : "outline"}
        onClick={() => onCategorySelect(null)}
        className="font-semibold"
      >
        All
      </Button>
      {displayCategories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? "default" : "outline"}
          onClick={() => onCategorySelect(category)}
        >
          {category}
        </Button>
      ))}
    </div>
  );
}
