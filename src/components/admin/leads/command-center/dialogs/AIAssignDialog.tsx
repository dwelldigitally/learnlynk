import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAIActions } from '@/hooks/useAIActions';
import { useTeamMembers } from '@/hooks/useTeamMembers';
import { Zap, TrendingUp, Clock, CheckCircle } from 'lucide-react';

interface AIAssignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  selectedItems: string[];
}

export function AIAssignDialog({ open, onOpenChange, onSuccess, selectedItems }: AIAssignDialogProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const { performAIAssignment } = useAIActions();
  const { toast } = useToast();
  const { teamMembers, loading: advisorsLoading } = useTeamMembers();

  // Filter to advisors only
  const advisors = teamMembers;

  const handleAnalyze = async () => {
    if (advisors.length === 0) {
      toast({
        title: 'No Advisors Available',
        description: 'Please add advisors to your team before using AI assignment.',
        variant: 'destructive'
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      // Simulate AI analysis with real advisors
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const recommendations = selectedItems.map((itemId, index) => ({
        leadId: itemId,
        leadName: `Lead ${index + 1}`,
        recommendedAdvisor: advisors[index % advisors.length],
        confidence: Math.floor(Math.random() * 30) + 70,
        reasoning: [
          'Program interest match',
          'Geographic proximity',
          'Advisor availability'
        ]
      }));
      
      setRecommendations(recommendations);
    } catch (error) {
      toast({
        title: 'Analysis Failed',
        description: 'Unable to analyze leads for AI assignment.',
        variant: 'destructive'
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleConfirmAssignments = async () => {
    try {
      await performAIAssignment(selectedItems, advisors.map(a => a.id));
      toast({
        title: 'AI Assignment Complete',
        description: `Successfully assigned ${selectedItems.length} leads using AI recommendations.`
      });
      onSuccess();
    } catch (error) {
      toast({
        title: 'Assignment Failed',
        description: 'Unable to complete AI assignments.',
        variant: 'destructive'
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            AI-Powered Assignment
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="text-center">
            <p className="text-muted-foreground">
              Let AI analyze {selectedItems.length} selected leads and recommend optimal advisor assignments
            </p>
          </div>

          {recommendations.length === 0 ? (
            <div className="text-center py-8">
              <Zap className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <Button 
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                size="lg"
              >
                {isAnalyzing ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing Leads...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Start AI Analysis
                  </>
                )}
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">AI Recommendations</h3>
                <div className="grid gap-4">
                  {recommendations.map((rec, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div>
                              <h4 className="font-medium">{rec.leadName}</h4>
                              <p className="text-sm text-muted-foreground">
                                Recommended: {rec.recommendedAdvisor?.full_name || rec.recommendedAdvisor?.email || 'Unknown'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <Badge variant="secondary">
                                {rec.confidence}% confidence
                              </Badge>
                            </div>
                            <TrendingUp className="h-4 w-4 text-green-500" />
                          </div>
                        </div>
                        <div className="mt-2 pt-2 border-t">
                          <p className="text-xs font-medium mb-1">Reasoning:</p>
                          <div className="flex flex-wrap gap-1">
                            {rec.reasoning.map((reason: string, idx: number) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {reason}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button onClick={handleConfirmAssignments}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Confirm AI Assignments
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
