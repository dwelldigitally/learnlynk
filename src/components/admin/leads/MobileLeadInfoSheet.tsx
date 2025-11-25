import { Lead } from "@/types/lead";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Calendar,
  Briefcase,
  Target,
  PhoneCall,
  Clock,
  User,
  Bot,
} from "lucide-react";

interface MobileLeadInfoSheetProps {
  lead: Lead;
  children: React.ReactNode;
  onUpdate?: () => void;
}

export function MobileLeadInfoSheet({ lead, children, onUpdate }: MobileLeadInfoSheetProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400";
      case "contacted":
        return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400";
      case "qualified":
        return "bg-green-500/10 text-green-600 dark:text-green-400";
      case "converted":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        {children}
      </DrawerTrigger>
      <DrawerContent className="max-h-[85vh] bg-background">
        <DrawerHeader className="border-b pb-4">
          <DrawerTitle className="text-xl">
            {lead.first_name} {lead.last_name}
          </DrawerTitle>
          <DrawerDescription className="flex items-center gap-2 mt-2">
            <span className="flex items-center gap-1">
              <Target className="h-4 w-4" />
              Score: {lead.lead_score}
            </span>
            <span>•</span>
            <Badge variant="outline" className={getStatusColor(lead.status)}>
              {lead.status}
            </Badge>
          </DrawerDescription>
        </DrawerHeader>

        <ScrollArea className="h-full px-4 pb-6">
          <Accordion type="multiple" defaultValue={["info", "calls"]} className="space-y-2">
            {/* Contact Information */}
            <AccordionItem value="info" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="font-semibold">Contact Information</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Mail className="h-4 w-4 mt-1 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">{lead.email}</p>
                    </div>
                  </div>

                  {lead.phone && (
                    <div className="flex items-start gap-3">
                      <Phone className="h-4 w-4 mt-1 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Phone</p>
                        <p className="text-sm text-muted-foreground">{lead.phone}</p>
                      </div>
                    </div>
                  )}

                  {(lead.city || lead.state || lead.country) && (
                    <div className="flex items-start gap-3">
                      <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Location</p>
                        <p className="text-sm text-muted-foreground">
                          {[lead.city, lead.state, lead.country].filter(Boolean).join(', ')}
                        </p>
                      </div>
                    </div>
                  )}

                  {lead.program_interest && lead.program_interest.length > 0 && (
                    <div className="flex items-start gap-3">
                      <Briefcase className="h-4 w-4 mt-1 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Program Interest</p>
                        <p className="text-sm text-muted-foreground">
                          {lead.program_interest.join(', ')}
                        </p>
                      </div>
                    </div>
                  )}

                  {lead.source && (
                    <div className="flex items-start gap-3">
                      <Globe className="h-4 w-4 mt-1 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Lead Source</p>
                        <p className="text-sm text-muted-foreground">{lead.source}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <PhoneCall className="h-4 w-4 mr-2" />
                    Call
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Call History */}
            <AccordionItem value="calls" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <PhoneCall className="h-4 w-4" />
                  <span className="font-semibold">Call History</span>
                  <Badge variant="secondary" className="ml-auto mr-2">3</Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pt-4">
                {/* Mock call history - in real app, this would be from props/state */}
                <div className="space-y-3">
                  <div className="border-l-2 border-green-500 pl-3 py-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-sm font-medium">Outbound Call</p>
                        <p className="text-xs text-muted-foreground">Duration: 8m 23s</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Discussed program requirements and next steps
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">Completed</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">2 hours ago</p>
                  </div>

                  <div className="border-l-2 border-yellow-500 pl-3 py-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-sm font-medium">Inbound Call</p>
                        <p className="text-xs text-muted-foreground">Duration: 3m 45s</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Questions about application deadline
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">Completed</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Yesterday</p>
                  </div>

                  <div className="border-l-2 border-red-500 pl-3 py-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-sm font-medium">Outbound Call</p>
                        <p className="text-xs text-muted-foreground">No answer - Left voicemail</p>
                      </div>
                      <Badge variant="outline" className="text-xs">No Answer</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">3 days ago</p>
                  </div>
                </div>

                <Button size="sm" variant="outline" className="w-full mt-2">
                  <PhoneCall className="h-4 w-4 mr-2" />
                  Log New Call
                </Button>
              </AccordionContent>
            </AccordionItem>

            {/* Appointments */}
            <AccordionItem value="appointments" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="font-semibold">Appointments</span>
                  <Badge variant="secondary" className="ml-auto mr-2">2</Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pt-4">
                <div className="space-y-3">
                  <div className="border rounded-lg p-3 bg-blue-500/5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-sm font-medium">Campus Tour</p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>Tomorrow, 2:00 PM</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>60 minutes</span>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-600">
                        Upcoming
                      </Badge>
                    </div>
                  </div>

                  <div className="border rounded-lg p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-sm font-medium">Admissions Interview</p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>Next Monday, 10:00 AM</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>30 minutes</span>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        Scheduled
                      </Badge>
                    </div>
                  </div>
                </div>

                <Button size="sm" variant="outline" className="w-full mt-2">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Appointment
                </Button>
              </AccordionContent>
            </AccordionItem>

            {/* AI Sequences */}
            <AccordionItem value="sequences" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <Bot className="h-4 w-4" />
                  <span className="font-semibold">AI Sequences</span>
                  <Badge variant="secondary" className="ml-auto mr-2">1</Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pt-4">
                <div className="border rounded-lg p-3 bg-purple-500/5">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex-1">
                      <p className="text-sm font-medium">Welcome & Nurture Sequence</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        5-email sequence over 14 days
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs bg-green-500/10 text-green-600">
                      Active
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Email 1: Welcome</span>
                      <Badge variant="secondary" className="text-xs">Sent</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Email 2: Program Overview</span>
                      <Badge variant="secondary" className="text-xs">Sent</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Email 3: Application Tips</span>
                      <Badge variant="outline" className="text-xs">Scheduled</Badge>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="outline" className="flex-1">
                      Pause
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      View Details
                    </Button>
                  </div>
                </div>

                <Button size="sm" variant="outline" className="w-full">
                  <Bot className="h-4 w-4 mr-2" />
                  Enroll in Sequence
                </Button>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
}
