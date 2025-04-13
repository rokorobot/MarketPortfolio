import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { PortfolioItem } from '@shared/schema';
import { ArrowUpDown, Save, XCircle, Loader2, Play, Eye } from 'lucide-react';
import { ItemCard } from './item-card';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useShowcase } from '@/hooks/use-showcase';

type DraggableGridProps = {
  items: PortfolioItem[];
  queryKey: unknown[];
  canEdit?: boolean;
  showShowcaseButton?: boolean;
};

export function DraggableGrid({ 
  items, 
  queryKey,
  canEdit = false,
  showShowcaseButton = false
}: DraggableGridProps) {
  // Local state
  const [localItems, setLocalItems] = useState<PortfolioItem[]>(items);
  const [isArranging, setIsArranging] = useState(false);
  const [originalItems, setOriginalItems] = useState<PortfolioItem[]>([]);
  
  // Hooks
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { startShowcase } = useShowcase();
  
  // Fetch grid settings from site settings
  const { data: settings } = useQuery<Record<string, string | null>>({
    queryKey: ['/api/site-settings'],
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
  
  // Default grid settings if site settings are not available
  const DEFAULT_GRID_SETTINGS = {
    grid_columns_desktop: '6',
    grid_columns_tablet: '3',
    grid_columns_mobile: '1',
  };
  
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
  
  // Show edit controls only if user is admin and canEdit is true
  const showEditControls = isAdmin && canEdit;
  
  // Update localItems when items prop changes
  useEffect(() => {
    if (!isArranging) {
      setLocalItems(items);
    }
  }, [items, isArranging]);

  // Save order mutation
  const saveOrderMutation = useMutation({
    mutationFn: async (orderedItems: { id: number; displayOrder: number }[]) => {
      const response = await apiRequest('POST', '/api/items/update-order', { 
        items: orderedItems 
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast({
        title: 'Order updated',
        description: 'The items have been reordered successfully.',
      });
      setIsArranging(false);
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: `Failed to update order: ${error.message}`,
        variant: 'destructive'
      });
    }
  });

  const handleDragEnd = (result: DropResult) => {
    // Dropped outside the list or no destination
    if (!result.destination) {
      return;
    }

    // Source and destination indices
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    // If position didn't change
    if (sourceIndex === destinationIndex) {
      return;
    }

    // Reorder items in local state
    const reorderedItems = Array.from(localItems);
    const [removed] = reorderedItems.splice(sourceIndex, 1);
    reorderedItems.splice(destinationIndex, 0, removed);

    // Update local state
    setLocalItems(reorderedItems);
  };

  const startArranging = () => {
    setOriginalItems([...localItems]);
    setIsArranging(true);
    toast({
      title: 'Arrangement Mode',
      description: 'Drag and drop items to rearrange them, then click Save.',
    });
  };

  const cancelArranging = () => {
    setLocalItems(originalItems);
    setIsArranging(false);
  };

  const saveArrangement = () => {
    const orderedItems = localItems.map((item, index) => ({
      id: item.id,
      displayOrder: index
    }));
    
    saveOrderMutation.mutate(orderedItems);
  };

  // Function to start the showcase
  const handleStartShowcase = () => {
    if (localItems.length === 0) {
      toast({
        title: 'No items to showcase',
        description: 'There are no items available to showcase.',
        variant: 'destructive'
      });
      return;
    }
    
    startShowcase(localItems);
  };

  return (
    <div className="space-y-6">
      {/* Controls panel with showcase and reordering buttons */}
      <div className="flex justify-between items-center mb-4">
        {/* Showcase button on the left with active styling */}
        <Button
          variant="default"
          onClick={handleStartShowcase}
          className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
          disabled={localItems.length === 0 || isArranging}
        >
          <Eye className="h-4 w-4" />
          Showcase
        </Button>
        
        {/* Admin controls on the right */}
        {showEditControls && (
          <div className="flex gap-2">
            {!isArranging ? (
              <Button
                variant="outline"
                onClick={startArranging}
                className="flex items-center gap-2"
              >
                <ArrowUpDown className="h-4 w-4" />
                Arrange Items
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={cancelArranging}
                  className="flex items-center gap-2"
                  disabled={saveOrderMutation.isPending}
                >
                  <XCircle className="h-4 w-4" />
                  Cancel
                </Button>
                <Button
                  onClick={saveArrangement}
                  className="flex items-center gap-2"
                  disabled={saveOrderMutation.isPending}
                >
                  {saveOrderMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Save Order
                </Button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Draggable grid */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="droppable-portfolio-items" direction="horizontal" isDropDisabled={!isArranging}>
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={`${gridClass} ${
                isArranging ? 'ring-2 ring-primary/20 rounded-md p-4' : ''
              }`}
            >
              {localItems.map((item, index) => (
                <Draggable 
                  key={`item-${item.id}`} 
                  draggableId={`item-${item.id}`} 
                  index={index}
                  isDragDisabled={!isArranging}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`transition-transform ${
                        snapshot.isDragging ? 'scale-105 z-10 shadow-lg' : ''
                      } ${isArranging ? 'cursor-move' : ''}`}
                    >
                      <ItemCard 
                        item={item} 
                        onClick={isArranging ? undefined : () => {
                          startShowcase(localItems.slice(index));
                        }} 
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Notice shown when in arrange mode */}
      {isArranging && (
        <div className="bg-muted p-4 rounded-md mt-4 text-sm text-center">
          <p>Drag and drop items to reorder them, then click Save Order.</p>
        </div>
      )}
    </div>
  );
}