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

// Helper function to estimate token count (rough approximation: 1 token ≈ 4 characters)
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

// Helper function to filter and clean content
function filterContent(content: string): string {
  // Remove common navigation and footer patterns
  const patterns = [
    /(?:navigation|nav|menu|footer|header|sidebar)[\s\S]*?(?=\n\n|\n[A-Z]|$)/gi,
    /(?:cookie|privacy|terms|policy)[\s\S]*?(?=\n\n|\n[A-Z]|$)/gi,
    /(?:copyright|©)[\s\S]*?(?=\n\n|\n[A-Z]|$)/gi,
    /(?:skip to|back to top|home page)[\s\S]*?(?=\n\n|\n[A-Z]|$)/gi
  ];
  
  let filtered = content;
  patterns.forEach(pattern => {
    filtered = filtered.replace(pattern, '');
  });
  
  // Remove excessive whitespace
  filtered = filtered.replace(/\n{3,}/g, '\n\n').trim();
  
  return filtered;
}

// Helper function to chunk content into manageable pieces
function chunkContent(pages: Array<{url: string; title: string; content: string; extracted?: any}>, maxTokensPerChunk: number = 18000): Array<Array<typeof pages[0]>> {
  const chunks: Array<Array<typeof pages[0]>> = [];
  let currentChunk: Array<typeof pages[0]> = [];
  let currentTokens = 0;
  
  for (const page of pages) {
    const filteredContent = filterContent(page.content);
    const pageTokens = estimateTokens(filteredContent + page.title + page.url);
    
    // If adding this page would exceed the limit, start a new chunk
    if (currentTokens + pageTokens > maxTokensPerChunk && currentChunk.length > 0) {
      chunks.push([...currentChunk]);
      currentChunk = [];
      currentTokens = 0;
    }
    
    currentChunk.push({
      ...page,
      content: filteredContent
    });
    currentTokens += pageTokens;
  }
  
  // Add the last chunk if it has content
  if (currentChunk.length > 0) {
    chunks.push(currentChunk);
  }
  
  return chunks;
}

// Helper function to analyze a chunk with retry logic
async function analyzeChunk(chunk: Array<{url: string; title: string; content: string; extracted?: any}>, openAIApiKey: string, retries: number = 2): Promise<Partial<AnalysisResult>> {
  const chunkContent = chunk.map(page => `
    URL: ${page.url}
    Title: ${page.title}
    Content: ${page.content}
    ${page.extracted ? `Extracted Data: ${JSON.stringify(page.extracted, null, 2)}` : ''}
  `).join('\n\n---PAGE BREAK---\n\n');

  const systemPrompt = `You are an expert educational institution data analyst specialized in extracting comprehensive program information from college/university websites.

CRITICAL INSTRUCTIONS FOR PROGRAM EXTRACTION:
1. Extract ALL programs/courses/degrees/certificates mentioned in this content chunk
2. For duration: Look for patterns like "12 months", "2 years", "18-month", "1-2 years", "24 weeks", etc. Convert to standardized format
3. For fees: Extract tuition fees, application fees, registration fees. Look for domestic vs international pricing
4. For requirements: Extract academic prerequisites, grade requirements, English language requirements, work experience
5. For descriptions: Extract full program descriptions, career outcomes, curriculum highlights
6. For deadlines: Extract application deadlines, intake dates, important dates
7. Return ONLY valid JSON with no additional text or explanations
8. Be extremely thorough - this data populates an enrollment management system

DURATION EXTRACTION RULES:
- "12 months" → "12 months"
- "2 years" → "2 years"  
- "18-month program" → "18 months"
- "1-2 years" → "1-2 years"
- "24 weeks" → "24 weeks"
- If unclear, use "Not specified"

FEE EXTRACTION RULES:
- Look for numbers followed by currency symbols ($, CAD, USD)
- Extract application fees, tuition fees, lab fees, registration fees
- Distinguish between domestic and international rates
- Include payment plan information if available

REQUIREMENTS EXTRACTION RULES:
- Academic requirements (high school diploma, bachelor's degree, GPA)
- English language requirements (IELTS, TOEFL scores)
- Work experience requirements
- Portfolio or interview requirements

Return a JSON object with this structure:
{
  "institution": {
    "name": "string or null",
    "description": "string or null", 
    "website": "string or null",
    "phone": "string or null",
    "email": "string or null",
    "address": "string or null",
    "city": "string or null",
    "state": "string or null", 
    "country": "string or null",
    "logo_url": "string or null",
    "primary_color": "string or null",
    "founded_year": "number or null",
    "employee_count": "number or null"
  },
  "programs": [...],
  "forms": [...]
}`;

  const prompt = `${systemPrompt}

Analyze this educational institution website content chunk:

${chunkContent}`;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      console.log(`Analyzing chunk (attempt ${attempt + 1}/${retries + 1}), content length: ${chunkContent.length}`);
      
      const requestBody = {
        model: 'gpt-4o-mini', // Using mini for better rate limits and cost efficiency
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
        max_tokens: 4000,
        temperature: 0.3
      };

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`OpenAI API error (attempt ${attempt + 1}):`, {
          status: response.status,
          statusText: response.statusText,
          errorBody: errorText
        });
        
        // If it's a rate limit error and we have retries left, wait and try again
        if (response.status === 429 && attempt < retries) {
          const waitTime = Math.pow(2, attempt) * 1000; // Exponential backoff
          console.log(`Rate limit hit, waiting ${waitTime}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          continue;
        }
        
        throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      const analysisText = data.choices[0].message.content;

      console.log('Raw chunk analysis:', analysisText.substring(0, 500) + '...');

      // Parse the JSON response
      try {
        const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
        const jsonString = jsonMatch ? jsonMatch[0] : analysisText;
        const result = JSON.parse(jsonString);
        
        return {
          institution: result.institution || null,
          programs: Array.isArray(result.programs) ? result.programs : [],
          forms: Array.isArray(result.forms) ? result.forms : []
        };
      } catch (parseError) {
        console.error('Failed to parse chunk analysis JSON:', parseError);
        return {
          institution: null,
          programs: [],
          forms: []
        };
      }
    } catch (error) {
      console.error(`Error in chunk analysis attempt ${attempt + 1}:`, error);
      if (attempt === retries) {
        throw error;
      }
    }
  }
  
  // Fallback return
  return {
    institution: null,
    programs: [],
    forms: []
  };
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

    console.log(`Starting analysis of ${content.length} pages`);
    
    // Chunk the content to avoid token limits  
    const chunks = chunkContent(content, 15000); // Increased limit for better extraction
    console.log(`Split content into ${chunks.length} chunks`);
    
    // Analyze each chunk
    const chunkResults: Array<Partial<AnalysisResult>> = [];
    for (let i = 0; i < chunks.length; i++) {
      console.log(`Analyzing chunk ${i + 1}/${chunks.length} with ${chunks[i].length} pages`);
      try {
        const chunkResult = await analyzeChunk(chunks[i], openAIApiKey);
        chunkResults.push(chunkResult);
        
        // Add delay between requests to respect rate limits
        if (i < chunks.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      } catch (error) {
        console.error(`Error analyzing chunk ${i + 1}:`, error);
        // Continue with other chunks even if one fails
        chunkResults.push({ institution: null, programs: [], forms: [] });
      }
    }

    // Combine results from all chunks
    let combinedInstitution: any = {
      name: content[0]?.url ? new URL(content[0].url).hostname.replace('www.', '') : 'Unknown Institution',
      description: 'Educational institution',
      website: content[0]?.url || ''
    };
    
    const allPrograms: any[] = [];
    const allForms: any[] = [];
    
    // Merge institution data (prefer non-null values)
    for (const result of chunkResults) {
      if (result.institution) {
        Object.keys(result.institution).forEach(key => {
          if (result.institution[key] && !combinedInstitution[key]) {
            combinedInstitution[key] = result.institution[key];
          }
        });
      }
      
      // Collect all programs and forms
      if (result.programs) {
        allPrograms.push(...result.programs);
      }
      if (result.forms) {
        allForms.push(...result.forms);
      }
    }

    // Remove duplicate programs based on name
    const uniquePrograms = allPrograms.filter((program, index, self) => 
      index === self.findIndex(p => p.name === program.name)
    );

    // Remove duplicate forms based on title
    const uniqueForms = allForms.filter((form, index, self) => 
      index === self.findIndex(f => f.title === form.title)
    );

    // Ensure each program has required fields
    const cleanedPrograms = uniquePrograms.map(program => ({
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

    const analysisResult: AnalysisResult = {
      institution: combinedInstitution,
      programs: cleanedPrograms,
      forms: uniqueForms
    };

    console.log(`Successfully analyzed ${content.length} pages in ${chunks.length} chunks`);
    console.log(`Found ${analysisResult.programs.length} programs and ${analysisResult.forms.length} forms`);

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