import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Upload,
  Info,
  ExternalLink,
  Download
} from "lucide-react";
import { PROGRAM_DETAILS, StandardizedProgram } from "@/constants/programs";
import { programRequirements } from "@/data/programRequirements";

interface RequirementsViewProps {
  program: StandardizedProgram;
  onContinue: () => void;
  onBack: () => void;
}

const RequirementsView: React.FC<RequirementsViewProps> = ({
  program,
  onContinue,
  onBack
}) => {
  const [checkedRequirements, setCheckedRequirements] = useState<Set<string>>(new Set());
  const details = PROGRAM_DETAILS[program];
  const requirements = programRequirements[program] || [];

  const toggleRequirement = (reqId: string) => {
    const newChecked = new Set(checkedRequirements);
    if (newChecked.has(reqId)) {
      newChecked.delete(reqId);
    } else {
      newChecked.add(reqId);
    }
    setCheckedRequirements(newChecked);
  };

  const mandatoryRequirements = requirements.filter(req => req.mandatory);
  const optionalRequirements = requirements.filter(req => !req.mandatory);

  const academicRequirements = [
    {
      title: 'High School Diploma or Equivalent',
      description: 'Official transcripts showing completion of secondary education',
      mandatory: true,
      status: 'required'
    },
    {
      title: 'Minimum GPA Requirement',
      description: program === 'Aviation' ? '3.0 GPA minimum' : '2.5 GPA minimum',
      mandatory: true,
      status: 'required'
    },
    {
      title: 'Prerequisites Completed',
      description: details.requirements.join(', '),
      mandatory: true,
      status: 'required'
    }
  ];

  const languageRequirements = [
    {
      test: 'IELTS',
      score: '6.5 overall (6.0 minimum in each band)',
      validity: '2 years'
    },
    {
      test: 'TOEFL iBT',
      score: '79 overall (19 minimum in each section)',
      validity: '2 years'
    },
    {
      test: 'PTE Academic',
      score: '58 overall (50 minimum in each section)',
      validity: '2 years'
    }
  ];

  const preparationTips = {
    'Health Care Assistant': [
      'Complete a health and safety course',
      'Gain volunteer experience in healthcare settings',
      'Update your immunization records',
      'Consider taking a basic anatomy course'
    ],
    'Aviation': [
      'Review mathematics and physics fundamentals',
      'Complete a medical examination',
      'Familiarize yourself with aviation terminology',
      'Consider ground school preparation courses'
    ],
    'ECE': [
      'Volunteer with children in educational settings',
      'Complete child development courses',
      'Update background check and clearances',
      'Practice communication and patience skills'
    ],
    'Hospitality': [
      'Gain customer service experience',
      'Practice multiple languages if possible',
      'Complete food safety certification',
      'Develop professional presentation skills'
    ],
    'Education Assistant': [
      'Volunteer in school environments',
      'Complete courses in child psychology',
      'Obtain necessary background clearances',
      'Practice assistive technology skills'
    ],
    'MLA': [
      'Review basic science and chemistry',
      'Complete laboratory safety training',
      'Gain experience with precision and detail work',
      'Update health and safety certifications'
    ]
  };

  const programTips = preparationTips[program] || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="cursor-pointer hover:text-primary" onClick={onBack}>Financial Information</span>
          <span>/</span>
          <span>Requirements</span>
        </div>
        <div>
          <h1 className="text-3xl font-bold">Program Requirements</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Review all requirements needed to apply for {program}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Requirements Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Requirements Checklist
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="academic" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="academic">Academic</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                  <TabsTrigger value="language">Language</TabsTrigger>
                </TabsList>

                <TabsContent value="academic" className="space-y-4">
                  {academicRequirements.map((req, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 border rounded-lg">
                      <div className="mt-1">
                        {req.mandatory ? (
                          <AlertCircle className="w-5 h-5 text-red-500" />
                        ) : (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{req.title}</h4>
                          <Badge variant={req.mandatory ? "destructive" : "secondary"}>
                            {req.mandatory ? "Required" : "Optional"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{req.description}</p>
                      </div>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="documents" className="space-y-4">
                  <div className="space-y-4">
                    <h4 className="font-medium text-red-600 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Mandatory Documents
                    </h4>
                    {mandatoryRequirements.map((req) => (
                      <div key={req.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h5 className="font-medium">{req.name}</h5>
                              <Badge variant="destructive">Required</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">{req.description}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>Formats: {req.acceptedFormats.join(', ')}</span>
                              <span>Max size: {req.maxSize}MB</span>
                            </div>
                          </div>
                          <Button
                            variant={checkedRequirements.has(req.id) ? "default" : "outline"}
                            size="sm"
                            onClick={() => toggleRequirement(req.id)}
                          >
                            {checkedRequirements.has(req.id) ? (
                              <>
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Ready
                              </>
                            ) : (
                              'Mark Ready'
                            )}
                          </Button>
                        </div>
                      </div>
                    ))}

                    {optionalRequirements.length > 0 && (
                      <>
                        <h4 className="font-medium text-blue-600 flex items-center gap-2 mt-6">
                          <Info className="w-4 h-4" />
                          Optional Documents
                        </h4>
                        {optionalRequirements.map((req) => (
                          <div key={req.id} className="p-4 border rounded-lg">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h5 className="font-medium">{req.name}</h5>
                                  <Badge variant="secondary">Optional</Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mb-3">{req.description}</p>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                  <span>Formats: {req.acceptedFormats.join(', ')}</span>
                                  <span>Max size: {req.maxSize}MB</span>
                                </div>
                              </div>
                              <Button
                                variant={checkedRequirements.has(req.id) ? "default" : "outline"}
                                size="sm"
                                onClick={() => toggleRequirement(req.id)}
                              >
                                {checkedRequirements.has(req.id) ? (
                                  <>
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Ready
                                  </>
                                ) : (
                                  'Mark Ready'
                                )}
                              </Button>
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="language" className="space-y-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Info className="w-4 h-4" />
                      English Language Proficiency
                    </h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      International students and students whose first language is not English must demonstrate proficiency through one of the following tests:
                    </p>
                  </div>

                  {languageRequirements.map((test, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-medium">{test.test}</h5>
                          <p className="text-sm text-muted-foreground">Minimum Score: {test.score}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline">Valid {test.validity}</Badge>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h5 className="font-medium text-green-800 mb-2">Exemptions</h5>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• Completed high school in English</li>
                      <li>• Completed post-secondary education in English</li>
                      <li>• Native English speakers from recognized countries</li>
                    </ul>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Preparation Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Preparation Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {programTips.map((tip, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{tip}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Progress Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Your Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Documents Ready:</span>
                  <span className="font-medium">
                    {checkedRequirements.size}/{requirements.length}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(checkedRequirements.size / requirements.length) * 100}%` }}
                  />
                </div>
                <div className="text-xs text-muted-foreground">
                  {mandatoryRequirements.every(req => checkedRequirements.has(req.id)) 
                    ? "All mandatory requirements ready!"
                    : "Complete mandatory requirements to proceed"}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download Checklist
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm">
                <ExternalLink className="w-4 h-4 mr-2" />
                Get Document Templates
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Upload className="w-4 h-4 mr-2" />
                Upload Documents
              </Button>
            </CardContent>
          </Card>

          {/* Help & Support */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <p className="text-muted-foreground">
                  Our admissions team is here to help with any questions about requirements.
                </p>
                <Button variant="outline" className="w-full" size="sm">
                  Contact Admissions
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Continue Button */}
          <Button 
            onClick={onContinue} 
            className="w-full py-6 text-lg"
            size="lg"
            disabled={!mandatoryRequirements.every(req => checkedRequirements.has(req.id))}
          >
            Continue to Intake Selection
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RequirementsView;