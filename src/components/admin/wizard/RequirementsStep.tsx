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
  GraduationCap, 
  Languages, 
  Briefcase,
  Heart,
  Calendar,
  AlertCircle,
  Edit,
  Trash2
} from "lucide-react";
import { Program, EntryRequirement } from "@/types/program";

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

  const duplicateRequirement = (requirement: EntryRequirement) => {
    const duplicate: EntryRequirement = {
      ...requirement,
      id: `req_${Date.now()}_${Math.random()}`,
      title: `${requirement.title} (Copy)`
    };

    onDataChange({
      entryRequirements: [...(data.entryRequirements || []), duplicate]
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

    return (
      <Card>
        <CardHeader>
          <CardTitle>
            {requirement ? 'Edit Requirement' : 'Add New Requirement'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Requirement Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value: any) => setFormData(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
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
              <Label className="flex items-center gap-2">
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

          {formData.type === 'academic' && (
            <div className="space-y-2">
              <Label>Minimum Grade/GPA</Label>
              <Input
                value={formData.minimumGrade || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, minimumGrade: e.target.value }))}
                placeholder="e.g., 70%, 3.0 GPA, Grade 12"
              />
            </div>
          )}

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

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button 
              onClick={() => onSave(formData)}
              disabled={!formData.title || !formData.description}
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Program Entry Requirements</h3>
          <p className="text-sm text-muted-foreground">
            Define the admission criteria and prerequisites for this program
          </p>
        </div>
        <Button onClick={() => setShowAddForm(true)} disabled={showAddForm}>
          <Plus className="h-4 w-4 mr-2" />
          Add Requirement
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <RequirementForm
          onSave={addRequirement}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {editingRequirement && (
        <RequirementForm
          requirement={editingRequirement}
          onSave={(updatedReq) => {
            updateRequirement(editingRequirement.id, updatedReq);
            setEditingRequirement(null);
          }}
          onCancel={() => setEditingRequirement(null)}
        />
      )}

      {/* Requirements List */}
      {data.entryRequirements && data.entryRequirements.length > 0 ? (
        <div className="space-y-4">
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
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{requirement.title}</h4>
                            {requirement.mandatory ? (
                              <Badge variant="destructive" className="text-xs">Required</Badge>
                            ) : (
                              <Badge variant="secondary" className="text-xs">Optional</Badge>
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
                              onClick={() => duplicateRequirement(requirement)}
                              className="h-7 w-7 p-0"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => removeRequirement(requirement.id)}
                              className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-2">
                          {requirement.description}
                        </p>
                        
                        {requirement.minimumGrade && (
                          <p className="text-xs text-muted-foreground">
                            <strong>Minimum Grade:</strong> {requirement.minimumGrade}
                          </p>
                        )}
                        
                        {requirement.details && (
                          <p className="text-xs text-muted-foreground mt-1">
                            <strong>Details:</strong> {requirement.details}
                          </p>
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
      ) : (
        <Card className="border-dashed">
          <CardContent className="p-8 text-center">
            <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Requirements Added</h3>
            <p className="text-muted-foreground mb-4">
              Add entry requirements to help students understand what they need to qualify for this program.
            </p>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Requirement
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Common Requirements Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick Add Common Requirements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { type: 'academic', title: 'High School Diploma', desc: 'Grade 12 completion or equivalent' },
              { type: 'language', title: 'English Proficiency', desc: 'IELTS 6.5 or equivalent' },
              { type: 'experience', title: 'Work Experience', desc: 'Relevant industry experience' },
              { type: 'health', title: 'Medical Clearance', desc: 'Health requirements for program' },
              { type: 'age', title: 'Minimum Age', desc: 'Age requirements' },
              { type: 'other', title: 'Background Check', desc: 'Criminal background verification' }
            ].map((template) => (
              <Button
                key={template.title}
                variant="outline"
                className="h-auto p-3 flex flex-col items-start text-left"
                onClick={() => {
                  const typeConfig = getTypeConfig(template.type);
                  addRequirement({
                    type: template.type as any,
                    title: template.title,
                    description: template.desc,
                    mandatory: true
                  });
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  {React.createElement(getTypeConfig(template.type).icon, { className: "h-4 w-4" })}
                  <span className="font-medium text-sm">{template.title}</span>
                </div>
                <span className="text-xs text-muted-foreground">{template.desc}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RequirementsStep;