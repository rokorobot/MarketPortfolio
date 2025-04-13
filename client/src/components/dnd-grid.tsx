import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PortfolioItem } from '@shared/schema';
import { ArrowUpDown, Save, XCircle } from 'lucide-react';
import { ItemCard } from './item-card';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useAuth } from '@/hooks/use-auth';

type DraggableGridProps = {
  items: PortfolioItem[];
  onOrderChange?: (orderedItems: PortfolioItem[]) => Promise<void>;
  collectionId?: number | string;
  canEdit?: boolean;
  isArranging?: boolean;
  isSaving?: boolean;
  onStartArranging?: () => void;
  onCancelArranging?: () => void;
  onSaveArrangement?: () => void;
};

export function DraggableGrid({ 
  items, 
  onOrderChange,
  collectionId,
  canEdit,
  isArranging = false,
  isSaving = false,
  onStartArranging,
  onCancelArranging,
  onSaveArrangement
}: DraggableGridProps) {
  // Local state for draggable items
  const [localItems, setLocalItems] = useState<PortfolioItem[]>(items);
  const { isAdmin } = useAuth();

  // Show edit controls only if user is admin and canEdit is true
  const showEditControls = isAdmin && canEdit;
  
  // Update local items when props change (if not in arrangement mode)
  if (JSON.stringify(items) !== JSON.stringify(localItems) && !isArranging) {
    setLocalItems(items);
  }

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

  return (
    <div className="space-y-6">
      {/* Controls panel for reordering */}
      {showEditControls && (
        <div className="flex justify-end gap-2 mb-4">
          {!isArranging ? (
            <Button
              variant="outline"
              onClick={onStartArranging}
              className="flex items-center gap-2"
            >
              <ArrowUpDown className="h-4 w-4" />
              Arrange Items
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={onCancelArranging}
                className="flex items-center gap-2"
                disabled={isSaving}
              >
                <XCircle className="h-4 w-4" />
                Cancel
              </Button>
              <Button
                onClick={onSaveArrangement}
                className="flex items-center gap-2"
                disabled={isSaving}
              >
                {isSaving ? (
                  <span className="loading loading-spinner loading-xs"></span>
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