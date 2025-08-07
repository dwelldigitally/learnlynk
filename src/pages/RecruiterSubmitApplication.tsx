import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ArrowRight, FileText, Upload, User, GraduationCap, Calendar, MessageSquare } from "lucide-react";
import { RecruiterService } from "@/services/recruiterService";
import type { StudentApplicationFormData } from "@/types/recruiter";
import { toast } from "sonner";

const steps = [
  { id: 1, title: "Student Information", icon: User },
  { id: 2, title: "Program Selection", icon: GraduationCap },
  { id: 3, title: "Documents & Notes", icon: FileText },
  { id: 4, title: "Review & Submit", icon: MessageSquare },
];

const programs = [
  "Computer Science",
  "Business Administration", 
  "Engineering",
  "Medicine",
  "Nursing",
  "Law",
  "Education",
  "Psychology",
  "Marketing",
  "Finance"
];

export default function RecruiterSubmitApplication() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<StudentApplicationFormData>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    date_of_birth: "",
    nationality: "",
    program: "",
    intake_date: "",
    notes_to_registrar: "",
    documents: [],
  });
  const [submitting, setSubmitting] = useState(false);

  const updateFormData = (field: keyof StudentApplicationFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    updateFormData('documents', [...formData.documents, ...files]);
  };

  const removeDocument = (index: number) => {
    const newDocs = formData.documents.filter((_, i) => i !== index);
    updateFormData('documents', newDocs);
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return formData.first_name && formData.last_name && formData.email;
      case 2:
        return formData.program;
      case 3:
        return true; // Documents are optional
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      await RecruiterService.createRecruiterApplication(formData);
      toast.success("Application submitted successfully!");
      navigate('/recruiter/dashboard');
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name *</Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => updateFormData('first_name', e.target.value)}
                  placeholder="Enter first name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name *</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => updateFormData('last_name', e.target.value)}
                  placeholder="Enter last name"
                />
              </div>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  placeholder="student@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => updateFormData('phone', e.target.value)}
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="date_of_birth">Date of Birth</Label>
                <Input
                  id="date_of_birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) => updateFormData('date_of_birth', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nationality">Nationality</Label>
                <Input
                  id="nationality"
                  value={formData.nationality}
                  onChange={(e) => updateFormData('nationality', e.target.value)}
                  placeholder="e.g., American, Canadian"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="program">Program of Interest *</Label>
              <Select value={formData.program} onValueChange={(value) => updateFormData('program', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a program" />
                </SelectTrigger>
                <SelectContent>
                  {programs.map((program) => (
                    <SelectItem key={program} value={program}>
                      {program}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="intake_date">Preferred Intake Date</Label>
              <Input
                id="intake_date"
                type="date"
                value={formData.intake_date}
                onChange={(e) => updateFormData('intake_date', e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Select the semester/term when the student would like to start
              </p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                  <div className="mt-4">
                    <Label htmlFor="document-upload" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-semibold">Upload Documents</span>
                      <span className="mt-1 block text-xs text-muted-foreground">
                        PDF, JPG, PNG up to 10MB each
                      </span>
                    </Label>
                    <Input
                      id="document-upload"
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>
              
              {formData.documents.length > 0 && (
                <div className="space-y-2">
                  <Label>Uploaded Documents</Label>
                  <div className="space-y-2">
                    {formData.documents.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{file.name}</span>
                          <span className="text-xs text-muted-foreground">
                            ({(file.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeDocument(index)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes to Registrar</Label>
              <Textarea
                id="notes"
                value={formData.notes_to_registrar}
                onChange={(e) => updateFormData('notes_to_registrar', e.target.value)}
                placeholder="Add any special notes or requirements for the registrar team..."
                rows={4}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="rounded-lg border p-6 space-y-4">
              <h3 className="text-lg font-semibold">Application Summary</h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-muted-foreground">Student Name</Label>
                  <p className="font-medium">{formData.first_name} {formData.last_name}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  <p className="font-medium">{formData.email}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Program</Label>
                  <p className="font-medium">{formData.program}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Intake Date</Label>
                  <p className="font-medium">{formData.intake_date || 'Not specified'}</p>
                </div>
              </div>
              
              {formData.documents.length > 0 && (
                <div>
                  <Label className="text-muted-foreground">Documents ({formData.documents.length})</Label>
                  <div className="mt-1 space-y-1">
                    {formData.documents.map((file, index) => (
                      <p key={index} className="text-sm">{file.name}</p>
                    ))}
                  </div>
                </div>
              )}
              
              {formData.notes_to_registrar && (
                <div>
                  <Label className="text-muted-foreground">Notes to Registrar</Label>
                  <p className="text-sm mt-1">{formData.notes_to_registrar}</p>
                </div>
              )}
            </div>
            
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <p className="text-sm">
                <strong>What happens next?</strong><br />
                Once submitted, your application will be reviewed by our registrar team. 
                You'll receive updates via email and can track progress in your dashboard.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/recruiter/dashboard')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Submit New Application</h1>
          <p className="text-muted-foreground">
            Help a student apply to our programs by filling out their information.
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          
          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    isCompleted
                      ? 'bg-primary border-primary text-primary-foreground'
                      : isActive
                      ? 'border-primary text-primary'
                      : 'border-muted-foreground text-muted-foreground'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="text-center">
                  <p className={`text-sm font-medium ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                    {step.title}
                  </p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-4 ${
                  currentStep > step.id ? 'bg-primary' : 'bg-muted-foreground/25'
                }`} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Form Content */}
      <Card>
        <CardHeader>
          <CardTitle>
            Step {currentStep}: {steps[currentStep - 1].title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderStepContent()}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        
        <div className="flex gap-2">
          {currentStep < steps.length ? (
            <Button
              onClick={() => setCurrentStep(prev => prev + 1)}
              disabled={!canProceedToNext()}
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!canProceedToNext() || submitting}
            >
              {submitting ? "Submitting..." : "Submit Application"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}