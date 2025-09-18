import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { X, Clock, Save, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useReviewSession } from '@/hooks/useReviewSession';
import { ReviewSection } from '@/types/review';
import { DocumentReviewPanel } from './DocumentReviewPanel';
import { EssayReviewPanel } from './EssayReviewPanel';
import { BackgroundReviewPanel } from './BackgroundReviewPanel';
import { AssessmentPanel } from './AssessmentPanel';
import { FinalReviewPanel } from './FinalReviewPanel';
import { QuickActionsSidebar } from './QuickActionsSidebar';
import { useToast } from '@/hooks/use-toast';

const REVIEW_SECTIONS: { key: ReviewSection; label: string }[] = [
  { key: 'documents', label: 'Documents' },
  { key: 'essays', label: 'Essays' },
  { key: 'background', label: 'Background' },
  { key: 'assessment', label: 'Assessment' },
  { key: 'final', label: 'Final Review' }
];

export function FullScreenReviewLayout() {
  const { applicantId } = useParams<{ applicantId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [startTime] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());

  const {
    session,
    isLoading,
    isSaving,
    lastSaved,
    saveSession,
    updateProgress,
    navigateToSection,
    addNote,
    completeReview
  } = useReviewSession({ applicantId: applicantId! });

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 's':
            e.preventDefault();
            saveSession();
            break;
          case 'ArrowLeft':
            e.preventDefault();
            navigatePrevious();
            break;
          case 'ArrowRight':
            e.preventDefault();
            navigateNext();
            break;
        }
      }
      if (e.key === 'Escape') {
        handleExit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [session]);

  const handleExit = () => {
    if (session?.isDraft) {
      saveSession();
    }
    navigate(`/admin/applicants/detail/${applicantId}`);
  };

  const navigatePrevious = () => {
    if (!session) return;
    const currentIndex = REVIEW_SECTIONS.findIndex(s => s.key === session.progress.currentSection);
    if (currentIndex > 0) {
      navigateToSection(REVIEW_SECTIONS[currentIndex - 1].key);
    }
  };

  const navigateNext = () => {
    if (!session) return;
    const currentIndex = REVIEW_SECTIONS.findIndex(s => s.key === session.progress.currentSection);
    if (currentIndex < REVIEW_SECTIONS.length - 1) {
      navigateToSection(REVIEW_SECTIONS[currentIndex + 1].key);
    }
  };

  const getElapsedTime = () => {
    const elapsed = Math.floor((currentTime.getTime() - startTime.getTime()) / 1000 / 60);
    return `${elapsed}m`;
  };

  const renderCurrentPanel = () => {
    if (!session) return null;

    switch (session.progress.currentSection) {
      case 'documents':
        return <DocumentReviewPanel applicantId={applicantId!} session={session} />;
      case 'essays':
        return <EssayReviewPanel applicantId={applicantId!} session={session} />;
      case 'background':
        return <BackgroundReviewPanel applicantId={applicantId!} session={session} />;
      case 'assessment':
        return <AssessmentPanel applicantId={applicantId!} session={session} />;
      case 'final':
        return <FinalReviewPanel 
          applicantId={applicantId!} 
          session={session} 
          onComplete={completeReview}
        />;
      default:
        return <div>Unknown section</div>;
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading review session...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
        <div className="text-center">
          <p className="text-destructive">Failed to load review session</p>
          <Button onClick={handleExit} className="mt-4">
            Return to Applicant
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleExit}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold">Application Review Mode</h1>
              <p className="text-sm text-muted-foreground">
                Applicant ID: {applicantId}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{getElapsedTime()}</span>
            </div>
            
            {lastSaved && (
              <div className="text-xs text-muted-foreground">
                Saved {new Date(lastSaved).toLocaleTimeString()}
              </div>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={saveSession}
              disabled={isSaving}
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>

        {/* Progress and Navigation */}
        <div className="px-6 pb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex space-x-1">
              {REVIEW_SECTIONS.map((section) => (
                <Button
                  key={section.key}
                  variant={session.progress.currentSection === section.key ? "default" : "ghost"}
                  size="sm"
                  onClick={() => navigateToSection(section.key)}
                  className="relative"
                >
                  {section.label}
                  {session.progress.completedSections.includes(section.key) && (
                    <Badge className="absolute -top-1 -right-1 h-2 w-2 p-0 bg-green-500" />
                  )}
                </Button>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={navigatePrevious}
                disabled={REVIEW_SECTIONS.findIndex(s => s.key === session.progress.currentSection) === 0}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={navigateNext}
                disabled={REVIEW_SECTIONS.findIndex(s => s.key === session.progress.currentSection) === REVIEW_SECTIONS.length - 1}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Progress value={session.progress.percentComplete} className="h-2" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-auto">
          {renderCurrentPanel()}
        </div>
        
        <QuickActionsSidebar 
          session={session}
          onAddNote={addNote}
          onSave={saveSession}
        />
      </div>
    </div>
  );
}