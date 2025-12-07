import React, { useState, useEffect } from 'react';
import { UniversalBuilder } from '@/components/universal-builder/UniversalBuilder';
import { useNavigate, useParams } from 'react-router-dom';
import { CampaignService } from '@/services/campaignService';
import { useToast } from '@/hooks/use-toast';
import { CampaignTemplate } from '@/config/campaignTemplates';

export function CampaignBuilderPage() {
  const navigate = useNavigate();
  const { campaignId } = useParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(!!campaignId);
  const [initialConfig, setInitialConfig] = useState<any>({
    name: '',
    description: '',
    type: 'campaign',
    elements: [],
    settings: {},
  });

  useEffect(() => {
    if (campaignId) {
      loadCampaign();
    }
  }, [campaignId]);

  const loadCampaign = async () => {
    try {
      setLoading(true);
      
      // Get campaign data
      const campaign = await CampaignService.getCampaignById(campaignId!);
      if (!campaign) {
        toast({
          title: "Error",
          description: "Campaign not found",
          variant: "destructive",
        });
        navigate('/admin/campaigns');
        return;
      }

      // Get campaign steps and convert to builder elements
      const elements = await CampaignService.getCampaignElements(campaignId!);
      
      // Use campaign_data if it has elements, otherwise use steps from database
      const campaignData = campaign.campaign_data as any;
      const configElements = elements.length > 0 
        ? elements 
        : (campaignData?.elements || []);

      setInitialConfig({
        name: campaign.name,
        description: campaign.description || '',
        type: 'campaign',
        elements: configElements,
        settings: campaignData?.settings || {
          audience: campaign.target_audience,
        },
      });
    } catch (error) {
      console.error('Failed to load campaign:', error);
      toast({
        title: "Error",
        description: "Failed to load campaign",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTemplate = (template: CampaignTemplate) => {
    setInitialConfig({
      ...template.config,
      type: 'campaign',
    });
    toast({
      title: "Template Applied",
      description: `Using ${template.name} template`,
    });
  };

  const handleStartBlank = () => {
    setInitialConfig({
      name: '',
      description: '',
      type: 'campaign',
      elements: [],
      settings: {},
    });
  };

  const handleSave = async (config: any) => {
    try {
      if (campaignId) {
        await CampaignService.updateCampaign(campaignId, {
          name: config.name,
          description: config.description,
          campaign_data: config,
          target_audience: config.settings?.audience?.filters || null,
          status: 'active'
        });
        toast({
          title: "Success",
          description: "Campaign updated successfully",
        });
      } else {
        await CampaignService.createCampaign({
          name: config.name,
          description: config.description,
          campaign_data: config,
          target_audience: config.settings?.audience?.filters || null,
          status: 'active',
          campaign_type: 'email'
        });
        toast({
          title: "Success",
          description: "Campaign created successfully",
        });
      }
      navigate('/admin/campaigns');
    } catch (error) {
      console.error('Failed to save campaign:', error);
      toast({
        title: "Error",
        description: "Failed to save campaign",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    navigate('/admin/campaigns');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading campaign...</p>
        </div>
      </div>
    );
  }

  return (
    <UniversalBuilder
      builderType="campaign"
      initialConfig={initialConfig}
      onSave={handleSave}
      onCancel={handleCancel}
      onSelectTemplate={handleSelectTemplate}
      onStartBlank={handleStartBlank}
    />
  );
}
