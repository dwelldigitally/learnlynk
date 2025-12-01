import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface DocumentTemplate {
  id: string;
  name: string;
  type: string;
  category: string;
  description?: string;
  instructions?: string;
  mandatory: boolean;
  accepted_formats: string[];
  max_size: number;
  stage: string;
  usage_count?: number;
  is_system_template?: boolean;
  applicable_programs?: string[];
  examples?: string[];
  created_at: string;
  updated_at: string;
}

interface UseDocumentTemplatesOptions {
  category?: string;
  type?: string;
  stage?: string;
  programId?: string;
  mandatoryOnly?: boolean;
}

interface UseDocumentTemplatesResult {
  templates: DocumentTemplate[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch document templates from the database
 */
export function useDocumentTemplates(options: UseDocumentTemplatesOptions = {}): UseDocumentTemplatesResult {
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTemplates = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      let query = supabase
        .from('document_templates')
        .select('*')
        .order('stage', { ascending: true })
        .order('name', { ascending: true });

      // Apply filters
      if (options.category) {
        query = query.eq('category', options.category);
      }
      if (options.type) {
        query = query.eq('type', options.type);
      }
      if (options.stage) {
        query = query.eq('stage', options.stage);
      }
      if (options.mandatoryOnly) {
        query = query.eq('mandatory', true);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        throw fetchError;
      }

      // Filter by program if specified
      let filteredData = data || [];
      if (options.programId && filteredData.length > 0) {
        filteredData = filteredData.filter(template => {
          if (!template.applicable_programs || template.applicable_programs.length === 0) {
            return true; // Template applies to all programs
          }
          return template.applicable_programs.includes(options.programId!);
        });
      }

      setTemplates(filteredData);
    } catch (err) {
      console.error('Error fetching document templates:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch document templates');
      setTemplates([]);
    } finally {
      setIsLoading(false);
    }
  }, [options.category, options.type, options.stage, options.programId, options.mandatoryOnly]);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  return {
    templates,
    isLoading,
    error,
    refetch: fetchTemplates
  };
}

/**
 * Hook to fetch document templates for a specific program from program.document_requirements
 */
export function useProgramDocumentRequirements(programName: string): UseDocumentTemplatesResult {
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRequirements = useCallback(async () => {
    if (!programName) {
      setTemplates([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // First, try to get requirements from program's document_requirements field
      const { data: programs, error: programError } = await supabase
        .from('master_programs')
        .select('document_requirements')
        .or(`name.eq.${programName},code.eq.${programName}`)
        .limit(1);

      if (programError) {
        throw programError;
      }

      const program = programs?.[0];
      const programRequirements = program?.document_requirements as any[] || [];

      if (programRequirements.length > 0) {
        // Map program requirements to DocumentTemplate format
        const mappedTemplates: DocumentTemplate[] = programRequirements.map((req: any, index: number) => ({
          id: req.id || `req-${index}`,
          name: req.name || req.title || 'Unknown Document',
          type: req.type || 'document',
          category: req.category || 'general',
          description: req.description || '',
          instructions: req.instructions || '',
          mandatory: req.mandatory ?? req.required ?? false,
          accepted_formats: req.accepted_formats || req.acceptedFormats || ['pdf', 'jpg', 'png'],
          max_size: req.max_size || req.maxSize || 10485760,
          stage: req.stage || 'application',
          usage_count: 0,
          is_system_template: false,
          applicable_programs: [programName],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }));

        setTemplates(mappedTemplates);
      } else {
        // Fallback: Get templates from document_templates table filtered by program
        const { data: templateData, error: templateError } = await supabase
          .from('document_templates')
          .select('*')
          .order('stage', { ascending: true })
          .order('name', { ascending: true });

        if (templateError) {
          throw templateError;
        }

        // Filter templates that apply to this program or have no program restriction
        const filteredTemplates = (templateData || []).filter(template => {
          if (!template.applicable_programs || template.applicable_programs.length === 0) {
            return true;
          }
          return template.applicable_programs.includes(programName);
        });

        setTemplates(filteredTemplates);
      }
    } catch (err) {
      console.error('Error fetching program document requirements:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch requirements');
      setTemplates([]);
    } finally {
      setIsLoading(false);
    }
  }, [programName]);

  useEffect(() => {
    fetchRequirements();
  }, [fetchRequirements]);

  return {
    templates,
    isLoading,
    error,
    refetch: fetchRequirements
  };
}

/**
 * Hook to get unique document types from templates
 */
export function useDocumentTypes() {
  const [types, setTypes] = useState<{ value: string; label: string; count: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTypes() {
      try {
        setIsLoading(true);
        const { data, error: fetchError } = await supabase
          .from('document_templates')
          .select('type');

        if (fetchError) throw fetchError;

        // Count unique types
        const typeCounts = (data || []).reduce((acc: Record<string, number>, item) => {
          acc[item.type] = (acc[item.type] || 0) + 1;
          return acc;
        }, {});

        const typeList = Object.entries(typeCounts).map(([value, count]) => ({
          value,
          label: value.charAt(0).toUpperCase() + value.slice(1).replace(/_/g, ' '),
          count
        }));

        setTypes(typeList.sort((a, b) => a.label.localeCompare(b.label)));
      } catch (err) {
        console.error('Error fetching document types:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch types');
      } finally {
        setIsLoading(false);
      }
    }

    fetchTypes();
  }, []);

  return { types, isLoading, error };
}
