import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Users, MapPin, GraduationCap, Target, Plus, X } from "lucide-react";
import { JourneyAIAgentData } from "../JourneyBasedAIAgentWizard";
import { useState } from "react";

interface AudienceScopeStepProps {
  data: JourneyAIAgentData;
  updateData: (updates: Partial<JourneyAIAgentData>) => void;
}

const MOCK_PROGRAMS = [
  'Computer Science - Bachelor',
  'Business Administration - Master',
  'Engineering - Bachelor', 
  'Data Science - Master',
  'Medicine - Bachelor',
  'Psychology - Bachelor',
  'Law - Master',
  'Art & Design - Bachelor'
];

const MOCK_STAGES = [
  'Initial Inquiry',
  'Application Started',
  'Application Submitted',
  'Documents Pending',
  'Under Review',
  'Interview Scheduled',
  'Interview Completed',
  'Decision Pending',
  'Offer Extended',
  'Enrollment Confirmed'
];

const MOCK_GEOGRAPHY = [
  'United States',
  'Canada', 
  'United Kingdom',
  'Australia',
  'Germany',
  'France',
  'India',
  'China',
  'Brazil',
  'Mexico'
];

export function AudienceScopeStep({ data, updateData }: AudienceScopeStepProps) {
  const [newProgram, setNewProgram] = useState('');
  const [newGeography, setNewGeography] = useState('');

  const updateTargetCriteria = (field: string, value: any) => {
    updateData({
      targetCriteria: {
        ...data.targetCriteria,
        [field]: value
      }
    });
  };

  const addProgram = (program: string) => {
    if (program && !data.targetCriteria.programs.includes(program)) {
      updateTargetCriteria('programs', [...data.targetCriteria.programs, program]);
    }
  };

  const removeProgram = (program: string) => {
    updateTargetCriteria('programs', data.targetCriteria.programs.filter(p => p !== program));
  };

  const addGeography = (geo: string) => {
    if (geo && !data.targetCriteria.geography.includes(geo)) {
      updateTargetCriteria('geography', [...data.targetCriteria.geography, geo]);
    }
  };

  const removeGeography = (geo: string) => {
    updateTargetCriteria('geography', data.targetCriteria.geography.filter(g => g !== geo));
  };

  const toggleStage = (stage: string) => {
    const stages = data.targetCriteria.stages;
    if (stages.includes(stage)) {
      updateTargetCriteria('stages', stages.filter(s => s !== stage));
    } else {
      updateTargetCriteria('stages', [...stages, stage]);
    }
  };

  // Calculate estimated audience size based on selections
  const baseSize = 1000;
  const programMultiplier = data.targetCriteria.programs.length || 1;
  const stageMultiplier = data.targetCriteria.stages.length || 1;
  const geoMultiplier = data.targetCriteria.geography.length || 1;
  const scoreMultiplier = (data.targetCriteria.scoreRange.max - data.targetCriteria.scoreRange.min) / 100;
  
  const estimatedSize = Math.round(baseSize * programMultiplier * stageMultiplier * geoMultiplier * scoreMultiplier * 0.1);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-semibold">Define Your Target Audience</h3>
        <p className="text-muted-foreground">
          Set criteria to determine which students this agent will manage
        </p>
      </div>

      {/* Programs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Target Programs
          </CardTitle>
          <CardDescription>Select which academic programs this agent will focus on</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Select value={newProgram} onValueChange={setNewProgram}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select a program..." />
              </SelectTrigger>
              <SelectContent>
                {MOCK_PROGRAMS.filter(p => !data.targetCriteria.programs.includes(p)).map(program => (
                  <SelectItem key={program} value={program}>{program}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={() => { addProgram(newProgram); setNewProgram(''); }} disabled={!newProgram}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {data.targetCriteria.programs.map(program => (
              <Badge key={program} variant="secondary" className="flex items-center gap-1">
                {program}
                <X className="h-3 w-3 cursor-pointer" onClick={() => removeProgram(program)} />
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Journey Stages */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Journey Stages
          </CardTitle>
          <CardDescription>Choose which stages in the student journey to target</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {MOCK_STAGES.map(stage => (
              <div
                key={stage}
                className={`p-3 border rounded-lg cursor-pointer transition-all ${
                  data.targetCriteria.stages.includes(stage)
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => toggleStage(stage)}
              >
                <div className="flex items-center gap-2">
                  <Checkbox checked={data.targetCriteria.stages.includes(stage)} />
                  <span className="text-sm">{stage}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Geography */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Geographic Targeting
          </CardTitle>
          <CardDescription>Select geographic regions to focus on</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Select value={newGeography} onValueChange={setNewGeography}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select a region..." />
              </SelectTrigger>
              <SelectContent>
                {MOCK_GEOGRAPHY.filter(g => !data.targetCriteria.geography.includes(g)).map(geo => (
                  <SelectItem key={geo} value={geo}>{geo}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={() => { addGeography(newGeography); setNewGeography(''); }} disabled={!newGeography}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {data.targetCriteria.geography.map(geo => (
              <Badge key={geo} variant="secondary" className="flex items-center gap-1">
                {geo}
                <X className="h-3 w-3 cursor-pointer" onClick={() => removeGeography(geo)} />
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Student Type */}
      <Card>
        <CardHeader>
          <CardTitle>Student Type</CardTitle>
          <CardDescription>Choose the type of students to target</CardDescription>
        </CardHeader>
        <CardContent>
          <Select 
            value={data.targetCriteria.studentType} 
            onValueChange={(value) => updateTargetCriteria('studentType', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Students</SelectItem>
              <SelectItem value="domestic">Domestic Students Only</SelectItem>
              <SelectItem value="international">International Students Only</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Score Range */}
      <Card>
        <CardHeader>
          <CardTitle>Lead Score Range</CardTitle>
          <CardDescription>Set the lead score range for targeting (0-100)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Minimum Score: {data.targetCriteria.scoreRange.min}</span>
              <span className="text-sm">Maximum Score: {data.targetCriteria.scoreRange.max}</span>
            </div>
            <div className="px-4">
              <Slider
                value={[data.targetCriteria.scoreRange.min, data.targetCriteria.scoreRange.max]}
                onValueChange={([min, max]) => updateTargetCriteria('scoreRange', { min, max })}
                max={100}
                min={0}
                step={5}
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audience Size Preview */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Estimated Audience Size
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">{estimatedSize.toLocaleString()} students</p>
              <p className="text-sm text-muted-foreground">
                Based on current selection criteria
              </p>
            </div>
            <div className="text-right text-sm text-muted-foreground">
              <p>{data.targetCriteria.programs.length} programs</p>
              <p>{data.targetCriteria.stages.length} stages</p>
              <p>{data.targetCriteria.geography.length} regions</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}