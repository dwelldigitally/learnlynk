import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { X, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useSetupTasks } from '@/hooks/useSetupTasks';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const SetupBanner: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { progress, loading } = useSetupTasks();
  const [isDismissed, setIsDismissed] = useState(false);

  console.log('🎯 SetupBanner RENDER:', { 
    user: user?.id, 
    progress, 
    loading, 
    isDismissed,
    localStorage_dismissed: user ? localStorage.getItem(`setup_banner_dismissed_${user.id}`) : null,
    localStorage_force: user ? localStorage.getItem(`setup_banner_force_show_${user.id}`) : null
  });

  useEffect(() => {
    const checkBannerStatus = async () => {
      if (!user) return;

      console.log('SetupBanner: Checking status', { progress, loading, user: user.id });

      // Check for force show flag (for demo purposes)
      const forceShow = localStorage.getItem(`setup_banner_force_show_${user.id}`);
      
      // Check if banner was dismissed
      const dismissed = localStorage.getItem(`setup_banner_dismissed_${user.id}`);
      console.log('SetupBanner: Status', { dismissed, progress, forceShow });
      
      // Show banner if forced, or if not dismissed and setup is incomplete
      if (forceShow || (!dismissed && progress < 100)) {
        console.log('SetupBanner: Showing banner');
        setIsDismissed(false);
      } else {
        console.log('SetupBanner: Hiding banner', { dismissed, progress });
        setIsDismissed(true);
      }
    };

    if (!loading) {
      checkBannerStatus();
    }
  }, [user, progress, loading]);

  const handleDismiss = async () => {
    if (!user) return;

    // Clear force show flag if it exists
    localStorage.removeItem(`setup_banner_force_show_${user.id}`);
    
    // Save dismissal to localStorage
    localStorage.setItem(`setup_banner_dismissed_${user.id}`, 'true');
    setIsDismissed(true);

    // Optionally save to database (when column is added)
    try {
      await supabase
        .from('profiles')
        .update({ updated_at: new Date().toISOString() } as any)
        .eq('user_id', user.id);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleGetStarted = () => {
    navigate('/admin/setup');
  };

  console.log('🎯 SetupBanner FINAL CHECK:', { isDismissed, loading, progress, willRender: !isDismissed && !loading });

  // Hide banner on setup page
  if (location.pathname === '/admin/setup') {
    return null;
  }

  if (isDismissed || loading) {
    console.log('🎯 SetupBanner HIDDEN because:', { isDismissed, loading });
    return null;
  }

  console.log('🎯 SetupBanner SHOWING!');

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/80 border-t border-border/50 shadow-lg">
      <div className="mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-foreground mb-1">
                Welcome! Let's get you set up
              </h3>
              <p className="text-xs text-muted-foreground mb-2">
                Complete your setup to unlock the full potential of your institution portal
              </p>
              
              <div className="flex items-center gap-2">
                <Progress value={progress} className="h-2 flex-1 max-w-xs" />
                <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                  {progress}% complete
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <Button 
              onClick={handleGetStarted}
              size="sm"
              className="gap-2"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Button>
            
            <Button
              onClick={handleDismiss}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
              <span className="sr-only">Dismiss</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
