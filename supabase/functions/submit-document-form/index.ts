import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.53.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface SubmissionData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  programInterest: string[];
  documentType?: string;
  notes?: string;
  document?: File;
  applicationType?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }

  try {
    // Initialize Supabase client with service role key to bypass RLS
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Processing submission...');

    let submissionData: SubmissionData;

    // Check if request is JSON (from React app) or FormData (from embeddable form)
    const contentType = req.headers.get('content-type') || '';
    
    if (contentType.includes('application/json')) {
      // Handle JSON request from React app
      const jsonData = await req.json();
      submissionData = {
        firstName: jsonData.firstName,
        lastName: jsonData.lastName,
        email: jsonData.email,
        phone: jsonData.phone || '',
        country: jsonData.country || '',
        programInterest: Array.isArray(jsonData.programInterest) ? jsonData.programInterest : [jsonData.programInterest],
        documentType: jsonData.documentType,
        notes: jsonData.notes,
        applicationType: jsonData.applicationType
      };
    } else {
      // Handle FormData request from embeddable form
      const formData = await req.formData();
      submissionData = {
        firstName: formData.get('firstName') as string,
        lastName: formData.get('lastName') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string || '',
        country: formData.get('country') as string || '',
        programInterest: [formData.get('programInterest') as string],
        documentType: formData.get('documentType') as string,
        notes: formData.get('notes') as string || '',
        document: formData.get('document') as File,
        applicationType: 'document'
      };
    }

    console.log('Parsed submission data:', {
      firstName: submissionData.firstName,
      lastName: submissionData.lastName,
      email: submissionData.email,
      applicationType: submissionData.applicationType
    });

    // Validate required fields
    if (!submissionData.firstName || !submissionData.lastName || !submissionData.email) {
      console.error('Missing required fields:', { 
        firstName: !!submissionData.firstName, 
        lastName: !!submissionData.lastName, 
        email: !!submissionData.email 
      });
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Missing required fields: firstName, lastName, and email are required' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Validate document file only if not a scholarship or regular application
    const isDocumentRequired = submissionData.applicationType !== 'scholarship' && submissionData.documentType;
    if (isDocumentRequired && (!submissionData.document || submissionData.document.size === 0)) {
      console.error('No document file provided for document submission');
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Document file is required for document submissions' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Generate unique access token
    const accessToken = crypto.randomUUID();

    // Test database connection first
    console.log('Testing database connection...');
    const { data: testData, error: testError } = await supabase
      .from('leads')
      .select('count')
      .limit(1);
    
    if (testError) {
      console.error('Database connection test failed:', testError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Database connection failed',
          details: testError.message
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Database connection successful');

    // Create lead record with proper source enum value
    console.log('Creating lead record with data:', {
      first_name: submissionData.firstName,
      last_name: submissionData.lastName,
      email: submissionData.email,
      source: 'webform',
      user_id: null, // Explicitly set to null for anonymous submission
    });

    const { data: leadData, error: leadError } = await supabase
      .from('leads')
      .insert({
        first_name: submissionData.firstName,
        last_name: submissionData.lastName,
        email: submissionData.email,
        phone: submissionData.phone,
        country: submissionData.country,
        source: 'webform',
        source_details: submissionData.applicationType === 'scholarship' ? 'Scholarship Application' : 'Embeddable Document Form',
        program_interest: submissionData.programInterest,
        notes: submissionData.notes,
        status: 'new',
        priority: 'medium',
        lead_score: 50,
        tags: submissionData.applicationType === 'scholarship' 
          ? ['webform', 'scholarship-application'] 
          : ['webform', 'document-submission'],
        user_id: null // Explicitly set to null for anonymous submission
      })
      .select()
      .single();

    if (leadError) {
      console.error('Error creating lead:', leadError);
      console.error('Lead error details:', JSON.stringify(leadError, null, 2));
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Failed to create lead record',
          details: leadError.message,
          code: leadError.code
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Lead created successfully:', leadData.id);

    // Create student portal access
    const { data: portalAccessData, error: portalAccessError } = await supabase
      .from('student_portal_access')
      .insert({
        lead_id: leadData.id,
        access_token: accessToken,
        student_name: `${submissionData.firstName} ${submissionData.lastName}`,
        programs_applied: submissionData.programInterest,
        status: 'active',
        expires_at: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000).toISOString() // 6 months
      })
      .select()
      .single();

    if (portalAccessError) {
      console.error('Error creating portal access:', portalAccessError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Failed to create portal access' 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Create student portal session
    const { data: sessionData, error: sessionError } = await supabase
      .from('student_portal_sessions')
      .insert({
        access_token: accessToken,
        lead_id: leadData.id,
        student_name: `${submissionData.firstName} ${submissionData.lastName}`,
        email: submissionData.email,
        expires_at: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000).toISOString() // 6 months
      })
      .select()
      .single();

    if (sessionError) {
      console.error('Error creating session:', sessionError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Failed to create session' 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Portal access created successfully');

    // Only handle document upload if it's a document submission
    if (submissionData.document && submissionData.documentType) {
      // Convert document to base64 and store
      console.log('Converting document to base64...');
      
      const arrayBuffer = await submissionData.document.arrayBuffer();
      const base64Document = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
      
      console.log('Document converted, size:', base64Document.length);

      // Store document upload record
      const { data: documentData, error: documentError } = await supabase
        .from('student_document_uploads')
        .insert({
          lead_id: leadData.id,
          session_id: sessionData.id,
          document_name: submissionData.document.name,
          document_type: submissionData.documentType,
          file_size: submissionData.document.size,
          file_path: base64Document, // Store base64 directly for now
          upload_status: 'uploaded',
          admin_status: 'pending',
          metadata: {
            originalName: submissionData.document.name,
            mimeType: submissionData.document.type,
            submittedAt: new Date().toISOString(),
            notes: submissionData.notes
          }
        })
        .select()
        .single();

      if (documentError) {
        console.warn('Warning: Failed to store document upload record:', documentError);
        // Continue execution - don't fail the entire process
      } else {
        console.log('Document upload record created successfully');
      }
    } else {
      console.log('No document to upload - this is a regular application');
    }

    // Generate portal URL
    const baseUrl = Deno.env.get('SUPABASE_URL')?.replace('//', '//').replace('supabase.co', 'lovable.app') || 'https://your-domain.lovable.app';
    const portalUrl = `${baseUrl}/student?token=${accessToken}`;

    console.log('Successfully processed submission:', {
      leadId: leadData.id,
      sessionId: sessionData.id,
      email: submissionData.email,
      applicationType: submissionData.applicationType
    });

    return new Response(
      JSON.stringify({ 
        success: true,
        message: submissionData.applicationType === 'scholarship' 
          ? 'Scholarship application submitted successfully' 
          : 'Document submitted successfully',
        accessToken,
        portalUrl,
        leadId: leadData.id
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in submit-document-form function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
};

serve(handler);