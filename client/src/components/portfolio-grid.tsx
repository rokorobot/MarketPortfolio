import { ItemCard } from "./item-card";
import { type PortfolioItem } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

// Default grid settings if site settings are not available
const DEFAULT_GRID_SETTINGS = {
  grid_columns_desktop: '3',
  grid_columns_tablet: '2',
  grid_columns_mobile: '1',
  items_per_page: '12'
};

export function PortfolioGrid({ items }: { items: PortfolioItem[] }) {
  // Fetch grid settings from site settings
  const { data: settings } = useQuery<Record<string, string | null>>({
    queryKey: ['/api/site-settings'],
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes to avoid too many refetches
  });
  
  // Calculate grid style properties based on settings
  const gridStyle = useMemo(() => {
    const desktopCols = parseInt(settings?.grid_columns_desktop || DEFAULT_GRID_SETTINGS.grid_columns_desktop);
    const tabletCols = parseInt(settings?.grid_columns_tablet || DEFAULT_GRID_SETTINGS.grid_columns_tablet);
    const mobileCols = parseInt(settings?.grid_columns_mobile || DEFAULT_GRID_SETTINGS.grid_columns_mobile);
    
    return {
      display: 'grid',
      gap: '1.5rem',
      gridTemplateColumns: `repeat(${mobileCols}, minmax(0, 1fr))`,
      ['@media (min-width: 768px)']: {
        gridTemplateColumns: `repeat(${tabletCols}, minmax(0, 1fr))`
      },
      ['@media (min-width: 1024px)']: {
        gridTemplateColumns: `repeat(${desktopCols}, minmax(0, 1fr))`
      }
    };
  }, [settings]);
  
  // Calculate items per page (for future pagination implementation)
  const itemsPerPage = useMemo(() => {
    if (!settings?.items_per_page) return parseInt(DEFAULT_GRID_SETTINGS.items_per_page);
    return parseInt(settings.items_per_page);
  }, [settings]);
  
  return (
    <div 
      className="grid gap-6" 
      style={{
        gridTemplateColumns: `repeat(${settings?.grid_columns_mobile || DEFAULT_GRID_SETTINGS.grid_columns_mobile}, minmax(0, 1fr))`,
        [`@media (min-width: 768px)`]: {
          gridTemplateColumns: `repeat(${settings?.grid_columns_tablet || DEFAULT_GRID_SETTINGS.grid_columns_tablet}, minmax(0, 1fr))`
        },
        [`@media (min-width: 1024px)`]: {
          gridTemplateColumns: `repeat(${settings?.grid_columns_desktop || DEFAULT_GRID_SETTINGS.grid_columns_desktop}, minmax(0, 1fr))`
        }
      }}
    >
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}

export function PortfolioGridSkeleton() {
  // Fetch grid settings from site settings (for consistent skeleton display)
  const { data: settings } = useQuery<Record<string, string | null>>({
    queryKey: ['/api/site-settings'],
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
  
  // Calculate items to show in skeleton based on settings
  const skeletonCount = useMemo(() => {
    if (!settings?.items_per_page) return 8; // Default fallback
    const count = parseInt(settings.items_per_page);
    return Math.min(count, 12); // Limit to 12 for performance
  }, [settings]);
  
  const desktopCols = settings?.grid_columns_desktop || DEFAULT_GRID_SETTINGS.grid_columns_desktop;
  const tabletCols = settings?.grid_columns_tablet || DEFAULT_GRID_SETTINGS.grid_columns_tablet;
  const mobileCols = settings?.grid_columns_mobile || DEFAULT_GRID_SETTINGS.grid_columns_mobile;
  
  return (
    <div className="grid gap-6" style={{ 
      gridTemplateColumns: `repeat(${mobileCols}, minmax(0, 1fr))` 
    }}>
      <style jsx>{`
        @media (min-width: 768px) {
          div {
            grid-template-columns: repeat(${tabletCols}, minmax(0, 1fr));
          }
        }
        @media (min-width: 1024px) {
          div {
            grid-template-columns: repeat(${desktopCols}, minmax(0, 1fr));
          }
        }
      `}</style>
      {Array.from({ length: skeletonCount }).map((_, i) => (
        <Card key={i} className="overflow-hidden h-full flex flex-col">
          <Skeleton className="aspect-[4/3] w-full" />
          <div className="p-4 flex-1">
            <Skeleton className="h-6 w-3/4 mx-auto" />
          </div>
          <div className="p-4 pt-0 flex gap-2">
            <Skeleton className="h-9 w-full" />
          </div>
        </Card>
      ))}
    </div>
  );
}
