import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Layout } from "@/components/layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Tag, Eye, Twitter } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

interface SharedItem {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  tags: string[] | null;
  marketplaceUrl1: string | null;
  marketplaceUrl2: string | null;
  marketplaceName1: string | null;
  marketplaceName2: string | null;
  customTitle: string;
  customDescription: string;
  customImageUrl: string;
  shareCode: string;
  clicks: number;
}

export default function SharePage() {
  const [, params] = useRoute<{ shareCode: string }>("/share/:shareCode");
  const { toast } = useToast();
  
  const shareCode = params?.shareCode;
  
  const { data: item, isLoading, error } = useQuery<SharedItem>({
    queryKey: [`/api/share/${shareCode}`],
    enabled: !!shareCode,
  });
  
  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                <div className="md:col-span-7 relative">
                  <Skeleton className="w-full h-96" />
                </div>
                <div className="md:col-span-5">
                  <Skeleton className="h-10 w-3/4 mb-4" />
                  <Skeleton className="h-5 w-1/3 mb-8" />
                  <Skeleton className="h-4 w-full mt-6 mb-2" />
                  <Skeleton className="h-20 w-full mb-6" />
                  <Skeleton className="h-8 w-full mt-8 mb-2" />
                  <Skeleton className="h-8 w-full mt-3" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  if (error || !item) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto">
          <Card>
            <CardContent className="p-6 text-center">
              <h1 className="text-2xl font-bold mb-4">Share Link Not Found</h1>
              <p className="mb-6">This share link may have expired or been removed.</p>
              <Link href="/">
                <Button>Browse Portfolio</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  // Use custom values if available, otherwise use original item values
  const title = item.customTitle || item.title;
  const description = item.customDescription || item.description;
  const imageUrl = item.customImageUrl || item.imageUrl;
  
  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              {/* Left side - Large Image */}
              <div className="md:col-span-7 relative">
                <div className="sticky top-6">
                  <img
                    src={imageUrl}
                    alt={title}
                    className="object-contain w-full max-h-[700px] hover:scale-105 transition-transform duration-300 rounded-lg mx-auto"
                  />
                </div>
              </div>
              
              {/* Right side - Content */}
              <div className="md:col-span-5">
                {/* Shared banner */}
                <div className="bg-primary/10 px-4 py-2 rounded-lg mb-4 flex items-center text-sm">
                  <Eye className="w-4 h-4 mr-2 text-primary" />
                  <span>Shared portfolio item • {item.clicks} views</span>
                </div>
                
                {/* Title and Category */}
                <div className="mb-4">
                  <h1 className="text-3xl font-bold">{title}</h1>
                  <Badge variant="secondary" className="text-sm mt-2">
                    <Tag className="w-4 h-4 mr-1" />
                    {item.category}
                  </Badge>
                </div>

                {/* Description */}
                <div className="mt-6">
                  <h3 className="text-sm font-medium mb-2">Description</h3>
                  <p className="text-muted-foreground">{description}</p>
                </div>
                
                {/* Tags */}
                {item.tags && item.tags.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-sm font-medium mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs py-0">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Marketplace Links */}
                <div className="mt-8 space-y-3">
                  <h3 className="text-sm font-medium mb-3">Available on</h3>
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

                <Separator className="my-8" />
                
                {/* View original link */}
                <div className="flex flex-col space-y-3 items-center">
                  <Link href={`/item/${item.id}`}>
                    <Button variant="outline">
                      View Original Item
                    </Button>
                  </Link>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const text = `Check out "${title}" in this portfolio`;
                      const url = window.location.href;
                      const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
                      window.open(shareUrl, '_blank', 'noopener,noreferrer');
                    }}
                    className="mt-2"
                  >
                    <Twitter className="h-4 w-4 mr-2" />
                    Share on X
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}