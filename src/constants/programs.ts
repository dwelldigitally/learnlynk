// Standardized program list for the entire application
export const STANDARDIZED_PROGRAMS = [
  'Health Care Assistant',
  'Education Assistant',
  'Aviation',
  'Hospitality',
  'ECE',
  'MLA'
] as const;

export type StandardizedProgram = typeof STANDARDIZED_PROGRAMS[number];

// Program details for enhanced functionality
export const PROGRAM_DETAILS = {
  'Health Care Assistant': {
    type: 'Certificate',
    duration: '10 months',
    tuition: 18000,
    deliveryMethods: ['In-class', 'Hybrid'],
    campusLocations: ['Surrey Campus', 'Vancouver Campus'],
    requirements: ['High School Diploma', 'English Proficiency', 'Medical Clearance']
  },
  'Education Assistant': {
    type: 'Certificate', 
    duration: '8 months',
    tuition: 15000,
    deliveryMethods: ['In-class', 'Online'],
    campusLocations: ['Surrey Campus', 'Burnaby Campus'],
    requirements: ['High School Diploma', 'Background Check']
  },
  'Aviation': {
    type: 'Diploma',
    duration: '18 months', 
    tuition: 35000,
    deliveryMethods: ['In-class'],
    campusLocations: ['Richmond Campus'],
    requirements: ['High School Diploma', 'Math Proficiency', 'Physical Requirements']
  },
  'Hospitality': {
    type: 'Certificate',
    duration: '12 months',
    tuition: 16000,
    deliveryMethods: ['In-class', 'Hybrid', 'Online'],
    campusLocations: ['Vancouver Campus', 'Surrey Campus'],
    requirements: ['High School Diploma', 'Customer Service Experience']
  },
  'ECE': {
    type: 'Diploma',
    duration: '24 months',
    tuition: 22000,
    deliveryMethods: ['In-class', 'Hybrid'],
    campusLocations: ['Surrey Campus', 'Burnaby Campus', 'Vancouver Campus'],
    requirements: ['High School Diploma', 'Background Check', 'First Aid Certification']
  },
  'MLA': {
    type: 'Certificate',
    duration: '14 months',
    tuition: 20000,
    deliveryMethods: ['In-class', 'Online'],
    campusLocations: ['Richmond Campus', 'Surrey Campus'],
    requirements: ['High School Diploma', 'Science Prerequisites', 'Medical Clearance']
  }
} as const;

// Helper function to get program options for forms
export const getProgramOptions = () => {
  return STANDARDIZED_PROGRAMS.map(program => ({
    value: program,
    label: program
  }));
};

// Helper function to validate if a program is in the standardized list
export const isValidProgram = (program: string): program is StandardizedProgram => {
  return STANDARDIZED_PROGRAMS.includes(program as StandardizedProgram);
};