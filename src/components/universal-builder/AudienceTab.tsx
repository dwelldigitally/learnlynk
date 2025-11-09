import React from 'react';
import { AudienceSelector } from '@/components/campaign-builder/AudienceSelector';
import { EnhancedLeadFilters } from '@/services/enhancedLeadService';

interface AudienceTabProps {
  selectedAudience?: {
    filters: EnhancedLeadFilters;
    count: number;
  };
  onAudienceSelect: (filters: EnhancedLeadFilters, count: number) => void;
}

export function AudienceTab({ selectedAudience, onAudienceSelect }: AudienceTabProps) {
  return (
    <div className="h-full w-full">
      <AudienceSelector
        selectedAudience={selectedAudience}
        onAudienceSelect={onAudienceSelect}
      />
    </div>
  );
}
