import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, FileText, Download, Upload, Trash2, Edit, Copy, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { DocumentTemplate, DocumentTemplateService, DocumentTemplateFormData } from '@/services/documentTemplateService';
import { useToast } from '@/hooks/use-toast';

const DOCUMENT_CATEGORIES = [
  'Academic Documents',
  'Language Proficiency', 
  'Experience Documents',
  'Health & Safety',
  'Identity & Legal',
  'Financial Documents',
  'Portfolio & Creative',
  'References'
];

const DOCUMENT_TYPES = [
  'academic',
  'language',
  'experience', 
  'health',
  'identity',
  'financial',
  'portfolio',
  'references',
  'other'
];

const STAGES = [
  'application',
  'enrollment',
  'pre-arrival',
  'ongoing'
];

const FILE_FORMATS = [
  'pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png', 'gif', 'zip', 'rar'
];

export function DocumentTemplatesManagement() {
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<DocumentTemplate[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [mandatoryFilter, setMandatoryFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>({});
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<DocumentTemplate | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState<DocumentTemplateFormData>({
    name: '',
    description: '',
    type: 'academic',
    category: 'Academic Documents',
    mandatory: false,
    accepted_formats: ['pdf'],
    max_size: 5,
    stage: 'application',
    instructions: '',
    examples: [],
    applicable_programs: ['All Programs']
  });

  useEffect(() => {
    loadTemplates();
    loadStats();
  }, []);

  useEffect(() => {
    filterTemplates();
  }, [templates, searchTerm, selectedCategory, selectedType, selectedStage, mandatoryFilter]);

  const loadTemplates = async () => {
    try {
      const data = await DocumentTemplateService.getTemplates();
      setTemplates(data);
    } catch (error) {
      toast({
        title: "Error loading templates",
        description: "Failed to load document templates",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const data = await DocumentTemplateService.getTemplateStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const filterTemplates = () => {
    let filtered = templates;

    if (searchTerm) {
      filtered = filtered.filter(template =>
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(template => template.category === selectedCategory);
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(template => template.type === selectedType);
    }

    if (selectedStage !== 'all') {
      filtered = filtered.filter(template => template.stage === selectedStage);
    }

    if (mandatoryFilter !== 'all') {
      filtered = filtered.filter(template => 
        mandatoryFilter === 'mandatory' ? template.mandatory : !template.mandatory
      );
    }

    setFilteredTemplates(filtered);
  };

  const handleCreateTemplate = async () => {
    try {
      await DocumentTemplateService.createTemplate(formData);
      toast({
        title: "Template created",
        description: "Document template has been created successfully"
      });
      setShowCreateDialog(false);
      resetForm();
      loadTemplates();
      loadStats();
    } catch (error) {
      toast({
        title: "Error creating template",
        description: "Failed to create document template",
        variant: "destructive"
      });
    }
  };

  const handleUpdateTemplate = async () => {
    if (!editingTemplate) return;
    
    try {
      await DocumentTemplateService.updateTemplate(editingTemplate.id, formData);
      toast({
        title: "Template updated",
        description: "Document template has been updated successfully"
      });
      setEditingTemplate(null);
      resetForm();
      loadTemplates();
    } catch (error) {
      toast({
        title: "Error updating template",
        description: "Failed to update document template",
        variant: "destructive"
      });
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    try {
      await DocumentTemplateService.deleteTemplate(id);
      toast({
        title: "Template deleted",
        description: "Document template has been deleted successfully"
      });
      loadTemplates();
      loadStats();
    } catch (error) {
      toast({
        title: "Error deleting template",
        description: "Failed to delete document template",
        variant: "destructive"
      });
    }
  };

  const handleDuplicateTemplate = (template: DocumentTemplate) => {
    setFormData({
      name: `${template.name} (Copy)`,
      description: template.description,
      type: template.type,
      category: template.category,
      mandatory: template.mandatory,
      accepted_formats: template.accepted_formats,
      max_size: template.max_size,
      stage: template.stage,
      instructions: template.instructions,
      examples: template.examples || [],
      applicable_programs: template.applicable_programs
    });
    setShowCreateDialog(true);
  };

  const handleEditTemplate = (template: DocumentTemplate) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      description: template.description,
      type: template.type,
      category: template.category,
      mandatory: template.mandatory,
      accepted_formats: template.accepted_formats,
      max_size: template.max_size,
      stage: template.stage,
      instructions: template.instructions,
      examples: template.examples || [],
      applicable_programs: template.applicable_programs
    });
    setShowCreateDialog(true);
  };

  const addSampleTemplates = async () => {
    try {
      await DocumentTemplateService.addSampleTemplates();
      toast({
        title: "Sample templates added",
        description: "Sample document templates have been added successfully"
      });
      loadTemplates();
      loadStats();
    } catch (error) {
      toast({
        title: "Error adding samples",
        description: "Failed to add sample templates",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      type: 'academic',
      category: 'Academic Documents',
      mandatory: false,
      accepted_formats: ['pdf'],
      max_size: 5,
      stage: 'application',
      instructions: '',
      examples: [],
      applicable_programs: ['All Programs']
    });
  };

  const getStageColor = (stage: string) => {
    const colors = {
      application: 'bg-blue-100 text-blue-800',
      enrollment: 'bg-green-100 text-green-800',
      'pre-arrival': 'bg-yellow-100 text-yellow-800',
      ongoing: 'bg-purple-100 text-purple-800'
    };
    return colors[stage as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading templates...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Document Templates</h1>
          <p className="text-muted-foreground">
            Manage reusable document requirement templates for your programs
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={addSampleTemplates}>
            <Download className="h-4 w-4 mr-2" />
            Add Sample Templates
          </Button>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Template
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Templates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTemplates || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Object.keys(stats.categoryCounts || {}).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Most Used
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.mostUsed?.[0]?.name || 'None'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              System Templates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {templates.filter(t => t.is_system_template).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {DOCUMENT_CATEGORIES.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {DOCUMENT_TYPES.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedStage} onValueChange={setSelectedStage}>
              <SelectTrigger>
                <SelectValue placeholder="Stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                {STAGES.map(stage => (
                  <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={mandatoryFilter} onValueChange={setMandatoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Requirement" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="mandatory">Mandatory</SelectItem>
                <SelectItem value="optional">Optional</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setSelectedType('all');
              setSelectedStage('all');
              setMandatoryFilter('all');
            }}>
              <Filter className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <CardDescription className="mt-1">
                    {template.description}
                  </CardDescription>
                </div>
                <div className="flex gap-1 ml-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedTemplate(template);
                      setShowPreviewDialog(true);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditTemplate(template)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDuplicateTemplate(template)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  {!template.is_system_template && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteTemplate(template.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{template.category}</Badge>
                  <Badge className={getStageColor(template.stage)}>
                    {template.stage}
                  </Badge>
                  {template.mandatory && (
                    <Badge variant="destructive">Required</Badge>
                  )}
                  {template.is_system_template && (
                    <Badge variant="outline">System</Badge>
                  )}
                </div>
                
                <div className="text-sm text-muted-foreground">
                  <div>Formats: {template.accepted_formats.join(', ')}</div>
                  <div>Max size: {template.max_size}MB</div>
                  {template.usage_count > 0 && (
                    <div>Used {template.usage_count} times</div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No templates found</h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchTerm || selectedCategory !== 'all' || selectedType !== 'all' 
                ? "Try adjusting your filters or search terms"
                : "Create your first document template to get started"
              }
            </p>
            {(!searchTerm && selectedCategory === 'all' && selectedType === 'all') && (
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Template
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Create/Edit Template Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={(open) => {
        setShowCreateDialog(open);
        if (!open) {
          setEditingTemplate(null);
          resetForm();
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTemplate ? 'Edit Template' : 'Create New Template'}
            </DialogTitle>
            <DialogDescription>
              {editingTemplate 
                ? 'Update the document template details'
                : 'Create a new reusable document requirement template'
              }
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Template Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g., Official Transcript"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData({...formData, category: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DOCUMENT_CATEGORIES.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Brief description of the document requirement"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="type">Type</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value) => setFormData({...formData, type: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DOCUMENT_TYPES.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="stage">Stage</Label>
                <Select 
                  value={formData.stage} 
                  onValueChange={(value) => setFormData({...formData, stage: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STAGES.map(stage => (
                      <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="maxSize">Max Size (MB)</Label>
                <Input
                  id="maxSize"
                  type="number"
                  value={formData.max_size}
                  onChange={(e) => setFormData({...formData, max_size: parseInt(e.target.value) || 5})}
                />
              </div>
            </div>

            <div>
              <Label>Accepted Formats</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {FILE_FORMATS.map(format => (
                  <div key={format} className="flex items-center space-x-2">
                    <Checkbox
                      id={format}
                      checked={formData.accepted_formats.includes(format)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFormData({
                            ...formData,
                            accepted_formats: [...formData.accepted_formats, format]
                          });
                        } else {
                          setFormData({
                            ...formData,
                            accepted_formats: formData.accepted_formats.filter(f => f !== format)
                          });
                        }
                      }}
                    />
                    <Label htmlFor={format} className="text-sm">
                      {format.toUpperCase()}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="instructions">Instructions</Label>
              <Textarea
                id="instructions"
                value={formData.instructions}
                onChange={(e) => setFormData({...formData, instructions: e.target.value})}
                placeholder="Detailed instructions for students on how to submit this document"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="mandatory"
                checked={formData.mandatory}
                onCheckedChange={(checked) => setFormData({...formData, mandatory: !!checked})}
              />
              <Label htmlFor="mandatory">This is a mandatory requirement</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={editingTemplate ? handleUpdateTemplate : handleCreateTemplate}>
              {editingTemplate ? 'Update Template' : 'Create Template'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Template Dialog */}
      <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Template Preview</DialogTitle>
            <DialogDescription>
              How this template will appear to students
            </DialogDescription>
          </DialogHeader>

          {selectedTemplate && (
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{selectedTemplate.name}</h3>
                  <p className="text-muted-foreground">{selectedTemplate.description}</p>
                </div>
                <div className="flex gap-2">
                  <Badge className={getStageColor(selectedTemplate.stage)}>
                    {selectedTemplate.stage}
                  </Badge>
                  {selectedTemplate.mandatory && (
                    <Badge variant="destructive">Required</Badge>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Category:</span> {selectedTemplate.category}
                </div>
                <div>
                  <span className="font-medium">Type:</span> {selectedTemplate.type}
                </div>
                <div>
                  <span className="font-medium">Formats:</span> {selectedTemplate.accepted_formats.join(', ')}
                </div>
                <div>
                  <span className="font-medium">Max Size:</span> {selectedTemplate.max_size}MB
                </div>
              </div>

              {selectedTemplate.instructions && (
                <div>
                  <h4 className="font-medium mb-2">Instructions</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedTemplate.instructions}
                  </p>
                </div>
              )}

              {selectedTemplate.examples && selectedTemplate.examples.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Examples</h4>
                  <ul className="text-sm text-muted-foreground list-disc list-inside">
                    {selectedTemplate.examples.map((example, index) => (
                      <li key={index}>{example}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPreviewDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}