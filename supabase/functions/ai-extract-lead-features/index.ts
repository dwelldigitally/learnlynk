import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface LeadFeatures {
  // Demographics
  has_email: boolean;
  has_phone: boolean;
  has_country: boolean;
  has_city: boolean;
  
  // Source quality
  source: string;
  source_is_referral: boolean;
  source_is_organic: boolean;
  source_is_paid: boolean;
  source_is_webform: boolean;
  
  // Engagement metrics
  days_since_created: number;
  call_count: number;
  meeting_count: number;
  email_count: number;
  form_submissions: number;
  total_activities: number;
  
  // Response metrics
  has_been_contacted: boolean;
  days_since_last_contact: number | null;
  response_time_hours: number | null;
  
  // Program interest
  has_program_interest: boolean;
  program_interest: string | null;
  has_preferred_intake: boolean;
  
  // Status indicators
  status: string;
  priority: string;
  lifecycle_stage: string | null;
  
  // Document completion
  documents_submitted_count: number;
  documents_approved_count: number;
  document_completion_rate: number;
  
  // Scoring
  current_lead_score: number;
  
  // Tags and notes
  has_tags: boolean;
  tag_count: number;
  has_notes: boolean;
  
  // Assignment
  is_assigned: boolean;
  
  // UTM tracking
  has_utm_source: boolean;
  utm_source: string | null;
  utm_medium: string | null;
  
  // Re-enquiry
  reenquiry_count: number;
  is_reenquiry: boolean;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { lead_id, tenant_id } = await req.json();

    if (!lead_id) {
      throw new Error('lead_id is required');
    }

    // Fetch lead data
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('*')
      .eq('id', lead_id)
      .single();

    if (leadError || !lead) {
      throw new Error(`Lead not found: ${leadError?.message}`);
    }

    // Fetch communications count
    const { data: communications } = await supabase
      .from('lead_communications')
      .select('type')
      .eq('lead_id', lead_id);

    const callCount = communications?.filter(c => c.type === 'phone' || c.type === 'call').length || 0;
    const meetingCount = communications?.filter(c => c.type === 'meeting').length || 0;
    const emailCount = communications?.filter(c => c.type === 'email').length || 0;

    // Fetch documents
    const { data: documents } = await supabase
      .from('lead_documents')
      .select('status')
      .eq('lead_id', lead_id);

    const documentsSubmitted = documents?.length || 0;
    const documentsApproved = documents?.filter(d => d.status === 'approved').length || 0;

    // Fetch notes
    const { data: notes } = await supabase
      .from('lead_notes')
      .select('id')
      .eq('lead_id', lead_id);

    // Calculate days since created
    const createdAt = new Date(lead.created_at);
    const now = new Date();
    const daysSinceCreated = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));

    // Calculate days since last contact
    let daysSinceLastContact: number | null = null;
    if (lead.last_contacted_at) {
      const lastContact = new Date(lead.last_contacted_at);
      daysSinceLastContact = Math.floor((now.getTime() - lastContact.getTime()) / (1000 * 60 * 60 * 24));
    }

    // Extract features
    const features: LeadFeatures = {
      // Demographics
      has_email: !!lead.email,
      has_phone: !!lead.phone,
      has_country: !!lead.country,
      has_city: !!lead.city,
      
      // Source quality
      source: lead.source || 'unknown',
      source_is_referral: lead.source === 'referral',
      source_is_organic: ['organic', 'seo', 'content'].includes(lead.source?.toLowerCase() || ''),
      source_is_paid: ['paid', 'google_ads', 'facebook_ads', 'ppc'].includes(lead.source?.toLowerCase() || ''),
      source_is_webform: lead.source === 'webform' || lead.source === 'forms',
      
      // Engagement metrics
      days_since_created: daysSinceCreated,
      call_count: lead.call_count || callCount,
      meeting_count: lead.meeting_count || meetingCount,
      email_count: emailCount,
      form_submissions: lead.number_of_form_submissions || 0,
      total_activities: lead.sales_activities || (callCount + meetingCount + emailCount),
      
      // Response metrics
      has_been_contacted: !!(lead.last_contacted_at || communications?.length),
      days_since_last_contact: daysSinceLastContact,
      response_time_hours: lead.lead_response_time || null,
      
      // Program interest
      has_program_interest: !!lead.program_interest,
      program_interest: lead.program_interest,
      has_preferred_intake: !!lead.preferred_intake_id,
      
      // Status indicators
      status: lead.status || 'new',
      priority: lead.priority || 'medium',
      lifecycle_stage: lead.lifecycle_stage,
      
      // Document completion
      documents_submitted_count: documentsSubmitted,
      documents_approved_count: documentsApproved,
      document_completion_rate: documentsSubmitted > 0 ? documentsApproved / documentsSubmitted : 0,
      
      // Scoring
      current_lead_score: lead.lead_score || 0,
      
      // Tags and notes
      has_tags: Array.isArray(lead.tags) && lead.tags.length > 0,
      tag_count: Array.isArray(lead.tags) ? lead.tags.length : 0,
      has_notes: (notes?.length || 0) > 0,
      
      // Assignment
      is_assigned: !!lead.assigned_to,
      
      // UTM tracking
      has_utm_source: !!lead.utm_source,
      utm_source: lead.utm_source,
      utm_medium: lead.utm_medium,
      
      // Re-enquiry
      reenquiry_count: lead.reenquiry_count || 0,
      is_reenquiry: (lead.reenquiry_count || 0) > 0,
    };

    console.log(`Extracted ${Object.keys(features).length} features for lead ${lead_id}`);

    return new Response(JSON.stringify({ 
      success: true,
      lead_id,
      features,
      extracted_at: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error extracting lead features:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
