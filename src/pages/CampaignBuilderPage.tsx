import React from 'react';
import { UniversalBuilder } from '@/components/universal-builder/UniversalBuilder';
import { useNavigate, useParams } from 'react-router-dom';
import { CampaignService } from '@/services/campaignService';
import { useToast } from '@/hooks/use-toast';

export function CampaignBuilderPage() {
  const navigate = useNavigate();
  const { campaignId } = useParams();
  const { toast } = useToast();

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
      navigate('/admin/builder');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save campaign",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    navigate('/admin/builder');
  };

  return (
    <UniversalBuilder
      builderType="campaign"
      onSave={handleSave}
      onCancel={handleCancel}
    />
  );
}