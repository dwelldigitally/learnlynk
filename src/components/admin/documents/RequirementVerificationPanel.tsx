import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle2, XCircle, AlertCircle, Save } from 'lucide-react';
import { requirementVerificationService } from '@/services/requirementVerificationService';
import { useToast } from '@/hooks/use-toast';
import { MasterRequirement, VerificationStatus } from '@/types/requirement';

interface RequirementVerificationPanelProps {
  documentId: string;
  requirement?: MasterRequirement;
  currentStatus?: VerificationStatus;
  currentExtractedValue?: string;
  currentNotes?: string;
  onVerificationComplete?: () => void;
}

export const RequirementVerificationPanel: React.FC<RequirementVerificationPanelProps> = ({
  documentId,
  requirement,
  currentStatus = 'not_checked',
  currentExtractedValue = '',
  currentNotes = '',
  onVerificationComplete
}) => {
  const [extractedValue, setExtractedValue] = useState(currentExtractedValue);
  const [notes, setNotes] = useState(currentNotes);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const getStatusIcon = (status: VerificationStatus) => {
    switch (status) {
      case 'meets_requirement':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'below_requirement':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'manual_review_needed':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: VerificationStatus) => {
    const variants: Record<VerificationStatus, { label: string; className: string }> = {
      meets_requirement: { label: 'Meets Requirement', className: 'bg-green-100 text-green-800' },
      below_requirement: { label: 'Below Requirement', className: 'bg-red-100 text-red-800' },
      manual_review_needed: { label: 'Needs Review', className: 'bg-yellow-100 text-yellow-800' },
      not_checked: { label: 'Not Checked', className: 'bg-muted text-muted-foreground' }
    };

    const { label, className } = variants[status];
    return <Badge className={className}>{label}</Badge>;
  };

  const handleVerify = async () => {
    if (!requirement || !extractedValue) {
      toast({
        title: 'Missing Information',
        description: 'Please enter the extracted value',
        variant: 'destructive'
      });
      return;
    }

    setSaving(true);
    try {
      await requirementVerificationService.verifyDocument(
        documentId,
        requirement.id,
        extractedValue,
        'manual'
      );

      if (notes) {
        await requirementVerificationService.updateVerificationStatus(
          documentId,
          currentStatus,
          extractedValue,
          notes
        );
      }

      toast({
        title: 'Verification Saved',
        description: 'Document verification has been updated'
      });

      onVerificationComplete?.();
    } catch (error) {
      console.error('Error verifying document:', error);
      toast({
        title: 'Verification Failed',
        description: 'Failed to save verification',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  if (!requirement) {
    return (
      <Card>
        <CardContent className="py-4">
          <p className="text-sm text-muted-foreground">No requirement linked to this document</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center justify-between">
          <span>Requirement Verification</span>
          {getStatusBadge(currentStatus)}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            {getStatusIcon(currentStatus)}
            <div className="flex-1">
              <p className="font-medium text-sm">{requirement.name}</p>
              {requirement.description && (
                <p className="text-xs text-muted-foreground mt-1">{requirement.description}</p>
              )}
            </div>
          </div>
        </div>

        {(requirement.minimum_value || requirement.maximum_value) && (
          <div className="bg-muted/50 p-3 rounded-md space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Required Value</p>
            <p className="text-sm">
              {requirement.minimum_value && `Min: ${requirement.minimum_value}`}
              {requirement.minimum_value && requirement.maximum_value && ' • '}
              {requirement.maximum_value && `Max: ${requirement.maximum_value}`}
              {requirement.units && ` ${requirement.units}`}
            </p>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="extracted-value">Extracted Value</Label>
          <Input
            id="extracted-value"
            value={extractedValue}
            onChange={(e) => setExtractedValue(e.target.value)}
            placeholder="Enter the value from the document"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="verification-notes">Verification Notes</Label>
          <Textarea
            id="verification-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any notes about the verification"
            rows={3}
          />
        </div>

        <Button 
          onClick={handleVerify} 
          disabled={saving || !extractedValue}
          className="w-full"
        >
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Saving...' : 'Save Verification'}
        </Button>
      </CardContent>
    </Card>
  );
};
