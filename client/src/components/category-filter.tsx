import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import type { CategoryModel } from "@shared/schema";

interface CategoryFilterProps {
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
}

export function CategoryFilter({ selectedCategory, onCategorySelect }: CategoryFilterProps) {
  // Get all category options (combined from database and hardcoded)
  const { data: categoryOptions, isLoading } = useQuery<string[]>({
    queryKey: ["/api/category-options"],
    initialData: [], // Default to empty array if no data
  });

  if (isLoading || !categoryOptions) {
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
      {categoryOptions.map((category) => (
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
