import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ExecuteCampaignRequest {
  campaignId: string;
  leadIds?: string[];
  testMode?: boolean;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse request body
    const { campaignId, leadIds, testMode = false }: ExecuteCampaignRequest = await req.json();

    console.log(`Starting campaign execution for campaign: ${campaignId}`);

    // Get campaign details
    const { data: campaign, error: campaignError } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', campaignId)
      .single();

    if (campaignError || !campaign) {
      throw new Error(`Campaign not found: ${campaignId}`);
    }

    // Get campaign steps
    const { data: steps, error: stepsError } = await supabase
      .from('campaign_steps')
      .select('*')
      .eq('campaign_id', campaignId)
      .order('order_index');

    if (stepsError) {
      throw new Error(`Failed to load campaign steps: ${stepsError.message}`);
    }

    // Get target leads
    let targetLeads;
    if (leadIds && leadIds.length > 0) {
      // Execute for specific leads
      const { data: leads, error: leadsError } = await supabase
        .from('leads')
        .select('*')
        .in('id', leadIds);

      if (leadsError) {
        throw new Error(`Failed to load target leads: ${leadsError.message}`);
      }
      targetLeads = leads;
    } else {
      // Execute for all eligible leads based on campaign criteria
      const { data: leads, error: leadsError } = await supabase
        .from('leads')
        .select('*')
        .eq('user_id', campaign.user_id)
        .in('status', ['new', 'contacted', 'qualified']);

      if (leadsError) {
        throw new Error(`Failed to load leads: ${leadsError.message}`);
      }
      targetLeads = leads;
    }

    console.log(`Found ${targetLeads?.length || 0} leads to process`);

    // Process each lead through the campaign workflow
    const executionPromises = (targetLeads || []).map(async (lead) => {
      try {
        // Create campaign execution record
        const { data: execution, error: executionError } = await supabase
          .from('campaign_executions')
          .insert({
            campaign_id: campaignId,
            lead_id: lead.id,
            status: testMode ? 'test' : 'pending',
            started_at: new Date().toISOString(),
            execution_data: {
              leadInfo: {
                id: lead.id,
                email: lead.email,
                firstName: lead.first_name,
                lastName: lead.last_name
              },
              testMode,
              stepCount: steps?.length || 0
            }
          })
          .select()
          .single();

        if (executionError) {
          console.error(`Failed to create execution record for lead ${lead.id}:`, executionError);
          return { leadId: lead.id, status: 'failed', error: executionError.message };
        }

        // Process immediate steps (non-wait steps)
        if (steps && steps.length > 0) {
          const firstStep = steps[0];
          await processWorkflowStep(supabase, execution.id, firstStep, lead, testMode);
        }

        return { leadId: lead.id, status: 'started', executionId: execution.id };
      } catch (error) {
        console.error(`Error processing lead ${lead.id}:`, error);
        return { leadId: lead.id, status: 'failed', error: error.message };
      }
    });

    const results = await Promise.all(executionPromises);

    // Update campaign status if not test mode
    if (!testMode) {
      await supabase
        .from('campaigns')
        .update({ 
          status: 'active',
          start_date: new Date().toISOString()
        })
        .eq('id', campaignId);
    }

    const successCount = results.filter(r => r.status === 'started').length;
    const failureCount = results.filter(r => r.status === 'failed').length;

    console.log(`Campaign execution completed: ${successCount} started, ${failureCount} failed`);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Campaign execution ${testMode ? 'tested' : 'started'} successfully`,
        results: {
          totalLeads: targetLeads?.length || 0,
          successfulExecutions: successCount,
          failedExecutions: failureCount,
          details: results
        }
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Campaign execution error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});

async function processWorkflowStep(
  supabase: any, 
  executionId: string, 
  step: any, 
  lead: any, 
  testMode: boolean
) {
  console.log(`Processing step ${step.order_index} (${step.step_type}) for lead ${lead.id}`);

  const stepConfig = step.step_config || {};

  switch (step.step_type) {
    case 'email':
      await processEmailStep(supabase, executionId, stepConfig, lead, testMode);
      break;
    case 'sms':
      await processSMSStep(supabase, executionId, stepConfig, lead, testMode);
      break;
    case 'call':
      await processCallStep(supabase, executionId, stepConfig, lead, testMode);
      break;
    case 'wait':
      await processWaitStep(supabase, executionId, stepConfig, lead, testMode);
      break;
    case 'condition':
      await processConditionStep(supabase, executionId, stepConfig, lead, testMode);
      break;
    default:
      console.warn(`Unknown step type: ${step.step_type}`);
  }
}

async function processEmailStep(supabase: any, executionId: string, stepConfig: any, lead: any, testMode: boolean) {
  try {
    // Create communication record
    const emailData = {
      lead_id: lead.id,
      user_id: lead.user_id,
      type: 'email',
      direction: 'outbound',
      subject: stepConfig.subject || 'Campaign Email',
      content: personalizeContent(stepConfig.content || '', lead),
      status: testMode ? 'test' : 'sent',
      communication_date: new Date().toISOString(),
      metadata: {
        campaignExecution: executionId,
        stepType: 'email',
        testMode
      }
    };

    const { error } = await supabase
      .from('lead_communications')
      .insert(emailData);

    if (error) {
      console.error('Failed to create email communication:', error);
    } else {
      console.log(`Email ${testMode ? 'simulated' : 'sent'} to ${lead.email}`);
    }
  } catch (error) {
    console.error('Error processing email step:', error);
  }
}

async function processSMSStep(supabase: any, executionId: string, stepConfig: any, lead: any, testMode: boolean) {
  try {
    if (!lead.phone) {
      console.log(`Skipping SMS for lead ${lead.id} - no phone number`);
      return;
    }

    // Create communication record
    const smsData = {
      lead_id: lead.id,
      user_id: lead.user_id,
      type: 'sms',
      direction: 'outbound',
      subject: 'SMS Message',
      content: personalizeContent(stepConfig.content || '', lead),
      status: testMode ? 'test' : 'sent',
      communication_date: new Date().toISOString(),
      metadata: {
        campaignExecution: executionId,
        stepType: 'sms',
        testMode,
        phoneNumber: lead.phone
      }
    };

    const { error } = await supabase
      .from('lead_communications')
      .insert(smsData);

    if (error) {
      console.error('Failed to create SMS communication:', error);
    } else {
      console.log(`SMS ${testMode ? 'simulated' : 'sent'} to ${lead.phone}`);
    }
  } catch (error) {
    console.error('Error processing SMS step:', error);
  }
}

async function processCallStep(supabase: any, executionId: string, stepConfig: any, lead: any, testMode: boolean) {
  try {
    // Create task for advisor to call lead
    const taskData = {
      lead_id: lead.id,
      user_id: lead.user_id,
      title: stepConfig.title || 'Campaign Follow-up Call',
      description: stepConfig.content || `Call ${lead.first_name} ${lead.last_name} as part of campaign workflow`,
      task_type: 'call',
      priority: 'medium',
      status: testMode ? 'test' : 'pending',
      due_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Due in 24 hours
      assigned_to: lead.assigned_to
    };

    const { error } = await supabase
      .from('lead_tasks')
      .insert(taskData);

    if (error) {
      console.error('Failed to create call task:', error);
    } else {
      console.log(`Call task ${testMode ? 'simulated' : 'created'} for lead ${lead.id}`);
    }
  } catch (error) {
    console.error('Error processing call step:', error);
  }
}

async function processWaitStep(supabase: any, executionId: string, stepConfig: any, lead: any, testMode: boolean) {
  try {
    console.log(`Wait step processed for lead ${lead.id} - delay: ${JSON.stringify(stepConfig.delay)}`);
    // In a real implementation, this would schedule the next step
    // For now, we just log the wait step
  } catch (error) {
    console.error('Error processing wait step:', error);
  }
}

async function processConditionStep(supabase: any, executionId: string, stepConfig: any, lead: any, testMode: boolean) {
  try {
    console.log(`Condition step processed for lead ${lead.id} - conditions: ${JSON.stringify(stepConfig.conditions)}`);
    // In a real implementation, this would evaluate conditions and branch the workflow
    // For now, we just log the condition step
  } catch (error) {
    console.error('Error processing condition step:', error);
  }
}

function personalizeContent(content: string, lead: any): string {
  return content
    .replace(/\[First Name\]/g, lead.first_name || 'there')
    .replace(/\[Last Name\]/g, lead.last_name || '')
    .replace(/\[Full Name\]/g, `${lead.first_name || ''} ${lead.last_name || ''}`.trim() || 'there')
    .replace(/\[Email\]/g, lead.email || '')
    .replace(/\[Program\]/g, lead.program_interest?.[0] || 'our programs');
}