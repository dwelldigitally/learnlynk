import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { BasicEventInfoStep } from "./BasicEventInfoStep";
import { EventDateTimeStep } from "./EventDateTimeStep";
import { EventMediaStep } from "./EventMediaStep";
import { EventTicketingStep } from "./EventTicketingStep";
import { EventRegistrationStep } from "./EventRegistrationStep";
import { EventPublishStep } from "./EventPublishStep";

export interface EventData {
  // Basic Info
  title: string;
  description: string;
  category: string;
  eventType: "in-person" | "virtual" | "hybrid";
  venue: {
    name: string;
    address: string;
    capacity: number;
    coordinates?: { lat: number; lng: number };
  };
  
  // Date & Time
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  timezone: string;
  isRecurring: boolean;
  registrationDeadline: string;
  
  // Media
  bannerImage?: File | string;
  galleryImages: (File | string)[];
  eventLogo?: File | string;
  colorTheme: string;
  
  // Ticketing
  ticketTypes: TicketType[];
  maxCapacity: number;
  
  // Registration
  registrationForm: RegistrationField[];
  requiresApproval: boolean;
  allowWaitlist: boolean;
  
  // Publishing
  isPublic: boolean;
  allowSocialSharing: boolean;
  seoDescription: string;
  tags: string[];
}

export interface TicketType {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  maxQuantity: number;
  salesStart: string;
  salesEnd: string;
  isFree: boolean;
}

export interface RegistrationField {
  id: string;
  label: string;
  type: "text" | "email" | "phone" | "select" | "textarea" | "checkbox";
  required: boolean;
  options?: string[];
}

const steps = [
  { id: 1, title: "Basic Information", description: "Event details and venue" },
  { id: 2, title: "Date & Time", description: "Schedule and timing" },
  { id: 3, title: "Media & Branding", description: "Images and theme" },
  { id: 4, title: "Ticketing", description: "Ticket types and pricing" },
  { id: 5, title: "Registration", description: "Attendee form and settings" },
  { id: 6, title: "Publish", description: "Review and publish" },
];

interface EventWizardProps {
  onClose: () => void;
  onSave: (eventData: EventData) => void;
  editingEvent?: Partial<EventData>;
}

export const EventWizard: React.FC<EventWizardProps> = ({ onClose, onSave, editingEvent }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [eventData, setEventData] = useState<EventData>({
    title: "",
    description: "",
    category: "",
    eventType: "in-person",
    venue: {
      name: "",
      address: "",
      capacity: 0,
    },
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    timezone: "UTC",
    isRecurring: false,
    registrationDeadline: "",
    galleryImages: [],
    colorTheme: "#3b82f6",
    ticketTypes: [
      {
        id: "1",
        name: "General Admission",
        description: "Standard entry ticket",
        price: 0,
        currency: "USD",
        maxQuantity: 100,
        salesStart: "",
        salesEnd: "",
        isFree: true,
      }
    ],
    maxCapacity: 100,
    registrationForm: [
      { id: "1", label: "Full Name", type: "text", required: true },
      { id: "2", label: "Email", type: "email", required: true },
      { id: "3", label: "Phone", type: "phone", required: false },
    ],
    requiresApproval: false,
    allowWaitlist: true,
    isPublic: true,
    allowSocialSharing: true,
    seoDescription: "",
    tags: [],
    ...editingEvent,
  });

  const updateEventData = (updates: Partial<EventData>) => {
    setEventData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = () => {
    onSave(eventData);
    onClose();
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <BasicEventInfoStep data={eventData} onUpdate={updateEventData} />;
      case 2:
        return <EventDateTimeStep data={eventData} onUpdate={updateEventData} />;
      case 3:
        return <EventMediaStep data={eventData} onUpdate={updateEventData} />;
      case 4:
        return <EventTicketingStep data={eventData} onUpdate={updateEventData} />;
      case 5:
        return <EventRegistrationStep data={eventData} onUpdate={updateEventData} />;
      case 6:
        return <EventPublishStep data={eventData} onUpdate={updateEventData} />;
      default:
        return null;
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return eventData.title && eventData.description && eventData.venue.name;
      case 2:
        return eventData.startDate && eventData.startTime && eventData.endDate && eventData.endTime;
      case 3:
        return true; // Media is optional
      case 4:
        return eventData.ticketTypes.length > 0;
      case 5:
        return eventData.registrationForm.length > 0;
      case 6:
        return true;
      default:
        return false;
    }
  };

  const progress = (currentStep / steps.length) * 100;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle>Create New Event</CardTitle>
            <Button variant="outline" onClick={onClose}>Cancel</Button>
          </div>
          <div className="space-y-2">
            <Progress value={progress} className="w-full" />
            <div className="flex justify-between text-sm text-muted-foreground">
              {steps.map((step) => (
                <div key={step.id} className="flex items-center space-x-1">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                      step.id < currentStep
                        ? "bg-primary text-primary-foreground"
                        : step.id === currentStep
                        ? "bg-primary/20 text-primary border-2 border-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {step.id < currentStep ? <Check className="w-3 h-3" /> : step.id}
                  </div>
                  <span className={step.id === currentStep ? "font-medium" : ""}>
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="overflow-y-auto max-h-[60vh] p-6">
          {renderStep()}
        </CardContent>
        
        <div className="border-t p-6 flex justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </Button>
          
          <div className="flex space-x-2">
            {currentStep === steps.length ? (
              <Button onClick={handleSave} className="flex items-center space-x-2">
                <Check className="w-4 h-4" />
                <span>Create Event</span>
              </Button>
            ) : (
              <Button
                onClick={nextStep}
                disabled={!isStepValid()}
                className="flex items-center space-x-2"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};