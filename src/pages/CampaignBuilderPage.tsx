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
  const [initialConfig, setInitialConfig] = useState<any>({
    name: '',
    description: '',
    type: 'campaign',
    elements: [],
    settings: {},
  });

  useEffect(() => {
    if (campaignId) {
      // Load existing campaign if editing
      loadCampaign();
    }
  }, [campaignId]);

  const loadCampaign = async () => {
    try {
      const campaigns = await CampaignService.getCampaigns();
      const campaign = campaigns.find(c => c.id === campaignId);
      if (campaign && campaign.campaign_data) {
        setInitialConfig(campaign.campaign_data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load campaign",
        variant: "destructive",
      });
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