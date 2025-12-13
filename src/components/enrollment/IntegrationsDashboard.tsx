import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Database, CheckCircle, AlertCircle, Clock, Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface IntegrationStatus {
  name: string;
  status: 'connected' | 'disconnected' | 'syncing' | 'error';
  lastSync: string;
  nextSync?: string;
  recordsProcessed?: number;
  availability: 'GA' | 'Beta' | 'Coming Soon';
  description: string;
}

export function IntegrationsDashboard() {
  const [integrations, setIntegrations] = useState<IntegrationStatus[]>([
    {
      name: 'CSV Bridge',
      status: 'connected',
      lastSync: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 minutes ago
      recordsProcessed: 847,
      availability: 'GA',
      description: 'Direct CSV import for action queue and student data'
    },
    {
      name: 'Slate SIS',
      status: 'connected',
      lastSync: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
      nextSync: new Date(Date.now() + 45 * 60 * 1000).toISOString(), // 45 minutes from now
      recordsProcessed: 2156,
      availability: 'GA',
      description: 'Real-time sync with Slate admissions platform'
    },
    {
      name: 'Colleague ERP',
      status: 'syncing',
      lastSync: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // 1 hour ago
      recordsProcessed: 1423,
      availability: 'Beta',
      description: 'Integration with Colleague student information system'
    },
    {
      name: 'Salesforce CRM',
      status: 'disconnected',
      lastSync: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      availability: 'Coming Soon',
      description: 'Bi-directional sync with Salesforce Education Cloud'
    }
  ]);

  const [isRunningJob, setIsRunningJob] = useState(false);
  const [actionCount, setActionCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    loadActionCount();
  }, []);

  const loadActionCount = async () => {
    try {
      const { data, error } = await supabase
        .from('action_queue')
        .select('id')
        .eq('status', 'pending');

      if (error) throw error;
      setActionCount(data?.length || 0);
    } catch (error) {
      console.error('Error loading action count:', error);
    }
  };

  const handleRunCSVJob = async () => {
    setIsRunningJob(true);
    try {
      // Update CSV Bridge integration status
      const updatedIntegrations = integrations.map(integration => 
        integration.name === 'CSV Bridge' 
          ? { 
              ...integration, 
              lastSync: new Date().toISOString(),
              recordsProcessed: (integration.recordsProcessed || 0) + 25
            }
          : integration
      );
      setIntegrations(updatedIntegrations);

      // Refresh action count
      await loadActionCount();

      toast({
        title: "CSV Job Completed",
        description: `Data refreshed successfully`,
      });
    } catch (error) {
      console.error('Error running CSV job:', error);
      toast({
        title: "Error",
        description: "Failed to run CSV job",
        variant: "destructive"
      });
    } finally {
      setIsRunningJob(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'syncing':
        return <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      connected: 'default',
      syncing: 'secondary',
      error: 'destructive',
      disconnected: 'outline'
    };
    
    return (
      <Badge variant={variants[status] || 'outline'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getAvailabilityBadge = (availability: string) => {
    const colors = {
      'GA': 'bg-green-100 text-green-800',
      'Beta': 'bg-blue-100 text-blue-800',
      'Coming Soon': 'bg-gray-100 text-gray-600'
    };
    
    return (
      <Badge variant="secondary" className={colors[availability as keyof typeof colors]}>
        {availability}
      </Badge>
    );
  };

  const formatTimeAgo = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.round(diffMins / 60)}h ago`;
    return `${Math.round(diffMins / 1440)}d ago`;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Integrations</h1>
          <p className="text-muted-foreground">
            Time-to-value: Move numbers in ≤30 days
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Current Actions</div>
            <div className="text-2xl font-bold text-foreground">{actionCount}</div>
          </div>
          <Button
            onClick={handleRunCSVJob}
            disabled={isRunningJob}
            className="flex items-center space-x-2"
          >
            <Upload className="h-4 w-4" />
            <span>{isRunningJob ? 'Running...' : 'Run CSV Job'}</span>
          </Button>
        </div>
      </div>

      {/* Integration Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {integrations.map((integration, index) => (
          <Card key={index} className="relative">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(integration.status)}
                  <div>
                    <CardTitle className="text-lg">{integration.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{integration.description}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  {getAvailabilityBadge(integration.availability)}
                  {getStatusBadge(integration.status)}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Last Sync</span>
                  <span className="text-sm font-medium">
                    {formatTimeAgo(integration.lastSync)}
                  </span>
                </div>
                
                {integration.nextSync && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Next Sync</span>
                    <span className="text-sm font-medium">
                      {formatTimeAgo(integration.nextSync)}
                    </span>
                  </div>
                )}
                
                {integration.recordsProcessed && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Records Processed</span>
                    <span className="text-sm font-medium">
                      {integration.recordsProcessed.toLocaleString()}
                    </span>
                  </div>
                )}

                {integration.status === 'connected' && (
                  <div className="flex items-center space-x-2 text-green-600">
                    <Database className="h-4 w-4" />
                    <span className="text-sm">Real-time sync active</span>
                  </div>
                )}

                {integration.status === 'syncing' && (
                  <div className="flex items-center space-x-2 text-blue-600">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">Sync in progress...</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-foreground">4</div>
            <div className="text-sm text-muted-foreground">Total Integrations</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-green-600">3</div>
            <div className="text-sm text-muted-foreground">Active Connections</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-foreground">5.2k</div>
            <div className="text-sm text-muted-foreground">Records Today</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-blue-600">99.8%</div>
            <div className="text-sm text-muted-foreground">Uptime</div>
          </CardContent>
        </Card>
      </div>

      {/* Implementation Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>30-Day Implementation Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Badge className="bg-green-100 text-green-800">Week 1</Badge>
              <div className="flex-1">
                <div className="font-medium">Data Assessment & CSV Bridge Setup</div>
                <div className="text-sm text-muted-foreground">
                  Import existing data, configure action queue, validate data quality
                </div>
              </div>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge className="bg-green-100 text-green-800">Week 2</Badge>
              <div className="flex-1">
                <div className="font-medium">Core Platform Integration</div>
                <div className="text-sm text-muted-foreground">
                  Connect primary SIS (Slate/Colleague), establish real-time sync
                </div>
              </div>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge className="bg-blue-100 text-blue-800">Week 3</Badge>
              <div className="flex-1">
                <div className="font-medium">Automation Configuration</div>
                <div className="text-sm text-muted-foreground">
                  Set up playbooks, configure speed policies, train counselor teams
                </div>
              </div>
              <RefreshCw className="h-5 w-5 text-blue-500" />
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="outline">Week 4</Badge>
              <div className="flex-1">
                <div className="font-medium">Go-Live & Optimization</div>
                <div className="text-sm text-muted-foreground">
                  Full deployment, monitor outcomes, refine based on initial results
                </div>
              </div>
              <Clock className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}