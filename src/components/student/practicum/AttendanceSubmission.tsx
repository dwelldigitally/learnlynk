import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Clock, Calendar, MapPin, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStudentAssignments, useSubmitAttendance } from "@/hooks/useStudentPracticum";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
      await submitAttendance.mutateAsync(data);
      form.reset();
      setCalculatedHours(null);
    } catch (error) {
      console.error('Failed to submit attendance:', error);
    }
  };

  return (
    <div className="space-y-6">
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
                                {assignment.practicum_programs?.program_name} - {assignment.practicum_sites?.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Date and Time */}
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
                          <FormLabel>Time In</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="time_out"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Time Out</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

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

        {/* Instructions & Tips */}
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
                  <p className="font-medium">{assignments[0].practicum_programs?.program_name}</p>
                  <p className="text-sm text-muted-foreground">{assignments[0].practicum_sites?.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Required Hours: {assignments[0].practicum_programs?.total_hours_required || 'N/A'}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No active assignment found</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}