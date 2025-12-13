import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EventWizard, EventData } from "./wizard/EventWizard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useConditionalData } from '@/hooks/useConditionalData';
import { ConditionalDataWrapper } from './ConditionalDataWrapper';
import { EventService } from '@/services/eventService';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Calendar, 
  MapPin, 
  Users, 
  Edit,
  Trash2,
  Video,
  Clock,
  Eye,
  TrendingUp
} from "lucide-react";
import { PageHeader } from '@/components/modern/PageHeader';
import { ModernCard } from '@/components/modern/ModernCard';
import { GlassCard } from '@/components/modern/GlassCard';

const EventManagement: React.FC = () => {
  const { toast } = useToast();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventData | null>(null);

  // Data hooks
  const eventsData = useConditionalData(
    ['events'],
    () => [],
    EventService.getEvents
  );

  const handleCreateEvent = async (eventData: EventData) => {
    try {
      console.log("Creating event with full data:", JSON.stringify(eventData, null, 2));
      
      // Validate required fields
      if (!eventData.title) {
        throw new Error("Event title is required");
      }
      
      // Map EventData to database format with proper null-safe access
      const eventToSave = {
        title: eventData.title || "Untitled Event",
        description: eventData.description || "",
        type: eventData.category || "workshop",
        date: eventData.startDate || new Date().toISOString().split('T')[0],
        time: eventData.startTime || "09:00",
        location: eventData.eventType === 'virtual' 
          ? 'Online' 
          : (eventData.venue?.name || "TBD"),
        capacity: eventData.venue?.capacity || eventData.maxCapacity || 50,
        registrations: 0,
        program_id: null,
        status: eventData.isPublic ? 'published' : 'draft'
      };

      console.log("Mapped event data for database:", JSON.stringify(eventToSave, null, 2));

      await EventService.createEvent(eventToSave);
      
      // Refresh events data
      eventsData.refetch();
      
      setIsWizardOpen(false);
      toast({
        title: "Event Published Successfully!",
        description: `${eventData.title} has been published and is now live.`,
      });
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        title: "Error Publishing Event",
        description: "There was an error publishing your event. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Use actual demo events from DemoDataService or real data
  const events = eventsData.data || [];

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "info_session": return "bg-blue-100 text-blue-800";
      case "workshop": return "bg-green-100 text-green-800";
      case "campus_tour": return "bg-purple-100 text-purple-800";
      case "networking": return "bg-orange-100 text-orange-800";
      case "guest_lecture": return "bg-pink-100 text-pink-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const CreateEventDialog = () => (
    <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
          <DialogDescription>
            Set up a new event for student engagement and program promotion.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Event Title</Label>
              <Input placeholder="e.g., HCA Info Session" />
            </div>
            <div className="space-y-2">
              <Label>Event Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="info_session">Info Session</SelectItem>
                  <SelectItem value="workshop">Workshop</SelectItem>
                  <SelectItem value="campus_tour">Campus Tour</SelectItem>
                  <SelectItem value="networking">Networking</SelectItem>
                  <SelectItem value="guest_lecture">Guest Lecture</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea placeholder="Event description and agenda..." rows={3} />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <Input type="date" />
            </div>
            <div className="space-y-2">
              <Label>Time</Label>
              <Input type="time" />
            </div>
            <div className="space-y-2">
              <Label>Capacity</Label>
              <Input type="number" placeholder="50" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Location/Platform</Label>
              <Input placeholder="Surrey Campus - Room 101 or Teams Link" />
            </div>
            <div className="space-y-2">
              <Label>Associated Program</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select program" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Health Care Assistant">Health Care Assistant</SelectItem>
                  <SelectItem value="Education Assistant">Education Assistant</SelectItem>
                  <SelectItem value="Aviation">Aviation</SelectItem>
                  <SelectItem value="Hospitality">Hospitality</SelectItem>
                  <SelectItem value="ECE">ECE</SelectItem>
                  <SelectItem value="MLA">MLA</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input type="checkbox" id="virtual" />
            <Label htmlFor="virtual">This is a virtual event</Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
            Cancel
          </Button>
          <Button onClick={() => setShowCreateDialog(false)}>
            Create Event
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <PageHeader 
          title="Event Management"
          subtitle="Create and manage student events and sessions"
          action={
            <Button size="lg" onClick={() => setIsWizardOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Event
            </Button>
          }
        />

        {/* Event Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <GlassCard className="p-6 hover:scale-105 transition-transform duration-300">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Upcoming Events</p>
                <h3 className="text-3xl font-bold text-foreground">12</h3>
                <p className="text-xs text-muted-foreground mt-1">Next 30 days</p>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <Calendar className="h-5 w-5 text-blue-500" />
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6 hover:scale-105 transition-transform duration-300">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Total Registrations</p>
                <h3 className="text-3xl font-bold text-foreground">384</h3>
                <p className="text-xs text-muted-foreground mt-1">All events</p>
              </div>
              <div className="p-3 bg-emerald-500/10 rounded-lg">
                <Users className="h-5 w-5 text-emerald-500" />
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6 hover:scale-105 transition-transform duration-300">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">This Month</p>
                <h3 className="text-3xl font-bold text-foreground">8</h3>
                <p className="text-xs text-muted-foreground mt-1">Events scheduled</p>
              </div>
              <div className="p-3 bg-purple-500/10 rounded-lg">
                <Clock className="h-5 w-5 text-purple-500" />
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6 hover:scale-105 transition-transform duration-300">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Virtual Events</p>
                <h3 className="text-3xl font-bold text-foreground">5</h3>
                <p className="text-xs text-muted-foreground mt-1">Online sessions</p>
              </div>
              <div className="p-3 bg-orange-500/10 rounded-lg">
                <Video className="h-5 w-5 text-orange-500" />
              </div>
            </div>
          </GlassCard>
        </div>

        <Tabs defaultValue="upcoming" className="space-y-6">
          <div className="flex items-center justify-center">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
              <TabsTrigger value="draft">Drafts</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="upcoming" className="space-y-4">
            <ConditionalDataWrapper
              isLoading={eventsData.isLoading}
              showEmptyState={eventsData.showEmptyState}
              hasDemoAccess={eventsData.hasDemoAccess}
              hasRealData={eventsData.hasRealData}
              emptyTitle="No Events Found"
              emptyDescription="Create your first event to start engaging with students."
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                  <ModernCard key={event.id} className="group overflow-hidden">
                    <CardHeader className="pb-3 bg-gradient-to-br from-primary/5 to-transparent">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2 flex-1">
                          <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                            {event.title}
                          </CardTitle>
                          <Badge variant="outline" className="w-fit">
                            {event.type.replace('_', ' ')}
                          </Badge>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-4">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {event.description}
                      </p>

                      <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <Calendar className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">{new Date(event.date).toLocaleDateString()} at {event.time}</span>
                        </div>
                        <div className="flex items-center gap-3 text-muted-foreground">
                          {event.type === 'webinar' ? (
                            <Video className="h-4 w-4 flex-shrink-0" />
                          ) : (
                            <MapPin className="h-4 w-4 flex-shrink-0" />
                          )}
                          <span className="truncate">{event.location}</span>
                        </div>
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <Users className="h-4 w-4 flex-shrink-0" />
                          <span>{event.registrations || 0}/{event.capacity} registered</span>
                        </div>
                      </div>

                      <div className="space-y-2 pt-2">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Registration</span>
                          <span className="font-medium">{Math.round(((event.registrations || 0) / event.capacity) * 100)}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-primary to-primary/80 h-2 rounded-full transition-all duration-500" 
                            style={{ width: `${((event.registrations || 0) / event.capacity) * 100}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm" className="flex-1 gap-2">
                          <Eye className="h-3.5 w-3.5" />
                          View
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 gap-2">
                          <Users className="h-3.5 w-3.5" />
                          Attendees
                        </Button>
                      </div>
                    </CardContent>
                  </ModernCard>
                ))}
              </div>
            </ConditionalDataWrapper>
          </TabsContent>

          <TabsContent value="past">
            <ModernCard>
              <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Past Events</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">View completed events and their analytics</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-12">
                <div className="text-center">
                  <div className="mb-4 mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                    <TrendingUp className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No Past Events</h3>
                  <p className="text-muted-foreground">Past events will appear here once they're completed</p>
                </div>
              </CardContent>
            </ModernCard>
          </TabsContent>

          <TabsContent value="draft">
            <ModernCard>
              <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Edit className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Draft Events</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">Events that are being planned but not yet published</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-12">
                <div className="text-center">
                  <div className="mb-4 mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                    <Edit className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No Draft Events</h3>
                  <p className="text-muted-foreground mb-4">Create a new event to get started</p>
                  <Button onClick={() => setIsWizardOpen(true)} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create Event
                  </Button>
                </div>
              </CardContent>
            </ModernCard>
          </TabsContent>
        </Tabs>
        
        {isWizardOpen && (
          <EventWizard
            onClose={() => {
              setIsWizardOpen(false);
              setEditingEvent(null);
            }}
            onSave={handleCreateEvent}
            editingEvent={editingEvent || undefined}
          />
        )}
      </div>
    </div>
  );
};

export default EventManagement;