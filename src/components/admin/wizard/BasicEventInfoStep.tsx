import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Users, Building } from "lucide-react";
import { EventData } from "./EventWizard";

interface BasicEventInfoStepProps {
  data: EventData;
  onUpdate: (updates: Partial<EventData>) => void;
}

const eventCategories = [
  "Conference & Convention",
  "Workshop & Training",
  "Networking",
  "Social & Entertainment",
  "Sports & Fitness",
  "Arts & Culture",
  "Business & Professional",
  "Education & Learning",
  "Health & Wellness",
  "Community & Volunteer",
  "Other"
];

export const BasicEventInfoStep: React.FC<BasicEventInfoStepProps> = ({ data, onUpdate }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Basic Event Information</h2>
        <p className="text-muted-foreground">Tell us about your event and where it will take place.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Event Title *</Label>
            <Input
              id="title"
              value={data.title}
              onChange={(e) => onUpdate({ title: e.target.value })}
              placeholder="Enter event title"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="description">Event Description *</Label>
            <Textarea
              id="description"
              value={data.description}
              onChange={(e) => onUpdate({ description: e.target.value })}
              placeholder="Describe your event..."
              rows={4}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={data.category} onValueChange={(value) => onUpdate({ category: value })}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {eventCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Event Type *</Label>
            <RadioGroup
              value={data.eventType}
              onValueChange={(value: "in-person" | "virtual" | "hybrid") => onUpdate({ eventType: value })}
              className="mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="in-person" id="in-person" />
                <Label htmlFor="in-person" className="flex items-center space-x-2">
                  <Building className="w-4 h-4" />
                  <span>In-Person</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="virtual" id="virtual" />
                <Label htmlFor="virtual" className="flex items-center space-x-2">
                  <span>💻</span>
                  <span>Virtual</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="hybrid" id="hybrid" />
                <Label htmlFor="hybrid" className="flex items-center space-x-2">
                  <span>🌐</span>
                  <span>Hybrid</span>
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="w-5 h-5" />
              <span>Venue Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="venue-name">Venue Name *</Label>
              <Input
                id="venue-name"
                value={data.venue.name}
                onChange={(e) => onUpdate({ 
                  venue: { ...data.venue, name: e.target.value }
                })}
                placeholder="Enter venue name"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="venue-address">Address *</Label>
              <Textarea
                id="venue-address"
                value={data.venue.address}
                onChange={(e) => onUpdate({ 
                  venue: { ...data.venue, address: e.target.value }
                })}
                placeholder="Enter full address"
                rows={3}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="venue-capacity">Venue Capacity</Label>
              <div className="flex items-center space-x-2 mt-1">
                <Users className="w-4 h-4 text-muted-foreground" />
                <Input
                  id="venue-capacity"
                  type="number"
                  value={data.venue.capacity}
                  onChange={(e) => onUpdate({ 
                    venue: { ...data.venue, capacity: parseInt(e.target.value) || 0 }
                  })}
                  placeholder="Max attendees"
                  min="1"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};