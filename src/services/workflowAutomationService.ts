import { supabase } from "@/integrations/supabase/client";
import { Lead } from "@/types/lead";

// Define types for automation rules and related entities
export interface AutomationRule {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  trigger_type: 'lead_created' | 'lead_updated' | 'lead_stale' | 'program_match' | 'score_change';
  trigger_config: Record<string, any>;
  conditions: AutomationCondition[];
  actions: AutomationAction[];
  is_active: boolean;
  priority: number;
  created_at: string;
  updated_at: string;
}

export interface AutomationCondition {
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'in' | 'not_in';
  value: any;
  type: 'lead_field' | 'lead_score' | 'lead_age' | 'program_interest';
}

export interface AutomationAction {
  type: 'send_email' | 'assign_to_advisor' | 'add_tag' | 'create_task' | 'update_score' | 'send_notification';
  config: Record<string, any>;
  delay_minutes?: number;
}

export interface AutomationExecution {
  id: string;
  rule_id: string;
  lead_id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  started_at: string;
  completed_at?: string;
  error_message?: string;
  execution_data: Record<string, any>;
  created_at: string;
}

export interface RuleTemplate {
  id: string;
  name: string;
  description: string;
  category: 'lead_qualification' | 'assignment' | 'follow_up' | 'nurturing';
  template_data: Partial<AutomationRule>;
}

export class WorkflowAutomationService {
  
  static async getAutomationRules(): Promise<AutomationRule[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // For now, return mock data until the database tables are properly set up
      return this.getMockAutomationRules();
    } catch (error) {
      console.error('Failed to get automation rules:', error);
      return this.getMockAutomationRules();
    }
  }

  static async createAutomationRule(rule: Partial<AutomationRule>): Promise<AutomationRule> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // For now, create a mock rule until database is properly set up
      const newRule: AutomationRule = {
        id: `rule-${Date.now()}`,
        user_id: user.id,
        name: rule.name || 'New Rule',
        description: rule.description,
        trigger_type: rule.trigger_type || 'lead_created',
        trigger_config: rule.trigger_config || {},
        conditions: rule.conditions || [],
        actions: rule.actions || [],
        is_active: rule.is_active !== undefined ? rule.is_active : true,
        priority: rule.priority || 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      return newRule;
    } catch (error) {
      console.error('Failed to create automation rule:', error);
      throw error;
    }
  }

  static async updateAutomationRule(id: string, updates: Partial<AutomationRule>): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // For now, just log the update until database is properly set up
      console.log('Updating automation rule:', id, updates);
    } catch (error) {
      console.error('Failed to update automation rule:', error);
      throw error;
    }
  }

  static async deleteAutomationRule(id: string): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // For now, just log the delete until database is properly set up
      console.log('Deleting automation rule:', id);
    } catch (error) {
      console.error('Failed to delete automation rule:', error);
      throw error;
    }
  }

  static async getRuleTemplates(): Promise<RuleTemplate[]> {
    // Return predefined templates for now
    return [
      {
        id: 'template-1',
        name: 'New Lead Auto-Assignment',
        description: 'Automatically assign new leads to available advisors based on program interest',
        category: 'assignment',
        template_data: {
          name: 'Auto-Assign New Leads',
          trigger_type: 'lead_created',
          trigger_config: {},
          conditions: [
            {
              field: 'status',
              operator: 'equals',
              value: 'new',
              type: 'lead_field'
            }
          ],
          actions: [
            {
              type: 'assign_to_advisor',
              config: {
                assignment_method: 'smart',
                priority_factors: ['workload', 'specialization']
              }
            }
          ],
          is_active: true,
          priority: 10
        }
      },
      {
        id: 'template-2',
        name: 'High-Value Lead Alert',
        description: 'Send notification when a lead has high qualification score',
        category: 'lead_qualification',
        template_data: {
          name: 'High-Value Lead Alert',
          trigger_type: 'score_change',
          trigger_config: { minimum_score: 80 },
          conditions: [
            {
              field: 'lead_score',
              operator: 'greater_than',
              value: 80,
              type: 'lead_score'
            }
          ],
          actions: [
            {
              type: 'send_notification',
              config: {
                message: 'High-value lead detected!',
                recipients: ['manager']
              }
            },
            {
              type: 'add_tag',
              config: {
                tags: ['high-value', 'priority']
              }
            }
          ],
          is_active: true,
          priority: 20
        }
      },
      {
        id: 'template-3',
        name: 'Stale Lead Follow-up',
        description: 'Create follow-up tasks for leads not contacted in 3 days',
        category: 'follow_up',
        template_data: {
          name: 'Stale Lead Follow-up',
          trigger_type: 'lead_stale',
          trigger_config: { hours_threshold: 72 },
          conditions: [
            {
              field: 'last_contacted_at',
              operator: 'less_than',
              value: '3_days_ago',
              type: 'lead_field'
            }
          ],
          actions: [
            {
              type: 'create_task',
              config: {
                title: 'Follow up with stale lead',
                priority: 'high',
                due_in_hours: 24
              }
            }
          ],
          is_active: true,
          priority: 15
        }
      }
    ];
  }

  static async executeRule(rule: AutomationRule, lead: Lead): Promise<AutomationExecution> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // For now, create a mock execution until database is properly set up
      const execution: AutomationExecution = {
        id: `execution-${Date.now()}`,
        rule_id: rule.id,
        lead_id: lead.id,
        status: 'completed',
        started_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
        execution_data: {
          actions_executed: rule.actions.length,
          success: true
        },
        created_at: new Date().toISOString()
      };

      // Execute actions (simplified for now)
      for (const action of rule.actions) {
        await this.executeAction(action, lead);
      }

      return execution;

    } catch (error) {
      console.error('Failed to execute rule:', error);
      throw error;
    }
  }

  private static async executeAction(
    action: AutomationAction, 
    lead: Lead
  ): Promise<void> {
    switch (action.type) {
      case 'send_email':
        console.log('Sending email to lead:', lead.email, 'with config:', action.config);
        break;
      case 'assign_to_advisor':
        console.log('Assigning lead to advisor with config:', action.config);
        break;
      case 'add_tag':
        await this.addTagAction(action.config, lead);
        break;
      case 'create_task':
        console.log('Creating task for lead with config:', action.config);
        break;
      case 'update_score':
        await this.updateScoreAction(action.config, lead);
        break;
      case 'send_notification':
        console.log('Sending notification with config:', action.config);
        break;
      default:
        console.warn(`Unknown action type: ${action.type}`);
    }
  }

  private static async addTagAction(config: any, lead: Lead): Promise<void> {
    try {
      const tags = config.tags || [];
      const currentTags = lead.tags || [];
      const newTags = [...new Set([...currentTags, ...tags])];

      await supabase
        .from('leads')
        .update({ tags: newTags })
        .eq('id', lead.id);
    } catch (error) {
      console.error('Failed to add tags:', error);
    }
  }

  private static async updateScoreAction(config: any, lead: Lead): Promise<void> {
    try {
      const scoreChange = config.score_change || 0;
      const newScore = (lead.lead_score || 0) + scoreChange;

      await supabase
        .from('leads')
        .update({ lead_score: newScore })
        .eq('id', lead.id);
    } catch (error) {
      console.error('Failed to update score:', error);
    }
  }

  static async getExecutionHistory(ruleId?: string): Promise<AutomationExecution[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // For now, return mock data until database is properly set up
      return this.getMockExecutionHistory();
    } catch (error) {
      console.error('Failed to get execution history:', error);
      return [];
    }
  }

  // Mock data for development
  private static getMockAutomationRules(): AutomationRule[] {
    return [
      {
        id: 'rule-1',
        user_id: 'mock-user',
        name: 'New Lead Auto-Assignment',
        description: 'Automatically assign new leads to available advisors',
        trigger_type: 'lead_created',
        trigger_config: {},
        conditions: [
          {
            field: 'status',
            operator: 'equals',
            value: 'new',
            type: 'lead_field'
          }
        ],
        actions: [
          {
            type: 'assign_to_advisor',
            config: {
              assignment_method: 'smart'
            }
          }
        ],
        is_active: true,
        priority: 10,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'rule-2',
        user_id: 'mock-user',
        name: 'High-Value Lead Alert',
        description: 'Send notification for high-scoring leads',
        trigger_type: 'score_change',
        trigger_config: { minimum_score: 80 },
        conditions: [
          {
            field: 'lead_score',
            operator: 'greater_than',
            value: 80,
            type: 'lead_score'
          }
        ],
        actions: [
          {
            type: 'send_notification',
            config: {
              message: 'High-value lead detected!'
            }
          }
        ],
        is_active: true,
        priority: 20,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
  }

  private static getMockExecutionHistory(): AutomationExecution[] {
    return [
      {
        id: 'execution-1',
        rule_id: 'rule-1',
        lead_id: 'lead-1',
        status: 'completed',
        started_at: new Date(Date.now() - 3600000).toISOString(),
        completed_at: new Date(Date.now() - 3500000).toISOString(),
        execution_data: {
          actions_executed: 1,
          success: true
        },
        created_at: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: 'execution-2',
        rule_id: 'rule-2',
        lead_id: 'lead-2',
        status: 'failed',
        started_at: new Date(Date.now() - 7200000).toISOString(),
        error_message: 'Failed to send notification',
        execution_data: {
          actions_executed: 0,
          success: false
        },
        created_at: new Date(Date.now() - 7200000).toISOString()
      }
    ];
  }
}