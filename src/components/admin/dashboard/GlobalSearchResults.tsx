import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, GraduationCap, BookOpen, FileText, Search, ArrowRight, Sparkles, Brain } from 'lucide-react';
import { GlobalSearchResponse, GlobalSearchResult } from '@/services/globalSearchService';
import { HotSheetCard } from '@/components/hotsheet/HotSheetCard';
import { PastelBadge } from '@/components/hotsheet/PastelBadge';
import { PastelColor } from '@/components/hotsheet/utils';
import { cn } from '@/lib/utils';

interface GlobalSearchResultsProps {
  results: GlobalSearchResponse | null;
  isLoading: boolean;
  isOpen: boolean;
  onClose: () => void;
  selectedIndex: number;
  onSelect: (result: GlobalSearchResult) => void;
  smartShortcut?: { path: string; description: string } | null;
}

const CATEGORY_CONFIG = {
  leads: { icon: Users, label: 'Leads', color: 'sky' as PastelColor },
  students: { icon: GraduationCap, label: 'Students', color: 'emerald' as PastelColor },
  programs: { icon: BookOpen, label: 'Programs', color: 'violet' as PastelColor },
  documents: { icon: FileText, label: 'Documents', color: 'amber' as PastelColor },
};

export function GlobalSearchResults({
  results,
  isLoading,
  isOpen,
  onClose,
  selectedIndex,
  onSelect,
  smartShortcut
}: GlobalSearchResultsProps) {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Smart shortcut suggestion
  if (smartShortcut) {
    return (
      <div ref={containerRef} className="absolute top-full left-0 right-0 mt-2 z-50">
        <HotSheetCard className="shadow-xl border border-border/50">
          <button
            onClick={() => {
              navigate(smartShortcut.path);
              onClose();
            }}
            className="w-full p-4 flex items-center gap-3 hover:bg-muted/50 rounded-xl transition-colors"
          >
            <div className="p-2 rounded-xl bg-violet-100 dark:bg-violet-900/30">
              <Sparkles className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-foreground">{smartShortcut.description}</p>
              <p className="text-sm text-muted-foreground">Press Enter to navigate</p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </button>
        </HotSheetCard>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div ref={containerRef} className="absolute top-full left-0 right-0 mt-2 z-50">
        <HotSheetCard className="shadow-xl border border-border/50 p-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent" />
              <Brain className="absolute inset-0 m-auto h-3 w-3 text-primary animate-pulse" />
            </div>
            <div>
              <span className="text-foreground font-medium">AI is searching...</span>
              <p className="text-xs text-muted-foreground">Understanding your query</p>
            </div>
          </div>
        </HotSheetCard>
      </div>
    );
  }

  // No results
  if (!results || results.totalCount === 0) {
    return (
      <div ref={containerRef} className="absolute top-full left-0 right-0 mt-2 z-50">
        <HotSheetCard className="shadow-xl border border-border/50 p-6 text-center">
          <div className="p-3 rounded-full bg-muted/50 w-fit mx-auto mb-3">
            <Search className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="font-medium text-foreground">No results found</p>
          <p className="text-sm text-muted-foreground mt-1">Try a different search term</p>
        </HotSheetCard>
      </div>
    );
  }

  // Build flat list for keyboard navigation
  let flatIndex = 0;
  const categories = Object.entries(results.categories).filter(([_, items]) => items.length > 0);

  return (
    <div ref={containerRef} className="absolute top-full left-0 right-0 mt-2 z-50">
      <HotSheetCard className="shadow-xl border border-border/50 max-h-[400px] overflow-y-auto">
        {/* AI Explanation Banner */}
        {results.isSemanticSearch && results.explanation && (
          <div className="border-b border-border/50 px-4 py-3 bg-gradient-to-r from-violet-50/50 to-sky-50/50 dark:from-violet-950/20 dark:to-sky-950/20">
            <div className="flex items-start gap-2">
              <Brain className="h-4 w-4 text-violet-600 dark:text-violet-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground font-medium">{results.explanation}</p>
                {results.intent && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Intent: {results.intent.replace(/_/g, ' ')}
                  </p>
                )}
              </div>
              <PastelBadge color="violet" size="sm" className="flex-shrink-0">
                <Sparkles className="h-3 w-3 mr-1" />
                AI
              </PastelBadge>
            </div>
          </div>
        )}

        <div className="p-2">
          {categories.map(([category, items]) => {
            const config = CATEGORY_CONFIG[category as keyof typeof CATEGORY_CONFIG];
            const Icon = config.icon;

            return (
              <div key={category} className="mb-2 last:mb-0">
                {/* Category header */}
                <div className="flex items-center gap-2 px-3 py-2">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {config.label}
                  </span>
                  <PastelBadge color={config.color} size="sm">
                    {items.length}
                  </PastelBadge>
                </div>

                {/* Results */}
                <div className="space-y-1">
                  {items.map((result) => {
                    const isSelected = flatIndex === selectedIndex;
                    flatIndex++;

                    return (
                      <button
                        key={result.id}
                        onClick={() => onSelect(result)}
                        className={cn(
                          "w-full px-3 py-2.5 flex items-center gap-3 rounded-xl transition-colors text-left",
                          isSelected 
                            ? "bg-primary/10 ring-1 ring-primary/20" 
                            : "hover:bg-muted/50"
                        )}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground truncate">{result.title}</p>
                          {result.subtitle && (
                            <p className="text-sm text-muted-foreground truncate">{result.subtitle}</p>
                          )}
                        </div>
                        {result.metadata?.status && (
                          <PastelBadge 
                            color={getStatusColor(result.metadata.status)} 
                            size="sm"
                          >
                            {result.metadata.status}
                          </PastelBadge>
                        )}
                        <ArrowRight className={cn(
                          "h-4 w-4 text-muted-foreground transition-opacity",
                          isSelected ? "opacity-100" : "opacity-0"
                        )} />
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="border-t border-border/50 px-4 py-2 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>{results.totalCount} result{results.totalCount !== 1 ? 's' : ''}</span>
            {results.isSemanticSearch && (
              <span className="text-violet-600 dark:text-violet-400">• AI-powered</span>
            )}
          </div>
          <span>↑↓ Navigate • Enter Select • Esc Close</span>
        </div>
      </HotSheetCard>
    </div>
  );
}

function getStatusColor(status: string): PastelColor {
  const statusLower = status?.toLowerCase() || '';
  if (['active', 'enrolled', 'converted', 'completed'].includes(statusLower)) return 'emerald';
  if (['pending', 'in_progress', 'contacted'].includes(statusLower)) return 'amber';
  if (['inactive', 'lost', 'dropped'].includes(statusLower)) return 'rose';
  if (['new', 'qualified'].includes(statusLower)) return 'sky';
  return 'violet';
}
