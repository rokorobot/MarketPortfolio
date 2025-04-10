import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink, Tag, Trash2 } from "lucide-react";
import type { PortfolioItem } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function Item() {
  const [, params] = useRoute("/item/:id");
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { isAdmin } = useAuth();
  const { data: item, isLoading } = useQuery<PortfolioItem>({
    queryKey: [`/api/items/${params?.id}`],
  });
  
  const deleteItemMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("DELETE", `/api/items/${params?.id}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete item");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Item deleted",
        description: "The portfolio item has been deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/items"] });
      navigate("/");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-6">
              <Skeleton className="w-full h-[400px] rounded-lg" />
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
            <div className="relative rounded-lg">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="object-contain w-full max-h-[500px] hover:scale-105 transition-transform duration-300 rounded-lg mx-auto"
              />
            </div>

            {/* Title and Category */}
            <div className="mt-6 flex items-center justify-between">
              <h1 className="text-3xl font-bold">{item.title}</h1>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-sm">
                  <Tag className="w-4 h-4 mr-1" />
                  {item.category}
                </Badge>
                {isAdmin && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="icon" className="text-destructive hover:bg-destructive/10">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Portfolio Item</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{item.title}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          onClick={() => deleteItemMutation.mutate()}
                          disabled={deleteItemMutation.isPending}
                        >
                          {deleteItemMutation.isPending ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-lg text-muted-foreground mt-4">{item.description}</p>
            
            {/* Tags */}
            {item.tags && item.tags.length > 0 && (
              <div className="mt-4">
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