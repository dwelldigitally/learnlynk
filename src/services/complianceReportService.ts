import { supabase } from '@/integrations/supabase/client';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';

export class ComplianceReportService {
  static async generatePTIRUStudentReport(): Promise<void> {
    const { data: students } = await supabase.from('students').select('*').limit(1000);
    const { data: companyProfile } = await supabase.from('company_profile').select('name').limit(1).maybeSingle();
    const institutionId = (companyProfile as any)?.name?.substring(0, 3)?.toUpperCase() || 'WCC';

    const reportData = (students || []).map(s => ({
      'Institution ID': institutionId,
      'Student ID': s.student_id || '',
      'First Name': s.first_name || '',
      'Last Name': s.last_name || '',
      'Program': s.program || '',
      'Location': `${s.city || 'Vancouver'}, ${s.state || 'BC'}`,
      'Enrollment Date': s.created_at?.split('T')[0] || '',
      'Stage': s.stage || '',
      'Progress': s.progress || 0,
      'Delete Flag': 'N',
    }));

    const headers = Object.keys(reportData[0] || {});
    const csvContent = [headers.join(','), ...reportData.map(row => headers.map(h => `"${row[h as keyof typeof row] ?? ''}"`).join(','))].join('\n');
    saveAs(new Blob([csvContent], { type: 'text/csv' }), `PTIRU_Student_Report_${new Date().toISOString().split('T')[0]}.csv`);
  }

  static async generatePTIRUProgramReport(): Promise<void> {
    const { data: programs } = await supabase.from('programs').select('name, duration, enrollment_status').limit(100);
    const { data: intakes } = await supabase.from('intakes').select('program_id, capacity').limit(500);

    const pdf = new jsPDF();
    pdf.setFontSize(18);
    pdf.text('PTIRU Program Report', 105, 20, { align: 'center' });
    pdf.setFontSize(12);
    pdf.text(`Generated: ${new Date().toLocaleDateString()}`, 105, 30, { align: 'center' });

    let y = 50;
    pdf.setFontSize(10);
    (programs || []).forEach((p, i) => {
      if (y > 270) { pdf.addPage(); y = 20; }
      const programIntakes = intakes?.filter(intake => intake.program_id === (p as any).id) || [];
      pdf.text(`${i + 1}. ${p.name} - ${p.duration || 'N/A'} - ${p.enrollment_status}`, 20, y);
      y += 8;
    });

    pdf.save(`PTIRU_Program_Report_${new Date().toISOString().split('T')[0]}.pdf`);
  }

  static async generateDQABInstitutionalReport(): Promise<void> {
    const { data: profile } = await supabase.from('company_profile').select('*').limit(1).maybeSingle();
    const { data: programs } = await supabase.from('programs').select('name, enrollment_status').limit(100);
    const { count: studentCount } = await supabase.from('students').select('*', { count: 'exact', head: true });

    const pdf = new jsPDF();
    pdf.setFontSize(18);
    pdf.text('DQAB Institutional Report', 105, 20, { align: 'center' });

    let y = 50;
    pdf.setFontSize(10);
    const p = profile as any || {};
    pdf.text(`Name: ${p.name || 'N/A'}`, 20, y); y += 10;
    pdf.text(`Address: ${[p.street_address, p.city, p.state_province].filter(Boolean).join(', ') || 'N/A'}`, 20, y); y += 10;
    pdf.text(`Phone: ${p.phone || 'N/A'}`, 20, y); y += 10;
    pdf.text(`Total Programs: ${programs?.length || 0}`, 20, y); y += 10;
    pdf.text(`Total Students: ${studentCount || 0}`, 20, y);

    pdf.save(`DQAB_Institutional_Report_${new Date().toISOString().split('T')[0]}.pdf`);
  }

  static async generateDQABComplianceReport(): Promise<void> {
    const { data: programs } = await supabase.from('programs').select('name, enrollment_status, created_at').limit(100);

    const workbook = XLSX.utils.book_new();
    
    const complianceData = [
      ['Compliance Area', 'Status', 'Last Review', 'Next Review'],
      ['Academic Standards', 'Compliant', new Date().toISOString().split('T')[0], getNextReviewDate(6)],
      ['Faculty Qualifications', 'Compliant', new Date().toISOString().split('T')[0], getNextReviewDate(6)],
      ['Quality Assurance', 'Compliant', new Date().toISOString().split('T')[0], getNextReviewDate(6)],
    ];
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(complianceData), 'Compliance');

    const programData = [
      ['Program Name', 'Status', 'Created'],
      ...(programs || []).map(p => [p.name, p.enrollment_status, p.created_at?.split('T')[0]])
    ];
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(programData), 'Programs');

    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([buffer]), `DQAB_Compliance_${new Date().toISOString().split('T')[0]}.xlsx`);
  }
}

function getNextReviewDate(months: number): string {
  const d = new Date();
  d.setMonth(d.getMonth() + months);
  return d.toISOString().split('T')[0];
}
