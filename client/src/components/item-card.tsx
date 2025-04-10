import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { type PortfolioItem } from "@shared/schema";
import { ExternalLink, Tag } from "lucide-react";

export function ItemCard({ item }: { item: PortfolioItem }) {
  const [, navigate] = useLocation();
  
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div 
        className="relative aspect-[4/3] block cursor-pointer" 
        onClick={() => navigate(`/item/${item.id}`)}
      >
        <img
          src={item.imageUrl}
          alt={item.title}
          className="object-cover w-full h-full hover:scale-105 transition-transform"
        />
      </div>
      <CardContent className="flex-1 p-4">
        <div 
          className="text-xl font-semibold hover:text-primary cursor-pointer text-center" 
          onClick={() => navigate(`/item/${item.id}`)}
        >
          {item.title}
        </div>
        
        {/* Description - shortened with ellipsis */}
        <p className="text-sm text-muted-foreground mt-2 line-clamp-2 text-center">
          {item.description}
        </p>
        
        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap justify-center gap-1">
            {item.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0 gap-2">
        {item.marketplaceUrl1 && (
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            asChild
          >
            <a href={item.marketplaceUrl1} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              {item.marketplaceName1}
            </a>
          </Button>
        )}
        {item.marketplaceUrl2 && (
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            asChild
          >
            <a href={item.marketplaceUrl2} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              {item.marketplaceName2}
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}