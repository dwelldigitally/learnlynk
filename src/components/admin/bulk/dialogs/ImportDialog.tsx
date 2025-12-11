import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { LeadService } from '@/services/leadService';
import { LeadSource } from '@/types/lead';
import { Download, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function ImportDialog({ open, onOpenChange, onSuccess }: ImportDialogProps) {
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [importResults, setImportResults] = useState<{
    total: number;
    success: number;
    skipped: number;
    errors: string[];
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

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
      const results = { total: dataLines.length, success: 0, skipped: 0, errors: [] as string[] };
      
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

          const { data, error } = await LeadService.createLead(lead);
          
          if (error?.code === 'DUPLICATE_LEAD') {
            results.skipped++;
            results.errors.push(`Row ${i + 2}: Duplicate lead (${leadData.email || leadData.phone})`);
          } else if (error) {
            results.errors.push(`Row ${i + 2}: ${error.message}`);
          } else {
            results.success++;
          }
        } catch (error) {
          results.errors.push(`Row ${i + 2}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }

        setProgress(((i + 1) / dataLines.length) * 100);
      }

      setImportResults(results);
      if (results.success > 0) {
        onSuccess();
      }
      
      toast({
        title: 'Import Complete',
        description: `Imported ${results.success} leads${results.skipped > 0 ? `, ${results.skipped} duplicates skipped` : ''}`
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Import Leads from CSV</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
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
            <div className="space-y-3">
              <div className="text-sm font-medium">Import Results:</div>
              <div className="text-sm space-y-1">
                <div>Total rows processed: {importResults.total}</div>
                <div className="text-green-600">Successfully imported: {importResults.success}</div>
                {importResults.skipped > 0 && (
                  <div className="text-amber-600 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    Duplicates skipped: {importResults.skipped}
                  </div>
                )}
                {importResults.errors.length > 0 && (
                  <div className="text-destructive">
                    Errors: {importResults.errors.length - importResults.skipped}
                    <details className="mt-1">
                      <summary className="cursor-pointer">View details</summary>
                      <ul className="list-disc list-inside mt-1 space-y-1 max-h-32 overflow-y-auto">
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
              
              {importResults.skipped > 0 && (
                <Alert className="bg-amber-500/10 border-amber-500/20">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  <AlertDescription className="text-sm">
                    {importResults.skipped} duplicate lead(s) were skipped based on your duplicate prevention settings.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}