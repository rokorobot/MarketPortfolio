import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import type { CategoryModel } from "@shared/schema";
import { useEffect, useState } from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

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
    <div className="flex gap-2 items-center mb-6">
      <Button
        variant={selectedCategory === null ? "default" : "outline"}
        onClick={() => onCategorySelect(null)}
        className="font-semibold"
      >
        All
      </Button>
      
      <Select
        value={selectedCategory || ""}
        onValueChange={(value) => {
          if (value) {
            onCategorySelect(value);
          }
        }}
      >
        <SelectTrigger className="w-[220px]">
          <SelectValue placeholder="Select collection" />
        </SelectTrigger>
        <SelectContent>
          {displayCategories.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
