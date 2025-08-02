import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { DemoDataService, useDemoDataAccess } from '@/services/demoDataService';
import { useAuth } from '@/contexts/AuthContext';
import { Settings, Users, Database, AlertTriangle } from 'lucide-react';

export const DemoDataManagement: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { data: currentUserHasDemoData, refetch } = useDemoDataAccess();

  const handleAssignDemoData = async (enabled: boolean) => {
    if (!email.trim()) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const success = await DemoDataService.assignDemoDataToUser(email, enabled);
      if (success) {
        toast({
          title: "Success",
          description: `Demo data ${enabled ? 'assigned to' : 'removed from'} ${email}`,
        });
        setEmail('');
        if (email === user?.email) {
          refetch();
        }
      } else {
        toast({
          title: "Error",
          description: "Failed to update demo data assignment. User may not exist.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while updating demo data assignment",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Database className="w-5 h-5" />
        <h2 className="text-2xl font-bold">Demo Data Management</h2>
      </div>

      {/* Current User Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Your Demo Data Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Current User: {user?.email}
              </p>
              <div className="flex items-center gap-2">
                <span>Demo Data Access:</span>
                <Badge variant={currentUserHasDemoData ? "default" : "secondary"}>
                  {currentUserHasDemoData ? "Enabled" : "Disabled"}
                </Badge>
              </div>
            </div>
          </div>
          {currentUserHasDemoData && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <AlertTriangle className="w-4 h-4 inline mr-1" />
                You currently have access to demo data. This includes sample leads, analytics, and other dummy content.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Assign Demo Data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Assign Demo Data to User
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">User Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => handleAssignDemoData(true)}
              disabled={isLoading}
              className="flex-1"
            >
              Enable Demo Data
            </Button>
            <Button
              onClick={() => handleAssignDemoData(false)}
              disabled={isLoading}
              variant="outline"
              className="flex-1"
            >
              Disable Demo Data
            </Button>
          </div>

          <div className="mt-4 p-4 border rounded-lg">
            <h4 className="font-medium mb-2">Demo Data Information</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Only users with demo data will see sample leads and analytics</li>
              <li>• New users get completely clean accounts by default</li>
              <li>• Demo data helps showcase the platform's capabilities</li>
              <li>• Demo data is only visible when real data doesn't exist</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Primary Demo Account:</span>
              <span className="font-mono">malhotratushar37@gmail.com</span>
            </div>
            <div className="flex justify-between">
              <span>Demo Data Types:</span>
              <span>Leads, Analytics, Revenue Data</span>
            </div>
            <div className="flex justify-between">
              <span>Data Isolation:</span>
              <Badge variant="outline">Enabled</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};