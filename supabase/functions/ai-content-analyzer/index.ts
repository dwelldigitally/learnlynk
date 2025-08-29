import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AnalysisRequest {
  content: Array<{
    url: string;
    title: string;
    content: string;
    extracted?: any;
  }>;
  analysis_type: 'educational_institution';
  extract_programs?: boolean;
  extract_forms?: boolean;
}

interface AnalysisResult {
  institution: {
    name: string;
    description: string;
    website: string;
    phone?: string;
    email?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    logo_url?: string;
    primary_color?: string;
    founded_year?: number;
    employee_count?: number;
  };
  programs: Array<{
    name: string;
    code?: string;
    description: string;
    type: string;
    duration: string;
    delivery_method: string;
    campus: string[];
    entry_requirements: Array<{
      type: string;
      title: string;
      description: string;
      mandatory: boolean;
    }>;
    document_requirements: Array<{
      name: string;
      description: string;
      mandatory: boolean;
      accepted_formats: string[];
    }>;
    fee_structure: {
      domestic_fees: Array<{
        type: string;
        amount: number;
        currency: string;
        description?: string;
      }>;
      international_fees: Array<{
        type: string;
        amount: number;
        currency: string;
        description?: string;
      }>;
    };
    intake_dates: string[];
    application_deadline?: string;
    category: string;
    status: string;
    url?: string;
  }>;
  forms: Array<{
    title: string;
    description: string;
    fields: Array<{
      id: string;
      label: string;
      type: string;
      required: boolean;
      options?: Array<{ label: string; value: string }>;
      validation?: any[];
    }>;
    program_association?: string;
    url?: string;
  }>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { content, analysis_type, extract_programs = true, extract_forms = true }: AnalysisRequest = await req.json();
    
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Combine all content for analysis
    const combinedContent = content.map(page => `
      URL: ${page.url}
      Title: ${page.title}
      Content: ${page.content}
      ${page.extracted ? `Extracted Data: ${JSON.stringify(page.extracted, null, 2)}` : ''}
    `).join('\n\n---PAGE BREAK---\n\n');

    const systemPrompt = `You are an expert educational institution data analyst. Your task is to analyze website content and extract comprehensive information about the institution and its programs.

CRITICAL INSTRUCTIONS:
1. Extract ALL programs/courses/degrees mentioned across all pages
2. For each program, extract comprehensive details including fees, requirements, and deadlines
3. Map HTML form fields to appropriate types (text, email, select, radio, checkbox, etc.)
4. Be thorough and accurate - this data will populate an enrollment management system
5. Return ONLY valid JSON with no additional text or explanations

For programs, map to these types:
- certificate, diploma, degree, short-course, workshop, online-course

For delivery methods:
- in-person, online, hybrid

For form field types, use these exact values:
- text, email, tel, number, textarea, select, radio, checkbox, multi-select, date, file, url

You must return a JSON object with this exact structure:`;

    const prompt = `${systemPrompt}

{
  "institution": {
    "name": "string - Institution name",
    "description": "string - Mission/about description", 
    "website": "string - Main website URL",
    "phone": "string - Main phone number",
    "email": "string - Main contact email",
    "address": "string - Physical address",
    "city": "string - City",
    "state": "string - State/Province", 
    "country": "string - Country",
    "logo_url": "string - Logo image URL if found",
    "primary_color": "string - Brand color if identifiable",
    "founded_year": "number - Year founded if mentioned",
    "employee_count": "number - Staff count if mentioned"
  },
  "programs": [
    {
      "name": "string - Program name",
      "code": "string - Program code if available",
      "description": "string - Program description",
      "type": "certificate|diploma|degree|short-course|workshop|online-course",
      "duration": "string - Program duration (e.g., '6 months', '2 years')",
      "delivery_method": "in-person|online|hybrid",
      "campus": ["array of campus locations"],
      "entry_requirements": [
        {
          "type": "academic|language|experience|health|age|other",
          "title": "string - Requirement title",
          "description": "string - Detailed description",
          "mandatory": "boolean"
        }
      ],
      "document_requirements": [
        {
          "name": "string - Document name",
          "description": "string - Document description", 
          "mandatory": "boolean",
          "accepted_formats": ["PDF", "DOC", "JPG"]
        }
      ],
      "fee_structure": {
        "domestic_fees": [
          {
            "type": "tuition|application|registration|lab|materials|other",
            "amount": "number - Fee amount",
            "currency": "CAD|USD|EUR|GBP|AUD",
            "description": "string - Fee description"
          }
        ],
        "international_fees": [
          {
            "type": "tuition|application|registration|lab|materials|other", 
            "amount": "number - Fee amount",
            "currency": "CAD|USD|EUR|GBP|AUD",
            "description": "string - Fee description"
          }
        ]
      },
      "intake_dates": ["array of intake dates"],
      "application_deadline": "string - Application deadline",
      "category": "string - Program category",
      "status": "active|inactive|draft",
      "url": "string - Program page URL"
    }
  ],
  "forms": [
    {
      "title": "string - Form title",
      "description": "string - Form description",
      "fields": [
        {
          "id": "string - Field identifier",
          "label": "string - Field label",
          "type": "text|email|tel|number|textarea|select|radio|checkbox|multi-select|date|file|url",
          "required": "boolean",
          "options": [{"label": "string", "value": "string"}],
          "validation": ["array of validation rules"]
        }
      ],
      "program_association": "string - Associated program if applicable",
      "url": "string - Form page URL"
    }
  ]
}

Analyze this educational institution website content and extract ALL available information:

${combinedContent}`;

    console.log('Sending request to OpenAI with prompt length:', prompt.length);
    console.log('OpenAI API key available:', !!openAIApiKey);
    
    const requestBody = {
      model: 'gpt-5-2025-08-07',
      messages: [
        {
          role: 'system',
          content: 'You are an expert educational institution data analyst. Return only valid JSON with comprehensive program and institution data.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_completion_tokens: 4000
    };

    console.log('OpenAI request body (without content):', {
      model: requestBody.model,
      messages: requestBody.messages.map(m => ({ role: m.role, content_length: m.content.length })),
      max_completion_tokens: requestBody.max_completion_tokens
    });

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('OpenAI response status:', response.status);
    console.log('OpenAI response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error details:', {
        status: response.status,
        statusText: response.statusText,
        errorBody: errorText
      });
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const analysisText = data.choices[0].message.content;

    console.log('Raw AI analysis:', analysisText);

    // Parse the JSON response
    let analysisResult: AnalysisResult;
    try {
      // Extract JSON from the response (in case there's extra text)
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : analysisText;
      analysisResult = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      console.error('AI response was:', analysisText);
      
      // Fallback: create a basic structure
      analysisResult = {
        institution: {
          name: new URL(content[0]?.url || 'https://example.com').hostname.replace('www.', ''),
          description: 'Educational institution',
          website: content[0]?.url || ''
        },
        programs: [],
        forms: []
      };
    }

    // Validate and clean the data
    if (!analysisResult.institution) {
      analysisResult.institution = {
        name: 'Unknown Institution',
        description: '',
        website: content[0]?.url || ''
      };
    }

    if (!Array.isArray(analysisResult.programs)) {
      analysisResult.programs = [];
    }

    if (!Array.isArray(analysisResult.forms)) {
      analysisResult.forms = [];
    }

    // Ensure each program has required fields
    analysisResult.programs = analysisResult.programs.map(program => ({
      name: program.name || 'Untitled Program',
      code: program.code || '',
      description: program.description || '',
      type: program.type || 'certificate',
      duration: program.duration || '1 year',
      delivery_method: program.delivery_method || 'in-person',
      campus: Array.isArray(program.campus) ? program.campus : ['Main Campus'],
      entry_requirements: Array.isArray(program.entry_requirements) ? program.entry_requirements : [],
      document_requirements: Array.isArray(program.document_requirements) ? program.document_requirements : [],
      fee_structure: program.fee_structure || { domestic_fees: [], international_fees: [] },
      intake_dates: Array.isArray(program.intake_dates) ? program.intake_dates : [],
      application_deadline: program.application_deadline || '',
      category: program.category || 'General',
      status: program.status || 'active',
      url: program.url || ''
    }));

    console.log(`Successfully analyzed content and found ${analysisResult.programs.length} programs and ${analysisResult.forms.length} forms`);

    return new Response(JSON.stringify(analysisResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('AI content analysis error:', error);
    return new Response(
      JSON.stringify({
        error: error.message,
        institution: null,
        programs: [],
        forms: []
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});