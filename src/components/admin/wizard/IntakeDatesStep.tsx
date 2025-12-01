import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Calendar, Users, MapPin, Loader2 } from "lucide-react";
import { Program } from "@/types/program";
import { useActiveCampuses } from "@/hooks/useCampuses";
import { format, isValid } from "date-fns";

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
  const { data: campuses = [], isLoading: campusesLoading } = useActiveCampuses();

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

  const removeIntake = (intakeId: string) => {
    onDataChange({
      intakes: data.intakes?.filter(i => i.id !== intakeId) || []
    });
  };

  const updateIntake = (intakeId: string, field: string, value: any) => {
    const updatedIntakes = data.intakes?.map(i =>
      i.id === intakeId ? { ...i, [field]: value } : i
    );
    onDataChange({ intakes: updatedIntakes });
  };

  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (!isValid(date)) return dateString;
      return format(date, 'MMM d, yyyy');
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Intake Dates & Capacity</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Configure when this program will accept new students
          </p>
        </div>
        <Button onClick={addIntake}>
          <Plus className="h-4 w-4 mr-2" />
          Add Intake
        </Button>
      </div>

      {data.intakes?.map((intake, index) => (
        <Card key={intake.id} className="relative">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                Intake {index + 1}
                {intake.date && (
                  <Badge variant="outline" className="ml-2">
                    {formatDateForDisplay(intake.date)}
                  </Badge>
                )}
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeIntake(intake.id)}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  Start Date *
                </Label>
                <Input
                  type="date"
                  value={intake.date}
                  onChange={(e) => updateIntake(intake.id, 'date', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Users className="h-3.5 w-3.5 text-muted-foreground" />
                  Capacity *
                </Label>
                <Input
                  type="number"
                  value={intake.capacity}
                  onChange={(e) => updateIntake(intake.id, 'capacity', Number(e.target.value))}
                  min={1}
                />
              </div>
              <div className="space-y-2">
                <Label>Application Deadline</Label>
                <Input
                  type="date"
                  value={intake.applicationDeadline}
                  onChange={(e) => updateIntake(intake.id, 'applicationDeadline', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Study Mode</Label>
                <Select
                  value={intake.studyMode}
                  onValueChange={(value) => updateIntake(intake.id, 'studyMode', value)}
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
                  onValueChange={(value) => updateIntake(intake.id, 'deliveryMethod', value)}
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
                <Label className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                  Campus Location
                </Label>
                <Select
                  value={intake.campusLocation}
                  onValueChange={(value) => updateIntake(intake.id, 'campusLocation', value)}
                  disabled={campusesLoading}
                >
                  <SelectTrigger>
                    {campusesLoading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading...
                      </span>
                    ) : (
                      <SelectValue placeholder="Select campus" />
                    )}
                  </SelectTrigger>
                  <SelectContent>
                    {campuses.length === 0 ? (
                      <SelectItem value="no-campuses" disabled>No campuses configured</SelectItem>
                    ) : (
                      campuses.map((campus) => (
                        <SelectItem key={campus.id} value={campus.name}>
                          {campus.name}
                        </SelectItem>
                      ))
                    )}
                    <SelectItem value="online">Online Campus</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <Badge variant={intake.status === 'open' ? 'default' : 'secondary'} className="capitalize">
                {intake.status}
              </Badge>
              {intake.capacity > 0 && (
                <span className="text-xs text-muted-foreground">
                  {intake.enrolled || 0} / {intake.capacity} enrolled
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      {(!data.intakes || data.intakes.length === 0) && (
        <Card className="border-dashed">
          <CardContent className="p-8 text-center">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground mb-4">No intakes scheduled yet</p>
            <p className="text-sm text-muted-foreground mb-4">
              Add intakes to define when this program will accept new students
            </p>
            <Button onClick={addIntake}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Intake
            </Button>
          </CardContent>
        </Card>
      )}

      {data.intakes && data.intakes.length > 0 && (
        <div className="bg-muted/50 rounded-lg p-4">
          <p className="text-sm text-muted-foreground">
            <strong>{data.intakes.length}</strong> intake{data.intakes.length !== 1 ? 's' : ''} configured. 
            These intakes will be available for leads to select when expressing interest in this program.
          </p>
        </div>
      )}
    </div>
  );
};

export default IntakeDatesStep;
