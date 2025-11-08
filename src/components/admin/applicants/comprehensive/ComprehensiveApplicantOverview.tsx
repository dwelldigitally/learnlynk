// @ts-nocheck
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { SectionNavigation } from './SectionNavigation';
import { 
  User, 
  FileText, 
  MessageSquare, 
  Briefcase,
  Users,
  Star,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Applicant } from '@/types/applicant';
import { getMockApplicationData } from '@/data/mockApplicationData';
import { StudentProfileSection } from './StudentProfileSection';
import { ApplicationEssayViewer } from './ApplicationEssayViewer';
import { ApplicationResponsesViewer } from './ApplicationResponsesViewer';
import { ProfessionalExperiencePanel } from './ProfessionalExperiencePanel';

interface ComprehensiveApplicantOverviewProps {
  applicant: Applicant;
}

export const ComprehensiveApplicantOverview: React.FC<ComprehensiveApplicantOverviewProps> = ({ applicant }) => {
  // Get comprehensive student data
  const studentData = getMockApplicationData(applicant.id);

  // State for collapsible sections
  const [openSections, setOpenSections] = useState({
    aiAssessment: true,
    profile: true,
    essays: true,
    responses: true,
    experience: true,
    references: true,
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="flex gap-8 items-start min-h-screen">
      {/* Section Navigation Sidebar */}
      <SectionNavigation />
      
      {/* Main Content */}
      <div className="flex-1 space-y-8 pb-20">
        {/* AI Assessment Summary */}
        <Collapsible
          id="ai-assessment"
          className="scroll-mt-20"
          open={openSections.aiAssessment}
          onOpenChange={() => toggleSection('aiAssessment')}
        >
          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <CollapsibleTrigger className="flex items-center justify-between w-full hover:opacity-80 transition-opacity">
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-primary" />
                  AI Assessment Summary
                </CardTitle>
                {openSections.aiAssessment ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </CollapsibleTrigger>
            </CardHeader>
            <CollapsibleContent className="animate-accordion-down data-[state=closed]:animate-accordion-up">
              <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{studentData.aiAssessment.overallFitScore}%</div>
                <p className="text-xs text-muted-foreground">Overall Fit</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{studentData.aiAssessment.academicReadiness}%</div>
                <p className="text-xs text-muted-foreground">Academic Readiness</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{studentData.aiAssessment.motivationLevel}%</div>
                <p className="text-xs text-muted-foreground">Motivation</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{studentData.aiAssessment.careerAlignment}%</div>
                <p className="text-xs text-muted-foreground">Career Alignment</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{studentData.aiAssessment.communicationSkills}%</div>
                <p className="text-xs text-muted-foreground">Communication</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-teal-600">{studentData.aiAssessment.culturalFit}%</div>
                <p className="text-xs text-muted-foreground">Cultural Fit</p>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-sm mb-2">Key Strengths</h4>
                  <div className="flex flex-wrap gap-1">
                    {studentData.aiAssessment.strengths.map((strength, index) => (
                      <Badge key={index} variant="default" className="text-xs">{strength}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-2">Recommendations</h4>
                  <div className="flex flex-wrap gap-1">
                    {studentData.aiAssessment.recommendations.map((rec, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">{rec}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Profile Section */}
        <Collapsible
          id="profile"
          className="scroll-mt-20"
          open={openSections.profile}
          onOpenChange={() => toggleSection('profile')}
        >
          <div className="flex items-center justify-between mb-4 cursor-pointer group hover:bg-muted/50 p-3 rounded-lg transition-colors" onClick={() => toggleSection('profile')}>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                <User className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold">Student Profile</h2>
            </div>
            <button className="flex items-center gap-2 px-3 py-2 rounded-md bg-secondary/50 hover:bg-secondary transition-colors">
              <span className="text-sm font-medium">
                {openSections.profile ? 'Collapse' : 'Expand'}
              </span>
              {openSections.profile ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>
          </div>
          <CollapsibleContent className="animate-accordion-down data-[state=closed]:animate-accordion-up">
            <StudentProfileSection profile={studentData} />
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Essays Section */}
        <Collapsible
          id="essays"
          className="scroll-mt-20"
          open={openSections.essays}
          onOpenChange={() => toggleSection('essays')}
        >
          <div className="flex items-center justify-between mb-4 cursor-pointer group hover:bg-muted/50 p-3 rounded-lg transition-colors" onClick={() => toggleSection('essays')}>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold">Essays</h2>
              {studentData.essays.length > 0 && (
                <Badge variant="secondary">{studentData.essays.length}</Badge>
              )}
            </div>
            <button className="flex items-center gap-2 px-3 py-2 rounded-md bg-secondary/50 hover:bg-secondary transition-colors">
              <span className="text-sm font-medium">
                {openSections.essays ? 'Collapse' : 'Expand'}
              </span>
              {openSections.essays ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>
          </div>
          <CollapsibleContent className="animate-accordion-down data-[state=closed]:animate-accordion-up">
            <ApplicationEssayViewer essays={studentData.essays} />
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Application Responses Section */}
        <Collapsible
          id="responses"
          className="scroll-mt-20"
          open={openSections.responses}
          onOpenChange={() => toggleSection('responses')}
        >
          <div className="flex items-center justify-between mb-4 cursor-pointer group hover:bg-muted/50 p-3 rounded-lg transition-colors" onClick={() => toggleSection('responses')}>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold">Application Responses</h2>
              {studentData.formResponses.length > 0 && (
                <Badge variant="secondary">{studentData.formResponses.length}</Badge>
              )}
            </div>
            <button className="flex items-center gap-2 px-3 py-2 rounded-md bg-secondary/50 hover:bg-secondary transition-colors">
              <span className="text-sm font-medium">
                {openSections.responses ? 'Collapse' : 'Expand'}
              </span>
              {openSections.responses ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>
          </div>
          <CollapsibleContent className="animate-accordion-down data-[state=closed]:animate-accordion-up">
            <ApplicationResponsesViewer responses={studentData.formResponses} />
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Professional Experience Section */}
        <Collapsible
          id="experience"
          className="scroll-mt-20"
          open={openSections.experience}
          onOpenChange={() => toggleSection('experience')}
        >
          <div className="flex items-center justify-between mb-4 cursor-pointer group hover:bg-muted/50 p-3 rounded-lg transition-colors" onClick={() => toggleSection('experience')}>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                <Briefcase className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold">Experience</h2>
              {(studentData.professionalExperience.length + studentData.extracurriculars.length) > 0 && (
                <Badge variant="secondary">
                  {studentData.professionalExperience.length + studentData.extracurriculars.length}
                </Badge>
              )}
            </div>
            <button className="flex items-center gap-2 px-3 py-2 rounded-md bg-secondary/50 hover:bg-secondary transition-colors">
              <span className="text-sm font-medium">
                {openSections.experience ? 'Collapse' : 'Expand'}
              </span>
              {openSections.experience ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>
          </div>
          <CollapsibleContent className="animate-accordion-down data-[state=closed]:animate-accordion-up">
            <ProfessionalExperiencePanel 
              professionalExperience={studentData.professionalExperience}
              extracurriculars={studentData.extracurriculars}
            />
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* References Section */}
        <Collapsible
          id="references"
          className="scroll-mt-20"
          open={openSections.references}
          onOpenChange={() => toggleSection('references')}
        >
          <div className="flex items-center justify-between mb-4 cursor-pointer group hover:bg-muted/50 p-3 rounded-lg transition-colors" onClick={() => toggleSection('references')}>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold">References</h2>
              {studentData.references.length > 0 && (
                <Badge variant="secondary">{studentData.references.length}</Badge>
              )}
            </div>
            <button className="flex items-center gap-2 px-3 py-2 rounded-md bg-secondary/50 hover:bg-secondary transition-colors">
              <span className="text-sm font-medium">
                {openSections.references ? 'Collapse' : 'Expand'}
              </span>
              {openSections.references ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>
          </div>
          <CollapsibleContent className="animate-accordion-down data-[state=closed]:animate-accordion-up">
            <Card>
              <CardContent className="pt-6">
                {studentData.references.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No references provided</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {studentData.references.map((reference, index) => (
                      <div key={index} className="border rounded-lg p-4 space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold">{reference.name}</h4>
                            <p className="text-sm text-muted-foreground">{reference.position}</p>
                            <p className="text-sm text-muted-foreground">{reference.institution}</p>
                          </div>
                          <Badge variant={reference.submitted ? "default" : "secondary"}>
                            {reference.submitted ? "Submitted" : "Pending"}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-sm"><span className="font-medium">Relationship:</span> {reference.relationship}</p>
                          <p className="text-sm"><span className="font-medium">Email:</span> {reference.email}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};
