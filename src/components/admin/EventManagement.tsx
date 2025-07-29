import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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
  Eye
} from "lucide-react";

const EventManagement: React.FC = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const events = [
    {
      id: "1",
      title: "Health Care Assistant Info Session",
      description: "Learn about our HCA program, career opportunities, and application process.",
      date: "2024-04-15",
      time: "18:00",
      location: "Surrey Campus - Room 101",
      type: "info_session",
      isVirtual: false,
      capacity: 50,
      registered: 37,
      program: "Health Care Assistant",
      status: "upcoming",
      registrationDeadline: "2024-04-14"
    },
    {
      id: "2", 
      title: "Virtual ECE Program Workshop",
      description: "Interactive workshop covering child development and educational techniques.",
      date: "2024-04-20",
      time: "14:00",
      location: "Online (Teams)",
      type: "workshop",
      isVirtual: true,
      capacity: 100,
      registered: 78,
      program: "Early Childhood Education",
      status: "upcoming",
      registrationDeadline: "2024-04-19"
    },
    {
      id: "3",
      title: "Campus Tour - Aviation Facilities",
      description: "Guided tour of our aviation maintenance facilities and labs.",
      date: "2024-04-25",
      time: "10:00",
      location: "Richmond Campus",
      type: "campus_tour",
      isVirtual: false,
      capacity: 25,
      registered: 22,
      program: "Aviation Maintenance",
      status: "upcoming",
      registrationDeadline: "2024-04-24"
    }
  ];

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
                  <SelectItem value="hca">Health Care Assistant</SelectItem>
                  <SelectItem value="ece">Early Childhood Education</SelectItem>
                  <SelectItem value="aviation">Aviation Maintenance</SelectItem>
                  <SelectItem value="education">Education Assistant</SelectItem>
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Event Management</h1>
          <p className="text-muted-foreground">Create and manage student events and sessions</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Event
        </Button>
      </div>

      {/* Event Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: "Upcoming Events", count: 12, icon: Calendar, color: "text-blue-600" },
          { title: "Total Registrations", count: 384, icon: Users, color: "text-green-600" },
          { title: "This Month", count: 8, icon: Clock, color: "text-purple-600" },
          { title: "Virtual Events", count: 5, icon: Video, color: "text-orange-600" }
        ].map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.count}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="upcoming" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
          <TabsTrigger value="past">Past Events</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Card key={event.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <CardTitle className="text-lg line-clamp-2">{event.title}</CardTitle>
                      <Badge className={getEventTypeColor(event.type)}>
                        {event.type.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {event.description}
                  </p>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{new Date(event.date).toLocaleDateString()} at {event.time}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {event.isVirtual ? (
                        <Video className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{event.registered}/{event.capacity} registered</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Registration</span>
                      <span>{Math.round((event.registered / event.capacity) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${(event.registered / event.capacity) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Users className="h-4 w-4 mr-1" />
                      Attendees
                    </Button>
                  </div>

                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground">
                      Program: <span className="font-medium">{event.program}</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="past">
          <Card>
            <CardHeader>
              <CardTitle>Past Events</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">View completed events and their analytics.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="draft">
          <Card>
            <CardHeader>
              <CardTitle>Draft Events</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Events that are being planned but not yet published.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <CreateEventDialog />
    </div>
  );
};

export default EventManagement;