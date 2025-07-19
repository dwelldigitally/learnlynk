
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
  }
};
