import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { ChevronLeft, Grid3X3 } from "lucide-react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PortfolioGrid, PortfolioGridSkeleton } from "@/components/portfolio-grid";
import { type PortfolioItem, type CategoryModel } from "@shared/schema";
import { getProxiedImageUrl } from "@/lib/utils";

export default function Collections() {
  const { category } = useParams<{ category?: string }>();
  const [_, navigate] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(category || null);
  const [selectedCategoryName, setSelectedCategoryName] = useState<string | null>(null);
  const [selectedCategoryData, setSelectedCategoryData] = useState<CategoryModel | null>(null);

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
        
        <div className="flex items-center gap-4 mb-6">
          {selectedCategoryData && selectedCategoryData.imageUrl ? (
            <div className="w-20 h-20 overflow-hidden rounded-md flex-shrink-0">
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
            </div>
          ) : (
            <div className="w-20 h-20 rounded-md bg-muted flex items-center justify-center">
              <Grid3X3 className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
          
          <div>
            <h1 className="text-4xl font-bold">{selectedCategoryName || selectedCategory}</h1>
            {selectedCategoryData && selectedCategoryData.description && (
              <p className="text-muted-foreground mt-2">{selectedCategoryData.description}</p>
            )}
          </div>
        </div>
        
        {itemsLoading ? (
          <PortfolioGridSkeleton />
        ) : items && items.length > 0 ? (
          <PortfolioGrid items={items} />
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
      <h1 className="text-4xl font-bold mb-8">Collections</h1>
      
      {categoriesLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <Card key={index} className="p-6 h-48 animate-pulse" />
          ))}
        </div>
      ) : categories && categories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Card 
              key={category.id} 
              className="p-6 hover:border-primary cursor-pointer transition-colors"
              onClick={() => handleCategorySelect(category)}
            >
              <div className="flex flex-col items-center text-center h-full justify-center">
                {category.imageUrl ? (
                  <div className="w-24 h-24 mb-4 overflow-hidden rounded-md">
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
                  <Grid3X3 className="h-12 w-12 mb-4 text-primary" />
                )}
                <h3 className="text-xl font-medium mb-2">{category.name}</h3>
                {category.description && (
                  <p className="text-muted-foreground text-sm">
                    {category.description}
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