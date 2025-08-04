import { useState } from "react";
import { LeadCaptureForm } from "@/components/admin/LeadCaptureForm";
import { FormsOverview } from "./FormsOverview";
import { SimpleFormBuilder } from "./SimpleFormBuilder";

export function LeadForms() {
  const [view, setView] = useState<'overview' | 'capture' | 'builder'>('overview');
  const [editingFormId, setEditingFormId] = useState<string | null>(null);

  const handleCreateForm = () => {
    setEditingFormId(null);
    setView('builder');
  };

  const handleEditForm = (formId: string) => {
    setEditingFormId(formId);
    setView('builder');
  };

  const handleBackToOverview = () => {
    setView('overview');
    setEditingFormId(null);
  };

  return (
    <div className="p-6 pt-8 w-full max-w-none">
      {view === 'overview' ? (
        <FormsOverview 
          onCreateForm={handleCreateForm}
          onEditForm={handleEditForm}
        />
      ) : view === 'builder' ? (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={handleBackToOverview}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back to Forms
            </button>
            <h1 className="text-2xl font-bold text-foreground">
              {editingFormId ? 'Edit Form' : 'Create New Form'}
            </h1>
          </div>
          <SimpleFormBuilder formId={editingFormId} />
        </div>
      ) : (
        <LeadCaptureForm />
      )}
    </div>
  );
}