import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Upload } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface EducationInstitution {
  id: string;
  institutionName: string;
  degree: string;
  fieldOfStudy: string;
  gpa?: string;
  maxGpa?: string;
  graduationDate?: string;
  currentlyEnrolled: boolean;
  honors?: string[];
  relevantCoursework?: string[];
  transcriptUploaded: boolean;
  transcriptPath?: string;
}

interface EducationData {
  institutions?: EducationInstitution[];
  additionalQualifications?: string;
  languageProficiency?: {
    language: string;
    proficiency: 'beginner' | 'intermediate' | 'advanced' | 'native';
    certified: boolean;
    testScore?: string;
  }[];
}

interface EducationBackgroundStepProps {
  data: EducationData;
  onUpdate: (data: EducationData) => void;
}

const EducationBackgroundStep: React.FC<EducationBackgroundStepProps> = ({ data, onUpdate }) => {
  const [formData, setFormData] = useState<EducationData>({
    institutions: [],
    additionalQualifications: '',
    languageProficiency: [],
    ...data
  });

  useEffect(() => {
    onUpdate(formData);
  }, [formData, onUpdate]);

  const addInstitution = () => {
    const newInstitution: EducationInstitution = {
      id: crypto.randomUUID(),
      institutionName: '',
      degree: '',
      fieldOfStudy: '',
      currentlyEnrolled: false,
      transcriptUploaded: false,
      honors: [],
      relevantCoursework: []
    };

    setFormData(prev => ({
      ...prev,
      institutions: [...(prev.institutions || []), newInstitution]
    }));
  };

  const removeInstitution = (id: string) => {
    setFormData(prev => ({
      ...prev,
      institutions: prev.institutions?.filter(inst => inst.id !== id) || []
    }));
  };

  const updateInstitution = (id: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      institutions: prev.institutions?.map(inst => 
        inst.id === id ? { ...inst, [field]: value } : inst
      ) || []
    }));
  };

  const handleTranscriptUpload = (institutionId: string) => {
    // Mock file upload for now
    toast({
      title: "File Upload",
      description: "File upload functionality will be implemented with the document system."
    });
    
    updateInstitution(institutionId, 'transcriptUploaded', true);
    updateInstitution(institutionId, 'transcriptPath', `transcript_${institutionId}.pdf`);
  };

  const addLanguage = () => {
    const newLanguage = {
      language: '',
      proficiency: 'intermediate' as const,
      certified: false
    };

    setFormData(prev => ({
      ...prev,
      languageProficiency: [...(prev.languageProficiency || []), newLanguage]
    }));
  };

  const removeLanguage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      languageProficiency: prev.languageProficiency?.filter((_, i) => i !== index) || []
    }));
  };

  const updateLanguage = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      languageProficiency: prev.languageProficiency?.map((lang, i) => 
        i === index ? { ...lang, [field]: value } : lang
      ) || []
    }));
  };

  return (
    <div className="space-y-6">
      {/* Education Institutions */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-semibold">Education History</h4>
          <Button onClick={addInstitution} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Institution
          </Button>
        </div>

        {formData.institutions && formData.institutions.length > 0 ? (
          <div className="space-y-4">
            {formData.institutions.map((institution, index) => (
              <Card key={institution.id} className="p-4 border-l-4 border-l-primary">
                <div className="flex justify-between items-start mb-4">
                  <h5 className="font-medium">Institution {index + 1}</h5>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeInstitution(institution.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Institution Name *</Label>
                    <Input
                      value={institution.institutionName}
                      onChange={(e) => updateInstitution(institution.id, 'institutionName', e.target.value)}
                      placeholder="Enter institution name"
                      required
                    />
                  </div>

                  <div>
                    <Label>Degree/Qualification *</Label>
                    <Select 
                      value={institution.degree} 
                      onValueChange={(value) => updateInstitution(institution.id, 'degree', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select degree type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high_school">High School Diploma</SelectItem>
                        <SelectItem value="associate">Associate Degree</SelectItem>
                        <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                        <SelectItem value="master">Master's Degree</SelectItem>
                        <SelectItem value="doctorate">Doctorate/PhD</SelectItem>
                        <SelectItem value="certificate">Certificate</SelectItem>
                        <SelectItem value="diploma">Diploma</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Field of Study *</Label>
                    <Input
                      value={institution.fieldOfStudy}
                      onChange={(e) => updateInstitution(institution.id, 'fieldOfStudy', e.target.value)}
                      placeholder="Enter field of study"
                      required
                    />
                  </div>

                  <div>
                    <Label>Graduation Date</Label>
                    <Input
                      type="date"
                      value={institution.graduationDate}
                      onChange={(e) => updateInstitution(institution.id, 'graduationDate', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label>GPA (Optional)</Label>
                    <div className="flex gap-2">
                      <Input
                        value={institution.gpa}
                        onChange={(e) => updateInstitution(institution.id, 'gpa', e.target.value)}
                        placeholder="3.5"
                      />
                      <span className="flex items-center px-2">out of</span>
                      <Input
                        value={institution.maxGpa}
                        onChange={(e) => updateInstitution(institution.id, 'maxGpa', e.target.value)}
                        placeholder="4.0"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Currently Enrolled</Label>
                    <Select 
                      value={institution.currentlyEnrolled.toString()} 
                      onValueChange={(value) => updateInstitution(institution.id, 'currentlyEnrolled', value === 'true')}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Yes</SelectItem>
                        <SelectItem value="false">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="md:col-span-2">
                    <Label>Relevant Coursework (Optional)</Label>
                    <Textarea
                      value={institution.relevantCoursework?.join(', ')}
                      onChange={(e) => updateInstitution(institution.id, 'relevantCoursework', e.target.value.split(', ').filter(course => course.trim()))}
                      placeholder="Enter relevant courses separated by commas"
                      rows={2}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label>Honors & Awards (Optional)</Label>
                    <Textarea
                      value={institution.honors?.join(', ')}
                      onChange={(e) => updateInstitution(institution.id, 'honors', e.target.value.split(', ').filter(honor => honor.trim()))}
                      placeholder="Enter honors and awards separated by commas"
                      rows={2}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label>Official Transcript</Label>
                    <div className="flex items-center gap-4 mt-2">
                      {institution.transcriptUploaded ? (
                        <div className="flex items-center gap-2 text-green-600">
                          <span>✓ Transcript uploaded</span>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          onClick={() => handleTranscriptUpload(institution.id)}
                          size="sm"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Transcript
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No educational institutions added yet.</p>
            <p>Click "Add Institution" to get started.</p>
          </div>
        )}
      </Card>

      {/* Language Proficiency */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-semibold">Language Proficiency</h4>
          <Button onClick={addLanguage} size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Language
          </Button>
        </div>

        {formData.languageProficiency && formData.languageProficiency.length > 0 ? (
          <div className="space-y-4">
            {formData.languageProficiency.map((language, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
                <div>
                  <Label>Language</Label>
                  <Input
                    value={language.language}
                    onChange={(e) => updateLanguage(index, 'language', e.target.value)}
                    placeholder="e.g., English, Spanish"
                  />
                </div>

                <div>
                  <Label>Proficiency Level</Label>
                  <Select 
                    value={language.proficiency} 
                    onValueChange={(value) => updateLanguage(index, 'proficiency', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                      <SelectItem value="native">Native</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Test Score (Optional)</Label>
                  <Input
                    value={language.testScore}
                    onChange={(e) => updateLanguage(index, 'testScore', e.target.value)}
                    placeholder="e.g., TOEFL 100, IELTS 7.5"
                  />
                </div>

                <div className="flex items-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeLanguage(index)}
                    className="text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No languages added yet.</p>
        )}
      </Card>

      {/* Additional Qualifications */}
      <Card className="p-6">
        <h4 className="text-lg font-semibold mb-4">Additional Qualifications</h4>
        <Textarea
          value={formData.additionalQualifications}
          onChange={(e) => setFormData(prev => ({ ...prev, additionalQualifications: e.target.value }))}
          placeholder="Describe any additional qualifications, certifications, or training not covered above..."
          rows={4}
        />
      </Card>
    </div>
  );
};

export default EducationBackgroundStep;