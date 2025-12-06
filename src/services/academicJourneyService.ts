import { supabase } from '@/integrations/supabase/client';
import type { 
  AcademicJourney, 
  JourneyTemplate, 
  JourneyStage, 
  JourneyRequirement, 
  JourneyChannelRule 
} from '@/types/academicJourney';

export class AcademicJourneyService {
  // Journey Templates
  static async getJourneyTemplates(category?: string) {
    const query = supabase
      .from('journey_templates')
      .select('*')
      .order('usage_count', { ascending: false });

    if (category) {
      query.eq('category', category);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as unknown as JourneyTemplate[];
  }

  static async createJourneyTemplate(template: Partial<JourneyTemplate>) {
    const { data, error } = await supabase
      .from('journey_templates')
      .insert([template as any])
      .select()
      .single();

    if (error) throw error;
    return data as unknown as JourneyTemplate;
  }

  // Academic Journeys
  static async getAcademicJourneys(userId?: string) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return [];
    }

    const query = supabase
      .from('academic_journeys')
      .select(`
        *,
        journey_stages (
          *,
          journey_requirements (*),
          journey_channel_rules (*)
        )
      `)
      .eq('user_id', userId || user.id)
      .order('created_at', { ascending: false });

    const { data, error } = await query;
    if (error) throw error;
    return data as unknown as AcademicJourney[];
  }

  static async getAcademicJourney(id: string) {
    const { data, error } = await supabase
      .from('academic_journeys')
      .select(`
        *,
        journey_stages (
          *,
          journey_requirements (*),
          journey_channel_rules (*)
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as unknown as AcademicJourney;
  }

  static async createAcademicJourney(journey: Partial<AcademicJourney>) {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('academic_journeys')
      .insert([{
        ...journey,
        user_id: user.user.id
      } as any])
      .select()
      .single();

    if (error) throw error;
    return data as unknown as AcademicJourney;
  }

  static async updateAcademicJourney(id: string, journey: Partial<AcademicJourney>) {
    const { data, error } = await supabase
      .from('academic_journeys')
      .update(journey as any)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as unknown as AcademicJourney;
  }

  static async deleteAcademicJourney(id: string) {
    const { error } = await supabase
      .from('academic_journeys')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Journey Stages
  static async createJourneyStage(stage: Partial<JourneyStage>) {
    const { data, error } = await supabase
      .from('journey_stages')
      .insert([stage as any])
      .select()
      .single();

    if (error) throw error;
    return data as unknown as JourneyStage;
  }

  static async updateJourneyStage(id: string, stage: Partial<JourneyStage>) {
    const { data, error } = await supabase
      .from('journey_stages')
      .update(stage as any)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as unknown as JourneyStage;
  }

  static async deleteJourneyStage(id: string) {
    const { error } = await supabase
      .from('journey_stages')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  static async reorderJourneyStages(journeyId: string, stageIds: string[]) {
    const updates = stageIds.map((stageId, index) => ({
      id: stageId,
      order_index: index
    }));

    const { error } = await supabase
      .from('journey_stages')
      .upsert(updates as any, { onConflict: 'id' });

    if (error) throw error;
  }

  // Journey Requirements
  static async createJourneyRequirement(requirement: Partial<JourneyRequirement>) {
    const { data, error } = await supabase
      .from('journey_requirements')
      .insert([requirement as any])
      .select()
      .single();

    if (error) throw error;
    return data as unknown as JourneyRequirement;
  }

  static async updateJourneyRequirement(id: string, requirement: Partial<JourneyRequirement>) {
    const { data, error } = await supabase
      .from('journey_requirements')
      .update(requirement as any)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as unknown as JourneyRequirement;
  }

  static async deleteJourneyRequirement(id: string) {
    const { error } = await supabase
      .from('journey_requirements')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Journey Channel Rules
  static async createJourneyChannelRule(rule: Partial<JourneyChannelRule>) {
    const { data, error } = await supabase
      .from('journey_channel_rules')
      .insert([rule as any])
      .select()
      .single();

    if (error) throw error;
    return data as unknown as JourneyChannelRule;
  }

  static async updateJourneyChannelRule(id: string, rule: Partial<JourneyChannelRule>) {
    const { data, error } = await supabase
      .from('journey_channel_rules')
      .update(rule as any)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as unknown as JourneyChannelRule;
  }

  static async deleteJourneyChannelRule(id: string) {
    const { error } = await supabase
      .from('journey_channel_rules')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Journey Creation from Template
  static async createJourneyFromTemplate(templateId: string, programId: string, customization?: {
    name?: string;
    description?: string;
    modifications?: Record<string, any>;
  }) {
    const template = await this.getJourneyTemplate(templateId);
    if (!template) throw new Error('Template not found');

    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');

    // Create the journey
    const journey = await this.createAcademicJourney({
      user_id: user.user.id,
      program_id: programId,
      template_id: templateId,
      name: customization?.name || `${template.name} Journey`,
      description: customization?.description || template.description,
      version: 1,
      is_active: true,
      metadata: {
        created_from_template: true,
        template_version: template.template_data,
        customizations: customization?.modifications || {}
      }
    });

    // Create stages from template
    const stagePromises = template.template_data.stages.map(async (stageTemplate, index) => {
      const stage = await this.createJourneyStage({
        journey_id: journey.id,
        name: stageTemplate.name,
        description: stageTemplate.description,
        stage_type: stageTemplate.stage_type,
        order_index: index,
        is_required: true,
        is_parallel: false,
        status: 'active',
        timing_config: stageTemplate.timing_config,
        completion_criteria: {},
        escalation_rules: {}
      });

      // Create requirements for this stage
      const requirementPromises = stageTemplate.requirements.map(async (reqTemplate, reqIndex) => {
        return this.createJourneyRequirement({
          stage_id: stage.id,
          name: reqTemplate.name,
          requirement_type: reqTemplate.requirement_type,
          is_mandatory: reqTemplate.is_mandatory,
          order_index: reqIndex,
          verification_method: 'manual',
          validation_rules: reqTemplate.validation_rules || {},
          reminder_schedule: { reminder_intervals_days: [3, 7, 14] },
          description: ''
        });
      });

      // Create channel rules for this stage
      const channelRulePromises = stageTemplate.channel_rules.map(async (ruleTemplate) => {
        return this.createJourneyChannelRule({
          stage_id: stage.id,
          channel_type: ruleTemplate.channel_type,
          is_allowed: ruleTemplate.is_allowed,
          priority_threshold: ruleTemplate.priority_threshold,
          conditions: ruleTemplate.conditions || {},
          time_restrictions: {},
          frequency_limits: {}
        });
      });

      await Promise.all([...requirementPromises, ...channelRulePromises]);
      return stage;
    });

    await Promise.all(stagePromises);

    // Increment template usage count
    await supabase
      .from('journey_templates')
      .update({ usage_count: template.usage_count + 1 })
      .eq('id', templateId);

    return this.getAcademicJourney(journey.id);
  }

  private static async getJourneyTemplate(id: string) {
    const { data, error } = await supabase
      .from('journey_templates')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as unknown as JourneyTemplate;
  }
}

// React Hook for Academic Journeys
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useAcademicJourneys() {
  return useQuery({
    queryKey: ['academic-journeys'],
    queryFn: () => AcademicJourneyService.getAcademicJourneys(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useAcademicJourney(id: string | null | undefined) {
  return useQuery({
    queryKey: ['academic-journey', id],
    queryFn: () => AcademicJourneyService.getAcademicJourney(id!),
    enabled: !!id,
  });
}

export function useJourneyTemplates(category?: string) {
  return useQuery({
    queryKey: ['journey-templates', category],
    queryFn: () => AcademicJourneyService.getJourneyTemplates(category),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useCreateAcademicJourney() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: AcademicJourneyService.createAcademicJourney,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['academic-journeys'] });
    },
  });
}

export function useUpdateAcademicJourney() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, journey }: { id: string; journey: Partial<AcademicJourney> }) =>
      AcademicJourneyService.updateAcademicJourney(id, journey),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['academic-journeys'] });
      queryClient.invalidateQueries({ queryKey: ['academic-journey', data.id] });
    },
  });
}

export function useDeleteAcademicJourney() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => AcademicJourneyService.deleteAcademicJourney(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['academic-journeys'] });
    },
  });
}

export function useDuplicateAcademicJourney() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      // Fetch the original journey with all stages
      const original = await AcademicJourneyService.getAcademicJourney(id);
      if (!original) throw new Error('Journey not found');
      
      // Create a copy of the journey
      const newJourney = await AcademicJourneyService.createAcademicJourney({
        name: `${original.name} (Copy)`,
        description: original.description,
        program_id: original.program_id,
        is_active: false,
        version: 1,
        metadata: original.metadata
      });
      
      // Copy all stages
      if (original.stages && original.stages.length > 0) {
        for (const stage of original.stages) {
          await AcademicJourneyService.createJourneyStage({
            journey_id: newJourney.id,
            name: stage.name,
            description: stage.description,
            stage_type: stage.stage_type,
            order_index: stage.order_index,
            is_required: stage.is_required,
            is_parallel: stage.is_parallel,
            status: stage.status,
            timing_config: stage.timing_config,
            completion_criteria: stage.completion_criteria,
            escalation_rules: stage.escalation_rules
          });
        }
      }
      
      return newJourney;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['academic-journeys'] });
    },
  });
}

export function useToggleJourneyStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, is_active }: { id: string; is_active: boolean }) =>
      AcademicJourneyService.updateAcademicJourney(id, { is_active }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['academic-journeys'] });
    },
  });
}

export function useCreateJourneyFromTemplate() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ templateId, programId, customization }: {
      templateId: string;
      programId: string;
      customization?: {
        name?: string;
        description?: string;
        modifications?: Record<string, any>;
      };
    }) => AcademicJourneyService.createJourneyFromTemplate(templateId, programId, customization),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['academic-journeys'] });
    },
  });
}