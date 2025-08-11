import { supabase } from '@/integrations/supabase/client';

export interface AIAgent {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  is_active: boolean;
  personality?: string;
  response_style: string;
  max_concurrent_leads: number;
  handoff_threshold: number;
  configuration: Record<string, any>;
  performance_metrics: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface AIAgentFilterRule {
  id: string;
  agent_id: string;
  name: string;
  description?: string;
  conditions: any;
  is_active: boolean;
  priority: number;
  created_at: string;
  updated_at: string;
}

export interface AIAgentTask {
  id: string;
  agent_id: string;
  title: string;
  description?: string;
  task_type: string;
  priority: string;
  is_active: boolean;
  schedule_config: Record<string, any>;
  performance_data: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface AgentPerformanceMetrics {
  total_leads_handled: number;
  conversion_rate: number;
  average_response_time: number;
  success_rate: number;
  handoffs_count: number;
  active_leads_count: number;
}

export class AIAgentService {
  // Get all agents for the current user
  static async getAgents(): Promise<AIAgent[]> {
    const { data, error } = await supabase
      .from('ai_agents')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as AIAgent[];
  }

  // Get a specific agent by ID
  static async getAgent(id: string): Promise<AIAgent | null> {
    const { data, error } = await supabase
      .from('ai_agents')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data as AIAgent;
  }

  // Create a new AI agent
  static async createAgent(agentData: Partial<AIAgent>): Promise<AIAgent> {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from('ai_agents')
      .insert({
        name: agentData.name || '',
        user_id: user?.id || '',
        description: agentData.description,
        is_active: agentData.is_active || false,
        personality: agentData.personality,
        response_style: agentData.response_style || 'professional',
        max_concurrent_leads: agentData.max_concurrent_leads || 50,
        handoff_threshold: agentData.handoff_threshold || 75,
        configuration: agentData.configuration || {},
        performance_metrics: agentData.performance_metrics || {}
      })
      .select()
      .single();

    if (error) throw error;
    return data as AIAgent;
  }

  // Update an existing agent
  static async updateAgent(id: string, updates: Partial<AIAgent>): Promise<AIAgent> {
    const { data, error } = await supabase
      .from('ai_agents')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as AIAgent;
  }

  // Delete an agent
  static async deleteAgent(id: string): Promise<void> {
    const { error } = await supabase
      .from('ai_agents')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Get active agent for the user
  static async getActiveAgent(): Promise<AIAgent | null> {
    const { data, error } = await supabase
      .from('ai_agents')
      .select('*')
      .eq('is_active', true)
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data as AIAgent;
  }

  // Activate/deactivate agent
  static async toggleAgent(id: string, isActive: boolean): Promise<AIAgent> {
    // First, deactivate all other agents if activating this one
    if (isActive) {
      await supabase
        .from('ai_agents')
        .update({ is_active: false })
        .neq('id', id);
    }

    const { data, error } = await supabase
      .from('ai_agents')
      .update({ is_active: isActive })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as AIAgent;
  }

  // Get filter rules for an agent
  static async getFilterRules(agentId: string): Promise<AIAgentFilterRule[]> {
    const { data, error } = await supabase
      .from('ai_agent_filter_rules')
      .select('*')
      .eq('agent_id', agentId)
      .order('priority', { ascending: false });

    if (error) throw error;
    return (data || []) as AIAgentFilterRule[];
  }

  // Create a filter rule
  static async createFilterRule(ruleData: Partial<AIAgentFilterRule>): Promise<AIAgentFilterRule> {
    const { data, error } = await supabase
      .from('ai_agent_filter_rules')
      .insert(ruleData)
      .select()
      .single();

    if (error) throw error;
    return data as AIAgentFilterRule;
  }

  // Update a filter rule
  static async updateFilterRule(id: string, updates: Partial<AIAgentFilterRule>): Promise<AIAgentFilterRule> {
    const { data, error } = await supabase
      .from('ai_agent_filter_rules')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as AIAgentFilterRule;
  }

  // Delete a filter rule
  static async deleteFilterRule(id: string): Promise<void> {
    const { error } = await supabase
      .from('ai_agent_filter_rules')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Get tasks for an agent
  static async getTasks(agentId: string): Promise<AIAgentTask[]> {
    const { data, error } = await supabase
      .from('ai_agent_tasks')
      .select('*')
      .eq('agent_id', agentId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as AIAgentTask[];
  }

  // Create a task
  static async createTask(taskData: Partial<AIAgentTask>): Promise<AIAgentTask> {
    const { data, error } = await supabase
      .from('ai_agent_tasks')
      .insert(taskData)
      .select()
      .single();

    if (error) throw error;
    return data as AIAgentTask;
  }

  // Update a task
  static async updateTask(id: string, updates: Partial<AIAgentTask>): Promise<AIAgentTask> {
    const { data, error } = await supabase
      .from('ai_agent_tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as AIAgentTask;
  }

  // Delete a task
  static async deleteTask(id: string): Promise<void> {
    const { error } = await supabase
      .from('ai_agent_tasks')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Toggle task active status
  static async toggleTask(id: string, isActive: boolean): Promise<AIAgentTask> {
    const { data, error } = await supabase
      .from('ai_agent_tasks')
      .update({ is_active: isActive })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as AIAgentTask;
  }

  // Get performance metrics for an agent
  static async getPerformanceMetrics(agentId: string): Promise<AgentPerformanceMetrics> {
    // Get leads assigned to this agent
    const { data: leads, error: leadsError } = await supabase
      .from('leads')
      .select('id, status, created_at, assigned_at')
      .eq('assigned_to', agentId);

    if (leadsError) throw leadsError;

    const totalLeads = leads?.length || 0;
    const convertedLeads = leads?.filter(lead => lead.status === 'converted').length || 0;
    const activeLeads = leads?.filter(lead => ['new', 'contacted', 'qualified', 'nurturing'].includes(lead.status)).length || 0;

    return {
      total_leads_handled: totalLeads,
      conversion_rate: totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0,
      average_response_time: 2.3, // Mock data - would calculate from actual response times
      success_rate: 89, // Mock data - would calculate from actual success metrics
      handoffs_count: 3, // Mock data - would calculate from handoff records
      active_leads_count: activeLeads,
    };
  }
}