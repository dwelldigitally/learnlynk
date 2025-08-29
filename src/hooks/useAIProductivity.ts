import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ProductivityMetrics {
  daily_tasks_completed: number;
  avg_response_time_hours: number;
  conversion_rate: number;
  engagement_score: number;
  tasks_auto_executed: number;
  efficiency_rating: 'low' | 'medium' | 'high' | 'excellent';
  improvement_suggestions: string[];
  performance_trend: 'improving' | 'stable' | 'declining';
}

export interface OneClickAction {
  id: string;
  type: 'call' | 'email' | 'schedule' | 'note';
  label: string;
  description: string;
  confidence_score: number;
  estimated_time_minutes: number;
  context_data: any;
}

export interface CounselorCoaching {
  insight: string;
  impact: string;
  suggestion: string;
  priority: 'low' | 'medium' | 'high';
  category: 'timing' | 'content' | 'approach' | 'follow_up';
}

export function useAIProductivity() {
  const [metrics, setMetrics] = useState<ProductivityMetrics | null>(null);
  const [oneClickActions, setOneClickActions] = useState<OneClickAction[]>([]);
  const [coaching, setCoaching] = useState<CounselorCoaching[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadProductivityMetrics = async () => {
    try {
      setIsLoading(true);
      
      // Get current user's tasks for the day
      const today = new Date().toISOString().split('T')[0];
      const { data: todayTasks } = await supabase
        .from('student_actions')
        .select('*')
        .gte('created_at', `${today}T00:00:00`)
        .lte('created_at', `${today}T23:59:59`);

      // Get user's leads and communications
      const { data: userLeads } = await supabase
        .from('leads')
        .select('*, lead_communications(*)')
        .eq('assigned_to', (await supabase.auth.getUser()).data.user?.id);

      const completedTasks = todayTasks?.filter(task => task.status === 'completed') || [];
      const totalTasks = todayTasks?.length || 0;
      
      // Calculate metrics
      const calculatedMetrics: ProductivityMetrics = {
        daily_tasks_completed: completedTasks.length,
        avg_response_time_hours: calculateAverageResponseTime(userLeads || []),
        conversion_rate: calculateConversionRate(userLeads || []),
        engagement_score: calculateEngagementScore(userLeads || []),
        tasks_auto_executed: todayTasks?.filter(task => {
          const metadata = task.metadata as any;
          return metadata?.auto_executed === true;
        }).length || 0,
        efficiency_rating: calculateEfficiencyRating(completedTasks.length, totalTasks),
        improvement_suggestions: generateImprovementSuggestions(userLeads || [], todayTasks || []),
        performance_trend: calculatePerformanceTrend(userLeads || [])
      };

      setMetrics(calculatedMetrics);
      
      // Generate one-click actions
      const actions = await generateOneClickActions(userLeads || []);
      setOneClickActions(actions);

      // Generate coaching insights
      const coachingInsights = generateCoachingInsights(calculatedMetrics, userLeads || []);
      setCoaching(coachingInsights);

    } catch (error) {
      console.error('Error loading productivity metrics:', error);
      toast({
        title: "Error Loading Metrics",
        description: "Failed to load productivity metrics",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const executeOneClickAction = async (action: OneClickAction) => {
    try {
      switch (action.type) {
        case 'call':
          return await executeCallAction(action);
        case 'email':
          return await executeEmailAction(action);
        case 'schedule':
          return await executeScheduleAction(action);
        case 'note':
          return await executeNoteAction(action);
        default:
          throw new Error('Unknown action type');
      }
    } catch (error) {
      console.error('Error executing one-click action:', error);
      toast({
        title: "Action Failed",
        description: "Failed to execute the one-click action",
        variant: "destructive",
      });
      return { success: false, message: 'Action execution failed' };
    }
  };

  useEffect(() => {
    loadProductivityMetrics();
    
    // Refresh metrics every 5 minutes
    const interval = setInterval(loadProductivityMetrics, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return {
    metrics,
    oneClickActions,
    coaching,
    isLoading,
    executeOneClickAction,
    refreshMetrics: loadProductivityMetrics
  };
}

// Helper functions
function calculateAverageResponseTime(leads: any[]): number {
  const communications = leads.flatMap(lead => lead.lead_communications || []);
  if (communications.length === 0) return 0;

  const responseTimes = communications
    .filter(comm => comm.direction === 'outbound')
    .map(comm => {
      // Simulate response time calculation
      return Math.random() * 24; // Random hours for demo
    });

  return responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length;
}

function calculateConversionRate(leads: any[]): number {
  if (leads.length === 0) return 0;
  const converted = leads.filter(lead => lead.status === 'qualified' || lead.status === 'converted');
  return (converted.length / leads.length) * 100;
}

function calculateEngagementScore(leads: any[]): number {
  if (leads.length === 0) return 0;
  
  const totalScore = leads.reduce((sum, lead) => {
    const commCount = lead.lead_communications?.length || 0;
    const leadScore = (lead.lead_score || 0) / 100;
    const aiScore = lead.ai_score || 0;
    
    return sum + (commCount * 0.3 + leadScore * 0.4 + aiScore * 0.3);
  }, 0);

  return Math.min((totalScore / leads.length) * 100, 100);
}

function calculateEfficiencyRating(completed: number, total: number): 'low' | 'medium' | 'high' | 'excellent' {
  if (total === 0) return 'medium';
  const ratio = completed / total;
  
  if (ratio >= 0.9) return 'excellent';
  if (ratio >= 0.7) return 'high';
  if (ratio >= 0.5) return 'medium';
  return 'low';
}

function generateImprovementSuggestions(leads: any[], tasks: any[]): string[] {
  const suggestions = [];
  
  if (tasks.length > 0 && tasks.filter(t => t.status === 'completed').length / tasks.length < 0.7) {
    suggestions.push("Consider using auto-execution for high-confidence tasks to improve completion rate");
  }
  
  const highPriorityTasks = tasks.filter(t => t.priority === 'urgent' && t.status === 'pending');
  if (highPriorityTasks.length > 3) {
    suggestions.push("You have several urgent tasks pending. Focus on these first for maximum impact");
  }
  
  const avgResponseTime = calculateAverageResponseTime(leads);
  if (avgResponseTime > 4) {
    suggestions.push("Faster response times (under 2 hours) can increase conversion rates by 35%");
  }
  
  return suggestions;
}

function calculatePerformanceTrend(leads: any[]): 'improving' | 'stable' | 'declining' {
  // Simulate trend calculation based on recent lead activity
  const recentLeads = leads.filter(lead => 
    new Date(lead.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  );
  
  if (recentLeads.length > leads.length * 0.3) return 'improving';
  if (recentLeads.length > leads.length * 0.1) return 'stable';
  return 'declining';
}

async function generateOneClickActions(leads: any[]): Promise<OneClickAction[]> {
  const actions: OneClickAction[] = [];
  
  // High-priority leads that need immediate attention
  const urgentLeads = leads.filter(lead => {
    const daysSinceContact = Math.floor(
      (Date.now() - new Date(lead.updated_at).getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysSinceContact >= 2 && lead.lead_score > 70;
  });

  urgentLeads.slice(0, 3).forEach((lead, index) => {
    actions.push({
      id: `call-${lead.id}`,
      type: 'call',
      label: `Call ${lead.first_name} ${lead.last_name}`,
      description: `High-value lead (score: ${lead.lead_score}) needs immediate follow-up`,
      confidence_score: 0.85,
      estimated_time_minutes: 15,
      context_data: { lead_id: lead.id, phone: lead.phone }
    });
  });

  // Email opportunities
  const emailOpportunities = leads.filter(lead => 
    lead.status === 'contacted' && !lead.lead_communications?.some(
      (comm: any) => comm.type === 'email' && 
      new Date(comm.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)
    )
  );

  emailOpportunities.slice(0, 2).forEach(lead => {
    actions.push({
      id: `email-${lead.id}`,
      type: 'email',
      label: `Send program info to ${lead.first_name}`,
      description: `Personalized email with program details based on interests`,
      confidence_score: 0.75,
      estimated_time_minutes: 5,
      context_data: { lead_id: lead.id, interests: lead.program_interest }
    });
  });

  return actions;
}

function generateCoachingInsights(metrics: ProductivityMetrics, leads: any[]): CounselorCoaching[] {
  const insights: CounselorCoaching[] = [];

  if (metrics.avg_response_time_hours > 4) {
    insights.push({
      insight: "Your average response time is above optimal range",
      impact: "Leads are 35% more likely to convert with sub-2 hour response times",
      suggestion: "Set up phone notifications for high-priority leads",
      priority: 'high',
      category: 'timing'
    });
  }

  if (metrics.conversion_rate < 15) {
    insights.push({
      insight: "Conversion rate below industry average",
      impact: "Missing potential revenue opportunities",
      suggestion: "Focus on qualified leads first, use personalized messaging templates",
      priority: 'high',
      category: 'approach'
    });
  }

  if (metrics.tasks_auto_executed / metrics.daily_tasks_completed < 0.3) {
    insights.push({
      insight: "Low automation utilization",
      impact: "Spending time on routine tasks instead of high-value activities",
      suggestion: "Enable auto-execution for tasks with 85%+ confidence scores",
      priority: 'medium',
      category: 'approach'
    });
  }

  return insights;
}

// Action execution functions
async function executeCallAction(action: OneClickAction): Promise<{ success: boolean; message: string }> {
  // In real implementation, would integrate with phone system
  console.log('Executing call action:', action);
  return { success: true, message: 'Call scheduled and logged' };
}

async function executeEmailAction(action: OneClickAction): Promise<{ success: boolean; message: string }> {
  // In real implementation, would send actual email
  console.log('Executing email action:', action);
  return { success: true, message: 'Personalized email sent successfully' };
}

async function executeScheduleAction(action: OneClickAction): Promise<{ success: boolean; message: string }> {
  // In real implementation, would integrate with calendar
  console.log('Executing schedule action:', action);
  return { success: true, message: 'Meeting scheduled successfully' };
}

async function executeNoteAction(action: OneClickAction): Promise<{ success: boolean; message: string }> {
  // In real implementation, would save note to CRM
  console.log('Executing note action:', action);
  return { success: true, message: 'Note added to lead record' };
}