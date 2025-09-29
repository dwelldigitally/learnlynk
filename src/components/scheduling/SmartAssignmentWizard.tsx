import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Wand2, 
  CheckCircle, 
  AlertTriangle, 
  Users, 
  Building, 
  ArrowRight,
  Star,
  MapPin
} from 'lucide-react';
import { 
  useStudentBatches, 
  useSmartAssignments, 
  useSchedulingMutations,
  useBatchStudents 
} from '@/hooks/useScheduling';
import { SmartAssignmentSuggestion, SiteSuggestion } from '@/types/scheduling';

export function SmartAssignmentWizard() {
  const { user } = useAuth();
  const [selectedBatchId, setSelectedBatchId] = useState<string>('');
  const [assignments, setAssignments] = useState<Array<{ assignment_id: string; site_id: string }>>([]);
  const [step, setStep] = useState<'select' | 'review' | 'confirm' | 'complete'>('select');
  
  const { data: batches = [] } = useStudentBatches(user?.id || '');
  const { data: batchStudents = [] } = useBatchStudents(selectedBatchId);
  const { data: suggestions = [], refetch: refetchSuggestions } = useSmartAssignments(selectedBatchId);
  const { executeBatchAssignment } = useSchedulingMutations();

  useEffect(() => {
    if (selectedBatchId) {
      refetchSuggestions();
    }
  }, [selectedBatchId, refetchSuggestions]);

  const handleGenerateSuggestions = () => {
    if (!selectedBatchId) return;
    setStep('review');
    
    // Initialize assignments with top suggestions
    const initialAssignments = suggestions.map(suggestion => ({
      assignment_id: suggestion.assignment_id,
      site_id: suggestion.suggested_sites[0]?.site_id || ''
    })).filter(a => a.site_id);
    
    setAssignments(initialAssignments);
  };

  const handleSiteChange = (assignmentId: string, siteId: string) => {
    setAssignments(prev => prev.map(a => 
      a.assignment_id === assignmentId 
        ? { ...a, site_id: siteId }
        : a
    ));
  };

  const handleConfirmAssignments = async () => {
    if (!selectedBatchId || assignments.length === 0) return;
    
    setStep('confirm');
    
    try {
      const result = await executeBatchAssignment.mutateAsync({
        batch_id: selectedBatchId,
        assignments
      });
      
      setStep('complete');
    } catch (error) {
      console.error('Failed to execute assignments:', error);
      setStep('review');
    }
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getConfidenceLabel = (score: number) => {
    if (score >= 80) return 'High Confidence';
    if (score >= 60) return 'Medium Confidence';
    return 'Low Confidence';
  };

  const availableBatches = batches.filter(b => b.status !== 'completed');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Wand2 className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Smart Assignment Wizard</h2>
          <p className="text-muted-foreground">
            AI-powered assignment recommendations based on program eligibility and site capacity
          </p>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-center space-x-4 py-4">
        {[
          { key: 'select', label: 'Select Batch' },
          { key: 'review', label: 'Review Suggestions' },
          { key: 'confirm', label: 'Confirm Assignment' },
          { key: 'complete', label: 'Complete' }
        ].map((stepItem, index) => (
          <React.Fragment key={stepItem.key}>
            <div className={`flex items-center gap-2 ${
              step === stepItem.key ? 'text-primary' : 
              ['review', 'confirm', 'complete'].indexOf(step) > ['select', 'review', 'confirm', 'complete'].indexOf(stepItem.key) 
                ? 'text-green-600' : 'text-muted-foreground'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                step === stepItem.key ? 'bg-primary text-primary-foreground' :
                ['review', 'confirm', 'complete'].indexOf(step) > ['select', 'review', 'confirm', 'complete'].indexOf(stepItem.key)
                  ? 'bg-green-600 text-white' : 'bg-muted text-muted-foreground'
              }`}>
                {['review', 'confirm', 'complete'].indexOf(step) > ['select', 'review', 'confirm', 'complete'].indexOf(stepItem.key) 
                  ? <CheckCircle className="h-4 w-4" /> : index + 1}
              </div>
              <span className="text-sm font-medium">{stepItem.label}</span>
            </div>
            {index < 3 && <ArrowRight className="h-4 w-4 text-muted-foreground" />}
          </React.Fragment>
        ))}
      </div>

      {/* Step Content */}
      {step === 'select' && (
        <Card>
          <CardHeader>
            <CardTitle>Select Student Batch</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Choose a batch to generate assignments for:</label>
              <Select value={selectedBatchId} onValueChange={setSelectedBatchId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a batch" />
                </SelectTrigger>
                <SelectContent>
                  {availableBatches.map((batch) => (
                    <SelectItem key={batch.id} value={batch.id}>
                      {batch.batch_name} ({batch.status})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedBatchId && (
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  Batch contains {batchStudents.length} students
                </div>
                <Button onClick={handleGenerateSuggestions} className="w-full">
                  <Wand2 className="h-4 w-4 mr-2" />
                  Generate Smart Assignments
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {step === 'review' && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Assignment Recommendations
                <Badge variant="outline">{suggestions.length} students</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {suggestions.map((suggestion) => (
                  <div key={suggestion.assignment_id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{suggestion.student_name}</h4>
                        <p className="text-sm text-muted-foreground">{suggestion.program_name}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${getConfidenceColor(suggestion.confidence_score)}`} />
                        <span className="text-sm font-medium">
                          {getConfidenceLabel(suggestion.confidence_score)}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Recommended Site:</label>
                      <Select
                        value={assignments.find(a => a.assignment_id === suggestion.assignment_id)?.site_id || ''}
                        onValueChange={(siteId) => handleSiteChange(suggestion.assignment_id, siteId)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a site" />
                        </SelectTrigger>
                        <SelectContent>
                          {suggestion.suggested_sites.map((site) => (
                            <SelectItem key={site.site_id} value={site.site_id}>
                              <div className="flex items-center justify-between w-full">
                                <span>{site.site_name}</span>
                                <div className="flex items-center gap-2 ml-2">
                                  <Badge variant="outline" className="text-xs">
                                    {site.available_spots}/{site.max_capacity} available
                                  </Badge>
                                  <div className="flex items-center">
                                    <Star className="h-3 w-3 text-yellow-500" />
                                    <span className="text-xs ml-1">{site.overall_score.toFixed(0)}</span>
                                  </div>
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="mt-3 text-xs text-muted-foreground">
                      <div className="font-medium mb-1">Recommendation reasoning:</div>
                      <ul className="list-disc list-inside space-y-1">
                        {suggestion.reasoning.map((reason, idx) => (
                          <li key={idx}>{reason}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center mt-6">
                <Button variant="outline" onClick={() => setStep('select')}>
                  Back
                </Button>
                <Button 
                  onClick={handleConfirmAssignments}
                  disabled={assignments.length === 0}
                >
                  Proceed to Confirmation
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {step === 'confirm' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Confirm Assignments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert className="mb-4">
              <AlertDescription>
                You are about to assign {assignments.length} students to their practicum sites. 
                This action will update their status and reduce available site capacity.
              </AlertDescription>
            </Alert>

            <div className="space-y-2 mb-6">
              {assignments.map((assignment) => {
                const suggestion = suggestions.find(s => s.assignment_id === assignment.assignment_id);
                const selectedSite = suggestion?.suggested_sites.find(s => s.site_id === assignment.site_id);
                
                return (
                  <div key={assignment.assignment_id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <div className="font-medium">{suggestion?.student_name}</div>
                      <div className="text-sm text-muted-foreground">{suggestion?.program_name}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{selectedSite?.site_name}</div>
                      <div className="text-sm text-muted-foreground">
                        {selectedSite?.available_spots} spots available
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep('review')}>
                Back to Review
              </Button>
              <Button 
                onClick={handleConfirmAssignments}
                disabled={executeBatchAssignment.isPending}
              >
                {executeBatchAssignment.isPending ? 'Processing...' : 'Execute Assignments'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 'complete' && (
        <Card>
          <CardContent className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Assignments Completed!</h3>
            <p className="text-muted-foreground mb-6">
              Successfully assigned {assignments.length} students to their practicum sites.
            </p>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" onClick={() => {
                setStep('select');
                setSelectedBatchId('');
                setAssignments([]);
              }}>
                Create New Assignment
              </Button>
              <Button onClick={() => window.location.reload()}>
                View Updated Assignments
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}