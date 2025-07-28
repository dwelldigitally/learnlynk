import React, { useState, useRef } from "react";
import { Upload, FileText, X, CheckCircle, AlertCircle, MessageSquare, Bell } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface UploadedDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: Date;
  status: 'pending' | 'approved' | 'rejected';
  requirementId: string;
}

interface DocumentRequirement {
  id: string;
  name: string;
  description: string;
  required: boolean;
  acceptedFormats: string[];
  maxSize: number;
  uploaded?: UploadedDocument;
}

interface Message {
  id: string;
  from: string;
  subject: string;
  content: string;
  timestamp: Date;
  read: boolean;
  type: 'message' | 'notification';
}

interface AdmissionFormProps {
  onBack: () => void;
}

const AdmissionForm: React.FC<AdmissionFormProps> = ({ onBack }) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedRequirement, setSelectedRequirement] = useState<string | null>(null);
  const [uploadingTo, setUploadingTo] = useState<string | null>(null);
  const [dateOfBirth, setDateOfBirth] = useState<Date>();
  const [showMessages, setShowMessages] = useState(false);

  // Form data state
  const [formData, setFormData] = useState({
    firstName: "Tushar",
    lastName: "Malhotra",
    email: "Tushar.Malhotra@student.wcc.ca",
    phone: "",
    address: "",
    city: "",
    province: "",
    postalCode: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelation: "",
    previousEducation: "",
    workExperience: "",
    whyThisProgram: ""
  });

  // Document requirements
  const [requirements, setRequirements] = useState<DocumentRequirement[]>([
    {
      id: "transcripts",
      name: "Official Transcripts",
      description: "High school or post-secondary transcripts",
      required: true,
      acceptedFormats: ["PDF", "JPG", "PNG"],
      maxSize: 10
    },
    {
      id: "photo-id",
      name: "Photo Identification",
      description: "Government-issued photo ID (passport, driver's license)",
      required: true,
      acceptedFormats: ["PDF", "JPG", "PNG"],
      maxSize: 5
    },
    {
      id: "immunization",
      name: "Immunization Records",
      description: "Complete immunization history including COVID-19",
      required: true,
      acceptedFormats: ["PDF", "JPG", "PNG"],
      maxSize: 5
    },
    {
      id: "criminal-check",
      name: "Criminal Record Check",
      description: "Recent criminal background check (within 6 months)",
      required: true,
      acceptedFormats: ["PDF"],
      maxSize: 5
    },
    {
      id: "first-aid",
      name: "First Aid Certificate",
      description: "Valid CPR and First Aid certification (if available)",
      required: false,
      acceptedFormats: ["PDF", "JPG", "PNG"],
      maxSize: 5
    }
  ]);

  // Messages and notifications
  const [messages] = useState<Message[]>([
    {
      id: "1",
      from: "Admissions Office",
      subject: "Application Received",
      content: "We have received your application for the Health Care Assistant program. We will review your documents and get back to you within 5-7 business days.",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      read: true,
      type: "notification"
    },
    {
      id: "2",
      from: "Nicole Ye - Admissions Advisor",
      subject: "Document Review Update",
      content: "Hello Tushar, I've reviewed your transcripts and they look good. However, we still need your immunization records to complete your application. Please upload them at your earliest convenience.",
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      read: false,
      type: "message"
    },
    {
      id: "3",
      from: "System Notification",
      subject: "Application Deadline Reminder",
      content: "Reminder: The application deadline for the March 2025 intake is February 15, 2025. Please ensure all required documents are submitted before this date.",
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      read: false,
      type: "notification"
    }
  ]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (requirementId: string, files: FileList | null) => {
    if (!files || files.length === 0) return;

    const requirement = requirements.find(req => req.id === requirementId);
    if (!requirement) return;

    const file = files[0];
    const fileExtension = file.name.split('.').pop()?.toUpperCase();
    
    if (!requirement.acceptedFormats.includes(fileExtension || '')) {
      toast({
        title: "Invalid file format",
        description: `Please upload files in one of these formats: ${requirement.acceptedFormats.join(', ')}`,
        variant: "destructive"
      });
      return;
    }

    if (file.size > requirement.maxSize * 1024 * 1024) {
      toast({
        title: "File too large",
        description: `Maximum file size is ${requirement.maxSize}MB`,
        variant: "destructive"
      });
      return;
    }

    setUploadingTo(requirementId);
    
    // Simulate upload
    setTimeout(() => {
      const uploadedDoc: UploadedDocument = {
        id: Date.now().toString(),
        name: file.name,
        type: fileExtension || '',
        size: file.size,
        uploadDate: new Date(),
        status: 'pending',
        requirementId
      };

      setRequirements(prev => prev.map(req => 
        req.id === requirementId 
          ? { ...req, uploaded: uploadedDoc }
          : req
      ));

      setUploadingTo(null);
      toast({
        title: "Document uploaded successfully",
        description: `${file.name} has been uploaded and is under review`
      });
    }, 2000);
  };

  const removeDocument = (requirementId: string) => {
    setRequirements(prev => prev.map(req => 
      req.id === requirementId 
        ? { ...req, uploaded: undefined }
        : req
    ));
    
    toast({
      title: "Document removed",
      description: "The document has been removed from your application"
    });
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const submitApplication = () => {
    toast({
      title: "Application submitted successfully!",
      description: "We will review your application and contact you within 5-7 business days."
    });
    onBack();
  };

  const unreadCount = messages.filter(msg => !msg.read).length;

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Personal Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            placeholder="First Name"
          />
        </div>
        
        <div>
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            placeholder="Last Name"
          />
        </div>
        
        <div>
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="Email Address"
          />
        </div>
        
        <div>
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="(123) 456-7890"
          />
        </div>
        
        <div>
          <Label>Date of Birth *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !dateOfBirth && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateOfBirth ? format(dateOfBirth, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateOfBirth}
                onSelect={setDateOfBirth}
                disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <div className="space-y-4">
        <h4 className="font-medium">Address Information</h4>
        <div>
          <Label htmlFor="address">Street Address *</Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            placeholder="Street Address"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="city">City *</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              placeholder="City"
            />
          </div>
          
          <div>
            <Label htmlFor="province">Province *</Label>
            <Input
              id="province"
              value={formData.province}
              onChange={(e) => handleInputChange('province', e.target.value)}
              placeholder="Province"
            />
          </div>
          
          <div>
            <Label htmlFor="postalCode">Postal Code *</Label>
            <Input
              id="postalCode"
              value={formData.postalCode}
              onChange={(e) => handleInputChange('postalCode', e.target.value)}
              placeholder="A1A 1A1"
            />
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h4 className="font-medium">Emergency Contact</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="emergencyContactName">Emergency Contact Name *</Label>
            <Input
              id="emergencyContactName"
              value={formData.emergencyContactName}
              onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
              placeholder="Full Name"
            />
          </div>
          
          <div>
            <Label htmlFor="emergencyContactPhone">Emergency Contact Phone *</Label>
            <Input
              id="emergencyContactPhone"
              type="tel"
              value={formData.emergencyContactPhone}
              onChange={(e) => handleInputChange('emergencyContactPhone', e.target.value)}
              placeholder="(123) 456-7890"
            />
          </div>
          
          <div>
            <Label htmlFor="emergencyContactRelation">Relationship *</Label>
            <Input
              id="emergencyContactRelation"
              value={formData.emergencyContactRelation}
              onChange={(e) => handleInputChange('emergencyContactRelation', e.target.value)}
              placeholder="e.g., Parent, Spouse, Sibling"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Educational Background & Experience</h3>
      
      <div>
        <Label htmlFor="previousEducation">Previous Education *</Label>
        <Textarea
          id="previousEducation"
          value={formData.previousEducation}
          onChange={(e) => handleInputChange('previousEducation', e.target.value)}
          placeholder="Describe your educational background, including high school, college, or university education..."
          className="min-h-[100px]"
        />
      </div>
      
      <div>
        <Label htmlFor="workExperience">Work Experience</Label>
        <Textarea
          id="workExperience"
          value={formData.workExperience}
          onChange={(e) => handleInputChange('workExperience', e.target.value)}
          placeholder="Describe your work experience, especially any healthcare-related experience..."
          className="min-h-[100px]"
        />
      </div>
      
      <div>
        <Label htmlFor="whyThisProgram">Why do you want to join this program? *</Label>
        <Textarea
          id="whyThisProgram"
          value={formData.whyThisProgram}
          onChange={(e) => handleInputChange('whyThisProgram', e.target.value)}
          placeholder="Tell us why you're interested in the Health Care Assistant program and your career goals..."
          className="min-h-[120px]"
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Document Upload</h3>
      <p className="text-muted-foreground">
        Please upload the required documents to complete your application.
      </p>
      
      <div className="space-y-4">
        {requirements.map((requirement) => (
          <Card key={requirement.id} className="p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{requirement.name}</h4>
                  {requirement.required && <Badge variant="destructive" className="text-xs">Required</Badge>}
                </div>
                <p className="text-sm text-muted-foreground mt-1">{requirement.description}</p>
                <div className="text-xs text-muted-foreground mt-1">
                  Formats: {requirement.acceptedFormats.join(', ')} • Max size: {requirement.maxSize}MB
                </div>
              </div>
            </div>
            
            {requirement.uploaded ? (
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <div className="font-medium text-green-800">{requirement.uploaded.name}</div>
                    <div className="text-sm text-green-600">
                      {(requirement.uploaded.size / 1024).toFixed(2)} KB • Uploaded {requirement.uploaded.uploadDate.toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => removeDocument(requirement.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <Button
                  onClick={() => {
                    setSelectedRequirement(requirement.id);
                    fileInputRef.current?.click();
                  }}
                  disabled={uploadingTo === requirement.id}
                  variant="outline"
                  className="mb-2"
                >
                  {uploadingTo === requirement.id ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Choose File
                    </>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground">
                  or drag and drop your file here
                </p>
              </div>
            )}
          </Card>
        ))}
      </div>
      
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          All required documents must be uploaded before you can submit your application.
        </AlertDescription>
      </Alert>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Application Form</h2>
        <p className="text-muted-foreground">Health Care Assistant Program</p>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === currentStep
                    ? 'bg-blue-600 text-white'
                    : step < currentStep
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step < currentStep ? <CheckCircle className="w-4 h-4" /> : step}
              </div>
              <span className="text-sm font-medium">
                {step === 1 ? 'Personal Info' : step === 2 ? 'Background' : 'Documents'}
              </span>
              {step < 3 && <div className="w-8 h-px bg-gray-300" />}
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <Card className="p-6">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
          Previous
        </Button>
        
        {currentStep < 3 ? (
          <Button onClick={nextStep}>
            Next
          </Button>
        ) : (
          <Button
            onClick={submitApplication}
            disabled={requirements.filter(req => req.required).some(req => !req.uploaded)}
            className="bg-green-600 hover:bg-green-700"
          >
            Submit Application
          </Button>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={(e) => {
          if (selectedRequirement) {
            handleFileUpload(selectedRequirement, e.target.files);
            e.target.value = '';
          }
        }}
      />
    </div>
  );
};

export default AdmissionForm;