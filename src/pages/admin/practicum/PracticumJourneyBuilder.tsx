import React from 'react';
import { UniversalBuilder } from '@/components/universal-builder/UniversalBuilder';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export function PracticumJourneyBuilder() {
  const navigate = useNavigate();
  const location = useLocation();
  const { journeyId } = useParams();
  const { toast } = useToast();
  const { session } = useAuth();
  
  // Get initial config from location state or create new
  const initialConfig = location.state?.journey || undefined;

  const handleSave = async (config: any) => {
    try {
      const journeyData = {
        user_id: session?.user?.id,
        journey_name: config.name,
        steps: config.elements || [],
        is_active: true,
        is_default: false
      };

      if (journeyId) {
        const { error } = await supabase
          .from('practicum_journeys')
          .update(journeyData)
          .eq('id', journeyId);
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Practicum journey updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('practicum_journeys')
          .insert(journeyData);
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Practicum journey created successfully",
        });
      }
      
      navigate('/admin/practicum/journeys');
    } catch (error) {
      console.error('Error saving practicum journey:', error);
      toast({
        title: "Error",
        description: "Failed to save practicum journey",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    navigate('/admin/practicum/journeys');
  };

  return (
    <UniversalBuilder
      builderType="practicum"
      initialConfig={initialConfig}
      onSave={handleSave}
      onCancel={handleCancel}
    />
  );
}