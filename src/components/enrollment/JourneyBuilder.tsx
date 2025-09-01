import React from 'react';
import { ModernJourneyBuilder } from './ModernJourneyBuilder';

interface JourneyBuilderProps {
  onBack: () => void;
}

export function JourneyBuilder({ onBack }: JourneyBuilderProps) {
  return <ModernJourneyBuilder onBack={onBack} />;
}