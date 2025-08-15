import { useState, useEffect } from 'react';
import { AIAgentService, AIAgent, AIAgentFilterRule, AIAgentTask, AgentPerformanceMetrics } from '@/services/aiAgentService';

export function useLeadAIAgent() {
  const [agents, setAgents] = useState<AIAgent[]>([]);
  const [activeAgent, setActiveAgent] = useState<AIAgent | null>(null);
  const [filterRules, setFilterRules] = useState<AIAgentFilterRule[]>([]);
  const [tasks, setTasks] = useState<AIAgentTask[]>([]);
  const [agentLeads, setAgentLeads] = useState<any[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<AgentPerformanceMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadAgents = async () => {
    try {
      setIsLoading(true);
      const agentsData = await AIAgentService.getAgents('lead');
      setAgents(agentsData);
      
      const active = agentsData.find(agent => agent.is_active);
      if (active) {
        setActiveAgent(active);
        await loadAgentData(active.id);
      } else {
        setActiveAgent(null);
        setFilterRules([]);
        setTasks([]);
        setAgentLeads([]);
        setPerformanceMetrics(null);
      }
    } catch (error) {
      console.error('Error loading lead agents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAgentData = async (agentId: string) => {
    try {
      const [rules, agentTasks, leads, metrics] = await Promise.all([
        AIAgentService.getFilterRules(agentId),
        AIAgentService.getTasks(agentId),
        [], // Mock leads data for now
        AIAgentService.getPerformanceMetrics(agentId)
      ]);
      
      setFilterRules(rules);
      setTasks(agentTasks);
      setAgentLeads(leads);
      setPerformanceMetrics(metrics);
    } catch (error) {
      console.error('Error loading agent data:', error);
    }
  };

  const createAgent = async (agentData: Partial<AIAgent>) => {
    try {
      const newAgent = await AIAgentService.createAgent({
        ...agentData,
        agent_type: 'lead',
        agent_category: 'lead',
        is_active: true // Set as active by default after creation
      });
      await loadAgents();
      return newAgent;
    } catch (error) {
      console.error('Error creating lead agent:', error);
      throw error;
    }
  };

  const updateAgent = async (id: string, updates: Partial<AIAgent>) => {
    try {
      await AIAgentService.updateAgent(id, updates);
      await loadAgents();
    } catch (error) {
      console.error('Error updating lead agent:', error);
      throw error;
    }
  };

  const toggleAgent = async (id: string, isActive: boolean) => {
    try {
      await AIAgentService.toggleAgent(id, isActive);
      await loadAgents();
    } catch (error) {
      console.error('Error toggling lead agent:', error);
      throw error;
    }
  };

  const createFilterRule = async (ruleData: Partial<AIAgentFilterRule> & { name: string }) => {
    if (!activeAgent) return;
    try {
      await AIAgentService.createFilterRule({ ...ruleData, agent_id: activeAgent.id });
      await loadAgentData(activeAgent.id);
    } catch (error) {
      console.error('Error creating filter rule:', error);
      throw error;
    }
  };

  const updateFilterRule = async (id: string, updates: Partial<AIAgentFilterRule>) => {
    try {
      await AIAgentService.updateFilterRule(id, updates);
      if (activeAgent) {
        await loadAgentData(activeAgent.id);
      }
    } catch (error) {
      console.error('Error updating filter rule:', error);
      throw error;
    }
  };

  const createTask = async (taskData: Partial<AIAgentTask> & { title: string; task_type: string }) => {
    if (!activeAgent) return;
    try {
      await AIAgentService.createTask({ ...taskData, agent_id: activeAgent.id });
      await loadAgentData(activeAgent.id);
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  };

  const toggleTask = async (id: string, isActive: boolean) => {
    try {
      await AIAgentService.toggleTask(id, isActive);
      if (activeAgent) {
        await loadAgentData(activeAgent.id);
      }
    } catch (error) {
      console.error('Error toggling task:', error);
      throw error;
    }
  };

  const reassignLeadsToHumans = async () => {
    try {
      console.log('Reassigning leads to human advisors...');
      await loadAgents();
    } catch (error) {
      console.error('Error reassigning leads:', error);
      throw error;
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
    loadAgents
  };
}