import { useState, useEffect } from 'react';
import { FormConfig, FormData, FormErrors } from '@/types/formBuilder';
import { FieldRenderer } from '@/components/admin/formBuilder/FieldRenderer';
import { FormValidation } from '@/components/admin/formBuilder/FormValidation';
import { FormService } from '@/services/formService';
import { LeadService, CreateLeadData } from '@/services/leadService';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface DynamicFormRendererProps {
  formConfig: FormConfig;
  onSuccess?: (data: { leadId: string; submissionId: string }) => void;
  className?: string;
}

export function DynamicFormRenderer({ formConfig, onSuccess, className }: DynamicFormRendererProps) {
  const [formData, setFormData] = useState<FormData>({});
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [visibleFields, setVisibleFields] = useState<Set<string>>(new Set());

  // Initialize form data with default values
  useEffect(() => {
    const initialData: FormData = {};
    formConfig.fields.forEach(field => {
      if (field.enabled !== false) {
        initialData[field.id] = '';
      }
    });
    setFormData(initialData);
    
    // Initially all enabled fields are visible
    const enabledFields = formConfig.fields
      .filter(f => f.enabled !== false)
      .map(f => f.id);
    setVisibleFields(new Set(enabledFields));
  }, [formConfig]);

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    
    // Clear error for this field
    if (errors[fieldId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors = FormValidation.validateForm(
      formConfig.fields,
      formData,
      visibleFields
    );
    
    if (FormValidation.hasErrors(validationErrors)) {
      setErrors(validationErrors);
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Create lead from form data
      const leadData: CreateLeadData = {
        first_name: formData['first_name'] || formData['firstName'] || '',
        last_name: formData['last_name'] || formData['lastName'] || '',
        email: formData['email'] || '',
        phone: formData['phone'] || undefined,
        country: formData['country'] || undefined,
        state: formData['state'] || undefined,
        city: formData['city'] || undefined,
        source: 'webform',
        source_details: formConfig.title,
        program_interest: formData['program_interest'] || formData['programs'] || [],
        preferred_intake_id: formData['preferred_intake_id'] || undefined,
        notes: formData['notes'] || formData['message'] || undefined,
      };

      const { data: lead, error: leadError } = await LeadService.createLead(leadData);
      
      if (leadError?.code === 'DUPLICATE_LEAD' && leadError.existingLeadId) {
        // Handle re-enquiry - update existing lead and save form submission
        try {
          await LeadService.handleReenquiry(
            leadError.existingLeadId,
            formData,
            formConfig.id!,
            formConfig.title
          );
          
          setIsSubmitted(true);
          toast.success('Thank you! We have received your updated information.');
          
          if (onSuccess) {
            onSuccess({ leadId: leadError.existingLeadId, submissionId: 'reenquiry' });
          }
        } catch (reenquiryError) {
          console.error('Re-enquiry handling failed:', reenquiryError);
          toast.error('There was an issue processing your submission. Please try again.');
        }
        return;
      }
      
      if (leadError || !lead) {
        throw new Error(leadError?.message || 'Failed to create lead');
      }

      // Save form submission
      const submissionData = {
        ...formData,
        lead_id: lead.id,
        form_title: formConfig.title,
      };

      const submission = await FormService.createFormSubmission(
        formConfig.id!,
        submissionData
      );

      setIsSubmitted(true);
      toast.success(formConfig.successMessage || 'Form submitted successfully!');
      
      if (onSuccess) {
        onSuccess({ leadId: lead.id, submissionId: submission.id });
      }
    } catch (error: any) {
      console.error('Form submission error:', error);
      toast.error(formConfig.errorMessage || 'Failed to submit form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card className="p-8 text-center">
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold mb-2">
          {formConfig.successMessage || 'Thank you for your submission!'}
        </h3>
        <p className="text-muted-foreground">
          We'll be in touch with you soon.
        </p>
      </Card>
    );
  }

  // Render grid layout
  const renderGridLayout = () => {
    if (!formConfig.rows || formConfig.rows.length === 0) {
      return renderListLayout();
    }

    return (
      <div className="space-y-6">
        {formConfig.rows.map((row) => (
          <div 
            key={row.id} 
            className={`grid gap-4 ${
              row.columns === 1 ? 'grid-cols-1' :
              row.columns === 2 ? 'grid-cols-1 md:grid-cols-2' :
              row.columns === 3 ? 'grid-cols-1 md:grid-cols-3' :
              'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
            }`}
          >
            {row.fields.map((field, index) => 
              field && field.enabled !== false && visibleFields.has(field.id) ? (
                <div key={field.id}>
                  <FieldRenderer
                    field={field}
                    value={formData[field.id]}
                    onChange={(value) => handleFieldChange(field.id, value)}
                    error={errors[field.id]}
                    formData={formData}
                  />
                </div>
              ) : null
            )}
          </div>
        ))}
      </div>
    );
  };

  // Render list layout
  const renderListLayout = () => {
    return (
      <div className="space-y-6">
        {formConfig.fields
          .filter(field => field.enabled !== false && visibleFields.has(field.id))
          .map(field => (
            <FieldRenderer
              key={field.id}
              field={field}
              value={formData[field.id]}
              onChange={(value) => handleFieldChange(field.id, value)}
              error={errors[field.id]}
              formData={formData}
            />
          ))}
      </div>
    );
  };

  return (
    <Card className={`p-6 ${className}`}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">{formConfig.title}</h2>
        {formConfig.description && (
          <p className="text-muted-foreground">{formConfig.description}</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {formConfig.layoutMode === 'grid' ? renderGridLayout() : renderListLayout()}

        {formConfig.privacyText && (
          <p className="text-xs text-muted-foreground">
            {formConfig.privacyText}
          </p>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full"
          size="lg"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            formConfig.submitButtonText || 'Submit'
          )}
        </Button>
      </form>
    </Card>
  );
}
