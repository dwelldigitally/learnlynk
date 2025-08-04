import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { LeadService } from '@/services/leadService';
import { Lead, LeadSource, LeadStatus, AssignmentMethod } from '@/types/lead';
import { Upload, Download, Users, UserPlus, RotateCcw } from 'lucide-react';

interface BulkLeadOperationsProps {
  selectedLeads?: Lead[];
  onOperationComplete: () => void;
}

export function BulkLeadOperations({ selectedLeads = [], onOperationComplete }: BulkLeadOperationsProps) {
  const [importing, setImporting] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [importResults, setImportResults] = useState<{
    total: number;
    success: number;
    errors: string[];
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Bulk assignment state
  const [assignmentConfig, setAssignmentConfig] = useState({
    method: 'round_robin' as AssignmentMethod,
    advisors: [] as string[],
    selectedAdvisor: ''
  });

  // Mock advisors - in real app, fetch from database
  const availableAdvisors = [
    { id: 'advisor-1', name: 'Nicole Ye', email: 'nicole@example.com' },
    { id: 'advisor-2', name: 'Sarah Johnson', email: 'sarah@example.com' },
    { id: 'advisor-3', name: 'Mike Chen', email: 'mike@example.com' },
    { id: 'advisor-4', name: 'Emma Wilson', email: 'emma@example.com' }
  ];

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast({
        title: 'Error',
        description: 'Please upload a CSV file',
        variant: 'destructive'
      });
      return;
    }

    setImporting(true);
    setProgress(0);
    setImportResults(null);

    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      
      // Validate required headers
      const requiredHeaders = ['first_name', 'last_name', 'email'];
      const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
      
      if (missingHeaders.length > 0) {
        toast({
          title: 'Error',
          description: `Missing required columns: ${missingHeaders.join(', ')}`,
          variant: 'destructive'
        });
        setImporting(false);
        return;
      }

      const dataLines = lines.slice(1);
      const results = { total: dataLines.length, success: 0, errors: [] as string[] };
      
      for (let i = 0; i < dataLines.length; i++) {
        const values = dataLines[i].split(',').map(v => v.trim().replace(/"/g, ''));
        const leadData: any = {};
        
        headers.forEach((header, index) => {
          leadData[header] = values[index] || '';
        });

        try {
          // Map CSV data to lead format
          const lead = {
            first_name: leadData.first_name,
            last_name: leadData.last_name,
            email: leadData.email,
            phone: leadData.phone || '',
            country: leadData.country || '',
            state: leadData.state || '',
            city: leadData.city || '',
            source: (leadData.source as LeadSource) || 'csv_import',
            source_details: `CSV Import - ${file.name}`,
            program_interest: leadData.program_interest ? 
              leadData.program_interest.split(';').map((p: string) => p.trim()) : [],
            utm_source: leadData.utm_source || '',
            utm_medium: leadData.utm_medium || '',
            utm_campaign: leadData.utm_campaign || '',
            notes: leadData.notes || ''
          };

          await LeadService.createLead(lead);
          results.success++;
        } catch (error) {
          results.errors.push(`Row ${i + 2}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }

        setProgress(((i + 1) / dataLines.length) * 100);
      }

      setImportResults(results);
      onOperationComplete();
      
      toast({
        title: 'Import Complete',
        description: `Successfully imported ${results.success} of ${results.total} leads`
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to process CSV file',
        variant: 'destructive'
      });
    } finally {
      setImporting(false);
      setProgress(0);
    }
  };

  const handleBulkAssignment = async () => {
    if (selectedLeads.length === 0) {
      toast({
        title: 'Error',
        description: 'No leads selected for assignment',
        variant: 'destructive'
      });
      return;
    }

    if (assignmentConfig.method === 'manual' && !assignmentConfig.selectedAdvisor) {
      toast({
        title: 'Error',
        description: 'Please select an advisor for manual assignment',
        variant: 'destructive'
      });
      return;
    }

    if (assignmentConfig.method === 'round_robin' && assignmentConfig.advisors.length === 0) {
      toast({
        title: 'Error',
        description: 'Please select advisors for round robin assignment',
        variant: 'destructive'
      });
      return;
    }

    try {
      setAssigning(true);
      const leadIds = selectedLeads.map(lead => lead.id);
      
      if (assignmentConfig.method === 'round_robin') {
        await LeadService.assignLeadsRoundRobin(leadIds, assignmentConfig.advisors);
      } else {
        // Manual assignment to single advisor
        for (const leadId of leadIds) {
          await LeadService.assignLead({
            lead_id: leadId,
            assigned_to: assignmentConfig.selectedAdvisor,
            assignment_method: 'manual'
          });
        }
      }

      onOperationComplete();
      toast({
        title: 'Success',
        description: `Successfully assigned ${selectedLeads.length} leads`
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to assign leads',
        variant: 'destructive'
      });
    } finally {
      setAssigning(false);
    }
  };

  const handleBulkStatusUpdate = async (newStatus: LeadStatus) => {
    if (selectedLeads.length === 0) {
      toast({
        title: 'Error',
        description: 'No leads selected for status update',
        variant: 'destructive'
      });
      return;
    }

    try {
      for (const lead of selectedLeads) {
        await LeadService.updateLeadStatus(lead.id, newStatus);
      }

      onOperationComplete();
      toast({
        title: 'Success',
        description: `Updated status for ${selectedLeads.length} leads`
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update lead status',
        variant: 'destructive'
      });
    }
  };

  const downloadCSVTemplate = () => {
    const headers = [
      'first_name',
      'last_name', 
      'email',
      'phone',
      'country',
      'state',
      'city',
      'source',
      'program_interest',
      'utm_source',
      'utm_medium',
      'utm_campaign',
      'notes'
    ];
    
    const sampleData = [
      'John',
      'Doe',
      'john.doe@email.com',
      '+1-555-0123',
      'Canada',
      'Ontario',
      'Toronto',
      'web',
      'Health Care Assistant;Aviation',
      'google',
      'cpc',
      'healthcare_campaign',
      'Interested in healthcare programs'
    ];

    const csvContent = [
      headers.join(','),
      sampleData.join(',')
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lead_import_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bulk Operations</h1>
        <p className="text-muted-foreground">Import leads, assign in bulk, and manage multiple leads at once</p>
      </div>

      <Tabs defaultValue="import" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="import">Import Leads</TabsTrigger>
          <TabsTrigger value="assign">Bulk Assignment</TabsTrigger>
          <TabsTrigger value="status">Status Updates</TabsTrigger>
        </TabsList>

        <TabsContent value="import" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                CSV Import
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Button variant="outline" onClick={downloadCSVTemplate}>
                  <Download className="h-4 w-4 mr-2" />
                  Download Template
                </Button>
                <span className="text-sm text-muted-foreground">
                  Download the CSV template to ensure proper formatting
                </span>
              </div>

              <div>
                <Label htmlFor="csv-file">Select CSV File</Label>
                <Input
                  id="csv-file"
                  type="file"
                  accept=".csv"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  disabled={importing}
                />
              </div>

              {importing && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Importing leads...</span>
                    <span className="text-sm">{progress.toFixed(0)}%</span>
                  </div>
                  <Progress value={progress} />
                </div>
              )}

              {importResults && (
                <div className="space-y-2">
                  <div className="text-sm">
                    <strong>Import Results:</strong>
                  </div>
                  <div className="text-sm space-y-1">
                    <div>Total rows processed: {importResults.total}</div>
                    <div className="text-green-600">Successfully imported: {importResults.success}</div>
                    {importResults.errors.length > 0 && (
                      <div className="text-red-600">
                        Errors: {importResults.errors.length}
                        <details className="mt-1">
                          <summary className="cursor-pointer">View errors</summary>
                          <ul className="list-disc list-inside mt-1 space-y-1">
                            {importResults.errors.slice(0, 10).map((error, index) => (
                              <li key={index} className="text-xs">{error}</li>
                            ))}
                            {importResults.errors.length > 10 && (
                              <li className="text-xs">... and {importResults.errors.length - 10} more</li>
                            )}
                          </ul>
                        </details>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assign" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Bulk Assignment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground">
                {selectedLeads.length > 0 
                  ? `${selectedLeads.length} leads selected for assignment`
                  : 'No leads selected. Select leads from the main table to use bulk assignment.'}
              </div>

              <div>
                <Label htmlFor="assignment-method">Assignment Method</Label>
                <Select 
                  value={assignmentConfig.method} 
                  onValueChange={(value) => setAssignmentConfig(prev => ({ ...prev, method: value as AssignmentMethod }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manual">Manual Assignment</SelectItem>
                    <SelectItem value="round_robin">Round Robin</SelectItem>
                    <SelectItem value="ai_based">AI-Based (Coming Soon)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {assignmentConfig.method === 'manual' && (
                <div>
                  <Label htmlFor="advisor">Select Advisor</Label>
                  <Select 
                    value={assignmentConfig.selectedAdvisor}
                    onValueChange={(value) => setAssignmentConfig(prev => ({ ...prev, selectedAdvisor: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose advisor" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableAdvisors.map((advisor) => (
                        <SelectItem key={advisor.id} value={advisor.id}>
                          {advisor.name} ({advisor.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {assignmentConfig.method === 'round_robin' && (
                <div>
                  <Label>Select Advisors for Round Robin</Label>
                  <div className="space-y-2 mt-2">
                    {availableAdvisors.map((advisor) => (
                      <div key={advisor.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={advisor.id}
                          checked={assignmentConfig.advisors.includes(advisor.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setAssignmentConfig(prev => ({
                                ...prev,
                                advisors: [...prev.advisors, advisor.id]
                              }));
                            } else {
                              setAssignmentConfig(prev => ({
                                ...prev,
                                advisors: prev.advisors.filter(id => id !== advisor.id)
                              }));
                            }
                          }}
                        />
                        <Label htmlFor={advisor.id} className="text-sm">
                          {advisor.name} ({advisor.email})
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Button 
                onClick={handleBulkAssignment}
                disabled={assigning || selectedLeads.length === 0}
                className="w-full"
              >
                {assigning ? 'Assigning...' : `Assign ${selectedLeads.length} Leads`}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="status" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RotateCcw className="h-5 w-5" />
                Bulk Status Update
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground">
                {selectedLeads.length > 0 
                  ? `Update status for ${selectedLeads.length} selected leads`
                  : 'No leads selected. Select leads from the main table to update their status.'}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => handleBulkStatusUpdate('contacted')}
                  disabled={selectedLeads.length === 0}
                >
                  Mark as Contacted
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleBulkStatusUpdate('qualified')}
                  disabled={selectedLeads.length === 0}
                >
                  Mark as Qualified
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleBulkStatusUpdate('nurturing')}
                  disabled={selectedLeads.length === 0}
                >
                  Mark as Nurturing
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleBulkStatusUpdate('lost')}
                  disabled={selectedLeads.length === 0}
                >
                  Mark as Lost
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}