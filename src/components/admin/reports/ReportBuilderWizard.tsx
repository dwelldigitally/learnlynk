import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Save, X } from 'lucide-react';
import { ReportConfig, DataSource, VisualizationType, FilterCondition } from '@/types/reports';
import { DataSourceStep } from './steps/DataSourceStep';
import { FieldsStep } from './steps/FieldsStep';
import { FiltersStep } from './steps/FiltersStep';
import { VisualizationStep } from './steps/VisualizationStep';
import { PreviewStep } from './steps/PreviewStep';
import { useCustomReports } from '@/hooks/useCustomReports';

interface ReportBuilderWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editReport?: ReportConfig & { id?: string };
}

const STEPS = [
  { id: 1, title: 'Data Source', description: 'Choose your data' },
  { id: 2, title: 'Fields', description: 'Select columns' },
  { id: 3, title: 'Filters', description: 'Refine results' },
  { id: 4, title: 'Visualization', description: 'Choose display' },
  { id: 5, title: 'Preview & Save', description: 'Review report' },
];

export function ReportBuilderWizard({ open, onOpenChange, editReport }: ReportBuilderWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const { createReport, updateReport } = useCustomReports();
  
  const [config, setConfig] = useState<ReportConfig>(() => editReport || {
    name: '',
    description: '',
    dataSource: '' as DataSource,
    selectedFields: [],
    filters: [],
    visualizationType: 'table',
    chartConfig: {
      aggregation: 'count',
      showLegend: true,
      showGrid: true,
    },
  });

  const progress = (currentStep / STEPS.length) * 100;

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return !!config.dataSource;
      case 2:
        return config.selectedFields.length > 0;
      case 3:
        return true; // Filters are optional
      case 4:
        return !!config.visualizationType;
      case 5:
        return !!config.name;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = async () => {
    if (editReport?.id) {
      await updateReport.mutateAsync({ id: editReport.id, config });
    } else {
      await createReport.mutateAsync(config);
    }
    onOpenChange(false);
    // Reset state
    setCurrentStep(1);
    setConfig({
      name: '',
      description: '',
      dataSource: '' as DataSource,
      selectedFields: [],
      filters: [],
      visualizationType: 'table',
      chartConfig: { aggregation: 'count', showLegend: true, showGrid: true },
    });
  };

  const updateConfig = (updates: Partial<ReportConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <DataSourceStep
            selected={config.dataSource}
            onSelect={(dataSource) => {
              updateConfig({ dataSource, selectedFields: [], filters: [] });
            }}
          />
        );
      case 2:
        return (
          <FieldsStep
            dataSource={config.dataSource}
            selectedFields={config.selectedFields}
            onFieldsChange={(selectedFields) => updateConfig({ selectedFields })}
          />
        );
      case 3:
        return (
          <FiltersStep
            dataSource={config.dataSource}
            filters={config.filters}
            onFiltersChange={(filters) => updateConfig({ filters })}
          />
        );
      case 4:
        return (
          <VisualizationStep
            dataSource={config.dataSource}
            selectedFields={config.selectedFields}
            visualizationType={config.visualizationType}
            chartConfig={config.chartConfig}
            onVisualizationChange={(visualizationType) => updateConfig({ visualizationType })}
            onChartConfigChange={(chartConfig) => updateConfig({ chartConfig: { ...config.chartConfig, ...chartConfig } })}
          />
        );
      case 5:
        return (
          <PreviewStep
            config={config}
            onNameChange={(name) => updateConfig({ name })}
            onDescriptionChange={(description) => updateConfig({ description })}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">
              {editReport?.id ? 'Edit Report' : 'Create Custom Report'}
            </DialogTitle>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Progress indicator */}
          <div className="mt-4 space-y-2">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-sm">
              {STEPS.map((step) => (
                <div
                  key={step.id}
                  className={`flex flex-col items-center ${
                    step.id === currentStep
                      ? 'text-primary font-medium'
                      : step.id < currentStep
                      ? 'text-muted-foreground'
                      : 'text-muted-foreground/50'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs mb-1 ${
                      step.id === currentStep
                        ? 'bg-primary text-primary-foreground'
                        : step.id < currentStep
                        ? 'bg-primary/20 text-primary'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {step.id}
                  </div>
                  <span className="hidden sm:block">{step.title}</span>
                </div>
              ))}
            </div>
          </div>
        </DialogHeader>

        {/* Step content */}
        <div className="flex-1 overflow-y-auto py-4 min-h-[400px]">
          {renderStep()}
        </div>

        {/* Footer navigation */}
        <div className="flex-shrink-0 flex items-center justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <div className="flex gap-2">
            {currentStep === STEPS.length ? (
              <Button
                onClick={handleSave}
                disabled={!canProceed() || createReport.isPending || updateReport.isPending}
              >
                <Save className="h-4 w-4 mr-2" />
                {createReport.isPending || updateReport.isPending ? 'Saving...' : 'Save Report'}
              </Button>
            ) : (
              <Button onClick={handleNext} disabled={!canProceed()}>
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
