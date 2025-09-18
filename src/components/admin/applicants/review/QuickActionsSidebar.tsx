import React from 'react';
import { ReviewSession } from '@/types/review';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Save, MessageSquare } from 'lucide-react';

interface QuickActionsSidebarProps {
  session: ReviewSession;
  onAddNote: (note: string) => void;
  onSave: () => void;
}

export function QuickActionsSidebar({ session, onAddNote, onSave }: QuickActionsSidebarProps) {
  return (
    <div className="w-80 border-l p-4 space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center">
            <MessageSquare className="h-4 w-4 mr-2" />
            Quick Notes
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Textarea placeholder="Add a note..." rows={3} />
          <Button size="sm" className="mt-2 w-full">Add Note</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-2">
          <Button variant="outline" size="sm" className="w-full" onClick={onSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Progress
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}