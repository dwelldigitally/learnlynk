import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ScanRequest {
  url: string;
  comprehensive?: boolean;
}

interface ScanResult {
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
  };
  programs: DetectedProgram[];
  applicationForms: DetectedForm[];
  success: boolean;
  pages_scanned: number;
  total_content_length: number;
}

interface DetectedProgram {
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
}

interface DetectedForm {
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
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url, comprehensive = true }: ScanRequest = await req.json();
    
    if (!url) {
      throw new Error('URL is required');
    }

    console.log(`Starting comprehensive scan for: ${url}`);

    // Initialize Firecrawl
    const firecrawlApiKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!firecrawlApiKey) {
      throw new Error('Firecrawl API key not configured. Please add your Firecrawl API key in the Supabase secrets.');
    }

    // Use Firecrawl scrape API for single page scraping (more reliable)
    const scrapeResponse = await fetch('https://api.firecrawl.dev/v0/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${firecrawlApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: url,
        pageOptions: {
          onlyMainContent: true,
          includeHtml: false,
          waitFor: 3000
        },
        extractorOptions: {
          extractionSchema: {
            institution_name: "Extract the institution or college name",
            programs: "Extract all academic programs, courses, degrees, and certificates offered",
            requirements: "Extract admission requirements, prerequisites, and application requirements",
            fees: "Extract tuition fees, costs, application fees, and payment information", 
            contact: "Extract contact information, addresses, phone numbers, and emails",
            about: "Extract information about the institution, mission, vision, and history"
          }
        }
      }),
    });

    if (!scrapeResponse.ok) {
      const errorText = await scrapeResponse.text();
      console.error('Firecrawl API error:', scrapeResponse.status, errorText);
      throw new Error(`Firecrawl API error: ${scrapeResponse.status} - ${errorText}`);
    }

    const scrapeData = await scrapeResponse.json();
    
    if (!scrapeData.success) {
      console.error('Scrape failed:', scrapeData.error);
      throw new Error(`Website scraping failed: ${scrapeData.error || 'Unknown error'}`);
    }

    console.log(`Successfully scraped content from: ${url}`);

    // Prepare content for AI analysis
    const scrapedContent = [{
      url: url,
      title: scrapeData.data?.metadata?.title || 'Website Content',
      content: scrapeData.data?.markdown || scrapeData.data?.content || '',
      extracted: scrapeData.data?.extract || {}
    }];

    console.log(`Content length: ${scrapedContent[0].content.length} characters`);

    // Now analyze with AI
    const analysisResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/ai-content-analyzer`, {
      method: 'POST',
      headers: {
        'Authorization': req.headers.get('Authorization') || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: scrapedContent,
        analysis_type: 'educational_institution',
        extract_programs: true,
        extract_forms: true
      }),
    });

    if (!analysisResponse.ok) {
      const errorText = await analysisResponse.text();
      console.error('AI analysis failed:', analysisResponse.status, errorText);
      throw new Error(`AI analysis failed: ${analysisResponse.status} - ${errorText}`);
    }

    const analysisResult = await analysisResponse.json();
    
    const result: ScanResult = {
      institution: analysisResult.institution || {
        name: new URL(url).hostname.replace('www.', ''),
        description: 'Educational institution',
        website: url,
      },
      programs: analysisResult.programs || [],
      applicationForms: analysisResult.forms || [],
      success: true,
      pages_scanned: 1,
      total_content_length: scrapedContent[0].content.length
    };

    console.log(`Analysis complete. Found ${result.programs.length} programs and ${result.applicationForms.length} forms`);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Website scanning error:', error);
    
    // Provide more specific error messages
    let errorMessage = error.message;
    if (errorMessage.includes('Firecrawl API key not configured')) {
      errorMessage = 'Firecrawl API key is not configured. Please add your Firecrawl API key to the Supabase secrets.';
    } else if (errorMessage.includes('Bad Request') || errorMessage.includes('401')) {
      errorMessage = 'Invalid Firecrawl API key or request. Please check your API key configuration.';
    } else if (errorMessage.includes('429')) {
      errorMessage = 'Firecrawl API rate limit exceeded. Please try again later.';
    } else if (errorMessage.includes('timeout')) {
      errorMessage = 'Website scanning timed out. The website may be slow to respond.';
    }

    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
        institution: null,
        programs: [],
        applicationForms: [],
        pages_scanned: 0,
        total_content_length: 0
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});