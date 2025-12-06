import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { leadId, action, question } = await req.json();
    
    if (!leadId) {
      return new Response(
        JSON.stringify({ error: 'Lead ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get OpenAI API key
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      console.error('OpenAI API key not found');
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch lead data
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .single();

    if (leadError || !lead) {
      console.error('Error fetching lead:', leadError);
      return new Response(
        JSON.stringify({ error: 'Lead not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch all related data in parallel
    const programName = lead.program_interest?.[0];
    
    const [
      documentsResult,
      programResult,
      journeyResult,
      communicationsResult,
      tasksResult,
      notesResult,
      activitiesResult
    ] = await Promise.all([
      // Fetch uploaded documents
      supabase
        .from('lead_documents')
        .select('id, document_name, document_type, status, admin_status, entry_requirement_id, requirement_id, created_at, original_filename')
        .eq('lead_id', leadId),
      
      // Fetch program details if lead has program interest
      programName 
        ? supabase
            .from('programs')
            .select('name, document_requirements, entry_requirements, description')
            .eq('name', programName)
            .single()
        : Promise.resolve({ data: null, error: null }),
      
      // Fetch journey instance with current stage
      supabase
        .from('student_journey_instances')
        .select(`
          id,
          status,
          current_stage_id,
          journey_id,
          created_at
        `)
        .eq('lead_id', leadId)
        .maybeSingle(),
      
      // Fetch recent communications
      supabase
        .from('lead_communications')
        .select('type, subject, content, status, direction, created_at')
        .eq('lead_id', leadId)
        .order('created_at', { ascending: false })
        .limit(10),
      
      // Fetch tasks
      supabase
        .from('lead_tasks')
        .select('title, description, status, due_date, task_type, priority')
        .eq('lead_id', leadId)
        .order('due_date', { ascending: true }),
      
      // Fetch notes
      supabase
        .from('lead_notes')
        .select('content, note_type, created_at')
        .eq('lead_id', leadId)
        .order('created_at', { ascending: false })
        .limit(5),
      
      // Fetch recent activities
      supabase
        .from('lead_activities')
        .select('activity_type, activity_description, created_at')
        .eq('lead_id', leadId)
        .order('created_at', { ascending: false })
        .limit(10)
    ]);

    const documents = documentsResult.data || [];
    const program = programResult.data;
    const journeyInstance = journeyResult.data;
    const communications = communicationsResult.data || [];
    const tasks = tasksResult.data || [];
    const notes = notesResult.data || [];
    const activities = activitiesResult.data || [];

    // Fetch journey stages if journey exists
    let journeyStages: any[] = [];
    let currentStageName = 'Not started';
    let currentStageIndex = 0;
    
    if (journeyInstance?.journey_id) {
      const { data: stages } = await supabase
        .from('journey_stages')
        .select('id, name, order_index, description')
        .eq('journey_id', journeyInstance.journey_id)
        .order('order_index', { ascending: true });
      
      journeyStages = stages || [];
      
      if (journeyInstance.current_stage_id && journeyStages.length > 0) {
        const currentStage = journeyStages.find(s => s.id === journeyInstance.current_stage_id);
        if (currentStage) {
          currentStageName = currentStage.name;
          currentStageIndex = currentStage.order_index;
        }
      }
    }

    // Parse entry requirements from program (these contain the document requirements too)
    const entryRequirements = program?.entry_requirements || [];
    
    // Build a map of requirement IDs to their titles
    const requirementMap: Record<string, { title: string; mandatory: boolean }> = {};
    entryRequirements.forEach((req: any) => {
      if (req.id) {
        requirementMap[req.id] = {
          title: req.title || req.name || 'Unknown Requirement',
          mandatory: req.mandatory !== false
        };
      }
    });

    // Map uploaded documents to their requirements
    const uploadedDocsWithRequirements = documents.map(doc => {
      const reqId = doc.entry_requirement_id || doc.requirement_id;
      const requirement = reqId ? requirementMap[reqId] : null;
      return {
        name: doc.original_filename || doc.document_name,
        requirementTitle: requirement?.title || 'General Document',
        status: doc.admin_status || doc.status || 'pending',
        uploadedAt: doc.created_at
      };
    });

    // Calculate which requirements have documents uploaded
    const uploadedRequirementIds = new Set(
      documents.map(d => d.entry_requirement_id || d.requirement_id).filter(Boolean)
    );

    // Calculate missing requirements
    const missingRequirements = entryRequirements
      .filter((req: any) => req.linkedDocumentTemplates?.length > 0) // Only requirements that need documents
      .filter((req: any) => !uploadedRequirementIds.has(req.id))
      .map((req: any) => ({
        title: req.title || req.name,
        mandatory: req.mandatory !== false,
        type: req.type
      }));

    // Calculate task stats
    const now = new Date();
    const pendingTasks = tasks.filter(t => t.status !== 'completed');
    const overdueTasks = pendingTasks.filter(t => t.due_date && new Date(t.due_date) < now);
    const upcomingTasks = pendingTasks.filter(t => t.due_date && new Date(t.due_date) >= now);

    // Build comprehensive lead context
    const leadContext = {
      personal: {
        name: `${lead.first_name} ${lead.last_name}`,
        email: lead.email,
        phone: lead.phone || 'Not provided',
        country: lead.country || 'Not specified',
        city: lead.city || 'Not specified',
      },
      application: {
        status: lead.status,
        priority: lead.priority,
        leadScore: lead.lead_score,
        aiScore: lead.ai_score,
        program: programName || 'Not selected',
        programDescription: program?.description || null,
        source: lead.source,
        sourceDetails: lead.source_details,
        createdAt: lead.created_at,
        lastContactedAt: lead.last_contacted_at,
        nextFollowUpAt: lead.next_follow_up_at,
        assignedTo: lead.assigned_to ? 'Assigned to advisor' : 'Unassigned',
      },
      documents: {
        uploaded: uploadedDocsWithRequirements,
        uploadedCount: documents.length,
        approvedCount: documents.filter(d => d.admin_status === 'approved').length,
        pendingCount: documents.filter(d => d.admin_status === 'pending' || (!d.admin_status && d.status === 'pending')).length,
        rejectedCount: documents.filter(d => d.admin_status === 'rejected').length,
        missingRequirements: missingRequirements.map((r: any) => r.title),
        missingMandatoryRequirements: missingRequirements.filter((r: any) => r.mandatory).map((r: any) => r.title),
        documentStatusSummary: uploadedDocsWithRequirements.map(d => 
          `${d.requirementTitle}: ${d.name} (${d.status})`
        ).join(', ') || 'No documents uploaded'
      },
      entryRequirements: {
        programRequirements: entryRequirements.map((r: any) => ({
          id: r.id,
          title: r.title || r.name,
          type: r.type || 'general',
          mandatory: r.mandatory !== false,
          minimumGrade: r.minimumGrade || null,
          description: r.description || null,
          hasLinkedDocuments: (r.linkedDocumentTemplates?.length || 0) > 0,
          documentUploaded: uploadedRequirementIds.has(r.id)
        })),
        totalRequired: entryRequirements.length,
        fulfilledCount: entryRequirements.filter((r: any) => uploadedRequirementIds.has(r.id)).length,
      },
      journeyProgress: {
        currentStage: currentStageName,
        stageNumber: currentStageIndex + 1,
        totalStages: journeyStages.length,
        allStages: journeyStages.map(s => s.name),
        completedStages: journeyStages.filter(s => s.order_index < currentStageIndex).map(s => s.name),
        remainingStages: journeyStages.filter(s => s.order_index > currentStageIndex).map(s => s.name),
        journeyStatus: journeyInstance?.status || 'Not started',
        progressPercentage: journeyStages.length > 0 
          ? Math.round((currentStageIndex / journeyStages.length) * 100) 
          : 0
      },
      communications: {
        totalCount: communications.length,
        types: [...new Set(communications.map(c => c.type))],
        recentCommunications: communications.slice(0, 5).map(c => ({
          type: c.type,
          subject: c.subject,
          direction: c.direction,
          date: c.created_at
        })),
        lastContactDate: communications[0]?.created_at || lead.last_contacted_at || 'Never contacted',
        emailCount: communications.filter(c => c.type === 'email').length,
        callCount: communications.filter(c => c.type === 'phone').length,
        smsCount: communications.filter(c => c.type === 'sms').length,
      },
      tasks: {
        total: tasks.length,
        pending: pendingTasks.length,
        completed: tasks.filter(t => t.status === 'completed').length,
        overdue: overdueTasks.length,
        overdueTaskNames: overdueTasks.map(t => t.title),
        upcomingTasks: upcomingTasks.slice(0, 3).map(t => ({
          title: t.title,
          dueDate: t.due_date,
          priority: t.priority
        })),
      },
      notes: {
        count: notes.length,
        recentNotes: notes.map(n => ({
          content: n.content?.substring(0, 200) || '',
          type: n.note_type,
          date: n.created_at
        }))
      },
      recentActivity: activities.slice(0, 5).map(a => ({
        type: a.activity_type,
        description: a.activity_description,
        date: a.created_at
      })),
      engagement: {
        daysSinceCreation: Math.floor((now.getTime() - new Date(lead.created_at).getTime()) / (1000 * 60 * 60 * 24)),
        daysSinceLastContact: lead.last_contacted_at 
          ? Math.floor((now.getTime() - new Date(lead.last_contacted_at).getTime()) / (1000 * 60 * 60 * 24))
          : null,
        hasUpcomingFollowUp: !!lead.next_follow_up_at && new Date(lead.next_follow_up_at) > now,
      }
    };

    console.log('Built comprehensive lead context:', JSON.stringify(leadContext, null, 2));

    let response;

    if (action === 'summary') {
      // Generate AI summary
      response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `You are an AI assistant for an educational institution's CRM system. Generate a comprehensive, professional summary of a lead (prospective student) based on their complete profile data. 

              Focus on:
              - Current application status and journey progress
              - Document submission status (what's uploaded, what's approved/pending/rejected, what's missing)
              - Entry requirements completion status
              - Recent communications and engagement level
              - Pending tasks and follow-ups
              - Risk factors or areas needing attention
              - Recommended next steps
              
              Be specific and actionable. Mention specific document names, requirement names, stage names, and dates where relevant.
              Keep the summary concise but informative (3-4 paragraphs). Use professional, helpful language appropriate for admissions staff.`
            },
            {
              role: 'user',
              content: `Please generate a comprehensive summary for this lead:\n\n${JSON.stringify(leadContext, null, 2)}`
            }
          ],
          max_tokens: 1000,
        }),
      });
    } else if (action === 'question' && question) {
      // Answer question about lead
      response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `You are an AI assistant for an educational institution's CRM system. Answer questions about a specific lead (prospective student) based on their complete profile data. 

              You have access to:
              - Personal and contact information
              - Application status and program details
              - Document uploads (what's uploaded with their status, what requirements are missing)
              - Entry requirements for their program (and whether each is fulfilled)
              - Academic journey progress (current stage, completed stages, remaining stages)
              - Communication history (emails, calls, SMS)
              - Tasks (pending, overdue, completed)
              - Notes from advisors
              - Recent activity log
              
              IMPORTANT: 
              - The "documents.uploaded" array shows documents that HAVE been uploaded
              - The "documents.missingRequirements" array shows requirements that still NEED documents
              - Check "entryRequirements.programRequirements" to see which requirements have "documentUploaded: true/false"
              
              Provide accurate, specific answers based on the available data. Reference specific document names, requirement names, dates, stage names, and task titles when relevant. If information is not available, clearly state that. Be professional and concise.`
            },
            {
              role: 'user',
              content: `Lead data:\n${JSON.stringify(leadContext, null, 2)}\n\nQuestion: ${question}`
            }
          ],
          max_tokens: 800,
        }),
      });
    } else {
      return new Response(
        JSON.stringify({ error: 'Invalid action or missing question' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      return new Response(
        JSON.stringify({ error: 'Failed to process AI request' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    console.log('AI response generated successfully for lead:', leadId);

    return new Response(
      JSON.stringify({ 
        success: true, 
        response: aiResponse,
        leadName: leadContext.personal.name 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in lead-ai-summary function:', error);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
