import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface FormSelectorProps {
  selectedForms: string[];
  onChange: (forms: string[]) => void;
}

interface Form {
  id: string;
  name: string;
  status: string;
}

export function FormSelector({ selectedForms, onChange }: FormSelectorProps) {
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const { data, error } = await supabase
        .from('forms')
        .select('id, name, status')
        .eq('status', 'published')
        .order('name');

      if (error) throw error;
      setForms(data || []);
    } catch (error) {
      console.error('Error fetching forms:', error);
    } finally {
      setLoading(false);
    }
  };

  const addForm = (formId: string) => {
    if (!selectedForms.includes(formId)) {
      onChange([...selectedForms, formId]);
    }
  };

  const removeForm = (formId: string) => {
    onChange(selectedForms.filter(id => id !== formId));
  };

  const getFormName = (formId: string) => {
    return forms.find(f => f.id === formId)?.name || formId;
  };

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {selectedForms.map((formId) => (
        <Badge key={formId} variant="secondary" className="flex items-center gap-1">
          {getFormName(formId)}
          <button
            type="button"
            onClick={() => removeForm(formId)}
            className="ml-1 hover:text-destructive"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
      
      <Select value="" onValueChange={addForm} disabled={loading}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder={loading ? "Loading..." : "Select form..."} />
        </SelectTrigger>
        <SelectContent>
          {forms.length === 0 ? (
            <div className="p-2 text-sm text-muted-foreground">No published forms</div>
          ) : (
            forms.map((form) => (
              <SelectItem 
                key={form.id} 
                value={form.id}
                disabled={selectedForms.includes(form.id)}
              >
                {form.name}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
