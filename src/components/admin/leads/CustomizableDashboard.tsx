import { Lead } from '@/types/lead';
import { PersonalInfoWidget } from './widgets/PersonalInfoWidget';
import { DocumentOverviewWidget } from './widgets/DocumentOverviewWidget';
import { ProgramDetailsWidget } from './widgets/ProgramDetailsWidget';
import { IntakeDeadlineWidget } from './widgets/IntakeDeadlineWidget';
import { ApplicationTimelineWidget } from './widgets/ApplicationTimelineWidget';

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
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PersonalInfoWidget lead={lead} />
        <DocumentOverviewWidget progress={progress} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProgramDetailsWidget lead={lead} />
        <IntakeDeadlineWidget lead={lead} />
      </div>
      <ApplicationTimelineWidget journey={journey} />
    </div>
  );
}
