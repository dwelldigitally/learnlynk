import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Plus, Mail, Users, BarChart3, Play, Pause, Trash2, MoreHorizontal, Bot, Eye, Workflow, GitBranch } from 'lucide-react';
import { NaturalLanguageCampaignBuilder } from './database/NaturalLanguageCampaignBuilder';
import { WorkflowCampaignBuilder } from './WorkflowCampaignBuilder';
import { CampaignService, type Campaign } from '@/services/campaignService';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

export function CampaignManagement() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [analytics, setAnalytics] = useState({ totalCampaigns: 0, activeCampaigns: 0, totalExecutions: 0 });
  const [loading, setLoading] = useState(true);
  const [showBuilder, setShowBuilder] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [showWorkflowBuilder, setShowWorkflowBuilder] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadCampaigns();
    loadAnalytics();
  }, []);

  const loadCampaigns = async () => {
    try {
      const data = await CampaignService.getCampaigns();
      setCampaigns(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load campaigns",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadAnalytics = async () => {
    try {
      const data = await CampaignService.getCampaignAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    }
  };

  const handleDeleteCampaign = async (id: string) => {
    try {
      await CampaignService.deleteCampaign(id);
      setCampaigns(campaigns.filter(c => c.id !== id));
      toast({
        title: "Success",
        description: "Campaign deleted successfully",
      });
      loadAnalytics();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete campaign",
        variant: "destructive",
      });
    }
  };

  const handleExecuteCampaign = async (id: string) => {
    try {
      await CampaignService.executeCampaign(id);
      toast({
        title: "Success",
        description: "Campaign execution started",
      });
      loadCampaigns();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to execute campaign",
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await CampaignService.updateCampaign(id, { status } as any);
      setCampaigns(campaigns.map(c => c.id === id ? { ...c, status } : c));
      toast({
        title: "Success",
        description: "Campaign status updated",
      });
      loadAnalytics();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update campaign status",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      draft: 'secondary',
      active: 'default',
      paused: 'outline',
      completed: 'secondary'
    } as const;
    
    return <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>{status}</Badge>;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Campaign Management</h1>
          <p className="text-muted-foreground">
            Create and manage marketing campaigns to drive lead generation
          </p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={showBuilder} onOpenChange={setShowBuilder}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Bot className="h-4 w-4 mr-2" />
                Create with AI
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>AI Campaign Builder</DialogTitle>
                <DialogDescription>
                  Use natural language to create sophisticated marketing campaigns
                </DialogDescription>
              </DialogHeader>
              <NaturalLanguageCampaignBuilder 
                onCampaignCreated={(campaign) => {
                  setCampaigns([campaign, ...campaigns]);
                  setShowBuilder(false);
                  loadAnalytics();
                  toast({
                    title: "Success",
                    description: "Campaign created successfully",
                  });
                }}
              />
            </DialogContent>
          </Dialog>
          
          <Dialog open={showWorkflowBuilder} onOpenChange={setShowWorkflowBuilder}>
            <DialogTrigger asChild>
              <Button>
                <GitBranch className="h-4 w-4 mr-2" />
                Workflow Builder
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Step-by-Step Workflow Builder</DialogTitle>
                <DialogDescription>
                  Build multi-step campaigns with precise timing, conditions, and multiple channels
                </DialogDescription>
              </DialogHeader>
              <WorkflowCampaignBuilder 
                onCampaignCreated={(campaign) => {
                  setCampaigns([campaign, ...campaigns]);
                  setShowWorkflowBuilder(false);
                  loadAnalytics();
                  toast({
                    title: "Success",
                    description: "Workflow campaign created successfully",
                  });
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalCampaigns}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.activeCampaigns}</div>
            <p className="text-xs text-muted-foreground">Currently running</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Executions</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalExecutions}</div>
            <p className="text-xs text-muted-foreground">All campaigns</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Performance</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground">Success rate</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="campaigns" className="space-y-4">
        <TabsList>
          <TabsTrigger value="campaigns">All Campaigns</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="drafts">Drafts</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Campaign List</CardTitle>
              <CardDescription>
                Manage all your marketing campaigns
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">Loading campaigns...</div>
              ) : campaigns.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No campaigns found</p>
                  <div className="flex space-x-2 mt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowBuilder(true)}
                    >
                      <Bot className="h-4 w-4 mr-2" />
                      Create with AI
                    </Button>
                    <Button 
                      onClick={() => setShowWorkflowBuilder(true)}
                    >
                      <GitBranch className="h-4 w-4 mr-2" />
                      Workflow Builder
                    </Button>
                  </div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {campaigns.map((campaign) => (
                      <TableRow key={campaign.id}>
                        <TableCell className="font-medium">{campaign.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            {campaign.campaign_type === 'workflow' && (
                              <Workflow className="h-3 w-3 text-blue-500" />
                            )}
                            <span className="capitalize">{campaign.campaign_type}</span>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                        <TableCell>{format(new Date(campaign.created_at), 'MMM dd, yyyy')}</TableCell>
                        <TableCell>
                          {campaign.start_date ? format(new Date(campaign.start_date), 'MMM dd, yyyy') : 'Not set'}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setSelectedCampaign(campaign)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              {campaign.status === 'draft' && (
                                <DropdownMenuItem onClick={() => handleStatusChange(campaign.id, 'active')}>
                                  <Play className="mr-2 h-4 w-4" />
                                  Activate
                                </DropdownMenuItem>
                              )}
                              {campaign.status === 'active' && (
                                <DropdownMenuItem onClick={() => handleStatusChange(campaign.id, 'paused')}>
                                  <Pause className="mr-2 h-4 w-4" />
                                  Pause
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem 
                                onClick={() => handleExecuteCampaign(campaign.id)}
                                disabled={campaign.status !== 'active'}
                              >
                                <Play className="mr-2 h-4 w-4" />
                                Execute Now
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDeleteCampaign(campaign.id)}
                                className="text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle>Active Campaigns</CardTitle>
              <CardDescription>Currently running campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                {campaigns.filter(c => c.status === 'active').length} active campaigns
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="drafts">
          <Card>
            <CardHeader>
              <CardTitle>Draft Campaigns</CardTitle>
              <CardDescription>Campaigns ready to be activated</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                {campaigns.filter(c => c.status === 'draft').length} draft campaigns
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Analytics</CardTitle>
              <CardDescription>Performance metrics and insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Detailed analytics coming soon
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Campaign Detail Modal */}
      {selectedCampaign && (
        <Dialog open={!!selectedCampaign} onOpenChange={() => setSelectedCampaign(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedCampaign.name}</DialogTitle>
              <DialogDescription>
                Campaign details and configuration
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">Description</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedCampaign.description || 'No description provided'}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium">Type</h4>
                  <p className="text-sm text-muted-foreground capitalize">
                    {selectedCampaign.campaign_type}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium">Status</h4>
                  {getStatusBadge(selectedCampaign.status)}
                </div>
              </div>
              <div>
                <h4 className="font-medium">Target Audience</h4>
                <pre className="text-xs bg-muted p-2 rounded">
                  {JSON.stringify(selectedCampaign.target_audience, null, 2)}
                </pre>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}