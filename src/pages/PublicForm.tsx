import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DynamicFormRenderer } from '@/components/forms/DynamicFormRenderer';
import { Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function PublicForm() {
  const { formId } = useParams<{ formId: string }>();
  const navigate = useNavigate();

  const { data: form, isLoading, error } = useQuery({
    queryKey: ['public-form', formId],
    queryFn: async () => {
      if (!formId) return null;
      
      const { data, error } = await supabase
        .from('forms')
        .select('*')
        .eq('id', formId)
        .eq('status', 'published')
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!formId,
  });

  const handleSuccess = (data: { leadId: string; submissionId: string }) => {
    console.log('Form submitted:', data);
    // Could redirect to a thank you page or stay on success message
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center p-4">
        <Card className="p-8 text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading form...</p>
        </Card>
      </div>
    );
  }

  if (error || !form) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-md">
          <h1 className="text-2xl font-bold mb-2">Form Not Found</h1>
          <p className="text-muted-foreground mb-4">
            This form is no longer available or does not exist.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <DynamicFormRenderer
          formConfig={form.config as any}
          onSuccess={handleSuccess}
        />
      </div>
    </div>
  );
}
