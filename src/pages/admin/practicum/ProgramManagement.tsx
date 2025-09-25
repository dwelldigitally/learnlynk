import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Plus, Search, Edit, Clock, Award, Users, Calendar } from 'lucide-react';
import { usePracticumPrograms, usePracticumProgramMutations } from '@/hooks/usePracticum';
import { useAuth } from '@/contexts/AuthContext';
import type { PracticumProgramInsert } from '@/types/practicum';

export function ProgramManagement() {
  const { session } = useAuth();
  const { data: programs, isLoading } = usePracticumPrograms(session?.user?.id || '');
  const { createProgram } = usePracticumProgramMutations();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<PracticumProgramInsert>>({
    program_name: '',
    total_hours_required: 200,
    weeks_duration: 8,
    competencies_required: [],
    documents_required: [],
    evaluation_criteria: {},
    is_active: true
  });

  const filteredPrograms = programs?.filter(program =>
    program.program_name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const programData = {
      ...formData,
      user_id: session?.user?.id || '',
      competencies_required: JSON.stringify(formData.competencies_required || []),
      documents_required: JSON.stringify(formData.documents_required || []),
      evaluation_criteria: JSON.stringify(formData.evaluation_criteria || {})
    } as PracticumProgramInsert;

    try {
      await createProgram.mutateAsync(programData);
      setIsDialogOpen(false);
      setFormData({
        program_name: '',
        total_hours_required: 200,
        weeks_duration: 8,
        competencies_required: [],
        documents_required: [],
        evaluation_criteria: {},
        is_active: true
      });
    } catch (error) {
      console.error('Error saving program:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="h-8 bg-muted rounded w-48"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-muted rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Program Management</h1>
          <p className="text-muted-foreground">Configure practicum programs and requirements</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Program
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Program</DialogTitle>
              <DialogDescription>
                Configure practicum program requirements and criteria
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="requirements">Requirements</TabsTrigger>
                  <TabsTrigger value="competencies">Competencies</TabsTrigger>
                </TabsList>
                
                <TabsContent value="basic" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="program_name">Program Name</Label>
                    <Input
                      id="program_name"
                      value={formData.program_name}
                      onChange={(e) => setFormData({ ...formData, program_name: e.target.value })}
                      placeholder="Nursing Practicum"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="total_hours_required">Total Hours Required</Label>
                      <Input
                        id="total_hours_required"
                        type="number"
                        min="1"
                        value={formData.total_hours_required}
                        onChange={(e) => setFormData({ ...formData, total_hours_required: parseInt(e.target.value) })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weeks_duration">Duration (Weeks)</Label>
                      <Input
                        id="weeks_duration"
                        type="number"
                        min="1"
                        value={formData.weeks_duration}
                        onChange={(e) => setFormData({ ...formData, weeks_duration: parseInt(e.target.value) })}
                        required
                      />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="requirements" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="documents_required">Required Documents</Label>
                    <Textarea
                      id="documents_required"
                      placeholder="Enter required documents, one per line..."
                      value={Array.isArray(formData.documents_required) ? formData.documents_required.join('\n') : ''}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        documents_required: e.target.value.split('\n').filter(doc => doc.trim()) 
                      })}
                      rows={6}
                    />
                    <p className="text-xs text-muted-foreground">
                      Examples: Police Background Check, Immunization Records, CPR Certification
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="competencies" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="competencies_required">Required Competencies</Label>
                    <Textarea
                      id="competencies_required"
                      placeholder="Enter required competencies, one per line..."
                      value={Array.isArray(formData.competencies_required) ? formData.competencies_required.join('\n') : ''}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        competencies_required: e.target.value.split('\n').filter(comp => comp.trim()) 
                      })}
                      rows={8}
                    />
                    <p className="text-xs text-muted-foreground">
                      Examples: Patient Assessment, Medication Administration, Care Planning
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createProgram.isPending}>
                  Create Program
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search programs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Programs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPrograms.map((program) => (
          <Card key={program.id} className="hover-scale">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{program.program_name}</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <BookOpen className="h-3 w-3" />
                    Practicum Program
                  </CardDescription>
                </div>
                <Badge variant={program.is_active ? "default" : "secondary"}>
                  {program.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    Total Hours
                  </div>
                  <div className="text-lg font-semibold">{program.total_hours_required}</div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    Duration
                  </div>
                  <div className="text-lg font-semibold">{program.weeks_duration} weeks</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Competencies:</span>
                  <span className="font-medium">
                    {Array.isArray(program.competencies_required) 
                      ? program.competencies_required.length 
                      : JSON.parse(program.competencies_required as string || '[]').length}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Documents:</span>
                  <span className="font-medium">
                    {Array.isArray(program.documents_required) 
                      ? program.documents_required.length 
                      : JSON.parse(program.documents_required as string || '[]').length}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 pt-2">
                <Button size="sm" variant="outline">
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button size="sm" variant="outline">
                  <Users className="h-3 w-3 mr-1" />
                  Students
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPrograms.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-medium mb-2">No programs found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm ? 'Try adjusting your search terms' : 'Start by adding your first practicum program'}
          </p>
          {!searchTerm && (
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Program
            </Button>
          )}
        </div>
      )}
    </div>
  );
}