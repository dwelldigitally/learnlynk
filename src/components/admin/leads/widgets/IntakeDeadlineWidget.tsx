import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, GripVertical } from 'lucide-react';

export function IntakeDeadlineWidget() {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="cursor-move drag-handle flex-shrink-0">
        <CardTitle className="text-lg flex items-center gap-2">
          <GripVertical className="h-4 w-4 text-muted-foreground" />
          <Calendar className="h-5 w-5 text-primary" />
          Intake Deadline
        </CardTitle>
        <CardDescription>
          Important dates and deadlines
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto">
        <div className="space-y-4">
          <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Next Intake</p>
              <Badge variant="default" className="text-xs">Upcoming</Badge>
            </div>
            <p className="text-2xl font-bold text-primary">
              {(() => {
                const nextIntake = new Date();
                nextIntake.setMonth(nextIntake.getMonth() + 2);
                return nextIntake.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
              })()}
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Application Deadline</span>
              <span className="font-medium text-foreground">
                {(() => {
                  const deadline = new Date();
                  deadline.setMonth(deadline.getMonth() + 1);
                  deadline.setDate(15);
                  return deadline.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                })()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Document Deadline</span>
              <span className="font-medium text-foreground">
                {(() => {
                  const docDeadline = new Date();
                  docDeadline.setMonth(docDeadline.getMonth() + 1);
                  docDeadline.setDate(20);
                  return docDeadline.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                })()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Tuition Payment</span>
              <span className="font-medium text-foreground">
                {(() => {
                  const paymentDate = new Date();
                  paymentDate.setMonth(paymentDate.getMonth() + 1);
                  paymentDate.setDate(25);
                  return paymentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                })()}
              </span>
            </div>
          </div>

          <div className="pt-2">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-amber-500" />
              <span className="text-muted-foreground">
                {(() => {
                  const deadline = new Date();
                  deadline.setMonth(deadline.getMonth() + 1);
                  deadline.setDate(15);
                  const daysLeft = Math.ceil((deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                  return `${daysLeft} days left to apply`;
                })()}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
