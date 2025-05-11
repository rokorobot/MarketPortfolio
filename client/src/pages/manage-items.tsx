import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { ChevronLeft } from "lucide-react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { type PortfolioItem, type CategoryModel } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { DraggableGrid } from "@/components/dnd-grid";
import { useToast } from "@/hooks/use-toast";

export default function ManageItems() {
  const [searchParams, navigate] = useLocation();
  const { toast } = useToast();
  const { user, isAdmin } = useAuth();
  const [categorySlug, setCategorySlug] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState<string | null>(null);

  // Parse query parameters to get category
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const category = params.get("category");
    if (category) {
      setCategorySlug(category);
    } else {
      toast({
        title: "No category specified",
        description: "Please select a collection to manage items",
        variant: "destructive",
      });
      navigate("/collections");
    }
  }, [searchParams, navigate, toast]);

  // Get the category details
  const { data: categories } = useQuery<CategoryModel[]>({
    queryKey: ["/api/categories"],
    enabled: !!categorySlug,
  });

  // Set the category name when categories are loaded
  useEffect(() => {
    if (categories && categorySlug) {
      const category = categories.find(
        (c) => c.name.toLowerCase().replace(/\s+/g, "-") === categorySlug
      );
      if (category) {
        setCategoryName(category.name);
      }
    }
  }, [categories, categorySlug]);

  // Get items for the category
  const { data: items, isLoading: itemsLoading } = useQuery<PortfolioItem[]>({
    queryKey: ["/api/items/category", categorySlug],
    queryFn: async () => {
      if (!categorySlug) return [];
      const response = await fetch(`/api/items/category/${categorySlug}`);
      if (!response.ok) throw new Error("Failed to fetch items for category");
      return response.json();
    },
    enabled: !!categorySlug,
  });

  // Redirect if not admin
  if (!isAdmin) {
    navigate("/collections");
    return null;
  }

  const handleBackClick = () => {
    if (categorySlug) {
      navigate(`/collections/${categorySlug}`);
    } else {
      navigate("/collections");
    }
  };

  return (
    <Layout>
      <div className="mb-2">
        <Button variant="ghost" size="sm" onClick={handleBackClick}>
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Collection
        </Button>
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">
          Manage {categoryName || "Collection"} Items
        </h1>
        <p className="text-muted-foreground">
          Drag and drop items to rearrange their order in this collection.
        </p>
      </div>

      {itemsLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : items && items.length > 0 ? (
        <DraggableGrid 
          items={items} 
          queryKey={["/api/items/category", categorySlug]}
          canEdit={true}
          showShowcaseButton={false}
        />
      ) : (
        <div className="text-center p-12 border rounded-md">
          <p className="text-lg font-medium mb-2">No items found</p>
          <p className="text-muted-foreground mb-4">
            This collection doesn't have any items yet.
          </p>
          <Button onClick={handleBackClick}>
            Back to Collections
          </Button>
        </div>
      )}
    </Layout>
  );
}