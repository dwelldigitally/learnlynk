import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { BookOpen, Plus, Edit, Check } from 'lucide-react';
import ProgramWizard from '@/components/admin/ProgramWizard';

interface ProgramSetupScreenProps {
  data: any;
  websiteData?: any;
  onComplete: (data: any) => void;
  onNext: () => void;
  onSkip: () => void;
}

const ProgramSetupScreen: React.FC<ProgramSetupScreenProps> = ({
  data,
  websiteData,
  onComplete,
  onNext,
  onSkip
}) => {
  const { toast } = useToast();
  const [programs, setPrograms] = useState(data?.programs || websiteData?.detectedPrograms || []);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState(null);

  const handleAddProgram = () => {
    setEditingProgram(null);
    setIsWizardOpen(true);
  };

  const handleEditProgram = (program: any) => {
    setEditingProgram(program);
    setIsWizardOpen(true);
  };

  const handleProgramSaved = (programData: any) => {
    if (editingProgram) {
      // Update existing program
      setPrograms(prev => prev.map(p => p.id === editingProgram.id ? programData : p));
    } else {
      // Add new program
      setPrograms(prev => [...prev, { ...programData, id: Date.now().toString() }]);
    }
    setIsWizardOpen(false);
    setEditingProgram(null);
    
    toast({
      title: "Program Saved",
      description: `${programData.name} has been ${editingProgram ? 'updated' : 'added'} successfully.`,
    });
  };

  const handleComplete = () => {
    if (programs.length === 0) {
      toast({
        title: "No Programs Added",
        description: "Please add at least one program or skip this step.",
        variant: "destructive"
      });
      return;
    }

    onComplete({ programs });
    onNext();
  };

  return (
    <div className="space-y-6">
      {websiteData?.detectedPrograms && (
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Check className="w-5 h-5 text-primary" />
            <span className="font-medium text-primary">
              {websiteData.detectedPrograms.length} programs detected from your website
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Review and customize the detected programs below, or add additional programs.
          </p>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Academic Programs</h3>
          <p className="text-muted-foreground">
            Set up your institution's academic programs and their details.
          </p>
        </div>
        <Button onClick={handleAddProgram} className="bg-primary hover:bg-primary-hover">
          <Plus className="w-4 h-4 mr-2" />
          Add Program
        </Button>
      </div>

      {programs.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No Programs Added Yet</h3>
            <p className="text-muted-foreground mb-4">
              Start by adding your first academic program to get your system configured.
            </p>
            <Button onClick={handleAddProgram} className="bg-primary hover:bg-primary-hover">
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Program
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {programs.map((program, index) => (
            <Card key={program.id || index}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base">{program.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{program.description}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleEditProgram(program)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Duration:</span>
                    <p className="font-medium">{program.duration || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Tuition:</span>
                    <p className="font-medium">{program.tuitionFee || program.fees?.tuition || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Application Fee:</span>
                    <p className="font-medium">{program.applicationFee || program.fees?.application || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Level:</span>
                    <p className="font-medium">{program.level || 'Not specified'}</p>
                  </div>
                </div>
                
                {program.requirements && program.requirements.length > 0 && (
                  <div className="mt-3">
                    <span className="text-muted-foreground text-sm">Requirements:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {program.requirements.slice(0, 3).map((req, reqIndex) => (
                        <span
                          key={reqIndex}
                          className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                        >
                          {req}
                        </span>
                      ))}
                      {program.requirements.length > 3 && (
                        <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                          +{program.requirements.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {program.intakes && program.intakes.length > 0 && (
                  <div className="mt-2">
                    <span className="text-muted-foreground text-sm">Intakes:</span>
                    <p className="text-sm font-medium">{program.intakes.join(', ')}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="bg-muted/30 rounded-lg p-4">
        <h4 className="font-medium text-foreground mb-2">Quick Setup Tips</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Add 2-3 main programs to start with</li>
          <li>• You can add more programs later from the admin panel</li>
          <li>• Each program can have multiple intakes throughout the year</li>
          <li>• Requirements help filter qualified applicants automatically</li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <Button variant="outline" onClick={onSkip} className="glass-button">
          Skip This Step
        </Button>
        <Button 
          onClick={handleComplete}
          disabled={programs.length === 0}
          className="bg-primary hover:bg-primary-hover"
        >
          Continue with {programs.length} Program{programs.length !== 1 ? 's' : ''}
        </Button>
      </div>

      {/* Program Wizard */}
      <ProgramWizard
        open={isWizardOpen}
        onOpenChange={setIsWizardOpen}
        editingProgram={editingProgram}
        onSave={handleProgramSaved}
      />
    </div>
  );
};

export default ProgramSetupScreen;