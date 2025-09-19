import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Mail, Calendar, MessageCircle } from "lucide-react";

interface SalesAdvisorCardProps {
  advisor?: {
    name: string;
    photo: string;
    title: string;
    phone: string;
    email: string;
    specialties: string[];
  };
}

export function SalesAdvisorCard({ advisor }: SalesAdvisorCardProps) {
  // Default advisor data if none provided
  const defaultAdvisor = {
    name: "Sarah Johnson",
    photo: "https://images.unsplash.com/photo-1494790108755-2616b79dfbbe?w=150&h=150&fit=crop&crop=face",
    title: "Senior Sales Advisor",
    phone: "+1 (555) 123-4567",
    email: "sarah.johnson@university.edu",
    specialties: ["Program Selection", "Financial Aid", "Career Planning"]
  };

  const advisorData = advisor || defaultAdvisor;

  const handleCall = () => {
    window.open(`tel:${advisorData.phone}`, '_self');
  };

  const handleEmail = () => {
    window.open(`mailto:${advisorData.email}`, '_self');
  };

  const handleMessage = () => {
    // This could open a chat interface or messaging system
    console.log("Opening message interface...");
  };

  const handleScheduleAppointment = () => {
    // This could open a calendar booking system
    console.log("Opening appointment scheduler...");
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Your Sales Advisor</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Advisor Profile */}
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
            <img 
              src={advisorData.photo} 
              alt={advisorData.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">{advisorData.name}</h3>
            <p className="text-sm text-muted-foreground">{advisorData.title}</p>
          </div>
        </div>

        {/* Specialties */}
        <div>
          <h4 className="text-sm font-medium text-foreground mb-2">Specialties</h4>
          <div className="flex flex-wrap gap-2">
            {advisorData.specialties.map((specialty, index) => (
              <span 
                key={index}
                className="px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded-md"
              >
                {specialty}
              </span>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground">Contact Information</h4>
          <div className="space-y-1 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <span>{advisorData.phone}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4" />
              <span>{advisorData.email}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleCall}
              className="flex items-center justify-center space-x-2"
            >
              <Phone className="w-4 h-4" />
              <span>Call</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleEmail}
              className="flex items-center justify-center space-x-2"
            >
              <Mail className="w-4 h-4" />
              <span>Email</span>
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleMessage}
              className="flex items-center justify-center space-x-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Message</span>
            </Button>
            <Button 
              size="sm" 
              onClick={handleScheduleAppointment}
              className="flex items-center justify-center space-x-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Schedule</span>
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="pt-4 border-t border-border">
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-2">Need immediate assistance?</p>
            <Button variant="ghost" size="sm" className="text-xs">
              View Availability
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}