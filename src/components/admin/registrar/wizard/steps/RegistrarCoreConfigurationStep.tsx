import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { 
  Settings, 
  Users, 
  FileCheck,
  CheckCircle,
  GraduationCap
} from "lucide-react";
import { RegistrarAIAgentData } from "../RegistrarAIAgentWizard";

interface RegistrarCoreConfigurationStepProps {
  data: RegistrarAIAgentData;
  updateData: (updates: Partial<RegistrarAIAgentData>) => void;
}

const PROGRAM_SPECIALIZATIONS = [
  { id: 'undergraduate', label: 'Undergraduate', icon: '📚' },
  { id: 'graduate', label: 'Graduate Programs', icon: '🎯' },
  { id: 'doctoral', label: 'Doctoral Programs', icon: '🎓' },
  { id: 'certificate', label: 'Certificates', icon: '📜' },
  { id: 'continuing', label: 'Continuing Education', icon: '📖' },
  { id: 'international', label: 'International Programs', icon: '🌍' }
];

export function RegistrarCoreConfigurationStep({ data, updateData }: RegistrarCoreConfigurationStepProps) {
  const toggleSpecialization = (specId: string) => {
    const current = data.program_specializations || [];
    const updated = current.includes(specId)
      ? current.filter(id => id !== specId)
      : [...current, specId];
    updateData({ program_specializations: updated });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="p-3 bg-green-100 rounded-full w-fit mx-auto">
          <Settings className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold">Core Settings</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Set your agent's capacity and program specializations
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Capacity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Processing Capacity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Label>Maximum Concurrent Applications</Label>
              <Slider
                value={[data.max_concurrent_applications]}
                onValueChange={(value) => updateData({ max_concurrent_applications: value[0] })}
                max={75}
                min={10}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>10</span>
                <span className="font-medium text-foreground">
                  {data.max_concurrent_applications} applications
                </span>
                <span>75</span>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Review Confidence Threshold</Label>
              <Slider
                value={[data.review_threshold]}
                onValueChange={(value) => updateData({ review_threshold: value[0] })}
                max={95}
                min={60}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>60%</span>
                <span className="font-medium text-foreground">
                  {data.review_threshold}%
                </span>
                <span>95%</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Applications below this confidence level are escalated for human review
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Program Specializations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Program Specializations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {PROGRAM_SPECIALIZATIONS.map((spec) => {
                const isSelected = data.program_specializations?.includes(spec.id);
                return (
                  <Button
                    key={spec.id}
                    variant={isSelected ? "default" : "outline"}
                    className="h-auto p-4 justify-start"
                    onClick={() => toggleSpecialization(spec.id)}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{spec.icon}</span>
                      <span>{spec.label}</span>
                      {isSelected && <CheckCircle className="h-4 w-4 ml-auto" />}
                    </div>
                  </Button>
                );
              })}
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Select at least one program type for your agent to process
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}