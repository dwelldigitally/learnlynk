import { useDemoDataAccess } from './demoDataService';

/**
 * Service to provide demo student data conditionally
 */
export class DemoStudentService {
  static getDemoStudents() {
    return [
      {
        id: 'demo-student-1',
        name: 'Alex Thompson',
        program: 'Health Care Assistant',
        status: 'active',
        progress: 85,
        lastActivity: '2 hours ago',
        email: 'alex.thompson@email.com',
        phone: '+1-555-0101',
        startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        gpa: 3.8,
        year: 'Year 2'
      },
      {
        id: 'demo-student-2',
        name: 'Jordan Smith',
        program: 'Early Childhood Education',
        status: 'active',
        progress: 72,
        lastActivity: '1 day ago',
        email: 'jordan.smith@email.com',
        phone: '+1-555-0102',
        startDate: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
        gpa: 3.6,
        year: 'Year 1'
      },
      {
        id: 'demo-student-3',
        name: 'Casey Wilson',
        program: 'Business Administration',
        status: 'pending',
        progress: 45,
        lastActivity: '3 days ago',
        email: 'casey.wilson@email.com',
        phone: '+1-555-0103',
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        gpa: 3.2,
        year: 'Year 1'
      }
    ];
  }

  static getDemoActivities() {
    return [
      {
        id: 'demo-activity-1',
        student: 'Alex Thompson',
        action: 'Submitted HCA application',
        time: '2 minutes ago',
        status: 'pending'
      },
      {
        id: 'demo-activity-2',
        student: 'Jordan Smith',
        action: 'Payment completed - ECE Program',
        time: '15 minutes ago',
        status: 'completed'
      },
      {
        id: 'demo-activity-3',
        student: 'Casey Wilson',
        action: 'Document verification required',
        time: '1 hour ago',
        status: 'action_required'
      }
    ];
  }

  static getDemoDocuments() {
    return [
      {
        id: 'demo-doc-1',
        name: 'Application Form',
        type: 'PDF',
        size: '2.3 MB',
        uploadDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'approved',
        studentName: 'Alex Thompson',
        category: 'Application Documents'
      },
      {
        id: 'demo-doc-2',
        name: 'Transcript',
        type: 'PDF',
        size: '1.8 MB',
        uploadDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
        studentName: 'Jordan Smith',
        category: 'Academic Records'
      },
      {
        id: 'demo-doc-3',
        name: 'ID Verification',
        type: 'JPG',
        size: '0.9 MB',
        uploadDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
        studentName: 'Casey Wilson',
        category: 'Identity Verification'
      }
    ];
  }

  static getDemoFinancialRecords() {
    return [
      {
        id: 'demo-payment-1',
        studentName: 'Alex Thompson',
        program: 'Health Care Assistant',
        amount: 2500,
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'paid',
        paymentMethod: 'Credit Card'
      },
      {
        id: 'demo-payment-2',
        studentName: 'Jordan Smith',
        program: 'Early Childhood Education',
        amount: 3200,
        dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
        paymentMethod: 'Bank Transfer'
      },
      {
        id: 'demo-payment-3',
        studentName: 'Casey Wilson',
        program: 'Business Administration',
        amount: 2800,
        dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'overdue',
        paymentMethod: 'Pending'
      }
    ];
  }

  static getDemoScholarshipApplications() {
    return [
      {
        id: 'demo-scholarship-1',
        studentName: 'Alex Thompson',
        scholarshipName: 'Academic Excellence Award',
        amount: 5000,
        applicationDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'approved',
        gpa: 3.8,
        program: 'Health Care Assistant',
        essay: 'Submitted',
        references: 2
      },
      {
        id: 'demo-scholarship-2',
        studentName: 'Jordan Smith',
        scholarshipName: 'Community Service Grant',
        amount: 2500,
        applicationDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'under_review',
        gpa: 3.6,
        program: 'Early Childhood Education',
        essay: 'Submitted',
        references: 3
      },
      {
        id: 'demo-scholarship-3',
        studentName: 'Casey Wilson',
        scholarshipName: 'Need-Based Assistance',
        amount: 3000,
        applicationDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
        gpa: 3.2,
        program: 'Business Administration',
        essay: 'Pending',
        references: 1
      }
    ];
  }
}