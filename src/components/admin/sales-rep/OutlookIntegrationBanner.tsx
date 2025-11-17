import { AlertCircle, Calendar as CalendarIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useState } from 'react';

export function OutlookIntegrationBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <Alert className="mb-4 border-blue-500/50 bg-blue-500/10">
      <CalendarIcon className="h-4 w-4 text-blue-500" />
      <AlertDescription className="flex items-center justify-between">
        <div className="flex-1">
          <p className="font-medium text-sm mb-1">Outlook Calendar Integration</p>
          <p className="text-xs text-muted-foreground">
            Connect your Outlook calendar for two-way sync, automatic meeting links, and real-time availability updates.
          </p>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <Button 
            variant="outline" 
            size="sm"
            disabled
            className="whitespace-nowrap"
          >
            Connect Outlook (Coming Soon)
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => setIsVisible(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}
