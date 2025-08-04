import { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useStudentMutations } from '@/services/studentService';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface ImportStudentsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ImportError {
  row: number;
  field: string;
  message: string;
}

export function ImportStudentsModal({ open, onOpenChange }: ImportStudentsModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errors, setErrors] = useState<ImportError[]>([]);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [importComplete, setImportComplete] = useState(false);

  const { importStudents } = useStudentMutations();

  const parseCSV = useCallback((text: string) => {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const row: any = {};
      
      headers.forEach((header, index) => {
        const value = values[index] || '';
        
        // Map CSV headers to database fields
        switch (header) {
          case 'first name':
          case 'firstname':
            row.first_name = value;
            break;
          case 'last name':
          case 'lastname':
            row.last_name = value;
            break;
          case 'email':
            row.email = value;
            break;
          case 'phone':
            row.phone = value;
            break;
          case 'program':
            row.program = value;
            break;
          case 'stage':
            row.stage = value || 'LEAD_FORM';
            break;
          case 'risk level':
          case 'risklevel':
            row.risk_level = value || 'low';
            break;
          case 'country':
            row.country = value;
            break;
          case 'city':
            row.city = value;
            break;
          case 'state':
            row.state = value;
            break;
          default:
            if (header && value) {
              row[header] = value;
            }
        }
      });

      // Set defaults
      row.progress = 0;
      row.acceptance_likelihood = 0;
      row.lead_score = 0;
      
      data.push(row);
    }

    return data;
  }, []);

  const validateData = useCallback((data: any[]) => {
    const validationErrors: ImportError[] = [];
    
    data.forEach((row, index) => {
      if (!row.first_name) {
        validationErrors.push({
          row: index + 1,
          field: 'first_name',
          message: 'First name is required'
        });
      }
      
      if (!row.last_name) {
        validationErrors.push({
          row: index + 1,
          field: 'last_name',
          message: 'Last name is required'
        });
      }
      
      if (!row.email) {
        validationErrors.push({
          row: index + 1,
          field: 'email',
          message: 'Email is required'
        });
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) {
        validationErrors.push({
          row: index + 1,
          field: 'email',
          message: 'Invalid email format'
        });
      }
      
      if (!row.program) {
        validationErrors.push({
          row: index + 1,
          field: 'program',
          message: 'Program is required'
        });
      }
    });

    return validationErrors;
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith('.csv')) {
      toast.error('Please select a CSV file');
      return;
    }

    setFile(selectedFile);
    setErrors([]);
    setPreviewData([]);
    setImportComplete(false);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const data = parseCSV(text);
      const validationErrors = validateData(data);
      
      setPreviewData(data.slice(0, 5)); // Show first 5 rows as preview
      setErrors(validationErrors);
    };
    
    reader.readAsText(selectedFile);
  }, [parseCSV, validateData]);

  const handleImport = async () => {
    if (!file || errors.length > 0) return;

    setImporting(true);
    setProgress(0);

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const text = event.target?.result as string;
        const data = parseCSV(text);
        
        // Simulate progress
        const interval = setInterval(() => {
          setProgress(prev => Math.min(prev + 10, 90));
        }, 200);

        await importStudents.mutateAsync(data);
        
        clearInterval(interval);
        setProgress(100);
        setImportComplete(true);
        toast.success(`Successfully imported ${data.length} students`);
      };
      
      reader.readAsText(file);
    } catch (error) {
      toast.error('Failed to import students');
      console.error('Import error:', error);
    } finally {
      setImporting(false);
    }
  };

  const resetModal = () => {
    setFile(null);
    setErrors([]);
    setPreviewData([]);
    setImportComplete(false);
    setProgress(0);
    setImporting(false);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) resetModal();
      onOpenChange(isOpen);
    }}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Import Students</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {!importComplete ? (
            <>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <div className="space-y-2">
                  <Label htmlFor="file-upload" className="cursor-pointer">
                    <span className="text-sm font-medium">Choose CSV file to upload</span>
                    <Input
                      id="file-upload"
                      type="file"
                      accept=".csv"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    CSV should include columns: first_name, last_name, email, program
                  </p>
                </div>
              </div>

              {file && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span className="text-sm font-medium">{file.name}</span>
                  </div>

                  {errors.length > 0 && (
                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="h-4 w-4 text-destructive" />
                        <span className="text-sm font-medium text-destructive">
                          {errors.length} validation error(s) found
                        </span>
                      </div>
                      <div className="max-h-32 overflow-y-auto space-y-1">
                        {errors.slice(0, 10).map((error, index) => (
                          <p key={index} className="text-xs text-destructive">
                            Row {error.row}, {error.field}: {error.message}
                          </p>
                        ))}
                        {errors.length > 10 && (
                          <p className="text-xs text-destructive">
                            ... and {errors.length - 10} more errors
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {previewData.length > 0 && errors.length === 0 && (
                    <div className="border rounded-lg p-4">
                      <h4 className="text-sm font-medium mb-2">Preview (first 5 rows)</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left p-1">Name</th>
                              <th className="text-left p-1">Email</th>
                              <th className="text-left p-1">Program</th>
                              <th className="text-left p-1">Stage</th>
                            </tr>
                          </thead>
                          <tbody>
                            {previewData.map((row, index) => (
                              <tr key={index} className="border-b">
                                <td className="p-1">{row.first_name} {row.last_name}</td>
                                <td className="p-1">{row.email}</td>
                                <td className="p-1">{row.program}</td>
                                <td className="p-1">{row.stage}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {importing && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Importing students...</span>
                        <span>{progress}%</span>
                      </div>
                      <Progress value={progress} />
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
              <h3 className="text-lg font-medium mb-2">Import Completed!</h3>
              <p className="text-muted-foreground">
                Students have been successfully imported to your database.
              </p>
            </div>
          )}

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {importComplete ? 'Close' : 'Cancel'}
            </Button>
            {!importComplete && (
              <Button 
                onClick={handleImport}
                disabled={!file || errors.length > 0 || importing}
              >
                {importing ? 'Importing...' : 'Import Students'}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}