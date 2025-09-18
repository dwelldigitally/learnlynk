// @ts-nocheck
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  User, 
  FileText, 
  MessageSquare, 
  Briefcase,
  GraduationCap,
  Users,
  Star
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
  const [activeTab, setActiveTab] = useState('profile');
  
  // Get comprehensive student data
  const studentData = getMockApplicationData(applicant.id);

  const tabCounts = {
    essays: studentData.essays.length,
    responses: studentData.formResponses.length,
    experience: studentData.professionalExperience.length + studentData.extracurriculars.length,
    references: studentData.references.length
  };

  return (
    <div className="space-y-6">
      {/* AI Assessment Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            AI Assessment Summary
          </CardTitle>
        </CardHeader>
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
      </Card>

      {/* Detailed Information Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="essays" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Essays
            {tabCounts.essays > 0 && (
              <Badge variant="secondary" className="ml-1 text-xs">{tabCounts.essays}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="responses" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Responses
            {tabCounts.responses > 0 && (
              <Badge variant="secondary" className="ml-1 text-xs">{tabCounts.responses}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="experience" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Experience
            {tabCounts.experience > 0 && (
              <Badge variant="secondary" className="ml-1 text-xs">{tabCounts.experience}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="references" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            References
            {tabCounts.references > 0 && (
              <Badge variant="secondary" className="ml-1 text-xs">{tabCounts.references}</Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="profile">
            <StudentProfileSection profile={studentData} />
          </TabsContent>

          <TabsContent value="essays">
            <ApplicationEssayViewer essays={studentData.essays} />
          </TabsContent>

          <TabsContent value="responses">
            <ApplicationResponsesViewer responses={studentData.formResponses} />
          </TabsContent>

          <TabsContent value="experience">
            <ProfessionalExperiencePanel 
              professionalExperience={studentData.professionalExperience}
              extracurriculars={studentData.extracurriculars}
            />
          </TabsContent>

          <TabsContent value="references">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  References ({studentData.references.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
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
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};