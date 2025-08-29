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
      throw new Error('Firecrawl API key not configured');
    }

    // Crawl the website comprehensively
    const crawlResponse = await fetch('https://api.firecrawl.dev/v0/crawl', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${firecrawlApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: url,
        crawlerOptions: {
          includes: ["**/programs/**", "**/courses/**", "**/admissions/**", "**/apply/**", "**/about/**"],
          limit: comprehensive ? 50 : 10,
          maxDepth: 3,
        },
        pageOptions: {
          extractorOptions: {
            extractionSchema: {
              programs: "Extract all academic programs, courses, and degrees offered",
              requirements: "Extract admission requirements, prerequisites, and application requirements",
              fees: "Extract tuition fees, costs, and payment information",
              deadlines: "Extract application deadlines and important dates",
              contact: "Extract contact information, addresses, and institutional details",
              forms: "Extract application forms and their fields"
            }
          },
          onlyMainContent: true,
        }
      }),
    });

    if (!crawlResponse.ok) {
      throw new Error(`Firecrawl API error: ${crawlResponse.statusText}`);
    }

    const crawlData = await crawlResponse.json();
    
    if (!crawlData.success) {
      throw new Error(`Crawl failed: ${crawlData.error || 'Unknown error'}`);
    }

    // Get the job ID and poll for completion
    const jobId = crawlData.jobId;
    let jobStatus;
    let attempts = 0;
    const maxAttempts = 30; // 5 minutes max

    do {
      await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds
      
      const statusResponse = await fetch(`https://api.firecrawl.dev/v0/crawl/status/${jobId}`, {
        headers: {
          'Authorization': `Bearer ${firecrawlApiKey}`,
        },
      });

      if (!statusResponse.ok) {
        throw new Error(`Status check failed: ${statusResponse.statusText}`);
      }

      jobStatus = await statusResponse.json();
      attempts++;
      
      console.log(`Crawl status: ${jobStatus.status}, completed: ${jobStatus.completed}/${jobStatus.total}`);
      
    } while (jobStatus.status === 'scraping' && attempts < maxAttempts);

    if (jobStatus.status !== 'completed') {
      throw new Error(`Crawl did not complete successfully. Status: ${jobStatus.status}`);
    }

    const scrapedPages = jobStatus.data || [];
    console.log(`Successfully crawled ${scrapedPages.length} pages`);

    // Now analyze with AI
    const analysisResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/ai-content-analyzer`, {
      method: 'POST',
      headers: {
        'Authorization': req.headers.get('Authorization') || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: scrapedPages.map(page => ({
          url: page.metadata?.sourceURL || '',
          title: page.metadata?.title || '',
          content: page.markdown || page.content || '',
          extracted: page.extract || {}
        })),
        analysis_type: 'educational_institution',
        extract_programs: true,
        extract_forms: true
      }),
    });

    if (!analysisResponse.ok) {
      throw new Error(`AI analysis failed: ${analysisResponse.statusText}`);
    }

    const analysisResult = await analysisResponse.json();
    
    const result: ScanResult = {
      institution: analysisResult.institution || {
        name: new URL(url).hostname.replace('www.', ''),
        description: '',
        website: url,
      },
      programs: analysisResult.programs || [],
      applicationForms: analysisResult.forms || [],
      success: true,
      pages_scanned: scrapedPages.length,
      total_content_length: scrapedPages.reduce((sum, page) => sum + (page.content?.length || 0), 0)
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Website scanning error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
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