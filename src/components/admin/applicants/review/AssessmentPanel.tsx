import React from 'react';
import { ReviewSession } from '@/types/review';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface AssessmentPanelProps {
  applicantId: string;
  session: ReviewSession;
}

export function AssessmentPanel({ applicantId, session }: AssessmentPanelProps) {
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-semibold">Assessment Summary</h2>
      
      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Academic Readiness</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Academic Performance</span>
                  <span className="text-sm font-medium">92%</span>
                </div>
                <Progress value={92} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Program Fit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Career Alignment</span>
                  <span className="text-sm font-medium">88%</span>
                </div>
                <Progress value={88} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}