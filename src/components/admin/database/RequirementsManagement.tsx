import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CardContent } from '@/components/ui/card';
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
  Filter,
  CheckCircle,
  FileText,
  X
} from 'lucide-react';
import { EntryRequirementsService, EntryRequirementFormData as ServiceFormData } from '@/services/entryRequirementsService';
import { DocumentTemplateService } from '@/services/documentTemplateService';
import type { DocumentTemplate } from '@/services/documentTemplateService';
import { useToast } from '@/hooks/use-toast';
import type { EntryRequirement } from '@/types/program';
import { PageHeader } from '@/components/modern/PageHeader';
import { ModernCard } from '@/components/modern/ModernCard';
import { InfoBadge } from '@/components/modern/InfoBadge';
import { MetadataItem } from '@/components/modern/MetadataItem';

const REQUIREMENT_TYPES = [
  { value: 'academic', label: 'Academic', icon: GraduationCap, color: 'text-blue-600' },
  { value: 'language', label: 'Language', icon: Languages, color: 'text-green-600' },
  { value: 'experience', label: 'Experience', icon: Briefcase, color: 'text-orange-600' },
  { value: 'health', label: 'Health', icon: Heart, color: 'text-red-600' },
  { value: 'age', label: 'Age', icon: Calendar, color: 'text-purple-600' },
  { value: 'other', label: 'Other', icon: AlertCircle, color: 'text-gray-600' }
];

interface RequirementFormData extends ServiceFormData {
  id?: string;
  student_type?: string[];
  linked_document_templates?: string[];
}

export const RequirementsManagement = () => {
  const [requirements, setRequirements] = useState<EntryRequirement[]>([]);
  const [documentTemplates, setDocumentTemplates] = useState<DocumentTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterMandatory, setFilterMandatory] = useState<string>('all');
  const [showDialog, setShowDialog] = useState(false);
  const [editingRequirement, setEditingRequirement] = useState<RequirementFormData | null>(null);
  const [alternativeInput, setAlternativeInput] = useState('');
  const [selectedTemplateIds, setSelectedTemplateIds] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchRequirements();
    fetchDocumentTemplates();
  }, []);

  const fetchDocumentTemplates = async () => {
    try {
      const data = await DocumentTemplateService.getTemplates();
      setDocumentTemplates(data);
    } catch (error) {
      console.error('Error fetching document templates:', error);
    }
  };

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

  const handleCreateRequirement = async (formData: ServiceFormData) => {
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

  const handleUpdateRequirement = async (id: string, formData: Partial<ServiceFormData>) => {
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
    const duplicateData: ServiceFormData = {
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
    onSave: (data: ServiceFormData) => void; 
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
      applicable_programs: requirement?.applicable_programs || ['All Programs'],
      student_type: requirement?.student_type || ['All Students'],
      linked_document_templates: requirement?.linked_document_templates || []
    });

    useEffect(() => {
      if (requirement) {
        setSelectedTemplateIds(requirement.linked_document_templates || []);
      } else {
        setSelectedTemplateIds([]);
      }
    }, [requirement]);

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

      const dataToSave = { ...formData, linked_document_templates: selectedTemplateIds };
      onSave(dataToSave);
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
            <Label>Student Type</Label>
            <Select
              value={formData.student_type?.[0] || 'all'}
              onValueChange={(value) => 
                setFormData(prev => ({ 
                  ...prev, 
                  student_type: value === 'all' ? ['All Students'] : [value]
                }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Students</SelectItem>
                <SelectItem value="domestic">Domestic Students</SelectItem>
                <SelectItem value="international">International Students</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            checked={formData.mandatory}
            onCheckedChange={(checked) => 
              setFormData(prev => ({ ...prev, mandatory: !!checked }))
            }
          />
          <Label>Mandatory Requirement</Label>
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

        <div className="space-y-2">
          <Label>Linked Document Templates</Label>
          <p className="text-xs text-muted-foreground mb-2">
            Select which document types can be used to verify this requirement
          </p>
          
          <Select 
            value="" 
            onValueChange={(templateId) => {
              if (!selectedTemplateIds.includes(templateId)) {
                setSelectedTemplateIds([...selectedTemplateIds, templateId]);
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select document templates..." />
            </SelectTrigger>
            <SelectContent>
              {documentTemplates
                .filter(t => !selectedTemplateIds.includes(t.id))
                .map(template => (
                  <SelectItem key={template.id} value={template.id}>
                    <div className="flex items-center gap-2">
                      <FileText className="h-3 w-3" />
                      {template.name} ({template.category})
                    </div>
                  </SelectItem>
                ))
              }
            </SelectContent>
          </Select>
          
          {selectedTemplateIds.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedTemplateIds.map(templateId => {
                const template = documentTemplates.find(t => t.id === templateId);
                return template ? (
                  <Badge key={templateId} variant="secondary" className="flex items-center gap-1 bg-indigo-50 text-indigo-700 border-indigo-200">
                    <FileText className="h-3 w-3" />
                    {template.name}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 ml-1 hover:bg-transparent"
                      onClick={() => setSelectedTemplateIds(
                        selectedTemplateIds.filter(id => id !== templateId)
                      )}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ) : null;
              })}
            </div>
          )}
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
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <PageHeader
        title="Entry Requirements Management"
        subtitle="Manage standard entry requirements that can be reused across programs"
      />

      <div className="mb-6 flex justify-end">
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button size="lg" onClick={() => setEditingRequirement(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Requirement
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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
      <ModernCard className="mb-6">
        <CardContent className="p-6">
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
      </ModernCard>

      {/* Requirements List */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading requirements...</p>
        </div>
      ) : filteredRequirements.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRequirements.map((requirement) => {
            const typeConfig = getTypeConfig(requirement.type);
            return (
              <ModernCard key={requirement.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center flex-shrink-0">
                        <typeConfig.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base text-foreground mb-1">
                          {requirement.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {requirement.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <InfoBadge variant={requirement.mandatory ? 'destructive' : 'secondary'}>
                            {requirement.mandatory ? 'REQUIRED' : 'OPTIONAL'}
                          </InfoBadge>
                          <InfoBadge variant="default">
                            {typeConfig.label.toUpperCase()}
                          </InfoBadge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 flex-shrink-0">
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
                            applicable_programs: ['All Programs'],
                            linked_document_templates: requirement.linkedDocumentTemplates || []
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
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDeleteRequirement(requirement.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {(requirement.details || requirement.minimumGrade || requirement.alternatives?.length) && (
                    <div className="space-y-2 pt-4 border-t border-border">
                      {requirement.minimumGrade && (
                        <p className="text-sm text-muted-foreground">
                          <strong>Minimum Grade:</strong> {requirement.minimumGrade}
                        </p>
                      )}
                      {requirement.details && (
                        <p className="text-sm text-muted-foreground">
                          <strong>Details:</strong> {requirement.details}
                        </p>
                      )}
                      {requirement.alternatives && requirement.alternatives.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-2">
                            Alternatives:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {requirement.alternatives.map((alt, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {alt}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Linked Document Templates Section */}
                  <div className="pt-3 mt-3 border-t border-border">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-muted-foreground">
                        Verified by Documents:
                      </p>
                      {(!requirement.linkedDocumentTemplates || 
                        requirement.linkedDocumentTemplates.length === 0) && (
                        <div className="flex items-center gap-1 text-xs text-amber-600">
                          <AlertCircle className="w-3 h-3" />
                          <span>No documents linked</span>
                        </div>
                      )}
                    </div>
                    
                    {requirement.linkedDocumentTemplates && 
                     requirement.linkedDocumentTemplates.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {requirement.linkedDocumentTemplates.map(templateId => {
                          const template = documentTemplates.find(t => t.id === templateId);
                          return template ? (
                            <Badge 
                              key={templateId} 
                              variant="outline" 
                              className="text-xs bg-indigo-50 text-indigo-700 border-indigo-200"
                            >
                              <FileText className="w-3 h-3 mr-1" />
                              {template.name}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    )}
                  </div>
                </CardContent>
              </ModernCard>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-muted/30 rounded-lg border-2 border-dashed border-border">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-light mb-4">
            <GraduationCap className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No Requirements Found</h3>
          <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
            {searchTerm || filterType !== 'all' || filterMandatory !== 'all'
              ? 'No requirements match your current filters. Try adjusting your search criteria.'
              : 'Create your first entry requirement to get started.'
            }
          </p>
          <Button size="lg" onClick={() => setShowDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add First Requirement
          </Button>
        </div>
      )}
    </div>
  );
};