import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RealDataTasks } from './RealDataTasks';
import { NotesSystemPanel } from './NotesSystemPanel';
import { CheckSquare, FileText } from 'lucide-react';
import { useLeadTasks } from '@/hooks/useLeadData';

interface TasksNotesPanelProps {
  leadId: string;
}

export function TasksNotesPanel({ leadId }: TasksNotesPanelProps) {
  const [activeSubTab, setActiveSubTab] = useState('tasks');
  const { tasks } = useLeadTasks(leadId);
  
  // Count incomplete tasks for badge
  const incompleteTasks = tasks?.filter(task => task.status !== 'completed').length || 0;

  return (
    <div className="h-full">
      <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="h-full flex flex-col">
        <div className="border-b">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tasks" className="relative">
              <CheckSquare className="h-4 w-4 mr-2" />
              Tasks
              {incompleteTasks > 0 && (
                <Badge 
                  variant="secondary" 
                  className="ml-2 h-5 min-w-[20px] rounded-full px-1.5 text-xs"
                >
                  {incompleteTasks}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="notes">
              <FileText className="h-4 w-4 mr-2" />
              Notes
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="tasks" className="flex-1 mt-0">
          <RealDataTasks leadId={leadId} />
        </TabsContent>

        <TabsContent value="notes" className="flex-1 mt-0">
          <NotesSystemPanel leadId={leadId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
