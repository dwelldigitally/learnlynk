import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, MapPin, Phone, Mail, Calendar } from 'lucide-react';
import { ComprehensiveStudentProfile } from '@/types/applicationData';

interface StudentProfileSectionProps {
  profile: ComprehensiveStudentProfile;
}

export const StudentProfileSection: React.FC<StudentProfileSectionProps> = ({ profile }) => {
  const { personalInfo, academicBackground, languageProficiency } = profile;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                <p className="text-lg font-semibold">{personalInfo.firstName} {personalInfo.lastName}</p>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{personalInfo.email}</span>
              </div>
              {personalInfo.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{personalInfo.phone}</span>
                </div>
              )}
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Date of Birth</label>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{formatDate(personalInfo.dateOfBirth)}</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Nationality</label>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{personalInfo.nationality}</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Current Residence</label>
                <p>{personalInfo.residenceCountry}</p>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <label className="text-sm font-medium text-muted-foreground">Emergency Contact</label>
            <div className="mt-2 p-3 bg-muted/50 rounded-lg">
              <p className="font-medium">{personalInfo.emergencyContact.name}</p>
              <p className="text-sm text-muted-foreground">{personalInfo.emergencyContact.relationship}</p>
              <p className="text-sm">{personalInfo.emergencyContact.phone}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Academic Background */}
      <Card>
        <CardHeader>
          <CardTitle>Academic Background</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {academicBackground.map((education) => (
            <div key={education.id} className="p-4 border rounded-lg space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold">{education.degree} in {education.fieldOfStudy}</h4>
                  <p className="text-muted-foreground">{education.institution}</p>
                  <p className="text-sm text-muted-foreground">Graduated: {formatDate(education.graduationDate)}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold">
                    {education.gpa}/{education.maxGpa}
                  </div>
                  <p className="text-sm text-muted-foreground">GPA</p>
                </div>
              </div>
              
              {education.honors && education.honors.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Honors & Awards</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {education.honors.map((honor, index) => (
                      <Badge key={index} variant="secondary">{honor}</Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Relevant Coursework</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {education.relevantCoursework.map((course, index) => (
                    <Badge key={index} variant="outline">{course}</Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge variant={education.transcriptSubmitted ? "default" : "destructive"}>
                  Transcript: {education.transcriptSubmitted ? "Submitted" : "Pending"}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Language Proficiency */}
      <Card>
        <CardHeader>
          <CardTitle>Language Proficiency</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {languageProficiency.map((lang, index) => (
              <div key={index} className="p-3 border rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{lang.language}</span>
                  <Badge variant={lang.proficiency === 'native' ? 'default' : 'secondary'}>
                    {lang.proficiency.charAt(0).toUpperCase() + lang.proficiency.slice(1)}
                  </Badge>
                </div>
                {lang.testScore && (
                  <p className="text-sm text-muted-foreground mt-1">Test Score: {lang.testScore}</p>
                )}
                {lang.certified && (
                  <Badge variant="outline" className="mt-2">Certified</Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};