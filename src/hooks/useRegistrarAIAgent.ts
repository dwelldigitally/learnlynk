import { useState, useEffect } from 'react';
import { AIAgentService, AIAgent, AIAgentFilterRule, AIAgentTask, AgentPerformanceMetrics } from '@/services/aiAgentService';

export function useRegistrarAIAgent() {
  const [agents, setAgents] = useState<AIAgent[]>([]);
  const [activeAgent, setActiveAgent] = useState<AIAgent | null>(null);
  const [filterRules, setFilterRules] = useState<AIAgentFilterRule[]>([]);
  const [tasks, setTasks] = useState<AIAgentTask[]>([]);
  const [agentApplications, setAgentApplications] = useState<any[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<AgentPerformanceMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadAgents = async () => {
    try {
      setIsLoading(true);
      const agentsData = await AIAgentService.getAgents('registrar');
      setAgents(agentsData);
      
      const active = agentsData.find(agent => agent.is_active);
      if (active) {
        setActiveAgent(active);
        await loadAgentData(active.id);
      } else {
        setActiveAgent(null);
        setFilterRules([]);
        setTasks([]);
        setAgentApplications([]);
        setPerformanceMetrics(null);
      }
    } catch (error) {
      console.error('Error loading registrar agents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAgentData = async (agentId: string) => {
    try {
      const [rules, agentTasks, applications, metrics] = await Promise.all([
        AIAgentService.getFilterRules(agentId),
        AIAgentService.getTasks(agentId),
        [], // Mock applications data for now
        AIAgentService.getPerformanceMetrics(agentId)
      ]);
      
      setFilterRules(rules);
      setTasks(agentTasks);
      setAgentApplications(applications);
      setPerformanceMetrics(metrics);
    } catch (error) {
      console.error('Error loading registrar agent data:', error);
    }
  };

  const createAgent = async (agentData: Partial<AIAgent>) => {
    try {
      const newAgent = await AIAgentService.createAgent({
        ...agentData,
        agent_type: 'registrar',
        agent_category: 'registrar',
        is_active: true // Set as active by default after creation
      });
      await loadAgents();
      return newAgent;
    } catch (error) {
      console.error('Error creating registrar agent:', error);
      throw error;
    }
  };

  const updateAgent = async (id: string, updates: Partial<AIAgent>) => {
    try {
      await AIAgentService.updateAgent(id, updates);
      await loadAgents();
    } catch (error) {
      console.error('Error updating registrar agent:', error);
      throw error;
    }
  };

  const toggleAgent = async (id: string, isActive: boolean) => {
    try {
      await AIAgentService.toggleAgent(id, isActive);
      await loadAgents();
    } catch (error) {
      console.error('Error toggling registrar agent:', error);
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

  const reassignApplicationsToHumans = async () => {
    try {
      console.log('Reassigning applications to human registrars...');
      await loadAgents();
    } catch (error) {
      console.error('Error reassigning applications:', error);
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
    agentApplications,
    performanceMetrics,
    isLoading,
    createAgent,
    updateAgent,
    toggleAgent,
    createFilterRule,
    updateFilterRule,
    createTask,
    toggleTask,
    reassignApplicationsToHumans,
    loadAgents
  };
}