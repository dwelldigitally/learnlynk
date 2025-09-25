import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  DollarSign,
  GraduationCap,
  FileText,
  CheckCircle,
  Calendar,
  MapPin,
  Users,
  TrendingUp,
  Download,
  CreditCard,
  Banknote,
  Calculator,
  AlertCircle,
  BookOpen,
  Award,
  Briefcase,
  Globe,
  Heart,
  User,
  Zap,
  FileUp
} from "lucide-react";
import { StandardizedProgram, PROGRAM_DETAILS } from "@/constants/programs";
import { getUpcomingIntakeDatesForProgram, ProgramIntakeDate } from "@/constants/intakeDates";
import { programRequirements } from "@/data/programRequirements";

interface ProgramDetailsReviewProps {
  program: StandardizedProgram;
  onBack: () => void;
  onContinue: () => void;
  onIntakeSelect: (intake: ProgramIntakeDate) => void;
  selectedIntake?: ProgramIntakeDate;
}

const ProgramDetailsReview: React.FC<ProgramDetailsReviewProps> = ({
  program,
  onBack,
  onContinue,
  onIntakeSelect,
  selectedIntake
}) => {
  const details = PROGRAM_DETAILS[program];
  const upcomingIntakes = getUpcomingIntakeDatesForProgram(program);
  const requirements = programRequirements[program] || [];
  
  const [selectedPaymentPlan, setSelectedPaymentPlan] = useState<string>('full');
  const [checkedRequirements, setCheckedRequirements] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState('overview');

  const paymentPlans = [
    {
      id: 'full',
      title: 'Full Payment',
      description: 'Pay the entire tuition upfront',
      discount: 1000,
      schedule: [`Full payment: $${(details.tuition - 1000).toLocaleString()}`]
    },
    {
      id: 'semester',
      title: 'Semester Plan',
      description: 'Split payments by semester',
      discount: 500,
      schedule: [
        `1st Payment: $${Math.ceil((details.tuition - 500) / 2).toLocaleString()}`,
        `2nd Payment: $${Math.floor((details.tuition - 500) / 2).toLocaleString()}`
      ]
    },
    {
      id: 'monthly',
      title: 'Monthly Plan',
      description: 'Spread over program duration',
      discount: 0,
      schedule: [`Monthly: $${Math.ceil(details.tuition / parseInt(details.duration)).toLocaleString()}`]
    }
  ];

  const handleRequirementCheck = (requirementId: string, checked: boolean) => {
    const newChecked = new Set(checkedRequirements);
    if (checked) {
      newChecked.add(requirementId);
    } else {
      newChecked.delete(requirementId);
    }
    setCheckedRequirements(newChecked);
  };

  const canContinue = selectedIntake !== undefined;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          {program} Program
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Review all program details, requirements, and costs before starting your application
        </p>
      </div>

      {/* Progress Summary */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-2">
              <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mx-auto">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold">Program Type</h3>
              <p className="text-muted-foreground">{details.type}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mx-auto">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold">Duration</h3>
              <p className="text-muted-foreground">{details.duration}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mx-auto">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold">Tuition</h3>
              <p className="text-muted-foreground">${details.tuition.toLocaleString()}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mx-auto">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold">Requirements</h3>
              <p className="text-muted-foreground">{requirements.length} items</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Program Overview</TabsTrigger>
          <TabsTrigger value="financial">Financial Details</TabsTrigger>
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
          <TabsTrigger value="intakes">Available Intakes</TabsTrigger>
        </TabsList>

        {/* Program Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Program Description
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  {program === 'Health Care Assistant' && 
                    "Prepare for a rewarding career in healthcare by learning essential skills in patient care, medical terminology, and healthcare procedures. This comprehensive program combines theoretical knowledge with hands-on practical experience."
                  }
                  {program === 'Education Assistant' && 
                    "Support student learning and classroom management as an Education Assistant. Gain skills in child development, learning support strategies, and classroom assistance techniques."
                  }
                  {program === 'Aviation' && 
                    "Launch your career in the aviation industry with comprehensive training in aircraft systems, maintenance procedures, and safety protocols. This program prepares you for various roles in aviation."
                  }
                  {program === 'Hospitality' && 
                    "Excel in the dynamic hospitality industry with training in customer service, hotel operations, event management, and food service. Perfect for those passionate about creating exceptional guest experiences."
                  }
                  {program === 'ECE' && 
                    "Shape young minds as an Early Childhood Educator. Learn child development, curriculum planning, and classroom management skills to support children's growth and learning."
                  }
                  {program === 'MLA' && 
                    "Become a skilled Medical Laboratory Assistant with training in laboratory procedures, specimen handling, and medical testing techniques. Essential for supporting healthcare diagnostics."
                  }
                </p>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Career Opportunities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {program === 'Health Care Assistant' && [
                      'Healthcare Facilities',
                      'Long-term Care Centers',
                      'Home Healthcare',
                      'Rehabilitation Centers'
                    ].map((career, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>{career}</span>
                      </li>
                    ))}
                    {program === 'Education Assistant' && [
                      'Elementary Schools',
                      'Special Education Support',
                      'Learning Resource Centers',
                      'Community Programs'
                    ].map((career, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>{career}</span>
                      </li>
                    ))}
                    {program === 'Aviation' && [
                      'Aircraft Maintenance',
                      'Airport Operations',
                      'Airline Services',
                      'Aviation Support'
                    ].map((career, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>{career}</span>
                      </li>
                    ))}
                    {program === 'Hospitality' && [
                      'Hotel Management',
                      'Event Planning',
                      'Restaurant Service',
                      'Tourism Services'
                    ].map((career, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>{career}</span>
                      </li>
                    ))}
                    {program === 'ECE' && [
                      'Daycare Centers',
                      'Preschools',
                      'Family Resource Programs',
                      'Child Development Centers'
                    ].map((career, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>{career}</span>
                      </li>
                    ))}
                    {program === 'MLA' && [
                      'Hospital Laboratories',
                      'Diagnostic Centers',
                      'Research Facilities',
                      'Public Health Labs'
                    ].map((career, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>{career}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Program Highlights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-blue-600" />
                      <span>Industry-recognized certification</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-600" />
                      <span>Hands-on practical training</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-blue-600" />
                      <span>Job placement assistance</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-blue-600" />
                      <span>Small class sizes</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Financial Details Tab */}
        <TabsContent value="financial" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Cost Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span>Tuition</span>
                    <span className="font-semibold">${details.tuition.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span>Books & Materials</span>
                    <span className="font-semibold">$800</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span>Application Fee</span>
                    <span className="font-semibold">$150</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total Program Cost</span>
                      <span>${(details.tuition + 950).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Return on Investment
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Average Starting Salary</span>
                      <span>$45,000/year</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Career Growth Potential</span>
                      <span>15-25% over 5 years</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Investment Payback</span>
                      <span>~18 months</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Options
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={selectedPaymentPlan} onValueChange={setSelectedPaymentPlan}>
                <div className="space-y-4">
                  {paymentPlans.map((plan) => (
                    <div key={plan.id} className="relative">
                      <div className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        selectedPaymentPlan === plan.id 
                          ? 'border-primary bg-primary/5' 
                          : 'border-muted hover:border-primary/50'
                      }`}>
                        <div className="flex items-start space-x-3">
                          <RadioGroupItem value={plan.id} id={plan.id} className="mt-1" />
                          <div className="flex-1 space-y-2">
                            <Label htmlFor={plan.id} className="text-base font-medium cursor-pointer">
                              {plan.title}
                              {plan.discount > 0 && (
                                <Badge variant="secondary" className="ml-2">
                                  Save ${plan.discount}
                                </Badge>
                              )}
                            </Label>
                            <p className="text-sm text-muted-foreground">{plan.description}</p>
                            <div className="space-y-1">
                              {plan.schedule.map((payment, index) => (
                                <div key={index} className="text-sm font-medium">
                                  {payment}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Requirements Tab */}
        <TabsContent value="requirements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Entry Requirements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4">
                  {details.requirements.map((req, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span>{req}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileUp className="w-5 h-5" />
                Required Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {requirements.map((requirement) => (
                  <div key={requirement.id} className="border rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id={requirement.id}
                        checked={checkedRequirements.has(requirement.id)}
                        onCheckedChange={(checked) => 
                          handleRequirementCheck(requirement.id, checked as boolean)
                        }
                      />
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <Label htmlFor={requirement.id} className="font-medium cursor-pointer">
                            {requirement.name}
                          </Label>
                          {requirement.mandatory && (
                            <Badge variant="destructive" className="text-xs">Required</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {requirement.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Max size: {requirement.maxSize}MB</span>
                          <span>Formats: {requirement.acceptedFormats.join(', ')}</span>
                          <span>Stage: {requirement.stage}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Intakes Tab */}
        <TabsContent value="intakes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Available Start Dates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {upcomingIntakes.map((intake) => (
                  <div
                    key={intake.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedIntake?.id === intake.id
                        ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                        : 'border-muted hover:border-primary/50'
                    }`}
                    onClick={() => onIntakeSelect(intake)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-primary" />
                            <span className="font-semibold">{intake.label}</span>
                          </div>
                          <Badge 
                            variant={(intake.capacity - intake.enrolled) > 10 ? 'default' : 
                                   (intake.capacity - intake.enrolled) > 0 ? 'destructive' : 'secondary'}
                          >
                            {(intake.capacity - intake.enrolled) > 10 && 'Open'}
                            {(intake.capacity - intake.enrolled) > 0 && (intake.capacity - intake.enrolled) <= 10 && 'Filling Fast'}
                            {(intake.capacity - intake.enrolled) <= 0 && 'Waitlist'}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>Start Date: {new Date(intake.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            <span>{intake.capacity - intake.enrolled} spots available</span>
                          </div>
                        </div>
                      </div>
                      
                      {selectedIntake?.id === intake.id && (
                        <CheckCircle className="w-6 h-6 text-primary" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Navigation */}
      <div className="flex justify-between items-center p-6 bg-muted/20 rounded-lg">
        <Button variant="outline" onClick={onBack} size="lg">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Program Selection
        </Button>
        
        <div className="text-center">
          {!selectedIntake && (
            <p className="text-sm text-muted-foreground mb-2">
              Please select an intake date to continue
            </p>
          )}
          <Button 
            onClick={onContinue} 
            disabled={!canContinue} 
            size="lg"
            className="px-8"
          >
            Start Application
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProgramDetailsReview;