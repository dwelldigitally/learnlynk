import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useIsMobile } from '@/hooks/use-mobile';
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Plus, Mail, BarChart3, Play, Pause, Trash2, MoreHorizontal, Bot, Eye, Workflow, GitBranch, TrendingUp, Target, Edit, AlertCircle } from 'lucide-react';
import { NaturalLanguageCampaignBuilder } from './database/NaturalLanguageCampaignBuilder';
import { CampaignService, type Campaign } from '@/services/campaignService';
import { CampaignAnalyticsService } from '@/services/campaignAnalyticsService';
import { CampaignAnalyticsModal } from './CampaignAnalyticsModal';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { PageHeader } from '@/components/modern/PageHeader';
import { HotSheetCard } from '@/components/hotsheet/HotSheetCard';
import { PastelBadge } from '@/components/hotsheet/PastelBadge';
import { PillButton } from '@/components/hotsheet/PillButton';
import { IconContainer } from '@/components/hotsheet/IconContainer';
import { getCampaignStatusColor } from '@/components/hotsheet/utils';

export function CampaignManagement() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [analytics, setAnalytics] = useState({ totalCampaigns: 0, activeCampaigns: 0, totalExecutions: 0, successRate: 0 });
  const [loading, setLoading] = useState(true);
  const [showBuilder, setShowBuilder] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [campaignToDelete, setCampaignToDelete] = useState<Campaign | null>(null);
  const [analyticsCampaign, setAnalyticsCampaign] = useState<Campaign | null>(null);
  
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
        description: `Campaign ${status === 'active' ? 'activated' : 'paused'} successfully`,
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

  const handleEditCampaign = (campaign: Campaign) => {
    navigate(`/admin/builder/campaigns/${campaign.id}`);
  };

  const confirmDeleteCampaign = (campaign: Campaign) => {
    setCampaignToDelete(campaign);
  };

  const executeDelete = async () => {
    if (!campaignToDelete) return;
    
    try {
      await CampaignService.deleteCampaign(campaignToDelete.id);
      setCampaigns(campaigns.filter(c => c.id !== campaignToDelete.id));
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
    } finally {
      setCampaignToDelete(null);
    }
  };

  const handleViewAnalytics = async (campaign: Campaign) => {
    await CampaignAnalyticsService.trackAction(campaign.id, 'viewed');
    setAnalyticsCampaign(campaign);
  };

  const getStatusBadge = (status: string) => {
    const color = getCampaignStatusColor(status);
    return <PastelBadge color={color} size="sm" dot>{status}</PastelBadge>;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8 max-w-7xl">
        <PageHeader 
          title="Campaign Management"
          subtitle="Create and manage marketing campaigns to drive lead generation"
          action={
            <div className={`flex gap-2 ${isMobile ? 'flex-col w-full' : 'flex-row'}`}>
              <Dialog open={showBuilder} onOpenChange={setShowBuilder}>
                <DialogTrigger asChild>
                  <PillButton variant="outline" size={isMobile ? "md" : "lg"} className={isMobile ? 'w-full' : ''}>
                    <Bot className="h-4 w-4 mr-2" />
                    Create with AI
                  </PillButton>
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
              
              <PillButton variant="primary" size={isMobile ? "md" : "lg"} onClick={() => navigate('/admin/builder/campaigns')} className={isMobile ? 'w-full' : ''}>
                <GitBranch className="h-4 w-4 mr-2" />
                Campaign Builder
              </PillButton>
            </div>
          }
        />

        {/* Analytics Cards */}
        <div className="grid gap-3 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-6 sm:mb-8">
          <HotSheetCard hover radius="2xl" padding="lg">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Total Campaigns</p>
                <h3 className="text-3xl font-bold text-foreground">{analytics.totalCampaigns}</h3>
                <p className="text-xs text-muted-foreground mt-1">All time</p>
              </div>
              <IconContainer color="violet" size="lg">
                <Mail className="h-5 w-5" />
              </IconContainer>
            </div>
          </HotSheetCard>

          <HotSheetCard hover radius="2xl" padding="lg">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Active Campaigns</p>
                <h3 className="text-3xl font-bold text-foreground">{analytics.activeCampaigns}</h3>
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
                <p className="text-sm font-medium text-muted-foreground mb-1">Total Executions</p>
                <h3 className="text-3xl font-bold text-foreground">{analytics.totalExecutions}</h3>
                <p className="text-xs text-muted-foreground mt-1">All campaigns</p>
              </div>
              <IconContainer color="sky" size="lg">
                <BarChart3 className="h-5 w-5" />
              </IconContainer>
            </div>
          </HotSheetCard>

          <HotSheetCard hover radius="2xl" padding="lg">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Avg. Performance</p>
                <h3 className="text-3xl font-bold text-foreground">{analytics.successRate}%</h3>
                <p className="text-xs text-muted-foreground mt-1">Success rate</p>
              </div>
              <IconContainer color="amber" size="lg">
                <TrendingUp className="h-5 w-5" />
              </IconContainer>
            </div>
          </HotSheetCard>
        </div>

        {/* Campaign List */}
        <HotSheetCard padding="none" radius="2xl">
          <CardHeader className="border-b border-border/40 p-6">
            <div className="flex items-center gap-3">
              <IconContainer color="primary" size="md">
                <Target className="h-5 w-5" />
              </IconContainer>
              <div>
                <CardTitle className="text-xl">Campaign List</CardTitle>
                <CardDescription>Manage all your marketing campaigns</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading campaigns...</p>
              </div>
            ) : campaigns.length === 0 ? (
              <div className="text-center py-16">
                <IconContainer color="violet" size="xl" className="mx-auto mb-6">
                  <Mail className="h-8 w-8" />
                </IconContainer>
                <h3 className="text-lg font-semibold mb-2">No campaigns found</h3>
                <p className="text-muted-foreground mb-6">Get started by creating your first campaign</p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <PillButton 
                    variant="outline" 
                    onClick={() => setShowBuilder(true)}
                  >
                    <Bot className="h-4 w-4 mr-2" />
                    Create with AI
                  </PillButton>
                  <PillButton 
                    variant="primary"
                    onClick={() => navigate('/admin/builder/campaigns')}
                  >
                    <GitBranch className="h-4 w-4 mr-2" />
                    Campaign Builder
                  </PillButton>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-border/40 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/10 hover:bg-muted/10">
                      <TableHead className="font-semibold py-4">Name</TableHead>
                      <TableHead className="font-semibold py-4">Type</TableHead>
                      <TableHead className="font-semibold py-4">Status</TableHead>
                      <TableHead className="font-semibold py-4">Created</TableHead>
                      <TableHead className="font-semibold py-4">Start Date</TableHead>
                      <TableHead className="text-right font-semibold py-4">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {campaigns.map((campaign) => (
                      <TableRow key={campaign.id} className="hover:bg-muted/5 transition-colors">
                        <TableCell className="font-medium py-4">{campaign.name}</TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-center gap-2">
                            {campaign.campaign_type === 'workflow' && (
                              <Workflow className="h-4 w-4 text-primary" />
                            )}
                            <span className="capitalize text-sm">{campaign.campaign_type}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">{getStatusBadge(campaign.status)}</TableCell>
                        <TableCell className="text-sm text-muted-foreground py-4">
                          {format(new Date(campaign.created_at), 'MMM dd, yyyy')}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground py-4">
                          {campaign.start_date ? format(new Date(campaign.start_date), 'MMM dd, yyyy') : 'Not set'}
                        </TableCell>
                        <TableCell className="text-right py-4">
                          <div className="flex items-center justify-end gap-1">
                            {/* Edit Button */}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditCampaign(campaign)}
                              className="h-9 w-9 p-0 rounded-full hover:bg-muted/10"
                              title="Edit campaign"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>

                            {/* Play/Pause Button */}
                            {campaign.status === 'active' ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleStatusChange(campaign.id, 'paused')}
                                className="h-9 w-9 p-0 rounded-full hover:bg-muted/10"
                                title="Pause campaign"
                              >
                                <Pause className="h-4 w-4" />
                              </Button>
                            ) : (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleStatusChange(campaign.id, 'active')}
                                className="h-9 w-9 p-0 rounded-full hover:bg-muted/10"
                                title="Activate campaign"
                              >
                                <Play className="h-4 w-4" />
                              </Button>
                            )}

                            {/* Delete Button */}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => confirmDeleteCampaign(campaign)}
                              className="h-9 w-9 p-0 rounded-full hover:bg-muted/10 hover:text-destructive"
                              title="Delete campaign"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>

                            {/* More Actions Dropdown */}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-full hover:bg-muted/10">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem onClick={() => handleViewAnalytics(campaign)}>
                                  <BarChart3 className="mr-2 h-4 w-4" />
                                  View Analytics
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setSelectedCampaign(campaign)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleExecuteCampaign(campaign.id)}
                                  disabled={campaign.status !== 'active'}
                                >
                                  <Play className="mr-2 h-4 w-4" />
                                  Execute Now
                                </DropdownMenuItem>
                                {campaign.status === 'paused' && (
                                  <DropdownMenuItem onClick={() => handleStatusChange(campaign.id, 'draft')}>
                                    <AlertCircle className="mr-2 h-4 w-4" />
                                    Move to Draft
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </HotSheetCard>

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
                  <pre className="text-xs bg-muted/20 p-3 rounded-xl border border-border/40">
                    {JSON.stringify(selectedCampaign.target_audience, null, 2)}
                  </pre>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!campaignToDelete} onOpenChange={() => setCampaignToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the campaign "{campaignToDelete?.name}". 
              This action cannot be undone and all campaign data will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={executeDelete}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              Delete Campaign
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Analytics Modal */}
      <CampaignAnalyticsModal
        campaign={analyticsCampaign}
        open={!!analyticsCampaign}
        onOpenChange={(open) => !open && setAnalyticsCampaign(null)}
      />
    </div>
  );
}
