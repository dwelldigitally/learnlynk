import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const resendApiKey = Deno.env.get('RESEND_API_KEY');
const twilioAccountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
const twilioAuthToken = Deno.env.get('TWILIO_AUTH_TOKEN');
const twilioPhoneNumber = Deno.env.get('TWILIO_PHONE_NUMBER');

interface WorkflowExecutionRequest {
  workflowId: string;
  leadIds?: string[];
  testMode?: boolean;
  userId: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { workflowId, leadIds, testMode = false, userId }: WorkflowExecutionRequest = await req.json();

    console.log(`Executing workflow ${workflowId} for ${leadIds?.length || 'all matching'} leads. Test mode: ${testMode}`);

    // Get workflow details
    const { data: workflow, error: workflowError } = await supabase
      .from('plays')
      .select('*')
      .eq('id', workflowId)
      .single();

    if (workflowError || !workflow) {
      throw new Error(`Workflow not found: ${workflowError?.message}`);
    }

    const triggerConfig = workflow.trigger_config as any;
    const elements = triggerConfig?.elements || [];
    const settings = triggerConfig?.settings || {};
    const enrollmentSettings = workflow.enrollment_settings as any || {};

    // Get leads to enroll
    let leads: any[] = [];
    if (leadIds && leadIds.length > 0) {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .in('id', leadIds);
      if (error) throw error;
      leads = data || [];
    } else {
      // Get leads based on enrollment settings/audience filters
      let query = supabase.from('leads').select('*').eq('user_id', userId);
      
      if (enrollmentSettings.audienceFilters) {
        const filters = enrollmentSettings.audienceFilters;
        if (filters.status) query = query.eq('status', filters.status);
        if (filters.source) query = query.eq('source', filters.source);
        if (filters.tags?.length) query = query.overlaps('tags', filters.tags);
      }
      
      const { data, error } = await query.limit(1000);
      if (error) throw error;
      leads = data || [];
    }

    console.log(`Found ${leads.length} leads to process`);

    const results = {
      total: leads.length,
      enrolled: 0,
      skipped: 0,
      failed: 0,
      details: [] as any[]
    };

    // Process each lead
    for (const lead of leads) {
      try {
        // Check if already enrolled (if re-enrollment not allowed)
        if (!settings.reEnrollmentAllowed) {
          const { data: existing } = await supabase
            .from('workflow_enrollments')
            .select('id')
            .eq('workflow_id', workflowId)
            .eq('lead_id', lead.id)
            .single();

          if (existing) {
            results.skipped++;
            results.details.push({ leadId: lead.id, status: 'skipped', reason: 'Already enrolled' });
            continue;
          }
        }

        // Create enrollment
        const { data: enrollment, error: enrollError } = await supabase
          .from('workflow_enrollments')
          .insert({
            workflow_id: workflowId,
            lead_id: lead.id,
            user_id: userId,
            current_step_index: 0,
            status: 'active',
            step_history: [],
            metadata: { enrolled_via: testMode ? 'test' : 'execution' }
          })
          .select()
          .single();

        if (enrollError) throw enrollError;

        // Execute first step if not a trigger/wait
        if (elements.length > 0) {
          const firstStep = elements[0];
          
          // Skip trigger element
          const startIndex = firstStep.type === 'trigger' ? 1 : 0;
          
          if (elements[startIndex]) {
            const stepResult = await executeStep(supabase, enrollment, elements[startIndex], lead, testMode);
            
            // Log step execution
            await supabase.from('workflow_step_executions').insert({
              enrollment_id: enrollment.id,
              step_index: startIndex,
              step_type: elements[startIndex].type,
              step_config: elements[startIndex].config || {},
              status: stepResult.success ? 'completed' : 'failed',
              started_at: new Date().toISOString(),
              completed_at: new Date().toISOString(),
              result: stepResult.result || {},
              error_message: stepResult.error
            });

            // Update enrollment step if successful
            if (stepResult.success) {
              await supabase
                .from('workflow_enrollments')
                .update({
                  current_step_index: startIndex + 1,
                  step_history: [{
                    step_index: startIndex,
                    step_type: elements[startIndex].type,
                    completed_at: new Date().toISOString(),
                    result: stepResult.result
                  }]
                })
                .eq('id', enrollment.id);
            }
          }
        }

        results.enrolled++;
        results.details.push({ leadId: lead.id, status: 'enrolled', enrollmentId: enrollment.id });

      } catch (error: any) {
        console.error(`Error processing lead ${lead.id}:`, error);
        results.failed++;
        results.details.push({ leadId: lead.id, status: 'failed', error: error.message });
      }
    }

    // Update workflow execution stats
    const currentStats = (workflow.execution_stats as any) || { total_enrolled: 0, completed: 0, active: 0, exited: 0 };
    await supabase
      .from('plays')
      .update({
        execution_stats: {
          ...currentStats,
          total_enrolled: (currentStats.total_enrolled || 0) + results.enrolled,
          active: (currentStats.active || 0) + results.enrolled,
          last_executed_at: new Date().toISOString()
        }
      })
      .eq('id', workflowId);

    console.log(`Workflow execution complete:`, results);

    return new Response(JSON.stringify(results), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });

  } catch (error: any) {
    console.error('Error executing workflow:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
});

async function executeStep(supabase: any, enrollment: any, step: any, lead: any, testMode: boolean) {
  const stepType = step.type;
  const config = step.config || {};

  console.log(`Executing step ${stepType} for lead ${lead.id}. Test mode: ${testMode}`);

  try {
    switch (stepType) {
      case 'email':
        return await executeEmailStep(supabase, config, lead, testMode);
      case 'sms':
        return await executeSmsStep(supabase, config, lead, testMode);
      case 'wait':
        return await executeWaitStep(supabase, enrollment.id, config);
      case 'update-lead':
        return await executeUpdateLeadStep(supabase, config, lead, testMode);
      case 'create-task':
        return await executeCreateTaskStep(supabase, config, lead, enrollment.user_id, testMode);
      case 'assign-advisor':
        return await executeAssignAdvisorStep(supabase, config, lead, testMode);
      case 'internal-notification':
        return await executeNotificationStep(supabase, config, lead, enrollment.user_id, testMode);
      case 'end-workflow':
        await supabase
          .from('workflow_enrollments')
          .update({
            status: 'completed',
            completed_at: new Date().toISOString(),
            exit_reason: config.reason || 'completed'
          })
          .eq('id', enrollment.id);
        return { success: true, result: { status: 'completed' } };
      default:
        return { success: true, result: { skipped: true, reason: `Step type ${stepType} not implemented` } };
    }
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

async function executeEmailStep(supabase: any, config: any, lead: any, testMode: boolean) {
  const subject = personalizeContent(config.subject || '', lead);
  const content = personalizeContent(config.content || '', lead);

  if (testMode) {
    console.log(`[TEST MODE] Would send email to ${lead.email}: ${subject}`);
    return { success: true, result: { test_mode: true, to: lead.email, subject } };
  }

  if (!resendApiKey) {
    throw new Error('RESEND_API_KEY not configured');
  }

  const resend = new Resend(resendApiKey);
  const emailResponse = await resend.emails.send({
    from: `${config.fromName || 'Notifications'} <${config.fromEmail || 'onboarding@resend.dev'}>`,
    to: [lead.email],
    subject: subject,
    html: content,
    reply_to: config.replyTo || undefined
  });

  // Log communication
  await supabase.from('lead_communications').insert({
    lead_id: lead.id,
    type: 'email',
    direction: 'outbound',
    subject: subject,
    content: content,
    status: 'sent',
    user_id: lead.user_id
  });

  return { success: true, result: emailResponse };
}

async function executeSmsStep(supabase: any, config: any, lead: any, testMode: boolean) {
  if (!lead.phone) {
    return { success: false, error: 'Lead has no phone number' };
  }

  let content = personalizeContent(config.content || '', lead);
  if (config.includeOptOut) {
    content += `\n\n${config.optOutMessage || 'Reply STOP to unsubscribe'}`;
  }

  if (testMode) {
    console.log(`[TEST MODE] Would send SMS to ${lead.phone}: ${content}`);
    return { success: true, result: { test_mode: true, to: lead.phone, content } };
  }

  if (!twilioAccountSid || !twilioAuthToken || !twilioPhoneNumber) {
    throw new Error('Twilio credentials not configured');
  }

  const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`;
  const response = await fetch(twilioUrl, {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + btoa(`${twilioAccountSid}:${twilioAuthToken}`),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      To: lead.phone,
      From: twilioPhoneNumber,
      Body: content,
    }),
  });

  const result = await response.json();

  // Log communication
  await supabase.from('lead_communications').insert({
    lead_id: lead.id,
    type: 'sms',
    direction: 'outbound',
    content: content,
    status: 'sent',
    user_id: lead.user_id
  });

  return { success: true, result };
}

async function executeWaitStep(supabase: any, enrollmentId: string, config: any) {
  const waitTime = config.waitTime || { value: 1, unit: 'days' };
  const now = new Date();
  let resumeAt: Date;

  switch (waitTime.unit) {
    case 'minutes':
      resumeAt = new Date(now.getTime() + waitTime.value * 60 * 1000);
      break;
    case 'hours':
      resumeAt = new Date(now.getTime() + waitTime.value * 60 * 60 * 1000);
      break;
    case 'weeks':
      resumeAt = new Date(now.getTime() + waitTime.value * 7 * 24 * 60 * 60 * 1000);
      break;
    default: // days
      resumeAt = new Date(now.getTime() + waitTime.value * 24 * 60 * 60 * 1000);
  }

  await supabase
    .from('workflow_enrollments')
    .update({ next_step_scheduled_at: resumeAt.toISOString() })
    .eq('id', enrollmentId);

  return { success: true, result: { scheduled_for: resumeAt.toISOString() } };
}

async function executeUpdateLeadStep(supabase: any, config: any, lead: any, testMode: boolean) {
  const updates: any = {};

  switch (config.updateType) {
    case 'status':
      updates.status = config.newStatus;
      break;
    case 'tags':
      const currentTags = lead.tags || [];
      const newTags = config.tags ? config.tags.split(',').map((t: string) => t.trim()) : [];
      if (config.tagsAction === 'add') {
        updates.tags = [...new Set([...currentTags, ...newTags])];
      } else if (config.tagsAction === 'remove') {
        updates.tags = currentTags.filter((t: string) => !newTags.includes(t));
      } else {
        updates.tags = newTags;
      }
      break;
    case 'score':
      updates.lead_score = (lead.lead_score || 0) + (config.scoreChange || 0);
      break;
    case 'priority':
      updates.priority = config.priority;
      break;
    case 'program':
      updates.program_interest = config.programInterest;
      break;
  }

  if (testMode) {
    console.log(`[TEST MODE] Would update lead ${lead.id}:`, updates);
    return { success: true, result: { test_mode: true, updates } };
  }

  const { error } = await supabase
    .from('leads')
    .update(updates)
    .eq('id', lead.id);

  if (error) throw error;
  return { success: true, result: updates };
}

async function executeCreateTaskStep(supabase: any, config: any, lead: any, userId: string, testMode: boolean) {
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + (config.dueInDays || 1));

  const taskTitle = personalizeContent(config.taskTitle || '', lead);
  const taskDescription = personalizeContent(config.taskDescription || '', lead);

  let assignee = userId;
  if (config.assignTo === 'lead_advisor' && lead.assigned_to) {
    assignee = lead.assigned_to;
  } else if (config.assignTo === 'specific' && config.specificAssignee) {
    assignee = config.specificAssignee;
  }

  if (testMode) {
    console.log(`[TEST MODE] Would create task: ${taskTitle}`);
    return { success: true, result: { test_mode: true, title: taskTitle, assignee } };
  }

  const { data, error } = await supabase.from('lead_tasks').insert({
    lead_id: lead.id,
    title: taskTitle,
    description: taskDescription,
    task_type: config.taskType || 'follow_up',
    priority: config.priority || 'medium',
    due_date: dueDate.toISOString(),
    assigned_to: assignee,
    status: 'pending',
    user_id: userId
  }).select().single();

  if (error) throw error;
  return { success: true, result: data };
}

async function executeAssignAdvisorStep(supabase: any, config: any, lead: any, testMode: boolean) {
  let advisorId: string | null = null;

  if (config.assignmentMethod === 'specific') {
    advisorId = config.specificAdvisorId;
  } else {
    // Use round robin or load balanced
    const { data: advisors } = await supabase
      .from('advisor_performance')
      .select('advisor_id, current_weekly_assignments, capacity_per_week')
      .eq('routing_enabled', true)
      .order('current_weekly_assignments', { ascending: true })
      .limit(1);

    if (advisors && advisors.length > 0) {
      advisorId = advisors[0].advisor_id;
    }
  }

  if (!advisorId) {
    return { success: false, error: 'No available advisor found' };
  }

  if (testMode) {
    console.log(`[TEST MODE] Would assign lead ${lead.id} to advisor ${advisorId}`);
    return { success: true, result: { test_mode: true, advisor_id: advisorId } };
  }

  const { error } = await supabase
    .from('leads')
    .update({
      assigned_to: advisorId,
      assigned_at: new Date().toISOString()
    })
    .eq('id', lead.id);

  if (error) throw error;

  // Notify advisor
  if (config.notifyAdvisor) {
    await supabase.from('notifications').insert({
      user_id: advisorId,
      type: 'lead_assigned',
      title: 'New Lead Assigned',
      message: `You have been assigned a new lead: ${lead.first_name} ${lead.last_name}`,
      data: { lead_id: lead.id }
    });
  }

  return { success: true, result: { assigned_to: advisorId } };
}

async function executeNotificationStep(supabase: any, config: any, lead: any, userId: string, testMode: boolean) {
  const message = personalizeContent(config.message || '', lead);
  let recipients: string[] = [];

  if (config.recipientType === 'lead_advisor' && lead.assigned_to) {
    recipients = [lead.assigned_to];
  } else if (config.recipientType === 'specific') {
    recipients = config.specificRecipients ? config.specificRecipients.split(',').map((r: string) => r.trim()) : [];
  }

  if (testMode) {
    console.log(`[TEST MODE] Would notify ${recipients.length} recipients`);
    return { success: true, result: { test_mode: true, recipients: recipients.length } };
  }

  for (const recipientId of recipients) {
    await supabase.from('notifications').insert({
      user_id: recipientId,
      type: 'workflow_notification',
      title: config.subject,
      message: message,
      data: {
        lead_id: lead.id,
        priority: config.priority,
        action_url: config.actionUrl
      }
    });
  }

  return { success: true, result: { notified: recipients.length } };
}

function personalizeContent(content: string, lead: any): string {
  if (!content) return '';
  
  return content
    .replace(/\{\{firstName\}\}/g, lead.first_name || '')
    .replace(/\{\{lastName\}\}/g, lead.last_name || '')
    .replace(/\{\{email\}\}/g, lead.email || '')
    .replace(/\{\{phone\}\}/g, lead.phone || '')
    .replace(/\{\{leadName\}\}/g, `${lead.first_name || ''} ${lead.last_name || ''}`.trim())
    .replace(/\{\{programName\}\}/g, lead.program_interest || '')
    .replace(/\{\{city\}\}/g, lead.city || '')
    .replace(/\{\{country\}\}/g, lead.country || '')
    .replace(/\{\{leadId\}\}/g, lead.id || '');
}
