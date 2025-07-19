
import { ProgramRequirement } from "@/types/application";

export const programRequirements: Record<string, ProgramRequirement[]> = {
  "Health Care Assistant": [
    {
      id: "hca-transcripts",
      name: "Official Transcripts",
      description: "High school or post-secondary transcripts",
      mandatory: true,
      acceptedFormats: ["PDF", "JPG", "PNG"],
      maxSize: 10,
      stage: "SEND_DOCUMENTS"
    },
    {
      id: "hca-immunization",
      name: "Immunization Records",
      description: "Complete immunization history including COVID-19",
      mandatory: true,
      acceptedFormats: ["PDF", "JPG", "PNG"],
      maxSize: 5,
      stage: "SEND_DOCUMENTS"
    },
    {
      id: "hca-criminal-check",
      name: "Criminal Record Check",
      description: "Recent criminal background check (within 6 months)",
      mandatory: true,
      acceptedFormats: ["PDF"],
      maxSize: 5,
      stage: "SEND_DOCUMENTS"
    },
    {
      id: "hca-first-aid",
      name: "First Aid Certificate",
      description: "Valid CPR and First Aid certification",
      mandatory: true,
      acceptedFormats: ["PDF", "JPG", "PNG"],
      maxSize: 5,
      stage: "SEND_DOCUMENTS"
    },
    {
      id: "hca-photo-id",
      name: "Photo Identification",
      description: "Government-issued photo ID (passport, driver's license)",
      mandatory: true,
      acceptedFormats: ["PDF", "JPG", "PNG"],
      maxSize: 5,
      stage: "SEND_DOCUMENTS"
    }
  ],
  "Aviation": [
    {
      id: "avn-transcripts",
      name: "Official Transcripts",
      description: "High school transcripts with math and physics credits",
      mandatory: true,
      acceptedFormats: ["PDF", "JPG", "PNG"],
      maxSize: 10,
      stage: "SEND_DOCUMENTS"
    },
    {
      id: "avn-medical",
      name: "Flight Medical Certificate",
      description: "Category 1 or 3 medical certificate from Transport Canada",
      mandatory: true,
      acceptedFormats: ["PDF"],
      maxSize: 5,
      stage: "SEND_DOCUMENTS"
    },
    {
      id: "avn-english",
      name: "English Proficiency Test",
      description: "IELTS, TOEFL, or equivalent English proficiency certificate",
      mandatory: true,
      acceptedFormats: ["PDF", "JPG", "PNG"],
      maxSize: 5,
      stage: "SEND_DOCUMENTS"
    },
    {
      id: "avn-background",
      name: "Aviation Security Check",
      description: "Transport Canada security background check",
      mandatory: true,
      acceptedFormats: ["PDF"],
      maxSize: 5,
      stage: "SEND_DOCUMENTS"
    },
    {
      id: "avn-photo-id",
      name: "Photo Identification",
      description: "Government-issued photo ID",
      mandatory: true,
      acceptedFormats: ["PDF", "JPG", "PNG"],
      maxSize: 5,
      stage: "SEND_DOCUMENTS"
    }
  ],
  "Education Assistant": [
    {
      id: "ea-transcripts",
      name: "Official Transcripts",
      description: "High school or post-secondary transcripts",
      mandatory: true,
      acceptedFormats: ["PDF", "JPG", "PNG"],
      maxSize: 10,
      stage: "SEND_DOCUMENTS"
    },
    {
      id: "ea-clearance",
      name: "Child Interaction Clearance",
      description: "Criminal record check for working with children",
      mandatory: true,
      acceptedFormats: ["PDF"],
      maxSize: 5,
      stage: "SEND_DOCUMENTS"
    },
    {
      id: "ea-first-aid",
      name: "First Aid & CPR",
      description: "Valid First Aid and CPR certification",
      mandatory: true,
      acceptedFormats: ["PDF", "JPG", "PNG"],
      maxSize: 5,
      stage: "SEND_DOCUMENTS"
    },
    {
      id: "ea-references",
      name: "Reference Letters",
      description: "Two professional reference letters",
      mandatory: true,
      acceptedFormats: ["PDF", "DOC", "DOCX"],
      maxSize: 5,
      stage: "SEND_DOCUMENTS"
    }
  ],
  "Hospitality": [
    {
      id: "hosp-transcripts",
      name: "Official Transcripts",
      description: "High school or post-secondary transcripts",
      mandatory: true,
      acceptedFormats: ["PDF", "JPG", "PNG"],
      maxSize: 10,
      stage: "SEND_DOCUMENTS"
    },
    {
      id: "hosp-experience",
      name: "Work Experience Letter",
      description: "Customer service or hospitality work experience",
      mandatory: false,
      acceptedFormats: ["PDF", "DOC", "DOCX"],
      maxSize: 5,
      stage: "SEND_DOCUMENTS"
    },
    {
      id: "hosp-language",
      name: "Language Certificate",
      description: "English and/or French language proficiency",
      mandatory: true,
      acceptedFormats: ["PDF", "JPG", "PNG"],
      maxSize: 5,
      stage: "SEND_DOCUMENTS"
    },
    {
      id: "hosp-background",
      name: "Background Check",
      description: "Criminal background check",
      mandatory: true,
      acceptedFormats: ["PDF"],
      maxSize: 5,
      stage: "SEND_DOCUMENTS"
    }
  ],
  "ECE": [
    {
      id: "ece-transcripts",
      name: "Official Transcripts",
      description: "High school or post-secondary transcripts",
      mandatory: true,
      acceptedFormats: ["PDF", "JPG", "PNG"],
      maxSize: 10,
      stage: "SEND_DOCUMENTS"
    },
    {
      id: "ece-certification",
      name: "Child Development Certificate",
      description: "Early childhood development certification",
      mandatory: false,
      acceptedFormats: ["PDF", "JPG", "PNG"],
      maxSize: 5,
      stage: "SEND_DOCUMENTS"
    },
    {
      id: "ece-clearance",
      name: "Child Protection Check",
      description: "Enhanced criminal record check for children",
      mandatory: true,
      acceptedFormats: ["PDF"],
      maxSize: 5,
      stage: "SEND_DOCUMENTS"
    },
    {
      id: "ece-health",
      name: "Health Records",
      description: "Immunization and health clearance",
      mandatory: true,
      acceptedFormats: ["PDF", "JPG", "PNG"],
      maxSize: 5,
      stage: "SEND_DOCUMENTS"
    }
  ],
  "MLA": [
    {
      id: "mla-transcripts",
      name: "Official Transcripts",
      description: "High school transcripts with science prerequisites",
      mandatory: true,
      acceptedFormats: ["PDF", "JPG", "PNG"],
      maxSize: 10,
      stage: "SEND_DOCUMENTS"
    },
    {
      id: "mla-safety",
      name: "Lab Safety Training",
      description: "Laboratory safety training certificate",
      mandatory: true,
      acceptedFormats: ["PDF", "JPG", "PNG"],
      maxSize: 5,
      stage: "SEND_DOCUMENTS"
    },
    {
      id: "mla-health",
      name: "Health Records",
      description: "Immunization records and health clearance",
      mandatory: true,
      acceptedFormats: ["PDF", "JPG", "PNG"],
      maxSize: 5,
      stage: "SEND_DOCUMENTS"
    },
    {
      id: "mla-background",
      name: "Background Check",
      description: "Criminal background check for healthcare",
      mandatory: true,
      acceptedFormats: ["PDF"],
      maxSize: 5,
      stage: "SEND_DOCUMENTS"
    }
  ]
};
