import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { type PortfolioItem } from "@shared/schema";
import { ExternalLink } from "lucide-react";
import { getProxiedImageUrl } from "@/lib/utils";

export function ItemCard({ 
  item, 
  onClick
}: { 
  item: PortfolioItem;
  onClick?: () => void;
}) {
  const [, navigate] = useLocation();
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/item/${item.id}`);
    }
  };
  
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div 
        className="relative aspect-[4/3] block cursor-pointer" 
        onClick={handleClick}
      >
        <img
          src={getProxiedImageUrl(item.imageUrl)}
          alt={item.title}
          className="object-cover w-full h-full hover:scale-105 transition-transform"
          onError={(e) => {
            e.currentTarget.src = "https://placehold.co/400x300/gray/white?text=Image+Not+Available";
            console.log('Item image failed to load:', item.imageUrl);
          }}
          crossOrigin="anonymous"
        />
      </div>
      <CardContent className="flex-1 p-4">
        <div 
          className="text-xl font-semibold hover:text-primary cursor-pointer text-center" 
          onClick={handleClick}
        >
          {item.title}
        </div>
        
        {/* Description - shortened with ellipsis */}
        <p className="text-sm text-muted-foreground mt-2 line-clamp-2 text-center">
          {item.description}
        </p>
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