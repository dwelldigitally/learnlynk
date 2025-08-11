import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Filter, 
  GraduationCap, 
  MapPin, 
  Target, 
  FileText,
  Plus,
  X,
  Info,
  CheckCircle
} from "lucide-react";
import { RegistrarAIAgentData } from "../RegistrarAIAgentWizard";

interface RegistrarFilterRulesStepProps {
  data: RegistrarAIAgentData;
  updateData: (updates: Partial<RegistrarAIAgentData>) => void;
}

const PROGRAM_SPECIALIZATIONS = [
  'Computer Science', 'Business Administration', 'Nursing', 'Engineering', 'Psychology',
  'Education', 'Criminal Justice', 'Biology', 'Art & Design', 'Mathematics',
  'English Literature', 'History', 'Political Science', 'Social Work', 'Finance'
];

const APPLICATION_SOURCES = [
  'University Website', 'Common Application', 'Partner Schools', 'Transfer Portal',
  'International Applications', 'Graduate Applications', 'Online Programs', 'Continuing Education'
];

const GEOGRAPHIC_REGIONS = [
  'Local (In-State)', 'Regional (Neighboring States)', 'National (Domestic)', 
  'International', 'Specific Countries', 'EU Students', 'Canadian Students'
];

const PRIORITY_CRITERIA = [
  { id: 'early_admission', label: 'Early Admission', description: 'Applications submitted before priority deadline' },
  { id: 'scholarship_eligible', label: 'Scholarship Eligible', description: 'Students eligible for institutional scholarships' },
  { id: 'transfer_students', label: 'Transfer Students', description: 'Students transferring from other institutions' },
  { id: 'international', label: 'International Students', description: 'International applicants requiring special processing' },
  { id: 'veterans', label: 'Veterans', description: 'Military veterans and service members' },
  { id: 'first_generation', label: 'First Generation', description: 'First-generation college students' }
];

const DOCUMENT_TYPES = [
  'Official Transcripts', 'Test Scores (SAT/ACT)', 'Letters of Recommendation', 
  'Personal Statement', 'Resume/CV', 'Portfolio', 'Financial Documents', 
  'Immigration Documents', 'Medical Records', 'Certificates'
];

export function RegistrarFilterRulesStep({ data, updateData }: RegistrarFilterRulesStepProps) {
  const [customSpecialization, setCustomSpecialization] = useState("");

  const toggleSpecialization = (specialization: string) => {
    const current = data.program_specializations || [];
    const updated = current.includes(specialization)
      ? current.filter(s => s !== specialization)
      : [...current, specialization];
    updateData({ program_specializations: updated });
  };

  const toggleApplicationSource = (source: string) => {
    const current = data.application_sources || [];
    const updated = current.includes(source)
      ? current.filter(s => s !== source)
      : [...current, source];
    updateData({ application_sources: updated });
  };

  const toggleGeographicPreference = (region: string) => {
    const current = data.geographic_preferences || [];
    const updated = current.includes(region)
      ? current.filter(r => r !== region)
      : [...current, region];
    updateData({ geographic_preferences: updated });
  };

  const toggleDocumentType = (docType: string) => {
    const current = data.document_types || [];
    const updated = current.includes(docType)
      ? current.filter(d => d !== docType)
      : [...current, docType];
    updateData({ document_types: updated });
  };

  const togglePriorityCriteria = (criteriaId: string) => {
    const current = data.priority_criteria || {};
    const updated = { ...current };
    if (updated[criteriaId]) {
      delete updated[criteriaId];
    } else {
      updated[criteriaId] = true;
    }
    updateData({ priority_criteria: updated });
  };

  const addCustomSpecialization = () => {
    if (customSpecialization.trim()) {
      const current = data.program_specializations || [];
      updateData({ 
        program_specializations: [...current, customSpecialization.trim()] 
      });
      setCustomSpecialization("");
    }
  };

  const removeSpecialization = (specialization: string) => {
    const current = data.program_specializations || [];
    updateData({ 
      program_specializations: current.filter(s => s !== specialization) 
    });
  };

  return (
    <div className="space-y-6">
      {/* Program Specializations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Program Specializations
          </CardTitle>
          <CardDescription>
            Select which academic programs your agent should prioritize
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {PROGRAM_SPECIALIZATIONS.map((specialization) => (
              <Button
                key={specialization}
                variant={data.program_specializations?.includes(specialization) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleSpecialization(specialization)}
              >
                {specialization}
              </Button>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Add custom specialization..."
              value={customSpecialization}
              onChange={(e) => setCustomSpecialization(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addCustomSpecialization()}
            />
            <Button onClick={addCustomSpecialization} variant="outline">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {data.program_specializations && data.program_specializations.length > 0 && (
            <div className="space-y-2">
              <Label>Selected Specializations:</Label>
              <div className="flex flex-wrap gap-2">
                {data.program_specializations.map((specialization) => (
                  <Badge key={specialization} variant="secondary" className="gap-1">
                    {specialization}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => removeSpecialization(specialization)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {(!data.program_specializations || data.program_specializations.length === 0) && (
            <div className="text-center py-4 text-muted-foreground">
              <Info className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Select at least one program specialization to continue</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Application Sources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Preferred Application Sources
          </CardTitle>
          <CardDescription>
            Choose which application sources your agent should handle
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {APPLICATION_SOURCES.map((source) => (
              <Button
                key={source}
                variant={data.application_sources?.includes(source) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleApplicationSource(source)}
              >
                {source}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Geographic Focus */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Geographic Focus
          </CardTitle>
          <CardDescription>
            Specify geographic regions for application processing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {GEOGRAPHIC_REGIONS.map((region) => (
              <Button
                key={region}
                variant={data.geographic_preferences?.includes(region) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleGeographicPreference(region)}
              >
                {region}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Document Types */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Document Processing
          </CardTitle>
          <CardDescription>
            Select document types your agent should process automatically
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {DOCUMENT_TYPES.map((docType) => (
              <Button
                key={docType}
                variant={data.document_types?.includes(docType) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleDocumentType(docType)}
              >
                {docType}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Priority Criteria */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Priority Criteria
          </CardTitle>
          <CardDescription>
            Define which applications should receive priority processing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {PRIORITY_CRITERIA.map((criteria) => (
              <Button
                key={criteria.id}
                variant={data.priority_criteria?.[criteria.id] ? "default" : "outline"}
                className="justify-start h-auto p-3"
                onClick={() => togglePriorityCriteria(criteria.id)}
              >
                <div className="text-left">
                  <div className="font-medium text-sm">{criteria.label}</div>
                  <div className="text-xs opacity-80">{criteria.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filter Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Filter Configuration Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-sm mb-2">Program Specializations</h4>
                <p className="text-sm text-muted-foreground">
                  {data.program_specializations?.length || 0} selected
                </p>
                {data.program_specializations && data.program_specializations.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {data.program_specializations.slice(0, 3).map(spec => (
                      <Badge key={spec} variant="outline" className="text-xs">{spec}</Badge>
                    ))}
                    {data.program_specializations.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{data.program_specializations.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}
              </div>
              
              <div>
                <h4 className="font-medium text-sm mb-2">Application Sources</h4>
                <p className="text-sm text-muted-foreground">
                  {data.application_sources?.length || 0} sources configured
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-sm mb-2">Geographic Scope</h4>
                <p className="text-sm text-muted-foreground">
                  {data.geographic_preferences?.length || 0} regions selected
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-sm mb-2">Priority Criteria</h4>
                <p className="text-sm text-muted-foreground">
                  {Object.keys(data.priority_criteria || {}).length} criteria active
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}