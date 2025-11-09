import React, { useState, useEffect } from 'react';
import { UniversalBuilder } from '@/components/universal-builder/UniversalBuilder';
import { useNavigate, useParams } from 'react-router-dom';
import { CampaignService } from '@/services/campaignService';
import { useToast } from '@/hooks/use-toast';
import { TemplateSelector } from '@/components/campaign-builder/TemplateSelector';
import { CampaignTemplate } from '@/config/campaignTemplates';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

export function CampaignBuilderPage() {
  const navigate = useNavigate();
  const { campaignId } = useParams();
  const { toast } = useToast();
  const [initialConfig, setInitialConfig] = useState<any>(null);
  const [showTemplateSelector, setShowTemplateSelector] = useState(!campaignId);

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
        setShowTemplateSelector(false);
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
    setShowTemplateSelector(false);
    toast({
      title: "Template Selected",
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
    setShowTemplateSelector(false);
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
    <div className="relative h-screen">
      {showTemplateSelector && !campaignId ? (
        <div className="flex items-center justify-center h-full bg-background">
          <div className="max-w-6xl w-full p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Create New Campaign</h1>
              <p className="text-muted-foreground">
                Choose a template to get started quickly or build from scratch
              </p>
            </div>
            <div className="flex justify-center gap-4">
              <TemplateSelector
                onSelectTemplate={handleSelectTemplate}
                onStartBlank={handleStartBlank}
              />
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <UniversalBuilder
          builderType="campaign"
          initialConfig={initialConfig}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}