import { supabase } from "@/integrations/supabase/client";

export interface LeadCommunication {
  id: string;
  lead_id: string;
  ai_agent_id?: string;
  communication_date: string;
  content: string;
  direction: string;
  is_ai_generated: boolean;
  metadata: any;
  scheduled_for?: string;
  status: string;
  type: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface LeadDocument {
  id: string;
  lead_id: string;
  document_name: string;
  document_type: string;
  file_path?: string;
  file_size?: number;
  status: string;
  upload_date?: string;
  required: boolean;
  ai_insight?: string;
  admin_comments?: string;
  metadata: any;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface LeadTask {
  id: string;
  lead_id: string;
  assigned_to?: string;
  title: string;
  description?: string;
  priority: string;
  status: string;
  due_date?: string;
  completed_at?: string;
  metadata: any;
  task_type: string;
  reminder_at?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface AcademicJourneyStage {
  id: string;
  name: string;
  description?: string;
  order_index: number;
  is_required: boolean;
  estimated_duration_days?: number;
}

export interface LeadAcademicJourney {
  id: string;
  lead_id: string;
  journey_name: string;
  current_stage_name: string;
  current_step: number;
  total_steps: number;
  enrolled_at: string;
  estimated_completion_date?: string;
  next_required_action?: string;
  metadata: any;
  stages: JourneyProgress[];
}

export interface JourneyProgress {
  id: string;
  stage_name: string;
  completed: boolean;
  completed_at?: string;
  notes?: string;
}

class LeadDataService {
  async getCommunications(leadId: string): Promise<{ data: LeadCommunication[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('lead_communications')
        .select('*')
        .eq('lead_id', leadId)
        .order('created_at', { ascending: false });

      return { data, error };
    } catch (error) {
      console.error('Error fetching communications:', error);
      return { data: null, error };
    }
  }

  async getDocuments(leadId: string): Promise<{ data: LeadDocument[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('lead_documents')
        .select('*')
        .eq('lead_id', leadId)
        .order('created_at', { ascending: false });

      return { data, error };
    } catch (error) {
      console.error('Error fetching documents:', error);
      return { data: null, error };
    }
  }

  async getTasks(leadId: string): Promise<{ data: LeadTask[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('lead_tasks')
        .select('*')
        .eq('lead_id', leadId)
        .order('created_at', { ascending: false });

      // Transform data to ensure metadata is included
      const transformedData = data?.map((task: any) => ({
        ...task,
        metadata: task.metadata || {}
      })) || null;

      return { data: transformedData, error };
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return { data: null, error };
    }
  }

  async getAcademicJourney(leadId: string): Promise<{ data: LeadAcademicJourney | null; error: any }> {
    try {
      // First get the journey - use maybeSingle to handle no data case
      const { data: journeyData, error: journeyError } = await supabase
        .from('lead_academic_journeys')
        .select('*')
        .eq('lead_id', leadId)
        .maybeSingle();

      if (journeyError) {
        return { data: null, error: journeyError };
      }

      if (!journeyData) {
        return { data: null, error: null };
      }

      // Then get the progress stages
      const { data: progressData, error: progressError } = await supabase
        .from('lead_journey_progress')
        .select('*')
        .eq('journey_id', journeyData.id)
        .order('created_at', { ascending: true });

      if (progressError) {
        return { data: null, error: progressError };
      }

      const journey: LeadAcademicJourney = {
        ...journeyData,
        stages: progressData || []
      };

      return { data: journey, error: null };
    } catch (error) {
      console.error('Error fetching academic journey:', error);
      return { data: null, error };
    }
  }

  async createCommunication(communication: Omit<LeadCommunication, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: LeadCommunication | null; error: any }> {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('lead_communications')
        .insert([{
          ...communication,
          user_id: user.user?.id
        }])
        .select()
        .single();

      return { data, error };
    } catch (error) {
      console.error('Error creating communication:', error);
      return { data: null, error };
    }
  }

  async createTask(task: Omit<LeadTask, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: LeadTask | null; error: any }> {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('lead_tasks')
        .insert([{
          ...task,
          user_id: user.user?.id,
          task_type: task.task_type || 'general'
        }])
        .select()
        .single();

      // Transform the response to ensure metadata is included
      const transformedData = data ? {
        ...(data as any),
        metadata: (data as any).metadata || {}
      } : null;

      return { data: transformedData as LeadTask, error };
    } catch (error) {
      console.error('Error creating task:', error);
      return { data: null, error };
    }
  }

  async createAcademicJourney(leadId: string, journeyName: string = 'Default Academic Journey'): Promise<{ data: LeadAcademicJourney | null; error: any }> {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      // Get default journey stages
      const { data: stages, error: stagesError } = await supabase
        .from('academic_journey_stages')
        .select('*')
        .eq('user_id', '00000000-0000-0000-0000-000000000000')
        .order('order_index', { ascending: true });

      if (stagesError || !stages || stages.length === 0) {
        return { data: null, error: stagesError || new Error('No journey stages found') };
      }

      const totalSteps = stages.length;
      const firstStage = stages[0];

      // Create the journey
      const { data: journeyData, error: journeyError } = await supabase
        .from('lead_academic_journeys')
        .insert([{
          lead_id: leadId,
          user_id: user.user?.id,
          journey_name: journeyName,
          current_stage_id: firstStage.id,
          current_stage_name: firstStage.name,
          current_step: 1,
          total_steps: totalSteps,
          next_required_action: 'Begin initial inquiry process'
        }])
        .select()
        .single();

      if (journeyError) {
        return { data: null, error: journeyError };
      }

      // Create progress entries for all stages
      const progressEntries = stages.map((stage, index) => ({
        lead_id: leadId,
        journey_id: journeyData.id,
        stage_id: stage.id,
        stage_name: stage.name,
        completed: index === 0 // Mark first stage as completed
      }));

      const { data: progressData, error: progressError } = await supabase
        .from('lead_journey_progress')
        .insert(progressEntries)
        .select();

      if (progressError) {
        return { data: null, error: progressError };
      }

      const journey: LeadAcademicJourney = {
        ...journeyData,
        stages: progressData || []
      };

      return { data: journey, error: null };
    } catch (error) {
      console.error('Error creating academic journey:', error);
      return { data: null, error };
    }
  }
}

export const leadDataService = new LeadDataService();