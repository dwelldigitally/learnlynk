import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { LeadService } from '@/services/leadService';

interface RealTimeAlert {
  id: string;
  type: 'sla_violation' | 'payment_issue' | 'unassigned' | 'no_response' | 'critical';
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  leadId?: string;
  studentName?: string;
  program?: string;
  timeAgo: string;
  actions: string[];
}

export function useRealTimeAlerts() {
  const [alerts, setAlerts] = useState<RealTimeAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadInitialAlerts();
    setupRealTimeUpdates();
  }, []);

  const loadInitialAlerts = async () => {
    try {
      // Mock implementation for now
      const generatedAlerts: RealTimeAlert[] = [];
      setAlerts(generatedAlerts);
    } catch (error) {
      console.error('Error loading alerts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setupRealTimeUpdates = () => {
    // Set up real-time subscription for lead changes
    const channel = supabase
      .channel('alert-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'leads'
        },
        (payload) => {
          console.log('Lead change detected:', payload);
          // Refresh alerts when leads change
          loadInitialAlerts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const generateAlertsFromLeads = (leads: any[]): RealTimeAlert[] => {
    const now = new Date();
    const alerts: RealTimeAlert[] = [];

    leads.forEach(lead => {
      const createdAt = new Date(lead.created_at);
      const hoursSinceCreated = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
      
      // SLA violation alert for leads without assignment after 24 hours
      if (!lead.assigned_to && hoursSinceCreated > 24) {
        alerts.push({
          id: `sla-${lead.id}`,
          type: 'sla_violation',
          title: 'Response SLA Breach',
          description: `Lead unassigned for ${Math.floor(hoursSinceCreated)} hours`,
          severity: hoursSinceCreated > 48 ? 'critical' : 'high',
          leadId: lead.id,
          studentName: `${lead.first_name} ${lead.last_name}`,
          program: lead.program_interest?.[0] || 'Unknown',
          timeAgo: `${Math.floor(hoursSinceCreated)} hours ago`,
          actions: ['Assign Now', 'Escalate', 'AI Response']
        });
      }

      // High-value unresponsive lead alert
      if (lead.lead_score > 80 && lead.status === 'new' && hoursSinceCreated > 12) {
        alerts.push({
          id: `unresponsive-${lead.id}`,
          type: 'no_response',
          title: 'High-Value Lead Unresponsive',
          description: `High-score lead (${lead.lead_score}) needs immediate attention`,
          severity: 'high',
          leadId: lead.id,
          studentName: `${lead.first_name} ${lead.last_name}`,
          program: lead.program_interest?.[0] || 'Unknown',
          timeAgo: `${Math.floor(hoursSinceCreated)} hours ago`,
          actions: ['Priority Assign', 'Direct Call', 'Send Premium Email']
        });
      }

      // Unassigned lead alert
      if (!lead.assigned_to && hoursSinceCreated > 2) {
        alerts.push({
          id: `unassigned-${lead.id}`,
          type: 'unassigned',
          title: 'Unassigned Lead',
          description: `${lead.source} lead awaiting assignment`,
          severity: 'medium',
          leadId: lead.id,
          studentName: `${lead.first_name} ${lead.last_name}`,
          program: lead.program_interest?.[0] || 'Unknown',
          timeAgo: `${Math.floor(hoursSinceCreated)} hours ago`,
          actions: ['Auto-assign', 'Manual Assign', 'Add Note']
        });
      }
    });

    // Sort by severity and time
    return alerts.sort((a, b) => {
      const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return severityOrder[b.severity] - severityOrder[a.severity];
    });
  };

  const resolveAlert = async (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const resolveMultipleAlerts = async (alertIds: string[]) => {
    setAlerts(prev => prev.filter(alert => !alertIds.includes(alert.id)));
  };

  return {
    alerts,
    isLoading,
    resolveAlert,
    resolveMultipleAlerts,
    refreshAlerts: loadInitialAlerts
  };
}