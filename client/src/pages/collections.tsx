import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { ChevronLeft, Grid3X3, Settings, ArrowUpDown } from "lucide-react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PortfolioGrid, PortfolioGridSkeleton } from "@/components/portfolio-grid";
import { type PortfolioItem, type CategoryModel } from "@shared/schema";
import { getProxiedImageUrl } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { DraggableGrid } from "@/components/dnd-grid";

// Function to truncate text to a specified number of words
function truncateToWords(text: string, maxWords: number): string {
  if (!text) return "";
  const words = text.split(/\s+/);
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(" ") + "...";
}

export default function Collections() {
  const { category } = useParams<{ category?: string }>();
  const [_, navigate] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(category || null);
  const [selectedCategoryName, setSelectedCategoryName] = useState<string | null>(null);
  const [selectedCategoryData, setSelectedCategoryData] = useState<CategoryModel | null>(null);
  const { user, isLoading: authLoading } = useAuth();
  const isAdmin = Boolean(user && (user.role === "admin" || user.role === "superadmin"));

  // Get all categories
  const { data: categories, isLoading: categoriesLoading } = useQuery<CategoryModel[]>({
    queryKey: ["/api/categories"],
    queryFn: async () => {
      const response = await fetch("/api/categories");
      if (!response.ok) throw new Error("Failed to fetch categories");
      return response.json();
    }
  });

  // Get items for a specific category
  const { data: items, isLoading: itemsLoading } = useQuery<PortfolioItem[]>({
    queryKey: ["/api/items/category", selectedCategory],
    queryFn: async () => {
      if (!selectedCategory) return [];
      const response = await fetch(`/api/items/category/${selectedCategory}`);
      if (!response.ok) throw new Error("Failed to fetch items for category");
      return response.json();
    },
    enabled: !!selectedCategory
  });

  // Update the URL when the selected category changes
  useEffect(() => {
    if (selectedCategory) {
      navigate(`/collections/${selectedCategory}`);
    } else {
      navigate("/collections");
    }
  }, [selectedCategory, navigate]);

  // Set the selected category data when categories load
  useEffect(() => {
    if (categories && selectedCategory) {
      // Try to match by slug format first
      const matchedCategory = categories.find(
        cat => cat.name.replace(/\s+/g, '-').toLowerCase() === selectedCategory
      );
      
      if (matchedCategory) {
        setSelectedCategoryName(matchedCategory.name);
        setSelectedCategoryData(matchedCategory);
      } else {
        // If no match by slug, try direct match
        const directMatch = categories.find(cat => cat.name === selectedCategory);
        if (directMatch) {
          setSelectedCategoryName(directMatch.name);
          setSelectedCategoryData(directMatch);
        } else {
          setSelectedCategoryName(selectedCategory);
          setSelectedCategoryData(null);
        }
      }
    }
  }, [categories, selectedCategory]);

  // Handle selecting a category
  const handleCategorySelect = (category: CategoryModel) => {
    const slug = category.name.replace(/\s+/g, '-').toLowerCase();
    setSelectedCategory(slug);
    setSelectedCategoryName(category.name);
    setSelectedCategoryData(category);
  };

  // Handle back button click
  const handleBackClick = () => {
    setSelectedCategory(null);
    setSelectedCategoryName(null);
    setSelectedCategoryData(null);
    navigate("/collections");
  };

  // If categories are loading, show a loading state
  if (categoriesLoading) {
    return (
      <Layout>
        <h1 className="text-4xl font-bold mb-8">Collections</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <Card key={index} className="p-6 h-48 animate-pulse flex flex-col justify-center items-center">
              <div className="rounded-full bg-muted h-12 w-12 mb-4"></div>
              <div className="h-6 bg-muted rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </Card>
          ))}
        </div>
      </Layout>
    );
  }

  // If we have a category parameter, show items from that category
  if (selectedCategory) {
    return (
      <Layout>
        <div className="mb-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleBackClick}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Collections
          </Button>
        </div>
        
        <div className="mb-6">
          <div className="relative h-48 rounded-lg overflow-hidden mb-4">
            {selectedCategoryData && selectedCategoryData.imageUrl ? (
              <img 
                src={getProxiedImageUrl(selectedCategoryData.imageUrl)} 
                alt={selectedCategoryName || selectedCategory}
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.log('Collection image failed to load:', selectedCategoryData.imageUrl);
                  e.currentTarget.style.display = 'none';
                }}
                crossOrigin="anonymous"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <Grid3X3 className="h-12 w-12 text-primary opacity-50" />
              </div>
            )}
            
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            
            {/* Title overlay */}
            <div className="absolute bottom-0 left-0 p-6 w-full">
              <h1 className="text-3xl font-bold text-white">{selectedCategoryName || selectedCategory}</h1>
            </div>
          </div>
          
          {/* Description below the banner */}
          {selectedCategoryData && selectedCategoryData.description && (
            <p className="text-muted-foreground text-sm mb-6">{selectedCategoryData.description}</p>
          )}
        </div>
        
        {itemsLoading ? (
          <PortfolioGridSkeleton showShowcaseButton={false} />
        ) : items && items.length > 0 ? (
          <DraggableGrid 
            items={items} 
            queryKey={["/api/items/category", selectedCategory]}
            canEdit={isAdmin}
            showShowcaseButton={true}
          />
        ) : (
          <Card className="p-12 text-center">
            <div className="flex flex-col items-center justify-center">
              <Grid3X3 className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">No items in this collection</h3>
              <p className="text-muted-foreground mb-4">
                This collection doesn't have any items yet.
              </p>
              <Button onClick={handleBackClick}>
                View All Collections
              </Button>
            </div>
          </Card>
        )}
      </Layout>
    );
  }
  


  // If no category parameter, show list of all collections
  return (
    <Layout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Collections</h1>
        {isAdmin && (
          <Button 
            variant="outline" 
            onClick={() => navigate("/manage-categories")}
            className="flex items-center"
          >
            <Settings className="mr-2 h-4 w-4" />
            Manage Collections
          </Button>
        )}
      </div>
      
      {categoriesLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, index) => (
            <Card key={index} className="aspect-square animate-pulse" />
          ))}
        </div>
      ) : categories && categories.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {categories.map((category) => (
            <Card 
              key={category.id} 
              className="aspect-square hover:border-primary cursor-pointer transition-colors overflow-hidden relative"
              onClick={() => handleCategorySelect(category)}
            >
              {/* Image filling the entire card as background */}
              {category.imageUrl ? (
                <div className="absolute inset-0 w-full h-full">
                  <img 
                    src={getProxiedImageUrl(category.imageUrl)} 
                    alt={category.name} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "https://placehold.co/200x200/gray/white?text=Collection";
                      console.log('Collection image failed to load:', category.imageUrl);
                    }}
                    crossOrigin="anonymous"
                  />
                </div>
              ) : (
                <div className="absolute inset-0 w-full h-full bg-muted flex items-center justify-center">
                  <Grid3X3 className="h-12 w-12 text-primary opacity-50" />
                </div>
              )}
              
              {/* Gradient overlay for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              
              {/* Content positioned at the bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-3 text-start">
                <h3 className="text-lg font-medium text-white mb-1">{category.name}</h3>
                {category.description && (
                  <p className="text-white/80 text-xs leading-tight">
                    {truncateToWords(category.description, 20)}
                  </p>
                )}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center justify-center">
            <Grid3X3 className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">No collections found</h3>
            <p className="text-muted-foreground mb-4">
              There are no collections created yet.
            </p>
          </div>
        </Card>
      )}
    </Layout>
  );
}