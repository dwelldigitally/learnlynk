import { useState, useEffect } from 'react';
import GridLayout, { Layout } from 'react-grid-layout';
import { Button } from '@/components/ui/button';
import { RotateCcw, Lock, Unlock } from 'lucide-react';
import { Lead } from '@/types/lead';
import { PersonalInfoWidget } from './widgets/PersonalInfoWidget';
import { DocumentOverviewWidget } from './widgets/DocumentOverviewWidget';
import { ProgramDetailsWidget } from './widgets/ProgramDetailsWidget';
import { IntakeDeadlineWidget } from './widgets/IntakeDeadlineWidget';
import { ApplicationTimelineWidget } from './widgets/ApplicationTimelineWidget';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const STORAGE_KEY = 'lead-dashboard-layout';
const LOCK_STATE_KEY = 'lead-dashboard-locked';

const defaultLayouts: Layout[] = [
  { i: 'personal-info', x: 0, y: 0, w: 6, h: 3, minW: 4, minH: 3 },
  { i: 'document-overview', x: 6, y: 0, w: 6, h: 3, minW: 4, minH: 4 },
  { i: 'program-details', x: 0, y: 3, w: 6, h: 3, minW: 4, minH: 3 },
  { i: 'intake-deadline', x: 6, y: 3, w: 6, h: 3, minW: 4, minH: 4 },
  { i: 'application-timeline', x: 0, y: 6, w: 12, h: 4, minW: 8, minH: 4 },
];

interface CustomizableDashboardProps {
  lead: Lead;
  journey: any;
  progress: {
    total: number;
    approved: number;
    pending: number;
    rejected: number;
    isComplete: boolean;
  };
}

export function CustomizableDashboard({ lead, journey, progress }: CustomizableDashboardProps) {
  const [layouts, setLayouts] = useState<Layout[]>(defaultLayouts);
  const [containerWidth, setContainerWidth] = useState(1200);
  const [isLocked, setIsLocked] = useState(true); // Start locked by default

  useEffect(() => {
    // Load saved layout from localStorage
    const savedLayout = localStorage.getItem(STORAGE_KEY);
    if (savedLayout) {
      try {
        setLayouts(JSON.parse(savedLayout));
      } catch (e) {
        console.error('Failed to parse saved layout', e);
      }
    }

    // Load saved lock state
    const savedLockState = localStorage.getItem(LOCK_STATE_KEY);
    if (savedLockState !== null) {
      setIsLocked(savedLockState === 'true');
    }

    // Update container width on resize
    const updateWidth = () => {
      const container = document.getElementById('dashboard-container');
      if (container) {
        setContainerWidth(container.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const handleLayoutChange = (newLayout: Layout[]) => {
    setLayouts(newLayout);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newLayout));
  };

  const resetLayout = () => {
    setLayouts(defaultLayouts);
    localStorage.removeItem(STORAGE_KEY);
  };

  const toggleLock = () => {
    const newLockState = !isLocked;
    setIsLocked(newLockState);
    localStorage.setItem(LOCK_STATE_KEY, newLockState.toString());
  };

  return (
    <div id="dashboard-container" className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isLocked ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Lock className="h-4 w-4" />
              <span>Dashboard locked - viewing mode</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-blue-600">
              <Unlock className="h-4 w-4" />
              <span>Dashboard unlocked - drag to reposition, resize from corners</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button 
            onClick={toggleLock} 
            variant={isLocked ? "outline" : "default"}
            size="sm"
          >
            {isLocked ? (
              <>
                <Unlock className="h-4 w-4 mr-2" />
                Unlock Layout
              </>
            ) : (
              <>
                <Lock className="h-4 w-4 mr-2" />
                Lock Layout
              </>
            )}
          </Button>
          <Button onClick={resetLayout} variant="outline" size="sm" disabled={isLocked}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      <GridLayout
        className="layout"
        layout={layouts}
        cols={12}
        rowHeight={100}
        width={containerWidth}
        onLayoutChange={handleLayoutChange}
        draggableHandle=".drag-handle"
        isDraggable={!isLocked}
        isResizable={!isLocked}
        compactType={null}
        preventCollision={false}
        margin={[16, 16]}
      >
        <div key="personal-info">
          <PersonalInfoWidget lead={lead} />
        </div>
        <div key="document-overview">
          <DocumentOverviewWidget progress={progress} />
        </div>
        <div key="program-details">
          <ProgramDetailsWidget lead={lead} />
        </div>
        <div key="intake-deadline">
          <IntakeDeadlineWidget />
        </div>
        <div key="application-timeline">
          <ApplicationTimelineWidget journey={journey} />
        </div>
      </GridLayout>
    </div>
  );
}
