import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Mail, Clock, Users, Target, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Sequence {
  id: string;
  name: string;
  description: string;
  stepCount: number;
  enrolledLeads: number;
  averageConversion: number;
  estimatedDuration: string;
  status: 'active' | 'paused' | 'draft';
}

interface SequenceEnrollmentDialogProps {
  leadId: string;
  leadName: string;
  trigger: React.ReactNode;
}

export function SequenceEnrollmentDialog({ leadId, leadName, trigger }: SequenceEnrollmentDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSequence, setSelectedSequence] = useState<string>('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [isEnrolling, setIsEnrolling] = useState(false);
  const { toast } = useToast();

  // Mock sequences data - in real app, fetch from API
  const sequences: Sequence[] = [
    {
      id: 'seq-1',
      name: 'New Lead Nurture',
      description: 'Automated sequence for new leads with educational content',
      stepCount: 5,
      enrolledLeads: 127,
      averageConversion: 18.5,
      estimatedDuration: '2 weeks',
      status: 'active'
    },
    {
      id: 'seq-2', 
      name: 'Premium Program Follow-up',
      description: 'High-touch sequence for premium program inquiries',
      stepCount: 8,
      enrolledLeads: 43,
      averageConversion: 32.1,
      estimatedDuration: '3 weeks',
      status: 'active'
    },
    {
      id: 'seq-3',
      name: 'Re-engagement Campaign',
      description: 'Win-back sequence for inactive leads',
      stepCount: 4,
      enrolledLeads: 89,
      averageConversion: 12.3,
      estimatedDuration: '10 days',
      status: 'active'
    },
    {
      id: 'seq-4',
      name: 'Application Completion',
      description: 'Sequence to encourage application completion',
      stepCount: 6,
      enrolledLeads: 67,
      averageConversion: 45.2,
      estimatedDuration: '1 week',
      status: 'active'
    }
  ];

  const selectedSequenceData = sequences.find(seq => seq.id === selectedSequence);

  const handleEnroll = async () => {
    if (!selectedSequence) {
      toast({
        title: "Sequence Required",
        description: "Please select a sequence to enroll the lead.",
        variant: "destructive"
      });
      return;
    }

    setIsEnrolling(true);
    try {
      // Simulate API call to enroll lead in sequence
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Enrollment Successful",
        description: `${leadName} has been enrolled in "${selectedSequenceData?.name}".`
      });
      
      setIsOpen(false);
      // Reset form
      setSelectedSequence('');
      setNotes('');
      setStartDate(new Date().toISOString().split('T')[0]);
    } catch (error) {
      toast({
        title: "Enrollment Failed",
        description: "Unable to enroll lead in sequence. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsEnrolling(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Enroll in Sequence
          </DialogTitle>
          <DialogDescription>
            Enroll {leadName} into an automated communication sequence.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          {/* Sequence Selection */}
          <div className="grid gap-2">
            <Label htmlFor="sequence">Select Sequence</Label>
            <Select value={selectedSequence} onValueChange={setSelectedSequence}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a sequence..." />
              </SelectTrigger>
              <SelectContent>
                {sequences.map((sequence) => (
                  <SelectItem key={sequence.id} value={sequence.id}>
                    <div className="flex items-center justify-between w-full">
                      <div>
                        <div className="font-medium">{sequence.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {sequence.stepCount} steps • {sequence.estimatedDuration}
                        </div>
                      </div>
                      <Badge variant={sequence.status === 'active' ? 'default' : 'secondary'}>
                        {sequence.status}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sequence Details */}
          {selectedSequenceData && (
            <div className="p-4 bg-muted/30 rounded-lg space-y-3">
              <h4 className="font-medium">{selectedSequenceData.name}</h4>
              <p className="text-sm text-muted-foreground">
                {selectedSequenceData.description}
              </p>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedSequenceData.stepCount} steps</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedSequenceData.enrolledLeads} enrolled</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedSequenceData.averageConversion}% conversion</span>
                </div>
              </div>
            </div>
          )}

          {/* Start Date */}
          <div className="grid gap-2">
            <Label htmlFor="start-date">Start Date</Label>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          {/* Notes */}
          <div className="grid gap-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any specific notes for this enrollment..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleEnroll} 
            disabled={!selectedSequence || isEnrolling}
          >
            {isEnrolling ? "Enrolling..." : "Enroll Lead"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}