/**
 * Utility functions for report generation and formatting
 */

export interface ReportField {
  key: string;
  label: string;
  type: 'string' | 'number' | 'date' | 'boolean';
  required?: boolean;
}

export const PTIRU_STUDENT_FIELDS: ReportField[] = [
  { key: 'institutionId', label: 'Institution ID', type: 'string', required: true },
  { key: 'studentId', label: 'Student ID', type: 'string', required: true },
  { key: 'firstName', label: 'First Name', type: 'string', required: true },
  { key: 'lastName', label: 'Last Name', type: 'string', required: true },
  { key: 'program', label: 'Program', type: 'string', required: true },
  { key: 'location', label: 'Location', type: 'string', required: true },
  { key: 'enrollmentDate', label: 'Enrollment Date', type: 'date', required: true },
  { key: 'stage', label: 'Stage', type: 'string', required: true },
  { key: 'progress', label: 'Progress (%)', type: 'number', required: false },
  { key: 'deleteFlag', label: 'Delete Flag', type: 'boolean', required: false }
];

export const DQAB_INSTITUTIONAL_FIELDS: ReportField[] = [
  { key: 'institutionName', label: 'Institution Name', type: 'string', required: true },
  { key: 'mission', label: 'Mission Statement', type: 'string', required: true },
  { key: 'programCredentials', label: 'Program Credentials', type: 'string', required: true },
  { key: 'location', label: 'Location', type: 'string', required: true },
  { key: 'deliveryMode', label: 'Delivery Mode', type: 'string', required: true },
  { key: 'academicStructure', label: 'Academic Structure', type: 'string', required: true },
  { key: 'timeline', label: 'Timeline', type: 'string', required: true },
  { key: 'complianceReviews', label: 'Compliance Reviews', type: 'string', required: true }
];

export const PRACTICUM_BATCH_FIELDS: ReportField[] = [
  { key: 'studentName', label: 'Student Name', type: 'string', required: true },
  { key: 'studentEmail', label: 'Student Email', type: 'string', required: true },
  { key: 'studentId', label: 'Student ID', type: 'string', required: true },
  { key: 'practicumSite', label: 'Practicum Site', type: 'string', required: true },
  { key: 'siteLocation', label: 'Site Location', type: 'string', required: false },
  { key: 'preceptorName', label: 'Preceptor Name', type: 'string', required: false },
  { key: 'preceptorEmail', label: 'Preceptor Email', type: 'string', required: false },
  { key: 'preceptorPhone', label: 'Preceptor Phone', type: 'string', required: false },
  { key: 'instructorName', label: 'Instructor Name', type: 'string', required: false },
  { key: 'instructorEmail', label: 'Instructor Email', type: 'string', required: false },
  { key: 'hoursSubmitted', label: 'Hours Submitted', type: 'number', required: true },
  { key: 'hoursApproved', label: 'Hours Approved', type: 'number', required: true },
  { key: 'hoursRequired', label: 'Hours Required', type: 'number', required: true },
  { key: 'attendanceRate', label: 'Attendance Rate (%)', type: 'number', required: false },
  { key: 'competenciesCompleted', label: 'Competencies Completed', type: 'number', required: true },
  { key: 'competenciesRequired', label: 'Competencies Required', type: 'number', required: true },
  { key: 'completionRate', label: 'Completion Rate (%)', type: 'number', required: false },
  { key: 'startDate', label: 'Start Date', type: 'date', required: true },
  { key: 'endDate', label: 'End Date', type: 'date', required: false },
  { key: 'status', label: 'Status', type: 'string', required: true },
  { key: 'lastActivity', label: 'Last Activity', type: 'date', required: false }
];

/**
 * Format data for CSV export
 */
export function formatCSVData(data: any[], fields: ReportField[]): string {
  const headers = fields.map(field => field.label);
  const rows = data.map(item => 
    fields.map(field => {
      const value = item[field.key];
      if (field.type === 'string' && typeof value === 'string') {
        return `"${value.replace(/"/g, '""')}"`;
      }
      if (field.type === 'boolean') {
        return value ? 'Y' : 'N';
      }
      if (field.type === 'date' && value) {
        return new Date(value).toISOString().split('T')[0];
      }
      return value || '';
    })
  );
  
  return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
}

/**
 * Validate report data against required fields
 */
export function validateReportData(data: any[], fields: ReportField[]): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  const requiredFields = fields.filter(field => field.required);
  
  data.forEach((item, index) => {
    requiredFields.forEach(field => {
      if (!item[field.key] || (typeof item[field.key] === 'string' && item[field.key].trim() === '')) {
        errors.push(`Row ${index + 1}: Missing required field "${field.label}"`);
      }
    });
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Generate filename with timestamp
 */
export function generateReportFilename(reportType: string, format: string): string {
  const timestamp = new Date().toISOString().split('T')[0];
  const sanitizedType = reportType.replace(/[^a-zA-Z0-9]/g, '_');
  return `${sanitizedType}_${timestamp}.${format}`;
}

/**
 * Format numbers for display in reports
 */
export function formatNumber(value: number, decimals: number = 0): string {
  return value.toFixed(decimals);
}

/**
 * Format dates for report display
 */
export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-CA'); // YYYY-MM-DD format
}

/**
 * Sanitize text for CSV/Excel export
 */
export function sanitizeTextForExport(text: string): string {
  if (typeof text !== 'string') return '';
  return text
    .replace(/\r?\n/g, ' ') // Replace newlines with spaces
    .replace(/\t/g, ' ')    // Replace tabs with spaces
    .trim();
}

/**
 * Convert array data to Excel-compatible format
 */
export function prepareDataForExcel(data: any[], fields: ReportField[]): any[][] {
  const headers = fields.map(field => field.label);
  const rows = data.map(item => 
    fields.map(field => {
      const value = item[field.key];
      if (field.type === 'boolean') {
        return value ? 'Yes' : 'No';
      }
      if (field.type === 'date' && value) {
        return formatDate(value);
      }
      if (typeof value === 'string') {
        return sanitizeTextForExport(value);
      }
      return value || '';
    })
  );
  
  return [headers, ...rows];
}

/**
 * Get report status based on data completeness
 */
export function getReportStatus(data: any[], fields: ReportField[]): {
  status: 'complete' | 'incomplete' | 'warning';
  completeness: number;
  issues: string[];
} {
  const validation = validateReportData(data, fields);
  const totalFields = data.length * fields.length;
  const populatedFields = data.reduce((count, item) => {
    return count + fields.reduce((fieldCount, field) => {
      return fieldCount + (item[field.key] ? 1 : 0);
    }, 0);
  }, 0);
  
  const completeness = totalFields > 0 ? (populatedFields / totalFields) * 100 : 0;
  
  let status: 'complete' | 'incomplete' | 'warning' = 'complete';
  if (!validation.isValid) {
    status = 'incomplete';
  } else if (completeness < 95) {
    status = 'warning';
  }
  
  return {
    status,
    completeness,
    issues: validation.errors
  };
}