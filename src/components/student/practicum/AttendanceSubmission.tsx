import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Clock, Calendar, MapPin, Send, Navigation, Map } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStudentAssignments, useSubmitAttendance } from "@/hooks/useStudentPracticum";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import LocationMap from "./LocationMap";
import PracticumDemoNotice from "./PracticumDemoNotice";

// Geolocation interface
interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
  address?: string;
}

// Reverse geocoding function
async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    // Get Mapbox token from edge function
    const { data, error } = await supabase.functions.invoke('get-mapbox-token');
    
    if (error || !data?.token) {
      console.warn('Could not get Mapbox token for reverse geocoding');
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }

    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${data.token}&types=address`
    );
    
    if (!response.ok) {
      throw new Error('Geocoding request failed');
    }
    
    const result = await response.json();
    
    if (result.features && result.features.length > 0) {
      return result.features[0].place_name;
    }
    
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  } catch (error) {
    console.warn('Reverse geocoding failed:', error);
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  }
}

const attendanceSchema = z.object({
  assignment_id: z.string().min(1, "Please select a practicum assignment"),
  date: z.string().min(1, "Date is required"),
  time_in: z.string().min(1, "Start time is required"),
  time_out: z.string().min(1, "End time is required"),
  activities: z.string().min(10, "Please describe your activities (minimum 10 characters)"),
}).refine((data) => {
  if (data.time_in && data.time_out) {
    const timeIn = new Date(`${data.date}T${data.time_in}`);
    const timeOut = new Date(`${data.date}T${data.time_out}`);
    return timeOut > timeIn;
  }
  return true;
}, {
  message: "End time must be after start time",
  path: ["time_out"],
});

type AttendanceFormData = z.infer<typeof attendanceSchema>;

export default function AttendanceSubmission() {
  const [calculatedHours, setCalculatedHours] = useState<number | null>(null);
  const [clockInLocation, setClockInLocation] = useState<LocationData | null>(null);
  const [clockOutLocation, setClockOutLocation] = useState<LocationData | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationPermissionDenied, setLocationPermissionDenied] = useState(false);
  
  const { data: assignments, isLoading: assignmentsLoading } = useStudentAssignments();
  const submitAttendance = useSubmitAttendance();

  const form = useForm<AttendanceFormData>({
    resolver: zodResolver(attendanceSchema),
    defaultValues: {
      assignment_id: "",
      date: new Date().toISOString().split('T')[0], // Today's date
      time_in: "",
      time_out: "",
      activities: ""
    }
  });

  // Function to get current location
  const getCurrentLocation = (): Promise<LocationData> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      setIsGettingLocation(true);
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setIsGettingLocation(false);
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: Date.now()
          });
        },
        (error) => {
          setIsGettingLocation(false);
          let message = 'Unable to get location';
          
          switch(error.code) {
            case error.PERMISSION_DENIED:
              message = 'Location permission denied. Please enable location access to record attendance.';
              setLocationPermissionDenied(true);
              break;
            case error.POSITION_UNAVAILABLE:
              message = 'Location information is unavailable.';
              break;
            case error.TIMEOUT:
              message = 'Location request timed out.';
              break;
          }
          
          reject(new Error(message));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  };

  // Handle clock in - capture location when time_in is set
  const handleClockIn = async () => {
    try {
      const location = await getCurrentLocation();
      
      // Get address for the location
      const address = await reverseGeocode(location.latitude, location.longitude);
      const locationWithAddress = { ...location, address };
      
      setClockInLocation(locationWithAddress);
      
      // Auto-set current time
      const now = new Date();
      const timeString = now.toTimeString().slice(0, 5); // HH:MM format
      form.setValue('time_in', timeString);
      
      toast.success('Clocked in successfully with location recorded');
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  // Handle clock out - capture location when time_out is set
  const handleClockOut = async () => {
    try {
      const location = await getCurrentLocation();
      
      // Get address for the location
      const address = await reverseGeocode(location.latitude, location.longitude);
      const locationWithAddress = { ...location, address };
      
      setClockOutLocation(locationWithAddress);
      
      // Auto-set current time
      const now = new Date();
      const timeString = now.toTimeString().slice(0, 5); // HH:MM format
      form.setValue('time_out', timeString);
      
      toast.success('Clocked out successfully with location recorded');
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const watchTimeIn = form.watch("time_in");
  const watchTimeOut = form.watch("time_out");
  const watchDate = form.watch("date");

  // Calculate hours when times change
  React.useEffect(() => {
    if (watchTimeIn && watchTimeOut && watchDate) {
      const timeIn = new Date(`${watchDate}T${watchTimeIn}`);
      const timeOut = new Date(`${watchDate}T${watchTimeOut}`);
      
      if (timeOut > timeIn) {
        const hours = (timeOut.getTime() - timeIn.getTime()) / (1000 * 60 * 60);
        setCalculatedHours(Math.round(hours * 100) / 100); // Round to 2 decimal places
      } else {
        setCalculatedHours(null);
      }
    } else {
      setCalculatedHours(null);
    }
  }, [watchTimeIn, watchTimeOut, watchDate]);

  const onSubmit = async (data: AttendanceFormData) => {
    try {
      // Ensure all fields are defined before submission
      if (!data.assignment_id || !data.date || !data.time_in || !data.time_out || !data.activities) {
        return; // Form validation will catch this
      }
      
      // Include location data in submission
      const submissionData = {
        assignment_id: data.assignment_id,
        date: data.date,
        time_in: data.time_in,
        time_out: data.time_out,
        activities: data.activities,
        location_data: {
          clock_in: clockInLocation,
          clock_out: clockOutLocation
        }
      };
      
      await submitAttendance.mutateAsync(submissionData);
      
      // Reset form and location data
      form.reset({
        assignment_id: "",
        date: new Date().toISOString().split('T')[0],
        time_in: "",
        time_out: "",
        activities: ""
      });
      setClockInLocation(null);
      setClockOutLocation(null);
      setCalculatedHours(null);
      
    } catch (error) {
      console.error('Error submitting attendance:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Demo Notice */}
      <PracticumDemoNotice />
      
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/student/practicum">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Submit Attendance</h1>
          <p className="text-muted-foreground">Log your daily practicum hours</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Attendance Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Attendance Record
              </CardTitle>
              <CardDescription>
                Submit your daily hours for preceptor approval
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Assignment Selection */}
                  <FormField
                    control={form.control}
                    name="assignment_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Practicum Assignment</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your practicum assignment" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {assignmentsLoading ? (
                              <SelectItem value="loading" disabled>Loading assignments...</SelectItem>
                            ) : assignments?.map((assignment) => (
                              <SelectItem key={assignment.id} value={assignment.id}>
                                {(assignment.practicum_programs as any)?.program_name} - {(assignment.practicum_sites as any)?.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Date and Time with Location Tracking */}
                  <div className="grid gap-4 md:grid-cols-3">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="time_in"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            Time In
                            {clockInLocation && <MapPin className="h-4 w-4 text-green-600" />}
                          </FormLabel>
                          <div className="flex gap-2">
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={handleClockIn}
                              disabled={isGettingLocation}
                              className="shrink-0"
                            >
                              {isGettingLocation ? (
                                <Navigation className="h-4 w-4 animate-spin" />
                              ) : (
                                <Navigation className="h-4 w-4" />
                              )}
                              Clock In
                            </Button>
                          </div>
                          <FormMessage />
                           {clockInLocation && (
                             <div className="text-xs text-muted-foreground space-y-1">
                               <p>Location recorded (±{Math.round(clockInLocation.accuracy)}m accuracy)</p>
                               {clockInLocation.address && <p className="text-green-600">{clockInLocation.address}</p>}
                             </div>
                           )}
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="time_out"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            Time Out
                            {clockOutLocation && <MapPin className="h-4 w-4 text-green-600" />}
                          </FormLabel>
                          <div className="flex gap-2">
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={handleClockOut}
                              disabled={isGettingLocation}
                              className="shrink-0"
                            >
                              {isGettingLocation ? (
                                <Navigation className="h-4 w-4 animate-spin" />
                              ) : (
                                <Navigation className="h-4 w-4" />
                              )}
                              Clock Out
                            </Button>
                          </div>
                          <FormMessage />
                           {clockOutLocation && (
                             <div className="text-xs text-muted-foreground space-y-1">
                               <p>Location recorded (±{Math.round(clockOutLocation.accuracy)}m accuracy)</p>
                               {clockOutLocation.address && <p className="text-green-600">{clockOutLocation.address}</p>}
                             </div>
                           )}
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Location Permission Warning */}
                  {locationPermissionDenied && (
                    <Alert className="border-orange-200 bg-orange-50">
                      <MapPin className="h-4 w-4" />
                      <AlertDescription>
                        Location access is required for attendance tracking. Please enable location permissions in your browser settings and refresh the page.
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Calculated Hours Display */}
                  {calculatedHours !== null && (
                    <Alert>
                      <Clock className="h-4 w-4" />
                      <AlertDescription>
                        Total hours: <strong>{calculatedHours} hours</strong>
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Activities */}
                  <FormField
                    control={form.control}
                    name="activities"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Activities Completed</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe the activities you completed during your practicum hours..."
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={submitAttendance.isPending}
                  >
                    {submitAttendance.isPending ? (
                      "Submitting..."
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Submit for Approval
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Instructions & Location Map */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Instructions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">Before Submitting:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Ensure all times are accurate</li>
                  <li>• Include detailed activity descriptions</li>
                  <li>• Submit within 24 hours of attendance</li>
                  <li>• Double-check your practicum site</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">After Submission:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Your preceptor will review within 48 hours</li>
                  <li>• You'll receive approval notifications</li>
                  <li>• Check your progress on the dashboard</li>
                  <li>• Send reminders if no response after 3 days</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Current Assignment
              </CardTitle>
            </CardHeader>
            <CardContent>
              {assignments?.[0] ? (
                <div className="space-y-2">
                  <p className="font-medium">{(assignments[0].practicum_programs as any)?.program_name}</p>
                  <p className="text-sm text-muted-foreground">{(assignments[0].practicum_sites as any)?.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Required Hours: {(assignments[0].practicum_programs as any)?.total_hours_required || 'N/A'}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No active assignment found</p>
              )}
            </CardContent>
          </Card>
          
          {/* Location Map - show when locations are available */}
          {(clockInLocation || clockOutLocation) && (
            <LocationMap 
              clockInLocation={clockInLocation}
              clockOutLocation={clockOutLocation}
            />
          )}
        </div>
      </div>
    </div>
  );
}