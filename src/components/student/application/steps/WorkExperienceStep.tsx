import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, Briefcase, Heart, GraduationCap } from "lucide-react";

interface Experience {
  id: string;
  type: 'professional' | 'volunteer' | 'internship';
  organization: string;
  position: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  skills: string[];
  relevanceToProgram: number;
  supervisor?: {
    name: string;
    title: string;
    email: string;
    phone: string;
  };
}

interface WorkExperienceData {
  experiences?: Experience[];
  additionalInfo?: string;
}

interface WorkExperienceStepProps {
  data: WorkExperienceData;
  onUpdate: (data: WorkExperienceData) => void;
}

const WorkExperienceStep: React.FC<WorkExperienceStepProps> = ({ data, onUpdate }) => {
  const [formData, setFormData] = useState<WorkExperienceData>({
    experiences: [],
    additionalInfo: '',
    ...data
  });

  useEffect(() => {
    onUpdate(formData);
  }, [formData, onUpdate]);

  const addExperience = (type: 'professional' | 'volunteer' | 'internship') => {
    const newExperience: Experience = {
      id: crypto.randomUUID(),
      type,
      organization: '',
      position: '',
      startDate: '',
      current: false,
      description: '',
      skills: [],
      relevanceToProgram: 5
    };

    setFormData(prev => ({
      ...prev,
      experiences: [...(prev.experiences || []), newExperience]
    }));
  };

  const removeExperience = (id: string) => {
    setFormData(prev => ({
      ...prev,
      experiences: prev.experiences?.filter(exp => exp.id !== id) || []
    }));
  };

  const updateExperience = (id: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      experiences: prev.experiences?.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      ) || []
    }));
  };

  const updateSupervisor = (experienceId: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      experiences: prev.experiences?.map(exp => 
        exp.id === experienceId 
          ? { 
              ...exp, 
              supervisor: { 
                ...exp.supervisor, 
                [field]: value 
              } 
            } 
          : exp
      ) || []
    }));
  };

  const getExperienceIcon = (type: string) => {
    switch (type) {
      case 'professional':
        return <Briefcase className="w-4 h-4" />;
      case 'volunteer':
        return <Heart className="w-4 h-4" />;
      case 'internship':
        return <GraduationCap className="w-4 h-4" />;
      default:
        return <Briefcase className="w-4 h-4" />;
    }
  };

  const getExperienceTypeLabel = (type: string) => {
    switch (type) {
      case 'professional':
        return 'Professional Experience';
      case 'volunteer':
        return 'Volunteer Experience';
      case 'internship':
        return 'Internship Experience';
      default:
        return 'Experience';
    }
  };

  const professionalExperiences = formData.experiences?.filter(exp => exp.type === 'professional') || [];
  const volunteerExperiences = formData.experiences?.filter(exp => exp.type === 'volunteer') || [];
  const internshipExperiences = formData.experiences?.filter(exp => exp.type === 'internship') || [];

  const renderExperienceCard = (experience: Experience, index: number) => (
    <Card key={experience.id} className="p-4 border-l-4 border-l-primary">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          {getExperienceIcon(experience.type)}
          <h5 className="font-medium">{getExperienceTypeLabel(experience.type)} {index + 1}</h5>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => removeExperience(experience.id)}
          className="text-destructive"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Organization/Company *</Label>
          <Input
            value={experience.organization}
            onChange={(e) => updateExperience(experience.id, 'organization', e.target.value)}
            placeholder="Enter organization name"
            required
          />
        </div>

        <div>
          <Label>Position/Role *</Label>
          <Input
            value={experience.position}
            onChange={(e) => updateExperience(experience.id, 'position', e.target.value)}
            placeholder="Enter your position"
            required
          />
        </div>

        <div>
          <Label>Start Date *</Label>
          <Input
            type="date"
            value={experience.startDate}
            onChange={(e) => updateExperience(experience.id, 'startDate', e.target.value)}
            required
          />
        </div>

        <div>
          <Label>End Date</Label>
          <div className="space-y-2">
            <Input
              type="date"
              value={experience.endDate}
              onChange={(e) => updateExperience(experience.id, 'endDate', e.target.value)}
              disabled={experience.current}
            />
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`current-${experience.id}`}
                checked={experience.current}
                onCheckedChange={(checked) => {
                  updateExperience(experience.id, 'current', checked);
                  if (checked) {
                    updateExperience(experience.id, 'endDate', '');
                  }
                }}
              />
              <Label htmlFor={`current-${experience.id}`} className="text-sm">
                I currently work here
              </Label>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <Label>Description *</Label>
          <Textarea
            value={experience.description}
            onChange={(e) => updateExperience(experience.id, 'description', e.target.value)}
            placeholder="Describe your responsibilities, achievements, and impact..."
            rows={4}
            required
          />
        </div>

        <div className="md:col-span-2">
          <Label>Skills Gained</Label>
          <Textarea
            value={experience.skills.join(', ')}
            onChange={(e) => updateExperience(experience.id, 'skills', e.target.value.split(', ').filter(skill => skill.trim()))}
            placeholder="Enter skills separated by commas (e.g., Project Management, Leadership, Data Analysis)"
            rows={2}
          />
        </div>

        <div>
          <Label>Relevance to Program (1-10)</Label>
          <Select 
            value={experience.relevanceToProgram.toString()} 
            onValueChange={(value) => updateExperience(experience.id, 'relevanceToProgram', parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                <SelectItem key={num} value={num.toString()}>
                  {num} {num <= 3 ? '(Low)' : num <= 7 ? '(Medium)' : '(High)'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Supervisor Information */}
        <div className="md:col-span-2">
          <Label className="text-base font-medium">Supervisor Information (Optional)</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 p-4 bg-muted/50 rounded-lg">
            <div>
              <Label>Name</Label>
              <Input
                value={experience.supervisor?.name || ''}
                onChange={(e) => updateSupervisor(experience.id, 'name', e.target.value)}
                placeholder="Supervisor's name"
              />
            </div>
            <div>
              <Label>Title</Label>
              <Input
                value={experience.supervisor?.title || ''}
                onChange={(e) => updateSupervisor(experience.id, 'title', e.target.value)}
                placeholder="Supervisor's title"
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={experience.supervisor?.email || ''}
                onChange={(e) => updateSupervisor(experience.id, 'email', e.target.value)}
                placeholder="Supervisor's email"
              />
            </div>
            <div>
              <Label>Phone</Label>
              <Input
                type="tel"
                value={experience.supervisor?.phone || ''}
                onChange={(e) => updateSupervisor(experience.id, 'phone', e.target.value)}
                placeholder="Supervisor's phone"
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Professional Experience */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            <h4 className="text-lg font-semibold">Professional Experience</h4>
          </div>
          <Button onClick={() => addExperience('professional')} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Professional Experience
          </Button>
        </div>

        {professionalExperiences.length > 0 ? (
          <div className="space-y-4">
            {professionalExperiences.map((experience, index) => renderExperienceCard(experience, index))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Briefcase className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No professional experience added yet.</p>
          </div>
        )}
      </Card>

      {/* Volunteer Experience */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5" />
            <h4 className="text-lg font-semibold">Volunteer Experience</h4>
          </div>
          <Button onClick={() => addExperience('volunteer')} size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Volunteer Experience
          </Button>
        </div>

        {volunteerExperiences.length > 0 ? (
          <div className="space-y-4">
            {volunteerExperiences.map((experience, index) => renderExperienceCard(experience, index))}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            <Heart className="w-10 h-10 mx-auto mb-2 opacity-50" />
            <p>No volunteer experience added yet.</p>
          </div>
        )}
      </Card>

      {/* Internship Experience */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5" />
            <h4 className="text-lg font-semibold">Internship Experience</h4>
          </div>
          <Button onClick={() => addExperience('internship')} size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Internship Experience
          </Button>
        </div>

        {internshipExperiences.length > 0 ? (
          <div className="space-y-4">
            {internshipExperiences.map((experience, index) => renderExperienceCard(experience, index))}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            <GraduationCap className="w-10 h-10 mx-auto mb-2 opacity-50" />
            <p>No internship experience added yet.</p>
          </div>
        )}
      </Card>

      {/* Additional Information */}
      <Card className="p-6">
        <h4 className="text-lg font-semibold mb-4">Additional Information</h4>
        <Textarea
          value={formData.additionalInfo}
          onChange={(e) => setFormData(prev => ({ ...prev, additionalInfo: e.target.value }))}
          placeholder="Describe any other relevant experiences, projects, or achievements not covered above..."
          rows={4}
        />
      </Card>
    </div>
  );
};

export default WorkExperienceStep;