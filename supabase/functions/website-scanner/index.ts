import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ScanRequest {
  url: string;
  comprehensive?: boolean;
  specificUrls?: string[];
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
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Website scanner function called');
    const requestBody = await req.json();
    console.log('Request body:', requestBody);
    
    // Health check endpoint
    if (requestBody.action === 'health') {
      console.log('Health check requested');
      return new Response(JSON.stringify({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        function: 'website-scanner'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Page discovery endpoint
    if (requestBody.action === 'discover') {
      console.log('Page discovery requested for:', requestBody.url);
      return await handlePageDiscovery(requestBody.url);
    }
    
    const { url, comprehensive = true, specificUrls }: ScanRequest = requestBody;
    
    if (!url && (!specificUrls || specificUrls.length === 0)) {
      throw new Error('URL or specific URLs are required');
    }

    // If specific URLs are provided, use selective scanning
    if (specificUrls && specificUrls.length > 0) {
      console.log(`Starting selective scan for ${specificUrls.length} specific URLs`);
      return await handleSelectiveScanning(specificUrls, req);
    }

    console.log(`Starting comprehensive scan for: ${url}`);

    // Initialize Firecrawl
    const firecrawlApiKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!firecrawlApiKey) {
      throw new Error('Firecrawl API key not configured. Please add your Firecrawl API key in the Supabase secrets.');
    }

    console.log('Using Firecrawl API with key:', firecrawlApiKey.substring(0, 8) + '...');

    // Use Firecrawl crawl API for comprehensive multi-page crawling
    const firecrawlRequestBody = {
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

    console.log('Firecrawl crawl request body:', JSON.stringify(firecrawlRequestBody, null, 2));

    const crawlResponse = await fetch('https://api.firecrawl.dev/v0/crawl', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${firecrawlApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(firecrawlRequestBody),
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
    console.log('Scan result summary:', {
      success: result.success,
      institution_name: result.institution.name,
      programs_count: result.programs.length,
      forms_count: result.applicationForms.length,
      pages_scanned: result.pages_scanned,
      total_content_length: result.total_content_length
    });

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

// Handle selective scanning of specific URLs
async function handleSelectiveScanning(urls: string[], req: Request): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  try {
    const firecrawlApiKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!firecrawlApiKey) {
      throw new Error('Firecrawl API key not configured');
    }

    console.log(`Scanning ${urls.length} specific URLs with Firecrawl`);
    
    const scrapedContent = [];
    let successCount = 0;
    
    // Scrape each URL individually for better control and faster processing
    for (const url of urls) {
      try {
        console.log(`Scraping: ${url}`);
        
        const firecrawlResponse = await fetch('https://api.firecrawl.dev/v0/scrape', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${firecrawlApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: url,
            pageOptions: {
              onlyMainContent: true,
              includeHtml: false
            }
          }),
        });

        if (firecrawlResponse.ok) {
          const pageData = await firecrawlResponse.json();
          if (pageData.success && pageData.data) {
            scrapedContent.push({
              url: pageData.data.metadata?.sourceURL || url,
              title: pageData.data.metadata?.title || `Page from ${new URL(url).pathname}`,
              content: pageData.data.markdown || pageData.data.content || '',
              extracted: pageData.data.extract || {}
            });
            successCount++;
          }
        } else {
          console.warn(`Failed to scrape ${url}: ${firecrawlResponse.status}`);
        }
      } catch (error) {
        console.warn(`Error scraping ${url}:`, error);
      }
    }

    // Filter out pages with minimal content
    const validContent = scrapedContent.filter(page => page.content && page.content.length > 100);
    const totalContentLength = validContent.reduce((sum, page) => sum + page.content.length, 0);
    
    console.log(`Successfully scraped ${successCount}/${urls.length} pages, ${validContent.length} with substantial content`);

    // Analyze with AI
    const analysisResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/ai-content-analyzer`, {
      method: 'POST',
      headers: {
        'Authorization': req.headers.get('Authorization') || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: validContent,
        analysis_type: 'educational_institution',
        extract_programs: true,
        extract_forms: true
      }),
    });

    if (!analysisResponse.ok) {
      throw new Error(`AI analysis failed: ${analysisResponse.status}`);
    }

    const analysisResult = await analysisResponse.json();
    
    const result = {
      institution: analysisResult.institution || {
        name: urls[0] ? new URL(urls[0]).hostname.replace('www.', '') : 'Unknown Institution',
        description: 'Educational institution',
        website: urls[0] || '',
      },
      programs: analysisResult.programs || [],
      applicationForms: analysisResult.forms || [],
      success: true,
      pages_scanned: validContent.length,
      total_content_length: totalContentLength,
      urls_requested: urls.length,
      urls_successfully_scraped: successCount
    };

    console.log(`Selective scan complete: ${result.programs.length} programs, ${result.applicationForms.length} forms found`);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Selective scanning error:', error);
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
}

async function handlePageDiscovery(url: string) {
  const firecrawlApiKey = Deno.env.get('FIRECRAWL_API_KEY');
  if (!firecrawlApiKey) {
    throw new Error('Firecrawl API key not configured');
  }

  try {
    console.log('Starting page discovery for:', url);
    
    // Scrape the homepage to get navigation and structure
    const response = await fetch('https://api.firecrawl.dev/v0/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${firecrawlApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: url,
        pageOptions: {
          onlyMainContent: false,
          includeHtml: true,
          includeLinks: true
        }
      })
    });

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to scrape homepage');
    }

    // Extract links from the scraped content
    const links = data.data?.links || [];
    const htmlContent = data.data?.html || '';
    
    // Analyze content with AI to categorize pages
    const aiAnalysisResult = await analyzePageStructure(url, htmlContent, links);
    
    return new Response(JSON.stringify({
      success: true,
      categories: aiAnalysisResult.categories
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('Page discovery error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

async function analyzePageStructure(url: string, htmlContent: string, links: string[]) {
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openAIApiKey) {
    // Return fallback structure if no AI available
    return generateFallbackStructure(url, links);
  }

  try {
    const baseUrl = new URL(url).origin;
    const relevantLinks = links
      .filter(link => link.startsWith(baseUrl) || link.startsWith('/'))
      .map(link => link.startsWith('/') ? baseUrl + link : link)
      .slice(0, 50); // Limit to 50 links for analysis

    const prompt = `Analyze this educational institution website and categorize the discovered pages.

Website: ${url}
Available links: ${relevantLinks.join('\n')}

HTML content snippet: ${htmlContent.substring(0, 2000)}

Categorize the links into these educational categories:
1. programs - Academic programs, courses, degrees, diplomas, certificates
2. admissions - Admissions info, requirements, applications, enrollment
3. fees - Tuition, fees, financial aid, scholarships, costs
4. deadlines - Application deadlines, intake dates, academic calendar
5. general - About, contact, campus info, general information

For each category that has relevant pages, return the most important and relevant pages (max 5 per category).

Return JSON format:
{
  "categories": [
    {
      "id": "programs",
      "label": "Academic Programs",
      "description": "Degree programs, courses, and curricula",
      "pages": [
        {
          "url": "full_url_here",
          "title": "descriptive_title",
          "description": "what_this_page_contains",
          "confidence": 85
        }
      ]
    }
  ]
}

Only include categories that have relevant pages. Be intelligent about filtering - exclude irrelevant pages like privacy policy, staff directory, news, etc.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert at analyzing educational institution websites. Return only valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      }),
    });

    const aiData = await response.json();
    const content = aiData.choices[0]?.message?.content;
    
    if (content) {
      try {
        const parsed = JSON.parse(content);
        console.log('AI-analyzed page structure:', parsed);
        return parsed;
      } catch (parseError) {
        console.warn('Failed to parse AI response, using fallback');
      }
    }
  } catch (error) {
    console.warn('AI analysis failed, using fallback:', error);
  }

  return generateFallbackStructure(url, links);
}

function generateFallbackStructure(url: string, links: string[]) {
  const baseUrl = new URL(url).origin;
  
  // Pattern-based categorization as fallback
  const patterns = {
    programs: [/programs?/i, /academics?/i, /courses?/i, /degrees?/i, /undergraduate/i, /graduate/i, /diploma/i, /certificate/i],
    admissions: [/admissions?/i, /apply/i, /application/i, /requirements?/i, /enroll/i],
    fees: [/tuition/i, /fees?/i, /cost/i, /financial/i, /scholarship/i],
    deadlines: [/deadline/i, /calendar/i, /dates?/i, /timeline/i],
    general: [/about/i, /contact/i, /campus/i]
  };

  const categories = [];
  
  for (const [categoryId, categoryPatterns] of Object.entries(patterns)) {
    const categoryPages = links
      .filter(link => {
        const fullUrl = link.startsWith('/') ? baseUrl + link : link;
        return categoryPatterns.some(pattern => pattern.test(fullUrl));
      })
      .slice(0, 5)
      .map(link => {
        const fullUrl = link.startsWith('/') ? baseUrl + link : link;
        const pathParts = new URL(fullUrl).pathname.split('/').filter(Boolean);
        const title = pathParts[pathParts.length - 1]?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Page';
        
        return {
          url: fullUrl,
          title: title,
          description: `${title} information`,
          confidence: 70
        };
      });

    if (categoryPages.length > 0) {
      const categoryLabels = {
        programs: { label: 'Academic Programs', description: 'Degree programs, courses, and curricula' },
        admissions: { label: 'Admissions Info', description: 'Requirements, processes, and applications' },
        fees: { label: 'Fees & Tuition', description: 'Tuition costs and fee structures' },
        deadlines: { label: 'Dates & Deadlines', description: 'Application deadlines and intake dates' },
        general: { label: 'General Info', description: 'About us, contact, and general information' }
      };

      categories.push({
        id: categoryId,
        label: categoryLabels[categoryId].label,
        description: categoryLabels[categoryId].description,
        pages: categoryPages
      });
    }
  }

  return { categories };
}