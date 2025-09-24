import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Clock, 
  MapPin, 
  Users, 
  TrendingUp, 
  BookOpen, 
  Award,
  Briefcase,
  GraduationCap,
  Star,
  CheckCircle
} from "lucide-react";
import { PROGRAM_DETAILS, StandardizedProgram } from "@/constants/programs";
import { getUpcomingIntakeDatesForProgram } from "@/constants/intakeDates";

interface ProgramDetailsViewProps {
  program: StandardizedProgram;
  onContinue: () => void;
  onBack: () => void;
}

const ProgramDetailsView: React.FC<ProgramDetailsViewProps> = ({
  program,
  onContinue,
  onBack
}) => {
  const details = PROGRAM_DETAILS[program];
  const upcomingIntakes = getUpcomingIntakeDatesForProgram(program);

  const programContent = {
    'Health Care Assistant': {
      description: 'Prepare for a rewarding career in healthcare by providing essential support to patients and healthcare professionals.',
      curriculum: [
        'Anatomy and Physiology',
        'Personal Care Techniques',
        'Communication Skills',
        'Medical Terminology',
        'Infection Control',
        'First Aid & CPR'
      ],
      careerOutcomes: [
        'Home Support Worker',
        'Hospital Care Aide',
        'Long-term Care Assistant',
        'Community Health Worker'
      ],
      employmentRate: 94,
      averageSalary: '$45,000 - $55,000'
    },
    'Aviation': {
      description: 'Launch your career in aviation with comprehensive training in aircraft operations, maintenance, and safety protocols.',
      curriculum: [
        'Aircraft Systems',
        'Navigation Principles',
        'Weather & Meteorology',
        'Aviation Regulations',
        'Flight Safety',
        'Aircraft Maintenance'
      ],
      careerOutcomes: [
        'Commercial Pilot',
        'Aircraft Maintenance Technician',
        'Air Traffic Controller',
        'Flight Instructor'
      ],
      employmentRate: 92,
      averageSalary: '$65,000 - $95,000'
    },
    'ECE': {
      description: 'Shape young minds and support early childhood development with comprehensive training in child psychology and education.',
      curriculum: [
        'Child Development',
        'Learning Through Play',
        'Behavior Management',
        'Family Engagement',
        'Inclusive Practices',
        'Health & Safety'
      ],
      careerOutcomes: [
        'Early Childhood Educator',
        'Daycare Supervisor',
        'Preschool Teacher',
        'Child Development Specialist'
      ],
      employmentRate: 90,
      averageSalary: '$40,000 - $50,000'
    },
    'Hospitality': {
      description: 'Enter the dynamic hospitality industry with skills in customer service, event management, and business operations.',
      curriculum: [
        'Customer Service Excellence',
        'Hotel Operations',
        'Event Planning',
        'Food & Beverage Service',
        'Marketing & Sales',
        'Business Management'
      ],
      careerOutcomes: [
        'Hotel Manager',
        'Event Coordinator',
        'Restaurant Supervisor',
        'Tourism Specialist'
      ],
      employmentRate: 87,
      averageSalary: '$38,000 - $65,000'
    },
    'Education Assistant': {
      description: 'Support classroom learning and help students achieve their educational goals as a valued education team member.',
      curriculum: [
        'Learning Support Strategies',
        'Classroom Management',
        'Special Needs Support',
        'Technology in Education',
        'Communication Skills',
        'Professional Ethics'
      ],
      careerOutcomes: [
        'Teaching Assistant',
        'Learning Support Worker',
        'Special Needs Aide',
        'Library Assistant'
      ],
      employmentRate: 88,
      averageSalary: '$35,000 - $45,000'
    },
    'MLA': {
      description: 'Join the healthcare team as a Medical Laboratory Assistant, performing crucial diagnostic tests and analyses.',
      curriculum: [
        'Laboratory Techniques',
        'Medical Terminology',
        'Quality Control',
        'Safety Protocols',
        'Equipment Operation',
        'Data Analysis'
      ],
      careerOutcomes: [
        'Medical Laboratory Assistant',
        'Pathology Technician',
        'Research Laboratory Tech',
        'Quality Control Analyst'
      ],
      employmentRate: 93,
      averageSalary: '$42,000 - $58,000'
    }
  };

  const content = programContent[program];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="cursor-pointer hover:text-primary" onClick={onBack}>Program Selection</span>
          <span>/</span>
          <span>Program Details</span>
        </div>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">{program}</h1>
            <p className="text-lg text-muted-foreground mt-2">{content.description}</p>
          </div>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            {details.type}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-6 text-center">
              <Clock className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="font-bold">{details.duration}</div>
              <div className="text-sm text-muted-foreground">Duration</div>
            </Card>
            <Card className="p-6 text-center">
              <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="font-bold">{content.employmentRate}%</div>
              <div className="text-sm text-muted-foreground">Employment Rate</div>
            </Card>
            <Card className="p-6 text-center">
              <Briefcase className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="font-bold text-sm">{content.averageSalary}</div>
              <div className="text-sm text-muted-foreground">Salary Range</div>
            </Card>
            <Card className="p-6 text-center">
              <Star className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="font-bold">${details.tuition.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Tuition</div>
            </Card>
          </div>

          {/* Curriculum */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Course Curriculum
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {content.curriculum.map((course, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="font-medium">{course}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Career Outcomes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                Career Opportunities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{content.employmentRate}%</div>
                    <div className="text-sm text-muted-foreground">Graduate Employment</div>
                  </div>
                  <Progress value={content.employmentRate} className="flex-1 h-3" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {content.careerOutcomes.map((career, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                      <Award className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="font-medium">{career}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Entry Requirements */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Entry Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {details.requirements.map((req, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{req}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Intakes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="w-5 h-5" />
                Upcoming Intakes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingIntakes.slice(0, 3).map((intake) => (
                  <div key={intake.id} className="p-3 border rounded-lg">
                    <div className="font-medium">{intake.label}</div>
                    <div className="text-sm text-muted-foreground">
                      {intake.capacity - intake.enrolled} of {intake.capacity} spots available
                    </div>
                    <Progress 
                      value={(intake.enrolled / intake.capacity) * 100} 
                      className="h-2 mt-2" 
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Campus Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Campus Locations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="p-3 bg-muted/30 rounded-lg">
                  <div className="font-medium">Main Campus</div>
                  <div className="text-sm text-muted-foreground">Downtown Location</div>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <div className="font-medium">Online Option</div>
                  <div className="text-sm text-muted-foreground">Hybrid Learning Available</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Continue Button */}
          <Button 
            onClick={onContinue} 
            className="w-full py-6 text-lg"
            size="lg"
          >
            Continue with {program}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProgramDetailsView;