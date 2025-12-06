import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AlertTriangle } from 'lucide-react';

interface ProgramChangeConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  oldProgram: string;
  newProgram: string;
  onConfirm: () => void;
}

export function ProgramChangeConfirmDialog({
  open,
  onOpenChange,
  oldProgram,
  newProgram,
  onConfirm
}: ProgramChangeConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Confirm Program Change
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              You are about to change the program interest from{' '}
              <strong>{oldProgram || 'None'}</strong> to{' '}
              <strong>{newProgram}</strong>.
            </p>
            <p className="text-amber-600">
              This may affect:
            </p>
            <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
              <li>Academic journey stage tracking</li>
              <li>Required document checklist</li>
              <li>Available intake dates</li>
              <li>Entry requirements</li>
            </ul>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            Confirm Change
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
