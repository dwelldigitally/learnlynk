import { STANDARDIZED_PROGRAMS } from './programs';

// Program-specific intake dates throughout the year
export const PROGRAM_INTAKE_DATES = {
  'Health Care Assistant': [
    { id: 'hca-2024-09', date: '2024-09-03', label: 'September 2024', capacity: 30, enrolled: 22 },
    { id: 'hca-2024-11', date: '2024-11-05', label: 'November 2024', capacity: 30, enrolled: 8 },
    { id: 'hca-2025-01', date: '2025-01-07', label: 'January 2025', capacity: 30, enrolled: 0 },
    { id: 'hca-2025-03', date: '2025-03-04', label: 'March 2025', capacity: 30, enrolled: 0 },
    { id: 'hca-2025-05', date: '2025-05-06', label: 'May 2025', capacity: 30, enrolled: 0 },
    { id: 'hca-2025-07', date: '2025-07-08', label: 'July 2025', capacity: 30, enrolled: 0 }
  ],
  'Education Assistant': [
    { id: 'ea-2024-09', date: '2024-09-10', label: 'September 2024', capacity: 25, enrolled: 18 },
    { id: 'ea-2024-12', date: '2024-12-02', label: 'December 2024', capacity: 25, enrolled: 5 },
    { id: 'ea-2025-02', date: '2025-02-03', label: 'February 2025', capacity: 25, enrolled: 0 },
    { id: 'ea-2025-04', date: '2025-04-07', label: 'April 2025', capacity: 25, enrolled: 0 },
    { id: 'ea-2025-06', date: '2025-06-02', label: 'June 2025', capacity: 25, enrolled: 0 },
    { id: 'ea-2025-08', date: '2025-08-04', label: 'August 2025', capacity: 25, enrolled: 0 }
  ],
  'Aviation': [
    { id: 'av-2024-10', date: '2024-10-15', label: 'October 2024', capacity: 40, enrolled: 35 },
    { id: 'av-2025-02', date: '2025-02-17', label: 'February 2025', capacity: 40, enrolled: 12 },
    { id: 'av-2025-06', date: '2025-06-16', label: 'June 2025', capacity: 40, enrolled: 0 },
    { id: 'av-2025-10', date: '2025-10-20', label: 'October 2025', capacity: 40, enrolled: 0 }
  ],
  'Hospitality': [
    { id: 'hosp-2024-10', date: '2024-10-08', label: 'October 2024', capacity: 35, enrolled: 28 },
    { id: 'hosp-2024-12', date: '2024-12-10', label: 'December 2024', capacity: 35, enrolled: 12 },
    { id: 'hosp-2025-02', date: '2025-02-11', label: 'February 2025', capacity: 35, enrolled: 0 },
    { id: 'hosp-2025-04', date: '2025-04-15', label: 'April 2025', capacity: 35, enrolled: 0 },
    { id: 'hosp-2025-06', date: '2025-06-17', label: 'June 2025', capacity: 35, enrolled: 0 },
    { id: 'hosp-2025-08', date: '2025-08-19', label: 'August 2025', capacity: 35, enrolled: 0 }
  ],
  'ECE': [
    { id: 'ece-2024-09', date: '2024-09-16', label: 'September 2024', capacity: 20, enrolled: 17 },
    { id: 'ece-2025-01', date: '2025-01-13', label: 'January 2025', capacity: 20, enrolled: 3 },
    { id: 'ece-2025-05', date: '2025-05-12', label: 'May 2025', capacity: 20, enrolled: 0 },
    { id: 'ece-2025-09', date: '2025-09-15', label: 'September 2025', capacity: 20, enrolled: 0 }
  ],
  'MLA': [
    { id: 'mla-2024-11', date: '2024-11-18', label: 'November 2024', capacity: 18, enrolled: 14 },
    { id: 'mla-2025-03', date: '2025-03-17', label: 'March 2025', capacity: 18, enrolled: 2 },
    { id: 'mla-2025-07', date: '2025-07-21', label: 'July 2025', capacity: 18, enrolled: 0 },
    { id: 'mla-2025-11', date: '2025-11-17', label: 'November 2025', capacity: 18, enrolled: 0 }
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