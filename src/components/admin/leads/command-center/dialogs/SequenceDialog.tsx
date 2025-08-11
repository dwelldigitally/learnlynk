
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, Mail, MessageSquare, Phone, Calendar, CheckCircle } from 'lucide-react';

interface SequenceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  selectedItems: string[];
}

interface Sequence {
  id: string;
  name: string;
  description: string;
  stepCount: number;
  duration: string;
  type: 'email' | 'sms' | 'mixed' | 'call';
  enrolledCount: number;
  conversionRate: number;
  isActive: boolean;
}

export function SequenceDialog({ open, onOpenChange, onSuccess, selectedItems }: SequenceDialogProps) {
  const [selectedSequence, setSelectedSequence] = useState<string>('');
  const [isEnrolling, setIsEnrolling] = useState(false);
  const { toast } = useToast();

  // Mock sequences data
  const sequences: Sequence[] = [
    {
      id: 'seq-1',
      name: 'Welcome & Onboarding',
      description: 'New lead welcome sequence with program information',
      stepCount: 5,
      duration: '7 days',
      type: 'email',
      enrolledCount: 234,
      conversionRate: 24.5,
      isActive: true
    },
    {
      id: 'seq-2', 
      name: 'Re-engagement Campaign',
      description: 'Follow-up sequence for unresponsive leads',
      stepCount: 3,
      duration: '5 days',
      type: 'mixed',
      enrolledCount: 156,
      conversionRate: 18.2,
      isActive: true
    },
    {
      id: 'seq-3',
      name: 'Application Reminder',
      description: 'Reminder sequence for incomplete applications',
      stepCount: 4,
      duration: '10 days',
      type: 'email',
      enrolledCount: 89,
      conversionRate: 32.1,
      isActive: true
    },
    {
      id: 'seq-4',
      name: 'High-Value Prospect',
      description: 'Premium sequence for high-scoring leads',
      stepCount: 6,
      duration: '14 days',
      type: 'mixed',
      enrolledCount: 45,
      conversionRate: 41.3,
      isActive: true
    }
  ];

  const getSequenceIcon = (type: string) => {
    switch (type) {
      case 'email': return Mail;
      case 'sms': return MessageSquare;
      case 'call': return Phone;
      case 'mixed': return Calendar;
      default: return Mail;
    }
  };

  const handleEnroll = async () => {
    if (!selectedSequence) {
      toast({
        title: 'Selection Required',
        description: 'Please select a sequence to enroll leads.',
        variant: 'destructive'
      });
      return;
    }

    setIsEnrolling(true);
    try {
      // Simulate enrollment
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const sequence = sequences.find(s => s.id === selectedSequence);
      toast({
        title: 'Enrollment Complete',
        description: `Successfully enrolled ${selectedItems.length} leads in "${sequence?.name}".`
      });
      
      onSuccess();
    } catch (error) {
      toast({
        title: 'Enrollment Failed',
        description: 'Unable to enroll leads in sequence.',
        variant: 'destructive'
      });
    } finally {
      setIsEnrolling(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Enroll in Sequence
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="text-center">
            <p className="text-muted-foreground">
              Select a sequence to enroll {selectedItems.length} selected leads
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Available Sequences</h3>
            <div className="grid gap-4">
              {sequences.map((sequence) => {
                const Icon = getSequenceIcon(sequence.type);
                return (
                  <Card 
                    key={sequence.id}
                    className={`cursor-pointer transition-all ${
                      selectedSequence === sequence.id 
                        ? 'ring-2 ring-primary bg-primary/5' 
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setSelectedSequence(sequence.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Icon className="h-8 w-8 text-primary" />
                          <div>
                            <h4 className="font-medium">{sequence.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {sequence.description}
                            </p>
                            <div className="flex items-center gap-4 mt-2">
                              <span className="text-xs text-muted-foreground">
                                {sequence.stepCount} steps
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {sequence.duration}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {sequence.type}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-green-600">
                            {sequence.conversionRate}% conversion
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {sequence.enrolledCount} enrolled
                          </div>
                          {selectedSequence === sequence.id && (
                            <CheckCircle className="h-4 w-4 text-primary mt-2 ml-auto" />
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleEnroll}
              disabled={!selectedSequence || isEnrolling}
            >
              {isEnrolling ? (
                <>
                  <AlertTriangle className="h-4 w-4 mr-2 animate-pulse" />
                  Enrolling...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Enroll {selectedItems.length} Leads
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
