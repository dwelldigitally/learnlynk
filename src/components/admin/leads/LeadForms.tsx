import { useState } from "react";
import { LeadCaptureForm } from "@/components/admin/LeadCaptureForm";
import { FormsOverview } from "./FormsOverview";
import { AdvancedFormBuilder } from "../formBuilder/AdvancedFormBuilder";
import { useIsMobile } from "@/hooks/use-mobile";
import { Input } from "@/components/ui/input";
import { Pencil } from "lucide-react";

export function LeadForms() {
  const isMobile = useIsMobile();
  const [view, setView] = useState<'overview' | 'capture' | 'builder'>('overview');
  const [editingFormId, setEditingFormId] = useState<string | null>(null);
  const [formName, setFormName] = useState<string>('Untitled Form');
  const [isEditingName, setIsEditingName] = useState<boolean>(false);

  const handleCreateForm = () => {
    setEditingFormId(null);
    setFormName('Untitled Form');
    setView('builder');
  };

  const handleEditForm = (formId: string) => {
    setEditingFormId(formId);
    setView('builder');
  };

  const handleBackToOverview = () => {
    setView('overview');
    setEditingFormId(null);
    setIsEditingName(false);
  };

  return (
    <div className="p-4 sm:p-6 md:p-9 w-full max-w-none">
      {view === 'overview' ? (
        <FormsOverview 
          onCreateForm={handleCreateForm}
          onEditForm={handleEditForm}
        />
      ) : view === 'builder' ? (
        <div className="space-y-4 md:space-y-6">
          <div className={`flex items-center gap-4 ${isMobile ? 'flex-col items-start w-full' : ''}`}>
            <button 
              onClick={handleBackToOverview}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back to Forms
            </button>
            <div className="flex items-center gap-2 flex-1">
              {isEditingName ? (
                <Input
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  onBlur={() => setIsEditingName(false)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') setIsEditingName(false);
                    if (e.key === 'Escape') {
                      setFormName(formName);
                      setIsEditingName(false);
                    }
                  }}
                  autoFocus
                  className="text-xl sm:text-2xl font-bold h-auto py-1 px-2 border-primary"
                />
              ) : (
                <h1 
                  className="text-xl sm:text-2xl font-bold text-foreground cursor-pointer hover:text-primary transition-colors flex items-center gap-2 group"
                  onClick={() => setIsEditingName(true)}
                >
                  {formName}
                  <Pencil className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h1>
              )}
            </div>
          </div>
          <AdvancedFormBuilder 
            formId={editingFormId}
            formTitle={formName}
            onFormTitleChange={setFormName}
            onSave={(formConfig) => {
              console.log('Form saved:', formConfig);
              // Handle form save
            }}
            onCancel={handleBackToOverview}
          />
        </div>
      ) : (
        <LeadCaptureForm />
      )}
    </div>
  );
}