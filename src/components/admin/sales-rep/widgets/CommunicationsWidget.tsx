import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GripVertical, MessageCircle } from 'lucide-react';
import { UnreadCommunications } from '../UnreadCommunications';

export const CommunicationsWidget = () => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="drag-handle cursor-move">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <MessageCircle className="h-5 w-5 text-orange-600" />
            <span>Communications</span>
          </CardTitle>
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto">
        <UnreadCommunications />
      </CardContent>
    </Card>
  );
};
