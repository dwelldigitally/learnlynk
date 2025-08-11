import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Users, UserPlus, Mail } from 'lucide-react';

interface TeamSetupScreenProps {
  data: any;
  onComplete: (data: any) => void;
  onNext: () => void;
  onSkip: () => void;
}

const TeamSetupScreen: React.FC<TeamSetupScreenProps> = ({
  data,
  onComplete,
  onNext,
  onSkip
}) => {
  const { toast } = useToast();
  const [teamMembers] = useState(data?.team || []);

  const handleComplete = () => {
    onComplete({ team: teamMembers });
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Users className="w-12 h-12 text-primary mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground">Team Setup</h3>
        <p className="text-muted-foreground">
          You can invite team members later from the admin panel.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Team management features will be available in the admin dashboard.
          </p>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button onClick={handleComplete} className="bg-primary hover:bg-primary-hover">
          Continue
        </Button>
      </div>
    </div>
  );
};

export default TeamSetupScreen;