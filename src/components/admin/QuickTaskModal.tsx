import { UnifiedTaskDialog } from "@/components/admin/tasks/UnifiedTaskDialog";

interface QuickTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTaskCreated?: () => void;
}

export function QuickTaskModal({ open, onOpenChange, onTaskCreated }: QuickTaskModalProps) {
  return (
    <UnifiedTaskDialog
      open={open}
      onOpenChange={onOpenChange}
      onTaskCreated={onTaskCreated}
      showEntitySearch={true}
    />
  );
}
