import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink } from "lucide-react";
import type { PortfolioItem } from "@shared/schema";

export default function Item() {
  const [, params] = useRoute("/item/:id");
  const { data: item, isLoading } = useQuery<PortfolioItem>({
    queryKey: [`/api/items/${params?.id}`],
  });

  if (isLoading) {
    return (
      <Layout>
        <Card>
          <CardContent className="p-6">
            <Skeleton className="aspect-[16/9] w-full rounded-lg" />
            <Skeleton className="h-8 w-1/2 mt-4" />
            <Skeleton className="h-4 w-full mt-4" />
          </CardContent>
        </Card>
      </Layout>
    );
  }

  if (!item) return null;

  return (
    <Layout>
      <Card>
        <CardContent className="p-6">
          <div className="aspect-[16/9] relative overflow-hidden rounded-lg">
            <img
              src={item.imageUrl}
              alt={item.title}
              className="object-cover w-full h-full"
            />
          </div>
          <h1 className="text-3xl font-bold mt-6">{item.title}</h1>
          <p className="text-lg text-muted-foreground mt-4">{item.description}</p>
          <div className="flex gap-4 mt-6">
            {item.marketplaceUrl1 && (
              <Button asChild className="flex-1">
                <a href={item.marketplaceUrl1} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View on {item.marketplaceName1}
                </a>
              </Button>
            )}
            {item.marketplaceUrl2 && (
              <Button asChild className="flex-1" variant="secondary">
                <a href={item.marketplaceUrl2} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View on {item.marketplaceName2}
                </a>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </Layout>
  );
}