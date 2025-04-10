import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import type { CategoryModel } from "@shared/schema";

interface CategoryFilterProps {
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
}

export function CategoryFilter({ selectedCategory, onCategorySelect }: CategoryFilterProps) {
  // Get categories from the database
  const { data: categories, isLoading } = useQuery<CategoryModel[]>({
    queryKey: ["/api/categories"],
    initialData: [], // Default to empty array if no data
  });

  // Get category options (hardcoded + from database)
  const { data: categoryOptions } = useQuery<string[]>({
    queryKey: ["/api/category-options"],
    initialData: [], // Default to empty array if no data
  });

  if (isLoading || (!categories && !categoryOptions)) return null;

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
