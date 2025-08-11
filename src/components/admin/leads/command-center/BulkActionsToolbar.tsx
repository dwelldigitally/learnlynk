import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  UserPlus, 
  Zap, 
  Clock, 
  Trash2, 
  X, 
  Download,
  AlertTriangle 
} from "lucide-react";
import { useBulkActions } from "@/hooks/useBulkActions";
import { useAIActions } from "@/hooks/useAIActions";

interface BulkActionsToolbarProps {
  selectedItems: string[];
  onClearSelection: () => void;
  onAssign?: (itemIds: string[], advisorId: string) => void;
  onSequenceEnroll?: (itemIds: string[], sequenceId: string) => void;
}

export function BulkActionsToolbar({
  selectedItems,
  onClearSelection,
  onAssign,
  onSequenceEnroll
}: BulkActionsToolbarProps) {
  const { bulkAssign, bulkSnooze, bulkDelete, isProcessing } = useBulkActions();
  const { performAIAssignment, isProcessing: isAIProcessing } = useAIActions();

  const handleAssign = async () => {
    // TODO: Open advisor selection dialog
    await bulkAssign(selectedItems, "advisor-id");
    onClearSelection();
  };

  const handleAIAssign = async () => {
    await performAIAssignment(selectedItems, ["advisor-1", "advisor-2"]);
    onClearSelection();
  };

  const handleSequence = () => {
    // TODO: Open sequence selection dialog
    onSequenceEnroll?.(selectedItems, "sequence-id");
    onClearSelection();
  };

  const handleSnooze = async () => {
    await bulkSnooze(selectedItems, "1 hour");
    onClearSelection();
  };

  const handleDelete = async () => {
    await bulkDelete(selectedItems);
    onClearSelection();
  };

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="flex items-center gap-2 bg-background border rounded-lg shadow-lg p-3">
        <Badge variant="secondary" className="mr-2">
          {selectedItems.length} selected
        </Badge>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleAssign}
          disabled={isProcessing}
        >
          <UserPlus className="h-4 w-4 mr-1" />
          Assign
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleAIAssign}
          disabled={isAIProcessing}
        >
          <Zap className="h-4 w-4 mr-1" />
          AI Assign
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleSequence}
          disabled={isProcessing}
        >
          <AlertTriangle className="h-4 w-4 mr-1" />
          Sequence
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleSnooze}
          disabled={isProcessing}
        >
          <Clock className="h-4 w-4 mr-1" />
          Snooze
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleDelete}
          disabled={isProcessing}
        >
          <Trash2 className="h-4 w-4 mr-1" />
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