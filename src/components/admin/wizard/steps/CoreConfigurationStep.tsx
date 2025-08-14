import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { 
  Settings, 
  Users, 
  GraduationCap,
  CheckCircle
} from "lucide-react";
import { AIAgentData } from "../AIAgentWizard";

interface CoreConfigurationStepProps {
  data: AIAgentData;
  updateData: (updates: Partial<AIAgentData>) => void;
}

const SPECIALIZATIONS = [
  { id: 'mba', label: 'MBA Programs', icon: '🎓' },
  { id: 'undergraduate', label: 'Undergraduate', icon: '📚' },
  { id: 'graduate', label: 'Graduate Programs', icon: '🎯' },
  { id: 'executive', label: 'Executive Education', icon: '💼' },
  { id: 'online', label: 'Online Programs', icon: '💻' },
  { id: 'certificate', label: 'Certificates', icon: '📜' }
];

export function CoreConfigurationStep({ data, updateData }: CoreConfigurationStepProps) {
  const toggleSpecialization = (specId: string) => {
    const current = data.specializations || [];
    const updated = current.includes(specId)
      ? current.filter(id => id !== specId)
      : [...current, specId];
    updateData({ specializations: updated });
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
          Set your agent's capacity and specializations
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Capacity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Agent Capacity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Label>Maximum Concurrent Leads</Label>
              <Slider
                value={[data.max_concurrent_leads]}
                onValueChange={(value) => updateData({ max_concurrent_leads: value[0] })}
                max={50}
                min={5}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>5</span>
                <span className="font-medium text-foreground">
                  {data.max_concurrent_leads} leads
                </span>
                <span>50</span>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Handoff Confidence Threshold</Label>
              <Slider
                value={[data.handoff_threshold]}
                onValueChange={(value) => updateData({ handoff_threshold: value[0] })}
                max={95}
                min={50}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>50%</span>
                <span className="font-medium text-foreground">
                  {data.handoff_threshold}%
                </span>
                <span>95%</span>
              </div>
              <p className="text-xs text-muted-foreground">
                When confidence drops below this level, leads are transferred to humans
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Specializations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Program Specializations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {SPECIALIZATIONS.map((spec) => {
                const isSelected = data.specializations?.includes(spec.id);
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
              Select at least one specialization for your agent
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}