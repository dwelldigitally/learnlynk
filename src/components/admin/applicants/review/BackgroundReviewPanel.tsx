import React from 'react';
import { ReviewSession } from '@/types/review';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, Briefcase, Award, Users } from 'lucide-react';

interface BackgroundReviewPanelProps {
  applicantId: string;
  session: ReviewSession;
}

export function BackgroundReviewPanel({ applicantId, session }: BackgroundReviewPanelProps) {
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-semibold">Background Review</h2>
      
      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center">
              <GraduationCap className="h-4 w-4 mr-2" />
              Academic Background
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">Bachelor of Science in Biology</h4>
                <p className="text-sm text-muted-foreground">University of California, Berkeley</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm">GPA: 3.8/4.0</span>
                  <Badge>Magna Cum Laude</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center">
              <Briefcase className="h-4 w-4 mr-2" />
              Professional Experience
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">Research Assistant</h4>
                <p className="text-sm text-muted-foreground">Stanford Medical Center</p>
                <p className="text-xs text-muted-foreground">2 years • Cardiovascular research</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}