import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { PortfolioGrid, PortfolioGridSkeleton } from "@/components/portfolio-grid";
import { Layout } from "@/components/layout";
import { CategoryModel, PortfolioItem } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Grid3X3 } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function Collections() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute<{ category?: string }>("/collections/:category?");
  const selectedCategory = params?.category || null;
  
  // Fetch all categories
  const { data: categories, isLoading: categoriesLoading } = useQuery<CategoryModel[]>({
    queryKey: ['/api/categories'],
  });
  
  // Fetch items for the selected category
  const { data: items, isLoading: itemsLoading } = useQuery<PortfolioItem[]>({
    queryKey: ['/api/items/category', selectedCategory],
    enabled: !!selectedCategory,
  });
  
  // Get the name of the currently selected category
  const selectedCategoryName = selectedCategory && categories 
    ? categories.find(cat => cat.name.replace(/\s+/g, '-').toLowerCase() === selectedCategory)?.name 
    : null;
  
  // Handle back button click
  const handleBackClick = () => {
    setLocation('/collections');
  };
  
  // If we have a category parameter but categories haven't loaded yet, show loading state
  if (selectedCategory && categoriesLoading) {
    return (
      <Layout>
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleBackClick}
            className="mr-2"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Collections
          </Button>
          <h1 className="text-4xl font-bold">Loading collection...</h1>
        </div>
        <PortfolioGridSkeleton />
      </Layout>
    );
  }
  
  // If we have a category parameter, show items from that category
  if (selectedCategory) {
    return (
      <Layout>
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleBackClick}
            className="mr-2"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Collections
          </Button>
          <h1 className="text-4xl font-bold">{selectedCategoryName || selectedCategory}</h1>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="p-6 h-40 animate-pulse bg-muted" />
          ))}
        </div>
      ) : categories && categories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {categories.map((category) => {
            const categorySlug = category.name.replace(/\s+/g, '-').toLowerCase();
            return (
              <Card 
                key={category.id} 
                className="p-6 hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() => setLocation(`/collections/${categorySlug}`)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-2xl font-bold group-hover:text-primary transition-colors">
                    {category.name}
                  </h2>
                  <Grid3X3 className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                {category.description && (
                  <p className="text-muted-foreground line-clamp-3">{category.description}</p>
                )}
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center justify-center">
            <Grid3X3 className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">No collections found</h3>
            <p className="text-muted-foreground mb-4">
              There are no collections available at the moment.
            </p>
            <Button onClick={() => setLocation('/')}>
              Browse Portfolio
            </Button>
          </div>
        </Card>
      )}
    </Layout>
  );
}