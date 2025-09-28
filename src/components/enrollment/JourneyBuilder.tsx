import React from 'react';
import { HubSpotJourneyBuilder } from './HubSpotJourneyBuilder';

interface JourneyBuilderProps {
  onBack: () => void;
}

export function JourneyBuilder({ onBack }: JourneyBuilderProps) {
  return <HubSpotJourneyBuilder onBack={onBack} />;
}