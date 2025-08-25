import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Workflow, MessageSquare, Phone, FileText, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { PlaybookCard } from './PlaybookCard';

interface PlaybookConfiguration {
  id: string;
  policy_name: string;
  enabled: boolean;
  settings: any;
  expected_lift: number;
}

export function PlaybookOrchestrator() {
  const [playbooks, setPlaybooks] = useState<PlaybookConfiguration[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const { toast } = useToast();

  const playbookConfigs = [
    {
      id: 'stalled-7day-reengage',
      title: 'Stalled 7-Day Re-engage',
      subtitle: 'Re-ignite momentum: SMS + email + callback task',
      icon: MessageSquare,
      description: 'Automatically re-engages leads who have been stalled for 7+ days',
      sequence: ['SMS reminder', 'Personalized email', 'Priority callback task'],
      triggerCriteria: 'Applications stalled ≥7 days',
      expectedActions: '27 new prioritized actions'
    },
    {
      id: 'event-rsvp-interview',
      title: 'Event RSVP → Interview Invite',
      subtitle: 'Capitalize on warm intent within 48h',
      icon: Phone,
      description: 'Converts event attendance into interview opportunities',
      sequence: ['Thank you message', 'Interview scheduling', 'Calendar integration'],
      triggerCriteria: 'Event RSVP within 24-48h',
      expectedActions: '12 new interview invites'
    },
    {
      id: 'document-chase',
      title: 'Document Chase',
      subtitle: 'Close the paperwork gap with a call + one-click email',
      icon: FileText,
      description: 'Streamlines document collection process',
      sequence: ['Document reminder call', 'One-click status email', 'Follow-up task'],
      triggerCriteria: 'Missing required documents',
      expectedActions: '35 document follow-ups'
    }
  ];

  useEffect(() => {
    loadPlaybookConfigurations();
  }, []);

  const loadPlaybookConfigurations = async () => {
    try {
      const { data, error } = await supabase
        .from('policy_configurations')
        .select('*')
        .in('policy_name', playbookConfigs.map(p => p.id));

      if (error) throw error;
      setPlaybooks(data || []);
    } catch (error) {
      console.error('Error loading playbook configurations:', error);
      toast({
        title: "Error",
        description: "Failed to load playbook configurations",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePlaybookToggle = async (playbookId: string, enabled: boolean) => {
    setUpdating(playbookId);
    
    try {
      // Find existing configuration
      const existingConfig = playbooks.find(p => p.policy_name === playbookId);
      
      if (existingConfig) {
        // Update existing
        const { error } = await supabase
          .from('policy_configurations')
          .update({ enabled })
          .eq('id', existingConfig.id);

        if (error) throw error;

        setPlaybooks(prev => 
          prev.map(p => 
            p.id === existingConfig.id ? { ...p, enabled } : p
          )
        );
      } else {
        // Create new configuration
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const playbookConfig = playbookConfigs.find(p => p.id === playbookId);
        if (!playbookConfig) throw new Error('Playbook configuration not found');

        const { data, error } = await supabase
          .from('policy_configurations')
          .insert({
            user_id: user.id,
            policy_name: playbookId,
            enabled,
            settings: { playbook_type: playbookId },
            expected_lift: 0
          })
          .select()
          .single();

        if (error) throw error;
        setPlaybooks(prev => [...prev, data]);
      }

      // Show success toast with action count
      const playbookConfig = playbookConfigs.find(p => p.id === playbookId);
      if (enabled && playbookConfig) {
        toast({
          title: "Playbook Activated",
          description: `${playbookConfig.expectedActions} created`,
        });
      } else {
        toast({
          title: "Playbook Deactivated",
          description: "Automation sequence stopped",
        });
      }

    } catch (error) {
      console.error('Error updating playbook:', error);
      toast({
        title: "Error",
        description: "Failed to update playbook",
        variant: "destructive"
      });
    } finally {
      setUpdating(null);
    }
  };

  const getPlaybookStatus = (playbookId: string) => {
    const config = playbooks.find(p => p.policy_name === playbookId);
    return config?.enabled || false;
  };

  const activePlaybooks = playbooks.filter(p => p.enabled).length;

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="h-64 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Orchestrator → Playbooks</h1>
          <p className="text-muted-foreground">
            Automated sequences that finish applications and drive conversions
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="text-sm">
            {activePlaybooks} Active Playbooks
          </Badge>
          <div className="flex items-center space-x-2">
            <Workflow className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-foreground">Auto-Orchestration</span>
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Sequences</p>
                <p className="text-2xl font-bold text-foreground">{activePlaybooks}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Actions</p>
                <p className="text-2xl font-bold text-foreground">74</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Phone className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                <p className="text-2xl font-bold text-foreground">89%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Response Time</p>
                <p className="text-2xl font-bold text-foreground">2.3h</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Playbook Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {playbookConfigs.map((playbook) => (
          <PlaybookCard
            key={playbook.id}
            {...playbook}
            enabled={getPlaybookStatus(playbook.id)}
            updating={updating === playbook.id}
            onToggle={(enabled) => handlePlaybookToggle(playbook.id, enabled)}
          />
        ))}
      </div>

      {/* Implementation Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Implementation Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-foreground mb-2">Trigger Conditions</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Days stalled ≥ 7 for re-engagement</li>
                <li>• Event RSVP within 24-48h window</li>
                <li>• Missing required documents</li>
                <li>• Application incomplete for 3+ days</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-foreground mb-2">Action Types</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Automated SMS and email sequences</li>
                <li>• Priority task creation for counselors</li>
                <li>• Document chase workflows</li>
                <li>• Interview scheduling automation</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-foreground mb-2">Success Metrics</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Application completion rate</li>
                <li>• Response time improvement</li>
                <li>• Document submission speed</li>
                <li>• Interview booking conversion</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}