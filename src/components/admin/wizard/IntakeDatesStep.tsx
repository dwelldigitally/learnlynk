import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
      studyMode: 'full-time' as const,
      deliveryMethod: 'in-class' as const,
      campusLocation: '',
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
            <div className="space-y-2">
              <Label>Study Mode</Label>
              <Select
                value={intake.studyMode}
                onValueChange={(value) => {
                  const updatedIntakes = data.intakes?.map(i => 
                    i.id === intake.id ? { ...i, studyMode: value as 'full-time' | 'part-time' } : i
                  );
                  onDataChange({ intakes: updatedIntakes });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select study mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full Time</SelectItem>
                  <SelectItem value="part-time">Part Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Delivery Method</Label>
              <Select
                value={intake.deliveryMethod}
                onValueChange={(value) => {
                  const updatedIntakes = data.intakes?.map(i => 
                    i.id === intake.id ? { ...i, deliveryMethod: value as 'online' | 'hybrid' | 'in-class' } : i
                  );
                  onDataChange({ intakes: updatedIntakes });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select delivery method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                  <SelectItem value="in-class">In-class</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Campus Location</Label>
              <Select
                value={intake.campusLocation}
                onValueChange={(value) => {
                  const updatedIntakes = data.intakes?.map(i => 
                    i.id === intake.id ? { ...i, campusLocation: value } : i
                  );
                  onDataChange({ intakes: updatedIntakes });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select campus location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Surrey Campus">Surrey Campus</SelectItem>
                  <SelectItem value="Vancouver Campus">Vancouver Campus</SelectItem>
                  <SelectItem value="Richmond Campus">Richmond Campus</SelectItem>
                  <SelectItem value="Burnaby Campus">Burnaby Campus</SelectItem>
                  <SelectItem value="Online Campus">Online Campus</SelectItem>
                </SelectContent>
              </Select>
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