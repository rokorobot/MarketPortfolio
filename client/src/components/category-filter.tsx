import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import type { CategoryModel } from "@shared/schema";
import { useEffect } from "react";

interface CategoryFilterProps {
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
}

export function CategoryFilter({ selectedCategory, onCategorySelect }: CategoryFilterProps) {
  // Get categories from the database
  const { data: categories, isLoading: isLoadingCategories } = useQuery<CategoryModel[]>({
    queryKey: ["/api/categories"],
    initialData: [], // Default to empty array if no data
  });

  // Get category options (hardcoded + from database)
  const { data: categoryOptions, isLoading: isLoadingOptions } = useQuery<string[]>({
    queryKey: ["/api/category-options"],
    initialData: [], // Default to empty array if no data
  });

  // Debug to check what values we're getting
  useEffect(() => {
    console.log("Categories from API:", categories);
    console.log("Category options from API:", categoryOptions);
  }, [categories, categoryOptions]);

  if (isLoadingCategories || isLoadingOptions || (!categories && !categoryOptions)) {
    return <div className="text-sm text-muted-foreground">Loading categories...</div>;
  }

  return (
    <div className="flex gap-2 flex-wrap mb-6">
      <Button
        variant={selectedCategory === null ? "default" : "outline"}
        onClick={() => onCategorySelect(null)}
      >
        All
      </Button>
      {categoryOptions?.map((category) => (
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
