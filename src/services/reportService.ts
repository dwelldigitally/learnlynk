import { supabase } from '@/integrations/supabase/client';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';
import { DemoDataService } from './demoDataService';

export interface PTIRUStudentData {
  institutionId: string;
  studentId: string;
  firstName: string;
  lastName: string;
  program: string;
  location: string;
  enrollmentDate: string;
  stage: string;
  progress: number;
  deleteFlag?: boolean;
}

export interface DQABInstitutionalData {
  institutionName: string;
  mission: string;
  programCredentials: string[];
  location: string;
  deliveryMode: string;
  academicStructure: string;
  timeline: string;
  complianceReviews: string[];
}

export class ReportService {
  /**
   * Generate PTIRU Student Data Report in CSV format
   */
  static async generatePTIRUStudentReport(): Promise<void> {
    try {
      // Check if user has demo data enabled
      const { data: hasDemoData } = await supabase.rpc('user_has_demo_data');
      
      let studentData: PTIRUStudentData[] = [];
      
      if (hasDemoData) {
        // Use demo data
        const demoStudents = DemoDataService.getDemoStudents();
        studentData = demoStudents.map(student => ({
          institutionId: 'WCC',
          studentId: student.student_id,
          firstName: student.first_name,
          lastName: student.last_name,
          program: student.program,
          location: student.city || 'Vancouver, BC',
          enrollmentDate: new Date().toISOString().split('T')[0],
          stage: student.stage,
          progress: student.progress || 0,
          deleteFlag: false
        }));
      } else {
        // Fetch real student data
        const { data: students, error } = await supabase
          .from('students')
          .select('*')
          .limit(1000);
          
        if (error) throw error;
        
        studentData = (students || []).map(student => ({
          institutionId: 'WCC',
          studentId: student.student_id,
          firstName: student.first_name,
          lastName: student.last_name,
          program: student.program,
          location: `${student.city || 'Vancouver'}, ${student.state || 'BC'}`,
          enrollmentDate: student.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
          stage: student.stage,
          progress: student.progress || 0,
          deleteFlag: false
        }));
      }

      // Create CSV content
      const headers = [
        'Institution ID',
        'Student ID',
        'First Name', 
        'Last Name',
        'Program',
        'Location',
        'Enrollment Date',
        'Stage',
        'Progress (%)',
        'Delete Flag'
      ];

      const csvContent = [
        headers.join(','),
        ...studentData.map(student => [
          student.institutionId,
          student.studentId,
          `"${student.firstName}"`,
          `"${student.lastName}"`,
          `"${student.program}"`,
          `"${student.location}"`,
          student.enrollmentDate,
          student.stage,
          student.progress,
          student.deleteFlag ? 'Y' : 'N'
        ].join(','))
      ].join('\n');

      // Download CSV file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, `PTIRU_Student_Data_Report_${new Date().toISOString().split('T')[0]}.csv`);
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error generating PTIRU student report:', error);
      throw error;
    }
  }

  /**
   * Generate PTIRU Program Application Report in PDF format
   */
  static async generatePTIRUProgramReport(): Promise<void> {
    try {
      // Fetch program and intake data
      const { data: programs } = await supabase.from('programs').select('*').limit(50);
      const { data: intakes } = await supabase.from('intakes').select('*').limit(100);

      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.width;
      
      // Title
      pdf.setFontSize(18);
      pdf.text('PTIRU Program Application Report', pageWidth / 2, 20, { align: 'center' });
      
      pdf.setFontSize(12);
      pdf.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, 30, { align: 'center' });
      
      let yPosition = 50;
      
      // Program Summary
      pdf.setFontSize(14);
      pdf.text('Program Summary', 20, yPosition);
      yPosition += 15;
      
      pdf.setFontSize(10);
      const programCount = programs?.length || 0;
      const intakeCount = intakes?.length || 0;
      
      pdf.text(`Total Programs: ${programCount}`, 20, yPosition);
      yPosition += 10;
      pdf.text(`Total Intakes: ${intakeCount}`, 20, yPosition);
      yPosition += 10;
      pdf.text(`Max Enrollment Capacity: ${intakes?.reduce((sum, intake) => sum + (intake.capacity || 0), 0) || 0}`, 20, yPosition);
      yPosition += 20;
      
      // Intake Details
      pdf.setFontSize(14);
      pdf.text('Intake Models', 20, yPosition);
      yPosition += 15;
      
      pdf.setFontSize(10);
      (intakes || []).forEach((intake, index) => {
        if (yPosition > 250) {
          pdf.addPage();
          yPosition = 20;
        }
        
        pdf.text(`${index + 1}. ${intake.name}`, 20, yPosition);
        yPosition += 8;
        pdf.text(`   Capacity: ${intake.capacity}`, 25, yPosition);
        yPosition += 8;
        pdf.text(`   Start Date: ${intake.start_date}`, 25, yPosition);
        yPosition += 8;
        pdf.text(`   Delivery: ${intake.delivery_method}`, 25, yPosition);
        yPosition += 8;
        pdf.text(`   Status: ${intake.status}`, 25, yPosition);
        yPosition += 12;
      });

      // Download PDF
      pdf.save(`PTIRU_Program_Application_Report_${new Date().toISOString().split('T')[0]}.pdf`);
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error generating PTIRU program report:', error);
      throw error;
    }
  }

  /**
   * Generate DQAB Institutional Report in PDF format
   */
  static async generateDQABInstitutionalReport(): Promise<void> {
    try {
      // Fetch company profile data
      const { data: companyProfile } = await supabase
        .from('company_profile')
        .select('*')
        .single();

      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.width;
      
      // Title
      pdf.setFontSize(18);
      pdf.text('DQAB Institutional Report', pageWidth / 2, 20, { align: 'center' });
      
      pdf.setFontSize(12);
      pdf.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, 30, { align: 'center' });
      
      let yPosition = 50;
      
      // Institution Information
      pdf.setFontSize(14);
      pdf.text('Institution Information', 20, yPosition);
      yPosition += 15;
      
      pdf.setFontSize(10);
      const profile = companyProfile || {};
      
      pdf.text(`Name: ${(profile as any)?.name || 'Not specified'}`, 20, yPosition);
      yPosition += 10;
      pdf.text(`Mission: ${(profile as any)?.mission || 'Not specified'}`, 20, yPosition);
      yPosition += 10;
      pdf.text(`Vision: ${(profile as any)?.vision || 'Not specified'}`, 20, yPosition);
      yPosition += 10;
      pdf.text(`Location: ${(profile as any)?.address || 'Not specified'}`, 20, yPosition);
      yPosition += 10;
      pdf.text(`Founded: ${(profile as any)?.founded_year || 'Not specified'}`, 20, yPosition);
      yPosition += 20;
      
      // Academic Structure
      pdf.setFontSize(14);
      pdf.text('Academic Structure', 20, yPosition);
      yPosition += 15;
      
      pdf.setFontSize(10);
      pdf.text('• Semester-based academic calendar', 20, yPosition);
      yPosition += 8;
      pdf.text('• Competency-based curriculum', 20, yPosition);
      yPosition += 8;
      pdf.text('• Industry-aligned program delivery', 20, yPosition);
      yPosition += 8;
      pdf.text('• Practical and theoretical components', 20, yPosition);
      yPosition += 20;
      
      // Compliance Information
      pdf.setFontSize(14);
      pdf.text('Compliance & Quality Assurance', 20, yPosition);
      yPosition += 15;
      
      pdf.setFontSize(10);
      pdf.text('• Regular program reviews conducted', 20, yPosition);
      yPosition += 8;
      pdf.text('• Industry stakeholder engagement', 20, yPosition);
      yPosition += 8;
      pdf.text('• Student outcome tracking', 20, yPosition);
      yPosition += 8;
      pdf.text('• Continuous improvement processes', 20, yPosition);

      // Download PDF
      pdf.save(`DQAB_Institutional_Report_${new Date().toISOString().split('T')[0]}.pdf`);
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error generating DQAB institutional report:', error);
      throw error;
    }
  }

  /**
   * Generate DQAB Compliance Summary in Excel format
   */
  static async generateDQABComplianceReport(): Promise<void> {
    try {
      // Create workbook with multiple sheets
      const workbook = XLSX.utils.book_new();
      
      // Compliance Overview Sheet
      const complianceData = [
        ['Compliance Area', 'Status', 'Last Review', 'Next Review', 'Notes'],
        ['Academic Standards', 'Compliant', '2024-01-15', '2024-07-15', 'Annual review completed'],
        ['Faculty Qualifications', 'Compliant', '2024-02-01', '2024-08-01', 'All credentials verified'],
        ['Student Services', 'Compliant', '2024-01-20', '2024-07-20', 'Services audit passed'],
        ['Facilities & Equipment', 'Under Review', '2024-03-01', '2024-09-01', 'Equipment upgrade in progress'],
        ['Quality Assurance', 'Compliant', '2024-02-15', '2024-08-15', 'QA processes documented']
      ];
      
      const complianceSheet = XLSX.utils.aoa_to_sheet(complianceData);
      XLSX.utils.book_append_sheet(workbook, complianceSheet, 'Compliance Overview');
      
      // Program Credentials Sheet
      const credentialsData = [
        ['Program Name', 'Credential Type', 'Accreditation Body', 'Valid Until', 'Status'],
        ['Health Care Assistant', 'Certificate', 'PTIB', '2025-12-31', 'Active'],
        ['Aviation Maintenance', 'Diploma', 'Transport Canada', '2026-06-30', 'Active'],
        ['Early Childhood Education', 'Certificate', 'ECE Registry', '2025-09-30', 'Active']
      ];
      
      const credentialsSheet = XLSX.utils.aoa_to_sheet(credentialsData);
      XLSX.utils.book_append_sheet(workbook, credentialsSheet, 'Program Credentials');
      
      // Generate Excel file
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      saveAs(blob, `DQAB_Compliance_Summary_${new Date().toISOString().split('T')[0]}.xlsx`);
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error generating DQAB compliance report:', error);
      throw error;
    }
  }
}