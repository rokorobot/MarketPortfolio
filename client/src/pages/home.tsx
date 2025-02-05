import { useQuery } from "@tanstack/react-query";
import { PortfolioGrid, PortfolioGridSkeleton } from "@/components/portfolio-grid";
import { Layout } from "@/components/layout";
import type { PortfolioItem } from "@shared/schema";

export default function Home() {
  const { data: items, isLoading } = useQuery<PortfolioItem[]>({
    queryKey: ["/api/items"],
  });

  return (
    <Layout>
      <h1 className="text-4xl font-bold mb-8">Featured Work</h1>
      {isLoading ? <PortfolioGridSkeleton /> : items && <PortfolioGrid items={items} />}
    </Layout>
  );
}
