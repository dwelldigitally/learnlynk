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

    console.log('Using Firecrawl API with key:', firecrawlApiKey.substring(0, 8) + '...');

    // Use Firecrawl crawl API for comprehensive multi-page crawling
    const requestBody = {
      url: url,
      crawlerOptions: {
        limit: comprehensive ? 50 : 20,
        returnOnlyUrls: false
      },
      pageOptions: {
        onlyMainContent: true,
        includeHtml: false
      }
    };

    console.log('Firecrawl crawl request body:', JSON.stringify(requestBody, null, 2));

    const crawlResponse = await fetch('https://api.firecrawl.dev/v0/crawl', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${firecrawlApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('Firecrawl crawl response status:', crawlResponse.status);

    if (!crawlResponse.ok) {
      const errorText = await crawlResponse.text();
      console.error('Firecrawl API error details:', {
        status: crawlResponse.status,
        statusText: crawlResponse.statusText,
        headers: Object.fromEntries(crawlResponse.headers.entries()),
        body: errorText
      });
      
      // Provide specific error messages based on status code
      if (crawlResponse.status === 401) {
        throw new Error('Invalid Firecrawl API key. Please check your API key configuration.');
      } else if (crawlResponse.status === 429) {
        throw new Error('Firecrawl API rate limit exceeded. Please try again later.');
      } else if (crawlResponse.status === 400) {
        throw new Error(`Invalid request to Firecrawl API. Details: ${errorText}`);
      } else {
        throw new Error(`Firecrawl API error: ${crawlResponse.status} - ${errorText}`);
      }
    }

    const crawlData = await crawlResponse.json();
    console.log('Firecrawl crawl response data structure:', Object.keys(crawlData));
    
    // Handle both immediate success and async job responses
    if (!crawlData.success && !crawlData.jobId) {
      console.error('Crawl failed:', crawlData);
      throw new Error(`Website crawling failed: ${crawlData.error || 'Unknown error'}`);
    }
    
    // Log the type of response we received
    if (crawlData.success && crawlData.data) {
      console.log('Received immediate success response with data');
    } else if (crawlData.jobId) {
      console.log('Received async job response, will poll for completion');
    }

    // Wait for crawl completion if it's still in progress
    let jobId = crawlData.jobId;
    let crawlResult = crawlData;
    
    if (jobId && crawlData.status !== 'completed') {
      console.log(`Crawl job ${jobId} in progress, waiting for completion...`);
      
      // Poll for completion (max 2 minutes)
      const maxAttempts = 24; // 24 * 5 seconds = 2 minutes
      let attempts = 0;
      
      while (attempts < maxAttempts && crawlResult.status !== 'completed') {
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
        
        const statusResponse = await fetch(`https://api.firecrawl.dev/v0/crawl/status/${jobId}`, {
          headers: {
            'Authorization': `Bearer ${firecrawlApiKey}`,
          },
        });
        
        if (statusResponse.ok) {
          crawlResult = await statusResponse.json();
          console.log(`Crawl status: ${crawlResult.status}, completed: ${crawlResult.completed || 0}/${crawlResult.total || 0}`);
          attempts++;
        } else {
          break;
        }
      }
      
      if (crawlResult.status !== 'completed') {
        console.warn('Crawl did not complete in time, using partial results');
      }
    }

    const crawledPages = crawlResult.data || [];
    console.log(`Successfully crawled ${crawledPages.length} pages from: ${url}`);

    // Prepare content for AI analysis
    const scrapedContent = crawledPages.map((page: any, index: number) => ({
      url: page.metadata?.sourceURL || page.url || `${url}/page-${index}`,
      title: page.metadata?.title || `Page ${index + 1}`,
      content: page.markdown || page.content || '',
      extracted: page.extract || {}
    })).filter((page: any) => page.content && page.content.length > 100); // Filter out pages with minimal content

    const totalContentLength = scrapedContent.reduce((sum: number, page: any) => sum + page.content.length, 0);
    console.log(`Total content length: ${totalContentLength} characters across ${scrapedContent.length} pages`);

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
      pages_scanned: scrapedContent.length,
      total_content_length: totalContentLength
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