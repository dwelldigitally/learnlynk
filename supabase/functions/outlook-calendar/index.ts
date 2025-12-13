import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CalendarRequest {
  action: 'create-event' | 'update-event' | 'delete-event' | 'get-free-busy' | 'sync-events';
  eventId?: string;
  microsoftEventId?: string;
  event?: {
    title: string;
    description?: string;
    startTime: string;
    endTime: string;
    location?: string;
    attendees?: string[];
    isOnlineMeeting?: boolean;
    leadId?: string;
  };
  freeBusy?: {
    schedules: string[];
    startTime: string;
    endTime: string;
  };
  syncOptions?: {
    since?: string;
    top?: number;
  };
}

async function getValidAccessToken(supabaseUrl: string, userId: string, authHeader: string): Promise<{ accessToken: string; email: string }> {
  const response = await fetch(`${supabaseUrl}/functions/v1/outlook-auth`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': authHeader,
    },
    body: JSON.stringify({ action: 'get-valid-token', userId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to get valid access token');
  }

  return response.json();
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const authHeader = req.headers.get('Authorization')!;
    
    const supabaseClient = createClient(
      supabaseUrl,
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const requestBody: CalendarRequest = await req.json();
    const { action, eventId, microsoftEventId, event, freeBusy, syncOptions } = requestBody;

    // Get valid access token
    const { accessToken, email: userEmail } = await getValidAccessToken(supabaseUrl, user.id, authHeader);

    // Get tenant_id
    const { data: tenantUser } = await supabaseClient
      .from('tenant_users')
      .select('tenant_id')
      .eq('user_id', user.id)
      .eq('is_primary', true)
      .single();

    const tenantId = tenantUser?.tenant_id;

    if (action === 'get-free-busy') {
      if (!freeBusy) {
        throw new Error('freeBusy parameters are required');
      }

      const scheduleResponse = await fetch(
        'https://graph.microsoft.com/v1.0/me/calendar/getSchedule',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            schedules: freeBusy.schedules,
            startTime: {
              dateTime: freeBusy.startTime,
              timeZone: 'UTC',
            },
            endTime: {
              dateTime: freeBusy.endTime,
              timeZone: 'UTC',
            },
            availabilityViewInterval: 30, // 30-minute intervals
          }),
        }
      );

      if (!scheduleResponse.ok) {
        const errorText = await scheduleResponse.text();
        throw new Error(`Failed to get free/busy: ${errorText}`);
      }

      const scheduleData = await scheduleResponse.json();

      return new Response(
        JSON.stringify({ success: true, schedules: scheduleData.value }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    if (action === 'create-event') {
      if (!event) {
        throw new Error('event data is required');
      }

      const graphEvent: any = {
        subject: event.title,
        body: {
          contentType: 'HTML',
          content: event.description || '',
        },
        start: {
          dateTime: event.startTime,
          timeZone: 'UTC',
        },
        end: {
          dateTime: event.endTime,
          timeZone: 'UTC',
        },
      };

      if (event.location) {
        graphEvent.location = { displayName: event.location };
      }

      if (event.attendees?.length) {
        graphEvent.attendees = event.attendees.map(email => ({
          emailAddress: { address: email },
          type: 'required',
        }));
      }

      if (event.isOnlineMeeting) {
        graphEvent.isOnlineMeeting = true;
        graphEvent.onlineMeetingProvider = 'teamsForBusiness';
      }

      const createResponse = await fetch(
        'https://graph.microsoft.com/v1.0/me/events',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(graphEvent),
        }
      );

      if (!createResponse.ok) {
        const errorText = await createResponse.text();
        throw new Error(`Failed to create event: ${errorText}`);
      }

      const createdEvent = await createResponse.json();

      // Save to LearnLynk calendar_events table
      const { data: savedEvent, error: saveError } = await supabaseClient
        .from('calendar_events')
        .insert({
          tenant_id: tenantId,
          user_id: user.id,
          lead_id: event.leadId || null,
          title: event.title,
          description: event.description,
          start_time: event.startTime,
          end_time: event.endTime,
          location_details: event.location,
          location_type: event.isOnlineMeeting ? 'online' : 'in_person',
          meeting_link: createdEvent.onlineMeeting?.joinUrl,
          meeting_platform: event.isOnlineMeeting ? 'teams' : null,
          attendees: event.attendees?.map(email => ({ email })),
          microsoft_event_id: createdEvent.id,
          microsoft_change_key: createdEvent.changeKey,
          sync_status: 'synced',
          sync_direction: 'to_outlook',
          last_synced_at: new Date().toISOString(),
          type: 'meeting',
          status: 'scheduled',
        })
        .select()
        .single();

      if (saveError) {
        console.error('Failed to save event locally:', saveError);
      }

      // Log activity if lead_id was provided
      if (event.leadId) {
        await supabaseClient
          .from('lead_activity_logs')
          .insert({
            tenant_id: tenantId,
            lead_id: event.leadId,
            user_id: user.id,
            action_type: 'meeting_scheduled',
            action_category: 'calendar',
            description: `Meeting scheduled: ${event.title}`,
            new_value: JSON.stringify({ 
              title: event.title, 
              startTime: event.startTime,
              attendees: event.attendees,
              syncedToOutlook: true,
            }),
          });
      }

      console.log('Created event in Outlook:', createdEvent.id);

      return new Response(
        JSON.stringify({
          success: true,
          event: savedEvent,
          microsoftEventId: createdEvent.id,
          onlineMeetingUrl: createdEvent.onlineMeeting?.joinUrl,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    if (action === 'update-event') {
      if (!microsoftEventId || !event) {
        throw new Error('microsoftEventId and event data are required');
      }

      const graphEvent: any = {
        subject: event.title,
        body: {
          contentType: 'HTML',
          content: event.description || '',
        },
        start: {
          dateTime: event.startTime,
          timeZone: 'UTC',
        },
        end: {
          dateTime: event.endTime,
          timeZone: 'UTC',
        },
      };

      if (event.location) {
        graphEvent.location = { displayName: event.location };
      }

      if (event.attendees?.length) {
        graphEvent.attendees = event.attendees.map(email => ({
          emailAddress: { address: email },
          type: 'required',
        }));
      }

      const updateResponse = await fetch(
        `https://graph.microsoft.com/v1.0/me/events/${microsoftEventId}`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(graphEvent),
        }
      );

      if (!updateResponse.ok) {
        const errorText = await updateResponse.text();
        throw new Error(`Failed to update event: ${errorText}`);
      }

      const updatedEvent = await updateResponse.json();

      // Update local calendar_events table
      if (eventId) {
        await supabaseClient
          .from('calendar_events')
          .update({
            title: event.title,
            description: event.description,
            start_time: event.startTime,
            end_time: event.endTime,
            location_details: event.location,
            attendees: event.attendees?.map(email => ({ email })),
            microsoft_change_key: updatedEvent.changeKey,
            last_synced_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('id', eventId);
      }

      console.log('Updated event in Outlook:', microsoftEventId);

      return new Response(
        JSON.stringify({ success: true, microsoftEventId: updatedEvent.id }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    if (action === 'delete-event') {
      if (!microsoftEventId) {
        throw new Error('microsoftEventId is required');
      }

      const deleteResponse = await fetch(
        `https://graph.microsoft.com/v1.0/me/events/${microsoftEventId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (!deleteResponse.ok && deleteResponse.status !== 404) {
        const errorText = await deleteResponse.text();
        throw new Error(`Failed to delete event: ${errorText}`);
      }

      // Update local calendar_events table
      if (eventId) {
        await supabaseClient
          .from('calendar_events')
          .update({
            status: 'cancelled',
            sync_status: 'synced',
            last_synced_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('id', eventId);
      }

      console.log('Deleted event from Outlook:', microsoftEventId);

      return new Response(
        JSON.stringify({ success: true, deleted: microsoftEventId }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    if (action === 'sync-events') {
      const { since, top = 50 } = syncOptions || {};

      let graphUrl = 'https://graph.microsoft.com/v1.0/me/events';
      const queryParams: string[] = [];
      queryParams.push(`$top=${top}`);
      queryParams.push('$orderby=start/dateTime desc');
      queryParams.push('$select=id,subject,body,start,end,location,attendees,organizer,isOnlineMeeting,onlineMeeting,changeKey');

      if (since) {
        queryParams.push(`$filter=start/dateTime ge '${since}'`);
      }

      graphUrl += '?' + queryParams.join('&');

      const eventsResponse = await fetch(graphUrl, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!eventsResponse.ok) {
        const errorText = await eventsResponse.text();
        throw new Error(`Failed to sync events: ${errorText}`);
      }

      const eventsData = await eventsResponse.json();
      const events = eventsData.value || [];

      console.log(`Fetched ${events.length} events from Outlook`);

      const syncedEvents: any[] = [];

      for (const msEvent of events) {
        // Check if already synced
        const { data: existingEvent } = await supabaseClient
          .from('calendar_events')
          .select('id, microsoft_change_key')
          .eq('microsoft_event_id', msEvent.id)
          .single();

        if (existingEvent) {
          // Update if change key is different
          if (existingEvent.microsoft_change_key !== msEvent.changeKey) {
            await supabaseClient
              .from('calendar_events')
              .update({
                title: msEvent.subject,
                description: msEvent.body?.content,
                start_time: msEvent.start?.dateTime,
                end_time: msEvent.end?.dateTime,
                location_details: msEvent.location?.displayName,
                microsoft_change_key: msEvent.changeKey,
                last_synced_at: new Date().toISOString(),
              })
              .eq('id', existingEvent.id);
          }
          syncedEvents.push({ id: existingEvent.id, status: 'updated' });
          continue;
        }

        // Create new event
        const { data: newEvent, error: insertError } = await supabaseClient
          .from('calendar_events')
          .insert({
            tenant_id: tenantId,
            user_id: user.id,
            title: msEvent.subject,
            description: msEvent.body?.content,
            start_time: msEvent.start?.dateTime,
            end_time: msEvent.end?.dateTime,
            location_details: msEvent.location?.displayName,
            location_type: msEvent.isOnlineMeeting ? 'online' : 'in_person',
            meeting_link: msEvent.onlineMeeting?.joinUrl,
            meeting_platform: msEvent.isOnlineMeeting ? 'teams' : null,
            attendees: msEvent.attendees?.map((a: any) => ({ email: a.emailAddress?.address })),
            microsoft_event_id: msEvent.id,
            microsoft_change_key: msEvent.changeKey,
            sync_status: 'synced',
            sync_direction: 'from_outlook',
            last_synced_at: new Date().toISOString(),
            type: 'meeting',
            status: 'scheduled',
          })
          .select()
          .single();

        if (!insertError) {
          syncedEvents.push({ id: newEvent.id, status: 'created' });
        }
      }

      return new Response(
        JSON.stringify({
          success: true,
          totalFetched: events.length,
          syncedEvents,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    throw new Error('Invalid action');

  } catch (error) {
    console.error('Error in outlook-calendar function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }
});
