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
    domesticFee: 18000,
    internationalFee: 25000,
    description: 'Prepare for a rewarding career in healthcare support, providing essential care and assistance to patients in various healthcare settings.',
    deliveryMethods: ['In-class', 'Hybrid'],
    campusLocations: ['Surrey Campus', 'Vancouver Campus'],
    requirements: ['High School Diploma', 'English Proficiency', 'Medical Clearance']
  },
  'Education Assistant': {
    type: 'Certificate', 
    duration: '8 months',
    tuition: 15000,
    domesticFee: 15000,
    internationalFee: 22000,
    description: 'Support students and teachers in educational environments, helping create positive learning experiences for all.',
    deliveryMethods: ['In-class', 'Online'],
    campusLocations: ['Surrey Campus', 'Burnaby Campus'],
    requirements: ['High School Diploma', 'Background Check']
  },
  'Aviation': {
    type: 'Diploma',
    duration: '18 months', 
    tuition: 35000,
    domesticFee: 35000,
    internationalFee: 48000,
    description: 'Launch your career in aviation with comprehensive training in aircraft maintenance, flight operations, and industry safety standards.',
    deliveryMethods: ['In-class'],
    campusLocations: ['Richmond Campus'],
    requirements: ['High School Diploma', 'Math Proficiency', 'Physical Requirements']
  },
  'Hospitality': {
    type: 'Certificate',
    duration: '12 months',
    tuition: 16000,
    domesticFee: 16000,
    internationalFee: 23000,
    description: 'Master the art of hospitality and customer service, preparing for exciting opportunities in hotels, restaurants, and tourism.',
    deliveryMethods: ['In-class', 'Hybrid', 'Online'],
    campusLocations: ['Vancouver Campus', 'Surrey Campus'],
    requirements: ['High School Diploma', 'Customer Service Experience']
  },
  'ECE': {
    type: 'Diploma',
    duration: '24 months',
    tuition: 22000,
    domesticFee: 22000,
    internationalFee: 32000,
    description: 'Shape young minds through early childhood education, fostering development and learning in children from birth to age 5.',
    deliveryMethods: ['In-class', 'Hybrid'],
    campusLocations: ['Surrey Campus', 'Burnaby Campus', 'Vancouver Campus'],
    requirements: ['High School Diploma', 'Background Check', 'First Aid Certification']
  },
  'MLA': {
    type: 'Certificate',
    duration: '14 months',
    tuition: 20000,
    domesticFee: 20000,
    internationalFee: 28000,
    description: 'Enter the growing field of medical laboratory technology, performing crucial tests that support patient diagnosis and treatment.',
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