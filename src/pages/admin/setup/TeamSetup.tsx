import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import TeamSetupScreen from '@/components/onboarding/steps/TeamSetupScreen';
import SystemTrainingScreen from '@/components/onboarding/steps/SystemTrainingScreen';
import { Users, BookOpen } from 'lucide-react';

export const TeamSetup = () => {
  const [activeTab, setActiveTab] = useState('team');
  const [teamData, setTeamData] = useState<any>(null);
  const [trainingData, setTrainingData] = useState<any>(null);
  
  const handleTeamComplete = (data: any) => {
    setTeamData(data);
    setActiveTab('training');
  };

  const handleTrainingComplete = (data: any) => {
    setTrainingData(data);
    
    // Save completion data to localStorage
    const existingData = JSON.parse(localStorage.getItem('onboarding_data') || '{}');
    const updatedData = {
      ...existingData,
      team: teamData,
      training: data
    };
    localStorage.setItem('onboarding_data', JSON.stringify(updatedData));
    
    console.log('Team setup complete:', { teamData, training: data });
  };

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Team & Training Setup</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Set up team members and provide system training resources.
          </p>
        </div>
      </div>

      {/* Setup Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="team" className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Team Setup</span>
            {teamData && <Badge variant="outline" className="ml-2 text-xs">✓</Badge>}
          </TabsTrigger>
          <TabsTrigger value="training" className="flex items-center space-x-2">
            <BookOpen className="w-4 h-4" />
            <span>System Training</span>
            {trainingData && <Badge variant="outline" className="ml-2 text-xs">✓</Badge>}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="team" className="space-y-6">
          <Card className="p-6">
            <TeamSetupScreen
              data={teamData}
              onComplete={handleTeamComplete}
              onNext={() => setActiveTab('training')}
              onSkip={() => setActiveTab('training')}
            />
          </Card>
        </TabsContent>

        <TabsContent value="training" className="space-y-6">
          <Card className="p-6">
            <SystemTrainingScreen
              data={trainingData}
              onComplete={handleTrainingComplete}
              onNext={() => {}}
              onSkip={() => {}}
            />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};