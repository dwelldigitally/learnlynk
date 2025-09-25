
import { ProgramApplication, ApplicationDocument } from "@/types/application";
import { programRequirements } from "./programRequirements";

// Mock documents for Health Care Assistant (Stage 2 - SEND_DOCUMENTS)
const hcaDocuments: ApplicationDocument[] = [
  {
    id: "doc-1",
    name: "Official_Transcripts.pdf",
    type: "PDF",
    size: 2048000,
    uploadDate: new Date("2025-01-15"),
    status: "approved",
    comments: [],
    requirementId: "hca-transcripts"
  },
  {
    id: "doc-2",
    name: "Photo_ID.jpg",
    type: "JPG",
    size: 1024000,
    uploadDate: new Date("2025-01-15"),
    status: "approved",
    comments: [],
    requirementId: "hca-photo-id"
  },
  {
    id: "doc-3",
    name: "Immunization_Records.pdf",
    type: "PDF",
    size: 1536000,
    uploadDate: new Date("2025-01-16"),
    status: "under-review",
    comments: [],
    requirementId: "hca-immunization"
  },
  {
    id: "doc-4",
    name: "Criminal_Record_Check.pdf",
    type: "PDF",
    size: 512000,
    uploadDate: new Date("2025-01-14"),
    status: "approved",
    comments: [],
    requirementId: "hca-criminal-check"
  },
  {
    id: "doc-5",
    name: "First_Aid_Certificate.pdf",
    type: "PDF",
    size: 768000,
    uploadDate: new Date("2025-01-16"),
    status: "rejected",
    comments: [
      {
        id: "comment-1",
        author: "Nicole Ye",
        text: "Certificate has expired. Please upload a current First Aid certificate.",
        timestamp: new Date("2025-01-17"),
        isAdvisor: true
      }
    ],
    requirementId: "hca-first-aid"
  }
];

export const studentApplications: Record<string, ProgramApplication> = {
  "Health Care Assistant": {
    id: "HCA-1047859",
    programName: "Health Care Assistant",
    stage: "SEND_DOCUMENTS",
    progress: 75,
    acceptanceLikelihood: 80,
    submissionDate: new Date("2025-01-15"),
    estimatedDecision: new Date("2025-02-15"),
    documents: hcaDocuments,
    requirements: programRequirements["Health Care Assistant"],
    nextStep: "Upload missing documents and wait for approval",
    applicationDeadline: "1st March 2025"
  },
  "Aviation": {
    id: "AVN-1047860",
    programName: "Aviation",
    stage: "LEAD_FORM",
    progress: 20,
    acceptanceLikelihood: 25,
    documents: [],
    requirements: programRequirements["Aviation"],
    nextStep: "Complete application form and submit required documents",
    applicationDeadline: "5th January 2025"
  },
  "Education Assistant": {
    id: "EA-1047861",
    programName: "Education Assistant",
    stage: "LEAD_FORM",
    progress: 20,
    acceptanceLikelihood: 30,
    documents: [],
    requirements: programRequirements["Education Assistant"],
    nextStep: "Complete application form and submit required documents",
    applicationDeadline: "20th January 2025"
  },
  "Hospitality": {
    id: "HOSP-1047862",
    programName: "Hospitality",
    stage: "LEAD_FORM",
    progress: 20,
    acceptanceLikelihood: 35,
    documents: [],
    requirements: programRequirements["Hospitality"],
    nextStep: "Complete application form and submit required documents",
    applicationDeadline: "15th February 2025"
  },
  "ECE": {
    id: "ECE-1047863",
    programName: "ECE",
    stage: "LEAD_FORM",
    progress: 20,
    acceptanceLikelihood: 40,
    documents: [],
    requirements: programRequirements["ECE"],
    nextStep: "Complete application form and submit required documents",
    applicationDeadline: "25th January 2025"
  },
  "MLA": {
    id: "MLA-1047864",
    programName: "MLA",
    stage: "LEAD_FORM",
    progress: 20,
    acceptanceLikelihood: 30,
    documents: [],
    requirements: programRequirements["MLA"],
    nextStep: "Complete application form and submit required documents",
    applicationDeadline: "15th December 2024"
  },
  "Computer Science": {
    id: "CS-1047865",
    programName: "Computer Science",
    stage: "DOCUMENT_APPROVAL",
    progress: 90,
    acceptanceLikelihood: 85,
    submissionDate: new Date("2025-01-10"),
    estimatedDecision: new Date("2025-02-01"),
    documents: [
      {
        id: "doc-cs-1",
        name: "Official_Transcripts.pdf",
        type: "PDF",
        size: 2048000,
        uploadDate: new Date("2025-01-10"),
        status: "approved",
        comments: [],
        requirementId: "cs-transcripts"
      },
      {
        id: "doc-cs-2",
        name: "Personal_Statement.pdf",
        type: "PDF",
        size: 1024000,
        uploadDate: new Date("2025-01-11"),
        status: "approved",
        comments: [],
        requirementId: "cs-personal-statement"
      }
    ],
    requirements: programRequirements["Health Care Assistant"], // Using HCA requirements as placeholder
    nextStep: "Decision pending - all documents approved",
    applicationDeadline: "15th March 2025"
  },
  "Business Administration": {
    id: "BA-1047866",
    programName: "Business Administration",
    stage: "WAITLISTED",
    progress: 100,
    acceptanceLikelihood: 60,
    submissionDate: new Date("2024-12-15"),
    estimatedDecision: new Date("2025-01-20"),
    documents: [
      {
        id: "doc-ba-1",
        name: "Official_Transcripts.pdf",
        type: "PDF",
        size: 2048000,
        uploadDate: new Date("2024-12-15"),
        status: "approved",
        comments: [],
        requirementId: "ba-transcripts"
      },
      {
        id: "doc-ba-2",
        name: "Work_Experience_Letter.pdf",
        type: "PDF",
        size: 512000,
        uploadDate: new Date("2024-12-16"),
        status: "approved",
        comments: [],
        requirementId: "ba-work-experience"
      }
    ],
    requirements: programRequirements["Health Care Assistant"], // Using HCA requirements as placeholder
    nextStep: "Position #12 on waitlist - maintain your spot",
    applicationDeadline: "30th January 2025"
  },
  "Nursing": {
    id: "NUR-1047867",
    programName: "Nursing",
    stage: "ACCEPTED",
    progress: 100,
    acceptanceLikelihood: 100,
    submissionDate: new Date("2024-11-20"),
    estimatedDecision: new Date("2024-12-20"),
    documents: [
      {
        id: "doc-nur-1",
        name: "Official_Transcripts.pdf",
        type: "PDF",
        size: 2048000,
        uploadDate: new Date("2024-11-20"),
        status: "approved",
        comments: [],
        requirementId: "nur-transcripts"
      },
      {
        id: "doc-nur-2",
        name: "Prerequisites_Certificate.pdf",
        type: "PDF",
        size: 1536000,
        uploadDate: new Date("2024-11-21"),
        status: "approved",
        comments: [],
        requirementId: "nur-prerequisites"
      }
    ],
    requirements: programRequirements["Health Care Assistant"], // Using HCA requirements as placeholder
    nextStep: "Accept offer and complete enrollment by February 15th",
    applicationDeadline: "15th February 2025"
  },
  "Engineering Technology": {
    id: "ET-1047868",
    programName: "Engineering Technology",
    stage: "DECLINED",
    progress: 100,
    acceptanceLikelihood: 0,
    submissionDate: new Date("2024-10-15"),
    estimatedDecision: new Date("2024-11-15"),
    documents: [
      {
        id: "doc-et-1",
        name: "Official_Transcripts.pdf",
        type: "PDF",
        size: 2048000,
        uploadDate: new Date("2024-10-15"),
        status: "approved",
        comments: [],
        requirementId: "et-transcripts"
      },
      {
        id: "doc-et-2",
        name: "Math_Prerequisites.pdf",
        type: "PDF",
        size: 768000,
        uploadDate: new Date("2024-10-16"),
        status: "rejected",
        comments: [
          {
            id: "comment-et-1",
            author: "Dr. Sarah Johnson",
            text: "Mathematics prerequisites do not meet program requirements. Consider completing additional coursework.",
            timestamp: new Date("2024-11-10"),
            isAdvisor: true
          }
        ],
        requirementId: "et-math-prerequisites"
      }
    ],
    requirements: programRequirements["Health Care Assistant"], // Using HCA requirements as placeholder
    nextStep: "Application unsuccessful - consider reapplying after completing prerequisites",
    applicationDeadline: "Closed"
  }
};
