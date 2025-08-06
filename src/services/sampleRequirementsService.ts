import type { EntryRequirement } from '@/types/program';

export interface RequirementTemplate extends EntryRequirement {
  category: string;
  usageCount: number;
  isSystemTemplate: boolean;
  applicablePrograms: string[];
}

// Academic Requirements
const academicRequirements: RequirementTemplate[] = [
  {
    id: 'academic-1',
    type: 'academic',
    title: 'High School Diploma or Equivalent',
    description: 'Completion of Grade 12 or equivalent certification (GED)',
    mandatory: true,
    details: 'Must provide official transcripts showing graduation from an accredited high school or equivalent certification.',
    minimumGrade: 'Grade 12',
    alternatives: ['GED Certificate', 'International Baccalaureate', 'Adult High School Diploma'],
    category: 'Academic',
    usageCount: 45,
    isSystemTemplate: true,
    applicablePrograms: ['All Programs']
  },
  {
    id: 'academic-2',
    type: 'academic',
    title: 'Post-Secondary Education',
    description: 'Completion of relevant post-secondary education or training',
    mandatory: false,
    details: 'Diploma, degree, or certificate from an accredited post-secondary institution in a related field.',
    minimumGrade: 'C+ Average',
    alternatives: ['Professional Certification', 'Trade School Certificate', 'Apprenticeship Completion'],
    category: 'Academic',
    usageCount: 23,
    isSystemTemplate: true,
    applicablePrograms: ['Healthcare', 'Technology', 'Business']
  },
  {
    id: 'academic-3',
    type: 'academic',
    title: 'Mathematics Prerequisite',
    description: 'Grade 12 Mathematics or equivalent',
    mandatory: true,
    details: 'Successful completion of Grade 12 Mathematics with minimum grade requirement.',
    minimumGrade: 'C',
    alternatives: ['Math Placement Test', 'College-level Math Course', 'Math Upgrading Program'],
    category: 'Academic',
    usageCount: 18,
    isSystemTemplate: true,
    applicablePrograms: ['Engineering', 'Healthcare', 'Technology']
  },
  {
    id: 'academic-4',
    type: 'academic',
    title: 'Science Prerequisite',
    description: 'Grade 12 Biology, Chemistry, or Physics',
    mandatory: true,
    details: 'At least one Grade 12 science course with laboratory component.',
    minimumGrade: 'B-',
    alternatives: ['University Science Course', 'Science Upgrading', 'CLEP Science Exam'],
    category: 'Academic',
    usageCount: 15,
    isSystemTemplate: true,
    applicablePrograms: ['Healthcare', 'Laboratory Sciences', 'Veterinary']
  },
  {
    id: 'academic-5',
    type: 'academic',
    title: 'Portfolio Submission',
    description: 'Creative portfolio demonstrating relevant skills and experience',
    mandatory: true,
    details: 'Submit a portfolio of 10-15 pieces showcasing creative work, technical skills, or project outcomes.',
    alternatives: ['Digital Portfolio', 'Video Presentation', 'Live Demonstration'],
    category: 'Academic',
    usageCount: 8,
    isSystemTemplate: true,
    applicablePrograms: ['Design', 'Arts', 'Media']
  }
];

// Language Requirements
const languageRequirements: RequirementTemplate[] = [
  {
    id: 'language-1',
    type: 'language',
    title: 'English Proficiency - IELTS',
    description: 'International English Language Testing System (IELTS) Academic',
    mandatory: true,
    details: 'Minimum overall band score of 6.5 with no individual band below 6.0.',
    minimumGrade: '6.5',
    alternatives: ['TOEFL iBT (80+)', 'CAEL (60+)', 'PTE Academic (58+)'],
    category: 'Language',
    usageCount: 32,
    isSystemTemplate: true,
    applicablePrograms: ['All Programs - International Students']
  },
  {
    id: 'language-2',
    type: 'language',
    title: 'English Proficiency - TOEFL',
    description: 'Test of English as a Foreign Language (TOEFL) iBT',
    mandatory: true,
    details: 'Minimum score of 80 overall with minimum 20 in each section.',
    minimumGrade: '80',
    alternatives: ['IELTS (6.5+)', 'CAEL (60+)', 'Duolingo (110+)'],
    category: 'Language',
    usageCount: 28,
    isSystemTemplate: true,
    applicablePrograms: ['All Programs - International Students']
  },
  {
    id: 'language-3',
    type: 'language',
    title: 'French Language Proficiency',
    description: 'Demonstrated proficiency in French language',
    mandatory: false,
    details: 'TEF Canada or TCF Canada with minimum CLB 7 in all skill areas.',
    minimumGrade: 'CLB 7',
    alternatives: ['DELF B2', 'DALF C1', 'University French Courses'],
    category: 'Language',
    usageCount: 12,
    isSystemTemplate: true,
    applicablePrograms: ['Quebec Programs', 'Bilingual Programs']
  },
  {
    id: 'language-4',
    type: 'language',
    title: 'Native English Speaker Verification',
    description: 'Verification of education in English-speaking institution',
    mandatory: false,
    details: 'Official transcripts from accredited English-speaking educational institution.',
    alternatives: ['Language Assessment Test', 'English Proficiency Interview'],
    category: 'Language',
    usageCount: 15,
    isSystemTemplate: true,
    applicablePrograms: ['All Programs']
  }
];

// Experience Requirements
const experienceRequirements: RequirementTemplate[] = [
  {
    id: 'experience-1',
    type: 'experience',
    title: 'Relevant Work Experience',
    description: 'Minimum 2 years of relevant work experience in the field',
    mandatory: false,
    details: 'Employment verification letters and detailed job descriptions required.',
    alternatives: ['Volunteer Experience (3 years)', 'Internship + Coursework', 'Related Field Experience'],
    category: 'Experience',
    usageCount: 22,
    isSystemTemplate: true,
    applicablePrograms: ['Healthcare', 'Business', 'Technology']
  },
  {
    id: 'experience-2',
    type: 'experience',
    title: 'Healthcare Experience',
    description: 'Direct patient care or healthcare environment experience',
    mandatory: true,
    details: 'Minimum 100 hours of volunteer or paid experience in healthcare setting.',
    alternatives: ['Medical Office Experience', 'Long-term Care Volunteer', 'Hospital Volunteer'],
    category: 'Experience',
    usageCount: 18,
    isSystemTemplate: true,
    applicablePrograms: ['Nursing', 'Healthcare Assistant', 'Medical Office']
  },
  {
    id: 'experience-3',
    type: 'experience',
    title: 'Customer Service Experience',
    description: 'Experience in customer-facing roles',
    mandatory: false,
    details: 'Demonstrated ability to work with diverse populations and handle customer inquiries.',
    alternatives: ['Retail Experience', 'Hospitality Experience', 'Call Center Experience'],
    category: 'Experience',
    usageCount: 14,
    isSystemTemplate: true,
    applicablePrograms: ['Business', 'Hospitality', 'Customer Service']
  },
  {
    id: 'experience-4',
    type: 'experience',
    title: 'Professional Certification',
    description: 'Industry-recognized professional certification',
    mandatory: false,
    details: 'Current certification in good standing from recognized professional body.',
    alternatives: ['Professional Development Courses', 'Industry Training', 'Continuing Education'],
    category: 'Experience',
    usageCount: 11,
    isSystemTemplate: true,
    applicablePrograms: ['Technology', 'Healthcare', 'Trades']
  }
];

// Health Requirements
const healthRequirements: RequirementTemplate[] = [
  {
    id: 'health-1',
    type: 'health',
    title: 'Medical Clearance',
    description: 'Medical examination and clearance from licensed physician',
    mandatory: true,
    details: 'Complete physical examination within 6 months of program start date.',
    alternatives: ['Nurse Practitioner Assessment', 'Occupational Health Assessment'],
    category: 'Health',
    usageCount: 25,
    isSystemTemplate: true,
    applicablePrograms: ['Healthcare', 'Childcare', 'Food Services']
  },
  {
    id: 'health-2',
    type: 'health',
    title: 'Immunization Records',
    description: 'Up-to-date immunization records as per provincial requirements',
    mandatory: true,
    details: 'Hepatitis B, MMR, Tdap, seasonal flu, and COVID-19 vaccinations required.',
    alternatives: ['Titer Testing for Immunity', 'Medical Exemption Documentation'],
    category: 'Health',
    usageCount: 23,
    isSystemTemplate: true,
    applicablePrograms: ['Healthcare', 'Childcare', 'Education']
  },
  {
    id: 'health-3',
    type: 'health',
    title: 'CPR/First Aid Certification',
    description: 'Current CPR and First Aid certification',
    mandatory: true,
    details: 'Level C CPR and Standard First Aid certification from recognized provider.',
    alternatives: ['Basic Life Support (BLS)', 'Wilderness First Aid', 'Emergency Medical Responder'],
    category: 'Health',
    usageCount: 19,
    isSystemTemplate: true,
    applicablePrograms: ['Healthcare', 'Childcare', 'Recreation']
  },
  {
    id: 'health-4',
    type: 'health',
    title: 'Physical Fitness Standards',
    description: 'Meet minimum physical fitness requirements',
    mandatory: true,
    details: 'Ability to lift 50 lbs, stand for extended periods, and perform physical tasks.',
    alternatives: ['Accommodation Assessment', 'Modified Duties Assessment'],
    category: 'Health',
    usageCount: 8,
    isSystemTemplate: true,
    applicablePrograms: ['Healthcare', 'Trades', 'Emergency Services']
  }
];

// Age Requirements
const ageRequirements: RequirementTemplate[] = [
  {
    id: 'age-1',
    type: 'age',
    title: 'Minimum Age - 18 Years',
    description: 'Must be at least 18 years of age at program commencement',
    mandatory: true,
    details: 'Proof of age required with government-issued photo identification.',
    alternatives: ['Mature Student Status (17 with conditions)', 'Early Admission Assessment'],
    category: 'Age',
    usageCount: 42,
    isSystemTemplate: true,
    applicablePrograms: ['Most Adult Programs']
  },
  {
    id: 'age-2',
    type: 'age',
    title: 'Minimum Age - 19 Years',
    description: 'Must be at least 19 years of age for healthcare programs',
    mandatory: true,
    details: 'Required for programs involving direct patient care or clinical placements.',
    alternatives: ['Conditional Acceptance (18 with early birthday)'],
    category: 'Age',
    usageCount: 15,
    isSystemTemplate: true,
    applicablePrograms: ['Healthcare', 'Nursing']
  },
  {
    id: 'age-3',
    type: 'age',
    title: 'Mature Student Entry',
    description: 'Alternative entry for students 21+ without traditional prerequisites',
    mandatory: false,
    details: 'Assessment of life experience and career goals in lieu of academic prerequisites.',
    alternatives: ['Academic Upgrading', 'Bridging Programs', 'Challenge Exams'],
    category: 'Age',
    usageCount: 8,
    isSystemTemplate: true,
    applicablePrograms: ['All Programs']
  }
];

// Other Requirements
const otherRequirements: RequirementTemplate[] = [
  {
    id: 'other-1',
    type: 'other',
    title: 'Criminal Background Check',
    description: 'Clear criminal background check including vulnerable sector screening',
    mandatory: true,
    details: 'Police background check dated within 6 months of program start date.',
    alternatives: ['International Police Clearance', 'RCMP Check'],
    category: 'Other',
    usageCount: 35,
    isSystemTemplate: true,
    applicablePrograms: ['Healthcare', 'Childcare', 'Education']
  },
  {
    id: 'other-2',
    type: 'other',
    title: 'Reference Letters',
    description: 'Two professional or academic reference letters',
    mandatory: true,
    details: 'References from employers, instructors, or professional contacts who can attest to character and ability.',
    alternatives: ['Character References', 'Professional Recommendations', 'Academic References'],
    category: 'Other',
    usageCount: 28,
    isSystemTemplate: true,
    applicablePrograms: ['All Programs']
  },
  {
    id: 'other-3',
    type: 'other',
    title: 'Personal Interview',
    description: 'Admission interview with program faculty',
    mandatory: true,
    details: '30-45 minute interview to assess motivation, communication skills, and program fit.',
    alternatives: ['Group Interview', 'Video Interview', 'Portfolio Review Meeting'],
    category: 'Other',
    usageCount: 16,
    isSystemTemplate: true,
    applicablePrograms: ['Competitive Programs', 'Healthcare', 'Education']
  },
  {
    id: 'other-4',
    type: 'other',
    title: 'Entrance Examination',
    description: 'Written entrance exam covering program-specific content',
    mandatory: true,
    details: 'Assessment of basic knowledge and aptitude in relevant subject areas.',
    alternatives: ['Online Assessment', 'Skills Demonstration', 'Placement Test'],
    category: 'Other',
    usageCount: 12,
    isSystemTemplate: true,
    applicablePrograms: ['Nursing', 'Technology', 'Trades']
  },
  {
    id: 'other-5',
    type: 'other',
    title: 'Technology Requirements',
    description: 'Access to computer and reliable internet connection',
    mandatory: true,
    details: 'Required for online learning components and program communications.',
    alternatives: ['Institution Computer Access', 'Library Access', 'Mobile Device with Apps'],
    category: 'Other',
    usageCount: 30,
    isSystemTemplate: true,
    applicablePrograms: ['Online Programs', 'Hybrid Programs']
  },
  {
    id: 'other-6',
    type: 'other',
    title: 'Student Declaration',
    description: 'Signed declaration of understanding program requirements',
    mandatory: true,
    details: 'Acknowledgment of program demands, expectations, and commitment to completion.',
    alternatives: ['Digital Signature', 'Witnessed Declaration'],
    category: 'Other',
    usageCount: 40,
    isSystemTemplate: true,
    applicablePrograms: ['All Programs']
  }
];

export const getAllSampleRequirements = (): RequirementTemplate[] => {
  return [
    ...academicRequirements,
    ...languageRequirements,
    ...experienceRequirements,
    ...healthRequirements,
    ...ageRequirements,
    ...otherRequirements
  ];
};

export const getRequirementsByType = (type: string): RequirementTemplate[] => {
  return getAllSampleRequirements().filter(req => req.type === type);
};

export const getRequirementsByCategory = (category: string): RequirementTemplate[] => {
  return getAllSampleRequirements().filter(req => req.category === category);
};

export const searchRequirements = (searchTerm: string): RequirementTemplate[] => {
  const term = searchTerm.toLowerCase();
  return getAllSampleRequirements().filter(req => 
    req.title.toLowerCase().includes(term) ||
    req.description.toLowerCase().includes(term) ||
    req.category.toLowerCase().includes(term)
  );
};

export const getCommonRequirements = (): RequirementTemplate[] => {
  return getAllSampleRequirements()
    .sort((a, b) => b.usageCount - a.usageCount)
    .slice(0, 10);
};

export const getRequirementsByProgram = (programType: string): RequirementTemplate[] => {
  return getAllSampleRequirements().filter(req => 
    req.applicablePrograms.includes(programType) || 
    req.applicablePrograms.includes('All Programs')
  );
};
