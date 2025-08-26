import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Phone, 
  Mail, 
  Calendar, 
  CheckCircle, 
  Trash2, 
  X 
} from "lucide-react";

interface BulkActionsToolbarProps {
  selectedCount: number;
  selectedActionType: string;
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
  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="flex items-center gap-2 bg-background border rounded-lg shadow-lg p-3">
        <Badge variant="secondary" className="mr-2">
          {selectedCount} selected
        </Badge>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onBulkCall}
          className="flex items-center gap-1"
        >
          <Phone className="h-4 w-4" />
          Call
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onBulkEmail}
          className="flex items-center gap-1"
        >
          <Mail className="h-4 w-4" />
          Email
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onBulkSchedule}
          className="flex items-center gap-1"
        >
          <Calendar className="h-4 w-4" />
          Schedule
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onBulkComplete}
          className="flex items-center gap-1"
        >
          <CheckCircle className="h-4 w-4" />
          Complete
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onBulkDelete}
          className="flex items-center gap-1"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onClearSelection}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}