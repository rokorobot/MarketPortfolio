import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { PortfolioGrid, PortfolioGridSkeleton } from "@/components/portfolio-grid";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PortfolioItem } from "@shared/schema";
import React from "react";

// Author type definition
interface Author {
  name: string;
  count: number;
  profileImage: string | null;
}

export default function AuthorItemsPage() {
  const [, params] = useRoute<{ authorName: string }>("/items/author/:authorName");
  const authorName = params?.authorName ? decodeURIComponent(params.authorName) : "";
  const { toast } = useToast();

  // Get author details (profile image and item count)
  const { data: authorDetails, isLoading: isLoadingAuthor, error: authorError } = useQuery<Author>({
    queryKey: [`/api/authors/${encodeURIComponent(authorName)}`],
    enabled: !!authorName,
  });
  
  // Handle author fetch error
  React.useEffect(() => {
    if (authorError) {
      toast({
        title: "Error",
        description: `Failed to load author details: ${(authorError as Error).message}`,
        variant: "destructive",
      });
    }
  }, [authorError, toast]);

  const { data: items, isLoading, error } = useQuery<PortfolioItem[]>({
    queryKey: [`/api/items/author/${encodeURIComponent(authorName)}`],
    enabled: !!authorName,
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
          <div className="w-full">
            <Link href="/authors">
              <Button variant="ghost" className="mb-2 px-0">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Authors
              </Button>
            </Link>
            
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mt-4 mb-8">
              {isLoadingAuthor ? (
                <div className="w-32 h-32 rounded-full bg-muted animate-pulse" />
              ) : (
                authorDetails?.profileImage ? (
                  <img 
                    src={authorDetails.profileImage} 
                    alt={`${authorName} profile`} 
                    className="w-32 h-32 rounded-full object-cover shadow-md"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center shadow-md">
                    <User className="h-16 w-16 text-muted-foreground/50" />
                  </div>
                )
              )}
              
              <div className="text-center sm:text-left">
                <h1 className="text-3xl font-bold mb-2">{authorName}</h1>
                {!isLoadingAuthor && authorDetails && (
                  <p className="text-muted-foreground">
                    {authorDetails.count} {authorDetails.count === 1 ? 'portfolio item' : 'portfolio items'}
                  </p>
                )}
              </div>
            </div>
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