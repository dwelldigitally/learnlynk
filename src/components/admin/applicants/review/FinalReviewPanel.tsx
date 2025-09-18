import React from 'react';
import { ReviewSession } from '@/types/review';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

interface FinalReviewPanelProps {
  applicantId: string;
  session: ReviewSession;
  onComplete: () => void;
}

export function FinalReviewPanel({ applicantId, session, onComplete }: FinalReviewPanelProps) {
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-semibold">Final Review</h2>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Review Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <div className="text-3xl font-bold text-green-600">89%</div>
            <p className="text-sm text-muted-foreground">Overall Score</p>
            
            <Button onClick={onComplete} className="w-full">
              <CheckCircle className="h-4 w-4 mr-2" />
              Complete Review
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}