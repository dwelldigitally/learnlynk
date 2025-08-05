import { supabase } from "@/integrations/supabase/client";
import { Lead } from "@/types/lead";

export interface AutomationRule {
  id: string;
  name: string;
  description: string;
  trigger_type: 'lead_created' | 'lead_updated' | 'score_threshold' | 'time_based' | 'status_change' | 'engagement_level';
  trigger_config: Record<string, any>;
  conditions: AutomationCondition[];
  actions: AutomationAction[];
  is_active: boolean;
  priority: number;
  execution_count: number;
  success_count: number;
  failure_count: number;
  last_executed: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface AutomationCondition {
  id: string;
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'in' | 'between';
  value: any;
  logical_operator?: 'AND' | 'OR';
}

export interface AutomationAction {
  id: string;
  action_type: 'send_email' | 'assign_lead' | 'update_status' | 'add_tag' | 'create_task' | 'update_score' | 'convert_to_student';
  action_config: Record<string, any>;
  order_index: number;
}

export interface AutomationExecution {
  id: string;
  rule_id: string;
  lead_id: string;
  trigger_data: Record<string, any>;
  execution_status: 'pending' | 'running' | 'completed' | 'failed';
  actions_executed: number;
  total_actions: number;
  error_message?: string;
  execution_time_ms: number;
  created_at: string;
  completed_at?: string;
}

export interface AutomationMetrics {
  totalRules: number;
  activeRules: number;
  totalExecutions: number;
  successRate: number;
  averageExecutionTime: number;
  topPerformingRules: Array<{
    rule_id: string;
    name: string;
    success_rate: number;
    execution_count: number;
  }>;
  recentActivity: AutomationExecution[];
}

export class WorkflowAutomationService {
  
  // Rule Management
  static async createRule(ruleData: Omit<AutomationRule, 'id' | 'created_at' | 'updated_at' | 'execution_count' | 'success_count' | 'failure_count' | 'last_executed'>): Promise<AutomationRule> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('automation_rules')
      .insert({
        ...ruleData,
        user_id: user.id,
        execution_count: 0,
        success_count: 0,
        failure_count: 0
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to create automation rule: ${error.message}`);
    return data;
  }

  static async updateRule(ruleId: string, updates: Partial<AutomationRule>): Promise<AutomationRule> {
    const { data, error } = await supabase
      .from('automation_rules')
      .update(updates)
      .eq('id', ruleId)
      .select()
      .single();

    if (error) throw new Error(`Failed to update automation rule: ${error.message}`);
    return data;
  }

  static async deleteRule(ruleId: string): Promise<void> {
    const { error } = await supabase
      .from('automation_rules')
      .delete()
      .eq('id', ruleId);

    if (error) throw new Error(`Failed to delete automation rule: ${error.message}`);
  }

  static async getRules(activeOnly = false): Promise<AutomationRule[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    let query = supabase
      .from('automation_rules')
      .select('*')
      .eq('user_id', user.id)
      .order('priority', { ascending: false });

    if (activeOnly) {
      query = query.eq('is_active', true);
    }

    const { data, error } = await query;
    
    if (error) {
      console.error('Failed to fetch automation rules:', error);
      return [];
    }

    return data || [];
  }

  static async toggleRule(ruleId: string): Promise<AutomationRule> {
    const { data: rule } = await supabase
      .from('automation_rules')
      .select('is_active')
      .eq('id', ruleId)
      .single();

    if (!rule) throw new Error('Rule not found');

    return this.updateRule(ruleId, { is_active: !rule.is_active });
  }

  // Rule Execution
  static async executeRule(ruleId: string, lead: Lead, triggerData?: Record<string, any>): Promise<AutomationExecution> {
    const startTime = Date.now();
    
    const { data: rule } = await supabase
      .from('automation_rules')
      .select('*')
      .eq('id', ruleId)
      .single();

    if (!rule || !rule.is_active) {
      throw new Error('Rule not found or inactive');
    }

    // Check conditions
    const conditionsMet = await this.evaluateConditions(rule.conditions, lead);
    
    if (!conditionsMet) {
      throw new Error('Conditions not met for rule execution');
    }

    // Create execution record
    const { data: execution, error } = await supabase
      .from('automation_executions')
      .insert({
        rule_id: ruleId,
        lead_id: lead.id,
        trigger_data: triggerData || {},
        execution_status: 'running',
        actions_executed: 0,
        total_actions: rule.actions.length,
        execution_time_ms: 0
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create execution record: ${error.message}`);
    }

    try {
      // Execute actions
      let actionsExecuted = 0;
      for (const action of rule.actions.sort((a, b) => a.order_index - b.order_index)) {
        await this.executeAction(action, lead, execution.id);
        actionsExecuted++;
      }

      const executionTime = Date.now() - startTime;

      // Update execution record
      const { data: updatedExecution } = await supabase
        .from('automation_executions')
        .update({
          execution_status: 'completed',
          actions_executed: actionsExecuted,
          execution_time_ms: executionTime,
          completed_at: new Date().toISOString()
        })
        .eq('id', execution.id)
        .select()
        .single();

      // Update rule statistics
      await supabase
        .from('automation_rules')
        .update({
          execution_count: rule.execution_count + 1,
          success_count: rule.success_count + 1,
          last_executed: new Date().toISOString()
        })
        .eq('id', ruleId);

      return updatedExecution || execution;

    } catch (error) {
      const executionTime = Date.now() - startTime;
      
      // Update execution record with error
      await supabase
        .from('automation_executions')
        .update({
          execution_status: 'failed',
          error_message: error instanceof Error ? error.message : 'Unknown error',
          execution_time_ms: executionTime,
          completed_at: new Date().toISOString()
        })
        .eq('id', execution.id);

      // Update rule statistics
      await supabase
        .from('automation_rules')
        .update({
          execution_count: rule.execution_count + 1,
          failure_count: rule.failure_count + 1,
          last_executed: new Date().toISOString()
        })
        .eq('id', ruleId);

      throw error;
    }
  }

  // Trigger Detection
  static async checkTriggers(lead: Lead, triggerType: AutomationRule['trigger_type'], previousData?: Partial<Lead>): Promise<void> {
    const rules = await this.getRules(true);
    
    const applicableRules = rules.filter(rule => rule.trigger_type === triggerType);
    
    for (const rule of applicableRules) {
      try {
        const shouldExecute = await this.shouldExecuteRule(rule, lead, previousData);
        
        if (shouldExecute) {
          await this.executeRule(rule.id, lead, { 
            trigger_type: triggerType,
            previous_data: previousData,
            timestamp: new Date().toISOString()
          });
        }
      } catch (error) {
        console.error(`Failed to execute automation rule ${rule.id}:`, error);
      }
    }
  }

  // Analytics and Metrics
  static async getMetrics(dateRange?: { start: Date; end: Date }): Promise<AutomationMetrics> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Get rules
    const rules = await this.getRules();
    const activeRules = rules.filter(r => r.is_active);

    // Get executions with date filter
    let executionsQuery = supabase
      .from('automation_executions')
      .select(`
        *,
        automation_rules!inner(user_id, name)
      `)
      .eq('automation_rules.user_id', user.id);

    if (dateRange) {
      executionsQuery = executionsQuery
        .gte('created_at', dateRange.start.toISOString())
        .lte('created_at', dateRange.end.toISOString());
    }

    const { data: executions } = await executionsQuery;

    const totalExecutions = executions?.length || 0;
    const successfulExecutions = executions?.filter(e => e.execution_status === 'completed').length || 0;
    const successRate = totalExecutions > 0 ? (successfulExecutions / totalExecutions) * 100 : 0;
    
    const averageExecutionTime = totalExecutions > 0 
      ? executions!.reduce((sum, e) => sum + e.execution_time_ms, 0) / totalExecutions 
      : 0;

    // Calculate top performing rules
    const rulePerformance = new Map<string, { success: number; total: number; name: string }>();
    
    executions?.forEach(execution => {
      const ruleId = execution.rule_id;
      const current = rulePerformance.get(ruleId) || { success: 0, total: 0, name: '' };
      current.total++;
      if (execution.execution_status === 'completed') {
        current.success++;
      }
      current.name = execution.automation_rules?.name || 'Unknown';
      rulePerformance.set(ruleId, current);
    });

    const topPerformingRules = Array.from(rulePerformance.entries())
      .map(([rule_id, data]) => ({
        rule_id,
        name: data.name,
        success_rate: data.total > 0 ? (data.success / data.total) * 100 : 0,
        execution_count: data.total
      }))
      .sort((a, b) => b.success_rate - a.success_rate)
      .slice(0, 5);

    // Recent activity
    const recentActivity = executions?.slice(0, 10) || [];

    return {
      totalRules: rules.length,
      activeRules: activeRules.length,
      totalExecutions,
      successRate,
      averageExecutionTime,
      topPerformingRules,
      recentActivity
    };
  }

  // Private helper methods
  private static async evaluateConditions(conditions: AutomationCondition[], lead: Lead): Promise<boolean> {
    if (!conditions || conditions.length === 0) return true;

    let result = true;
    let currentOperator: 'AND' | 'OR' = 'AND';

    for (const condition of conditions) {
      const conditionResult = this.evaluateCondition(condition, lead);
      
      if (currentOperator === 'AND') {
        result = result && conditionResult;
      } else {
        result = result || conditionResult;
      }

      currentOperator = condition.logical_operator || 'AND';
    }

    return result;
  }

  private static evaluateCondition(condition: AutomationCondition, lead: Lead): boolean {
    const fieldValue = this.getFieldValue(lead, condition.field);
    const conditionValue = condition.value;

    switch (condition.operator) {
      case 'equals':
        return fieldValue === conditionValue;
      case 'not_equals':
        return fieldValue !== conditionValue;
      case 'greater_than':
        return Number(fieldValue) > Number(conditionValue);
      case 'less_than':
        return Number(fieldValue) < Number(conditionValue);
      case 'contains':
        return String(fieldValue).toLowerCase().includes(String(conditionValue).toLowerCase());
      case 'in':
        return Array.isArray(conditionValue) && conditionValue.includes(fieldValue);
      case 'between':
        return Array.isArray(conditionValue) && conditionValue.length === 2 &&
               Number(fieldValue) >= Number(conditionValue[0]) && 
               Number(fieldValue) <= Number(conditionValue[1]);
      default:
        return false;
    }
  }

  private static getFieldValue(lead: Lead, fieldPath: string): any {
    const fields = fieldPath.split('.');
    let value: any = lead;
    
    for (const field of fields) {
      value = value?.[field];
    }
    
    return value;
  }

  private static async executeAction(action: AutomationAction, lead: Lead, executionId: string): Promise<void> {
    try {
      switch (action.action_type) {
        case 'send_email':
          await this.sendEmailAction(action.action_config, lead);
          break;
        
        case 'assign_lead':
          await this.assignLeadAction(action.action_config, lead);
          break;
        
        case 'update_status':
          await this.updateStatusAction(action.action_config, lead);
          break;
        
        case 'add_tag':
          await this.addTagAction(action.action_config, lead);
          break;
        
        case 'create_task':
          await this.createTaskAction(action.action_config, lead);
          break;
        
        case 'update_score':
          await this.updateScoreAction(action.action_config, lead);
          break;
        
        case 'convert_to_student':
          await this.convertToStudentAction(action.action_config, lead);
          break;
        
        default:
          throw new Error(`Unknown action type: ${action.action_type}`);
      }

      // Log action execution
      await this.logActionExecution(executionId, action, 'success');
      
    } catch (error) {
      await this.logActionExecution(executionId, action, 'failed', error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  }

  private static async shouldExecuteRule(rule: AutomationRule, lead: Lead, previousData?: Partial<Lead>): Promise<boolean> {
    // Check if rule conditions are met
    const conditionsMet = await this.evaluateConditions(rule.conditions, lead);
    if (!conditionsMet) return false;

    // Check trigger-specific logic
    switch (rule.trigger_type) {
      case 'lead_created':
        return true; // Always execute for new leads if conditions are met
      
      case 'lead_updated':
        return previousData !== undefined; // Only for updates
      
      case 'score_threshold':
        const threshold = rule.trigger_config.threshold || 70;
        const previousScore = previousData?.lead_score || 0;
        return (lead.lead_score || 0) >= threshold && previousScore < threshold;
      
      case 'status_change':
        const targetStatus = rule.trigger_config.target_status;
        return lead.status === targetStatus && previousData?.status !== targetStatus;
      
      case 'time_based':
        // Implement time-based logic (daily, weekly, etc.)
        return this.checkTimeBasedTrigger(rule.trigger_config, lead);
      
      case 'engagement_level':
        // Check engagement metrics
        return this.checkEngagementTrigger(rule.trigger_config, lead);
      
      default:
        return false;
    }
  }

  private static checkTimeBasedTrigger(config: Record<string, any>, lead: Lead): boolean {
    // Implement time-based trigger logic
    const interval = config.interval || 'daily';
    const lastChecked = config.last_checked || lead.created_at;
    
    const now = new Date();
    const lastCheck = new Date(lastChecked);
    
    switch (interval) {
      case 'daily':
        return now.getTime() - lastCheck.getTime() >= 24 * 60 * 60 * 1000;
      case 'weekly':
        return now.getTime() - lastCheck.getTime() >= 7 * 24 * 60 * 60 * 1000;
      default:
        return false;
    }
  }

  private static checkEngagementTrigger(config: Record<string, any>, lead: Lead): boolean {
    // This would check recent activities, email opens, etc.
    // For now, return based on lead score as a proxy
    const engagementThreshold = config.threshold || 50;
    return (lead.lead_score || 0) >= engagementThreshold;
  }

  // Action implementations
  private static async sendEmailAction(config: Record<string, any>, lead: Lead): Promise<void> {
    // Implement email sending logic
    console.log(`Sending email to ${lead.email} with template ${config.template_id}`);
  }

  private static async assignLeadAction(config: Record<string, any>, lead: Lead): Promise<void> {
    await supabase
      .from('leads')
      .update({
        assigned_to: config.advisor_id,
        assigned_at: new Date().toISOString(),
        assignment_method: 'automation'
      })
      .eq('id', lead.id);
  }

  private static async updateStatusAction(config: Record<string, any>, lead: Lead): Promise<void> {
    await supabase
      .from('leads')
      .update({ status: config.status })
      .eq('id', lead.id);
  }

  private static async addTagAction(config: Record<string, any>, lead: Lead): Promise<void> {
    const currentTags = lead.tags || [];
    const newTags = [...new Set([...currentTags, ...config.tags])];
    
    await supabase
      .from('leads')
      .update({ tags: newTags })
      .eq('id', lead.id);
  }

  private static async createTaskAction(config: Record<string, any>, lead: Lead): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    
    await supabase
      .from('lead_tasks')
      .insert({
        lead_id: lead.id,
        user_id: user?.id,
        title: config.title,
        description: config.description,
        task_type: config.task_type || 'follow_up',
        priority: config.priority || 'medium',
        due_date: config.due_date ? new Date(config.due_date).toISOString() : undefined,
        assigned_to: config.assigned_to || lead.assigned_to
      });
  }

  private static async updateScoreAction(config: Record<string, any>, lead: Lead): Promise<void> {
    const currentScore = lead.lead_score || 0;
    let newScore: number;

    switch (config.operation) {
      case 'add':
        newScore = currentScore + (config.value || 0);
        break;
      case 'subtract':
        newScore = currentScore - (config.value || 0);
        break;
      case 'set':
        newScore = config.value || 0;
        break;
      default:
        newScore = currentScore;
    }

    newScore = Math.max(0, Math.min(100, newScore)); // Clamp between 0-100

    await supabase
      .from('leads')
      .update({ lead_score: newScore })
      .eq('id', lead.id);
  }

  private static async convertToStudentAction(config: Record<string, any>, lead: Lead): Promise<void> {
    // Use the HandoverService to convert lead to student
    const { HandoverService } = await import('./handoverService');
    await HandoverService.createStudentFromLead(lead.id);
  }

  private static async logActionExecution(
    executionId: string, 
    action: AutomationAction, 
    status: 'success' | 'failed', 
    errorMessage?: string
  ): Promise<void> {
    await supabase
      .from('automation_action_logs')
      .insert({
        execution_id: executionId,
        action_type: action.action_type,
        action_config: action.action_config,
        status,
        error_message: errorMessage,
        executed_at: new Date().toISOString()
      });
  }
}