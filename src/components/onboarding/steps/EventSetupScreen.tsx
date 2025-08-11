import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Calendar, MapPin, Users, Clock, Plus, Trash2 } from 'lucide-react';

interface EventSetupScreenProps {
  data: any;
  onComplete: (data: any) => void;
  onNext: () => void;
  onSkip: () => void;
}

const EVENT_TEMPLATES = [
  {
    type: 'info-session',
    title: 'Information Session',
    description: 'General program overview and Q&A',
    duration: '1.5 hours',
    capacity: 50,
    suggested_frequency: 'Weekly'
  },
  {
    type: 'open-house',
    title: 'Campus Open House',
    description: 'Campus tours and facility showcase',
    duration: '3 hours',
    capacity: 100,
    suggested_frequency: 'Monthly'
  },
  {
    type: 'application-deadline',
    title: 'Application Deadline',
    description: 'Final date for program applications',
    duration: '1 day',
    capacity: null,
    suggested_frequency: 'Per intake'
  },
  {
    type: 'orientation',
    title: 'Student Orientation',
    description: 'Welcome session for new students',
    duration: '4 hours',
    capacity: 200,
    suggested_frequency: 'Per intake'
  }
];

const EventSetupScreen: React.FC<EventSetupScreenProps> = ({
  data,
  onComplete,
  onNext,
  onSkip
}) => {
  const { toast } = useToast();
  const [events, setEvents] = useState(data?.events || []);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const handleAddEventFromTemplate = (template: any) => {
    const newEvent = {
      id: Date.now().toString(),
      title: template.title,
      description: template.description,
      type: template.type,
      date: '',
      time: '',
      location: '',
      capacity: template.capacity,
      duration: template.duration,
      status: 'upcoming',
      registrations: 0
    };
    
    setEvents(prev => [...prev, newEvent]);
    setSelectedTemplate(null);
    
    toast({
      title: "Event Added",
      description: `${template.title} has been added to your events.`,
    });
  };

  const handleRemoveEvent = (eventId: string) => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
  };

  const handleEventUpdate = (eventId: string, field: string, value: string) => {
    setEvents(prev => prev.map(e => 
      e.id === eventId ? { ...e, [field]: value } : e
    ));
  };

  const handleComplete = () => {
    onComplete({ events });
    onNext();
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground">Events & Important Dates</h3>
        <p className="text-muted-foreground">
          Set up key events and deadlines for your institution (optional).
        </p>
      </div>

      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          <span className="font-medium text-blue-900 dark:text-blue-100">
            This step is optional
          </span>
        </div>
        <p className="text-sm text-blue-700 dark:text-blue-300">
          You can add events now to get started quickly, or skip this step and set up events later from the admin panel.
        </p>
      </div>

      {events.length === 0 ? (
        <div className="grid md:grid-cols-2 gap-4">
          {EVENT_TEMPLATES.map((template, index) => (
            <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-primary" />
                  {template.title}
                </CardTitle>
                <p className="text-sm text-muted-foreground">{template.description}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="w-4 h-4 mr-2" />
                    Duration: {template.duration}
                  </div>
                  {template.capacity && (
                    <div className="flex items-center text-muted-foreground">
                      <Users className="w-4 h-4 mr-2" />
                      Capacity: {template.capacity} participants
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground">
                    Suggested: {template.suggested_frequency}
                  </div>
                </div>
                <Button 
                  className="w-full mt-3" 
                  variant="outline"
                  onClick={() => handleAddEventFromTemplate(template)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add This Event
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium text-foreground">Your Events</h4>
            <Button 
              variant="outline"
              onClick={() => setSelectedTemplate(EVENT_TEMPLATES[0])}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Another Event
            </Button>
          </div>

          {events.map((event) => (
            <Card key={event.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base">{event.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRemoveEvent(event.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm">Date</Label>
                    <Input
                      type="date"
                      value={event.date}
                      onChange={(e) => handleEventUpdate(event.id, 'date', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Time</Label>
                    <Input
                      type="time"
                      value={event.time}
                      onChange={(e) => handleEventUpdate(event.id, 'time', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Location</Label>
                    <Input
                      placeholder="Room/Building or Online"
                      value={event.location}
                      onChange={(e) => handleEventUpdate(event.id, 'location', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {event.duration}
                    </span>
                    {event.capacity && (
                      <span className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {event.capacity} max
                      </span>
                    )}
                  </div>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full capitalize">
                    {event.type.replace('-', ' ')}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="text-center">
            <Button 
              variant="outline"
              onClick={() => handleAddEventFromTemplate(EVENT_TEMPLATES[0])}
              className="glass-button"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add More Events
            </Button>
          </div>
        </div>
      )}

      <div className="bg-muted/30 rounded-lg p-4">
        <h4 className="font-medium text-foreground mb-2">Event Features</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Automated registration forms for each event</li>
          <li>• Email reminders sent to registered participants</li>
          <li>• Calendar integration for staff and students</li>
          <li>• Capacity management and waitlist functionality</li>
          <li>• Post-event follow-up automation</li>
        </ul>
      </div>

      <div className="flex justify-center space-x-4">
        <Button variant="outline" onClick={onSkip} className="glass-button">
          Skip Events Setup
        </Button>
        <Button 
          onClick={handleComplete}
          className="bg-primary hover:bg-primary-hover"
        >
          {events.length > 0 
            ? `Continue with ${events.length} Event${events.length !== 1 ? 's' : ''}`
            : 'Continue Without Events'
          }
        </Button>
      </div>
    </div>
  );
};

export default EventSetupScreen;