import React, { useState } from 'react';
import { UniversalBuilder } from '@/components/universal-builder/UniversalBuilder';
import { BuilderConfig } from '@/types/universalBuilder';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { AcademicJourneyService } from '@/services/academicJourneyService';
interface JourneyBuilderProps {
  onBack: () => void;
}
export function JourneyBuilder({
  onBack
}: JourneyBuilderProps) {
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
      // Create the academic journey in the database
      const journey = await AcademicJourneyService.createAcademicJourney({
        name: config.name,
        description: config.description,
        is_active: true,
        version: 1,
        metadata: { builder_config: config }
      });

      // Create journey stages for each element in the config
      for (let i = 0; i < config.elements.length; i++) {
        const element = config.elements[i];
        await AcademicJourneyService.createJourneyStage({
          journey_id: journey.id,
          name: element.title || `Step ${i + 1}`,
          description: element.config?.description || '',
          stage_type: element.config?.stage_type || 'custom',
          order_index: i,
          is_required: element.config?.is_required || true,
          is_parallel: false,
          status: 'active',
          timing_config: {
            stall_threshold_days: element.config?.stall_threshold_days || 7,
            expected_duration_days: element.config?.expected_duration_days || 3
          },
          completion_criteria: element.config?.completion_criteria || {},
          escalation_rules: element.config?.escalation_rules || {}
        });
      }

      toast.success('Journey saved successfully!');
      onBack(); // Return to journey list
    } catch (error) {
      console.error('Error saving journey:', error);
      toast.error('Failed to save journey. Please try again.');
    }
  };
  const handleCancel = () => {
    onBack();
  };
  return <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Journey Builder</h1>
          <p className="text-muted-foreground">Create step-by-step academic journeys with drag-and-drop blocks</p>
        </div>
        
      </div>

      <UniversalBuilder builderType="journey" initialConfig={initialConfig} onSave={handleSave} onCancel={handleCancel} />
    </div>;
}