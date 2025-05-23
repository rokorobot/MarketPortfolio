import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { type PortfolioItem } from "@shared/schema";
import { ExternalLink } from "lucide-react";
import { getProxiedImageUrl } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";

export function ItemCard({ 
  item, 
  onClick
}: { 
  item: PortfolioItem;
  onClick?: () => void;
}) {
  const [, navigate] = useLocation();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/item/${item.id}`);
    }
  };

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const imageSrc = getProxiedImageUrl(item.imageUrl);
            img.src = imageSrc;
            observer.unobserve(img);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(img);
    return () => observer.disconnect();
  }, [item.imageUrl]);
  
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div 
        className="relative aspect-[4/3] block cursor-pointer bg-gray-100" 
        onClick={handleClick}
      >
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <img
          ref={imgRef}
          alt={item.title}
          className={`object-cover w-full h-full hover:scale-105 transition-all duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            setImageError(true);
            e.currentTarget.src = "https://placehold.co/400x300/gray/white?text=Image+Not+Available";
            console.log('Item image failed to load:', item.imageUrl);
          }}
          loading="lazy"
          decoding="async"
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