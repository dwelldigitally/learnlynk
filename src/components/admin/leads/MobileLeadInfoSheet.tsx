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
import { PastelBadge, PillButton, IconContainer, HotSheetCard, getLeadStatusColor } from "@/components/hotsheet";

interface MobileLeadInfoSheetProps {
  lead: Lead;
  children: React.ReactNode;
  onUpdate?: () => void;
}

export function MobileLeadInfoSheet({ lead, children, onUpdate }: MobileLeadInfoSheetProps) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        {children}
      </DrawerTrigger>
      <DrawerContent className="max-h-[85vh] bg-background">
        <DrawerHeader className="border-b border-border/40 pb-4">
          <DrawerTitle className="text-xl">
            {lead.first_name} {lead.last_name}
          </DrawerTitle>
          <DrawerDescription className="flex items-center gap-2 mt-2">
            <span className="flex items-center gap-1">
              <Target className="h-4 w-4" />
              Score: {lead.lead_score}
            </span>
            <span>•</span>
            <PastelBadge color={getLeadStatusColor(lead.status)} dot>
              {lead.status}
            </PastelBadge>
          </DrawerDescription>
        </DrawerHeader>

        <ScrollArea className="h-full px-4 pb-6">
          <Accordion type="multiple" defaultValue={["info", "calls"]} className="space-y-2">
            {/* Contact Information */}
            <AccordionItem value="info" className="border rounded-2xl px-4 border-border/40">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <IconContainer color="sky" size="sm">
                    <User className="h-4 w-4" />
                  </IconContainer>
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
                  <PillButton size="sm" variant="outline" className="flex-1" icon={<PhoneCall className="h-4 w-4" />}>
                    Call
                  </PillButton>
                  <PillButton size="sm" variant="outline" className="flex-1" icon={<Mail className="h-4 w-4" />}>
                    Email
                  </PillButton>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Call History */}
            <AccordionItem value="calls" className="border rounded-2xl px-4 border-border/40">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <IconContainer color="emerald" size="sm">
                    <PhoneCall className="h-4 w-4" />
                  </IconContainer>
                  <span className="font-semibold">Call History</span>
                  <PastelBadge color="slate" size="sm" className="ml-auto mr-2">3</PastelBadge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pt-4">
                {/* Mock call history - in real app, this would be from props/state */}
                <div className="space-y-3">
                  <HotSheetCard padding="sm" className="border-l-4 border-l-emerald-500">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-sm font-medium">Outbound Call</p>
                        <p className="text-xs text-muted-foreground">Duration: 8m 23s</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Discussed program requirements and next steps
                        </p>
                      </div>
                      <PastelBadge color="emerald" size="sm">Completed</PastelBadge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">2 hours ago</p>
                  </HotSheetCard>

                  <HotSheetCard padding="sm" className="border-l-4 border-l-amber-500">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-sm font-medium">Inbound Call</p>
                        <p className="text-xs text-muted-foreground">Duration: 3m 45s</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Questions about application deadline
                        </p>
                      </div>
                      <PastelBadge color="emerald" size="sm">Completed</PastelBadge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Yesterday</p>
                  </HotSheetCard>

                  <HotSheetCard padding="sm" className="border-l-4 border-l-rose-500">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-sm font-medium">Outbound Call</p>
                        <p className="text-xs text-muted-foreground">No answer - Left voicemail</p>
                      </div>
                      <PastelBadge color="rose" size="sm">No Answer</PastelBadge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">3 days ago</p>
                  </HotSheetCard>
                </div>

                <PillButton size="sm" variant="outline" className="w-full mt-2" icon={<PhoneCall className="h-4 w-4" />}>
                  Log New Call
                </PillButton>
              </AccordionContent>
            </AccordionItem>

            {/* Appointments */}
            <AccordionItem value="appointments" className="border rounded-2xl px-4 border-border/40">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <IconContainer color="violet" size="sm">
                    <Calendar className="h-4 w-4" />
                  </IconContainer>
                  <span className="font-semibold">Appointments</span>
                  <PastelBadge color="slate" size="sm" className="ml-auto mr-2">2</PastelBadge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pt-4">
                <div className="space-y-3">
                  <HotSheetCard padding="sm" className="bg-sky-50/50 border-sky-200">
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
                      <PastelBadge color="sky" size="sm">Upcoming</PastelBadge>
                    </div>
                  </HotSheetCard>

                  <HotSheetCard padding="sm">
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
                      <PastelBadge color="slate" size="sm">Scheduled</PastelBadge>
                    </div>
                  </HotSheetCard>
                </div>

                <PillButton size="sm" variant="outline" className="w-full mt-2" icon={<Calendar className="h-4 w-4" />}>
                  Schedule Appointment
                </PillButton>
              </AccordionContent>
            </AccordionItem>

            {/* AI Sequences */}
            <AccordionItem value="sequences" className="border rounded-2xl px-4 border-border/40">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <IconContainer color="primary" size="sm">
                    <Bot className="h-4 w-4" />
                  </IconContainer>
                  <span className="font-semibold">AI Sequences</span>
                  <PastelBadge color="emerald" size="sm" className="ml-auto mr-2">1</PastelBadge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pt-4">
                <HotSheetCard padding="sm" className="bg-violet-50/50 border-violet-200">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex-1">
                      <p className="text-sm font-medium">Welcome & Nurture Sequence</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        5-email sequence over 14 days
                      </p>
                    </div>
                    <PastelBadge color="emerald" size="sm">Active</PastelBadge>
                  </div>
                  
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Email 1: Welcome</span>
                      <PastelBadge color="emerald" size="sm">Sent</PastelBadge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Email 2: Program Overview</span>
                      <PastelBadge color="emerald" size="sm">Sent</PastelBadge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Email 3: Application Tips</span>
                      <PastelBadge color="slate" size="sm">Scheduled</PastelBadge>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-3">
                    <PillButton size="sm" variant="outline" className="flex-1">
                      Pause
                    </PillButton>
                    <PillButton size="sm" variant="outline" className="flex-1">
                      View Details
                    </PillButton>
                  </div>
                </HotSheetCard>

                <PillButton size="sm" variant="outline" className="w-full" icon={<Bot className="h-4 w-4" />}>
                  Enroll in Sequence
                </PillButton>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
}