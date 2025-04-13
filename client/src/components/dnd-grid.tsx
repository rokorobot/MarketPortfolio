import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Card } from '@/components/ui/card';
import { PortfolioItem } from '@shared/schema';
import { ItemCard } from './item-card';
import { Button } from './ui/button';
import { Save, Undo } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';

type DraggableGridProps = {
  items: PortfolioItem[];
  onOrderChange?: (orderedItems: PortfolioItem[]) => Promise<void>;
  collectionId?: number | string;
  canEdit?: boolean;
};

export function DraggableGrid({ 
  items: initialItems, 
  onOrderChange,
  collectionId,
  canEdit = false
}: DraggableGridProps) {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [isArranging, setIsArranging] = useState(false);
  const [originalOrder, setOriginalOrder] = useState<PortfolioItem[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { isAdmin } = useAuth();

  useEffect(() => {
    // When initialItems change, update the items state
    setItems(initialItems);
  }, [initialItems]);

  const handleDragEnd = (result: DropResult) => {
    // Dropped outside the list
    if (!result.destination) {
      return;
    }

    const reorderedItems = Array.from(items);
    const [removed] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, removed);

    setItems(reorderedItems);
  };

  const startArranging = () => {
    setOriginalOrder([...items]); // Save the original order
    setIsArranging(true);
    toast({
      title: "Arrangement Mode Activated",
      description: "Drag and drop items to rearrange them. Click Save when done.",
    });
  };

  const cancelArranging = () => {
    setItems(originalOrder); // Restore the original order
    setIsArranging(false);
    toast({
      title: "Changes Discarded",
      description: "Items have been restored to their original order.",
    });
  };

  const saveArrangement = async () => {
    if (!onOrderChange) return;
    
    try {
      setIsSaving(true);
      await onOrderChange(items);
      setIsArranging(false);
      toast({
        title: "Order Saved",
        description: "The new item arrangement has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error Saving Order",
        description: "There was a problem saving the arrangement. Please try again.",
        variant: "destructive",
      });
      console.error("Error saving item order:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const shouldShowArrangeButton = canEdit && isAdmin && !isArranging && onOrderChange;
  const shouldShowActionButtons = isArranging && onOrderChange;

  return (
    <div className="space-y-4">
      {shouldShowArrangeButton && (
        <div className="flex justify-end mb-4">
          <Button 
            variant="outline" 
            onClick={startArranging} 
            className="text-sm"
          >
            Arrange Items
          </Button>
        </div>
      )}

      {shouldShowActionButtons && (
        <div className="flex justify-end gap-2 mb-4">
          <Button 
            variant="outline" 
            onClick={cancelArranging} 
            className="text-sm"
            disabled={isSaving}
          >
            <Undo className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button 
            onClick={saveArrangement} 
            className="text-sm"
            disabled={isSaving}
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? "Saving..." : "Save Arrangement"}
          </Button>
        </div>
      )}

      {isArranging ? (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="portfolio-items">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              >
                {items.map((item, index) => (
                  <Draggable key={item.id.toString()} draggableId={item.id.toString()} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`transition-transform duration-100 ${snapshot.isDragging ? 'scale-105 z-50 shadow-lg' : ''}`}
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
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map(item => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}