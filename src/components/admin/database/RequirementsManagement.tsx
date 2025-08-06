import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  GraduationCap, 
  Languages, 
  Briefcase,
  Heart,
  Calendar,
  AlertCircle,
  Copy,
  Filter
} from 'lucide-react';
import { EntryRequirementsService, EntryRequirementFormData } from '@/services/entryRequirementsService';
import { useToast } from '@/hooks/use-toast';
import type { EntryRequirement } from '@/types/program';

const REQUIREMENT_TYPES = [
  { value: 'academic', label: 'Academic', icon: GraduationCap, color: 'text-blue-600' },
  { value: 'language', label: 'Language', icon: Languages, color: 'text-green-600' },
  { value: 'experience', label: 'Experience', icon: Briefcase, color: 'text-orange-600' },
  { value: 'health', label: 'Health', icon: Heart, color: 'text-red-600' },
  { value: 'age', label: 'Age', icon: Calendar, color: 'text-purple-600' },
  { value: 'other', label: 'Other', icon: AlertCircle, color: 'text-gray-600' }
];

interface RequirementFormData extends EntryRequirementFormData {
  id?: string;
}

export const RequirementsManagement = () => {
  const [requirements, setRequirements] = useState<EntryRequirement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterMandatory, setFilterMandatory] = useState<string>('all');
  const [showDialog, setShowDialog] = useState(false);
  const [editingRequirement, setEditingRequirement] = useState<RequirementFormData | null>(null);
  const [alternativeInput, setAlternativeInput] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchRequirements();
  }, []);

  const fetchRequirements = async () => {
    try {
      setIsLoading(true);
      const data = await EntryRequirementsService.getRequirements();
      setRequirements(data);
    } catch (error) {
      console.error('Error fetching requirements:', error);
      toast({
        title: "Error",
        description: "Failed to load requirements. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchRequirements();
      return;
    }

    try {
      const results = await EntryRequirementsService.searchRequirements(searchTerm);
      setRequirements(results);
    } catch (error) {
      console.error('Error searching requirements:', error);
      toast({
        title: "Error",
        description: "Failed to search requirements. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCreateRequirement = async (formData: EntryRequirementFormData) => {
    try {
      await EntryRequirementsService.createRequirement(formData);
      await fetchRequirements();
      setShowDialog(false);
      setEditingRequirement(null);
      toast({
        title: "Success",
        description: "Requirement created successfully.",
      });
    } catch (error) {
      console.error('Error creating requirement:', error);
      toast({
        title: "Error",
        description: "Failed to create requirement. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateRequirement = async (id: string, formData: Partial<EntryRequirementFormData>) => {
    try {
      await EntryRequirementsService.updateRequirement(id, formData);
      await fetchRequirements();
      setShowDialog(false);
      setEditingRequirement(null);
      toast({
        title: "Success",
        description: "Requirement updated successfully.",
      });
    } catch (error) {
      console.error('Error updating requirement:', error);
      toast({
        title: "Error",
        description: "Failed to update requirement. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteRequirement = async (id: string) => {
    if (!confirm('Are you sure you want to delete this requirement?')) {
      return;
    }

    try {
      await EntryRequirementsService.deleteRequirement(id);
      await fetchRequirements();
      toast({
        title: "Success",
        description: "Requirement deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting requirement:', error);
      toast({
        title: "Error",
        description: "Failed to delete requirement. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDuplicateRequirement = async (requirement: EntryRequirement) => {
    const duplicateData: EntryRequirementFormData = {
      title: `${requirement.title} (Copy)`,
      description: requirement.description,
      type: requirement.type,
      mandatory: requirement.mandatory,
      details: requirement.details,
      minimum_grade: requirement.minimumGrade,
      alternatives: requirement.alternatives,
      category: 'Custom',
      applicable_programs: ['All Programs']
    };

    try {
      await EntryRequirementsService.createRequirement(duplicateData);
      await fetchRequirements();
      toast({
        title: "Success",
        description: "Requirement duplicated successfully.",
      });
    } catch (error) {
      console.error('Error duplicating requirement:', error);
      toast({
        title: "Error",
        description: "Failed to duplicate requirement. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getTypeConfig = (type: string) => {
    return REQUIREMENT_TYPES.find(t => t.value === type) || REQUIREMENT_TYPES[0];
  };

  const filteredRequirements = requirements.filter(req => {
    const matchesType = filterType === 'all' || req.type === filterType;
    const matchesMandatory = filterMandatory === 'all' || 
      (filterMandatory === 'required' && req.mandatory) ||
      (filterMandatory === 'optional' && !req.mandatory);
    return matchesType && matchesMandatory;
  });

  const RequirementForm = ({ 
    requirement, 
    onSave, 
    onCancel 
  }: { 
    requirement?: RequirementFormData; 
    onSave: (data: EntryRequirementFormData) => void; 
    onCancel: () => void; 
  }) => {
    const [formData, setFormData] = useState<RequirementFormData>({
      title: requirement?.title || '',
      description: requirement?.description || '',
      type: requirement?.type || 'academic',
      mandatory: requirement?.mandatory ?? true,
      details: requirement?.details || '',
      minimum_grade: requirement?.minimum_grade || '',
      alternatives: requirement?.alternatives || [],
      category: requirement?.category || 'Custom',
      applicable_programs: requirement?.applicable_programs || ['All Programs']
    });

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

    const handleSubmit = () => {
      if (!formData.title || !formData.description) {
        toast({
          title: "Validation Error",
          description: "Title and description are required.",
          variant: "destructive",
        });
        return;
      }

      onSave(formData);
    };

    return (
      <div className="space-y-4">
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
              value={formData.minimum_grade || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, minimum_grade: e.target.value }))}
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
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 ml-1"
                  onClick={() => removeAlternative(index)}
                >
                  ×
                </Button>
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {requirement ? 'Update' : 'Create'} Requirement
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold">Entry Requirements Management</h3>
          <p className="text-muted-foreground">
            Manage standard entry requirements that can be reused across programs
          </p>
        </div>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingRequirement(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Requirement
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingRequirement ? 'Edit Requirement' : 'Create New Requirement'}
              </DialogTitle>
            </DialogHeader>
            <RequirementForm
              requirement={editingRequirement || undefined}
              onSave={editingRequirement ? 
                (data) => handleUpdateRequirement(editingRequirement.id!, data) :
                handleCreateRequirement
              }
              onCancel={() => {
                setShowDialog(false);
                setEditingRequirement(null);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="flex gap-2">
                <Input
                  placeholder="Search requirements..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch();
                    }
                  }}
                />
                <Button onClick={handleSearch} variant="outline">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {REQUIREMENT_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterMandatory} onValueChange={setFilterMandatory}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Requirements</SelectItem>
                  <SelectItem value="required">Required Only</SelectItem>
                  <SelectItem value="optional">Optional Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Requirements List */}
      {isLoading ? (
        <div className="text-center py-8">Loading requirements...</div>
      ) : filteredRequirements.length > 0 ? (
        <div className="grid gap-4">
          {filteredRequirements.map((requirement) => {
            const typeConfig = getTypeConfig(requirement.type);
            return (
              <Card key={requirement.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <typeConfig.icon className={`h-5 w-5 ${typeConfig.color}`} />
                      <div>
                        <CardTitle className="text-base">{requirement.title}</CardTitle>
                        <CardDescription>{requirement.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={requirement.mandatory ? 'destructive' : 'secondary'}>
                        {requirement.mandatory ? 'Required' : 'Optional'}
                      </Badge>
                      <Badge variant="outline">{typeConfig.label}</Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingRequirement({
                            id: requirement.id,
                            title: requirement.title,
                            description: requirement.description,
                            type: requirement.type,
                            mandatory: requirement.mandatory,
                            details: requirement.details,
                            minimum_grade: requirement.minimumGrade,
                            alternatives: requirement.alternatives,
                            category: 'Custom',
                            applicable_programs: ['All Programs']
                          });
                          setShowDialog(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDuplicateRequirement(requirement)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteRequirement(requirement.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                {(requirement.details || requirement.minimumGrade || requirement.alternatives?.length) && (
                  <CardContent className="pt-0">
                    {requirement.minimumGrade && (
                      <p className="text-sm text-muted-foreground">
                        <strong>Minimum Grade:</strong> {requirement.minimumGrade}
                      </p>
                    )}
                    {requirement.details && (
                      <p className="text-sm text-muted-foreground mt-1">
                        <strong>Details:</strong> {requirement.details}
                      </p>
                    )}
                    {requirement.alternatives && requirement.alternatives.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          Alternatives:
                        </p>
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
                )}
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="border-dashed">
          <CardContent className="p-8 text-center">
            <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Requirements Found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || filterType !== 'all' || filterMandatory !== 'all'
                ? 'No requirements match your current filters. Try adjusting your search criteria.'
                : 'Create your first entry requirement to get started.'
              }
            </p>
            <Button onClick={() => setShowDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Requirement
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};