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
import { UserCheck, FileText, DollarSign, CheckCircle, Users, Plus } from 'lucide-react';

interface ApplicantConfigData {
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

export const ApplicantManagementConfiguration: React.FC = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [configs, setConfigs] = useState<ApplicantConfigData[]>([]);

  // Sample data for application process settings
  const [applicationTypes] = useState([
    { id: '1', name: 'Direct Enrollment', description: 'Standard application process', isActive: true, processingDays: 7 },
    { id: '2', name: 'Transfer Student', description: 'For students transferring credits', isActive: true, processingDays: 14 },
    { id: '3', name: 'International Student', description: 'For international applicants', isActive: true, processingDays: 21 },
    { id: '4', name: 'Graduate Program', description: 'For master\'s and PhD programs', isActive: true, processingDays: 30 },
  ]);

  // Sample data for document requirements
  const [documentRequirements] = useState([
    { id: '1', documentType: 'Transcript', program: 'All Programs', mandatory: true, maxSize: '5MB' },
    { id: '2', documentType: 'Personal Statement', program: 'Graduate Programs', mandatory: true, maxSize: '2MB' },
    { id: '3', documentType: 'Letters of Recommendation', program: 'Graduate Programs', mandatory: true, maxSize: '10MB' },
    { id: '4', documentType: 'Portfolio', program: 'Design Programs', mandatory: false, maxSize: '50MB' },
  ]);

  // Sample data for decision criteria
  const [decisionCriteria] = useState([
    { id: '1', criteria: 'GPA Minimum', threshold: '3.0', weight: 40, isActive: true },
    { id: '2', criteria: 'Test Scores', threshold: '1200', weight: 30, isActive: true },
    { id: '3', criteria: 'Essay Quality', threshold: 'Good', weight: 20, isActive: true },
    { id: '4', criteria: 'Recommendations', threshold: 'Positive', weight: 10, isActive: true },
  ]);

  // Sample data for payment settings
  const [paymentSettings] = useState([
    { id: '1', feeType: 'Application Fee', amount: 75, program: 'Undergraduate', isRequired: true },
    { id: '2', feeType: 'Application Fee', amount: 100, program: 'Graduate', isRequired: true },
    { id: '3', feeType: 'Late Application Fee', amount: 25, program: 'All Programs', isRequired: false },
    { id: '4', feeType: 'International Processing Fee', amount: 50, program: 'International', isRequired: true },
  ]);

  // Column definitions for tables
  const applicationColumns = [
    { key: 'name', label: 'Application Type', type: 'text' as const },
    { key: 'description', label: 'Description', type: 'text' as const },
    { key: 'processingDays', label: 'Processing Days', type: 'number' as const },
    { key: 'isActive', label: 'Active', type: 'boolean' as const },
  ];

  const documentColumns = [
    { key: 'documentType', label: 'Document Type', type: 'text' as const },
    { key: 'program', label: 'Program', type: 'text' as const },
    { key: 'mandatory', label: 'Mandatory', type: 'boolean' as const },
    { key: 'maxSize', label: 'Max Size', type: 'text' as const },
  ];

  const decisionColumns = [
    { key: 'criteria', label: 'Criteria', type: 'text' as const },
    { key: 'threshold', label: 'Threshold', type: 'text' as const },
    { key: 'weight', label: 'Weight (%)', type: 'number' as const },
    { key: 'isActive', label: 'Active', type: 'boolean' as const },
  ];

  const paymentColumns = [
    { key: 'feeType', label: 'Fee Type', type: 'text' as const },
    { key: 'amount', label: 'Amount ($)', type: 'number' as const },
    { key: 'program', label: 'Program', type: 'text' as const },
    { key: 'isRequired', label: 'Required', type: 'boolean' as const },
  ];

  const loadConfigurations = async () => {
    setIsLoading(true);
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { data, error } = await supabase
        .from('configuration_metadata')
        .select('*')
        .eq('category', 'applicant-management')
        .eq('user_id', user.user.id);

      if (error) throw error;
      setConfigs(data || []);
    } catch (error) {
      console.error('Error loading configurations:', error);
      toast({
        title: "Error",
        description: "Failed to load applicant management configurations.",
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
          category: 'applicant-management',
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
      <div className="flex items-center gap-3">
        <UserCheck className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Applicant Management Configuration</h1>
          <p className="text-muted-foreground">
            Configure application processes, document requirements, payment settings, and decision criteria.
          </p>
        </div>
      </div>

      <Tabs defaultValue="process" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="process" className="flex items-center gap-2">
            <UserCheck className="h-4 w-4" />
            Process
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Documents
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Payment
          </TabsTrigger>
          <TabsTrigger value="decisions" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Decisions
          </TabsTrigger>
          <TabsTrigger value="routing" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Routing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="process" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Application Process Settings</CardTitle>
              <CardDescription>
                Configure different application types and their processing requirements.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UniversalCRUDTable
                title="Application Types"
                description="Manage different application workflows"
                data={applicationTypes}
                columns={applicationColumns}
                onAdd={() => console.log('Add application type')}
                onEdit={(item) => console.log('Edit application type:', item)}
                onDelete={(item) => console.log('Delete application type:', item)}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Document Requirements</CardTitle>
              <CardDescription>
                Configure required documents for different programs and application types.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UniversalCRUDTable
                title="Document Requirements"
                description="Manage document submission requirements"
                data={documentRequirements}
                columns={documentColumns}
                onAdd={() => console.log('Add document requirement')}
                onEdit={(item) => console.log('Edit document requirement:', item)}
                onDelete={(item) => console.log('Delete document requirement:', item)}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Configuration</CardTitle>
              <CardDescription>
                Configure application fees and payment processing settings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UniversalCRUDTable
                title="Payment Settings"
                description="Manage application fees and payment options"
                data={paymentSettings}
                columns={paymentColumns}
                onAdd={() => console.log('Add payment setting')}
                onEdit={(item) => console.log('Edit payment setting:', item)}
                onDelete={(item) => console.log('Delete payment setting:', item)}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="decisions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Decision Management</CardTitle>
              <CardDescription>
                Configure decision criteria and automated decision rules.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UniversalCRUDTable
                title="Decision Criteria"
                description="Manage automated decision-making criteria"
                data={decisionCriteria}
                columns={decisionColumns}
                onAdd={() => console.log('Add decision criteria')}
                onEdit={(item) => console.log('Edit decision criteria:', item)}
                onDelete={(item) => console.log('Delete decision criteria:', item)}
              />
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Decision Workflow Settings</CardTitle>
              <CardDescription>
                Configure automated decision workflows and notification settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="auto-approval">Enable Auto-Approval</Label>
                  <Switch id="auto-approval" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="approval-threshold">Auto-Approval Score Threshold</Label>
                  <Input id="approval-threshold" type="number" placeholder="85" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rejection-threshold">Auto-Rejection Score Threshold</Label>
                  <Input id="rejection-threshold" type="number" placeholder="50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="review-queue">Send to Review Queue</Label>
                  <Switch id="review-queue" />
                </div>
              </div>
              <Button onClick={() => handleSaveConfiguration('decision-workflow', {}, 'Decision workflow configuration')}>
                Save Decision Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="routing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Applicant Routing & Assignment</CardTitle>
              <CardDescription>
                Configure how applicants are routed and assigned to reviewers.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="assignment-method">Assignment Method</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select assignment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="round-robin">Round Robin</SelectItem>
                      <SelectItem value="load-balanced">Load Balanced</SelectItem>
                      <SelectItem value="skill-based">Skill Based</SelectItem>
                      <SelectItem value="manual">Manual Assignment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-assignments">Max Assignments per Reviewer</Label>
                  <Input id="max-assignments" type="number" placeholder="10" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority-routing">Priority-Based Routing</Label>
                  <Switch id="priority-routing" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="escalation-enabled">Enable Escalation</Label>
                  <Switch id="escalation-enabled" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="escalation-rules">Escalation Rules</Label>
                <Textarea
                  id="escalation-rules"
                  placeholder="Define when applications should be escalated (e.g., high priority, overdue reviews, etc.)"
                  rows={3}
                />
              </div>
              <Button onClick={() => handleSaveConfiguration('routing-settings', {}, 'Applicant routing configuration')}>
                Save Routing Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};