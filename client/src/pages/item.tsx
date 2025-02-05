import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink, Tag } from "lucide-react";
import type { PortfolioItem } from "@shared/schema";
import { Badge } from "@/components/ui/badge";

export default function Item() {
  const [, params] = useRoute("/item/:id");
  const { data: item, isLoading } = useQuery<PortfolioItem>({
    queryKey: [`/api/items/${params?.id}`],
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-6">
              <Skeleton className="aspect-[16/9] w-full rounded-lg" />
              <Skeleton className="h-8 w-1/2 mt-6" />
              <Skeleton className="h-4 w-full mt-4" />
              <div className="grid grid-cols-2 gap-4 mt-6">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  if (!item) return null;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="p-6">
            {/* Large Image Section */}
            <div className="aspect-[16/9] relative overflow-hidden rounded-lg">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Title and Category */}
            <div className="mt-6 flex items-center justify-between">
              <h1 className="text-3xl font-bold">{item.title}</h1>
              <Badge variant="secondary" className="text-sm">
                <Tag className="w-4 h-4 mr-1" />
                {item.category}
              </Badge>
            </div>

            {/* Description */}
            <p className="text-lg text-muted-foreground mt-4">{item.description}</p>

            {/* Marketplace Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {item.marketplaceUrl1 && (
                <Button asChild size="lg" className="w-full">
                  <a href={item.marketplaceUrl1} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-5 w-5" />
                    View on {item.marketplaceName1}
                  </a>
                </Button>
              )}
              {item.marketplaceUrl2 && (
                <Button asChild size="lg" variant="secondary" className="w-full">
                  <a href={item.marketplaceUrl2} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-5 w-5" />
                    View on {item.marketplaceName2}
                  </a>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}