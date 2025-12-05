import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface SearchEntity {
  id: string;
  name: string;
  type: 'lead' | 'applicant' | 'student';
  email?: string;
  program?: string;
}

export function useEntitySearch() {
  const [results, setResults] = useState<SearchEntity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (query: string) => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('Not authenticated');
        return;
      }

      const searchTerm = `%${query.toLowerCase()}%`;
      const entities: SearchEntity[] = [];

      // Search leads - use separate queries for better compatibility
      const { data: leads } = await supabase
        .from('leads')
        .select('id, first_name, last_name, email, program_interest')
        .eq('user_id', user.id)
        .limit(50);

      // Filter client-side for more flexible search
      if (leads) {
        const lowerQuery = query.toLowerCase();
        leads
          .filter(lead => 
            (lead.first_name?.toLowerCase().includes(lowerQuery)) ||
            (lead.last_name?.toLowerCase().includes(lowerQuery)) ||
            (lead.email?.toLowerCase().includes(lowerQuery))
          )
          .slice(0, 10)
          .forEach(lead => {
            entities.push({
              id: lead.id,
              name: `${lead.first_name || ''} ${lead.last_name || ''}`.trim() || 'Unknown',
              type: 'lead',
              email: lead.email || undefined,
              program: Array.isArray(lead.program_interest) ? lead.program_interest[0] : (lead.program_interest || undefined)
            });
          });
      }

      // Search applicants via master_records
      const { data: applicants } = await supabase
        .from('applicants')
        .select(`
          id,
          program,
          master_record:master_records(first_name, last_name, email)
        `)
        .eq('user_id', user.id)
        .limit(10);

      if (applicants) {
        applicants.forEach((applicant: any) => {
          const record = applicant.master_record;
          if (record) {
            const name = `${record.first_name || ''} ${record.last_name || ''}`.trim();
            if (name.toLowerCase().includes(query.toLowerCase()) || 
                (record.email && record.email.toLowerCase().includes(query.toLowerCase()))) {
              entities.push({
                id: applicant.id,
                name: name || 'Unknown',
                type: 'applicant',
                email: record.email || undefined,
                program: applicant.program || undefined
              });
            }
          }
        });
      }

      setResults(entities);
    } catch (err) {
      console.error('Entity search error:', err);
      setError('Search failed');
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
  }, []);

  return { results, loading, error, search, clearResults };
}
