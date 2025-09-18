import { useState, useEffect, useCallback } from 'react';
import { ReviewSession, ReviewSection, ReviewProgress } from '@/types/review';
import { useToast } from '@/hooks/use-toast';

interface UseReviewSessionOptions {
  applicantId: string;
  autoSave?: boolean;
  saveInterval?: number;
}

export function useReviewSession({ 
  applicantId, 
  autoSave = true, 
  saveInterval = 30000 
}: UseReviewSessionOptions) {
  const [session, setSession] = useState<ReviewSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const { toast } = useToast();

  // Initialize or load existing session
  useEffect(() => {
    const loadSession = async () => {
      setIsLoading(true);
      try {
        // Try to load existing draft session
        const existingSession = localStorage.getItem(`review_session_${applicantId}`);
        
        if (existingSession) {
          const parsed = JSON.parse(existingSession);
          setSession({
            ...parsed,
            startedAt: new Date(parsed.startedAt),
            completedAt: parsed.completedAt ? new Date(parsed.completedAt) : undefined
          });
        } else {
          // Create new session
          const newSession: ReviewSession = {
            id: `review_${Date.now()}`,
            applicantId,
            reviewerId: 'current_user', // TODO: Get from auth
            startedAt: new Date(),
            progress: {
              currentSection: 'documents',
              completedSections: [],
              totalSections: 5,
              percentComplete: 0
            },
            essayReviews: [],
            documentReviews: [],
            notes: '',
            isDraft: true,
            timeSpent: 0
          };
          setSession(newSession);
        }
      } catch (error) {
        console.error('Failed to load review session:', error);
        toast({
          title: "Error",
          description: "Failed to load review session",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();
  }, [applicantId, toast]);

  // Auto-save functionality
  useEffect(() => {
    if (!session || !autoSave) return;

    const interval = setInterval(() => {
      saveSession();
    }, saveInterval);

    return () => clearInterval(interval);
  }, [session, autoSave, saveInterval]);

  const saveSession = useCallback(async () => {
    if (!session) return;

    setIsSaving(true);
    try {
      localStorage.setItem(`review_session_${applicantId}`, JSON.stringify(session));
      setLastSaved(new Date());
    } catch (error) {
      console.error('Failed to save session:', error);
      toast({
        title: "Save Error",
        description: "Failed to save review progress",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  }, [session, applicantId, toast]);

  const updateProgress = useCallback((section: ReviewSection, completed: boolean = true) => {
    setSession(prev => {
      if (!prev) return null;

      const completedSections = completed 
        ? [...new Set([...prev.progress.completedSections, section])]
        : prev.progress.completedSections.filter(s => s !== section);

      const percentComplete = (completedSections.length / prev.progress.totalSections) * 100;

      return {
        ...prev,
        progress: {
          ...prev.progress,
          currentSection: section,
          completedSections,
          percentComplete
        }
      };
    });
  }, []);

  const navigateToSection = useCallback((section: ReviewSection) => {
    setSession(prev => {
      if (!prev) return null;
      return {
        ...prev,
        progress: {
          ...prev.progress,
          currentSection: section
        }
      };
    });
  }, []);

  const addNote = useCallback((content: string, section?: ReviewSection) => {
    setSession(prev => {
      if (!prev) return null;
      const timestamp = new Date().toISOString();
      const sectionNote = section ? `[${section.toUpperCase()}] ` : '';
      const newNote = `${sectionNote}${content} (${timestamp})\n`;
      
      return {
        ...prev,
        notes: prev.notes + newNote
      };
    });
  }, []);

  const completeReview = useCallback(async () => {
    if (!session) return;

    const completedSession = {
      ...session,
      completedAt: new Date(),
      isDraft: false,
      progress: {
        ...session.progress,
        percentComplete: 100,
        completedSections: ['documents', 'essays', 'background', 'assessment', 'final'] as ReviewSection[]
      }
    };

    setSession(completedSession);
    await saveSession();
    
    // Clear from localStorage after completion
    localStorage.removeItem(`review_session_${applicantId}`);
    
    toast({
      title: "Review Completed",
      description: "Application review has been completed and saved",
    });
  }, [session, applicantId, saveSession, toast]);

  return {
    session,
    isLoading,
    isSaving,
    lastSaved,
    saveSession,
    updateProgress,
    navigateToSection,
    addNote,
    completeReview
  };
}