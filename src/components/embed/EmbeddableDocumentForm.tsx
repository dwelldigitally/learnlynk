import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface EmbeddableDocumentFormProps {
  onSuccess?: (data: { accessToken: string; portalUrl: string }) => void;
  customStyles?: React.CSSProperties;
  embedConfig?: {
    title?: string;
    description?: string;
    submitButtonText?: string;
    successMessage?: string;
  };
}

const documentTypes = [
  { value: 'passport', label: 'Passport' },
  { value: 'transcript', label: 'Academic Transcript' },
  { value: 'diploma', label: 'Diploma/Certificate' },
  { value: 'english_test', label: 'English Test Results' },
  { value: 'personal_statement', label: 'Personal Statement' },
  { value: 'recommendation_letter', label: 'Recommendation Letter' },
  { value: 'financial_statement', label: 'Financial Statement' },
  { value: 'cv_resume', label: 'CV/Resume' },
  { value: 'other', label: 'Other Document' }
];

export default function EmbeddableDocumentForm({ 
  onSuccess, 
  customStyles, 
  embedConfig 
}: EmbeddableDocumentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Form data state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: '',
    programInterest: '',
    documentType: '',
    notes: '',
    file: null as File | null
  });

  const [dragActive, setDragActive] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf' || file.size <= 10 * 1024 * 1024) {
        setFormData(prev => ({ ...prev, file }));
      } else {
        toast({
          title: "Invalid File",
          description: "Please select a PDF file under 10MB.",
          variant: "destructive"
        });
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf' || file.size <= 10 * 1024 * 1024) {
        setFormData(prev => ({ ...prev, file }));
      } else {
        toast({
          title: "Invalid File",
          description: "Please select a PDF file under 10MB.",
          variant: "destructive"
        });
      }
    }
  };

  const validateForm = () => {
    const required = ['firstName', 'lastName', 'email', 'documentType'];
    for (const field of required) {
      if (!formData[field as keyof typeof formData]) {
        setErrorMessage(`Please fill in all required fields.`);
        return false;
      }
    }

    if (!formData.file) {
      setErrorMessage('Please select a document to upload.');
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMessage('Please enter a valid email address.');
      return false;
    }

    return true;
  };

  const simulateProgress = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + Math.random() * 15;
      });
    }, 200);
    return interval;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setSubmissionStatus('error');
      return;
    }

    setIsSubmitting(true);
    setSubmissionStatus('uploading');
    setErrorMessage('');
    
    const progressInterval = simulateProgress();

    try {
      // Create FormData for file upload
      const submissionData = new FormData();
      submissionData.append('firstName', formData.firstName);
      submissionData.append('lastName', formData.lastName);
      submissionData.append('email', formData.email);
      submissionData.append('phone', formData.phone);
      submissionData.append('country', formData.country);
      submissionData.append('programInterest', formData.programInterest);
      submissionData.append('documentType', formData.documentType);
      submissionData.append('notes', formData.notes);
      if (formData.file) {
        submissionData.append('document', formData.file);
      }

      // Submit to edge function
      const { data, error } = await supabase.functions.invoke('submit-document-form', {
        body: submissionData
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (error) {
        throw error;
      }

      if (data.success) {
        setSubmissionStatus('success');
        
        // Call success callback if provided
        if (onSuccess) {
          onSuccess({
            accessToken: data.accessToken,
            portalUrl: data.portalUrl
          });
        } else {
          // Auto-redirect to portal after 3 seconds
          setTimeout(() => {
            window.location.href = data.portalUrl;
          }, 3000);
        }
      } else {
        throw new Error(data.message || 'Submission failed');
      }

    } catch (error) {
      console.error('Submission error:', error);
      clearInterval(progressInterval);
      setSubmissionStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'An error occurred during submission');
      setUploadProgress(0);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submissionStatus === 'success') {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center p-8"
        style={customStyles}
      >
        <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 className="w-8 h-8 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          {embedConfig?.successMessage || 'Document Submitted Successfully!'}
        </h2>
        <p className="text-muted-foreground mb-6">
          Your document has been uploaded and your student portal access has been created. 
          You will be redirected to your portal shortly.
        </p>
        <div className="flex items-center justify-center gap-2 text-primary">
          <Clock className="w-4 h-4" />
          <span className="text-sm">Redirecting to your portal...</span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto p-6 space-y-6"
      style={customStyles}
    >
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground">
          {embedConfig?.title || 'Submit Your Documents'}
        </h1>
        <p className="text-muted-foreground mt-2">
          {embedConfig?.description || 'Upload your application documents and get instant access to your student portal'}
        </p>
      </div>

      {submissionStatus === 'error' && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="programInterest">Program of Interest</Label>
              <Input
                id="programInterest"
                value={formData.programInterest}
                onChange={(e) => handleInputChange('programInterest', e.target.value)}
                placeholder="e.g., Bachelor of Computer Science"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Document Upload
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="documentType">Document Type *</Label>
              <Select value={formData.documentType} onValueChange={(value) => handleInputChange('documentType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  {documentTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Upload Document (PDF only, max 10MB) *</Label>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  dragActive 
                    ? 'border-primary bg-primary/10' 
                    : 'border-muted-foreground/25 hover:border-primary/50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {formData.file ? (
                  <div className="space-y-2">
                    <FileText className="w-12 h-12 text-primary mx-auto" />
                    <p className="font-medium">{formData.file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(formData.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-12 h-12 text-muted-foreground mx-auto" />
                    <p className="text-muted-foreground">
                      Drag and drop your document here, or click to browse
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Any additional information about your document..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {submissionStatus === 'uploading' && (
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading document...</span>
                  <span>{Math.round(uploadProgress)}%</span>
                </div>
                <Progress value={uploadProgress} className="w-full" />
              </div>
            </CardContent>
          </Card>
        )}

        <Button 
          type="submit" 
          className="w-full" 
          disabled={isSubmitting}
          size="lg"
        >
          {isSubmitting 
            ? 'Submitting...' 
            : embedConfig?.submitButtonText || 'Submit Document & Access Portal'
          }
        </Button>
      </form>
    </motion.div>
  );
}