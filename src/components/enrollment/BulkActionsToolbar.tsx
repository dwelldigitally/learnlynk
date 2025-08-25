import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Phone, Mail, Calendar, CheckCircle, Trash2, UserPlus } from 'lucide-react';

interface BulkActionsToolbarProps {
  selectedCount: number;
  selectedActionType?: string;
  onBulkCall: () => void;
  onBulkEmail: () => void;
  onBulkSchedule: () => void;
  onBulkComplete: () => void;
  onBulkDelete: () => void;
  onClearSelection: () => void;
}

export function BulkActionsToolbar({
  selectedCount,
  selectedActionType,
  onBulkCall,
  onBulkEmail,
  onBulkSchedule,
  onBulkComplete,
  onBulkDelete,
  onClearSelection
}: BulkActionsToolbarProps) {
  
  if (selectedCount === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-background border border-border rounded-lg shadow-lg p-4 min-w-[600px]">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-3">
            <Badge variant="secondary" className="text-sm">
              {selectedCount} action{selectedCount !== 1 ? 's' : ''} selected
            </Badge>
            
            {selectedActionType && selectedActionType !== 'all' && (
              <Badge variant="outline" className="text-sm">
                Type: {selectedActionType}
              </Badge>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {/* Primary Action Buttons */}
            {(!selectedActionType || selectedActionType === 'Call Student') && (
              <Button
                size="sm"
                onClick={onBulkCall}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Phone className="h-4 w-4 mr-1" />
                Call All ({selectedCount})
              </Button>
            )}
            
            {(!selectedActionType || selectedActionType === 'Send Email') && (
              <Button
                size="sm"
                onClick={onBulkEmail}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Mail className="h-4 w-4 mr-1" />
                Email All ({selectedCount})
              </Button>
            )}
            
            {(!selectedActionType || selectedActionType === 'Schedule Meeting') && (
              <Button
                size="sm"
                onClick={onBulkSchedule}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Calendar className="h-4 w-4 mr-1" />
                Schedule All ({selectedCount})
              </Button>
            )}

            {/* Secondary Actions */}
            <Button
              size="sm"
              variant="outline"
              onClick={onBulkComplete}
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Mark Complete
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={onBulkDelete}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>

            <Button
              size="sm"
              variant="ghost"
              onClick={onClearSelection}
            >
              Clear
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}