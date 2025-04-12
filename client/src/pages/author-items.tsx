import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { PortfolioGrid, PortfolioGridSkeleton } from "@/components/portfolio-grid";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PortfolioItem } from "@shared/schema";

export default function AuthorItemsPage() {
  const [, params] = useRoute<{ authorName: string }>("/items/author/:authorName");
  const authorName = params?.authorName ? decodeURIComponent(params.authorName) : "";
  const { toast } = useToast();

  const { data: items, isLoading, error } = useQuery<PortfolioItem[]>({
    queryKey: [`/api/items/author/${encodeURIComponent(authorName)}`],
    enabled: !!authorName,
    onSuccess: (data) => {
      console.log(`Loaded ${data.length} items for author ${authorName}`);
    },
    onError: () => {
      toast({
        title: "Error loading items",
        description: "Failed to load items for this author. Please try again later.",
        variant: "destructive",
      });
    },
  });

  if (!authorName) {
    return (
      <Layout>
        <div className="container py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Author not specified</h1>
          <Link href="/authors">
            <Button>View All Authors</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
          <div>
            <Link href="/authors">
              <Button variant="ghost" className="mb-2 px-0">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Authors
              </Button>
            </Link>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <User className="h-6 w-6" />
              <span>{authorName}</span>
            </h1>
          </div>
        </div>

        {isLoading ? (
          <PortfolioGridSkeleton />
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">{(error as Error).message}</p>
          </div>
        ) : items && items.length > 0 ? (
          <PortfolioGrid items={items} />
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No items found for this author.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}