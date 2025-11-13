import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export interface SetupTourState {
  run: boolean;
  stepIndex: number;
  tourCompleted: boolean;
}

export const useSetupTour = () => {
  const { user } = useAuth();
  const [run, setRun] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [tourCompleted, setTourCompleted] = useState(false);

  // Check if user has completed the tour
  useEffect(() => {
    if (user?.id) {
      const completed = localStorage.getItem(`setup_tour_completed_${user.id}`);
      const seen = localStorage.getItem(`setup_tour_seen_${user.id}`);
      
      setTourCompleted(completed === 'true');
      
      // Auto-start tour on first visit
      if (!seen && !completed) {
        setRun(true);
      }
    }
  }, [user?.id]);

  const startTour = () => {
    setRun(true);
    setStepIndex(0);
  };

  const stopTour = () => {
    setRun(false);
  };

  const resetTour = () => {
    setStepIndex(0);
    setRun(true);
  };

  const completeTour = () => {
    if (user?.id) {
      localStorage.setItem(`setup_tour_completed_${user.id}`, 'true');
      localStorage.setItem(`setup_tour_seen_${user.id}`, 'true');
      setTourCompleted(true);
    }
    setRun(false);
  };

  const skipTour = () => {
    if (user?.id) {
      localStorage.setItem(`setup_tour_seen_${user.id}`, 'true');
    }
    setRun(false);
  };

  return {
    run,
    stepIndex,
    tourCompleted,
    startTour,
    stopTour,
    resetTour,
    completeTour,
    skipTour,
    setStepIndex,
  };
};
