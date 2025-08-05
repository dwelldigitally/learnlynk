import React from "react"

export interface HelpContent {
  [key: string]: React.ReactNode
}

export const helpContent: HelpContent = {
  // Lead Management
  leadScore: (
    <div className="space-y-2">
      <p className="font-medium">Lead Score</p>
      <p>A numerical value (0-100) indicating how likely a lead is to convert based on their profile, behavior, and engagement.</p>
      <ul className="list-disc list-inside text-xs space-y-1 mt-2">
        <li>0-30: Low priority</li>
        <li>31-60: Medium priority</li>
        <li>61-100: High priority</li>
      </ul>
    </div>
  ),
  conversionRate: (
    <div className="space-y-2">
      <p className="font-medium">Conversion Rate</p>
      <p>The percentage of leads that successfully convert to enrolled students over a specific time period.</p>
      <p className="text-xs mt-1">Formula: (Converted Leads ÷ Total Leads) × 100</p>
    </div>
  ),
  leadSource: (
    <div className="space-y-2">
      <p className="font-medium">Lead Source</p>
      <p>The channel or method through which a lead first discovered your institution.</p>
      <ul className="list-disc list-inside text-xs space-y-1 mt-2">
        <li>Web: Direct website visits</li>
        <li>Social Media: Facebook, Instagram, LinkedIn</li>
        <li>Event: Campus tours, education fairs</li>
        <li>Referral: Word-of-mouth recommendations</li>
      </ul>
    </div>
  ),
  leadPriority: (
    <div className="space-y-2">
      <p className="font-medium">Lead Priority</p>
      <p>Manual or automated classification of lead urgency based on deadlines and engagement.</p>
      <ul className="list-disc list-inside text-xs space-y-1 mt-2">
        <li>Low: General inquiries</li>
        <li>Medium: Active consideration</li>
        <li>High: Ready to apply</li>
        <li>Urgent: Immediate action required</li>
      </ul>
    </div>
  ),
  pipelineStages: (
    <div className="space-y-2">
      <p className="font-medium">Pipeline Stages</p>
      <p>Sequential steps that track a lead's journey from first contact to enrollment.</p>
      <ul className="list-disc list-inside text-xs space-y-1 mt-2">
        <li>New: Just captured</li>
        <li>Contacted: Initial outreach made</li>
        <li>Qualified: Meets basic criteria</li>
        <li>Nurturing: Building relationship</li>
        <li>Converted: Successfully enrolled</li>
      </ul>
    </div>
  ),
  routingRules: (
    <div className="space-y-2">
      <p className="font-medium">Lead Routing Rules</p>
      <p>Automated assignment logic that distributes leads to advisors based on predefined criteria.</p>
      <ul className="list-disc list-inside text-xs space-y-1 mt-2">
        <li>Round Robin: Equal distribution</li>
        <li>Geography: Location-based</li>
        <li>Performance: Top performer priority</li>
        <li>Workload: Balanced assignments</li>
      </ul>
    </div>
  ),
  
  // Student Management
  applicationStage: (
    <div className="space-y-2">
      <p className="font-medium">Application Stage</p>
      <p>Current step in the application process that determines what actions are needed next.</p>
      <ul className="list-disc list-inside text-xs space-y-1 mt-2">
        <li>LEAD_FORM: Initial inquiry submitted</li>
        <li>SEND_DOCUMENTS: Awaiting required documents</li>
        <li>REVIEW: Application under evaluation</li>
        <li>INTERVIEW: Interview scheduled/completed</li>
        <li>DECISION: Final admission decision</li>
      </ul>
    </div>
  ),
  riskAssessment: (
    <div className="space-y-2">
      <p className="font-medium">Risk Assessment</p>
      <p>AI-powered evaluation of a student's likelihood to complete their program successfully.</p>
      <ul className="list-disc list-inside text-xs space-y-1 mt-2">
        <li>Low Risk: High completion probability</li>
        <li>Medium Risk: May need additional support</li>
        <li>High Risk: Requires intervention</li>
      </ul>
    </div>
  ),
  enrollmentStatus: (
    <div className="space-y-2">
      <p className="font-medium">Enrollment Status</p>
      <p>Current registration state of the student in their program.</p>
      <ul className="list-disc list-inside text-xs space-y-1 mt-2">
        <li>Pending: Application submitted</li>
        <li>Accepted: Admission granted</li>
        <li>Enrolled: Actively studying</li>
        <li>Deferred: Delayed start date</li>
        <li>Withdrawn: No longer enrolled</li>
      </ul>
    </div>
  ),
  
  // Program Management
  programType: (
    <div className="space-y-2">
      <p className="font-medium">Program Type</p>
      <p>Classification of educational offerings based on duration and academic level.</p>
      <ul className="list-disc list-inside text-xs space-y-1 mt-2">
        <li>Certificate: Short-term skill-based</li>
        <li>Diploma: Medium-term professional</li>
        <li>Degree: Long-term academic</li>
        <li>Workshop: Single-session training</li>
      </ul>
    </div>
  ),
  intakeManagement: (
    <div className="space-y-2">
      <p className="font-medium">Intake Management</p>
      <p>Planning and coordination of student enrollment periods throughout the academic year.</p>
      <p className="text-xs mt-1">Includes application deadlines, start dates, and capacity planning.</p>
    </div>
  ),
  capacityMetrics: (
    <div className="space-y-2">
      <p className="font-medium">Capacity vs Enrollment</p>
      <p>Comparison between maximum student capacity and current enrollment numbers.</p>
      <ul className="list-disc list-inside text-xs space-y-1 mt-2">
        <li>Capacity: Maximum students allowed</li>
        <li>Enrolled: Currently registered students</li>
        <li>Available: Remaining spots</li>
        <li>Fill Rate: (Enrolled ÷ Capacity) × 100</li>
      </ul>
    </div>
  ),
  
  // Analytics & Reporting
  kpiDefinitions: (
    <div className="space-y-2">
      <p className="font-medium">Key Performance Indicators</p>
      <p>Essential metrics that measure institutional performance and success.</p>
      <ul className="list-disc list-inside text-xs space-y-1 mt-2">
        <li>Lead-to-Enrollment Rate</li>
        <li>Average Processing Time</li>
        <li>Revenue per Student</li>
        <li>Retention Rate</li>
      </ul>
    </div>
  ),
  processingTime: (
    <div className="space-y-2">
      <p className="font-medium">Processing Time</p>
      <p>Average duration from application submission to final admission decision.</p>
      <p className="text-xs mt-1">Shorter processing times typically improve conversion rates.</p>
    </div>
  ),
  revenueMetrics: (
    <div className="space-y-2">
      <p className="font-medium">Revenue Metrics</p>
      <p>Financial performance indicators tracked across programs and time periods.</p>
      <ul className="list-disc list-inside text-xs space-y-1 mt-2">
        <li>Total Revenue: All fee collections</li>
        <li>Revenue per Student: Average fee per enrollment</li>
        <li>Outstanding Fees: Unpaid balances</li>
        <li>Payment Completion Rate: On-time payments</li>
      </ul>
    </div>
  ),
  
  // Form Builder
  fieldTypes: (
    <div className="space-y-2">
      <p className="font-medium">Form Field Types</p>
      <p>Different input types for collecting specific information from applicants.</p>
      <ul className="list-disc list-inside text-xs space-y-1 mt-2">
        <li>Text: Names, addresses</li>
        <li>Email: Contact information</li>
        <li>Select: Program choices</li>
        <li>Multi-select: Multiple interests</li>
        <li>File: Document uploads</li>
      </ul>
    </div>
  ),
  conditionalLogic: (
    <div className="space-y-2">
      <p className="font-medium">Conditional Logic</p>
      <p>Rules that show or hide form fields based on previous answers, creating dynamic forms.</p>
      <p className="text-xs mt-1">Example: Show "Previous Education" field only if "Education Level" is "Graduate"</p>
    </div>
  ),
  validationRules: (
    <div className="space-y-2">
      <p className="font-medium">Validation Rules</p>
      <p>Requirements that ensure submitted data meets specific criteria before acceptance.</p>
      <ul className="list-disc list-inside text-xs space-y-1 mt-2">
        <li>Required: Must be filled</li>
        <li>Min/Max Length: Character limits</li>
        <li>Pattern: Email format, phone numbers</li>
        <li>File Size: Upload limitations</li>
      </ul>
    </div>
  ),
  
  // General Terms
  aiScoring: (
    <div className="space-y-2">
      <p className="font-medium">AI Scoring</p>
      <p>Machine learning algorithms that automatically evaluate and score leads based on multiple data points.</p>
      <p className="text-xs mt-1">More accurate than manual scoring and updates in real-time.</p>
    </div>
  ),
  bulkOperations: (
    <div className="space-y-2">
      <p className="font-medium">Bulk Operations</p>
      <p>Actions that can be performed on multiple records simultaneously to improve efficiency.</p>
      <ul className="list-disc list-inside text-xs space-y-1 mt-2">
        <li>Bulk assignment to advisors</li>
        <li>Status updates</li>
        <li>Tag management</li>
        <li>Export/import operations</li>
      </ul>
    </div>
  ),
  tags: (
    <div className="space-y-2">
      <p className="font-medium">Tags</p>
      <p>Custom labels used to categorize and organize records for easier filtering and reporting.</p>
      <p className="text-xs mt-1">Examples: "International", "Scholarship", "VIP", "Follow-up Required"</p>
    </div>
  ),
  leadCapture: (
    <div className="space-y-2">
      <p className="font-medium">Lead Capture Forms</p>
      <p>Digital forms designed to collect contact information and initial interest from prospective students.</p>
      <ul className="list-disc list-inside text-xs space-y-1 mt-2">
        <li>Embed on websites or landing pages</li>
        <li>Track form performance and submissions</li>
        <li>Automatically create leads in the system</li>
        <li>Customize fields based on program requirements</li>
      </ul>
    </div>
  ),
  formConversion: (
    <div className="space-y-2">
      <p className="font-medium">Form Conversion Rate</p>
      <p>Percentage of form views that result in completed submissions.</p>
      <p className="text-xs mt-1">Higher conversion rates indicate more effective form design and placement.</p>
    </div>
  ),
  formSettings: (
    <div className="space-y-2">
      <p className="font-medium">Form Settings</p>
      <p>Basic configuration for your lead capture form including name, description, and redirect behavior.</p>
      <p className="text-xs mt-1">The redirect URL determines where users go after submitting the form.</p>
    </div>
  ),
  formName: (
    <div className="space-y-2">
      <p className="font-medium">Form Name</p>
      <p>Internal name for the form, used for identification in your admin panel.</p>
      <p className="text-xs mt-1">Not visible to form users - choose something descriptive for your team.</p>
    </div>
  ),
  formDescription: (
    <div className="space-y-2">
      <p className="font-medium">Form Description</p>
      <p>Internal description to help team members understand the form's purpose and usage.</p>
    </div>
  ),
  redirectUrl: (
    <div className="space-y-2">
      <p className="font-medium">Redirect URL</p>
      <p>Page where users are sent after successfully submitting the form.</p>
      <p className="text-xs mt-1">Best practice: Use a thank you page with next steps or program information.</p>
    </div>
  ),
  fieldLabel: (
    <div className="space-y-2">
      <p className="font-medium">Field Label</p>
      <p>The text displayed to users above the input field.</p>
      <p className="text-xs mt-1">Keep labels clear and concise. Use action words like "Enter your email".</p>
    </div>
  ),
  leadManagement: (
    <div className="space-y-2">
      <p className="font-medium">Lead Management System</p>
      <p>Comprehensive platform for tracking, nurturing, and converting prospective students into enrollments.</p>
      <ul className="list-disc list-inside text-xs space-y-1 mt-2">
        <li>Automated lead scoring and routing</li>
        <li>Communication tracking and follow-ups</li>
        <li>Performance analytics and reporting</li>
        <li>Integration with marketing campaigns</li>
      </ul>
    </div>
  )
}

export function useHelpContent() {
  const getHelpContent = (key: string): React.ReactNode => {
    return helpContent[key] || (
      <div className="space-y-2">
        <p className="font-medium">Help Content</p>
        <p>Information about this feature is being updated. Contact support for assistance.</p>
      </div>
    )
  }

  return { getHelpContent, helpContent }
}