import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { Program } from "@/types/program";

interface IntakeDatesStepProps {
  data: Partial<Program>;
  onDataChange: (data: Partial<Program>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const IntakeDatesStep: React.FC<IntakeDatesStepProps> = ({
  data,
  onDataChange
}) => {
  const addIntake = () => {
    const newIntake = {
      id: `intake_${Date.now()}`,
      date: '',
      capacity: 30,
      enrolled: 0,
      status: 'planning' as const,
      applicationDeadline: '',
      notifications: []
    };

    onDataChange({
      intakes: [...(data.intakes || []), newIntake]
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Intake Dates & Capacity</h3>
        <Button onClick={addIntake}>
          <Plus className="h-4 w-4 mr-2" />
          Add Intake
        </Button>
      </div>

      {data.intakes?.map((intake, index) => (
        <Card key={intake.id}>
          <CardHeader>
            <CardTitle className="text-base">Intake {index + 1}</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input
                type="date"
                value={intake.date}
                onChange={(e) => {
                  const updatedIntakes = data.intakes?.map(i => 
                    i.id === intake.id ? { ...i, date: e.target.value } : i
                  );
                  onDataChange({ intakes: updatedIntakes });
                }}
              />
            </div>
            <div className="space-y-2">
              <Label>Capacity</Label>
              <Input
                type="number"
                value={intake.capacity}
                onChange={(e) => {
                  const updatedIntakes = data.intakes?.map(i => 
                    i.id === intake.id ? { ...i, capacity: Number(e.target.value) } : i
                  );
                  onDataChange({ intakes: updatedIntakes });
                }}
              />
            </div>
            <div className="space-y-2">
              <Label>Application Deadline</Label>
              <Input
                type="date"
                value={intake.applicationDeadline}
                onChange={(e) => {
                  const updatedIntakes = data.intakes?.map(i => 
                    i.id === intake.id ? { ...i, applicationDeadline: e.target.value } : i
                  );
                  onDataChange({ intakes: updatedIntakes });
                }}
              />
            </div>
          </CardContent>
        </Card>
      ))}

      {(!data.intakes || data.intakes.length === 0) && (
        <Card className="border-dashed">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground mb-4">No intakes scheduled yet</p>
            <Button onClick={addIntake}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Intake
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default IntakeDatesStep;