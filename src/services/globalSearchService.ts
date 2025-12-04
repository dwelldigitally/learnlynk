import { supabase } from "@/integrations/supabase/client";

export interface GlobalSearchResult {
  id: string;
  type: 'lead' | 'student' | 'program' | 'document';
  title: string;
  subtitle?: string;
  link: string;
  metadata?: Record<string, any>;
}

export interface GlobalSearchResponse {
  results: GlobalSearchResult[];
  categories: {
    leads: GlobalSearchResult[];
    students: GlobalSearchResult[];
    programs: GlobalSearchResult[];
    documents: GlobalSearchResult[];
  };
  totalCount: number;
  // Semantic search additions
  explanation?: string;
  intent?: string;
  parsedFilters?: Record<string, any>;
  isSemanticSearch?: boolean;
}

// Smart shortcuts mapping
const SMART_SHORTCUTS: Record<string, { path: string; description: string }> = {
  'hot leads': { path: '/admin/leads?priority=hot', description: 'View hot priority leads' },
  'new leads': { path: '/admin/leads?status=new', description: 'View new leads' },
  'pending applications': { path: '/admin/applicants', description: 'View pending applications' },
  'at risk students': { path: '/admin/students?risk=high', description: 'View at-risk students' },
  'overdue tasks': { path: '/admin/tasks?status=overdue', description: 'View overdue tasks' },
};

export class GlobalSearchService {
  private static RESULTS_PER_CATEGORY = 5;

  static checkSmartShortcut(query: string): { path: string; description: string } | null {
    const normalizedQuery = query.toLowerCase().trim();
    return SMART_SHORTCUTS[normalizedQuery] || null;
  }

  // Semantic AI-powered search
  static async semanticSearch(query: string): Promise<GlobalSearchResponse> {
    if (!query || query.length < 2) {
      return {
        results: [],
        categories: { leads: [], students: [], programs: [], documents: [] },
        totalCount: 0
      };
    }

    try {
      const response = await supabase.functions.invoke('ai-semantic-search', {
        body: { query }
      });

      if (response.error) {
        console.error('Semantic search error:', response.error);
        // Fallback to basic search
        return this.search(query);
      }

      return response.data as GlobalSearchResponse;
    } catch (error) {
      console.error('Semantic search failed, falling back to basic search:', error);
      return this.search(query);
    }
  }

  // Basic keyword search (fallback)
  static async search(query: string): Promise<GlobalSearchResponse> {
    if (!query || query.length < 2) {
      return {
        results: [],
        categories: { leads: [], students: [], programs: [], documents: [] },
        totalCount: 0
      };
    }

    const searchTerm = `%${query}%`;

    // Execute all searches in parallel
    const [leadsResult, studentsResult, programsResult, documentsResult] = await Promise.all([
      this.searchLeads(searchTerm),
      this.searchStudents(searchTerm),
      this.searchPrograms(searchTerm),
      this.searchDocuments(searchTerm)
    ]);

    const categories = {
      leads: leadsResult,
      students: studentsResult,
      programs: programsResult,
      documents: documentsResult
    };

    const results = [
      ...leadsResult,
      ...studentsResult,
      ...programsResult,
      ...documentsResult
    ];

    return {
      results,
      categories,
      totalCount: results.length
    };
  }

  private static async searchLeads(searchTerm: string): Promise<GlobalSearchResult[]> {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('id, first_name, last_name, email, phone, status, priority')
        .or(`first_name.ilike.${searchTerm},last_name.ilike.${searchTerm},email.ilike.${searchTerm},phone.ilike.${searchTerm}`)
        .limit(this.RESULTS_PER_CATEGORY);

      if (error) throw error;

      return (data || []).map(lead => ({
        id: lead.id,
        type: 'lead' as const,
        title: `${lead.first_name || ''} ${lead.last_name || ''}`.trim() || 'Unknown',
        subtitle: lead.email || lead.phone || undefined,
        link: `/admin/leads/${lead.id}`,
        metadata: { status: lead.status, priority: lead.priority }
      }));
    } catch (error) {
      console.error('Error searching leads:', error);
      return [];
    }
  }

  private static async searchStudents(searchTerm: string): Promise<GlobalSearchResult[]> {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('id, first_name, last_name, email, program, stage, risk_level')
        .or(`first_name.ilike.${searchTerm},last_name.ilike.${searchTerm},email.ilike.${searchTerm},program.ilike.${searchTerm}`)
        .limit(this.RESULTS_PER_CATEGORY);

      if (error) throw error;

      return (data || []).map(student => ({
        id: student.id,
        type: 'student' as const,
        title: `${student.first_name || ''} ${student.last_name || ''}`.trim() || 'Unknown',
        subtitle: student.program || student.email || undefined,
        link: `/admin/students/${student.id}`,
        metadata: { status: student.stage, program: student.program, risk: student.risk_level }
      }));
    } catch (error) {
      console.error('Error searching students:', error);
      return [];
    }
  }

  private static async searchPrograms(searchTerm: string): Promise<GlobalSearchResult[]> {
    try {
      const { data, error } = await supabase
        .from('programs')
        .select('id, name, type, description, enrollment_status')
        .or(`name.ilike.${searchTerm},type.ilike.${searchTerm},description.ilike.${searchTerm}`)
        .limit(this.RESULTS_PER_CATEGORY);

      if (error) throw error;

      return (data || []).map(program => ({
        id: program.id,
        type: 'program' as const,
        title: program.name || 'Unnamed Program',
        subtitle: program.type || undefined,
        link: `/admin/programs/${program.id}`,
        metadata: { type: program.type, status: program.enrollment_status }
      }));
    } catch (error) {
      console.error('Error searching programs:', error);
      return [];
    }
  }

  private static async searchDocuments(searchTerm: string): Promise<GlobalSearchResult[]> {
    try {
      const { data, error } = await supabase
        .from('document_templates')
        .select('id, name, type, category, stage')
        .or(`name.ilike.${searchTerm},type.ilike.${searchTerm},category.ilike.${searchTerm}`)
        .limit(this.RESULTS_PER_CATEGORY);

      if (error) throw error;

      return (data || []).map(doc => ({
        id: doc.id,
        type: 'document' as const,
        title: doc.name || 'Unnamed Document',
        subtitle: doc.category || doc.type || undefined,
        link: `/admin/documents/${doc.id}`,
        metadata: { type: doc.type, category: doc.category, stage: doc.stage }
      }));
    } catch (error) {
      console.error('Error searching documents:', error);
      return [];
    }
  }
}
