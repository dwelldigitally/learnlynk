import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, Users, Globe, ArrowRight, BookOpen, Settings, Loader2, FileText, Clock, Phone, Video } from 'lucide-react';
import { MasterJourneyService } from '@/services/masterJourneyService';
import { MasterJourneyTemplateEditor } from './MasterJourneyTemplateEditor';
import { JourneyTemplate } from '@/types/academicJourney';
import { toast } from 'sonner';

interface MasterJourneySetupWizardProps {
  onComplete: () => void;
  onSkip: () => void;
}

export function MasterJourneySetupWizard({ onComplete, onSkip }: MasterJourneySetupWizardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [hasMasterTemplates, setHasMasterTemplates] = useState(false);
  const [step, setStep] = useState<'check' | 'setup' | 'configure' | 'complete'>('check');
  const [showTemplateEditor, setShowTemplateEditor] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<'domestic' | 'international' | null>(null);
  const [currentTemplate, setCurrentTemplate] = useState<JourneyTemplate | null>(null);

  useEffect(() => {
    checkMasterTemplates();
  }, []);

  const checkMasterTemplates = async () => {
    try {
      const exists = await MasterJourneyService.checkMasterTemplatesExist();
      setHasMasterTemplates(exists);
      
      if (exists) {
        setStep('complete');
      } else {
        setStep('setup');
      }
    } catch (error) {
      console.error('Error checking master templates:', error);
      setStep('setup');
    }
  };

  const createMasterTemplates = async () => {
    setIsLoading(true);
    try {
      await MasterJourneyService.createMasterTemplates();
      setHasMasterTemplates(true);
      setStep('complete');
      toast.success('Master journey templates created successfully!');
    } catch (error) {
      console.error('Error creating master templates:', error);
      toast.error('Failed to create master templates. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfigureTemplates = () => {
    setStep('configure');
  };

  const handleTemplateEdit = async (templateType: 'domestic' | 'international') => {
    try {
      setIsLoading(true);
      const template = await MasterJourneyService.getMasterTemplate(templateType);
      setCurrentTemplate(template);
      setEditingTemplate(templateType);
      setShowTemplateEditor(true);
    } catch (error) {
      console.error('Error loading template:', error);
      toast.error("Failed to load template for editing");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTemplateSave = async (templateData: JourneyTemplate) => {
    try {
      setIsLoading(true);
      
      if (!editingTemplate) return;
      
      if (currentTemplate) {
        // Update existing template
        await MasterJourneyService.updateMasterTemplate(editingTemplate, templateData);
      } else {
        // This shouldn't happen in edit mode, but handle it gracefully
        console.warn('No existing template found, this should not happen in edit mode');
      }
      
      setShowTemplateEditor(false);
      setEditingTemplate(null);
      setCurrentTemplate(null);
      setStep('complete');
      toast.success(`${editingTemplate} template saved successfully!`);
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error('Failed to save template. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 'check') {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Checking Master Journey Templates
          </CardTitle>
          <CardDescription>
            Verifying your journey template configuration...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (showTemplateEditor && editingTemplate) {
    return (
      <MasterJourneyTemplateEditor
        template={currentTemplate}
        studentType={editingTemplate}
        onSave={handleTemplateSave}
        onCancel={() => {
          setShowTemplateEditor(false);
          setEditingTemplate(null);
          setCurrentTemplate(null);
        }}
      />
    );
  }

  if (step === 'configure') {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Settings className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Configure Journey Templates</CardTitle>
          <CardDescription className="text-lg">
            Customize your master journey templates with specific stages and requirements.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <Alert>
            <Settings className="h-4 w-4" />
            <AlertDescription>
              Configure each template with the specific stages, timings, and requirements that match your institution's enrollment process.
            </AlertDescription>
          </Alert>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleTemplateEdit('domestic')}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Configure Domestic Template</CardTitle>
                    <CardDescription>Set up journey for domestic students</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  <Settings className="h-4 w-4 mr-2" />
                  Configure Stages
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleTemplateEdit('international')}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Globe className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Configure International Template</CardTitle>
                    <CardDescription>Set up journey for international students</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  <Settings className="h-4 w-4 mr-2" />
                  Configure Stages
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-center gap-4 pt-6">
            <Button variant="outline" onClick={() => setStep('setup')}>
              Back
            </Button>
            <Button onClick={createMasterTemplates}>
              Use Default Templates
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (step === 'complete') {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            Master Journey Templates Ready
          </CardTitle>
          <CardDescription>
            Your master journey templates are configured and ready to use.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Master templates for both domestic and international students are now available. 
              These templates will be automatically applied to all programs unless you create custom journeys.
            </AlertDescription>
          </Alert>
          
          <div className="flex justify-end gap-2">
            <Button onClick={onComplete} className="flex items-center gap-2">
              Continue to Journey Management <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Master Journey Setup Required
        </CardTitle>
        <CardDescription>
          Before you can manage academic journeys, you need to set up master journey templates for different student types.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <AlertDescription>
            Master journey templates define the standard enrollment process for your institution. 
            These templates will be applied to all programs by default, ensuring consistency across your offerings.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-2">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Domestic Students
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm text-muted-foreground">Standard process:</div>
              <ul className="text-sm space-y-1">
                <li>• Lead Capture</li>
                <li>• Application Start</li>
                <li>• Prerequisites Review</li>
                <li>• Document Submission</li>
                <li>• Admission Interview</li>
                <li>• Admission Decision</li>
                <li>• Contract Signing</li>
                <li>• Deposit Payment</li>
                <li>• Enrollment Complete</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Globe className="h-5 w-5 text-green-600" />
                International Students
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm text-muted-foreground">Enhanced process:</div>
              <ul className="text-sm space-y-1">
                <li>• Lead Capture</li>
                <li>• Application Start</li>
                <li>• Prerequisites Review</li>
                <li>• English Proficiency Test</li>
                <li>• Document Submission</li>
                <li>• Admission Interview</li>
                <li>• Admission Decision</li>
                <li>• Visa Application Support</li>
                <li>• Contract Signing</li>
                <li>• Deposit Payment</li>
                <li>• Enrollment Complete</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={onSkip}
            disabled={isLoading}
          >
            Skip For Now
          </Button>
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={handleConfigureTemplates}
              disabled={isLoading}
            >
              Configure Templates
            </Button>
            <Button 
              onClick={createMasterTemplates}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating Templates...
                </>
              ) : (
                <>
                  Use Default Templates <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}