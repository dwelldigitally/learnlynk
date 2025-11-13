import React from 'react';
import Joyride, { Step, CallBackProps, STATUS, ACTIONS, EVENTS } from 'react-joyride';
import { useSetupTour } from '@/hooks/useSetupTour';

export const SetupTour: React.FC = () => {
  const { run, stepIndex, completeTour, skipTour, setStepIndex } = useSetupTour();

  const steps: Step[] = [
    {
      target: '[data-tour="welcome"]',
      content: (
        <div className="space-y-2">
          <h3 className="font-semibold text-lg text-foreground">Welcome to Your Setup Guide!</h3>
          <p className="text-sm text-foreground">
            This quick tour will help you understand how to complete your institution setup. 
            Let's get started!
          </p>
        </div>
      ),
      placement: 'center',
      disableBeacon: true,
    },
    {
      target: '[data-tour="progress-section"]',
      content: (
        <div className="space-y-2">
          <h3 className="font-semibold text-foreground">Track Your Progress</h3>
          <p className="text-sm text-foreground">
            Monitor your overall setup progress here. Complete all tasks to unlock the full potential of your institution portal.
          </p>
        </div>
      ),
      placement: 'bottom',
    },
    {
      target: '[data-tour="task-status"]',
      content: (
        <div className="space-y-2">
          <h3 className="font-semibold text-foreground">Task Status Indicators</h3>
          <p className="text-sm text-foreground">
            Each task shows its current status - not started, in progress, completed, or skipped. 
            You can track what you've done at a glance.
          </p>
        </div>
      ),
      placement: 'left',
    },
    {
      target: '[data-tour="task-info"]',
      content: (
        <div className="space-y-2">
          <h3 className="font-semibold text-foreground">Task Information</h3>
          <p className="text-sm text-foreground">
            View task details including estimated time and whether it's required or optional. 
            Required tasks are essential for core functionality.
          </p>
        </div>
      ),
      placement: 'top',
    },
    {
      target: '[data-tour="task-actions"]',
      content: (
        <div className="space-y-2">
          <h3 className="font-semibold text-foreground">Take Action</h3>
          <p className="text-sm text-foreground">
            Click "Start" to begin a task, which will take you to the relevant page. 
            You can mark tasks complete when done or skip optional tasks.
          </p>
        </div>
      ),
      placement: 'top',
    },
    {
      target: '[data-tour="help-section"]',
      content: (
        <div className="space-y-2">
          <h3 className="font-semibold text-foreground">Need Help?</h3>
          <p className="text-sm text-foreground">
            Access documentation or contact support anytime. You can also restart this tour from here.
          </p>
        </div>
      ),
      placement: 'top',
    },
  ];

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, action, index, type } = data;

    if (([STATUS.FINISHED, STATUS.SKIPPED] as string[]).includes(status)) {
      if (status === STATUS.FINISHED) {
        completeTour();
      } else {
        skipTour();
      }
    } else if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
      const nextStepIndex = index + (action === ACTIONS.PREV ? -1 : 1);
      setStepIndex(nextStepIndex);
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      stepIndex={stepIndex}
      continuous
      showProgress
      showSkipButton
      callback={handleJoyrideCallback}
      styles={{
        options: {
          primaryColor: 'hsl(var(--primary))',
          textColor: 'hsl(var(--foreground))',
          backgroundColor: 'hsl(var(--popover))',
          overlayColor: 'rgba(0, 0, 0, 0.5)',
          arrowColor: 'hsl(var(--popover))',
          zIndex: 10000,
        },
        tooltip: {
          borderRadius: 'calc(var(--radius) - 2px)',
          padding: '1rem',
        },
        buttonNext: {
          backgroundColor: 'hsl(var(--primary))',
          color: 'hsl(var(--primary-foreground))',
          borderRadius: 'calc(var(--radius) - 2px)',
          padding: '0.5rem 1rem',
          fontSize: '0.875rem',
          fontWeight: 500,
        },
        buttonBack: {
          color: 'hsl(var(--muted-foreground))',
          marginRight: '0.5rem',
        },
        buttonSkip: {
          color: 'hsl(var(--muted-foreground))',
        },
        buttonClose: {
          display: 'none',
        },
      }}
      locale={{
        back: 'Back',
        close: 'Close',
        last: 'Finish',
        next: 'Next',
        skip: 'Skip Tour',
      }}
    />
  );
};
