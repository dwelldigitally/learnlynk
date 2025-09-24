import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Calendar, 
  Users, 
  Clock, 
  AlertCircle, 
  CheckCircle,
  MapPin,
  BookOpen,
  Star,
  Zap
} from "lucide-react";
import { StandardizedProgram } from "@/constants/programs";
import { getUpcomingIntakeDatesForProgram, ProgramIntakeDate } from "@/constants/intakeDates";

interface IntakeSelectionViewProps {
  program: StandardizedProgram;
  onSelect: (intake: ProgramIntakeDate) => void;
  onBack: () => void;
  onContinue?: () => void;
  selectedIntake?: ProgramIntakeDate;
}

const IntakeSelectionView: React.FC<IntakeSelectionViewProps> = ({
  program,
  onSelect,
  onBack,
  onContinue,
  selectedIntake
}) => {
  const [hoveredIntake, setHoveredIntake] = useState<string | null>(null);
  
  const upcomingIntakes = getUpcomingIntakeDatesForProgram(program);
  
  const getIntakeStatus = (intake: ProgramIntakeDate) => {
    const availableSpots = intake.capacity - intake.enrolled;
    const fillPercentage = (intake.enrolled / intake.capacity) * 100;
    
    if (availableSpots === 0) return 'full';
    if (fillPercentage >= 80) return 'filling-fast';
    if (fillPercentage >= 60) return 'popular';
    return 'available';
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'full': return 'bg-red-100 text-red-800 border-red-200';
      case 'filling-fast': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'popular': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'full': return 'Full';
      case 'filling-fast': return 'Filling Fast';
      case 'popular': return 'Popular Choice';
      default: return 'Available';
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'full': return <AlertCircle className="w-4 h-4" />;
      case 'filling-fast': return <Zap className="w-4 h-4" />;
      case 'popular': return <Star className="w-4 h-4" />;
      default: return <CheckCircle className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      month: date.toLocaleDateString('en-US', { month: 'long' }),
      year: date.getFullYear(),
      day: date.getDate(),
      weekday: date.toLocaleDateString('en-US', { weekday: 'long' })
    };
  };

  const getApplicationDeadline = (intakeDate: string) => {
    const intake = new Date(intakeDate);
    const deadline = new Date(intake);
    deadline.setDate(deadline.getDate() - 30); // 30 days before intake
    return deadline.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getDaysUntilDeadline = (intakeDate: string) => {
    const intake = new Date(intakeDate);
    const deadline = new Date(intake);
    deadline.setDate(deadline.getDate() - 30);
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="cursor-pointer hover:text-primary" onClick={onBack}>Requirements</span>
          <span>/</span>
          <span>Intake Selection</span>
        </div>
        <div>
          <h1 className="text-3xl font-bold">Choose Your Start Date</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Select when you'd like to begin your {program} program
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Intake Calendar */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Available Start Dates</h2>
              <Badge variant="outline">
                {upcomingIntakes.length} intakes available
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingIntakes.map((intake) => {
                const status = getIntakeStatus(intake);
                const dateInfo = formatDate(intake.date);
                const isSelected = selectedIntake?.id === intake.id;
                const isHovered = hoveredIntake === intake.id;
                const availableSpots = intake.capacity - intake.enrolled;
                const fillPercentage = (intake.enrolled / intake.capacity) * 100;
                const deadline = getApplicationDeadline(intake.date);
                const daysUntilDeadline = getDaysUntilDeadline(intake.date);

                return (
                  <Card
                    key={intake.id}
                    className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${
                      isSelected 
                        ? 'ring-2 ring-primary border-primary bg-primary/5' 
                        : status === 'full' 
                          ? 'opacity-60 cursor-not-allowed'
                          : 'hover:border-primary/50'
                    }`}
                    onMouseEnter={() => setHoveredIntake(intake.id)}
                    onMouseLeave={() => setHoveredIntake(null)}
                    onClick={() => status !== 'full' && onSelect(intake)}
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="text-center">
                              <div className="text-3xl font-bold text-primary">{dateInfo.day}</div>
                              <div className="text-sm font-medium">{dateInfo.month}</div>
                              <div className="text-xs text-muted-foreground">{dateInfo.year}</div>
                            </div>
                            <div>
                              <CardTitle className="text-xl">{intake.label}</CardTitle>
                              <p className="text-sm text-muted-foreground">{dateInfo.weekday}</p>
                            </div>
                          </div>
                          
                          <Badge className={`${getStatusColor(status)} border`}>
                            {getStatusIcon(status)}
                            <span className="ml-2">{getStatusText(status)}</span>
                          </Badge>
                        </div>
                        
                        {isSelected && (
                          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                          </div>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Capacity Information */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">Enrollment</span>
                          <span className="font-medium">
                            {intake.enrolled}/{intake.capacity} students
                          </span>
                        </div>
                        <Progress value={fillPercentage} className="h-2" />
                        <div className="text-xs text-muted-foreground">
                          {availableSpots > 0 ? `${availableSpots} spots remaining` : 'No spots available'}
                        </div>
                      </div>

                      {/* Application Deadline */}
                      <div className="p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <Clock className="w-4 h-4 text-primary" />
                          <span className="font-medium text-sm">Application Deadline</span>
                        </div>
                        <div className="text-sm">{deadline}</div>
                        <div className="text-xs text-muted-foreground">
                          {daysUntilDeadline > 0 
                            ? `${daysUntilDeadline} days remaining` 
                            : 'Deadline passed'
                          }
                        </div>
                      </div>

                      {/* Quick Details */}
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-primary" />
                          <span>Main Campus</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-primary" />
                          <span>Full-time</span>
                        </div>
                      </div>

                      {/* Action Button */}
                      <Button
                        className={`w-full transition-all duration-300 ${
                          status === 'full' 
                            ? 'opacity-50 cursor-not-allowed'
                            : isSelected || isHovered
                              ? 'bg-primary hover:bg-primary/90'
                              : 'bg-secondary hover:bg-secondary/80'
                        }`}
                        disabled={status === 'full'}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (status !== 'full') onSelect(intake);
                        }}
                      >
                        {status === 'full' 
                          ? 'Full - Join Waitlist' 
                          : isSelected 
                            ? 'Selected' 
                            : 'Select This Date'
                        }
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Important Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Important Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">Application Deadlines</h4>
                  <p className="text-sm text-blue-700">
                    Applications close 30 days before each intake start date. We recommend applying early as spots fill quickly.
                  </p>
                </div>
                
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-2">Early Bird Benefits</h4>
                  <p className="text-sm text-green-700">
                    Students who apply more than 60 days in advance receive priority consideration and may be eligible for early bird discounts.
                  </p>
                </div>
                
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-medium text-yellow-800 mb-2">Waitlist Option</h4>
                  <p className="text-sm text-yellow-700">
                    If your preferred intake is full, you can join the waitlist. Students are contacted in order if spots become available.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Selected Intake Summary */}
          {selectedIntake && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Your Selection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-primary/10 rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {formatDate(selectedIntake.date).day}
                    </div>
                    <div className="font-medium">
                      {formatDate(selectedIntake.date).month} {formatDate(selectedIntake.date).year}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {selectedIntake.label}
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Program:</span>
                      <span className="font-medium">{program}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Start Date:</span>
                      <span className="font-medium">{formatDate(selectedIntake.date).weekday}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Deadline:</span>
                      <span className="font-medium">{getApplicationDeadline(selectedIntake.date)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Available Spots:</span>
                      <span className="font-medium text-green-600">
                        {selectedIntake.capacity - selectedIntake.enrolled}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Next Steps */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Next Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">1</div>
                  <span>Complete application form</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs font-bold">2</div>
                  <span>Upload required documents</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs font-bold">3</div>
                  <span>Pay application fee</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs font-bold">4</div>
                  <span>Wait for admission decision</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Questions?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <p className="text-muted-foreground">
                  Need help choosing the right intake date? Our admissions team is here to help.
                </p>
                <Button variant="outline" className="w-full" size="sm">
                  Contact Admissions
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Continue Button */}
<Button 
  onClick={() => {
    if (!selectedIntake) return;
    onContinue ? onContinue() : console.log('Continue with application');
  }} 
  className="w-full py-6 text-lg"
  size="lg"
  disabled={!selectedIntake}
>
  {selectedIntake ? 'Start Application' : 'Select an Intake Date'}
</Button>
        </div>
      </div>
    </div>
  );
};

export default IntakeSelectionView;