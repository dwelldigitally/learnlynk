import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SendSMSRequest {
  leadId: string;
  phoneNumber: string;
  leadName: string;
  message: string;
  messageType: 'nurture' | 'follow_up' | 'reminder' | 'ai_generated' | 'reengagement';
  metadata?: any;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { 
      status: 405,
      headers: corsHeaders 
    })
  }

  try {
    console.log("Send SMS function called - v3.0 with environment debugging")
    
    // Debug: Log all available environment variables (without values for security)
    console.log("Available environment variables:", Object.keys(Deno.env.toObject()))
    
    // Check if Twilio credentials are configured
    const twilioAccountSid = Deno.env.get("TWILIO_ACCOUNT_SID")
    const twilioAuthToken = Deno.env.get("TWILIO_AUTH_TOKEN")
    const twilioPhoneNumber = Deno.env.get("TWILIO_PHONE_NUMBER")
    
    // Debug: Log which credentials are found (without showing actual values)
    console.log("Twilio credential status:", {
      accountSid: !!twilioAccountSid,
      authToken: !!twilioAuthToken,
      phoneNumber: !!twilioPhoneNumber
    })
    
    if (!twilioAccountSid || !twilioAuthToken || !twilioPhoneNumber) {
      console.error("Twilio credentials not configured")
      return new Response(
        JSON.stringify({ error: "SMS service not configured" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      )
    }

    const { 
      leadId, 
      phoneNumber, 
      leadName, 
      message, 
      messageType,
      metadata 
    }: SendSMSRequest = await req.json()

    console.log("Sending SMS to:", phoneNumber, "Type:", messageType)

    // Validate required fields
    if (!phoneNumber || !phoneNumber.trim()) {
      console.error("Phone number is missing or empty")
      return new Response(
        JSON.stringify({ error: "Phone number is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      )
    }

    if (!message || !message.trim()) {
      console.error("Message is missing or empty")
      return new Response(
        JSON.stringify({ error: "Message content is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      )
    }

    // Format phone number (ensure it starts with +)
    let formattedPhone = phoneNumber.trim()
    if (!formattedPhone.startsWith('+')) {
      // Default to US format if no country code
      formattedPhone = '+1' + formattedPhone.replace(/[^\d]/g, '')
    }

    // Create Twilio API URL
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`
    
    // Prepare the request body for Twilio
    const twilioBody = new URLSearchParams({
      From: twilioPhoneNumber,
      To: formattedPhone,
      Body: message
    })

    // Create authorization header
    const auth = btoa(`${twilioAccountSid}:${twilioAuthToken}`)

    console.log("Sending SMS via Twilio API")

    // Send SMS via Twilio
    const twilioResponse = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: twilioBody
    })

    const twilioData = await twilioResponse.json()

    if (!twilioResponse.ok) {
      console.error("Twilio error:", twilioData)
      throw new Error(twilioData.message || "Failed to send SMS")
    }

    console.log("SMS sent successfully:", twilioData.sid)

    return new Response(
      JSON.stringify({ 
        success: true, 
        messageId: twilioData.sid,
        leadId,
        messageType,
        sentAt: new Date().toISOString(),
        cost: twilioData.price || null,
        status: twilioData.status
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    )
  } catch (error) {
    console.error("Error in send-sms function:", error)
    return new Response(
      JSON.stringify({ 
        error: error.message || "Failed to send SMS" 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    )
  }
})