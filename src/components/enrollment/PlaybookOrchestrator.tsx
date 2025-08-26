import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Workflow, MessageSquare, Phone, FileText, CheckCircle, Settings, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PlaybookCard } from './PlaybookCard';
import { PolicyConfigurationService, type PolicyConfig } from '@/services/policyConfigurationService';

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
  const { toast } = useToast();

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
        setPlaybooks(prev => 
          prev.map(p => 
            p.id === existingConfig.id ? updatedConfig : p
          )
        );
      } else {
        // Create new configuration
        const meta = playbookMeta[playbookId];
        if (!meta) throw new Error('Playbook configuration not found');

        const newConfig = await PolicyConfigurationService.upsertConfiguration(playbookId, {
          enabled,
          settings: { playbook_type: playbookId },
          expected_lift: parseFloat(meta.expectedActions.match(/\d+/)?.[0] || '0')
        });
        
        setPlaybooks(prev => [...prev, newConfig]);
      }

      // Show success toast with action count
      const meta = playbookMeta[playbookId];
      if (enabled && meta) {
        toast({
          title: "Playbook Activated",
          description: `${meta.expectedActions} created`,
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

  // Get all unique playbook IDs from database and metadata
  const allPlaybookIds = [...new Set([
    ...playbooks.map(p => p.policy_name),
    ...Object.keys(playbookMeta)
  ])];

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

      {/* Navigation Hints */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Workflow className="h-5 w-5 text-blue-600" />
            How Playbooks, Policies & Automation Rules Work Together
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Workflow className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-medium text-foreground mb-2">Playbooks (This Page)</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Manager-friendly business recipes. Simple on/off switches for enrollment sequences.
              </p>
              <Badge variant="default" className="text-xs">You Are Here</Badge>
            </div>
            
            <div className="text-center">
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Shield className="h-6 w-6 text-orange-600" />
              </div>
              <h4 className="font-medium text-foreground mb-2">Policies</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Safety rules that all playbooks must follow (quiet hours, pacing, stop triggers).
              </p>
              <a href="/admin/enrollment/policies" className="text-sm text-blue-600 hover:underline">
                Configure Policies →
              </a>
            </div>
            
            <div className="text-center">
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Settings className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-medium text-foreground mb-2">Automation Rules</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Technical/advanced interface for custom triggers and complex conditions.
              </p>
              <a href="/admin/enrollment/automation-rules" className="text-sm text-blue-600 hover:underline">
                Advanced Rules →
              </a>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-background border rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Recommended flow:</strong> Start with Playbooks for 80% of needs. Configure Policies to set guardrails. 
              Use Automation Rules only for complex scenarios that don't fit standard playbook templates.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Playbook Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {allPlaybookIds.map((playbookId) => {
          const meta = playbookMeta[playbookId];
          if (!meta) return null;
          
          return (
            <PlaybookCard
              key={playbookId}
              {...meta}
              enabled={getPlaybookStatus(playbookId)}
              updating={updating === playbookId}
              onToggle={(enabled) => handlePlaybookToggle(playbookId, enabled)}
            />
          );
        })}
      </div>

      {/* Navigation Hints */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Workflow className="h-5 w-5 text-blue-600" />
            How Playbooks, Policies & Automation Rules Work Together
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Workflow className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-medium text-foreground mb-2">Playbooks (This Page)</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Manager-friendly business recipes. Simple on/off switches for enrollment sequences.
              </p>
              <Badge variant="default" className="text-xs">You Are Here</Badge>
            </div>
            
            <div className="text-center">
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <MessageSquare className="h-6 w-6 text-orange-600" />
              </div>
              <h4 className="font-medium text-foreground mb-2">Policies</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Safety rules that all playbooks must follow (quiet hours, pacing, stop triggers).
              </p>
              <a href="/admin/enrollment/policies" className="text-sm text-blue-600 hover:underline">
                Configure Policies →
              </a>
            </div>
            
            <div className="text-center">
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-medium text-foreground mb-2">Automation Rules</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Technical/advanced interface for custom triggers and complex conditions.
              </p>
              <a href="/admin/enrollment/automation-rules" className="text-sm text-blue-600 hover:underline">
                Advanced Rules →
              </a>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-background border rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Recommended flow:</strong> Start with Playbooks for 80% of needs. Configure Policies to set guardrails. 
              Use Automation Rules only for complex scenarios that don't fit standard playbook templates.
            </p>
          </div>
        </CardContent>
      </Card>

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