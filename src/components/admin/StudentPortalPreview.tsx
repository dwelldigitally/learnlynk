import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Monitor, Smartphone, ExternalLink } from 'lucide-react';

interface StudentPortalPreviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StudentPortalPreview({ open, onOpenChange }: StudentPortalPreviewProps) {
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

  const handleOpenInNewTab = () => {
    window.open('/student', '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl h-[90vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Student Portal - Preview</DialogTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleOpenInNewTab}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open in New Tab
              </Button>
              <Button
                variant={viewMode === 'desktop' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('desktop')}
              >
                <Monitor className="h-4 w-4 mr-2" />
                Desktop
              </Button>
              <Button
                variant={viewMode === 'mobile' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('mobile')}
              >
                <Smartphone className="h-4 w-4 mr-2" />
                Mobile
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <div className={`mx-auto border rounded-lg overflow-hidden h-full ${
            viewMode === 'mobile' ? 'max-w-md' : 'w-full'
          }`}>
            <iframe
              src="/student"
              className="w-full h-full border-0"
              title="Student Portal Preview"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}