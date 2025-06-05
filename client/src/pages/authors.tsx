import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Layout } from "@/components/layout";
import { Loader2, User, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { getProxiedImageUrl } from "@/lib/utils";

// Define the type for author data
interface Author {
  name: string;
  count: number;
  profileImage: string | null;
}

export default function AuthorsPage() {
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const { isAdmin } = useAuth();
  
  const { data: authors, isLoading, error } = useQuery<Author[]>({
    queryKey: ["/api/authors"],
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-8">
          <h1 className="text-3xl font-bold mb-8">Authors</h1>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, index) => (
              <Card key={index} className="aspect-square animate-pulse" />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <h2 className="text-xl font-bold mb-2">Failed to load authors</h2>
          <p className="text-muted-foreground">{(error as Error).message}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Authors</h1>
          {isAdmin && (
            <Button 
              variant="outline" 
              onClick={() => navigate("/manage-authors")}
              className="flex items-center"
            >
              <Settings className="mr-2 h-4 w-4" />
              Manage Authors
            </Button>
          )}
        </div>
        
        {authors && authors.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {authors.map((author) => (
              <Card 
                key={author.name} 
                className="aspect-square hover:border-primary cursor-pointer transition-colors overflow-hidden relative"
                onClick={() => navigate(`/items/author/${encodeURIComponent(author.name)}`)}
              >
                {/* Author image filling the entire card as background */}
                {author.profileImage ? (
                  <div className="absolute inset-0 w-full h-full">
                    <img 
                      src={getProxiedImageUrl(author.profileImage)} 
                      alt={`${author.name} profile`} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (!target.dataset.triedPlaceholder) {
                          target.dataset.triedPlaceholder = 'true';
                          target.src = "https://placehold.co/400x400/gray/white?text=Author";
                        }
                      }}
                      crossOrigin="anonymous"
                    />
                  </div>
                ) : (
                  <div className="absolute inset-0 w-full h-full bg-muted flex items-center justify-center">
                    <User className="h-16 w-16 text-primary opacity-50" />
                  </div>
                )}
                
                {/* Gradient overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                
                {/* Content positioned at the bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-3 text-start">
                  <h3 className="text-lg font-medium text-white mb-1">{author.name}</h3>
                  <Badge className="bg-primary/60 hover:bg-primary/80 text-white border-none">
                    {author.count} {author.count === 1 ? "item" : "items"}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No authors found.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}