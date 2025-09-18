import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Applicant } from "@/types/applicant";
import { 
  CheckCircle, 
  XCircle, 
  Mail, 
  Calendar,
  GraduationCap,
  MapPin,
  Phone,
  Star,
  TrendingUp,
  Users,
  Clock,
  Award,
  Target
} from "lucide-react";

interface EnhancedApplicantHeaderProps {
  applicant: Applicant;
  onApprove: () => void;
  onReject: () => void;
  onScheduleInterview: () => void;
  onSendEmail: () => void;
  saving?: boolean;
}

export const EnhancedApplicantHeader: React.FC<EnhancedApplicantHeaderProps> = ({
  applicant,
  onApprove,
  onReject,
  onScheduleInterview,
  onSendEmail,
  saving = false
}) => {
  // Mock data - in real app would come from props
  const programFitScore = 85;
  const applicationScore = 88;
  const yieldPropensity = 78;
  const programType = "Computer Science Master's";
  const intake = "Fall 2024";
  const applicationStage = "Under Review";
  
  const getInitials = (applicant: Applicant) => {
    if (applicant.master_records) {
      const firstName = applicant.master_records.first_name || '';
      const lastName = applicant.master_records.last_name || '';
      return (firstName[0] || '') + (lastName[0] || '');
    }
    return 'A';
  };

  const getFullName = (applicant: Applicant) => {
    if (applicant.master_records) {
      const firstName = applicant.master_records.first_name || '';
      const lastName = applicant.master_records.last_name || '';
      return `${firstName} ${lastName}`.trim() || 'Unknown Applicant';
    }
    return 'Unknown Applicant';
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-green-50 border-green-200";
    if (score >= 60) return "bg-yellow-50 border-yellow-200";
    return "bg-red-50 border-red-200";
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {/* Main Header Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            
            {/* Student Profile */}
            <div className="flex items-start gap-4 flex-1">
              <Avatar className="h-16 w-16 border-2 border-white shadow-lg">
                <AvatarImage src="" alt={getFullName(applicant)} />
                <AvatarFallback className="bg-primary text-primary-foreground text-lg font-semibold">
                  {getInitials(applicant)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-gray-900 truncate">
                    {getFullName(applicant)}
                  </h1>
                  <Badge variant="secondary" className="whitespace-nowrap">
                    ID: {applicant.id.slice(0, 8)}
                  </Badge>
                </div>
                
                {/* Basic Info */}
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <GraduationCap className="h-4 w-4" />
                    <span>{programType}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{intake}</span>
                  </div>
                  {applicant.master_records?.email && (
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      <span className="truncate max-w-48">{applicant.master_records.email}</span>
                    </div>
                  )}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    <Clock className="h-3 w-3 mr-1" />
                    {applicationStage}
                  </Badge>
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                    International Student
                  </Badge>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <Award className="h-3 w-3 mr-1" />
                    Merit Eligible
                  </Badge>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col gap-3 lg:min-w-48">
              <div className="flex gap-2">
                <Button 
                  onClick={onApprove}
                  disabled={saving}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  size="sm"
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Approve
                </Button>
                <Button 
                  variant="outline"
                  onClick={onReject}
                  disabled={saving}
                  className="flex-1 border-red-300 text-red-700 hover:bg-red-50"
                  size="sm"
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Reject
                </Button>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  onClick={onSendEmail}
                  disabled={saving}
                  className="flex-1"
                  size="sm"
                >
                  <Mail className="h-4 w-4 mr-1" />
                  Email
                </Button>
                <Button 
                  variant="outline"
                  onClick={onScheduleInterview}
                  disabled={saving}
                  className="flex-1"
                  size="sm"
                >
                  <Calendar className="h-4 w-4 mr-1" />
                  Interview
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Quick Stats & Scores */}
        <div className="p-6 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Program Fit Score */}
            <div className={`p-4 rounded-lg border ${getScoreBg(programFitScore)}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-gray-600" />
                  <span className="font-medium text-gray-700">Program Fit</span>
                </div>
                <span className={`text-2xl font-bold ${getScoreColor(programFitScore)}`}>
                  {programFitScore}%
                </span>
              </div>
              <Progress value={programFitScore} className="h-2 mb-2" />
              <p className="text-xs text-gray-600">
                Strong match for program requirements
              </p>
            </div>

            {/* Application Score */}
            <div className={`p-4 rounded-lg border ${getScoreBg(applicationScore)}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-gray-600" />
                  <span className="font-medium text-gray-700">Application Score</span>
                </div>
                <span className={`text-2xl font-bold ${getScoreColor(applicationScore)}`}>
                  {applicationScore}%
                </span>
              </div>
              <Progress value={applicationScore} className="h-2 mb-2" />
              <p className="text-xs text-gray-600">
                Excellent application quality
              </p>
            </div>

            {/* Yield Propensity */}
            <div className={`p-4 rounded-lg border ${getScoreBg(yieldPropensity)}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-gray-600" />
                  <span className="font-medium text-gray-700">Yield Likelihood</span>
                </div>
                <span className={`text-2xl font-bold ${getScoreColor(yieldPropensity)}`}>
                  {yieldPropensity}%
                </span>
              </div>
              <Progress value={yieldPropensity} className="h-2 mb-2" />
              <p className="text-xs text-gray-600">
                High probability to enroll
              </p>
            </div>
          </div>

          {/* Quick Overview Stats */}
          <div className="mt-6 pt-4 border-t">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">3.8</div>
                <div className="text-sm text-gray-600">GPA</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">315</div>
                <div className="text-sm text-gray-600">GRE Score</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">2</div>
                <div className="text-sm text-gray-600">Work Experience</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">3</div>
                <div className="text-sm text-gray-600">Recommendations</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};