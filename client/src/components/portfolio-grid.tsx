import { useEffect } from "react";
import { ItemCard } from "./item-card";
import { type PortfolioItem } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useShowcase } from "@/hooks/use-showcase";

// Default grid settings if site settings are not available
const DEFAULT_GRID_SETTINGS = {
  grid_columns_desktop: '3',
  grid_columns_tablet: '2',
  grid_columns_mobile: '1',
  items_per_page: '12'
};

export function PortfolioGrid({ items }: { items: PortfolioItem[] }) {
  // Get the showcase functionality
  const { startShowcase } = useShowcase();
  
  // Fetch grid settings from site settings
  const { data: settings } = useQuery<Record<string, string | null>>({
    queryKey: ['/api/site-settings'],
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes to avoid too many refetches
  });
  
  // Calculate column values based on settings
  const desktopCols = settings?.grid_columns_desktop || DEFAULT_GRID_SETTINGS.grid_columns_desktop;
  const tabletCols = settings?.grid_columns_tablet || DEFAULT_GRID_SETTINGS.grid_columns_tablet;
  const mobileCols = settings?.grid_columns_mobile || DEFAULT_GRID_SETTINGS.grid_columns_mobile;
  
  // Calculate items per page (for future pagination implementation)
  const itemsPerPage = useMemo(() => {
    if (!settings?.items_per_page) return parseInt(DEFAULT_GRID_SETTINGS.items_per_page);
    return parseInt(settings.items_per_page);
  }, [settings]);
  
  // Listen for the start-showcase event
  useEffect(() => {
    const handleStartShowcase = () => {
      if (items.length > 0) {
        startShowcase(items);
      }
    };
    
    // Add event listener
    document.addEventListener('start-showcase', handleStartShowcase);
    
    // Cleanup
    return () => {
      document.removeEventListener('start-showcase', handleStartShowcase);
    };
  }, [items, startShowcase]);
  
  // Use Tailwind classes for responsive grid based on settings
  const gridClass = useMemo(() => {
    // Base grid with gap
    let classes = "grid gap-6 ";
    
    // Mobile columns (base)
    if (mobileCols === '1') classes += "grid-cols-1 ";
    else if (mobileCols === '2') classes += "grid-cols-2 ";
    
    // Tablet columns (md)
    if (tabletCols === '1') classes += "md:grid-cols-1 ";
    else if (tabletCols === '2') classes += "md:grid-cols-2 ";
    else if (tabletCols === '3') classes += "md:grid-cols-3 ";
    
    // Desktop columns (lg)
    if (desktopCols === '1') classes += "lg:grid-cols-1 ";
    else if (desktopCols === '2') classes += "lg:grid-cols-2 ";
    else if (desktopCols === '3') classes += "lg:grid-cols-3 ";
    else if (desktopCols === '4') classes += "lg:grid-cols-4 ";
    else if (desktopCols === '5') classes += "lg:grid-cols-5 ";
    else if (desktopCols === '6') classes += "lg:grid-cols-6 ";
    
    return classes.trim();
  }, [mobileCols, tabletCols, desktopCols]);
  
  return (
    <div className={gridClass}>
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
  
  // Calculate column values based on settings
  const desktopCols = settings?.grid_columns_desktop || DEFAULT_GRID_SETTINGS.grid_columns_desktop;
  const tabletCols = settings?.grid_columns_tablet || DEFAULT_GRID_SETTINGS.grid_columns_tablet;
  const mobileCols = settings?.grid_columns_mobile || DEFAULT_GRID_SETTINGS.grid_columns_mobile;
  
  // Use Tailwind classes for responsive grid based on settings
  const gridClass = useMemo(() => {
    // Base grid with gap
    let classes = "grid gap-6 ";
    
    // Mobile columns (base)
    if (mobileCols === '1') classes += "grid-cols-1 ";
    else if (mobileCols === '2') classes += "grid-cols-2 ";
    
    // Tablet columns (md)
    if (tabletCols === '1') classes += "md:grid-cols-1 ";
    else if (tabletCols === '2') classes += "md:grid-cols-2 ";
    else if (tabletCols === '3') classes += "md:grid-cols-3 ";
    
    // Desktop columns (lg)
    if (desktopCols === '1') classes += "lg:grid-cols-1 ";
    else if (desktopCols === '2') classes += "lg:grid-cols-2 ";
    else if (desktopCols === '3') classes += "lg:grid-cols-3 ";
    else if (desktopCols === '4') classes += "lg:grid-cols-4 ";
    else if (desktopCols === '5') classes += "lg:grid-cols-5 ";
    else if (desktopCols === '6') classes += "lg:grid-cols-6 ";
    
    return classes.trim();
  }, [mobileCols, tabletCols, desktopCols]);
  
  return (
    <div className={gridClass}>
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
