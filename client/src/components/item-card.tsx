import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { type PortfolioItem } from "@shared/schema";
import { ExternalLink } from "lucide-react";

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
          className="text-xl font-semibold hover:text-primary cursor-pointer" 
          onClick={() => navigate(`/item/${item.id}`)}
        >
          {item.title}
        </div>
        <p className="text-muted-foreground mt-2">{item.description}</p>
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