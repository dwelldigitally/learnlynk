import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const systemPrompt = `You are a search assistant for an educational CRM system. Your job is to parse natural language search queries and extract structured search parameters.

Available entities and their searchable fields:

LEADS:
- first_name, last_name, email, phone (text search)
- status: new, contacted, qualified, unqualified, converted, lost
- priority: hot, warm, cold
- source: website, referral, event, social_media, advertisement, webform, forms
- country, state, city (location)
- program_interest (program name)
- created_at, last_contacted_at (dates)
- assigned_to (advisor assignment)

STUDENTS:
- first_name, last_name, email (text search)
- program (program name)
- stage: enrolled, active, graduated, withdrawn
- risk_level: low, medium, high

PROGRAMS:
- name, type, description (text search)
- enrollment_status: open, closed, waitlist

DOCUMENTS:
- name, type, category (text search)

Parse the user's query and return a JSON object with:
1. entity_types: array of entities to search (leads, students, programs, documents)
2. text_search: any name/text to search for
3. filters: structured filters object
4. date_filter: any date-based filtering
5. intent: brief description of what user wants
6. explanation: human-readable explanation of the search

Examples:
- "hot leads" → {entity_types: ["leads"], filters: {priority: "hot"}, intent: "find_priority_leads", explanation: "Searching for high priority (hot) leads"}
- "John from California" → {entity_types: ["leads", "students"], text_search: "John", filters: {state: "California"}, intent: "find_person_by_location", explanation: "Searching for anyone named John in California"}
- "students at risk" → {entity_types: ["students"], filters: {risk_level: "high"}, intent: "find_at_risk", explanation: "Finding students with high risk level"}
- "leads from last week" → {entity_types: ["leads"], date_filter: {field: "created_at", range: "last_7_days"}, intent: "recent_leads", explanation: "Finding leads created in the last 7 days"}
- "uncontacted leads" → {entity_types: ["leads"], filters: {status: "new"}, intent: "find_uncontacted", explanation: "Finding new leads that haven't been contacted yet"}
- "nursing program applicants" → {entity_types: ["leads"], filters: {program_interest: "nursing"}, intent: "program_interest", explanation: "Finding leads interested in nursing programs"}

Always return valid JSON. If the query is ambiguous, search across all relevant entities.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();

    if (!query || query.length < 2) {
      return new Response(JSON.stringify({ 
        error: 'Query too short',
        results: [],
        explanation: 'Please enter at least 2 characters'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Processing semantic search:', query);

    // Step 1: Use AI to parse the query
    const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Parse this search query: "${query}"` }
        ],
        temperature: 0.1,
        response_format: { type: "json_object" }
      }),
    });

    const aiData = await aiResponse.json();
    const parsedQuery = JSON.parse(aiData.choices[0].message.content);
    
    console.log('AI parsed query:', parsedQuery);

    // Step 2: Execute database searches based on parsed query
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const results: any = {
      leads: [],
      students: [],
      programs: [],
      documents: []
    };

    const entityTypes = parsedQuery.entity_types || ['leads', 'students', 'programs', 'documents'];
    const textSearch = parsedQuery.text_search ? `%${parsedQuery.text_search}%` : null;
    const filters = parsedQuery.filters || {};
    const dateFilter = parsedQuery.date_filter;

    // Search Leads
    if (entityTypes.includes('leads')) {
      let leadQuery = supabase
        .from('leads')
        .select('id, first_name, last_name, email, phone, status, priority, program_interest, created_at')
        .limit(10);

      if (textSearch) {
        leadQuery = leadQuery.or(`first_name.ilike.${textSearch},last_name.ilike.${textSearch},email.ilike.${textSearch}`);
      }
      if (filters.status) leadQuery = leadQuery.eq('status', filters.status);
      if (filters.priority) leadQuery = leadQuery.eq('priority', filters.priority);
      if (filters.state) leadQuery = leadQuery.ilike('state', `%${filters.state}%`);
      if (filters.city) leadQuery = leadQuery.ilike('city', `%${filters.city}%`);
      if (filters.country) leadQuery = leadQuery.ilike('country', `%${filters.country}%`);
      if (filters.program_interest) leadQuery = leadQuery.ilike('program_interest', `%${filters.program_interest}%`);
      if (filters.source) leadQuery = leadQuery.eq('source', filters.source);
      
      if (dateFilter?.range === 'last_7_days') {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        leadQuery = leadQuery.gte('created_at', sevenDaysAgo.toISOString());
      } else if (dateFilter?.range === 'last_30_days') {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        leadQuery = leadQuery.gte('created_at', thirtyDaysAgo.toISOString());
      }

      const { data: leads, error: leadsError } = await leadQuery;
      if (leadsError) console.error('Leads search error:', leadsError);
      
      results.leads = (leads || []).map(lead => ({
        id: lead.id,
        type: 'lead',
        title: `${lead.first_name || ''} ${lead.last_name || ''}`.trim() || 'Unknown',
        subtitle: lead.email || lead.phone || undefined,
        link: `/admin/leads/${lead.id}`,
        metadata: { status: lead.status, priority: lead.priority, program: lead.program_interest }
      }));
    }

    // Search Students
    if (entityTypes.includes('students')) {
      let studentQuery = supabase
        .from('students')
        .select('id, first_name, last_name, email, program, stage, risk_level')
        .limit(10);

      if (textSearch) {
        studentQuery = studentQuery.or(`first_name.ilike.${textSearch},last_name.ilike.${textSearch},email.ilike.${textSearch}`);
      }
      if (filters.risk_level) studentQuery = studentQuery.eq('risk_level', filters.risk_level);
      if (filters.stage) studentQuery = studentQuery.eq('stage', filters.stage);
      if (filters.program) studentQuery = studentQuery.ilike('program', `%${filters.program}%`);

      const { data: students, error: studentsError } = await studentQuery;
      if (studentsError) console.error('Students search error:', studentsError);
      
      results.students = (students || []).map(student => ({
        id: student.id,
        type: 'student',
        title: `${student.first_name || ''} ${student.last_name || ''}`.trim() || 'Unknown',
        subtitle: student.program || student.email || undefined,
        link: `/admin/students/${student.id}`,
        metadata: { status: student.stage, program: student.program, risk: student.risk_level }
      }));
    }

    // Search Programs
    if (entityTypes.includes('programs')) {
      let programQuery = supabase
        .from('programs')
        .select('id, name, type, description, enrollment_status')
        .limit(10);

      if (textSearch) {
        programQuery = programQuery.or(`name.ilike.${textSearch},type.ilike.${textSearch},description.ilike.${textSearch}`);
      }
      if (filters.enrollment_status) programQuery = programQuery.eq('enrollment_status', filters.enrollment_status);

      const { data: programs, error: programsError } = await programQuery;
      if (programsError) console.error('Programs search error:', programsError);
      
      results.programs = (programs || []).map(program => ({
        id: program.id,
        type: 'program',
        title: program.name || 'Unnamed Program',
        subtitle: program.type || undefined,
        link: `/admin/programs/${program.id}`,
        metadata: { type: program.type, status: program.enrollment_status }
      }));
    }

    // Search Documents
    if (entityTypes.includes('documents')) {
      let docQuery = supabase
        .from('document_templates')
        .select('id, name, type, category, stage')
        .limit(10);

      if (textSearch) {
        docQuery = docQuery.or(`name.ilike.${textSearch},type.ilike.${textSearch},category.ilike.${textSearch}`);
      }

      const { data: docs, error: docsError } = await docQuery;
      if (docsError) console.error('Documents search error:', docsError);
      
      results.documents = (docs || []).map(doc => ({
        id: doc.id,
        type: 'document',
        title: doc.name || 'Unnamed Document',
        subtitle: doc.category || doc.type || undefined,
        link: `/admin/documents/${doc.id}`,
        metadata: { type: doc.type, category: doc.category, stage: doc.stage }
      }));
    }

    const allResults = [
      ...results.leads,
      ...results.students,
      ...results.programs,
      ...results.documents
    ];

    return new Response(JSON.stringify({
      results: allResults,
      categories: results,
      totalCount: allResults.length,
      explanation: parsedQuery.explanation || 'Search completed',
      intent: parsedQuery.intent,
      parsedFilters: filters,
      isSemanticSearch: true
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Semantic search error:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      results: [],
      categories: { leads: [], students: [], programs: [], documents: [] },
      totalCount: 0,
      explanation: 'Search failed - falling back to basic search'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
