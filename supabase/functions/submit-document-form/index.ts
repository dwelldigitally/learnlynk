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

    // Helper function to generate unique access token with retry logic
    const generateUniqueAccessToken = async (maxRetries = 5): Promise<string> => {
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        const token = crypto.randomUUID();
        console.log(`Generating access token, attempt ${attempt}: ${token}`);
        
        // Check if token already exists
        const { data: existingToken, error: checkError } = await supabase
          .from('student_portal_sessions')
          .select('access_token')
          .eq('access_token', token)
          .maybeSingle();
        
        if (checkError) {
          console.warn(`Error checking token uniqueness on attempt ${attempt}:`, checkError);
          if (attempt === maxRetries) throw checkError;
          continue;
        }
        
        if (!existingToken) {
          console.log(`Unique token generated successfully: ${token}`);
          return token;
        }
        
        console.log(`Token collision detected on attempt ${attempt}, retrying...`);
      }
      
      throw new Error('Failed to generate unique access token after maximum retries');
    };

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

    // Check for existing lead with same email and program
    console.log('Checking for existing lead...');
    const { data: existingLead, error: existingLeadError } = await supabase
      .from('leads')
      .select('*')
      .eq('email', submissionData.email)
      .contains('program_interest', submissionData.programInterest)
      .maybeSingle();

    if (existingLeadError) {
      console.warn('Error checking for existing lead:', existingLeadError);
    }

    let leadData: any;

    if (existingLead) {
      console.log('Found existing lead:', existingLead.id);
      leadData = existingLead;
      
      // Update existing lead with new information if provided
      const { data: updatedLead, error: updateError } = await supabase
        .from('leads')
        .update({
          first_name: submissionData.firstName,
          last_name: submissionData.lastName,
          phone: submissionData.phone || existingLead.phone,
          country: submissionData.country || existingLead.country,
          notes: submissionData.notes || existingLead.notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingLead.id)
        .select()
        .single();

      if (updateError) {
        console.warn('Failed to update existing lead:', updateError);
      } else {
        leadData = updatedLead;
        console.log('Updated existing lead successfully');
      }
    } else {
      // Create new lead record - assign to demo admin user
      const DEMO_ADMIN_USER_ID = '7a4165be-91e3-4fd9-b2da-19a4be0f2df1'; // malhotratushar37@gmail.com
      
      console.log('Creating new lead record with data:', {
        first_name: submissionData.firstName,
        last_name: submissionData.lastName,
        email: submissionData.email,
        source: 'webform',
        user_id: DEMO_ADMIN_USER_ID,
      });

      const { data: newLead, error: leadError } = await supabase
        .from('leads')
        .insert({
          first_name: submissionData.firstName,
          last_name: submissionData.lastName,
          email: submissionData.email,
          phone: submissionData.phone,
          country: submissionData.country,
          source: 'webform',
          source_details: submissionData.applicationType === 'scholarship' ? 'Scholarship Application' : 'Webform Submission',
          program_interest: submissionData.programInterest,
          notes: submissionData.notes,
          status: 'new',
          priority: 'medium',
          lead_score: 50,
          tags: submissionData.applicationType === 'scholarship' 
            ? ['webform', 'scholarship-application'] 
            : ['webform', 'submission'],
          user_id: DEMO_ADMIN_USER_ID
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

      leadData = newLead;
      console.log('Lead created successfully:', leadData.id);
    }

    // Generate unique access token
    let accessToken: string;
    try {
      accessToken = await generateUniqueAccessToken();
    } catch (tokenError) {
      console.error('Failed to generate unique access token:', tokenError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Failed to generate access token',
          details: tokenError instanceof Error ? tokenError.message : 'Unknown error'
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Create student portal access (check if exists first)
    console.log('Creating/updating student portal access...');
    const { data: existingAccess } = await supabase
      .from('student_portal_access')
      .select('*')
      .eq('lead_id', leadData.id)
      .maybeSingle();

    let portalAccessData: any;
    if (existingAccess) {
      // Update existing access
      const { data: updatedAccess, error: updateAccessError } = await supabase
        .from('student_portal_access')
        .update({
          access_token: accessToken,
          student_name: `${submissionData.firstName} ${submissionData.lastName}`,
          programs_applied: submissionData.programInterest,
          status: 'active',
          expires_at: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', existingAccess.id)
        .select()
        .single();

      if (updateAccessError) {
        console.error('Error updating portal access:', updateAccessError);
        return new Response(
          JSON.stringify({ 
            success: false, 
            message: 'Failed to update portal access',
            details: updateAccessError.message
          }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
      portalAccessData = updatedAccess;
      console.log('Portal access updated successfully');
    } else {
      // Create new access
      const { data: newAccess, error: portalAccessError } = await supabase
        .from('student_portal_access')
        .insert({
          lead_id: leadData.id,
          access_token: accessToken,
          student_name: `${submissionData.firstName} ${submissionData.lastName}`,
          programs_applied: submissionData.programInterest,
          status: 'active',
          expires_at: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000).toISOString()
        })
        .select()
        .single();

      if (portalAccessError) {
        console.error('Error creating portal access:', portalAccessError);
        return new Response(
          JSON.stringify({ 
            success: false, 
            message: 'Failed to create portal access',
            details: portalAccessError.message
          }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
      portalAccessData = newAccess;
      console.log('Portal access created successfully');
    }

    // Create student portal session (remove existing ones with same access token first)
    console.log('Creating student portal session...');
    
    // Delete any existing sessions with the same access token (shouldn't happen but safety measure)
    await supabase
      .from('student_portal_sessions')
      .delete()
      .eq('access_token', accessToken);

    const { data: sessionData, error: sessionError } = await supabase
      .from('student_portal_sessions')
      .insert({
        access_token: accessToken,
        lead_id: leadData.id,
        student_name: `${submissionData.firstName} ${submissionData.lastName}`,
        email: submissionData.email,
        expires_at: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000).toISOString()
      })
      .select()
      .single();

    if (sessionError) {
      console.error('Error creating session:', sessionError);
      console.error('Session error details:', JSON.stringify(sessionError, null, 2));
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Failed to create session',
          details: sessionError.message,
          code: sessionError.code
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

    // Generate portal URL - get the correct domain from request headers
    const origin = req.headers.get('origin') || req.headers.get('referer');
    let baseUrl = 'https://effa936e-da4f-49df-b4e9-293871d5adb4.sandbox.lovable.dev';
    
    if (origin) {
      try {
        const url = new URL(origin);
        baseUrl = `${url.protocol}//${url.host}`;
      } catch (e) {
        console.warn('Failed to parse origin URL:', origin);
      }
    }
    
    const portalUrl = `${baseUrl}/student-portal?token=${accessToken}`;
    console.log('Generated portal URL:', portalUrl);

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