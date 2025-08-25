import React from 'react';
import { Button } from '@/components/ui/button';

interface YieldBandFilterProps {
  selectedBand: string;
  onBandChange: (band: string) => void;
}

export function YieldBandFilter({ selectedBand, onBandChange }: YieldBandFilterProps) {
  const bands = [
    { value: 'all', label: 'All Bands', color: 'bg-gray-100 text-gray-800' },
    { value: 'high', label: 'High Yield', color: 'bg-green-100 text-green-800' },
    { value: 'medium', label: 'Medium Yield', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'low', label: 'Low Yield', color: 'bg-red-100 text-red-800' }
  ];

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium text-foreground">Filter by Yield Band:</span>
      <div className="flex space-x-1">
        {bands.map((band) => (
          <Button
            key={band.value}
            variant={selectedBand === band.value ? "default" : "outline"}
            size="sm"
            onClick={() => onBandChange(band.value)}
            className={selectedBand === band.value ? "" : `${band.color} border`}
          >
            {band.label}
          </Button>
        ))}
      </div>
    </div>
  );
}