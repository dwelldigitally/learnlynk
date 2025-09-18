import React from 'react';
import { ReviewSession } from '@/types/review';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { GraduationCap, Briefcase, Award, Users, Heart, MapPin } from 'lucide-react';

interface BackgroundReviewPanelProps {
  applicantId: string;
  session: ReviewSession;
}

// Mock comprehensive background data
const mockBackground = {
  education: [
    {
      degree: 'Bachelor of Science in Biology',
      institution: 'University of California, Berkeley',
      gpa: 3.8,
      maxGpa: 4.0,
      graduationYear: '2022',
      honors: ['Magna Cum Laude', 'Phi Beta Kappa'],
      relevantCourses: ['Organic Chemistry', 'Statistics', 'Research Methods', 'Microbiology'],
      activities: ['Pre-Med Society President', 'Research Symposium Presenter']
    },
    {
      degree: 'High School Diploma',
      institution: 'Lincoln High School',
      gpa: 3.9,
      maxGpa: 4.0,
      graduationYear: '2018',
      honors: ['Valedictorian', 'National Honor Society'],
      activities: ['Science Olympiad', 'Debate Team Captain']
    }
  ],
  workExperience: [
    {
      title: 'Research Assistant',
      company: 'Stanford Medical Center',
      duration: '2022 - Present',
      type: 'Full-time',
      description: 'Conducting cardiovascular research under Dr. Smith\'s supervision',
      achievements: ['Co-authored 2 peer-reviewed papers', 'Presented at national conference'],
      skills: ['Data Analysis', 'Laboratory Techniques', 'Statistical Software'],
      relevanceScore: 95
    },
    {
      title: 'Clinical Intern',
      company: 'Bay Area Hospital',
      duration: 'Summer 2021',
      type: 'Internship',
      description: 'Shadowed physicians and assisted with patient care',
      achievements: ['Received excellent evaluation', 'Extended shadowing hours'],
      skills: ['Patient Communication', 'Medical Terminology', 'EMR Systems'],
      relevanceScore: 88
    },
    {
      title: 'Lab Technician',
      company: 'UC Berkeley Biology Dept',
      duration: '2020 - 2022',
      type: 'Part-time',
      description: 'Assisted with undergraduate laboratory courses',
      achievements: ['Trained 50+ students', 'Improved lab safety protocols'],
      skills: ['Teaching', 'Lab Safety', 'Equipment Maintenance'],
      relevanceScore: 75
    }
  ],
  volunteerExperience: [
    {
      organization: 'Free Clinic of Berkeley',
      role: 'Medical Volunteer',
      duration: '2019 - Present',
      hoursPerWeek: 6,
      description: 'Providing healthcare services to underserved populations',
      impact: 'Served 200+ patients, improved health literacy in community',
      skills: ['Patient Care', 'Health Education', 'Cultural Competency']
    },
    {
      organization: 'Red Cross',
      role: 'Disaster Response Volunteer',
      duration: '2020 - 2022',
      hoursPerWeek: 4,
      description: 'Emergency response and community preparedness training',
      impact: 'Responded to 5 local disasters, trained 30+ volunteers',
      skills: ['Emergency Response', 'Team Leadership', 'Crisis Management']
    },
    {
      organization: 'Habitat for Humanity',
      role: 'Construction Volunteer',
      duration: '2018 - 2020',
      hoursPerWeek: 8,
      description: 'Building homes for low-income families',
      impact: 'Helped build 3 homes, 150+ volunteer hours',
      skills: ['Construction', 'Project Management', 'Community Service']
    }
  ]
};

export function BackgroundReviewPanel({ applicantId, session }: BackgroundReviewPanelProps) {
  const getRelevanceColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-semibold">Background Review</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Education Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center">
              <GraduationCap className="h-4 w-4 mr-2" />
              Education Background
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {mockBackground.education.map((edu, index) => (
                <div key={index} className="border-b pb-4 last:border-b-0 last:pb-0">
                  <h4 className="font-medium">{edu.degree}</h4>
                  <p className="text-sm text-muted-foreground flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {edu.institution} • Class of {edu.graduationYear}
                  </p>
                  
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm">GPA: {edu.gpa}/{edu.maxGpa}</span>
                    <div className="flex space-x-1">
                      {edu.honors.map((honor, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {honor}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {edu.relevantCourses && (
                    <div className="mt-3">
                      <div className="text-xs text-muted-foreground mb-1">Relevant Courses:</div>
                      <div className="flex flex-wrap gap-1">
                        {edu.relevantCourses.slice(0, 4).map((course, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {course}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {edu.activities && (
                    <div className="mt-2">
                      <div className="text-xs text-muted-foreground mb-1">Activities:</div>
                      <div className="text-xs">
                        {edu.activities.join(' • ')}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Work Experience Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center">
              <Briefcase className="h-4 w-4 mr-2" />
              Professional Experience
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {mockBackground.workExperience.map((work, index) => (
                <div key={index} className="border-b pb-4 last:border-b-0 last:pb-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium">{work.title}</h4>
                      <p className="text-sm text-muted-foreground">{work.company}</p>
                      <p className="text-xs text-muted-foreground">{work.duration} • {work.type}</p>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-medium ${getRelevanceColor(work.relevanceScore)}`}>
                        {work.relevanceScore}%
                      </div>
                      <div className="text-xs text-muted-foreground">Relevance</div>
                    </div>
                  </div>

                  <p className="text-sm mt-2">{work.description}</p>

                  {work.achievements.length > 0 && (
                    <div className="mt-2">
                      <div className="text-xs text-muted-foreground mb-1">Key Achievements:</div>
                      <ul className="text-xs space-y-1">
                        {work.achievements.map((achievement, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-primary mr-1">•</span>
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="mt-3">
                    <div className="text-xs text-muted-foreground mb-1">Skills:</div>
                    <div className="flex flex-wrap gap-1">
                      {work.skills.map((skill, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Program Relevance:</span>
                      <span className="font-medium">
                        <Progress value={work.relevanceScore} className="w-20 h-1" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Volunteer Experience Section */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm flex items-center">
              <Heart className="h-4 w-4 mr-2" />
              Volunteer & Community Service
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {mockBackground.volunteerExperience.map((volunteer, index) => (
                <div key={index} className="space-y-3">
                  <div>
                    <h4 className="font-medium">{volunteer.role}</h4>
                    <p className="text-sm text-muted-foreground">{volunteer.organization}</p>
                    <p className="text-xs text-muted-foreground">
                      {volunteer.duration} • {volunteer.hoursPerWeek}h/week
                    </p>
                  </div>

                  <p className="text-sm">{volunteer.description}</p>

                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Impact:</div>
                    <p className="text-xs">{volunteer.impact}</p>
                  </div>

                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Skills Developed:</div>
                    <div className="flex flex-wrap gap-1">
                      {volunteer.skills.map((skill, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Summary Assessment */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm flex items-center">
              <Award className="h-4 w-4 mr-2" />
              Background Assessment Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-3 bg-muted/50 rounded">
                <div className="text-lg font-bold text-green-600">3.8</div>
                <div className="text-xs text-muted-foreground">Overall GPA</div>
              </div>
              <div className="p-3 bg-muted/50 rounded">
                <div className="text-lg font-bold text-blue-600">3</div>
                <div className="text-xs text-muted-foreground">Work Positions</div>
              </div>
              <div className="p-3 bg-muted/50 rounded">
                <div className="text-lg font-bold text-purple-600">450+</div>
                <div className="text-xs text-muted-foreground">Volunteer Hours</div>
              </div>
              <div className="p-3 bg-muted/50 rounded">
                <div className="text-lg font-bold text-orange-600">86%</div>
                <div className="text-xs text-muted-foreground">Avg Relevance</div>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
              <div className="text-sm font-medium text-green-800">Strengths</div>
              <ul className="text-xs text-green-700 mt-1 space-y-1">
                <li>• Strong academic performance with relevant coursework</li>
                <li>• Extensive research experience in target field</li>
                <li>• Significant community service commitment</li>
                <li>• Progressive professional development</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}