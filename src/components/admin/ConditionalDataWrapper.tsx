import React from 'react';
import { EmptyState } from './EmptyState';
import { Skeleton } from '@/components/ui/skeleton';

interface ConditionalDataWrapperProps {
  isLoading: boolean;
  showEmptyState: boolean;
  hasDemoAccess: boolean;
  hasRealData: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  loadingRows?: number;
  children: React.ReactNode;
}

/**
 * Wrapper component that handles loading states, empty states, and demo data display
 */
export function ConditionalDataWrapper({
  isLoading,
  showEmptyState,
  hasDemoAccess,
  hasRealData,
  emptyTitle = "No Data Available",
  emptyDescription = "Get started by adding your first record.",
  loadingRows = 5,
  children
}: ConditionalDataWrapperProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: loadingRows }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (showEmptyState) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
      />
    );
  }

  return (
    <div className="relative">
      {hasDemoAccess && !hasRealData && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-800">
            <strong>Demo Mode:</strong> You're viewing sample data. Create your own records to replace this demo content.
          </p>
        </div>
      )}
      {children}
    </div>
  );
}