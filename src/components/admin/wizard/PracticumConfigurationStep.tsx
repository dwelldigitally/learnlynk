import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Program } from "@/types/program";
import { usePracticumSites, usePracticumJourneys } from "@/hooks/usePracticum";
import { useAuth } from "@/contexts/AuthContext";
import { Plus, MapPin, Clock, FileText, Award, X } from "lucide-react";

interface PracticumConfigurationStepProps {
  data: Partial<Program>;
  onDataChange: (data: Partial<Program>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const COMMON_DOCUMENTS = [
  "Police Background Check",
  "Immunization Records",
  "CPR Certification", 
  "Liability Insurance",
  "Health Physical",
  "First Aid Certificate",
  "TB Test",
  "Drug Screening"
];

const COMPETENCY_CATEGORIES = [
  "Clinical Skills",
  "Patient Care", 
  "Communication",
  "Critical Thinking",
  "Professional Behavior",
  "Safety Protocols",
  "Documentation",
  "Team Collaboration"
];

const ASSESSMENT_METHODS = [
  "Direct Observation",
  "Portfolio Review",
  "Practical Exam",
  "Case Study",
  "Peer Assessment",
  "Self-Assessment",
  "Supervisor Evaluation"
];

const PracticumConfigurationStep: React.FC<PracticumConfigurationStepProps> = ({
  data,
  onDataChange,
  onNext,
  onPrevious
}) => {
  const { session } = useAuth();
  const { data: sites, isLoading: sitesLoading } = usePracticumSites(session?.user?.id || '');
  const { data: journeys, isLoading: journeysLoading } = usePracticumJourneys(session?.user?.id || '');
  
  const [newCompetency, setNewCompetency] = useState({
    name: '',
    category: '',
    assessment_method: '',
    required: true
  });
  const [customDocument, setCustomDocument] = useState('');

  const practicumData = data.practicum || {
    enabled: false,
    duration_weeks: 8,
    total_hours_required: 200,
    start_timing: 'After completing 75% of coursework',
    document_requirements: [],
    assigned_sites: [],
    journey_id: '',
    competencies_required: []
  };

  const updatePracticumData = (updates: Partial<typeof practicumData>) => {
    onDataChange({
      practicum: { ...practicumData, ...updates }
    });
  };

  const toggleDocumentRequirement = (document: string) => {
    const current = practicumData.document_requirements;
    const updated = current.includes(document)
      ? current.filter(d => d !== document)
      : [...current, document];
    updatePracticumData({ document_requirements: updated });
  };

  const addCustomDocument = () => {
    if (customDocument.trim() && !practicumData.document_requirements.includes(customDocument.trim())) {
      updatePracticumData({
        document_requirements: [...practicumData.document_requirements, customDocument.trim()]
      });
      setCustomDocument('');
    }
  };

  const removeDocument = (document: string) => {
    updatePracticumData({
      document_requirements: practicumData.document_requirements.filter(d => d !== document)
    });
  };

  const addCompetency = () => {
    if (newCompetency.name && newCompetency.category && newCompetency.assessment_method) {
      updatePracticumData({
        competencies_required: [...practicumData.competencies_required, { ...newCompetency }]
      });
      setNewCompetency({ name: '', category: '', assessment_method: '', required: true });
    }
  };

  const removeCompetency = (index: number) => {
    updatePracticumData({
      competencies_required: practicumData.competencies_required.filter((_, i) => i !== index)
    });
  };

  const toggleSiteAssignment = (siteId: string) => {
    const current = practicumData.assigned_sites;
    const updated = current.includes(siteId)
      ? current.filter(id => id !== siteId)
      : [...current, siteId];
    updatePracticumData({ assigned_sites: updated });
  };

  if (sitesLoading || journeysLoading) {
    return <div className="animate-pulse">Loading practicum configuration...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Practicum Toggle */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Practicum Requirement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base font-medium">
                Does this program require a practicum?
              </Label>
              <p className="text-sm text-muted-foreground">
                Enable this if students need hands-on field experience
              </p>
            </div>
            <Switch
              checked={practicumData.enabled}
              onCheckedChange={(enabled) => updatePracticumData({ enabled })}
            />
          </div>
        </CardContent>
      </Card>

      {practicumData.enabled && (
        <>
          {/* Basic Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (Weeks)</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="1"
                    value={practicumData.duration_weeks}
                    onChange={(e) => updatePracticumData({ duration_weeks: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hours">Total Hours Required</Label>
                  <Input
                    id="hours"
                    type="number"
                    min="1"
                    value={practicumData.total_hours_required}
                    onChange={(e) => updatePracticumData({ total_hours_required: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timing">Start Timing</Label>
                <Select
                  value={practicumData.start_timing}
                  onValueChange={(value) => updatePracticumData({ start_timing: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Immediately after enrollment">Immediately after enrollment</SelectItem>
                    <SelectItem value="After completing 50% of coursework">After completing 50% of coursework</SelectItem>
                    <SelectItem value="After completing 75% of coursework">After completing 75% of coursework</SelectItem>
                    <SelectItem value="In final semester">In final semester</SelectItem>
                    <SelectItem value="Upon completing all coursework">Upon completing all coursework</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Document Requirements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Document Requirements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                {COMMON_DOCUMENTS.map((document) => (
                  <div key={document} className="flex items-center space-x-2">
                    <Checkbox
                      id={document}
                      checked={practicumData.document_requirements.includes(document)}
                      onCheckedChange={() => toggleDocumentRequirement(document)}
                    />
                    <Label htmlFor={document} className="text-sm">{document}</Label>
                  </div>
                ))}
              </div>

              {/* Custom Document Input */}
              <div className="space-y-2">
                <Label>Custom Documents</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter custom document requirement..."
                    value={customDocument}
                    onChange={(e) => setCustomDocument(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addCustomDocument()}
                  />
                  <Button type="button" onClick={addCustomDocument} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Selected Documents */}
              {practicumData.document_requirements.length > 0 && (
                <div className="space-y-2">
                  <Label>Selected Documents:</Label>
                  <div className="flex flex-wrap gap-2">
                    {practicumData.document_requirements.map((doc) => (
                      <Badge key={doc} variant="secondary" className="flex items-center gap-1">
                        {doc}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => removeDocument(doc)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Site Assignment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Practicum Sites
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {sites && sites.length > 0 ? (
                <div className="grid gap-3">
                  {sites.map((site) => (
                    <div key={site.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          checked={practicumData.assigned_sites.includes(site.id)}
                          onCheckedChange={() => toggleSiteAssignment(site.id)}
                        />
                        <div>
                          <p className="font-medium">{site.organization}</p>
                          <p className="text-sm text-muted-foreground">{site.address}</p>
                          <div className="flex gap-2 mt-1">
                            {site.specializations?.map((spec) => (
                              <Badge key={spec} variant="outline" className="text-xs">{spec}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No practicum sites available.</p>
                  <p className="text-sm">Create sites in the Practicum Sites section first.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Journey Assignment */}
          <Card>
            <CardHeader>
              <CardTitle>Practicum Journey</CardTitle>
            </CardHeader>
            <CardContent>
              {journeys && journeys.length > 0 ? (
                <div className="space-y-2">
                  <Label>Select Practicum Journey</Label>
                  <Select
                    value={practicumData.journey_id}
                    onValueChange={(value) => updatePracticumData({ journey_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a practicum journey..." />
                    </SelectTrigger>
                    <SelectContent>
                      {journeys.map((journey) => (
                        <SelectItem key={journey.id} value={journey.id}>
                          {journey.journey_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <Award className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No practicum journeys available.</p>
                  <p className="text-sm">Create journeys in the Practicum Journeys section first.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Competency Requirements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Competency Requirements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add New Competency */}
              <div className="grid grid-cols-4 gap-2">
                <Input
                  placeholder="Competency name..."
                  value={newCompetency.name}
                  onChange={(e) => setNewCompetency({ ...newCompetency, name: e.target.value })}
                />
                <Select
                  value={newCompetency.category}
                  onValueChange={(value) => setNewCompetency({ ...newCompetency, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {COMPETENCY_CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={newCompetency.assessment_method}
                  onValueChange={(value) => setNewCompetency({ ...newCompetency, assessment_method: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Assessment" />
                  </SelectTrigger>
                  <SelectContent>
                    {ASSESSMENT_METHODS.map((method) => (
                      <SelectItem key={method} value={method}>{method}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={addCompetency} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Competency List */}
              {practicumData.competencies_required.length > 0 && (
                <div className="space-y-2">
                  {practicumData.competencies_required.map((competency, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{competency.name}</p>
                        <div className="flex gap-2 text-sm text-muted-foreground">
                          <Badge variant="outline">{competency.category}</Badge>
                          <Badge variant="outline">{competency.assessment_method}</Badge>
                          {competency.required && <Badge variant="secondary">Required</Badge>}
                        </div>
                      </div>
                      <Button
                        variant="ghost" 
                        size="sm"
                        onClick={() => removeCompetency(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t">
        <Button variant="outline" onClick={onPrevious}>
          Previous
        </Button>
        <Button onClick={onNext}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default PracticumConfigurationStep;