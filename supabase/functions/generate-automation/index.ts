import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const AVAILABLE_ACTIONS = `
AVAILABLE WORKFLOW ACTIONS:
1. trigger - Starting point with conditions (REQUIRED as first element)
   - triggerEvent: 'lead_created' | 'lead_updated' | 'status_changed' | 'score_changed' | 'tag_added' | 'document_uploaded' | 'form_submitted' | 'manual'
   - conditionGroups: Array of condition groups with AND/OR logic

2. email - Send personalized email
   - subject: Email subject line (supports {{variables}})
   - content: Email body (supports {{first_name}}, {{last_name}}, {{email}}, {{program}}, {{company_name}})
   - fromName: Sender name (optional)
   - trackOpens: boolean
   - trackClicks: boolean

3. sms - Send SMS message
   - message: SMS content (max 160 chars recommended, supports {{variables}})
   - includeOptOut: boolean

4. whatsapp - Send WhatsApp message
   - message: Message content
   - templateId: Template ID (optional)

5. wait - Delay execution
   - waitType: 'duration' | 'until_date' | 'until_event'
   - waitTime: { value: number, unit: 'minutes' | 'hours' | 'days' | 'weeks' }

6. condition - Branch based on criteria
   - conditionType: 'if_else' | 'switch'
   - conditions: Array of condition objects
   - field, operator, value for each condition

7. update-lead - Modify lead properties
   - updateType: 'status' | 'tags' | 'score' | 'priority' | 'custom_field'
   - newStatus: Lead status value
   - tagsToAdd/tagsToRemove: Array of tag strings
   - scoreChange: number (positive or negative)
   - newPriority: 'low' | 'medium' | 'high' | 'urgent'

8. assign-advisor - Route lead to team member
   - assignmentType: 'specific' | 'round_robin' | 'by_program' | 'by_location'
   - advisorId: UUID (for specific assignment)
   - teamId: UUID (for team-based)

9. create-task - Create follow-up task
   - taskTitle: Task name
   - taskDescription: Detailed description
   - dueInDays: number
   - priority: 'low' | 'medium' | 'high'
   - assignToLeadOwner: boolean

10. internal-notification - Alert team members
    - notificationType: 'email' | 'in_app' | 'both'
    - recipients: 'lead_owner' | 'team' | 'specific'
    - message: Notification content

11. change-enrollment-stage - Move lead through journey
    - stageAction: 'advance' | 'set_specific' | 'regress'
    - targetStage: Stage name or ID

12. webhook - Call external API
    - url: Webhook URL
    - method: 'GET' | 'POST' | 'PUT'
    - headers: Object
    - payload: JSON payload

13. add-to-list - Add lead to marketing list
    - listId: List identifier
    - listName: List name

14. split - A/B test different paths
    - splitType: 'percentage' | 'random'
    - variants: Array of variant objects with percentage

15. end - End workflow execution
    - endReason: Reason for ending
`;

const TRIGGER_CONDITIONS = `
TRIGGER CONDITIONS (use in trigger element's conditionGroups):
Lead Properties:
- status: equals, not_equals (values: new, contacted, qualified, converted, lost)
- lead_score: greater_than, less_than, equals, between (numeric)
- ai_score: greater_than, less_than, equals (numeric 0-100)
- priority: equals, not_equals (values: low, medium, high, urgent)
- source: equals, not_equals (values: website, referral, social, email, event, webform, forms)
- qualification_stage: equals, not_equals
- student_type: equals (values: domestic, international)

Contact Info:
- country: equals, not_equals, contains
- state: equals, not_equals, contains
- city: equals, not_equals, contains
- email: contains, not_contains, is_empty, is_not_empty

Program Interest:
- program_interest: equals, not_equals, contains
- preferred_intake_id: equals, is_empty, is_not_empty

Engagement:
- tags: contains, not_contains (array values)
- last_contact_date: before, after, between, is_empty
- followup_date: before, after, is_today, is_empty
- created_at: before, after, between, within_last (days)

UTM Tracking:
- utm_source, utm_medium, utm_campaign: equals, contains
`;

const EXAMPLE_WORKFLOWS = `
EXAMPLE OUTPUT FORMAT:
{
  "name": "Welcome Sequence",
  "description": "Automated welcome flow for new leads",
  "elements": [
    {
      "id": "trigger-1",
      "type": "trigger",
      "title": "When new lead is created",
      "position": { "x": 0, "y": 0 },
      "config": {
        "triggerEvent": "lead_created"
      },
      "conditionGroups": [
        {
          "operator": "AND",
          "conditions": [
            { "field": "source", "operator": "equals", "value": "website" }
          ]
        }
      ]
    },
    {
      "id": "email-1",
      "type": "email",
      "title": "Send Welcome Email",
      "position": { "x": 0, "y": 100 },
      "config": {
        "subject": "Welcome to {{company_name}}, {{first_name}}!",
        "content": "Hi {{first_name}},\\n\\nThank you for your interest in our programs. We're excited to help you on your educational journey.\\n\\nBest regards,\\nThe Admissions Team",
        "trackOpens": true,
        "trackClicks": true
      }
    },
    {
      "id": "wait-1",
      "type": "wait",
      "title": "Wait 2 days",
      "position": { "x": 0, "y": 200 },
      "config": {
        "waitType": "duration",
        "waitTime": { "value": 2, "unit": "days" }
      }
    }
  ]
}
`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { description, existingElements } = await req.json();

    if (!description || typeof description !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Description is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!openAIApiKey) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const systemPrompt = `You are an expert automation workflow generator for an enrollment management CRM system.

${AVAILABLE_ACTIONS}

${TRIGGER_CONDITIONS}

${EXAMPLE_WORKFLOWS}

CRITICAL RULES:
1. ALWAYS start with a "trigger" element as the first element
2. Generate unique IDs for each element (format: type-number, e.g., "email-1", "wait-2")
3. Position elements vertically with 100px spacing (y: 0, 100, 200, etc.)
4. Use realistic, professional content for emails and messages
5. Include personalization variables like {{first_name}}, {{program}}, {{company_name}}
6. Keep SMS messages under 160 characters
7. Set appropriate wait times (not too short, not too long)
8. Return ONLY valid JSON, no markdown or explanations
9. The workflow should be practical and achieve the user's goal

${existingElements ? `EXISTING WORKFLOW ELEMENTS (user wants to modify/extend):
${JSON.stringify(existingElements, null, 2)}

If the user wants to add to the existing workflow, keep existing elements and add new ones.
If the user wants to modify, update the relevant elements.` : ''}`;

    const userPrompt = `Generate a complete automation workflow for this request:

"${description}"

Return ONLY the JSON object with name, description, and elements array. No markdown, no code blocks, just pure JSON.`;

    console.log('Generating workflow for:', description);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to generate workflow' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const generatedContent = data.choices[0]?.message?.content;

    if (!generatedContent) {
      return new Response(
        JSON.stringify({ error: 'No content generated' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse the JSON response
    let workflow;
    try {
      // Clean up potential markdown formatting
      let cleanContent = generatedContent.trim();
      if (cleanContent.startsWith('```json')) {
        cleanContent = cleanContent.slice(7);
      }
      if (cleanContent.startsWith('```')) {
        cleanContent = cleanContent.slice(3);
      }
      if (cleanContent.endsWith('```')) {
        cleanContent = cleanContent.slice(0, -3);
      }
      workflow = JSON.parse(cleanContent.trim());
    } catch (parseError) {
      console.error('Failed to parse AI response:', generatedContent);
      return new Response(
        JSON.stringify({ error: 'Failed to parse generated workflow', raw: generatedContent }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate the workflow structure
    if (!workflow.elements || !Array.isArray(workflow.elements)) {
      return new Response(
        JSON.stringify({ error: 'Invalid workflow structure: missing elements array' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Ensure all elements have required fields
    workflow.elements = workflow.elements.map((element: any, index: number) => ({
      id: element.id || `${element.type}-${index + 1}`,
      type: element.type,
      title: element.title || `${element.type} Step`,
      position: element.position || { x: 0, y: index * 100 },
      config: element.config || {},
      ...(element.conditionGroups && { conditionGroups: element.conditionGroups }),
    }));

    console.log('Generated workflow:', workflow.name, 'with', workflow.elements.length, 'elements');

    return new Response(
      JSON.stringify({ 
        success: true, 
        workflow 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-automation:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Unknown error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
