import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { 
  Plus, Search, Zap, Play, BarChart3,
  RefreshCw, TrendingUp, Users
} from 'lucide-react';
import { PageHeader } from '@/components/modern/PageHeader';
import { HotSheetCard } from '@/components/hotsheet/HotSheetCard';
import { IconContainer } from '@/components/hotsheet/IconContainer';
import { AutomationCard } from './automation/AutomationCard';
import { AutomationAnalyticsModal } from './automation/AutomationAnalyticsModal';
import { AutomationReEnrollModal } from './automation/AutomationReEnrollModal';
import { AutomationService, type Automation } from '@/services/automationService';
import { useToast } from '@/hooks/use-toast';

type FilterTab = 'all' | 'active' | 'paused' | 'draft';

export function AutomationHub() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [stats, setStats] = useState({
    totalAutomations: 0,
    activeAutomations: 0,
    totalEnrollments: 0,
    avgCompletionRate: 0
  });

  // Modals
  const [analyticsAutomation, setAnalyticsAutomation] = useState<Automation | null>(null);
  const [reEnrollAutomation, setReEnrollAutomation] = useState<Automation | null>(null);
  const [deleteAutomation, setDeleteAutomation] = useState<Automation | null>(null);
  const [executing, setExecuting] = useState<string | null>(null);

  useEffect(() => {
    loadAutomations();
  }, []);

  const loadAutomations = async () => {
    setLoading(true);
    try {
      const [data, statsData] = await Promise.all([
        AutomationService.getAutomations(),
        AutomationService.getSummaryStats()
      ]);
      setAutomations(data);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading automations:', error);
      toast({
        title: "Error",
        description: "Failed to load automations",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (automation: Automation) => {
    try {
      await AutomationService.toggleAutomation(automation.id, automation.type, !automation.is_active);
      setAutomations(prev => prev.map(a => 
        a.id === automation.id ? { ...a, is_active: !a.is_active } : a
      ));
      toast({
        title: "Success",
        description: `${automation.name} ${automation.is_active ? 'paused' : 'activated'}`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update automation",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (automation: Automation) => {
    navigate(`/admin/workflows/builder/${automation.id}`);
  };

  const handleDelete = async () => {
    if (!deleteAutomation) return;
    try {
      await AutomationService.deleteAutomation(deleteAutomation.id, deleteAutomation.type);
      setAutomations(prev => prev.filter(a => a.id !== deleteAutomation.id));
      toast({
        title: "Success",
        description: `${deleteAutomation.name} deleted`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete automation",
        variant: "destructive"
      });
    } finally {
      setDeleteAutomation(null);
    }
  };

  const handleExecute = async (automation: Automation) => {
    setExecuting(automation.id);
    try {
      await AutomationService.executeAutomation(automation.id, automation.type);
      toast({
        title: "Execution Started",
        description: `${automation.name} is now running`
      });
      loadAutomations();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to execute automation",
        variant: "destructive"
      });
    } finally {
      setExecuting(null);
    }
  };

  // Filter automations
  const filteredAutomations = automations.filter(a => {
    const matchesSearch = searchTerm === '' || 
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.description?.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesTab = true;
    switch (activeTab) {
      case 'active':
        matchesTab = a.is_active;
        break;
      case 'paused':
        matchesTab = !a.is_active && a.status !== 'draft';
        break;
      case 'draft':
        matchesTab = a.status === 'draft';
        break;
    }

    return matchesSearch && matchesTab;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8 max-w-7xl">
        <PageHeader 
          title="Workflow Management"
          subtitle="Create and manage automated workflows for lead engagement"
          action={
            <Button size="lg" onClick={() => navigate('/admin/workflows/builder')}>
              <Plus className="h-4 w-4 mr-2" />
              Create Workflow
            </Button>
          }
        />

        {/* Stats Cards */}
        <div className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-4 mb-6 sm:mb-8">
          <HotSheetCard hover radius="2xl" padding="lg">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Total Workflows</p>
                <h3 className="text-3xl font-bold text-foreground">{stats.totalAutomations}</h3>
                <p className="text-xs text-muted-foreground mt-1">All workflows</p>
              </div>
              <IconContainer color="violet" size="lg">
                <Zap className="h-5 w-5" />
              </IconContainer>
            </div>
          </HotSheetCard>

          <HotSheetCard hover radius="2xl" padding="lg">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Active Now</p>
                <h3 className="text-3xl font-bold text-foreground">{stats.activeAutomations}</h3>
                <p className="text-xs text-muted-foreground mt-1">Currently running</p>
              </div>
              <IconContainer color="emerald" size="lg">
                <Play className="h-5 w-5" />
              </IconContainer>
            </div>
          </HotSheetCard>

          <HotSheetCard hover radius="2xl" padding="lg">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Total Enrollments</p>
                <h3 className="text-3xl font-bold text-foreground">{stats.totalEnrollments}</h3>
                <p className="text-xs text-muted-foreground mt-1">Leads processed</p>
              </div>
              <IconContainer color="sky" size="lg">
                <Users className="h-5 w-5" />
              </IconContainer>
            </div>
          </HotSheetCard>

          <HotSheetCard hover radius="2xl" padding="lg">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Avg. Completion</p>
                <h3 className="text-3xl font-bold text-foreground">{stats.avgCompletionRate}%</h3>
                <p className="text-xs text-muted-foreground mt-1">Success rate</p>
              </div>
              <IconContainer color="amber" size="lg">
                <TrendingUp className="h-5 w-5" />
              </IconContainer>
            </div>
          </HotSheetCard>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search automations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" onClick={loadAutomations}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as FilterTab)} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="paused">Paused</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            {loading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <HotSheetCard key={i} padding="lg" radius="xl">
                    <div className="animate-pulse">
                      <div className="flex gap-3 mb-4">
                        <div className="w-10 h-10 bg-muted rounded-lg" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-muted rounded w-3/4" />
                          <div className="h-3 bg-muted rounded w-1/2" />
                        </div>
                      </div>
                      <div className="h-16 bg-muted rounded" />
                    </div>
                  </HotSheetCard>
                ))}
              </div>
            ) : filteredAutomations.length === 0 ? (
              <div className="text-center py-16 bg-muted/30 rounded-lg border-2 border-dashed border-border">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No workflows found</h3>
                <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                  {searchTerm 
                    ? "Try adjusting your search or filters"
                    : "Create your first workflow to automate lead engagement"
                  }
                </p>
                <div className="flex gap-2 justify-center">
                  <Button onClick={() => navigate('/admin/workflows/builder')}>
                    <Zap className="h-4 w-4 mr-2" />
                    Create Workflow
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredAutomations.map((automation) => (
                  <AutomationCard
                    key={automation.id}
                    automation={automation}
                    onToggle={handleToggle}
                    onEdit={handleEdit}
                    onDelete={setDeleteAutomation}
                    onAnalytics={setAnalyticsAutomation}
                    onReEnroll={setReEnrollAutomation}
                    onExecute={handleExecute}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Analytics Modal */}
      <AutomationAnalyticsModal
        automation={analyticsAutomation}
        open={!!analyticsAutomation}
        onClose={() => setAnalyticsAutomation(null)}
      />

      {/* Re-enroll Modal */}
      <AutomationReEnrollModal
        automation={reEnrollAutomation}
        open={!!reEnrollAutomation}
        onClose={() => setReEnrollAutomation(null)}
        onSuccess={loadAutomations}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteAutomation} onOpenChange={() => setDeleteAutomation(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleteAutomation?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the {deleteAutomation?.type} and all its enrollment history.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default AutomationHub;
