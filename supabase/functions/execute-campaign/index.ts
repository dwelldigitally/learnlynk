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

// Batch processing configuration
const BATCH_SIZE = 100;
const BATCH_DELAY_MS = 100;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { campaignId, leadIds, testMode = false }: ExecuteCampaignRequest = await req.json();

    console.log(`Starting campaign execution for campaign: ${campaignId}, testMode: ${testMode}`);

    // Get campaign details
    const { data: campaign, error: campaignError } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', campaignId)
      .single();

    if (campaignError || !campaign) {
      throw new Error(`Campaign not found: ${campaignId}`);
    }

    // Get campaign steps from database
    const { data: dbSteps, error: stepsError } = await supabase
      .from('campaign_steps')
      .select('*')
      .eq('campaign_id', campaignId)
      .order('order_index');

    if (stepsError) {
      console.error('Failed to load campaign steps:', stepsError);
    }

    // Use database steps if available, otherwise fall back to campaign_data.elements
    let steps = dbSteps || [];
    if (steps.length === 0 && campaign.campaign_data?.elements) {
      console.log('No steps in database, converting from campaign_data.elements');
      steps = campaign.campaign_data.elements.map((element: any, index: number) => ({
        id: element.id,
        campaign_id: campaignId,
        step_type: element.type,
        step_config: {
          ...element.config,
          title: element.title,
          description: element.description,
        },
        order_index: index,
        is_active: true,
      }));
    }

    console.log(`Found ${steps.length} campaign steps`);

    // Get target leads based on audience filters
    let targetLeads: any[] = [];
    const audienceFilters = campaign.target_audience || campaign.campaign_data?.settings?.audience?.filters;
    
    if (leadIds && leadIds.length > 0) {
      // Process specific leads
      for (let i = 0; i < leadIds.length; i += BATCH_SIZE) {
        const batchIds = leadIds.slice(i, i + BATCH_SIZE);
        const { data: leads, error: leadsError } = await supabase
          .from('leads')
          .select('*')
          .in('id', batchIds);

        if (leadsError) {
          console.error(`Batch ${i / BATCH_SIZE + 1} failed:`, leadsError);
          continue;
        }
        targetLeads.push(...(leads || []));
      }
    } else {
      // Fetch leads matching audience filters with pagination
      let lastId: string | null = null;
      let hasMore = true;
      
      while (hasMore) {
        let query = supabase
          .from('leads')
          .select('*')
          .eq('user_id', campaign.user_id)
          .order('id', { ascending: true })
          .limit(BATCH_SIZE);

        // Apply audience filters if present
        if (audienceFilters) {
          if (audienceFilters.status && audienceFilters.status.length > 0) {
            query = query.in('status', audienceFilters.status);
          } else {
            query = query.in('status', ['new', 'contacted', 'qualified', 'nurturing']);
          }
          
          if (audienceFilters.source && audienceFilters.source.length > 0) {
            query = query.in('source', audienceFilters.source);
          }
          
          if (audienceFilters.priority && audienceFilters.priority.length > 0) {
            query = query.in('priority', audienceFilters.priority);
          }
          
          if (audienceFilters.minScore) {
            query = query.gte('lead_score', audienceFilters.minScore);
          }
          
          if (audienceFilters.maxScore) {
            query = query.lte('lead_score', audienceFilters.maxScore);
          }
        } else {
          // Default: only active leads
          query = query.in('status', ['new', 'contacted', 'qualified', 'nurturing']);
        }

        if (lastId) {
          query = query.gt('id', lastId);
        }

        const { data: leads, error: leadsError } = await query;

        if (leadsError) {
          console.error('Error fetching leads batch:', leadsError);
          break;
        }

        if (!leads || leads.length === 0) {
          hasMore = false;
        } else {
          targetLeads.push(...leads);
          lastId = leads[leads.length - 1].id;
          hasMore = leads.length === BATCH_SIZE;
        }
      }
    }

    console.log(`Found ${targetLeads.length} leads to process`);

    if (targetLeads.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'No leads match the campaign audience filters',
          results: { totalLeads: 0, successfulExecutions: 0, failedExecutions: 0 }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Process leads in batches
    const allResults: any[] = [];
    
    for (let i = 0; i < targetLeads.length; i += BATCH_SIZE) {
      const batch = targetLeads.slice(i, i + BATCH_SIZE);
      const batchNumber = Math.floor(i / BATCH_SIZE) + 1;
      const totalBatches = Math.ceil(targetLeads.length / BATCH_SIZE);
      
      console.log(`Processing batch ${batchNumber}/${totalBatches} (${batch.length} leads)`);

      const batchResults = await processBatch(supabase, campaignId, campaign.user_id, batch, steps, testMode);
      allResults.push(...batchResults);

      // Update campaign progress
      await supabase
        .from('campaigns')
        .update({
          last_executed_at: new Date().toISOString(),
          campaign_data: {
            ...campaign.campaign_data,
            execution_progress: {
              processed: i + batch.length,
              total: targetLeads.length,
              batch: batchNumber,
              totalBatches
            }
          }
        })
        .eq('id', campaignId);

      if (i + BATCH_SIZE < targetLeads.length) {
        await delay(BATCH_DELAY_MS);
      }
    }

    // Update campaign status
    if (!testMode) {
      await supabase
        .from('campaigns')
        .update({ 
          status: 'active',
          started_at: campaign.started_at || new Date().toISOString(),
          total_executions: (campaign.total_executions || 0) + targetLeads.length
        })
        .eq('id', campaignId);
    }

    const successCount = allResults.filter(r => r.status === 'started' || r.status === 'completed').length;
    const failureCount = allResults.filter(r => r.status === 'failed').length;

    console.log(`Campaign execution completed: ${successCount} started, ${failureCount} failed`);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Campaign execution ${testMode ? 'tested' : 'started'} successfully`,
        results: {
          totalLeads: targetLeads.length,
          successfulExecutions: successCount,
          failedExecutions: failureCount,
          batches: Math.ceil(targetLeads.length / BATCH_SIZE),
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function processBatch(
  supabase: any,
  campaignId: string,
  userId: string,
  leads: any[],
  steps: any[],
  testMode: boolean
): Promise<any[]> {
  const results = await Promise.allSettled(
    leads.map(lead => processLead(supabase, campaignId, userId, lead, steps, testMode))
  );

  return results.map((result, index) => {
    if (result.status === 'fulfilled') {
      return result.value;
    } else {
      return {
        leadId: leads[index].id,
        status: 'failed',
        error: result.reason?.message || 'Unknown error'
      };
    }
  });
}

async function processLead(
  supabase: any,
  campaignId: string,
  userId: string,
  lead: any,
  steps: any[],
  testMode: boolean
) {
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

    // Process all steps for this lead
    for (const step of steps) {
      await processWorkflowStep(supabase, execution.id, userId, step, lead, testMode);
    }

    // Update execution status to completed
    await supabase
      .from('campaign_executions')
      .update({ 
        status: testMode ? 'test' : 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('id', execution.id);

    return { leadId: lead.id, status: 'completed', executionId: execution.id };
  } catch (error) {
    console.error(`Error processing lead ${lead.id}:`, error);
    return { leadId: lead.id, status: 'failed', error: error.message };
  }
}

async function processWorkflowStep(
  supabase: any, 
  executionId: string, 
  userId: string,
  step: any, 
  lead: any, 
  testMode: boolean
) {
  console.log(`Processing step ${step.order_index} (${step.step_type}) for lead ${lead.id}`);

  const stepConfig = step.step_config || {};

  switch (step.step_type) {
    case 'email':
      await processEmailStep(supabase, executionId, userId, stepConfig, lead, testMode);
      break;
    case 'sms':
      await processSMSStep(supabase, executionId, userId, stepConfig, lead, testMode);
      break;
    case 'call':
      await processCallStep(supabase, executionId, stepConfig, lead, testMode);
      break;
    case 'wait':
      console.log(`Wait step: delay ${JSON.stringify(stepConfig.delay)}`);
      break;
    case 'condition':
      console.log(`Condition step: ${JSON.stringify(stepConfig.conditions)}`);
      break;
    case 'update-lead':
      await processUpdateLeadStep(supabase, stepConfig, lead, testMode);
      break;
    case 'assign-advisor':
      await processAssignAdvisorStep(supabase, stepConfig, lead, testMode);
      break;
    case 'create-task':
      await processCreateTaskStep(supabase, executionId, stepConfig, lead, testMode);
      break;
    case 'internal-notification':
      await processInternalNotificationStep(supabase, executionId, stepConfig, lead, testMode);
      break;
    default:
      console.warn(`Unknown step type: ${step.step_type}`);
  }
}

async function processEmailStep(
  supabase: any, 
  executionId: string, 
  userId: string,
  stepConfig: any, 
  lead: any, 
  testMode: boolean
) {
  try {
    const subject = stepConfig.subject || 'Campaign Email';
    const content = personalizeContent(stepConfig.content || stepConfig.body || '', lead);
    const htmlContent = stepConfig.htmlContent || `<div>${content}</div>`;

    // Log the communication
    const { error: commError } = await supabase
      .from('lead_communications')
      .insert({
        lead_id: lead.id,
        user_id: lead.user_id || userId,
        type: 'email',
        direction: 'outbound',
        subject,
        content,
        status: testMode ? 'test' : 'sent',
        communication_date: new Date().toISOString(),
        metadata: {
          campaignExecution: executionId,
          stepType: 'email',
          testMode
        }
      });

    if (commError) {
      console.error('Failed to log email communication:', commError);
    }

    // Actually send the email if not in test mode
    if (!testMode && lead.email) {
      try {
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
        
        const response = await fetch(`${supabaseUrl}/functions/v1/send-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseAnonKey}`,
          },
          body: JSON.stringify({
            to: lead.email,
            subject,
            html: htmlContent,
            text: content,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Failed to send email to ${lead.email}:`, errorText);
        } else {
          console.log(`Email sent to ${lead.email}`);
        }
      } catch (emailError) {
        console.error(`Error sending email to ${lead.email}:`, emailError);
      }
    } else {
      console.log(`Email ${testMode ? 'simulated' : 'skipped (no email)'} for lead ${lead.id}`);
    }
  } catch (error) {
    console.error('Error processing email step:', error);
  }
}

async function processSMSStep(
  supabase: any, 
  executionId: string, 
  userId: string,
  stepConfig: any, 
  lead: any, 
  testMode: boolean
) {
  try {
    if (!lead.phone) {
      console.log(`Skipping SMS for lead ${lead.id} - no phone number`);
      return;
    }

    const message = personalizeContent(stepConfig.content || stepConfig.message || '', lead);

    // Log the communication
    const { error: commError } = await supabase
      .from('lead_communications')
      .insert({
        lead_id: lead.id,
        user_id: lead.user_id || userId,
        type: 'sms',
        direction: 'outbound',
        subject: 'SMS Message',
        content: message,
        status: testMode ? 'test' : 'sent',
        communication_date: new Date().toISOString(),
        metadata: {
          campaignExecution: executionId,
          stepType: 'sms',
          testMode,
          phoneNumber: lead.phone
        }
      });

    if (commError) {
      console.error('Failed to log SMS communication:', commError);
    }

    // Actually send the SMS if not in test mode
    if (!testMode) {
      try {
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
        
        const response = await fetch(`${supabaseUrl}/functions/v1/send-sms`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseAnonKey}`,
          },
          body: JSON.stringify({
            phoneNumber: lead.phone,
            message,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Failed to send SMS to ${lead.phone}:`, errorText);
        } else {
          console.log(`SMS sent to ${lead.phone}`);
        }
      } catch (smsError) {
        console.error(`Error sending SMS to ${lead.phone}:`, smsError);
      }
    } else {
      console.log(`SMS simulated for lead ${lead.id}`);
    }
  } catch (error) {
    console.error('Error processing SMS step:', error);
  }
}

async function processCallStep(
  supabase: any, 
  executionId: string, 
  stepConfig: any, 
  lead: any, 
  testMode: boolean
) {
  try {
    const taskData = {
      lead_id: lead.id,
      user_id: lead.user_id,
      title: stepConfig.title || 'Campaign Follow-up Call',
      description: personalizeContent(stepConfig.description || `Call ${lead.first_name} ${lead.last_name}`, lead),
      task_type: 'call',
      priority: stepConfig.priority || 'medium',
      status: 'pending',
      due_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      assigned_to: lead.assigned_to
    };

    if (!testMode) {
      const { error } = await supabase.from('lead_tasks').insert(taskData);
      if (error) {
        console.error('Failed to create call task:', error);
      } else {
        console.log(`Call task created for lead ${lead.id}`);
      }
    } else {
      console.log(`Call task simulated for lead ${lead.id}`);
    }
  } catch (error) {
    console.error('Error processing call step:', error);
  }
}

async function processUpdateLeadStep(
  supabase: any, 
  stepConfig: any, 
  lead: any, 
  testMode: boolean
) {
  try {
    const updates: any = {};
    
    if (stepConfig.status) updates.status = stepConfig.status;
    if (stepConfig.priority) updates.priority = stepConfig.priority;
    if (stepConfig.tags) updates.tags = stepConfig.tags;
    
    if (!testMode && Object.keys(updates).length > 0) {
      const { error } = await supabase
        .from('leads')
        .update(updates)
        .eq('id', lead.id);

      if (error) {
        console.error('Failed to update lead:', error);
      } else {
        console.log(`Lead ${lead.id} updated:`, updates);
      }
    } else {
      console.log(`Lead update ${testMode ? 'simulated' : 'skipped'} for lead ${lead.id}`);
    }
  } catch (error) {
    console.error('Error processing update lead step:', error);
  }
}

async function processAssignAdvisorStep(
  supabase: any, 
  stepConfig: any, 
  lead: any, 
  testMode: boolean
) {
  try {
    const advisorId = stepConfig.advisorId;
    
    if (!advisorId) {
      console.log('Skipping advisor assignment - no advisor specified');
      return;
    }

    if (!testMode) {
      const { error } = await supabase
        .from('leads')
        .update({ 
          assigned_to: advisorId,
          assigned_at: new Date().toISOString()
        })
        .eq('id', lead.id);

      if (error) {
        console.error('Failed to assign advisor:', error);
      } else {
        console.log(`Lead ${lead.id} assigned to advisor ${advisorId}`);
      }
    } else {
      console.log(`Advisor assignment simulated for lead ${lead.id}`);
    }
  } catch (error) {
    console.error('Error processing assign advisor step:', error);
  }
}

async function processCreateTaskStep(
  supabase: any, 
  executionId: string, 
  stepConfig: any, 
  lead: any, 
  testMode: boolean
) {
  try {
    const taskData = {
      lead_id: lead.id,
      user_id: lead.user_id,
      title: stepConfig.title || 'Campaign Task',
      description: personalizeContent(stepConfig.description || '', lead),
      task_type: stepConfig.taskType || 'other',
      priority: stepConfig.priority || 'medium',
      status: 'pending',
      due_date: stepConfig.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      assigned_to: stepConfig.assignedTo || lead.assigned_to
    };

    if (!testMode) {
      const { error } = await supabase.from('lead_tasks').insert(taskData);
      if (error) {
        console.error('Failed to create task:', error);
      } else {
        console.log(`Task created for lead ${lead.id}`);
      }
    } else {
      console.log(`Task creation simulated for lead ${lead.id}`);
    }
  } catch (error) {
    console.error('Error processing create task step:', error);
  }
}

async function processInternalNotificationStep(
  supabase: any, 
  executionId: string, 
  stepConfig: any, 
  lead: any, 
  testMode: boolean
) {
  try {
    const notificationData = {
      user_id: stepConfig.notifyUserId || lead.assigned_to || lead.user_id,
      type: 'campaign_notification',
      title: stepConfig.title || 'Campaign Notification',
      message: personalizeContent(stepConfig.message || '', lead),
      data: {
        leadId: lead.id,
        executionId,
        stepType: 'internal-notification'
      },
      is_read: false,
    };

    if (!testMode && notificationData.user_id) {
      const { error } = await supabase.from('notifications').insert(notificationData);
      if (error) {
        console.error('Failed to create notification:', error);
      } else {
        console.log(`Notification created for lead ${lead.id}`);
      }
    } else {
      console.log(`Notification ${testMode ? 'simulated' : 'skipped'} for lead ${lead.id}`);
    }
  } catch (error) {
    console.error('Error processing notification step:', error);
  }
}

function personalizeContent(content: string, lead: any): string {
  return content
    .replace(/\{\{first_name\}\}/gi, lead.first_name || '')
    .replace(/\{\{last_name\}\}/gi, lead.last_name || '')
    .replace(/\{\{email\}\}/gi, lead.email || '')
    .replace(/\{\{phone\}\}/gi, lead.phone || '')
    .replace(/\{\{company\}\}/gi, lead.company || '')
    .replace(/\{\{program_interest\}\}/gi, (lead.program_interest || []).join(', '))
    .replace(/\{\{lead_name\}\}/gi, `${lead.first_name || ''} ${lead.last_name || ''}`.trim())
    .replace(/\{\{name\}\}/gi, `${lead.first_name || ''} ${lead.last_name || ''}`.trim());
}
