import React from 'react';
import { UniversalBuilder } from '@/components/universal-builder/UniversalBuilder';
import { useNavigate, useParams } from 'react-router-dom';
import { FormService } from '@/services/formService';
import { useToast } from '@/hooks/use-toast';

export function FormBuilderPage() {
  const navigate = useNavigate();
  const { formId } = useParams();
  const { toast } = useToast();

  const handleSave = async (config: any) => {
    try {
      if (formId) {
        await FormService.updateForm(formId, {
          name: config.name,
          description: config.description,
          config: config,
          status: 'published'
        });
        toast({
          title: "Success",
          description: "Form updated successfully",
        });
      } else {
        await FormService.createForm({
          name: config.name,
          description: config.description,
          config: config,
          status: 'published'
        });
        toast({
          title: "Success",
          description: "Form created successfully",
        });
      }
      navigate('/admin/builder');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save form",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    navigate('/admin/builder');
  };

  return (
    <UniversalBuilder
      builderType="form"
      onSave={handleSave}
      onCancel={handleCancel}
    />
  );
}