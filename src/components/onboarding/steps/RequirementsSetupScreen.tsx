import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { FileCheck, Plus, Trash2 } from 'lucide-react';

interface RequirementsSetupScreenProps {
  data: any;
  programs: any[];
  onComplete: (data: any) => void;
  onNext: () => void;
  onSkip: () => void;
}

const COMMON_REQUIREMENTS = [
  { name: 'High School Diploma', type: 'academic', mandatory: true },
  { name: 'Transcript', type: 'document', mandatory: true },
  { name: 'Letter of Recommendation', type: 'document', mandatory: false },
  { name: 'Personal Statement', type: 'document', mandatory: false },
  { name: 'SAT/ACT Scores', type: 'test', mandatory: false },
  { name: 'TOEFL/IELTS (International)', type: 'test', mandatory: false },
  { name: 'Portfolio (Art/Design)', type: 'document', mandatory: false },
  { name: 'Work Experience', type: 'experience', mandatory: false }
];

const RequirementsSetupScreen: React.FC<RequirementsSetupScreenProps> = ({
  data,
  programs,
  onComplete,
  onNext,
  onSkip
}) => {
  const { toast } = useToast();
  const [requirements, setRequirements] = useState(data?.requirements || []);

  const handleAddRequirement = (requirement: any) => {
    const newReq = {
      id: Date.now().toString(),
      ...requirement,
      applicable_programs: programs.map(p => p.id || p.name),
      order: requirements.length + 1
    };
    setRequirements(prev => [...prev, newReq]);
  };

  const handleRemoveRequirement = (id: string) => {
    setRequirements(prev => prev.filter(req => req.id !== id));
  };

  const handleComplete = () => {
    onComplete({ requirements });
    onNext();
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground">Application Requirements</h3>
        <p className="text-muted-foreground">
          Set up the documents and requirements students need to complete their application.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Common Requirements</CardTitle>
            <p className="text-sm text-muted-foreground">
              Select from typical application requirements
            </p>
          </CardHeader>
          <CardContent className="space-y-2">
            {COMMON_REQUIREMENTS.map((req, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/30 transition-colors"
              >
                <div>
                  <div className="font-medium text-foreground">{req.name}</div>
                  <div className="text-xs text-muted-foreground capitalize">
                    {req.type} • {req.mandatory ? 'Mandatory' : 'Optional'}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAddRequirement(req)}
                  disabled={requirements.some(r => r.name === req.name)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Selected Requirements</CardTitle>
            <p className="text-sm text-muted-foreground">
              Requirements for your application process
            </p>
          </CardHeader>
          <CardContent>
            {requirements.length === 0 ? (
              <div className="text-center py-8">
                <FileCheck className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No requirements selected yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {requirements.map((req) => (
                  <div
                    key={req.id}
                    className="flex items-center justify-between p-3 bg-primary/5 border border-primary/20 rounded-lg"
                  >
                    <div>
                      <div className="font-medium text-foreground">{req.name}</div>
                      <div className="text-xs text-muted-foreground capitalize">
                        {req.type} • {req.mandatory ? 'Mandatory' : 'Optional'}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRemoveRequirement(req.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="bg-muted/30 rounded-lg p-4">
        <h4 className="font-medium text-foreground mb-2">Smart Automation</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Requirements will be automatically checked when students submit applications</li>
          <li>• Missing requirements will trigger automated follow-up emails</li>
          <li>• Document verification workflows will be set up automatically</li>
          <li>• You can customize requirements for specific programs later</li>
        </ul>
      </div>

      <div className="flex justify-center space-x-4">
        <Button variant="outline" onClick={onSkip} className="glass-button">
          Skip This Step
        </Button>
        <Button 
          onClick={handleComplete}
          className="bg-primary hover:bg-primary-hover"
        >
          Continue with {requirements.length} Requirement{requirements.length !== 1 ? 's' : ''}
        </Button>
      </div>
    </div>
  );
};

export default RequirementsSetupScreen;