import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PortfolioItem } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from './use-toast';

interface UpdateOrderItem {
  id: number;
  displayOrder: number;
}

export function useItemReordering({
  queryKey,
  initialItems,
}: {
  queryKey: string | string[];
  initialItems: PortfolioItem[];
}) {
  const [items, setItems] = useState<PortfolioItem[]>(initialItems);
  const [isArranging, setIsArranging] = useState(false);
  const [originalOrder, setOriginalOrder] = useState<PortfolioItem[]>([]);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Normalize query key to array if it's a string
  const normalizedQueryKey = typeof queryKey === 'string' ? [queryKey] : queryKey;

  const updateOrderMutation = useMutation({
    mutationFn: async (orderedItems: UpdateOrderItem[]) => {
      const response = await apiRequest('POST', '/api/items/update-order', { items: orderedItems });
      return response.json();
    },
    onSuccess: () => {
      // Invalidate the relevant query to refetch the updated items
      queryClient.invalidateQueries({
        queryKey: normalizedQueryKey,
      });
      
      toast({
        title: 'Order updated',
        description: 'Item order has been saved successfully.',
      });
      
      setIsArranging(false);
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: `Failed to update item order: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const startArranging = () => {
    setOriginalOrder([...items]);
    setIsArranging(true);
    toast({
      title: 'Arrangement Mode',
      description: 'Drag and drop items to rearrange them, then click Save.',
    });
  };

  const cancelArranging = () => {
    setItems(originalOrder);
    setIsArranging(false);
  };

  const saveArrangement = async () => {
    const orderedItems = items.map((item, index) => ({
      id: item.id,
      displayOrder: index,
    }));

    updateOrderMutation.mutate(orderedItems);
  };

  // Update internal items state when initialItems prop changes
  if (JSON.stringify(initialItems) !== JSON.stringify(items) && !isArranging) {
    setItems(initialItems);
  }

  return {
    items,
    setItems,
    isArranging,
    startArranging,
    cancelArranging,
    saveArrangement,
    isSaving: updateOrderMutation.isPending,
  };
}