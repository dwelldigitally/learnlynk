import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, RefreshCw, AlertCircle } from "lucide-react";
import { EventData } from "./EventWizard";

interface EventDateTimeStepProps {
  data: EventData;
  onUpdate: (updates: Partial<EventData>) => void;
}

const timezones = [
  "UTC",
  "America/New_York",
  "America/Chicago", 
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Australia/Sydney"
];

export const EventDateTimeStep: React.FC<EventDateTimeStepProps> = ({ data, onUpdate }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Date & Time</h2>
        <p className="text-muted-foreground">Set when your event will take place and registration deadlines.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Event Schedule</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start-date">Start Date *</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={data.startDate}
                  onChange={(e) => onUpdate({ startDate: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="start-time">Start Time *</Label>
                <Input
                  id="start-time"
                  type="time"
                  value={data.startTime}
                  onChange={(e) => onUpdate({ startTime: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="end-date">End Date *</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={data.endDate}
                  onChange={(e) => onUpdate({ endDate: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="end-time">End Time *</Label>
                <Input
                  id="end-time"
                  type="time"
                  value={data.endTime}
                  onChange={(e) => onUpdate({ endTime: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="timezone">Timezone</Label>
              <Select value={data.timezone} onValueChange={(value) => onUpdate({ timezone: value })}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  {timezones.map((tz) => (
                    <SelectItem key={tz} value={tz}>
                      {tz}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center space-x-2">
                <RefreshCw className="w-4 h-4" />
                <Label htmlFor="recurring">Recurring Event</Label>
              </div>
              <Switch
                id="recurring"
                checked={data.isRecurring}
                onCheckedChange={(checked) => onUpdate({ isRecurring: checked })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>Registration Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="registration-deadline">Registration Deadline</Label>
              <Input
                id="registration-deadline"
                type="datetime-local"
                value={data.registrationDeadline}
                onChange={(e) => onUpdate({ registrationDeadline: e.target.value })}
                className="mt-1"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Leave empty to allow registration until event starts
              </p>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">Time Zone Considerations</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    All times will be displayed to attendees in their local timezone.
                    Make sure to set the correct timezone for your event location.
                  </p>
                </div>
              </div>
            </div>

            {data.isRecurring && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">Recurring Event Options</h4>
                <p className="text-sm text-green-700">
                  Recurring event settings will be available in the next version.
                  For now, create separate events for each occurrence.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};