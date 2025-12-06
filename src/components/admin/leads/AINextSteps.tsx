import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, RefreshCw, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

interface AINextStepsProps {
  leadId: string;
}

const STORAGE_KEY = 'ai_next_steps_';

export function AINextSteps({ leadId }: AINextStepsProps) {
  const [steps, setSteps] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  // Load cached steps on mount
  useEffect(() => {
    const cached = localStorage.getItem(STORAGE_KEY + leadId);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setSteps(parsed.steps || []);
        setInitialLoad(false);
      } catch {
        fetchNextSteps();
      }
    } else {
      fetchNextSteps();
    }
  }, [leadId]);

  const fetchNextSteps = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('lead-ai-summary', {
        body: { leadId, action: 'next_steps' }
      });

      if (error) throw error;

      if (data?.response) {
        const parsedSteps = data.response
          .split('\n')
          .map((s: string) => s.trim())
          .filter((s: string) => s.length > 0);
        
        setSteps(parsedSteps);
        
        // Cache in localStorage
        localStorage.setItem(STORAGE_KEY + leadId, JSON.stringify({
          steps: parsedSteps,
          timestamp: Date.now()
        }));
      }
    } catch (error) {
      console.error('Failed to fetch next steps:', error);
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  };

  if (initialLoad && steps.length === 0) {
    return (
      <Card className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/20 dark:to-purple-950/20 border-violet-200 dark:border-violet-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-violet-500" />
            AI Next Steps
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-5/6" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/20 dark:to-purple-950/20 border-violet-200 dark:border-violet-800">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-violet-500" />
            AI Next Steps
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchNextSteps}
            disabled={loading}
            className="h-7 px-2 text-xs text-violet-600 hover:text-violet-700 hover:bg-violet-100"
          >
            <RefreshCw className={`h-3 w-3 mr-1 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {loading && steps.length === 0 ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        ) : (
          <ul className="space-y-2">
            {steps.map((step, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                <ArrowRight className="h-3.5 w-3.5 mt-0.5 text-violet-500 flex-shrink-0" />
                <span className={loading ? 'opacity-50' : ''}>{step}</span>
              </li>
            ))}
            {steps.length === 0 && !loading && (
              <p className="text-sm text-muted-foreground">No steps available. Click refresh to generate.</p>
            )}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
