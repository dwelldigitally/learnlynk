import { useState, useCallback } from 'react';

export function useSegmentSelection() {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const toggleItem = useCallback((itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  }, []);

  const toggleAll = useCallback((itemIds: string[]) => {
    setSelectedItems(prev => 
      prev.length === itemIds.length 
        ? []
        : itemIds
    );
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedItems([]);
  }, []);

  const isSelected = useCallback((itemId: string) => {
    return selectedItems.includes(itemId);
  }, [selectedItems]);

  const isAllSelected = useCallback((itemIds: string[]) => {
    return itemIds.length > 0 && itemIds.every(id => selectedItems.includes(id));
  }, [selectedItems]);

  const isPartiallySelected = useCallback((itemIds: string[]) => {
    return selectedItems.length > 0 && 
           selectedItems.length < itemIds.length && 
           itemIds.some(id => selectedItems.includes(id));
  }, [selectedItems]);

  return {
    selectedItems,
    toggleItem,
    toggleAll,
    clearSelection,
    isSelected,
    isAllSelected,
    isPartiallySelected,
    hasSelection: selectedItems.length > 0
  };
}