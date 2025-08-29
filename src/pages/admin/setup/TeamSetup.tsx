import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import TeamSetupScreen from '@/components/onboarding/steps/TeamSetupScreen';
// import SystemTrainingScreen from '@/components/onboarding/steps/SystemTrainingScreen';
import { Users, BookOpen } from 'lucide-react';

export const TeamSetup = () => {
  const [activeTab, setActiveTab] = useState('team');
  const [teamData, setTeamData] = useState<any>(null);
  
  const handleTeamComplete = (data: any) => {
    setTeamData(data);
    setActiveTab('training');
  };

  const handleTrainingComplete = (data: any) => {
    console.log('Team setup complete:', { teamData, training: data });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Team & Training Setup</h1>
        <p className="text-muted-foreground">
          Set up team members and provide system training resources.
        </p>
      </div>

      {/* Setup Tabs */}
      <Card className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="team" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Team Setup</span>
              {teamData && <Badge variant="outline" className="ml-2 text-xs">✓</Badge>}
            </TabsTrigger>
            <TabsTrigger value="training" className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4" />
              <span>System Training</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="team" className="mt-6">
            <TeamSetupScreen
              data={teamData}
              onComplete={handleTeamComplete}
              onNext={() => setActiveTab('training')}
              onSkip={() => setActiveTab('training')}
            />
          </TabsContent>

          <TabsContent value="training" className="mt-6">
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">System Training</h3>
              <p className="text-muted-foreground">
                Training resources and onboarding materials will be available here.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};