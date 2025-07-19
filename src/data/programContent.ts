
import healthcareWelcome from "@/assets/healthcare-welcome.jpg";
import ucatMaster from "@/assets/ucat-master.jpg";
import ucatScore from "@/assets/ucat-score.jpg";
import ucatUltimate from "@/assets/ucat-ultimate.jpg";
import authorAhmed from "@/assets/author-ahmed.jpg";
import authorSarah from "@/assets/author-sarah.jpg";
import authorRobert from "@/assets/author-robert.jpg";

interface ProgramWelcomeContent {
  welcomeText: string;
  welcomeImage: string;
  newsTitle: string;
  events: Array<{
    id: string;
    title: string;
    description: string;
    image: string;
    author: {
      name: string;
      role: string;
      avatar: string;
    };
    duration: string;
    lessons: number;
  }>;
}

export const programWelcomeContent: Record<string, ProgramWelcomeContent> = {
  "Health Care Assistant": {
    welcomeText: "We are so excited that you are applying for the Health Care Assistant Program. There are 5 steps to apply for the program. You can stop anytime and continue later.",
    welcomeImage: healthcareWelcome,
    newsTitle: "Latest HCA News & Events",
    events: [
      {
        id: "1",
        title: "Patient Care Excellence Workshop",
        description: "Essential techniques for compassionate patient care and communication",
        image: healthcareWelcome,
        author: {
          name: "Dr. Sarah Mitchell",
          role: "Healthcare Instructor",
          avatar: authorSarah
        },
        duration: "3 Hours",
        lessons: 8
      },
      {
        id: "2",
        title: "Medical Terminology Mastery",
        description: "Comprehensive guide to healthcare terminology and documentation",
        image: ucatScore,
        author: {
          name: "Ahmed Shafi",
          role: "Clinical Expert",
          avatar: authorAhmed
        },
        duration: "5 Hours",
        lessons: 12
      },
      {
        id: "3",
        title: "Infection Control & Safety",
        description: "Critical protocols for maintaining safe healthcare environments",
        image: ucatUltimate,
        author: {
          name: "Mr. Robert Turner",
          role: "Safety Coordinator",
          avatar: authorRobert
        },
        duration: "4 Hours",
        lessons: 10
      }
    ]
  },
  "Aviation": {
    welcomeText: "We are thrilled that you are pursuing a career in Aviation. The aviation industry offers exciting opportunities for pilots, air traffic controllers, and aviation technicians. Complete the 5 application steps to begin your journey in the skies.",
    welcomeImage: ucatMaster,
    newsTitle: "Latest Aviation News & Events",
    events: [
      {
        id: "1",
        title: "Flight Safety & Procedures",
        description: "Essential safety protocols and emergency procedures for aviation professionals",
        image: ucatMaster,
        author: {
          name: "Captain Sarah Johnson",
          role: "Flight Instructor",
          avatar: authorSarah
        },
        duration: "6 Hours",
        lessons: 15
      },
      {
        id: "2",
        title: "Aviation Weather Systems",
        description: "Understanding meteorology and weather patterns for safe flight operations",
        image: ucatScore,
        author: {
          name: "Ahmed Shafi",
          role: "Meteorology Expert",
          avatar: authorAhmed
        },
        duration: "4 Hours",
        lessons: 10
      },
      {
        id: "3",
        title: "Aircraft Systems & Maintenance",
        description: "Comprehensive overview of aircraft systems and maintenance protocols",
        image: ucatUltimate,
        author: {
          name: "Mr. Robert Turner",
          role: "Aviation Technician",
          avatar: authorRobert
        },
        duration: "8 Hours",
        lessons: 20
      }
    ]
  },
  "Education Assistant": {
    welcomeText: "We are excited to support your journey in Education. As an Education Assistant, you'll make a meaningful difference in children's lives while supporting teachers in creating positive learning environments. Start your application journey today.",
    welcomeImage: healthcareWelcome,
    newsTitle: "Latest Education News & Events",
    events: [
      {
        id: "1",
        title: "Classroom Management Strategies",
        description: "Effective techniques for supporting diverse learning environments",
        image: healthcareWelcome,
        author: {
          name: "Dr. Sarah Mitchell",
          role: "Education Specialist",
          avatar: authorSarah
        },
        duration: "4 Hours",
        lessons: 12
      },
      {
        id: "2",
        title: "Child Development Fundamentals",
        description: "Understanding developmental stages and supporting student growth",
        image: ucatScore,
        author: {
          name: "Ahmed Shafi",
          role: "Child Psychology Expert",
          avatar: authorAhmed
        },
        duration: "6 Hours",
        lessons: 16
      },
      {
        id: "3",
        title: "Special Needs Support",
        description: "Supporting students with diverse learning needs and abilities",
        image: ucatUltimate,
        author: {
          name: "Mr. Robert Turner",
          role: "Special Education Coordinator",
          avatar: authorRobert
        },
        duration: "5 Hours",
        lessons: 14
      }
    ]
  },
  "Hospitality": {
    welcomeText: "Welcome to the exciting world of Hospitality! From luxury hotels to fine dining, the hospitality industry offers diverse career opportunities. Our program will prepare you for success in this dynamic field. Begin your application process now.",
    welcomeImage: ucatMaster,
    newsTitle: "Latest Hospitality News & Events",
    events: [
      {
        id: "1",
        title: "Customer Service Excellence",
        description: "Mastering guest relations and creating memorable experiences",
        image: ucatMaster,
        author: {
          name: "Dr. Sarah Mitchell",
          role: "Hospitality Manager",
          avatar: authorSarah
        },
        duration: "3 Hours",
        lessons: 9
      },
      {
        id: "2",
        title: "Hotel Operations Management",
        description: "Understanding front desk, housekeeping, and hotel management systems",
        image: ucatScore,
        author: {
          name: "Ahmed Shafi",
          role: "Hotel Operations Expert",
          avatar: authorAhmed
        },
        duration: "7 Hours",
        lessons: 18
      },
      {
        id: "3",
        title: "Food & Beverage Service",
        description: "Professional service standards for restaurants and banquet operations",
        image: ucatUltimate,
        author: {
          name: "Mr. Robert Turner",
          role: "F&B Director",
          avatar: authorRobert
        },
        duration: "5 Hours",
        lessons: 13
      }
    ]
  },
  "ECE": {
    welcomeText: "Welcome to Early Childhood Education! Shape young minds and support families by becoming an ECE professional. Our comprehensive program prepares you to create nurturing learning environments for children. Start your application journey today.",
    welcomeImage: healthcareWelcome,
    newsTitle: "Latest ECE News & Events",
    events: [
      {
        id: "1",
        title: "Early Learning Development",
        description: "Supporting cognitive and social development in young children",
        image: healthcareWelcome,
        author: {
          name: "Dr. Sarah Mitchell",
          role: "Child Development Specialist",
          avatar: authorSarah
        },
        duration: "6 Hours",
        lessons: 15
      },
      {
        id: "2",
        title: "Play-Based Learning",
        description: "Creating engaging and educational play experiences for children",
        image: ucatScore,
        author: {
          name: "Ahmed Shafi",
          role: "Early Learning Expert",
          avatar: authorAhmed
        },
        duration: "4 Hours",
        lessons: 11
      },
      {
        id: "3",
        title: "Family Engagement Strategies",
        description: "Building strong partnerships with families and communities",
        image: ucatUltimate,
        author: {
          name: "Mr. Robert Turner",
          role: "Family Support Coordinator",
          avatar: authorRobert
        },
        duration: "3 Hours",
        lessons: 8
      }
    ]
  },
  "MLA": {
    welcomeText: "Welcome to Medical Laboratory Assistant program! Join the healthcare team as a vital part of medical diagnosis and treatment. Our program combines scientific knowledge with hands-on laboratory skills. Begin your healthcare career application today.",
    welcomeImage: ucatMaster,
    newsTitle: "Latest MLA News & Events",
    events: [
      {
        id: "1",
        title: "Laboratory Safety Protocols",
        description: "Essential safety procedures and hazardous material handling",
        image: ucatMaster,
        author: {
          name: "Dr. Sarah Mitchell",
          role: "Lab Safety Supervisor",
          avatar: authorSarah
        },
        duration: "5 Hours",
        lessons: 12
      },
      {
        id: "2",
        title: "Clinical Chemistry Basics",
        description: "Understanding blood work, urinalysis, and diagnostic testing",
        image: ucatScore,
        author: {
          name: "Ahmed Shafi",
          role: "Clinical Chemistry Expert",
          avatar: authorAhmed
        },
        duration: "8 Hours",
        lessons: 20
      },
      {
        id: "3",
        title: "Microbiology & Pathology",
        description: "Identifying pathogens and supporting disease diagnosis",
        image: ucatUltimate,
        author: {
          name: "Mr. Robert Turner",
          role: "Microbiology Technician",
          avatar: authorRobert
        },
        duration: "6 Hours",
        lessons: 16
      }
    ]
  }
};
