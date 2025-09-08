import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Workflow, MessageSquare, Phone, FileText, CheckCircle, Settings, Shield, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PlaybookCard } from './PlaybookCard';
import { PolicyConfigurationService, type PolicyConfig } from '@/services/policyConfigurationService';
import { PlaybookWizard, type PlaybookData } from './wizard/PlaybookWizard';
interface PlaybookMeta {
  id: string;
  title: string;
  subtitle: string;
  icon: any;
  description: string;
  sequence: string[];
  triggerCriteria: string;
  expectedActions: string;
}
export function PlaybookOrchestrator() {
  const [playbooks, setPlaybooks] = useState<PolicyConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [showWizard, setShowWizard] = useState(false);
  const {
    toast
  } = useToast();
  const playbookMeta: Record<string, PlaybookMeta> = {
    '5-minute-callback': {
      id: '5-minute-callback',
      title: '5-Minute Callback',
      subtitle: 'Ultra-fast response for high-intent leads',
      icon: Phone,
      description: 'Immediately prioritizes high-intent leads for 5-minute callback',
      sequence: ['Lead scoring', 'Instant notification', 'Priority callback task'],
      triggerCriteria: 'High-intent lead submission',
      expectedActions: '15 new priority callbacks'
    },
    'stalled-7day-reengage': {
      id: 'stalled-7day-reengage',
      title: 'Stalled 7-Day Re-engage',
      subtitle: 'Re-ignite momentum: SMS + email + callback task',
      icon: MessageSquare,
      description: 'Automatically re-engages leads who have been stalled for 7+ days',
      sequence: ['SMS reminder', 'Personalized email', 'Priority callback task'],
      triggerCriteria: 'Applications stalled ≥7 days',
      expectedActions: '27 new prioritized actions'
    },
    'event-rsvp-interview': {
      id: 'event-rsvp-interview',
      title: 'Event RSVP → Interview Invite',
      subtitle: 'Capitalize on warm intent within 48h',
      icon: Phone,
      description: 'Converts event attendance into interview opportunities',
      sequence: ['Thank you message', 'Interview scheduling', 'Calendar integration'],
      triggerCriteria: 'Event RSVP within 24-48h',
      expectedActions: '12 new interview invites'
    },
    'document-chase': {
      id: 'document-chase',
      title: 'Document Chase',
      subtitle: 'Close the paperwork gap with a call + one-click email',
      icon: FileText,
      description: 'Streamlines document collection process',
      sequence: ['Document reminder call', 'One-click status email', 'Follow-up task'],
      triggerCriteria: 'Missing required documents',
      expectedActions: '35 document follow-ups'
    }
  };
  useEffect(() => {
    loadPlaybookConfigurations();
  }, []);
  const loadPlaybookConfigurations = async () => {
    try {
      const data = await PolicyConfigurationService.getPlaybooks();
      setPlaybooks(data);
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
        const updatedConfig = await PolicyConfigurationService.toggleEnabled(existingConfig.id, enabled);
        setPlaybooks(prev => prev.map(p => p.id === existingConfig.id ? updatedConfig : p));
      } else {
        // Create new configuration
        const meta = playbookMeta[playbookId];
        if (!meta) throw new Error('Playbook configuration not found');
        const newConfig = await PolicyConfigurationService.upsertConfiguration(playbookId, {
          enabled,
          settings: {
            playbook_type: playbookId
          },
          expected_lift: parseFloat(meta.expectedActions.match(/\d+/)?.[0] || '0')
        });
        setPlaybooks(prev => [...prev, newConfig]);
      }

      // Show success toast with action count
      const meta = playbookMeta[playbookId];
      if (enabled && meta) {
        toast({
          title: "Playbook Activated",
          description: `${meta.expectedActions} created`
        });
      } else {
        toast({
          title: "Playbook Deactivated",
          description: "Automation sequence stopped"
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

  // Get all unique playbook IDs from database and metadata
  const allPlaybookIds = [...new Set([...playbooks.map(p => p.policy_name), ...Object.keys(playbookMeta)])];
  const activePlaybooks = playbooks.filter(p => p.enabled).length;
  if (loading) {
    return <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({
            length: 3
          }, (_, i) => <div key={i} className="h-64 bg-muted rounded"></div>)}
          </div>
        </div>
      </div>;
  }
  return <div className="p-6 space-y-6">
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
          <Button onClick={() => setShowWizard(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Custom Playbook
          </Button>
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

      {/* Navigation Hints */}
      

      {/* Playbook Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {allPlaybookIds.map(playbookId => {
        const meta = playbookMeta[playbookId];
        if (!meta) return null;
        return <PlaybookCard key={playbookId} {...meta} enabled={getPlaybookStatus(playbookId)} updating={updating === playbookId} onToggle={enabled => handlePlaybookToggle(playbookId, enabled)} />;
      })}
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

      {/* Playbook Wizard */}
      {showWizard && <PlaybookWizard onClose={() => setShowWizard(false)} onSave={async (playbookData: PlaybookData) => {
      try {
        await PolicyConfigurationService.upsertConfiguration(`custom-${Date.now()}`, {
          enabled: playbookData.isActive,
          settings: {
            playbook_type: 'custom',
            playbook_data: JSON.parse(JSON.stringify(playbookData))
          } as any,
          expected_lift: playbookData.expectedMetrics.estimatedActions
        });
        toast({
          title: "Custom Playbook Created",
          description: `${playbookData.name} has been created successfully`
        });
        loadPlaybookConfigurations();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to create custom playbook",
          variant: "destructive"
        });
      }
    }} />}
    </div>;
}