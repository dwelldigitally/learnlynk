import React from 'react';
import { HubSpotJourneyBuilder } from './HubSpotJourneyBuilder';

interface JourneyBuilderProps {
  onBack: () => void;
  journeyId?: string | null;
}

export function JourneyBuilder({ onBack, journeyId }: JourneyBuilderProps) {
  return <HubSpotJourneyBuilder onBack={onBack} journeyId={journeyId} />;
}