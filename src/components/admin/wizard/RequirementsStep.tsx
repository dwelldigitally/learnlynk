import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  GraduationCap, 
  Languages, 
  Briefcase,
  Heart,
  Calendar,
  AlertCircle,
  Edit,
  Trash2,
  Library,
  FileText,
  Users
} from "lucide-react";
import { Program, EntryRequirement } from "@/types/program";
import { RequirementLibrarySelector } from "./RequirementLibrarySelector";
import { RequirementConfigDialog } from "./RequirementConfigDialog";

interface RequirementsStepProps {
  data: Partial<Program>;
  onDataChange: (data: Partial<Program>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const REQUIREMENT_TYPES = [
  { value: 'academic', label: 'Academic', icon: GraduationCap, color: 'bg-blue-500' },
  { value: 'language', label: 'Language', icon: Languages, color: 'bg-green-500' },
  { value: 'experience', label: 'Experience', icon: Briefcase, color: 'bg-orange-500' },
  { value: 'health', label: 'Health', icon: Heart, color: 'bg-red-500' },
  { value: 'age', label: 'Age', icon: Calendar, color: 'bg-purple-500' },
  { value: 'other', label: 'Other', icon: AlertCircle, color: 'bg-gray-500' }
];

const RequirementsStep: React.FC<RequirementsStepProps> = ({
  data,
  onDataChange,
  onNext,
  onPrevious
}) => {
  const [editingRequirement, setEditingRequirement] = useState<EntryRequirement | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedLibraryReq, setSelectedLibraryReq] = useState<any>(null);
  const [showConfigDialog, setShowConfigDialog] = useState(false);

  const addRequirement = (requirement: Omit<EntryRequirement, 'id'>) => {
    const newRequirement: EntryRequirement = {
      ...requirement,
      id: `req_${Date.now()}_${Math.random()}`
    };

    onDataChange({
      entryRequirements: [...(data.entryRequirements || []), newRequirement]
    });

    setShowAddForm(false);
    setEditingRequirement(null);
  };

  const addLibraryRequirement = (libraryReq: any, config: EntryRequirement['programSpecific']) => {
    const newRequirement: EntryRequirement = {
      id: `req_${Date.now()}_${Math.random()}`,
      type: libraryReq.type,
      title: libraryReq.title,
      description: libraryReq.description,
      mandatory: config?.mandatoryOverride !== undefined ? !config.mandatoryOverride : libraryReq.mandatory,
      details: libraryReq.details,
      minimumGrade: libraryReq.minimum_grade,
      alternatives: libraryReq.alternatives || [],
      linkedDocumentTemplates: libraryReq.linked_document_templates || [],
      programSpecific: {
        masterRequirementId: libraryReq.id,
        ...config
      }
    };

    onDataChange({
      entryRequirements: [...(data.entryRequirements || []), newRequirement]
    });
  };

  const handleLibrarySelect = (libraryReq: any) => {
    setSelectedLibraryReq(libraryReq);
    setShowConfigDialog(true);
  };

  const handleConfigSave = (config: EntryRequirement['programSpecific']) => {
    if (selectedLibraryReq && config) {
      addLibraryRequirement(selectedLibraryReq, config);
    }
    setSelectedLibraryReq(null);
  };

  const updateRequirement = (id: string, updates: Partial<EntryRequirement>) => {
    onDataChange({
      entryRequirements: data.entryRequirements?.map(req => 
        req.id === id ? { ...req, ...updates } : req
      )
    });
  };

  const removeRequirement = (id: string) => {
    onDataChange({
      entryRequirements: data.entryRequirements?.filter(req => req.id !== id)
    });
  };

  const RequirementForm: React.FC<{
    requirement?: EntryRequirement;
    onSave: (req: Omit<EntryRequirement, 'id'>) => void;
    onCancel: () => void;
  }> = ({ requirement, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Omit<EntryRequirement, 'id'>>({
      type: requirement?.type || 'academic',
      title: requirement?.title || '',
      description: requirement?.description || '',
      mandatory: requirement?.mandatory ?? true,
      details: requirement?.details || '',
      minimumGrade: requirement?.minimumGrade || '',
      alternatives: requirement?.alternatives || []
    });

    const [alternativeInput, setAlternativeInput] = useState('');
    const [showProgramSpecific, setShowProgramSpecific] = useState(false);
    const [programSpecific, setProgramSpecific] = useState<EntryRequirement['programSpecific']>(
      requirement?.programSpecific || {
        applicableTo: 'both',
        thresholds: {}
      }
    );

    const addAlternative = () => {
      if (alternativeInput.trim()) {
        setFormData(prev => ({
          ...prev,
          alternatives: [...(prev.alternatives || []), alternativeInput.trim()]
        }));
        setAlternativeInput('');
      }
    };

    const removeAlternative = (index: number) => {
      setFormData(prev => ({
        ...prev,
        alternatives: prev.alternatives?.filter((_, i) => i !== index)
      }));
    };

    const handleSave = () => {
      onSave({
        ...formData,
        programSpecific: showProgramSpecific ? programSpecific : undefined
      });
    };

    return (
      <Card>
        <CardHeader>
          <CardTitle>
            {requirement ? 'Edit Requirement' : 'Create Custom Requirement'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Requirement Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value: any) => setFormData(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger className="min-h-[44px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {REQUIREMENT_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <type.icon className="h-4 w-4" />
                        {type.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 min-h-[44px] items-center">
                <Checkbox
                  checked={formData.mandatory}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, mandatory: !!checked }))
                  }
                />
                Mandatory Requirement
              </Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Title *</Label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., High School Diploma"
            />
          </div>

          <div className="space-y-2">
            <Label>Description *</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Detailed description of this requirement..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Additional Details</Label>
            <Textarea
              value={formData.details || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, details: e.target.value }))}
              placeholder="Any additional information or specific conditions..."
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label>Alternative Requirements</Label>
            <div className="flex gap-2">
              <Input
                value={alternativeInput}
                onChange={(e) => setAlternativeInput(e.target.value)}
                placeholder="Enter alternative requirement"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addAlternative();
                  }
                }}
              />
              <Button onClick={addAlternative} disabled={!alternativeInput.trim()}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.alternatives?.map((alt, index) => (
                <Badge key={index} variant="outline" className="flex items-center gap-1">
                  {alt}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => removeAlternative(index)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          {/* Program-specific thresholds section */}
          <div className="border-t pt-4">
            <div className="flex items-center space-x-2 mb-3">
              <Checkbox
                id="show-program-specific"
                checked={showProgramSpecific}
                onCheckedChange={(checked) => setShowProgramSpecific(!!checked)}
              />
              <Label htmlFor="show-program-specific" className="cursor-pointer">
                Add program-specific thresholds
              </Label>
            </div>

            {showProgramSpecific && programSpecific && (
              <Card>
                <CardContent className="pt-4 space-y-4">
                  <div className="space-y-2">
                    <Label>Applicable To</Label>
                    <Select
                      value={programSpecific.applicableTo}
                      onValueChange={(value: any) =>
                        setProgramSpecific(prev => prev ? { ...prev, applicableTo: value } : { applicableTo: value, thresholds: {} })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="both">Both Domestic & International</SelectItem>
                        <SelectItem value="domestic">Domestic Only</SelectItem>
                        <SelectItem value="international">International Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {programSpecific.applicableTo !== 'international' && (
                    <div className="space-y-2">
                      <Label>Domestic Threshold</Label>
                      <Input
                        placeholder="e.g., 70%, 3.0 GPA"
                        value={programSpecific.thresholds?.domestic?.value || ''}
                        onChange={(e) =>
                          setProgramSpecific(prev => prev ? ({
                            ...prev,
                            thresholds: {
                              ...prev.thresholds,
                              domestic: { value: e.target.value }
                            }
                          }) : { applicableTo: 'both', thresholds: { domestic: { value: e.target.value } } })
                        }
                      />
                    </div>
                  )}

                  {programSpecific.applicableTo !== 'domestic' && (
                    <div className="space-y-2">
                      <Label>International Threshold</Label>
                      <Input
                        placeholder="e.g., 75%, 3.5 GPA"
                        value={programSpecific.thresholds?.international?.value || ''}
                        onChange={(e) =>
                          setProgramSpecific(prev => prev ? ({
                            ...prev,
                            thresholds: {
                              ...prev.thresholds,
                              international: { value: e.target.value }
                            }
                          }) : { applicableTo: 'both', thresholds: { international: { value: e.target.value } } })
                        }
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onCancel} className="w-full sm:w-auto min-h-[44px]">
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={!formData.title || !formData.description}
              className="w-full sm:w-auto min-h-[44px]"
            >
              {requirement ? 'Update' : 'Add'} Requirement
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const getTypeConfig = (type: string) => {
    return REQUIREMENT_TYPES.find(t => t.value === type) || REQUIREMENT_TYPES[0];
  };

  const getApplicabilityBadge = (req: EntryRequirement) => {
    if (!req.programSpecific?.applicableTo || req.programSpecific.applicableTo === 'both') {
      return <Badge variant="outline" className="text-xs"><Users className="h-3 w-3 mr-1" />All Students</Badge>;
    }
    if (req.programSpecific.applicableTo === 'domestic') {
      return <Badge variant="secondary" className="text-xs">Domestic Only</Badge>;
    }
    return <Badge variant="secondary" className="text-xs">International Only</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold">Program Entry Requirements</h3>
        <p className="text-sm text-muted-foreground">
          Select from the library or create custom admission requirements for this program
        </p>
      </div>

      {/* Tabs for Library vs Custom */}
      <Tabs defaultValue="library" className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-auto">
          <TabsTrigger value="library" className="min-h-[44px]">
            <Library className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Select from Library</span>
            <span className="sm:hidden">Library</span>
          </TabsTrigger>
          <TabsTrigger value="custom" className="min-h-[44px]">
            <Plus className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Create Custom</span>
            <span className="sm:hidden">Custom</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="library" className="space-y-4">
          <RequirementLibrarySelector onSelect={handleLibrarySelect} />
        </TabsContent>

        <TabsContent value="custom" className="space-y-4">
          {!showAddForm ? (
            <Card className="border-dashed">
              <CardContent className="p-8 text-center">
                <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Create Custom Requirement</h3>
                <p className="text-muted-foreground mb-4">
                  Create a one-off requirement specific to this program that won't be added to the library.
                </p>
                <Button onClick={() => setShowAddForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Custom Requirement
                </Button>
              </CardContent>
            </Card>
          ) : (
            <RequirementForm
              onSave={addRequirement}
              onCancel={() => setShowAddForm(false)}
            />
          )}
        </TabsContent>
      </Tabs>

      {/* Edit Form */}
      {editingRequirement && (
        <RequirementForm
          requirement={editingRequirement}
          onSave={(updatedReq) => {
            updateRequirement(editingRequirement.id!, updatedReq);
            setEditingRequirement(null);
          }}
          onCancel={() => setEditingRequirement(null)}
        />
      )}

      {/* Requirements List */}
      {data.entryRequirements && data.entryRequirements.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium">Added Requirements ({data.entryRequirements.length})</h4>
          {REQUIREMENT_TYPES.map(typeConfig => {
            const typeRequirements = data.entryRequirements?.filter(
              req => req.type === typeConfig.value
            ) || [];

            if (typeRequirements.length === 0) return null;

            return (
              <Card key={typeConfig.value}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <div className={`w-3 h-3 rounded-full ${typeConfig.color}`} />
                    <typeConfig.icon className="h-4 w-4" />
                    {typeConfig.label} Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {typeRequirements.map((requirement) => (
                    <Card key={requirement.id} className="border-l-4" style={{ borderLeftColor: typeConfig.color.replace('bg-', '') }}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-medium">{requirement.title}</h4>
                            {requirement.mandatory ? (
                              <Badge variant="destructive" className="text-xs">Required</Badge>
                            ) : (
                              <Badge variant="secondary" className="text-xs">Optional</Badge>
                            )}
                            {getApplicabilityBadge(requirement)}
                            {requirement.programSpecific?.masterRequirementId && (
                              <Badge variant="outline" className="text-xs">
                                <Library className="h-3 w-3 mr-1" />
                                From Library
                              </Badge>
                            )}
                          </div>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingRequirement(requirement)}
                              className="h-7 w-7 p-0"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => removeRequirement(requirement.id!)}
                              className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-2">
                          {requirement.description}
                        </p>

                        {/* Thresholds Display */}
                        {requirement.programSpecific?.thresholds && (
                          <div className="mt-2 p-2 bg-muted/50 rounded text-xs space-y-1">
                            {requirement.programSpecific.thresholds.domestic && (
                              <div>
                                <strong>Domestic:</strong> {requirement.programSpecific.thresholds.domestic.value}
                                {requirement.programSpecific.thresholds.domestic.description && (
                                  <span className="text-muted-foreground ml-1">
                                    ({requirement.programSpecific.thresholds.domestic.description})
                                  </span>
                                )}
                              </div>
                            )}
                            {requirement.programSpecific.thresholds.international && (
                              <div>
                                <strong>International:</strong> {requirement.programSpecific.thresholds.international.value}
                                {requirement.programSpecific.thresholds.international.description && (
                                  <span className="text-muted-foreground ml-1">
                                    ({requirement.programSpecific.thresholds.international.description})
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                        
                        {requirement.linkedDocumentTemplates && requirement.linkedDocumentTemplates.length > 0 && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                            <FileText className="h-3 w-3" />
                            <span>Verified by: {requirement.linkedDocumentTemplates.length} linked template(s)</span>
                          </div>
                        )}

                        {requirement.alternatives && requirement.alternatives.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs font-medium text-muted-foreground mb-1">Alternatives:</p>
                            <div className="flex flex-wrap gap-1">
                              {requirement.alternatives.map((alt, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {alt}
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
      )}

      {/* Config Dialog */}
      <RequirementConfigDialog
        isOpen={showConfigDialog}
        onClose={() => {
          setShowConfigDialog(false);
          setSelectedLibraryReq(null);
        }}
        requirementTitle={selectedLibraryReq?.title || ''}
        onSave={handleConfigSave}
      />
    </div>
  );
};

export default RequirementsStep;
