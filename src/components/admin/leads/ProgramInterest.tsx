import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { GraduationCap, Plus, Edit, Star, Calendar, DollarSign } from 'lucide-react';
import { Lead } from '@/types/lead';
import { LeadService } from '@/services/leadService';
import { useToast } from '@/hooks/use-toast';

interface Program {
  id: string;
  name: string;
  type: string;
  duration: string;
  tuition: number;
  next_intake: string;
  description: string;
}

interface ProgramInterestProps {
  lead: Lead;
  onUpdate: () => void;
}

export function ProgramInterest({ lead, onUpdate }: ProgramInterestProps) {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>(lead.program_interest || []);
  const [interestLevel, setInterestLevel] = useState('high');
  const [notes, setNotes] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadPrograms();
  }, []);

  const loadPrograms = async () => {
    try {
      setLoading(true);
      // Mock program data for now - in real app would fetch from programs table
      const mockPrograms: Program[] = [
        {
          id: '1',
          name: 'Master of Business Administration (MBA)',
          type: 'Masters',
          duration: '2 years',
          tuition: 45000,
          next_intake: '2024-09-01',
          description: 'Comprehensive business leadership program'
        },
        {
          id: '2',
          name: 'Bachelor of Computer Science',
          type: 'Undergraduate',
          duration: '4 years',
          tuition: 35000,
          next_intake: '2024-02-01',
          description: 'Technology and software development program'
        },
        {
          id: '3',
          name: 'Executive Education Certificate',
          type: 'Certificate',
          duration: '6 months',
          tuition: 12000,
          next_intake: '2024-01-15',
          description: 'Short-term executive skills enhancement'
        },
        {
          id: '4',
          name: 'Master of Data Science',
          type: 'Masters',
          duration: '18 months',
          tuition: 42000,
          next_intake: '2024-07-01',
          description: 'Advanced analytics and machine learning'
        }
      ];
      setPrograms(mockPrograms);
    } catch (error) {
      console.error('Error loading programs:', error);
      toast({
        title: "Error",
        description: "Failed to load programs",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateInterests = async () => {
    try {
      await LeadService.updateLead(lead.id, {
        program_interest: selectedPrograms
      });
      setEditDialogOpen(false);
      onUpdate();
      toast({
        title: "Success",
        description: "Program interests updated successfully"
      });
    } catch (error) {
      console.error('Error updating program interests:', error);
      toast({
        title: "Error",
        description: "Failed to update program interests",
        variant: "destructive"
      });
    }
  };

  const toggleProgramSelection = (programName: string) => {
    setSelectedPrograms(prev => 
      prev.includes(programName) 
        ? prev.filter(p => p !== programName)
        : [...prev, programName]
    );
  };

  const getInterestLevelColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Program Interest
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Loading programs...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Program Interest
          </div>
          <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                <Edit className="h-4 w-4 mr-1" />
                Edit Interests
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Update Program Interests</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Select Programs of Interest</Label>
                  <div className="grid grid-cols-1 gap-3 mt-2">
                    {programs.map((program) => (
                      <div 
                        key={program.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedPrograms.includes(program.name) 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => toggleProgramSelection(program.name)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{program.name}</h4>
                              <Badge variant="outline" className="text-xs">
                                {program.type}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{program.description}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {program.duration}
                              </div>
                              <div className="flex items-center gap-1">
                                <DollarSign className="h-3 w-3" />
                                {formatCurrency(program.tuition)}
                              </div>
                              <div>
                                Next intake: {new Date(program.next_intake).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          {selectedPrograms.includes(program.name) && (
                            <Star className="h-5 w-5 text-primary fill-current" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Interest Level</Label>
                  <Select value={interestLevel} onValueChange={setInterestLevel}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High Interest</SelectItem>
                      <SelectItem value="medium">Medium Interest</SelectItem>
                      <SelectItem value="low">Low Interest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="interest-notes">Additional Notes</Label>
                  <Textarea
                    id="interest-notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any specific requirements or preferences..."
                    rows={3}
                  />
                </div>

                <Button onClick={handleUpdateInterests}>
                  Update Program Interests
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium text-muted-foreground">Current Interests</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {(lead.program_interest && lead.program_interest.length > 0) ? (
              lead.program_interest.map((program, index) => {
                const programData = programs.find(p => p.name === program);
                return (
                  <div key={index} className="group">
                    <Badge variant="outline" className="cursor-help">
                      {program}
                    </Badge>
                    {programData && (
                      <div className="hidden group-hover:block absolute z-10 bg-popover border rounded-lg p-3 shadow-lg max-w-sm">
                        <h4 className="font-medium">{programData.name}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{programData.description}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                          <span>{programData.duration}</span>
                          <span>{formatCurrency(programData.tuition)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <span className="text-sm text-muted-foreground">No programs specified</span>
            )}
          </div>
        </div>

        {/* Program Recommendations */}
        <div>
          <label className="text-sm font-medium text-muted-foreground">Recommended Programs</label>
          <div className="space-y-2 mt-2">
            {programs.slice(0, 2).map((program) => (
              <div key={program.id} className="p-3 border rounded-lg bg-muted/30">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-sm">{program.name}</h4>
                      <Badge variant="secondary" className="text-xs">
                        Recommended
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{program.description}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{program.duration}</span>
                      <span>{formatCurrency(program.tuition)}</span>
                      <span>Next: {new Date(program.next_intake).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      setSelectedPrograms(prev => [...prev, program.name]);
                      setEditDialogOpen(true);
                    }}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}