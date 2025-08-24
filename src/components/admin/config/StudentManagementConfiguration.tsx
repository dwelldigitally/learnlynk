import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UniversalCRUDTable } from './UniversalCRUDTable';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { GraduationCap, Users, BookOpen, MessageSquare, FileText, Plus } from 'lucide-react';

interface StudentConfigData {
  id: string;
  category: string;
  created_at: string;
  data_type: string;
  description: string | null;
  is_encrypted: boolean | null;
  is_system_setting: boolean | null;
  key: string;
  updated_at: string;
  user_id: string;
  validation_rules: any;
  value: any;
}

export const StudentManagementConfiguration: React.FC = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [configs, setConfigs] = useState<StudentConfigData[]>([]);

  // Sample data for student lifecycle stages
  const [lifecycleStages] = useState([
    { id: '1', name: 'New Student', description: 'Recently enrolled student', order: 1, isDefault: true },
    { id: '2', name: 'Active', description: 'Currently attending classes', order: 2, isDefault: false },
    { id: '3', name: 'Academic Probation', description: 'Student requires academic support', order: 3, isDefault: false },
    { id: '4', name: 'Leave of Absence', description: 'Temporarily not attending', order: 4, isDefault: false },
    { id: '5', name: 'Graduated', description: 'Successfully completed program', order: 5, isDefault: false },
  ]);

  // Sample data for academic settings
  const [academicSettings] = useState([
    { id: '1', setting: 'Minimum GPA', value: '2.0', description: 'Minimum GPA to maintain enrollment' },
    { id: '2', setting: 'Max Credits Per Semester', value: '18', description: 'Maximum credits a student can take' },
    { id: '3', setting: 'Graduation Credit Requirement', value: '120', description: 'Total credits needed to graduate' },
  ]);

  // Sample data for communication templates
  const [communicationTemplates] = useState([
    { id: '1', name: 'Welcome Email', type: 'Email', trigger: 'New Enrollment', isActive: true },
    { id: '2', name: 'Academic Warning', type: 'Email', trigger: 'Low GPA', isActive: true },
    { id: '3', name: 'Graduation Congratulations', type: 'Email', trigger: 'Program Completion', isActive: true },
  ]);

  // Column definitions for tables
  const lifecycleColumns = [
    { key: 'name', label: 'Stage Name', type: 'text' as const },
    { key: 'description', label: 'Description', type: 'text' as const },
    { key: 'order', label: 'Order', type: 'number' as const },
    { key: 'isDefault', label: 'Default', type: 'boolean' as const },
  ];

  const academicColumns = [
    { key: 'setting', label: 'Setting', type: 'text' as const },
    { key: 'value', label: 'Value', type: 'text' as const },
    { key: 'description', label: 'Description', type: 'text' as const },
  ];

  const communicationColumns = [
    { key: 'name', label: 'Template Name', type: 'text' as const },
    { key: 'type', label: 'Type', type: 'text' as const },
    { key: 'trigger', label: 'Trigger', type: 'text' as const },
    { key: 'isActive', label: 'Active', type: 'boolean' as const },
  ];

  const loadConfigurations = async () => {
    setIsLoading(true);
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { data, error } = await supabase
        .from('configuration_metadata')
        .select('*')
        .eq('category', 'student-management')
        .eq('user_id', user.user.id);

      if (error) throw error;
      setConfigs(data || []);
    } catch (error) {
      console.error('Error loading configurations:', error);
      toast({
        title: "Error",
        description: "Failed to load student management configurations.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadConfigurations();
  }, []);

  const handleSaveConfiguration = async (key: string, value: any, description: string) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { error } = await supabase
        .from('configuration_metadata')
        .upsert({
          user_id: user.user.id,
          category: 'student-management',
          key,
          value: JSON.stringify(value),
          data_type: 'json',
          description,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Configuration saved successfully.",
      });

      loadConfigurations();
    } catch (error) {
      console.error('Error saving configuration:', error);
      toast({
        title: "Error",
        description: "Failed to save configuration.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="lifecycle" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="lifecycle" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Lifecycle
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="academic" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Academic
          </TabsTrigger>
          <TabsTrigger value="communication" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Communication
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Documents
          </TabsTrigger>
        </TabsList>

        <TabsContent value="lifecycle" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Student Lifecycle Stages</CardTitle>
              <CardDescription>
                Define the stages a student progresses through during their academic journey.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UniversalCRUDTable
                title="Lifecycle Stages"
                description="Manage student progression stages"
                data={lifecycleStages}
                columns={lifecycleColumns}
                onAdd={() => console.log('Add lifecycle stage')}
                onEdit={(item) => console.log('Edit lifecycle stage:', item)}
                onDelete={(item) => console.log('Delete lifecycle stage:', item)}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Student Profile Settings</CardTitle>
              <CardDescription>
                Configure required fields and profile management settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="required-fields">Required Profile Fields</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select required fields" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email Address</SelectItem>
                      <SelectItem value="phone">Phone Number</SelectItem>
                      <SelectItem value="address">Home Address</SelectItem>
                      <SelectItem value="emergency">Emergency Contact</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profile-photo">Profile Photo Required</Label>
                  <Switch id="profile-photo" />
                </div>
              </div>
              <Button onClick={() => handleSaveConfiguration('profile-settings', {}, 'Student profile configuration')}>
                Save Profile Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="academic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Academic Settings</CardTitle>
              <CardDescription>
                Configure academic requirements and grading systems.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UniversalCRUDTable
                title="Academic Configuration"
                description="Manage academic requirements and settings"
                data={academicSettings}
                columns={academicColumns}
                onAdd={() => console.log('Add academic setting')}
                onEdit={(item) => console.log('Edit academic setting:', item)}
                onDelete={(item) => console.log('Delete academic setting:', item)}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="communication" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Communication Templates</CardTitle>
              <CardDescription>
                Manage automated communication templates for students.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UniversalCRUDTable
                title="Communication Templates"
                description="Manage student communication templates"
                data={communicationTemplates}
                columns={communicationColumns}
                onAdd={() => console.log('Add communication template')}
                onEdit={(item) => console.log('Edit communication template:', item)}
                onDelete={(item) => console.log('Delete communication template:', item)}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Document Management</CardTitle>
              <CardDescription>
                Configure required documents and submission settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="transcript-required">Academic Transcript Required</Label>
                  <Switch id="transcript-required" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="document-expiry">Document Expiry Notification (days)</Label>
                  <Input id="document-expiry" type="number" placeholder="30" />
                </div>
              </div>
              <Button onClick={() => handleSaveConfiguration('document-settings', {}, 'Student document configuration')}>
                Save Document Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};