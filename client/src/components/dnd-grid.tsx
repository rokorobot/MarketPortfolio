import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PortfolioItem } from '@shared/schema';
import { ArrowUpDown, Save, XCircle, Loader2 } from 'lucide-react';
import { ItemCard } from './item-card';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

type DraggableGridProps = {
  items: PortfolioItem[];
  queryKey: unknown[];
  canEdit?: boolean;
};

export function DraggableGrid({ 
  items, 
  queryKey,
  canEdit = false
}: DraggableGridProps) {
  // Local state
  const [localItems, setLocalItems] = useState<PortfolioItem[]>(items);
  const [isArranging, setIsArranging] = useState(false);
  const [originalItems, setOriginalItems] = useState<PortfolioItem[]>([]);
  
  // Hooks
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
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

  return (
    <div className="space-y-6">
      {/* Controls panel for reordering */}
      {showEditControls && (
        <div className="flex justify-end gap-2 mb-4">
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

      {/* Draggable grid */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="droppable-portfolio-items" direction="horizontal" isDropDisabled={!isArranging}>
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ${
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
                      <ItemCard item={item} />
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