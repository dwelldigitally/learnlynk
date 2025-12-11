import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { 
  useDuplicatePreventionSetting, 
  useSetDuplicatePreventionSetting 
} from '@/hooks/useDuplicateDetection';
import { DuplicatePreventionField } from '@/services/duplicateLeadService';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  Lock,
  Info
} from 'lucide-react';

export default function DuplicatePreventionSetup() {
  const navigate = useNavigate();
  const [selectedField, setSelectedField] = useState<DuplicatePreventionField>('email');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  
  const { data: existingSetting, isLoading } = useDuplicatePreventionSetting();
  const { mutate: saveSetting, isPending: saving } = useSetDuplicatePreventionSetting();

  const isConfigured = !!existingSetting;

  const handleSave = () => {
    if (!selectedField) return;
    setShowConfirmDialog(true);
  };

  const confirmSave = () => {
    saveSetting(selectedField, {
      onSuccess: (result) => {
        if (result.success) {
          setShowConfirmDialog(false);
        }
      }
    });
  };

  const getFieldDescription = (field: DuplicatePreventionField) => {
    switch (field) {
      case 'email':
        return 'Prevent leads with the same email address. Best for organizations where email is the primary contact method.';
      case 'phone':
        return 'Prevent leads with the same phone number. Useful when phone is the primary identifier.';
      case 'both':
        return 'Prevent leads that match either email OR phone. Most comprehensive protection against duplicates.';
      default:
        return '';
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 max-w-3xl">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="h-64 bg-muted rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8 max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Duplicate Prevention Setup</h1>
          <p className="text-muted-foreground">Configure how duplicates are detected and prevented</p>
        </div>
      </div>

      {/* Already Configured Alert */}
      {isConfigured && (
        <Alert>
          <Lock className="h-4 w-4" />
          <AlertTitle>Configuration Locked</AlertTitle>
          <AlertDescription>
            Duplicate prevention is already configured to check{' '}
            <Badge variant="secondary" className="mx-1">
              {existingSetting === 'both' ? 'Email & Phone' : existingSetting === 'email' ? 'Email' : 'Phone'}
            </Badge>
            . This setting cannot be changed once configured to maintain data integrity.
          </AlertDescription>
        </Alert>
      )}

      {/* Main Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>Duplicate Detection Field</CardTitle>
              <CardDescription>
                Choose which field(s) to use for identifying duplicate leads
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Warning */}
          {!isConfigured && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Important: This is a One-Time Setup</AlertTitle>
              <AlertDescription>
                Once configured, this setting <strong>cannot be changed</strong>. Choose carefully based on 
                how your institution primarily identifies contacts.
              </AlertDescription>
            </Alert>
          )}

          {/* Options */}
          <RadioGroup 
            value={isConfigured ? existingSetting! : selectedField || ''} 
            onValueChange={(v) => !isConfigured && setSelectedField(v as DuplicatePreventionField)}
            disabled={isConfigured}
            className="space-y-4"
          >
            {/* Email Option */}
            <div className={`relative flex items-start gap-4 p-4 rounded-lg border-2 transition-colors ${
              (isConfigured ? existingSetting : selectedField) === 'email' 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-muted-foreground/50'
            } ${isConfigured ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer'}`}>
              <RadioGroupItem value="email" id="email" className="mt-1" />
              <div className="flex-1">
                <Label htmlFor="email" className="flex items-center gap-2 text-base font-medium cursor-pointer">
                  <Mail className="h-4 w-4" />
                  Email Address Only
                  {existingSetting === 'email' && <Badge variant="secondary">Current</Badge>}
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  {getFieldDescription('email')}
                </p>
              </div>
            </div>

            {/* Phone Option */}
            <div className={`relative flex items-start gap-4 p-4 rounded-lg border-2 transition-colors ${
              (isConfigured ? existingSetting : selectedField) === 'phone' 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-muted-foreground/50'
            } ${isConfigured ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer'}`}>
              <RadioGroupItem value="phone" id="phone" className="mt-1" />
              <div className="flex-1">
                <Label htmlFor="phone" className="flex items-center gap-2 text-base font-medium cursor-pointer">
                  <Phone className="h-4 w-4" />
                  Phone Number Only
                  {existingSetting === 'phone' && <Badge variant="secondary">Current</Badge>}
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  {getFieldDescription('phone')}
                </p>
              </div>
            </div>

            {/* Both Option */}
            <div className={`relative flex items-start gap-4 p-4 rounded-lg border-2 transition-colors ${
              (isConfigured ? existingSetting : selectedField) === 'both' 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-muted-foreground/50'
            } ${isConfigured ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer'}`}>
              <RadioGroupItem value="both" id="both" className="mt-1" />
              <div className="flex-1">
                <Label htmlFor="both" className="flex items-center gap-2 text-base font-medium cursor-pointer">
                  <Shield className="h-4 w-4" />
                  Both Email & Phone
                  {existingSetting === 'both' && <Badge variant="secondary">Current</Badge>}
                  {!isConfigured && <Badge variant="outline" className="text-green-600">Recommended</Badge>}
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  {getFieldDescription('both')}
                </p>
              </div>
            </div>
          </RadioGroup>

          <Separator />

          {/* What Happens Section */}
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <Info className="h-4 w-4" />
              What happens when enabled?
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                New leads matching the selected field will be automatically blocked
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                Applies to all lead sources: forms, imports, API, and manual creation
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                Existing duplicates can be reviewed and merged from the Duplicates Dashboard
              </li>
            </ul>
          </div>

          {/* Actions */}
          {!isConfigured && (
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={!selectedField || saving}>
                {saving ? 'Saving...' : 'Configure Prevention'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Configuration</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to set duplicate prevention to check{' '}
              <strong>
                {selectedField === 'both' ? 'Email & Phone' : selectedField === 'email' ? 'Email' : 'Phone'}
              </strong>.
              <br /><br />
              <strong className="text-destructive">This cannot be undone.</strong> Are you sure you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSave} disabled={saving}>
              {saving ? 'Saving...' : 'Yes, Configure'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
