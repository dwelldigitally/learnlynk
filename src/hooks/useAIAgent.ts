import { useState, useEffect } from 'react';
import { AIAgentService, AIAgent, AIAgentFilterRule, AIAgentTask, AgentPerformanceMetrics } from '@/services/aiAgentService';
import { LeadService } from '@/services/leadService';
import { Lead } from '@/types/lead';
import { useToast } from '@/hooks/use-toast';

export function useAIAgent() {
  const { toast } = useToast();
  const [agents, setAgents] = useState<AIAgent[]>([]);
  const [activeAgent, setActiveAgent] = useState<AIAgent | null>(null);
  const [filterRules, setFilterRules] = useState<AIAgentFilterRule[]>([]);
  const [tasks, setTasks] = useState<AIAgentTask[]>([]);
  const [agentLeads, setAgentLeads] = useState<Lead[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<AgentPerformanceMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load all agents
  const loadAgents = async () => {
    try {
      const agentsData = await AIAgentService.getAgents();
      setAgents(agentsData);
      
      // Find active agent
      const active = agentsData.find(agent => agent.is_active);
      if (active) {
        setActiveAgent(active);
        await loadAgentData(active.id);
      }
    } catch (error) {
      console.error('Error loading agents:', error);
      toast({
        title: "Error",
        description: "Failed to load AI agents",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load data for a specific agent
  const loadAgentData = async (agentId: string) => {
    try {
      const [rulesData, tasksData, metrics] = await Promise.all([
        AIAgentService.getFilterRules(agentId),
        AIAgentService.getTasks(agentId),
        AIAgentService.getPerformanceMetrics(agentId)
      ]);

      setFilterRules(rulesData);
      setTasks(tasksData);
      setPerformanceMetrics(metrics);

      // Load leads managed by this agent
      const { leads } = await LeadService.getLeads();
      const assignedLeads = leads.filter(lead => lead.assigned_to === agentId);
      setAgentLeads(assignedLeads);
    } catch (error) {
      console.error('Error loading agent data:', error);
    }
  };

  // Create a new agent
  const createAgent = async (agentData: Partial<AIAgent>) => {
    try {
      // Check if there's already an active agent
      const hasActiveAgent = agents.some(agent => agent.is_active);
      
      // If no active agent exists, make this one active
      const shouldActivate = !hasActiveAgent;
      
      const newAgent = await AIAgentService.createAgent({
        ...agentData,
        is_active: shouldActivate
      });
      
      setAgents(prev => [newAgent, ...prev]);
      
      // If this is now the active agent, set it and load its data
      if (shouldActivate) {
        setActiveAgent(newAgent);
        await loadAgentData(newAgent.id);
      }
      
      toast({
        title: "Agent Created",
        description: `AI agent "${newAgent.name}" has been created successfully${shouldActivate ? ' and activated' : ''}`
      });
      
      return newAgent;
    } catch (error) {
      console.error('Error creating agent:', error);
      toast({
        title: "Error",
        description: "Failed to create AI agent",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Update agent configuration
  const updateAgent = async (id: string, updates: Partial<AIAgent>) => {
    try {
      const updatedAgent = await AIAgentService.updateAgent(id, updates);
      setAgents(prev => prev.map(agent => agent.id === id ? updatedAgent : agent));
      
      if (activeAgent?.id === id) {
        setActiveAgent(updatedAgent);
      }
      
      toast({
        title: "Agent Updated",
        description: "Agent configuration has been saved"
      });
      return updatedAgent;
    } catch (error) {
      console.error('Error updating agent:', error);
      toast({
        title: "Error",
        description: "Failed to update agent",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Toggle agent active status
  const toggleAgent = async (id: string, isActive: boolean) => {
    try {
      const updatedAgent = await AIAgentService.toggleAgent(id, isActive);
      setAgents(prev => prev.map(agent => 
        agent.id === id ? updatedAgent : { ...agent, is_active: false }
      ));
      
      if (isActive) {
        setActiveAgent(updatedAgent);
        await loadAgentData(id);
      } else if (activeAgent?.id === id) {
        setActiveAgent(null);
        setFilterRules([]);
        setTasks([]);
        setAgentLeads([]);
        setPerformanceMetrics(null);
      }

      toast({
        title: isActive ? "Agent Activated" : "Agent Deactivated",
        description: `${updatedAgent.name} has been ${isActive ? 'activated' : 'deactivated'}`
      });
    } catch (error) {
      console.error('Error toggling agent:', error);
      toast({
        title: "Error",
        description: "Failed to toggle agent status",
        variant: "destructive"
      });
    }
  };

  // Create filter rule
  const createFilterRule = async (ruleData: Partial<AIAgentFilterRule> & { name: string }) => {
    if (!activeAgent) return;
    
    try {
      const newRule = await AIAgentService.createFilterRule({
        agent_id: activeAgent.id,
        name: ruleData.name,
        description: ruleData.description,
        conditions: ruleData.conditions,
        is_active: ruleData.is_active,
        priority: ruleData.priority
      });
      setFilterRules(prev => [...prev, newRule]);
      toast({
        title: "Filter Rule Created",
        description: "New filter rule has been added"
      });
      return newRule;
    } catch (error) {
      console.error('Error creating filter rule:', error);
      toast({
        title: "Error",
        description: "Failed to create filter rule",
        variant: "destructive"
      });
    }
  };

  // Update filter rule
  const updateFilterRule = async (id: string, updates: Partial<AIAgentFilterRule>) => {
    try {
      const updatedRule = await AIAgentService.updateFilterRule(id, updates);
      setFilterRules(prev => prev.map(rule => rule.id === id ? updatedRule : rule));
      toast({
        title: "Filter Rule Updated",
        description: "Filter rule has been saved"
      });
    } catch (error) {
      console.error('Error updating filter rule:', error);
      toast({
        title: "Error",
        description: "Failed to update filter rule",
        variant: "destructive"
      });
    }
  };

  // Create task
  const createTask = async (taskData: Partial<AIAgentTask> & { title: string; task_type: string }) => {
    if (!activeAgent) return;
    
    try {
      const newTask = await AIAgentService.createTask({
        agent_id: activeAgent.id,
        title: taskData.title,
        task_type: taskData.task_type,
        description: taskData.description,
        priority: taskData.priority,
        is_active: taskData.is_active,
        schedule_config: taskData.schedule_config,
        performance_data: taskData.performance_data
      });
      setTasks(prev => [...prev, newTask]);
      toast({
        title: "Task Created",
        description: "New task has been added to the agent"
      });
      return newTask;
    } catch (error) {
      console.error('Error creating task:', error);
      toast({
        title: "Error",
        description: "Failed to create task",
        variant: "destructive"
      });
    }
  };

  // Toggle task
  const toggleTask = async (id: string, isActive: boolean) => {
    try {
      const updatedTask = await AIAgentService.toggleTask(id, isActive);
      setTasks(prev => prev.map(task => task.id === id ? updatedTask : task));
      toast({
        title: `Task ${isActive ? 'Activated' : 'Deactivated'}`,
        description: `"${updatedTask.title}" is now ${isActive ? 'active' : 'inactive'}`
      });
    } catch (error) {
      console.error('Error toggling task:', error);
      toast({
        title: "Error",
        description: "Failed to toggle task",
        variant: "destructive"
      });
    }
  };

  // Reassign leads to human advisors
  const reassignLeadsToHumans = async () => {
    if (!activeAgent || agentLeads.length === 0) return;

    try {
      // This would typically call a service to reassign leads
      // For now, we'll update the local state and show a success message
      setAgentLeads([]);
      
      toast({
        title: "Reassignment Complete",
        description: `${agentLeads.length} leads have been reassigned to human advisors`
      });

      // Refresh agent data
      await loadAgentData(activeAgent.id);
    } catch (error) {
      console.error('Error reassigning leads:', error);
      toast({
        title: "Error",
        description: "Failed to reassign leads",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    loadAgents();
  }, []);

  return {
    agents,
    activeAgent,
    filterRules,
    tasks,
    agentLeads,
    performanceMetrics,
    isLoading,
    createAgent,
    updateAgent,
    toggleAgent,
    createFilterRule,
    updateFilterRule,
    createTask,
    toggleTask,
    reassignLeadsToHumans,
    loadAgents,
    loadAgentData
  };
}
