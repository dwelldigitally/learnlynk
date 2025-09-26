import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { StudentPracticumService } from "@/services/studentPracticumService";
import { useToast } from "@/hooks/use-toast";
import { useStudentPortalContext } from "@/pages/StudentPortal";

// Get student practicum assignments
export function useStudentAssignments() {
  const { leadId } = useStudentPortalContext();
  
  return useQuery({
    queryKey: ['student-practicum-assignments', leadId],
    queryFn: () => StudentPracticumService.getStudentAssignments(leadId!),
    enabled: !!leadId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Get student practicum records
export function useStudentRecords(assignmentId: string | undefined) {
  return useQuery({
    queryKey: ['student-practicum-records', assignmentId],
    queryFn: () => StudentPracticumService.getStudentRecords(assignmentId!),
    enabled: !!assignmentId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

// Get student progress
export function useStudentProgress(assignmentId: string | undefined) {
  return useQuery({
    queryKey: ['student-practicum-progress', assignmentId],
    queryFn: () => StudentPracticumService.getStudentProgress(assignmentId!),
    enabled: !!assignmentId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

// Submit attendance record mutation
export function useSubmitAttendance() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (data: any) => {
      // Extract location data and add it to the submission
      const { location_data, ...recordData } = data;
      
      const submissionData = {
        ...recordData,
        clock_in_latitude: location_data?.clock_in?.latitude,
        clock_in_longitude: location_data?.clock_in?.longitude,
        clock_in_address: location_data?.clock_in?.address,
        clock_out_latitude: location_data?.clock_out?.latitude,
        clock_out_longitude: location_data?.clock_out?.longitude,
        clock_out_address: location_data?.clock_out?.address,
      };
      
      return StudentPracticumService.submitAttendanceRecord(submissionData);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['student-practicum-records'] });
      queryClient.invalidateQueries({ queryKey: ['student-practicum-progress'] });
      toast({
        title: "Attendance Submitted",
        description: "Your attendance record has been submitted for approval.",
      });
    },
    onError: (error) => {
      console.error('Error submitting attendance:', error);
      toast({
        title: "Submission Failed",
        description: "Failed to submit attendance record. Please try again.",
        variant: "destructive",
      });
    },
  });
}

// Submit weekly journal mutation
export function useSubmitJournal() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: StudentPracticumService.submitWeeklyJournal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-practicum-records'] });
      toast({
        title: "Journal Submitted",
        description: "Your weekly journal has been submitted for review.",
      });
    },
    onError: (error) => {
      console.error('Error submitting journal:', error);
      toast({
        title: "Submission Failed", 
        description: "Failed to submit journal entry. Please try again.",
        variant: "destructive",
      });
    },
  });
}

// Submit competency record mutation
export function useSubmitCompetency() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: StudentPracticumService.submitCompetencyRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-practicum-records'] });
      queryClient.invalidateQueries({ queryKey: ['student-practicum-progress'] });
      toast({
        title: "Competencies Submitted",
        description: "Your competency records have been submitted for approval.",
      });
    },
    onError: (error) => {
      console.error('Error submitting competency:', error);
      toast({
        title: "Submission Failed",
        description: "Failed to submit competency records. Please try again.",
        variant: "destructive",
      });
    },
  });
}

// Submit self-evaluation mutation
export function useSubmitSelfEvaluation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: StudentPracticumService.submitSelfEvaluation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-practicum-records'] });
      toast({
        title: "Evaluation Submitted",
        description: "Your self-evaluation has been submitted for review.",
      });
    },
    onError: (error) => {
      console.error('Error submitting evaluation:', error);
      toast({
        title: "Submission Failed",
        description: "Failed to submit evaluation. Please try again.",
        variant: "destructive",
      });
    },
  });
}

// Send reminder mutation
export function useSendReminder() {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: StudentPracticumService.sendReminderToPreceptor,
    onSuccess: () => {
      toast({
        title: "Reminder Sent",
        description: "A reminder has been sent to your preceptor.",
      });
    },
    onError: (error) => {
      console.error('Error sending reminder:', error);
      toast({
        title: "Failed to Send Reminder",
        description: "Could not send reminder. Please try again later.",
        variant: "destructive",
      });
    },
  });
}