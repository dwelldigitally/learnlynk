import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  Search, 
  Filter, 
  BookOpen, 
  Star, 
  Copy, 
  Edit, 
  Trash2,
  ExternalLink,
  GraduationCap,
  Languages,
  Briefcase,
  Shield,
  Calendar,
  FileText,
  AlertCircle,
  Package
} from 'lucide-react';
import { 
  getAllSampleRequirements, 
  getRequirementsByType, 
  searchRequirements,
  getCommonRequirements,
  type RequirementTemplate 
} from '@/services/sampleRequirementsService';
import { DocumentTemplate, DocumentTemplateService } from '@/services/documentTemplateService';
import { requirementDocumentMappingService } from '@/services/requirementDocumentMappingService';

const typeIcons = {
  academic: GraduationCap,
  language: Languages,
  experience: Briefcase,
  health: Shield,
  age: Calendar,
  other: FileText
};

const typeColors = {
  academic: 'bg-blue-50 text-blue-700 border-blue-200',
  language: 'bg-green-50 text-green-700 border-green-200',
  experience: 'bg-purple-50 text-purple-700 border-purple-200',
  health: 'bg-red-50 text-red-700 border-red-200',
  age: 'bg-orange-50 text-orange-700 border-orange-200',
  other: 'bg-gray-50 text-gray-700 border-gray-200'
};

export function RequirementsManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedRequirement, setSelectedRequirement] = useState<RequirementTemplate | null>(null);
  const [documentTemplates, setDocumentTemplates] = useState<DocumentTemplate[]>([]);
  const [linkedTemplatesMap, setLinkedTemplatesMap] = useState<Record<string, DocumentTemplate[]>>({});

  const allRequirements = getAllSampleRequirements();
  const commonRequirements = getCommonRequirements();

  // Load document templates
  useEffect(() => {
    loadDocumentTemplates();
  }, []);

  const loadDocumentTemplates = async () => {
    try {
      const templates = await DocumentTemplateService.getTemplates();
      setDocumentTemplates(templates);
      
      // Load linked templates for all requirements
      const linkedMap: Record<string, DocumentTemplate[]> = {};
      for (const req of allRequirements) {
        const linked = await requirementDocumentMappingService.getLinkedTemplates(req.id);
        linkedMap[req.id] = linked;
      }
      setLinkedTemplatesMap(linkedMap);
    } catch (error) {
      console.error('Error loading templates:', error);
    }
  };

  const filteredRequirements = useMemo(() => {
    let requirements = allRequirements;

    if (searchTerm) {
      requirements = searchRequirements(searchTerm);
    }

    if (selectedType !== 'all') {
      requirements = requirements.filter(req => req.type === selectedType);
    }

    return requirements;
  }, [searchTerm, selectedType, allRequirements]);

  const groupedRequirements = useMemo(() => {
    const grouped: Record<string, RequirementTemplate[]> = {};
    filteredRequirements.forEach(req => {
      if (!grouped[req.category]) {
        grouped[req.category] = [];
      }
      grouped[req.category].push(req);
    });
    return grouped;
  }, [filteredRequirements]);

  const handleAddToProgram = (requirement: RequirementTemplate) => {
    // This would open a modal to select programs and add the requirement
    console.log('Adding requirement to program:', requirement);
  };

  const handleDuplicate = (requirement: RequirementTemplate) => {
    // This would create a copy of the requirement for editing
    console.log('Duplicating requirement:', requirement);
  };

  const handleEdit = (requirement: RequirementTemplate) => {
    // This would open an edit modal
    setSelectedRequirement(requirement);
  };

  const handleDelete = (requirement: RequirementTemplate) => {
    // This would confirm and delete the requirement
    console.log('Deleting requirement:', requirement);
  };

  const RequirementCard = ({ requirement }: { requirement: RequirementTemplate }) => {
    const Icon = typeIcons[requirement.type];
    const colorClass = typeColors[requirement.type];
    const linkedTemplates = linkedTemplatesMap[requirement.id] || [];

    return (
      <Card className="group hover:shadow-md transition-all duration-200">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg ${colorClass}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-sm font-medium">{requirement.title}</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={requirement.mandatory ? "destructive" : "secondary"} className="text-xs">
                    {requirement.mandatory ? 'Mandatory' : 'Optional'}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {requirement.usageCount} uses
                  </Badge>
                </div>
              </div>
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleAddToProgram(requirement)}
                className="h-8 w-8 p-0"
              >
                <ExternalLink className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleDuplicate(requirement)}
                className="h-8 w-8 p-0"
              >
                <Copy className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleEdit(requirement)}
                className="h-8 w-8 p-0"
              >
                <Edit className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleDelete(requirement)}
                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          <p className="text-sm text-muted-foreground">{requirement.description}</p>
          {requirement.minimumGrade && (
            <div className="text-xs text-muted-foreground">
              <strong>Minimum Grade:</strong> {requirement.minimumGrade}
            </div>
          )}
          {requirement.alternatives && requirement.alternatives.length > 0 && (
            <div className="text-xs text-muted-foreground">
              <strong>Alternatives:</strong> {requirement.alternatives.slice(0, 2).join(', ')}
              {requirement.alternatives.length > 2 && ` +${requirement.alternatives.length - 2} more`}
            </div>
          )}
          
          {/* Linked Document Templates Section */}
          <div className="pt-2 border-t">
            <div className="flex items-center gap-2 mb-2">
              <Package className="h-3 w-3 text-muted-foreground" />
              <div className="text-xs font-medium text-muted-foreground">
                Verified by documents:
              </div>
            </div>
            {linkedTemplates.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {linkedTemplates.map((template) => (
                  <Badge key={template.id} variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                    {template.name}
                  </Badge>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-1 text-xs text-amber-600">
                <AlertCircle className="w-3 h-3" />
                No documents linked
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap gap-1">
            {requirement.applicablePrograms.slice(0, 3).map((program, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {program}
              </Badge>
            ))}
            {requirement.applicablePrograms.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{requirement.applicablePrograms.length - 3} more
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Requirements Management</h1>
          <p className="text-muted-foreground">
            Manage and organize admission requirements for all programs
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Requirement
        </Button>
      </div>

      <Tabs defaultValue="library" className="space-y-6">
        <TabsList>
          <TabsTrigger value="library">Requirements Library</TabsTrigger>
          <TabsTrigger value="common">Most Used</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <div className="flex gap-4 items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search requirements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="academic">Academic</SelectItem>
              <SelectItem value="language">Language</SelectItem>
              <SelectItem value="experience">Experience</SelectItem>
              <SelectItem value="health">Health</SelectItem>
              <SelectItem value="age">Age</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <TabsContent value="library" className="space-y-6">
          {Object.keys(groupedRequirements).length > 0 ? (
            Object.entries(groupedRequirements).map(([category, requirements]) => (
              <div key={category}>
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-lg font-semibold">{category} Requirements</h3>
                  <Badge variant="secondary">{requirements.length}</Badge>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {requirements.map((requirement) => (
                    <RequirementCard key={requirement.id} requirement={requirement} />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No requirements found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search or filter criteria
                </p>
                <Button onClick={() => { setSearchTerm(''); setSelectedType('all'); }}>
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="common" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                Most Used Requirements
              </CardTitle>
              <CardDescription>
                Requirements that are commonly used across multiple programs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {commonRequirements.map((requirement) => (
                  <RequirementCard key={requirement.id} requirement={requirement} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Requirement Templates</CardTitle>
              <CardDescription>
                Pre-built requirement templates for quick program setup
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Template Management</h3>
                <p className="mb-4">Create and manage requirement templates for different program types</p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Template
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}