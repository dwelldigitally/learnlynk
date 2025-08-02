import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Plus, FileText, Calendar, BarChart3 } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  suggestions?: string[];
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  actionLabel,
  onAction,
  suggestions = []
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="pb-4">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            {icon || <Users className="h-8 w-8 text-muted-foreground" />}
          </div>
          <CardTitle className="text-xl">{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">{description}</p>
          
          {actionLabel && onAction && (
            <Button onClick={onAction} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              {actionLabel}
            </Button>
          )}
          
          {suggestions.length > 0 && (
            <div className="mt-6 pt-4 border-t">
              <h4 className="text-sm font-medium mb-2">Get started by:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                {suggestions.map((suggestion, index) => (
                  <li key={index}>• {suggestion}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Specific empty states for different sections
export const EmptyLeadsState: React.FC<{ onCreateLead?: () => void }> = ({ onCreateLead }) => (
  <EmptyState
    title="No leads yet"
    description="Start building your pipeline by adding your first lead or importing existing data."
    icon={<Users className="h-8 w-8 text-muted-foreground" />}
    actionLabel="Add First Lead"
    onAction={onCreateLead}
    suggestions={[
      "Import leads from a CSV file",
      "Set up lead capture forms",
      "Configure lead routing rules",
      "Connect external sources"
    ]}
  />
);

export const EmptyStudentsState: React.FC<{ onAddStudent?: () => void }> = ({ onAddStudent }) => (
  <EmptyState
    title="No students enrolled"
    description="Begin managing your institution by adding students and tracking their progress."
    icon={<Users className="h-8 w-8 text-muted-foreground" />}
    actionLabel="Add First Student"
    onAction={onAddStudent}
    suggestions={[
      "Add individual students manually",
      "Import student data in bulk",
      "Set up application forms",
      "Create student programs"
    ]}
  />
);

export const EmptyProgramsState: React.FC<{ onCreateProgram?: () => void }> = ({ onCreateProgram }) => (
  <EmptyState
    title="No programs created"
    description="Design and manage your educational offerings by creating your first program."
    icon={<FileText className="h-8 w-8 text-muted-foreground" />}
    actionLabel="Create First Program"
    onAction={onCreateProgram}
    suggestions={[
      "Define program requirements",
      "Set up intake schedules",
      "Configure fee structures",
      "Create application workflows"
    ]}
  />
);

export const EmptyEventsState: React.FC<{ onCreateEvent?: () => void }> = ({ onCreateEvent }) => (
  <EmptyState
    title="No events scheduled"
    description="Engage your community by creating and managing educational events."
    icon={<Calendar className="h-8 w-8 text-muted-foreground" />}
    actionLabel="Create First Event"
    onAction={onCreateEvent}
    suggestions={[
      "Schedule information sessions",
      "Plan campus tours",
      "Set up webinars",
      "Create networking events"
    ]}
  />
);

export const EmptyAnalyticsState: React.FC = () => (
  <EmptyState
    title="No data to analyze"
    description="Once you start collecting leads and managing students, powerful analytics will appear here."
    icon={<BarChart3 className="h-8 w-8 text-muted-foreground" />}
    suggestions={[
      "Add some leads to get started",
      "Enroll students in programs",
      "Track conversion metrics",
      "Monitor engagement rates"
    ]}
  />
);