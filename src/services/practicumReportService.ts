import { supabase } from '@/integrations/supabase/client';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { formatCSVData, prepareDataForExcel, generateReportFilename } from '@/utils/reportUtils';

export interface PracticumStudentReportData {
  studentName: string;
  studentEmail: string;
  studentId: string;
  practicumSite: string;
  siteLocation: string;
  preceptorName: string;
  preceptorEmail: string;
  preceptorPhone: string;
  instructorName: string;
  instructorEmail: string;
  hoursSubmitted: number;
  hoursApproved: number;
  hoursRequired: number;
  attendanceRate: number;
  competenciesCompleted: number;
  competenciesRequired: number;
  completionRate: number;
  startDate: string;
  endDate: string;
  status: string;
  lastActivity: string;
}

export class PracticumReportService {
  /**
   * Generate comprehensive practicum report for students in a batch
   */
  static async generateBatchStudentReport(
    batchId: string, 
    format: 'csv' | 'excel' = 'excel'
  ): Promise<void> {
    try {
      // Fetch comprehensive student data for the batch
      const reportData = await this.fetchBatchStudentData(batchId);
      
      if (reportData.length === 0) {
        throw new Error('No student data found for this batch');
      }

      if (format === 'csv') {
        await this.generateCSVReport(reportData, batchId);
      } else {
        await this.generateExcelReport(reportData, batchId);
      }
    } catch (error) {
      console.error('Error generating batch student report:', error);
      throw error;
    }
  }

  /**
   * Fetch and aggregate student data for a batch
   */
  private static async fetchBatchStudentData(batchId: string): Promise<PracticumStudentReportData[]> {
    // First, find the program UUID by name/identifier if batchId is not a UUID
    let programId = batchId;
    
    // Check if batchId is a UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(batchId)) {
      // If not UUID, treat as program name or identifier and find the actual program
      const { data: programs } = await supabase
        .from('practicum_programs')
        .select('id')
        .or(`program_name.eq.${batchId},id.eq.${batchId}`)
        .limit(1);
      
      if (!programs || programs.length === 0) {
        throw new Error(`No practicum program found with identifier: ${batchId}`);
      }
      
      programId = programs[0].id;
    }

    // Get assignments using the program UUID
    const { data: assignments, error } = await supabase
      .from('practicum_assignments')
      .select(`
        *,
        leads!inner (
          first_name,
          last_name,
          email,
          id
        ),
        practicum_sites (
          name,
          address,
          city,
          state
        ),
        practicum_programs (
          program_name
        )
      `)
      .eq('program_id', programId);

    if (error) throw error;
    if (!assignments || assignments.length === 0) return [];

    // Fetch practicum records for hours and competencies
    const assignmentIds = assignments.map(a => a.id);
    const { data: records } = await supabase
      .from('practicum_records')
      .select('*')
      .in('assignment_id', assignmentIds);

    // For now, we'll use placeholder data for preceptors and instructors
    // since the exact schema structure needs to be clarified

    // Aggregate data for each student
    const reportData: PracticumStudentReportData[] = assignments.map(assignment => {
      const lead = assignment.leads;
      const site = assignment.practicum_sites;
      const program = assignment.practicum_programs;
      
      // Use placeholder data for preceptor and instructor info for now
      
      // Calculate student-specific metrics from records
      const studentRecords = (records || []).filter(r => r.assignment_id === assignment.id);
      
      // Calculate hours from attendance records
      const hoursSubmitted = studentRecords
        .filter(r => r.record_type === 'attendance')
        .reduce((sum, r) => sum + (r.hours_submitted || 0), 0);
      
      const hoursApproved = studentRecords
        .filter(r => r.record_type === 'attendance' && r.instructor_status === 'approved')
        .reduce((sum, r) => sum + (r.hours_submitted || 0), 0);

      // Calculate competencies from competency records
      const competenciesCompleted = studentRecords
        .filter(r => r.record_type === 'competency' && r.instructor_status === 'approved')
        .length;

      // Calculate attendance rate
      const attendanceRecords = studentRecords.filter(r => r.record_type === 'attendance');
      const attendanceRate = attendanceRecords.length > 0 
        ? (attendanceRecords.filter(r => r.instructor_status === 'approved').length / attendanceRecords.length) * 100 
        : 0;

      const lastActivity = studentRecords.length > 0
        ? new Date(Math.max(...studentRecords.map(r => new Date(r.created_at).getTime()))).toISOString().split('T')[0]
        : '';

      return {
        studentName: `${lead?.first_name || ''} ${lead?.last_name || ''}`.trim(),
        studentEmail: lead?.email || '',
        studentId: lead?.id || '',
        practicumSite: site?.name || '',
        siteLocation: `${site?.city || ''}, ${site?.state || ''}`.trim(),
        preceptorName: 'Dr. Sarah Johnson', // Placeholder data
        preceptorEmail: 'sarah.johnson@hospital.com',
        preceptorPhone: '(555) 123-4567',
        instructorName: 'Prof. Michael Brown', // Placeholder data
        instructorEmail: 'michael.brown@college.edu',
        hoursSubmitted: Math.round(hoursSubmitted),
        hoursApproved: Math.round(hoursApproved),
        hoursRequired: 150, // Default required hours - can be made configurable
        attendanceRate: Math.round(attendanceRate),
        competenciesCompleted,
        competenciesRequired: 10, // Default required competencies - can be made configurable
        completionRate: Math.round((hoursApproved / 150) * 100), // Based on default 150 hours
        startDate: assignment.start_date || '',
        endDate: assignment.end_date || '',
        status: assignment.status || '',
        lastActivity
      };
    });

    return reportData;
  }

  /**
   * Generate CSV format report
   */
  private static async generateCSVReport(data: PracticumStudentReportData[], batchId: string): Promise<void> {
    const fields = [
      { key: 'studentName', label: 'Student Name', type: 'string' as const },
      { key: 'studentEmail', label: 'Student Email', type: 'string' as const },
      { key: 'studentId', label: 'Student ID', type: 'string' as const },
      { key: 'practicumSite', label: 'Practicum Site', type: 'string' as const },
      { key: 'siteLocation', label: 'Site Location', type: 'string' as const },
      { key: 'preceptorName', label: 'Preceptor Name', type: 'string' as const },
      { key: 'preceptorEmail', label: 'Preceptor Email', type: 'string' as const },
      { key: 'preceptorPhone', label: 'Preceptor Phone', type: 'string' as const },
      { key: 'instructorName', label: 'Instructor Name', type: 'string' as const },
      { key: 'instructorEmail', label: 'Instructor Email', type: 'string' as const },
      { key: 'hoursSubmitted', label: 'Hours Submitted', type: 'number' as const },
      { key: 'hoursApproved', label: 'Hours Approved', type: 'number' as const },
      { key: 'hoursRequired', label: 'Hours Required', type: 'number' as const },
      { key: 'attendanceRate', label: 'Attendance Rate (%)', type: 'number' as const },
      { key: 'competenciesCompleted', label: 'Competencies Completed', type: 'number' as const },
      { key: 'competenciesRequired', label: 'Competencies Required', type: 'number' as const },
      { key: 'completionRate', label: 'Completion Rate (%)', type: 'number' as const },
      { key: 'startDate', label: 'Start Date', type: 'date' as const },
      { key: 'endDate', label: 'End Date', type: 'date' as const },
      { key: 'status', label: 'Status', type: 'string' as const },
      { key: 'lastActivity', label: 'Last Activity', type: 'date' as const }
    ];

    const csvContent = formatCSVData(data, fields);
    const filename = generateReportFilename(`Practicum_Batch_${batchId}_Report`, 'csv');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, filename);
  }

  /**
   * Generate Excel format report
   */
  private static async generateExcelReport(data: PracticumStudentReportData[], batchId: string): Promise<void> {
    const workbook = XLSX.utils.book_new();

    // Student Details Sheet
    const fields = [
      { key: 'studentName', label: 'Student Name', type: 'string' as const },
      { key: 'studentEmail', label: 'Student Email', type: 'string' as const },
      { key: 'studentId', label: 'Student ID', type: 'string' as const },
      { key: 'practicumSite', label: 'Practicum Site', type: 'string' as const },
      { key: 'siteLocation', label: 'Site Location', type: 'string' as const },
      { key: 'preceptorName', label: 'Preceptor Name', type: 'string' as const },
      { key: 'preceptorEmail', label: 'Preceptor Email', type: 'string' as const },
      { key: 'preceptorPhone', label: 'Preceptor Phone', type: 'string' as const },
      { key: 'instructorName', label: 'Instructor Name', type: 'string' as const },
      { key: 'instructorEmail', label: 'Instructor Email', type: 'string' as const },
      { key: 'hoursSubmitted', label: 'Hours Submitted', type: 'number' as const },
      { key: 'hoursApproved', label: 'Hours Approved', type: 'number' as const },
      { key: 'hoursRequired', label: 'Hours Required', type: 'number' as const },
      { key: 'attendanceRate', label: 'Attendance Rate (%)', type: 'number' as const },
      { key: 'competenciesCompleted', label: 'Competencies Completed', type: 'number' as const },
      { key: 'competenciesRequired', label: 'Competencies Required', type: 'number' as const },
      { key: 'completionRate', label: 'Completion Rate (%)', type: 'number' as const },
      { key: 'startDate', label: 'Start Date', type: 'date' as const },
      { key: 'endDate', label: 'End Date', type: 'date' as const },
      { key: 'status', label: 'Status', type: 'string' as const },
      { key: 'lastActivity', label: 'Last Activity', type: 'date' as const }
    ];

    const detailsData = prepareDataForExcel(data, fields);
    const detailsSheet = XLSX.utils.aoa_to_sheet(detailsData);
    XLSX.utils.book_append_sheet(workbook, detailsSheet, 'Student Details');

    // Summary Sheet
    const summaryData = [
      ['Batch Summary', ''],
      ['Total Students', data.length.toString()],
      ['Average Hours Completed', Math.round(data.reduce((sum, s) => sum + s.hoursApproved, 0) / data.length || 0).toString()],
      ['Average Attendance Rate', Math.round(data.reduce((sum, s) => sum + s.attendanceRate, 0) / data.length || 0).toString() + '%'],
      ['Average Completion Rate', Math.round(data.reduce((sum, s) => sum + s.completionRate, 0) / data.length || 0).toString() + '%'],
      ['Students at Risk (< 70% completion)', data.filter(s => s.completionRate < 70).length.toString()],
      ['Students Ready to Graduate (≥ 90% completion)', data.filter(s => s.completionRate >= 90).length.toString()],
      [''],
      ['Report Generated', new Date().toLocaleString()],
      ['Batch ID', batchId]
    ];

    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');

    // Generate and download Excel file
    const filename = generateReportFilename(`Practicum_Batch_${batchId}_Report`, 'xlsx');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    
    saveAs(blob, filename);
  }

  /**
   * Validate if batch has students before generating report
   */
  static async validateBatchForReporting(batchId: string): Promise<{ isValid: boolean; studentCount: number }> {
    // Handle both UUID and string identifiers
    let programId = batchId;
    
    // Check if batchId is a UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(batchId)) {
      // If not UUID, find the program by name/identifier
      const { data: programs } = await supabase
        .from('practicum_programs')
        .select('id')
        .or(`program_name.eq.${batchId},id.eq.${batchId}`)
        .limit(1);
      
      if (!programs || programs.length === 0) {
        return { isValid: false, studentCount: 0 };
      }
      
      programId = programs[0].id;
    }

    const { data: assignments, error } = await supabase
      .from('practicum_assignments')
      .select('id')
      .eq('program_id', programId);

    if (error) {
      console.error('Database error validating batch:', error);
      throw new Error(`Database error: ${error.message}`);
    }

    const studentCount = assignments?.length || 0;
    console.log(`Validation for batch ${batchId}: found ${studentCount} assignments`);

    return {
      isValid: studentCount > 0,
      studentCount
    };
  }
}