import { ApplicationData, ComprehensiveStudentProfile } from '@/types/applicationData';

export const getMockApplicationData = (applicantId: string): ComprehensiveStudentProfile => {
  const baseProfiles: Record<string, Partial<ComprehensiveStudentProfile>> = {
    '1': {
      personalInfo: {
        firstName: 'Emily',
        lastName: 'Chen',
        email: 'emily.chen@email.com',
        phone: '+1-555-0123',
        dateOfBirth: new Date('1998-03-15'),
        nationality: 'Canadian',
        residenceCountry: 'Canada',
        emergencyContact: {
          name: 'David Chen',
          relationship: 'Father',
          phone: '+1-555-0124'
        }
      },
      essays: [
        {
          id: 'essay-1',
          type: 'personal_statement',
          title: 'Personal Statement',
          content: `Throughout my academic journey, I have been driven by an insatiable curiosity about how technology can transform healthcare outcomes. Growing up in a family where my grandmother struggled with diabetes management, I witnessed firsthand the challenges patients face in managing chronic conditions. This personal experience ignited my passion for developing innovative solutions that bridge the gap between medical expertise and patient empowerment.

My undergraduate studies in Computer Science at the University of Toronto provided me with a strong foundation in software development and data analysis. During my junior year, I had the opportunity to work on a research project with Dr. Sarah Johnson, where we developed a machine learning algorithm to predict patient readmission rates. This experience opened my eyes to the immense potential of artificial intelligence in healthcare and solidified my determination to pursue graduate studies in Health Informatics.

What sets me apart is my unique combination of technical expertise and genuine empathy for patient care. During my internship at Toronto General Hospital, I collaborated with nurses and physicians to understand their workflow challenges. I discovered that many clinical decisions were being made with incomplete information due to fragmented health records. This insight led me to develop a prototype application that aggregates patient data from multiple sources, providing clinicians with a comprehensive view of patient health status.

The Master's program in Health Informatics at your institution represents the perfect next step in my journey. I am particularly excited about Professor Martinez's research on predictive analytics for chronic disease management and Dr. Liu's work on user experience design in healthcare applications. I believe my background in machine learning, combined with my passion for improving patient outcomes, would allow me to contribute meaningfully to these research initiatives.

Looking toward the future, I envision myself leading interdisciplinary teams that develop patient-centered health technologies. My goal is to create solutions that not only leverage cutting-edge technology but also consider the human factors that determine their real-world effectiveness. I am committed to ensuring that technological advancements in healthcare are accessible, usable, and ultimately improve the quality of life for patients and their families.

Your program's emphasis on both technical rigor and practical application aligns perfectly with my career aspirations. I am eager to contribute to the vibrant research community and learn from distinguished faculty members who share my passion for transforming healthcare through innovation.`,
          wordCount: 347,
          submittedAt: new Date('2024-01-15'),
          aiAnalysis: {
            grammarScore: 95,
            clarityScore: 92,
            relevanceScore: 96,
            keyThemes: ['healthcare technology', 'patient empowerment', 'machine learning', 'interdisciplinary collaboration'],
            sentiment: 'positive',
            flaggedConcerns: []
          }
        },
        {
          id: 'essay-2',
          type: 'academic_goals',
          title: 'Academic and Research Goals',
          content: `My academic goals for the Master's program in Health Informatics are multifaceted and deeply rooted in my commitment to advancing healthcare through technology. I aim to develop expertise in three key areas: predictive analytics for clinical decision support, human-computer interaction in healthcare settings, and implementation science for health technologies.

First, I plan to focus my research on developing and validating predictive models that can assist clinicians in making more informed decisions about patient care. My undergraduate research experience has given me a solid foundation in machine learning, but I recognize the need to deepen my understanding of biostatistics, epidemiology, and clinical workflow integration. I am particularly interested in exploring how real-time data from wearable devices and electronic health records can be combined to create early warning systems for disease exacerbations.

Second, I want to develop strong competencies in user experience research and design thinking as applied to healthcare. I believe that the most sophisticated algorithms are meaningless if they cannot be seamlessly integrated into clinical practice. Through coursework in human factors engineering and hands-on projects with healthcare stakeholders, I aim to become proficient in designing interfaces that enhance rather than hinder clinical decision-making.

Third, I am eager to learn about implementation science and change management in healthcare organizations. Having witnessed the challenges of technology adoption during my hospital internship, I understand that successful health informatics solutions require careful consideration of organizational culture, workflow integration, and stakeholder buy-in. I plan to pursue courses in health systems management and conduct research on best practices for technology implementation in diverse healthcare settings.

Throughout the program, I intend to maintain strong connections with clinical practitioners and actively seek opportunities for interdisciplinary collaboration. I plan to participate in clinical shadowing experiences and attend medical grand rounds to ensure that my research remains grounded in real-world healthcare challenges. Additionally, I hope to contribute to peer-reviewed publications and present my work at conferences such as the American Medical Informatics Association annual symposium.

By the end of the program, I aim to have completed a thesis that not only advances theoretical knowledge in health informatics but also demonstrates clear potential for clinical impact. My ultimate goal is to emerge as a researcher and practitioner who can effectively bridge the gap between technical innovation and practical healthcare improvement.`,
          wordCount: 365,
          submittedAt: new Date('2024-01-15'),
          aiAnalysis: {
            grammarScore: 94,
            clarityScore: 90,
            relevanceScore: 98,
            keyThemes: ['predictive analytics', 'user experience', 'implementation science', 'interdisciplinary collaboration'],
            sentiment: 'positive',
            flaggedConcerns: []
          }
        }
      ],
      formResponses: [
        {
          id: 'q1',
          questionId: 'motivation-1',
          question: 'Why are you interested in this specific program?',
          answer: 'I am drawn to this program because of its unique emphasis on both technical excellence and practical healthcare application. The faculty\'s research in predictive analytics and the program\'s strong industry partnerships provide the perfect environment for pursuing my goals in health technology innovation.',
          questionType: 'text',
          category: 'motivation',
          submittedAt: new Date('2024-01-15'),
          aiScore: 9.2
        },
        {
          id: 'q2',
          questionId: 'experience-1',
          question: 'Describe your most significant professional experience.',
          answer: 'My internship at Toronto General Hospital was transformative. I worked directly with clinical teams to understand their workflow challenges and developed a prototype that improved patient data visualization. This experience taught me the importance of user-centered design in healthcare technology.',
          questionType: 'text',
          category: 'professional',
          submittedAt: new Date('2024-01-15'),
          aiScore: 8.8
        },
        {
          id: 'q3',
          questionId: 'goals-1',
          question: 'What are your long-term career goals?',
          answer: 'I aspire to lead interdisciplinary teams developing patient-centered health technologies. My goal is to ensure that technological advances in healthcare are not only innovative but also accessible and practical for real-world implementation.',
          questionType: 'text',
          category: 'professional',
          submittedAt: new Date('2024-01-15'),
          aiScore: 9.0
        }
      ]
    },
    '2': {
      personalInfo: {
        firstName: 'Marcus',
        lastName: 'Rodriguez',
        email: 'marcus.rodriguez@email.com',
        phone: '+1-555-0456',
        dateOfBirth: new Date('1997-08-22'),
        nationality: 'American',
        residenceCountry: 'United States',
        emergencyContact: {
          name: 'Maria Rodriguez',
          relationship: 'Mother',
          phone: '+1-555-0457'
        }
      },
      essays: [
        {
          id: 'essay-1',
          type: 'personal_statement',
          title: 'Statement of Purpose',
          content: `The intersection of business strategy and technological innovation has always fascinated me, but it was during my junior year internship at a fintech startup that I truly understood the transformative power of well-executed digital solutions. As I watched a small team revolutionize how small businesses access capital, I realized that my calling lies in leading organizations through strategic technological transformation.

My academic journey in Business Administration at UCLA has provided me with a comprehensive understanding of organizational behavior, financial analysis, and strategic planning. However, I recognized early on that traditional business education alone would not prepare me for the digital-first economy we're entering. This realization led me to pursue additional coursework in data analytics and to seek internships that would expose me to the intersection of business and technology.

During my internship at Sterling Financial, I was tasked with analyzing customer acquisition patterns and identifying opportunities for digital engagement. Through this project, I discovered that our most successful customer segments were those who engaged with our mobile platform regularly. This insight led to a strategic recommendation that resulted in a 35% increase in customer retention over six months. The experience taught me that successful business leaders in today's environment must be equally comfortable with spreadsheets and algorithms.

What particularly draws me to your MBA program is the emphasis on innovation and entrepreneurship, combined with strong foundations in traditional business disciplines. The Technology and Innovation track aligns perfectly with my career aspirations, and I am excited about the opportunity to work with Professor Chen on projects related to digital transformation in financial services.

My short-term goal is to join a management consulting firm where I can help established companies navigate digital transformation challenges. I am particularly interested in helping traditional industries leverage technology to improve customer experience and operational efficiency. Long-term, I envision founding my own consultancy that specializes in strategic technology implementation for mid-market companies.

I bring to your program not only strong analytical skills and business acumen but also a genuine passion for helping organizations unlock their potential through thoughtful technology adoption. I am excited about the opportunity to contribute to classroom discussions, collaborate with diverse peers, and learn from faculty who are at the forefront of business innovation.`,
          wordCount: 342,
          submittedAt: new Date('2024-01-20'),
          aiAnalysis: {
            grammarScore: 93,
            clarityScore: 91,
            relevanceScore: 94,
            keyThemes: ['digital transformation', 'business strategy', 'innovation', 'entrepreneurship'],
            sentiment: 'positive',
            flaggedConcerns: []
          }
        }
      ],
      formResponses: [
        {
          id: 'q1',
          questionId: 'leadership-1',
          question: 'Describe a leadership experience where you had to overcome significant challenges.',
          answer: 'As president of the Business Student Association, I led a team to organize our annual career fair during the pandemic. We had to completely reimagine the event as a virtual experience, coordinating with 50+ companies and 300+ students. Despite initial technical challenges, we achieved 95% attendance and received outstanding feedback.',
          questionType: 'text',
          category: 'personal',
          submittedAt: new Date('2024-01-20'),
          aiScore: 8.5
        }
      ]
    }
  };

  // Default profile structure
  const defaultProfile: ComprehensiveStudentProfile = {
    personalInfo: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@email.com',
      dateOfBirth: new Date('1998-01-01'),
      nationality: 'American',
      residenceCountry: 'United States',
      emergencyContact: {
        name: 'Jane Doe',
        relationship: 'Mother',
        phone: '+1-555-0000'
      }
    },
    essays: [],
    formResponses: [],
    academicBackground: [
      {
        id: 'academic-1',
        institution: 'University of California',
        degree: 'Bachelor of Science',
        fieldOfStudy: 'Computer Science',
        gpa: 3.8,
        maxGpa: 4.0,
        graduationDate: new Date('2023-05-15'),
        honors: ['Magna Cum Laude', 'Dean\'s List'],
        relevantCoursework: ['Data Structures', 'Machine Learning', 'Software Engineering'],
        transcriptSubmitted: true
      }
    ],
    professionalExperience: [
      {
        id: 'work-1',
        company: 'Tech Solutions Inc.',
        position: 'Software Engineering Intern',
        startDate: new Date('2023-06-01'),
        endDate: new Date('2023-08-31'),
        description: 'Developed web applications using React and Node.js',
        skills: ['React', 'Node.js', 'MongoDB'],
        relevanceToProgram: 8
      }
    ],
    extracurriculars: [
      {
        id: 'extra-1',
        name: 'Computer Science Club',
        role: 'Vice President',
        description: 'Organized coding workshops and hackathons',
        startDate: new Date('2022-09-01'),
        endDate: new Date('2023-05-15'),
        impact: 'Increased club membership by 40%',
        skills: ['Leadership', 'Event Planning']
      }
    ],
    languageProficiency: [
      {
        language: 'English',
        proficiency: 'native',
        certified: false
      }
    ],
    references: [
      {
        name: 'Dr. John Smith',
        position: 'Professor',
        institution: 'University of California',
        email: 'john.smith@university.edu',
        relationship: 'Academic Advisor',
        submitted: true
      }
    ],
    aiAssessment: {
      overallFitScore: 85,
      academicReadiness: 88,
      motivationLevel: 82,
      careerAlignment: 87,
      communicationSkills: 90,
      culturalFit: 83,
      riskFactors: [],
      strengths: ['Strong technical background', 'Clear career goals'],
      recommendations: ['Consider additional leadership experience']
    }
  };

  // Merge with specific profile data if available
  const specificProfile = baseProfiles[applicantId];
  if (specificProfile) {
    return {
      ...defaultProfile,
      ...specificProfile,
      personalInfo: {
        ...defaultProfile.personalInfo,
        ...specificProfile.personalInfo
      },
      essays: specificProfile.essays || defaultProfile.essays,
      formResponses: specificProfile.formResponses || defaultProfile.formResponses,
      academicBackground: specificProfile.academicBackground || defaultProfile.academicBackground,
      professionalExperience: specificProfile.professionalExperience || defaultProfile.professionalExperience,
      extracurriculars: specificProfile.extracurriculars || defaultProfile.extracurriculars,
      languageProficiency: specificProfile.languageProficiency || defaultProfile.languageProficiency,
      references: specificProfile.references || defaultProfile.references,
      aiAssessment: specificProfile.aiAssessment || defaultProfile.aiAssessment
    };
  }

  return defaultProfile;
};