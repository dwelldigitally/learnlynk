import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { BenchmarkControls } from './BenchmarkControls';
import { useBenchmarkSettings } from '@/hooks/useBenchmarkSettings';

interface BenchmarkSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BenchmarkSettingsDialog({ open, onOpenChange }: BenchmarkSettingsDialogProps) {
  const { settings, alertSettings, saveSettings, resetSettings } = useBenchmarkSettings();

  const handleSave = async (newSettings: any, newAlertSettings: any) => {
    await saveSettings(newSettings, newAlertSettings);
    onOpenChange(false);
  };

  const handleReset = () => {
    resetSettings();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Configure Performance Benchmarks</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <BenchmarkControls
            initialSettings={settings}
            initialAlertSettings={alertSettings}
            onSave={handleSave}
            onReset={handleReset}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}