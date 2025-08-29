import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import RequirementsSetupScreen from '@/components/onboarding/steps/RequirementsSetupScreen';
import FormBuilderScreen from '@/components/onboarding/steps/FormBuilderScreen';
import { FileText, FormInput, UserPlus } from 'lucide-react';

export const ApplicationSetup = () => {
  const [activeTab, setActiveTab] = useState('requirements');
  const [requirementsData, setRequirementsData] = useState<any>(null);
  const [formsData, setFormsData] = useState<any>(null);
  const [leadCaptureData, setLeadCaptureData] = useState<any>(null);
  
  const handleRequirementsComplete = (data: any) => {
    setRequirementsData(data);
    setActiveTab('forms');
  };

  const handleFormsComplete = (data: any) => {
    setFormsData(data);
    setActiveTab('leadcapture');
  };

  const handleLeadCaptureComplete = (data: any) => {
    setLeadCaptureData(data);
    
    // Save completion data to localStorage
    const existingData = JSON.parse(localStorage.getItem('onboarding_data') || '{}');
    const updatedData = {
      ...existingData,
      requirements: requirementsData,
      forms: formsData,
      leadCapture: data
    };
    localStorage.setItem('onboarding_data', JSON.stringify(updatedData));
    
    console.log('Application setup complete:', { requirementsData, formsData, leadCapture: data });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Application Setup</h1>
        <p className="text-muted-foreground">
          Configure application requirements, forms, and lead capture systems.
        </p>
      </div>

      {/* Setup Tabs */}
      <Card className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="requirements" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Requirements</span>
              {requirementsData && <Badge variant="outline" className="ml-2 text-xs">✓</Badge>}
            </TabsTrigger>
            <TabsTrigger value="forms" className="flex items-center space-x-2">
              <FormInput className="w-4 h-4" />
              <span>Forms</span>
              {formsData && <Badge variant="outline" className="ml-2 text-xs">✓</Badge>}
            </TabsTrigger>
            <TabsTrigger value="leadcapture" className="flex items-center space-x-2">
              <UserPlus className="w-4 h-4" />
              <span>Lead Capture</span>
              {leadCaptureData && <Badge variant="outline" className="ml-2 text-xs">✓</Badge>}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="requirements" className="mt-6">
            <RequirementsSetupScreen
              data={requirementsData}
              programs={[]}
              onComplete={handleRequirementsComplete}
              onNext={() => setActiveTab('forms')}
              onSkip={() => setActiveTab('forms')}
            />
          </TabsContent>

          <TabsContent value="forms" className="mt-6">
            <FormBuilderScreen
              data={formsData}
              onComplete={handleFormsComplete}
              onNext={() => setActiveTab('leadcapture')}
              onSkip={() => setActiveTab('leadcapture')}
            />
          </TabsContent>

          <TabsContent value="leadcapture" className="mt-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Lead Capture Configuration</h3>
                <p className="text-muted-foreground">
                  Configure how leads are captured and processed from your website.
                </p>
              </div>
              
              <div className="bg-muted/30 rounded-lg p-4">
                <h4 className="font-medium text-foreground mb-2">Lead Processing Features</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Automatic lead assignment to counselors</li>
                  <li>• Email notifications and follow-up sequences</li>
                  <li>• Lead scoring based on program interest</li>
                  <li>• Integration with CRM systems</li>
                  <li>• Duplicate lead detection and merging</li>
                </ul>
              </div>
              
              <div className="flex justify-center space-x-4">
                <Button variant="outline" onClick={() => handleLeadCaptureComplete({})}>
                  Configure Later
                </Button>
                <Button onClick={() => handleLeadCaptureComplete({ configured: true })}>
                  Complete Setup
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};