import { STANDARDIZED_PROGRAMS } from './programs';

// Program-specific intake dates throughout the year
export const PROGRAM_INTAKE_DATES = {
  'Health Care Assistant': [
    { id: 'hca-2025-10', date: '2025-10-07', label: 'October 2025', capacity: 30, enrolled: 5 },
    { id: 'hca-2025-11', date: '2025-11-04', label: 'November 2025', capacity: 30, enrolled: 2 },
    { id: 'hca-2025-12', date: '2025-12-02', label: 'December 2025', capacity: 30, enrolled: 0 },
    { id: 'hca-2026-01', date: '2026-01-06', label: 'January 2026', capacity: 30, enrolled: 0 },
    { id: 'hca-2026-03', date: '2026-03-02', label: 'March 2026', capacity: 30, enrolled: 0 },
    { id: 'hca-2026-05', date: '2026-05-05', label: 'May 2026', capacity: 30, enrolled: 0 }
  ],
  'Education Assistant': [
    { id: 'ea-2025-10', date: '2025-10-06', label: 'October 2025', capacity: 25, enrolled: 3 },
    { id: 'ea-2025-12', date: '2025-12-01', label: 'December 2025', capacity: 25, enrolled: 1 },
    { id: 'ea-2026-02', date: '2026-02-02', label: 'February 2026', capacity: 25, enrolled: 0 },
    { id: 'ea-2026-04', date: '2026-04-06', label: 'April 2026', capacity: 25, enrolled: 0 },
    { id: 'ea-2026-06', date: '2026-06-01', label: 'June 2026', capacity: 25, enrolled: 0 },
    { id: 'ea-2026-08', date: '2026-08-03', label: 'August 2026', capacity: 25, enrolled: 0 }
  ],
  'Aviation': [
    { id: 'av-2025-10', date: '2025-10-15', label: 'October 2025', capacity: 40, enrolled: 8 },
    { id: 'av-2025-11', date: '2025-11-17', label: 'November 2025', capacity: 40, enrolled: 4 },
    { id: 'av-2026-01', date: '2026-01-14', label: 'January 2026', capacity: 40, enrolled: 0 },
    { id: 'av-2026-04', date: '2026-04-16', label: 'April 2026', capacity: 40, enrolled: 0 },
    { id: 'av-2026-06', date: '2026-06-15', label: 'June 2026', capacity: 40, enrolled: 0 },
    { id: 'av-2026-09', date: '2026-09-14', label: 'September 2026', capacity: 40, enrolled: 0 }
  ],
  'Hospitality': [
    { id: 'hosp-2025-10', date: '2025-10-14', label: 'October 2025', capacity: 35, enrolled: 6 },
    { id: 'hosp-2025-12', date: '2025-12-09', label: 'December 2025', capacity: 35, enrolled: 2 },
    { id: 'hosp-2026-02', date: '2026-02-10', label: 'February 2026', capacity: 35, enrolled: 0 },
    { id: 'hosp-2026-04', date: '2026-04-14', label: 'April 2026', capacity: 35, enrolled: 0 },
    { id: 'hosp-2026-06', date: '2026-06-16', label: 'June 2026', capacity: 35, enrolled: 0 },
    { id: 'hosp-2026-08', date: '2026-08-18', label: 'August 2026', capacity: 35, enrolled: 0 }
  ],
  'ECE': [
    { id: 'ece-2025-10', date: '2025-10-13', label: 'October 2025', capacity: 20, enrolled: 4 },
    { id: 'ece-2026-01', date: '2026-01-12', label: 'January 2026', capacity: 20, enrolled: 0 },
    { id: 'ece-2026-05', date: '2026-05-11', label: 'May 2026', capacity: 20, enrolled: 0 },
    { id: 'ece-2026-09', date: '2026-09-14', label: 'September 2026', capacity: 20, enrolled: 0 },
    { id: 'ece-2027-01', date: '2027-01-11', label: 'January 2027', capacity: 20, enrolled: 0 },
    { id: 'ece-2027-05', date: '2027-05-10', label: 'May 2027', capacity: 20, enrolled: 0 }
  ],
  'MLA': [
    { id: 'mla-2025-11', date: '2025-11-17', label: 'November 2025', capacity: 18, enrolled: 3 },
    { id: 'mla-2026-01', date: '2026-01-19', label: 'January 2026', capacity: 18, enrolled: 0 },
    { id: 'mla-2026-03', date: '2026-03-16', label: 'March 2026', capacity: 18, enrolled: 0 },
    { id: 'mla-2026-07', date: '2026-07-20', label: 'July 2026', capacity: 18, enrolled: 0 },
    { id: 'mla-2026-11', date: '2026-11-16', label: 'November 2026', capacity: 18, enrolled: 0 },
    { id: 'mla-2027-03', date: '2027-03-15', label: 'March 2027', capacity: 18, enrolled: 0 }
  ]
} as const;

export type ProgramIntakeDate = {
  id: string;
  date: string;
  label: string;
  capacity: number;
  enrolled: number;
};

// Helper function to get intake dates for a specific program
export const getIntakeDatesForProgram = (program: string): ProgramIntakeDate[] => {
  if (program in PROGRAM_INTAKE_DATES) {
    return [...PROGRAM_INTAKE_DATES[program as keyof typeof PROGRAM_INTAKE_DATES]];
  }
  return [];
};

// Helper function to get all upcoming intake dates (future dates only)
export const getUpcomingIntakeDatesForProgram = (program: string): ProgramIntakeDate[] => {
  const currentDate = new Date();
  const intakeDates = getIntakeDatesForProgram(program);
  
  return intakeDates.filter(intake => new Date(intake.date) > currentDate);
};

// Helper function to format intake date for display
export const formatIntakeDate = (intake: ProgramIntakeDate): string => {
  const date = new Date(intake.date);
  const availableSpots = intake.capacity - intake.enrolled;
  const status = availableSpots > 0 ? `${availableSpots} spots available` : 'Full';
  
  return `${intake.label} - ${status}`;
};