import { useQuery } from "@tanstack/react-query";
import { PortfolioGrid, PortfolioGridSkeleton } from "@/components/portfolio-grid";
import { CategoryFilter } from "@/components/category-filter";
import { Layout } from "@/components/layout";
import type { PortfolioItem } from "@shared/schema";
import { useState } from "react";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: items, isLoading } = useQuery<PortfolioItem[]>({
    queryKey: ["/api/items", selectedCategory],
    queryFn: async ({ queryKey }) => {
      const category = queryKey[1];
      const url = category 
        ? `/api/items?category=${encodeURIComponent(category)}`
        : "/api/items";
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch items");
      return response.json();
    },
  });

  return (
    <Layout>
      <h1 className="text-4xl font-bold mb-8">Featured Work</h1>
      <CategoryFilter
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
      />
      {isLoading ? <PortfolioGridSkeleton /> : items && <PortfolioGrid items={items} />}
    </Layout>
  );
}