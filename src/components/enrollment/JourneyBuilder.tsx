import React, { useState } from 'react';
import { UniversalBuilder } from '@/components/universal-builder/UniversalBuilder';
import { BuilderConfig } from '@/types/universalBuilder';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface JourneyBuilderProps {
  onBack: () => void;
}

export function JourneyBuilder({ onBack }: JourneyBuilderProps) {
  const [journeyName, setJourneyName] = useState('New Academic Journey');
  const [journeyDescription, setJourneyDescription] = useState('Configure the steps for your academic journey');

  const initialConfig: BuilderConfig = {
    name: journeyName,
    description: journeyDescription,
    type: 'journey',
    elements: [],
    settings: {}
  };

  const handleSave = async (config: BuilderConfig) => {
    try {
      // Here you would save the journey configuration to your backend
      console.log('Saving journey config:', config);
      toast.success('Journey saved successfully!');
      // You can integrate with your existing academic journey service here
    } catch (error) {
      console.error('Error saving journey:', error);
      toast.error('Failed to save journey');
    }
  };

  const handleCancel = () => {
    onBack();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Journey Builder</h1>
          <p className="text-muted-foreground">Create step-by-step academic journeys with drag-and-drop blocks</p>
        </div>
        <Button variant="outline" onClick={onBack}>
          Back to Manager
        </Button>
      </div>

      <UniversalBuilder
        builderType="journey"
        initialConfig={initialConfig}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  );
}