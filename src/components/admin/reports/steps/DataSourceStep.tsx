import React from 'react';
import { Card } from '@/components/ui/card';
import { DATA_SOURCES, DataSource } from '@/types/reports';
import { 
  Users, GraduationCap, FileText, BookOpen, Calendar, 
  DollarSign, MessageSquare, CheckSquare, Megaphone, ClipboardList 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DataSourceStepProps {
  selected: DataSource;
  onSelect: (source: DataSource) => void;
}

const ICONS: Record<string, React.ElementType> = {
  Users,
  GraduationCap,
  FileText,
  BookOpen,
  Calendar,
  DollarSign,
  MessageSquare,
  CheckSquare,
  Megaphone,
  ClipboardList,
};

export function DataSourceStep({ selected, onSelect }: DataSourceStepProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">Choose a Data Source</h3>
        <p className="text-sm text-muted-foreground">
          Select the type of data you want to analyze in your report
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {DATA_SOURCES.map((source) => {
          const Icon = ICONS[source.icon] || FileText;
          const isSelected = selected === source.id;

          return (
            <Card
              key={source.id}
              className={cn(
                'p-4 cursor-pointer transition-all hover:shadow-md hover:border-primary/50',
                isSelected && 'ring-2 ring-primary border-primary bg-primary/5'
              )}
              onClick={() => onSelect(source.id)}
            >
              <div className="flex flex-col items-center text-center gap-2">
                <div
                  className={cn(
                    'w-12 h-12 rounded-xl flex items-center justify-center',
                    isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  )}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">{source.name}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {source.description}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {selected && (
        <div className="p-4 bg-muted/50 rounded-lg">
          <p className="text-sm">
            <span className="font-medium">Selected:</span>{' '}
            {DATA_SOURCES.find(s => s.id === selected)?.name} -{' '}
            {DATA_SOURCES.find(s => s.id === selected)?.fields.length} available fields
          </p>
        </div>
      )}
    </div>
  );
}
