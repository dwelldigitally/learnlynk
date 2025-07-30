import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Plus, 
  X, 
  FileText, 
  Upload,
  Edit,
  Trash2,
  GripVertical,
  AlertCircle,
  CheckCircle,
  Copy
} from "lucide-react";
import { Program, DocumentRequirement } from "@/types/program";
import { programRequirements } from "@/data/programRequirements";

interface DocumentsStepProps {
  data: Partial<Program>;
  onDataChange: (data: Partial<Program>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const FILE_FORMATS = [
  { value: 'PDF', label: 'PDF', color: 'bg-red-500' },
  { value: 'JPG', label: 'JPG', color: 'bg-blue-500' },
  { value: 'PNG', label: 'PNG', color: 'bg-green-500' },
  { value: 'DOC', label: 'DOC', color: 'bg-blue-600' },
  { value: 'DOCX', label: 'DOCX', color: 'bg-blue-600' },
  { value: 'XLS', label: 'XLS', color: 'bg-green-600' },
  { value: 'XLSX', label: 'XLSX', color: 'bg-green-600' }
];

const DOCUMENT_STAGES = [
  { value: 'APPLICATION', label: 'Application Submission' },
  { value: 'SEND_DOCUMENTS', label: 'Document Upload' },
  { value: 'INTERVIEW', label: 'Interview Stage' },
  { value: 'ACCEPTANCE', label: 'Post-Acceptance' },
  { value: 'ENROLLMENT', label: 'Enrollment' }
];

const DocumentsStep: React.FC<DocumentsStepProps> = ({
  data,
  onDataChange,
  onNext,
  onPrevious
}) => {
  const [editingDocument, setEditingDocument] = useState<DocumentRequirement | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const addDocument = (document: Omit<DocumentRequirement, 'id' | 'order'>) => {
    const newDocument: DocumentRequirement = {
      ...document,
      id: `doc_${Date.now()}_${Math.random()}`,
      order: data.documentRequirements?.length || 0
    };

    onDataChange({
      documentRequirements: [...(data.documentRequirements || []), newDocument]
    });

    setShowAddForm(false);
    setEditingDocument(null);
  };

  const updateDocument = (id: string, updates: Partial<DocumentRequirement>) => {
    onDataChange({
      documentRequirements: data.documentRequirements?.map(doc => 
        doc.id === id ? { ...doc, ...updates } : doc
      )
    });
  };

  const removeDocument = (id: string) => {
    onDataChange({
      documentRequirements: data.documentRequirements?.filter(doc => doc.id !== id)
        .map((doc, index) => ({ ...doc, order: index }))
    });
  };

  const duplicateDocument = (document: DocumentRequirement) => {
    const duplicate: DocumentRequirement = {
      ...document,
      id: `doc_${Date.now()}_${Math.random()}`,
      name: `${document.name} (Copy)`,
      order: data.documentRequirements?.length || 0
    };

    onDataChange({
      documentRequirements: [...(data.documentRequirements || []), duplicate]
    });
  };

  const reorderDocuments = (fromIndex: number, toIndex: number) => {
    if (!data.documentRequirements) return;

    const newDocuments = [...data.documentRequirements];
    const [removed] = newDocuments.splice(fromIndex, 1);
    newDocuments.splice(toIndex, 0, removed);

    // Update order values
    const reorderedDocuments = newDocuments.map((doc, index) => ({
      ...doc,
      order: index
    }));

    onDataChange({ documentRequirements: reorderedDocuments });
  };

  const importFromTemplate = (programType: string) => {
    const templateDocs = programRequirements[programType];
    if (!templateDocs) return;

    const importedDocs: DocumentRequirement[] = templateDocs.map((doc, index) => ({
      id: `doc_${Date.now()}_${index}`,
      name: doc.name,
      description: doc.description,
      mandatory: doc.mandatory,
      acceptedFormats: doc.acceptedFormats,
      maxSize: doc.maxSize,
      stage: doc.stage,
      order: (data.documentRequirements?.length || 0) + index
    }));

    onDataChange({
      documentRequirements: [...(data.documentRequirements || []), ...importedDocs]
    });
  };

  const DocumentForm: React.FC<{
    document?: DocumentRequirement;
    onSave: (doc: Omit<DocumentRequirement, 'id' | 'order'>) => void;
    onCancel: () => void;
  }> = ({ document, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Omit<DocumentRequirement, 'id' | 'order'>>({
      name: document?.name || '',
      description: document?.description || '',
      mandatory: document?.mandatory ?? true,
      acceptedFormats: document?.acceptedFormats || ['PDF'],
      maxSize: document?.maxSize || 10,
      stage: document?.stage || 'SEND_DOCUMENTS',
      instructions: document?.instructions || '',
      examples: document?.examples || []
    });

    const [exampleInput, setExampleInput] = useState('');

    const toggleFormat = (format: string) => {
      setFormData(prev => ({
        ...prev,
        acceptedFormats: prev.acceptedFormats.includes(format)
          ? prev.acceptedFormats.filter(f => f !== format)
          : [...prev.acceptedFormats, format]
      }));
    };

    const addExample = () => {
      if (exampleInput.trim()) {
        setFormData(prev => ({
          ...prev,
          examples: [...(prev.examples || []), exampleInput.trim()]
        }));
        setExampleInput('');
      }
    };

    const removeExample = (index: number) => {
      setFormData(prev => ({
        ...prev,
        examples: prev.examples?.filter((_, i) => i !== index)
      }));
    };

    return (
      <Card>
        <CardHeader>
          <CardTitle>
            {document ? 'Edit Document Requirement' : 'Add Document Requirement'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Document Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Official Transcripts"
              />
            </div>

            <div className="space-y-2">
              <Label>Stage *</Label>
              <Select
                value={formData.stage}
                onValueChange={(value) => setFormData(prev => ({ ...prev, stage: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DOCUMENT_STAGES.map(stage => (
                    <SelectItem key={stage.value} value={stage.value}>
                      {stage.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description *</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe what this document is and why it's needed..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Checkbox
                  checked={formData.mandatory}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, mandatory: !!checked }))
                  }
                />
                Mandatory Document
              </Label>
            </div>

            <div className="space-y-2">
              <Label>Maximum File Size (MB)</Label>
              <Input
                type="number"
                value={formData.maxSize}
                onChange={(e) => setFormData(prev => ({ ...prev, maxSize: Number(e.target.value) }))}
                min="1"
                max="100"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Accepted File Formats</Label>
            <div className="flex flex-wrap gap-2">
              {FILE_FORMATS.map(format => (
                <Button
                  key={format.value}
                  variant={formData.acceptedFormats.includes(format.value) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleFormat(format.value)}
                  className="h-8"
                >
                  {format.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Upload Instructions</Label>
            <Textarea
              value={formData.instructions || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
              placeholder="Specific instructions for students on how to upload this document..."
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label>Examples/Templates</Label>
            <div className="flex gap-2">
              <Input
                value={exampleInput}
                onChange={(e) => setExampleInput(e.target.value)}
                placeholder="Add example or template link"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addExample();
                  }
                }}
              />
              <Button onClick={addExample} disabled={!exampleInput.trim()}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.examples?.map((example, index) => (
                <Badge key={index} variant="outline" className="flex items-center gap-1">
                  {example}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => removeExample(index)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button 
              onClick={() => onSave(formData)}
              disabled={!formData.name || !formData.description || formData.acceptedFormats.length === 0}
            >
              {document ? 'Update' : 'Add'} Document
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const sortedDocuments = data.documentRequirements?.sort((a, b) => a.order - b.order) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Document Requirements</h3>
          <p className="text-sm text-muted-foreground">
            Define what documents students need to submit and when
          </p>
        </div>
        <div className="flex gap-2">
          <Select onValueChange={importFromTemplate}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Import from template" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(programRequirements).map(programType => (
                <SelectItem key={programType} value={programType}>
                  {programType}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={() => setShowAddForm(true)} disabled={showAddForm}>
            <Plus className="h-4 w-4 mr-2" />
            Add Document
          </Button>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <DocumentForm
          onSave={addDocument}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {editingDocument && (
        <DocumentForm
          document={editingDocument}
          onSave={(updatedDoc) => {
            updateDocument(editingDocument.id, updatedDoc);
            setEditingDocument(null);
          }}
          onCancel={() => setEditingDocument(null)}
        />
      )}

      {/* Documents List */}
      {sortedDocuments.length > 0 ? (
        <div className="space-y-4">
          {DOCUMENT_STAGES.map(stage => {
            const stageDocuments = sortedDocuments.filter(doc => doc.stage === stage.value);
            if (stageDocuments.length === 0) return null;

            return (
              <Card key={stage.value}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    {stage.label}
                    <Badge variant="secondary" className="text-xs">
                      {stageDocuments.length} document{stageDocuments.length !== 1 ? 's' : ''}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {stageDocuments.map((document, index) => (
                    <Card 
                      key={document.id} 
                      className="border-l-4 border-l-primary"
                      draggable
                      onDragStart={(e) => {
                        setDraggedIndex(document.order);
                        e.dataTransfer.effectAllowed = "move";
                      }}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        if (draggedIndex !== null) {
                          reorderDocuments(draggedIndex, document.order);
                          setDraggedIndex(null);
                        }
                      }}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium">{document.name}</h4>
                                {document.mandatory ? (
                                  <Badge variant="destructive" className="text-xs">Required</Badge>
                                ) : (
                                  <Badge variant="secondary" className="text-xs">Optional</Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {document.description}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingDocument(document)}
                              className="h-7 w-7 p-0"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => duplicateDocument(document)}
                              className="h-7 w-7 p-0"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => removeDocument(document.id)}
                              className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-2">
                          {document.acceptedFormats.map(format => (
                            <Badge key={format} variant="outline" className="text-xs">
                              {format}
                            </Badge>
                          ))}
                          <Badge variant="outline" className="text-xs">
                            Max {document.maxSize}MB
                          </Badge>
                        </div>
                        
                        {document.instructions && (
                          <div className="mt-2 p-2 bg-muted rounded text-xs">
                            <strong>Instructions:</strong> {document.instructions}
                          </div>
                        )}
                        
                        {document.examples && document.examples.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs font-medium text-muted-foreground mb-1">Examples:</p>
                            <div className="flex flex-wrap gap-1">
                              {document.examples.map((example, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {example}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="border-dashed">
          <CardContent className="p-8 text-center">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Documents Required Yet</h3>
            <p className="text-muted-foreground mb-4">
              Add document requirements to specify what students need to submit for their application.
            </p>
            <div className="flex gap-2 justify-center">
              <Select onValueChange={importFromTemplate}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Import from template" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(programRequirements).map(programType => (
                    <SelectItem key={programType} value={programType}>
                      {programType}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={() => setShowAddForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Document
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary */}
      {sortedDocuments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Document Requirements Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">
                  {sortedDocuments.length}
                </div>
                <div className="text-sm text-muted-foreground">Total Documents</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-destructive">
                  {sortedDocuments.filter(d => d.mandatory).length}
                </div>
                <div className="text-sm text-muted-foreground">Required</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {sortedDocuments.filter(d => !d.mandatory).length}
                </div>
                <div className="text-sm text-muted-foreground">Optional</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {new Set(sortedDocuments.map(d => d.stage)).size}
                </div>
                <div className="text-sm text-muted-foreground">Stages</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DocumentsStep;