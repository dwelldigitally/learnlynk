import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Briefcase, 
  Calendar,
  MapPin,
  TrendingUp,
  Users,
  Award
} from 'lucide-react';
import { ProfessionalExperience, ExtracurricularActivity } from '@/types/applicationData';

interface ProfessionalExperiencePanelProps {
  professionalExperience: ProfessionalExperience[];
  extracurriculars: ExtracurricularActivity[];
}

export const ProfessionalExperiencePanel: React.FC<ProfessionalExperiencePanelProps> = ({ 
  professionalExperience, 
  extracurriculars 
}) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short'
    }).format(date);
  };

  const getRelevanceColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-blue-600';
    if (score >= 4) return 'text-yellow-600';
    return 'text-red-600';
  };

  const calculateDuration = (startDate: Date, endDate?: Date) => {
    const end = endDate || new Date();
    const months = Math.round((end.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30));
    
    if (months < 12) {
      return `${months} month${months !== 1 ? 's' : ''}`;
    } else {
      const years = Math.floor(months / 12);
      const remainingMonths = months % 12;
      
      if (remainingMonths === 0) {
        return `${years} year${years !== 1 ? 's' : ''}`;
      } else {
        return `${years}y ${remainingMonths}m`;
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Professional Experience */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Professional Experience ({professionalExperience.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {professionalExperience.length === 0 ? (
            <div className="text-center py-8">
              <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No professional experience listed</p>
            </div>
          ) : (
            professionalExperience.map((experience) => (
              <div key={experience.id} className="border rounded-lg p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold">{experience.position}</h4>
                    <p className="text-muted-foreground font-medium">{experience.company}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(experience.startDate)} - {experience.endDate ? formatDate(experience.endDate) : 'Present'}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {calculateDuration(experience.startDate, experience.endDate)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Program Relevance</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={experience.relevanceToProgram * 10} className="w-20 h-2" />
                      <span className={`font-semibold ${getRelevanceColor(experience.relevanceToProgram)}`}>
                        {experience.relevanceToProgram}/10
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm leading-relaxed">{experience.description}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Skills & Technologies</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {experience.skills.map((skill, index) => (
                      <Badge key={index} variant="outline">{skill}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Extracurricular Activities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Extracurricular Activities & Leadership ({extracurriculars.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {extracurriculars.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No extracurricular activities listed</p>
            </div>
          ) : (
            extracurriculars.map((activity) => (
              <div key={activity.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">{activity.name}</h4>
                    <p className="text-muted-foreground">{activity.role}</p>
                    <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {formatDate(activity.startDate)} - {activity.endDate ? formatDate(activity.endDate) : 'Present'}
                    </div>
                  </div>
                  <Award className="h-5 w-5 text-muted-foreground" />
                </div>
                
                <div>
                  <p className="text-sm">{activity.description}</p>
                </div>
                
                {activity.impact && (
                  <div className="bg-muted/50 p-3 rounded">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Impact</label>
                    <p className="text-sm mt-1">{activity.impact}</p>
                  </div>
                )}
                
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Skills Developed</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {activity.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">{skill}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};