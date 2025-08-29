import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import SelectiveWebsiteScanner from '@/components/onboarding/steps/SelectiveWebsiteScanner';
import CompanySetupScreen from '@/components/onboarding/steps/CompanySetupScreen';
import ProgramSetupScreen from '@/components/onboarding/steps/ProgramSetupScreen';
import { Globe, Building2, GraduationCap } from 'lucide-react';

export const InstitutionSetup = () => {
  const [activeTab, setActiveTab] = useState('website');
  const [websiteData, setWebsiteData] = useState<any>(null);
  const [institutionData, setInstitutionData] = useState<any>(null);
  
  const handleWebsiteComplete = (data: any) => {
    setWebsiteData(data);
    setActiveTab('institution');
  };

  const handleInstitutionComplete = (data: any) => {
    setInstitutionData(data);
    setActiveTab('programs');
  };

  const handleProgramsComplete = (data: any) => {
    // Save all data and potentially navigate back to setup dashboard
    console.log('Institution setup complete:', { websiteData, institutionData, programs: data });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Institution Setup</h1>
        <p className="text-muted-foreground">
          Configure your institution details, analyze your website, and set up academic programs.
        </p>
      </div>

      {/* Setup Tabs */}
      <Card className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="website" className="flex items-center space-x-2">
              <Globe className="w-4 h-4" />
              <span>Website Analysis</span>
              {websiteData && <Badge variant="outline" className="ml-2 text-xs">✓</Badge>}
            </TabsTrigger>
            <TabsTrigger value="institution" className="flex items-center space-x-2">
              <Building2 className="w-4 h-4" />
              <span>Institution Details</span>
              {institutionData && <Badge variant="outline" className="ml-2 text-xs">✓</Badge>}
            </TabsTrigger>
            <TabsTrigger value="programs" className="flex items-center space-x-2">
              <GraduationCap className="w-4 h-4" />
              <span>Academic Programs</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="website" className="mt-6">
            <SelectiveWebsiteScanner
              data={null}
              onComplete={handleWebsiteComplete}
              onNext={() => setActiveTab('institution')}
              onSkip={() => setActiveTab('institution')}
            />
          </TabsContent>

          <TabsContent value="institution" className="mt-6">
            <CompanySetupScreen
              data={institutionData}
              websiteData={websiteData}
              onComplete={handleInstitutionComplete}
              onNext={() => setActiveTab('programs')}
              onSkip={() => setActiveTab('programs')}
            />
          </TabsContent>

          <TabsContent value="programs" className="mt-6">
            <ProgramSetupScreen
              data={null}
              websiteData={websiteData}
              onComplete={handleProgramsComplete}
              onNext={() => {}}
              onSkip={() => {}}
            />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};