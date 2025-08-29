import React from 'react';
import { UniversalBuilder } from '@/components/universal-builder/UniversalBuilder';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { FormService } from '@/services/formService';
import { useToast } from '@/hooks/use-toast';
import EmbedCodeGenerator from '@/components/embed/EmbedCodeGenerator';

export function FormBuilderPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { formId } = useParams();
  const { toast } = useToast();
  
  // Check if we're in embed mode
  const isEmbedMode = location.pathname.includes('/embed') || location.search.includes('embed=true');

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

  // If we're in embed mode, show the embed code generator
  if (isEmbedMode) {
    return (
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Embeddable Document Form</h1>
          <p className="text-muted-foreground mt-2">
            Generate embed codes for your document submission form
          </p>
        </div>
        <EmbedCodeGenerator />
      </div>
    );
  }

  return (
    <UniversalBuilder
      builderType="form"
      onSave={handleSave}
      onCancel={handleCancel}
    />
  );
}