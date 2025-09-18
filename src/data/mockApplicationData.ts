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
          wordCount: 368,
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
        },
        {
          id: 'essay-3',
          type: 'motivation_letter',
          title: 'Letter of Motivation',
          content: `Dear Admissions Committee,

I am writing to express my strong interest in the Master's program in Health Informatics at your esteemed institution. As someone who has witnessed the profound impact of technology gaps in healthcare delivery, I am passionate about developing solutions that can bridge these divides and ultimately improve patient outcomes.

My journey toward health informatics began during my sophomore year when I volunteered at a local community health center. I observed how patients, particularly elderly individuals and those from underserved communities, struggled to navigate complex healthcare systems. Many missed appointments because they couldn't access online portals, others couldn't understand their discharge instructions, and some received duplicate tests because their medical records weren't properly integrated across different providers. These experiences made me realize that technology alone is not enough – we need thoughtful, human-centered design that considers the diverse needs of all patients.

During my undergraduate studies, I deliberately sought out opportunities to explore the intersection of technology and healthcare. I completed a summer research program at the National Institutes of Health, where I worked on a project analyzing social determinants of health data. This experience taught me the importance of considering not just clinical data, but also socioeconomic factors, environmental conditions, and cultural contexts when developing health solutions. I learned that effective health informatics requires a deep understanding of healthcare disparities and a commitment to developing equitable solutions.

What particularly attracts me to your program is its emphasis on translational research and community engagement. I am excited about the opportunity to work with Professor Williams on her research examining how mobile health interventions can be adapted for different cultural contexts. I am also interested in Dr. Thompson's work on reducing healthcare disparities through improved health information systems. These research areas align perfectly with my goal of developing culturally responsive health technologies.

I bring to your program not only technical skills in programming and data analysis, but also lived experience as someone who has navigated healthcare systems as a patient and advocate. Having grown up in a bilingual household and witnessed my parents' challenges in communicating with healthcare providers, I understand firsthand the barriers that many patients face. This personal experience has instilled in me a deep commitment to developing inclusive health technologies that serve all members of our diverse communities.

Looking forward, I plan to focus my thesis research on developing and evaluating interventions that can improve health literacy and patient engagement, particularly among underserved populations. I believe that health informatics has the potential to democratize access to healthcare information and empower patients to take a more active role in their care. However, this potential can only be realized if we design systems with intention, empathy, and a deep understanding of user needs.

I am confident that your program will provide me with the theoretical foundation, research skills, and practical experience necessary to become a leader in health informatics. I am eager to contribute to the program's vibrant research community and to learn from faculty members who share my commitment to health equity and innovation.

Thank you for considering my application. I look forward to the opportunity to discuss how my background, passion, and goals align with your program's mission.

Sincerely,
Emily Chen`,
          wordCount: 512,
          submittedAt: new Date('2024-01-15'),
          aiAnalysis: {
            grammarScore: 96,
            clarityScore: 94,
            relevanceScore: 97,
            keyThemes: ['health equity', 'community engagement', 'cultural responsiveness', 'patient empowerment'],
            sentiment: 'positive',
            flaggedConcerns: []
          }
        },
        {
          id: 'essay-4',
          type: 'research_interest',
          title: 'Research Interests Statement',
          content: `My research interests center on the development and evaluation of patient-centered health information systems that address healthcare disparities and improve health outcomes for underserved populations. I am particularly focused on three interconnected areas of inquiry that I believe are critical for advancing health informatics in the 21st century.

First, I am interested in exploring how artificial intelligence and machine learning can be used to identify and mitigate bias in healthcare delivery. Current AI systems often perpetuate existing disparities because they are trained on datasets that reflect historical inequities. I want to investigate methods for developing more equitable algorithms that can actually help reduce disparities rather than amplify them. This includes researching techniques for bias detection, algorithmic fairness, and the development of inclusive training datasets that better represent diverse patient populations.

My second area of interest focuses on the design and implementation of culturally responsive health technologies. I am particularly interested in how user interface design, language choices, and interaction patterns can be adapted to serve different cultural communities effectively. This research would involve collaboration with community partners to understand their specific needs and preferences, followed by iterative design and testing of health information systems that are truly accessible and usable across diverse populations.

Finally, I am passionate about studying the implementation science aspects of health informatics interventions. Even the most well-designed health technologies can fail if they are not properly integrated into existing healthcare workflows and organizational cultures. I want to research best practices for technology adoption in healthcare settings, with particular attention to how organizational factors, staff training, and change management strategies influence the success of health informatics implementations.

My long-term research goal is to develop a comprehensive framework for designing and implementing health information systems that are not only technically sophisticated but also equitable, culturally responsive, and successfully integrated into healthcare practice. I envision this framework being used by health systems, technology developers, and policymakers to ensure that health informatics innovations benefit all patients, regardless of their background or circumstances.

Throughout my graduate studies, I plan to pursue mixed-methods research approaches that combine quantitative analysis of health outcomes data with qualitative studies of user experiences and organizational dynamics. I believe that this interdisciplinary approach is essential for developing a nuanced understanding of how technology can best serve diverse healthcare stakeholders.

I am particularly excited about the opportunity to collaborate with faculty members who share these interests and to contribute to research that has the potential to make a meaningful difference in people's lives. I believe that health informatics has tremendous potential to transform healthcare for the better, but only if we approach it with intentionality, empathy, and a deep commitment to equity and justice.`,
          wordCount: 445,
          submittedAt: new Date('2024-01-16'),
          aiAnalysis: {
            grammarScore: 95,
            clarityScore: 91,
            relevanceScore: 99,
            keyThemes: ['algorithmic fairness', 'health disparities', 'implementation science', 'cultural competency'],
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
          answer: 'I am drawn to this program because of its unique emphasis on both technical excellence and practical healthcare application. The faculty\'s research in predictive analytics and the program\'s strong industry partnerships provide the perfect environment for pursuing my goals in health technology innovation. Additionally, the program\'s commitment to health equity and community engagement aligns perfectly with my personal values and career aspirations.',
          questionType: 'text',
          category: 'motivation',
          submittedAt: new Date('2024-01-15'),
          aiScore: 9.2
        },
        {
          id: 'q2',
          questionId: 'experience-1',
          question: 'Describe your most significant professional experience.',
          answer: 'My internship at Toronto General Hospital was transformative. I worked directly with clinical teams to understand their workflow challenges and developed a prototype that improved patient data visualization. This experience taught me the importance of user-centered design in healthcare technology. I spent six weeks shadowing nurses and physicians, conducting user interviews, and observing clinical workflows before designing a solution that reduced data retrieval time by 40%.',
          questionType: 'text',
          category: 'professional',
          submittedAt: new Date('2024-01-15'),
          aiScore: 8.8
        },
        {
          id: 'q3',
          questionId: 'goals-1',
          question: 'What are your long-term career goals?',
          answer: 'I aspire to lead interdisciplinary teams developing patient-centered health technologies. My goal is to ensure that technological advances in healthcare are not only innovative but also accessible and practical for real-world implementation. Specifically, I want to focus on creating solutions that address healthcare disparities and improve outcomes for underserved populations.',
          questionType: 'text',
          category: 'professional',
          submittedAt: new Date('2024-01-15'),
          aiScore: 9.0
        },
        {
          id: 'q4',
          questionId: 'challenge-1',
          question: 'Describe a significant challenge you faced and how you overcame it.',
          answer: 'During my research project, our team struggled with getting clinicians to adopt our prototype system. Initial user testing revealed that our interface was too complex and didn\'t fit into existing workflows. I took the initiative to redesign the entire user experience, conducting multiple rounds of user testing and incorporating feedback from 15 different healthcare professionals. This iterative approach taught me the importance of stakeholder engagement and user-centered design in healthcare technology.',
          questionType: 'text',
          category: 'personal',
          submittedAt: new Date('2024-01-15'),
          aiScore: 8.7
        },
        {
          id: 'q5',
          questionId: 'diversity-1',
          question: 'How would you contribute to the diversity and inclusivity of our program?',
          answer: 'As a first-generation college student from an immigrant family, I bring a unique perspective on healthcare accessibility and cultural barriers. My bilingual abilities and experience navigating healthcare systems as both a patient advocate and professional have given me insights into the challenges faced by diverse communities. I would contribute by sharing these perspectives in class discussions, mentoring other students from similar backgrounds, and ensuring that our research considers the needs of underrepresented populations.',
          questionType: 'text',
          category: 'personal',
          submittedAt: new Date('2024-01-15'),
          aiScore: 9.1
        },
        {
          id: 'q6',
          questionId: 'technical-1',
          question: 'Describe your experience with data analysis and programming.',
          answer: 'I have extensive experience with Python, R, and SQL from my undergraduate coursework and research projects. I\'ve worked with large healthcare datasets, including electronic health records and claims data, and am proficient in machine learning libraries like scikit-learn and TensorFlow. My most significant project involved developing a predictive model for patient readmissions using a dataset of over 100,000 patient records, achieving 85% accuracy. I\'m also experienced with data visualization tools like Tableau and have created interactive dashboards for clinical stakeholders.',
          questionType: 'text',
          category: 'academic',
          submittedAt: new Date('2024-01-15'),
          aiScore: 9.3
        },
        {
          id: 'q7',
          questionId: 'research-1',
          question: 'What research questions interest you most in health informatics?',
          answer: 'I\'m particularly interested in how we can use AI to reduce rather than perpetuate healthcare disparities. This includes research on algorithmic bias detection, developing more inclusive training datasets, and creating AI systems that actively promote health equity. I\'m also fascinated by implementation science questions around how to successfully integrate new technologies into clinical workflows while ensuring they truly improve patient care rather than creating additional burdens for healthcare workers.',
          questionType: 'text',
          category: 'academic',
          submittedAt: new Date('2024-01-15'),
          aiScore: 9.0
        },
        {
          id: 'q8',
          questionId: 'collaboration-1',
          question: 'Describe your experience working in interdisciplinary teams.',
          answer: 'During my hospital internship, I worked closely with a team that included nurses, physicians, IT specialists, and administrative staff. Each professional brought different perspectives and priorities, which initially created challenges in our project planning. I learned to facilitate communication by creating visual prototypes that helped everyone understand our proposed solution, conducting separate stakeholder interviews to understand each group\'s specific needs, and serving as a translator between technical and clinical team members. This experience taught me the value of diverse perspectives in creating comprehensive solutions.',
          questionType: 'text',
          category: 'professional',
          submittedAt: new Date('2024-01-16'),
          aiScore: 8.9
        },
        {
          id: 'q9',
          questionId: 'innovation-1',
          question: 'Describe a time when you developed an innovative solution to a problem.',
          answer: 'When I noticed that patients were frequently missing follow-up appointments due to communication barriers, I developed a multilingual appointment reminder system that used both SMS and voice calls in the patient\'s preferred language. The system also included visual elements and simplified language to improve health literacy. Working with community health workers, I tested the system with 200 patients over three months and saw a 60% reduction in missed appointments. This project taught me that innovation in healthcare often means making existing processes more accessible rather than creating entirely new technologies.',
          questionType: 'text',
          category: 'professional',
          submittedAt: new Date('2024-01-16'),
          aiScore: 9.4
        },
        {
          id: 'q10',
          questionId: 'ethics-1',
          question: 'How do you approach ethical considerations in health technology?',
          answer: 'I believe ethical considerations must be integrated throughout the entire technology development process, not just added as an afterthought. This means conducting equity impact assessments during the design phase, ensuring diverse representation in user testing, and continuously monitoring for unintended consequences after implementation. I\'m particularly concerned about privacy and consent in healthcare data use, and I think we need more robust frameworks for ensuring patients truly understand how their data is being used. I also believe technologists have a responsibility to advocate for vulnerable populations who might not have a voice in the development process.',
          questionType: 'text',
          category: 'academic',
          submittedAt: new Date('2024-01-16'),
          aiScore: 9.2
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
        },
        {
          id: 'essay-2',
          type: 'career_aspirations',
          title: 'Career Goals Essay',
          content: `My career aspirations are rooted in a deep belief that technology, when thoughtfully implemented, can transform traditional business models and create unprecedented value for both organizations and society. Having witnessed the rapid evolution of digital business ecosystems during my undergraduate years, I am committed to becoming a leader who bridges the gap between innovative technology and practical business application.

In the short term, I plan to leverage my MBA education to secure a position with a top-tier management consulting firm, specifically focusing on digital transformation initiatives. I am particularly interested in working with McKinsey Digital or BCG Gamma, where I can help Fortune 500 companies reimagine their business processes through technology integration. My goal is to specialize in financial services and healthcare sectors, industries that are undergoing massive technological disruption while maintaining critical regulatory and ethical obligations.

During my consulting career, I intend to develop expertise in several key areas that will be essential for future business leaders. First, I want to master the art of change management – understanding how to guide organizations through complex technological transitions while maintaining employee engagement and operational continuity. Second, I plan to deepen my knowledge of emerging technologies like artificial intelligence, blockchain, and IoT, not just from a technical perspective but from a strategic business application standpoint.

My medium-term goal is to transition into an executive role within a growth-stage technology company, ideally serving as Chief Strategy Officer or Chief Operating Officer. I am particularly drawn to fintech companies that are working to democratize financial services for underserved populations. Having grown up in a family that faced barriers accessing traditional banking services, I understand the transformative potential of inclusive financial technology. I want to help build companies that don't just generate profits but also create positive social impact.

Looking further ahead, my ultimate aspiration is to found my own consulting firm that specializes in helping mid-market companies navigate digital transformation challenges. Too often, innovative technologies and strategic consulting services are accessible only to large corporations with substantial resources. I envision creating a consultancy that makes high-quality strategic guidance affordable and accessible to smaller organizations that are the backbone of our economy.

What sets my vision apart is the emphasis on sustainable and ethical technology implementation. I believe that business leaders have a responsibility to consider not just short-term financial returns but also long-term societal impact. This means designing technology solutions that protect user privacy, promote economic inclusion, and contribute to environmental sustainability. I want to be known as a leader who demonstrates that profitability and social responsibility are not just compatible but mutually reinforcing.

To achieve these goals, I recognize that I need to continue developing both my technical acumen and my leadership skills. Your MBA program offers the perfect environment for this growth, with its strong emphasis on experiential learning, diverse peer network, and faculty who are at the forefront of business innovation. I am particularly excited about the opportunity to participate in the school's venture capital simulation and to work with the entrepreneurship center on real startup challenges.

Ultimately, I want my career to be defined by the positive impact I have on organizations and communities. Whether I'm helping a traditional manufacturer implement IoT solutions to improve efficiency, advising a healthcare startup on scaling their operations, or mentoring young entrepreneurs from underrepresented backgrounds, I want to be remembered as someone who used technology and business acumen to create meaningful change.`,
          wordCount: 548,
          submittedAt: new Date('2024-01-22'),
          aiAnalysis: {
            grammarScore: 94,
            clarityScore: 92,
            relevanceScore: 96,
            keyThemes: ['digital transformation', 'social impact', 'entrepreneurship', 'leadership'],
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
          answer: 'As president of the Business Student Association, I led a team to organize our annual career fair during the pandemic. We had to completely reimagine the event as a virtual experience, coordinating with 50+ companies and 300+ students. Despite initial technical challenges, we achieved 95% attendance and received outstanding feedback. The experience taught me the importance of adaptability, clear communication, and maintaining team morale during uncertain times.',
          questionType: 'text',
          category: 'personal',
          submittedAt: new Date('2024-01-20'),
          aiScore: 8.5
        },
        {
          id: 'q2',
          questionId: 'teamwork-1',
          question: 'Tell us about a time when you had to work with someone whose working style was very different from yours.',
          answer: 'During my internship at Sterling Financial, I was paired with a senior analyst who preferred detailed planning and documentation, while I tend to be more action-oriented and iterative. Initially, this created friction as we approached our market analysis project differently. I learned to appreciate the value of thorough preparation and documentation, while helping my colleague see the benefits of rapid prototyping and testing. We developed a hybrid approach that combined his methodical planning with my agile execution, ultimately delivering insights that exceeded expectations.',
          questionType: 'text',
          category: 'professional',
          submittedAt: new Date('2024-01-20'),
          aiScore: 8.9
        },
        {
          id: 'q3',
          questionId: 'failure-1',
          question: 'Describe a time when you failed at something important to you.',
          answer: 'In my junior year, I launched a peer tutoring startup that connected struggling students with high-performing classmates. Despite initial enthusiasm and 50+ student sign-ups, the platform failed within four months due to poor user experience design and inadequate quality control. Students complained about unreliable tutors and scheduling conflicts. This failure taught me the importance of thorough market research, user testing, and operational planning. The experience sparked my interest in how technology can solve real problems when properly designed and implemented, ultimately influencing my decision to pursue an MBA with a focus on technology strategy.',
          questionType: 'text',
          category: 'personal',
          submittedAt: new Date('2024-01-20'),
          aiScore: 9.1
        },
        {
          id: 'q4',
          questionId: 'innovation-2',
          question: 'Give an example of when you introduced a new idea or process that improved results.',
          answer: 'During my internship, I noticed that our customer acquisition analysis was limited to demographic data and transaction history. I proposed incorporating social media engagement patterns and mobile app usage data to create a more comprehensive customer profile. Working with the data science team, I developed a new segmentation model that identified previously overlooked high-value customer segments. This innovation led to targeted marketing campaigns that improved customer acquisition efficiency by 28% and contributed to a $2M increase in quarterly revenue.',
          questionType: 'text',
          category: 'professional',
          submittedAt: new Date('2024-01-21'),
          aiScore: 9.3
        },
        {
          id: 'q5',
          questionId: 'ethics-2',
          question: 'Describe a situation where you had to make a difficult ethical decision.',
          answer: 'While working on a consulting project for a local retailer, I discovered that their employee scheduling algorithm inadvertently discriminated against parents and students by consistently assigning them less favorable shifts. Although this wasn\'t intentional and bringing it up might strain our client relationship, I felt obligated to address it. I presented the issue along with potential solutions to both my supervisor and the client. We worked together to adjust the algorithm to ensure fair scheduling practices. This experience reinforced my belief that business success should never come at the expense of ethical treatment of employees or customers.',
          questionType: 'text',
          category: 'personal',
          submittedAt: new Date('2024-01-21'),
          aiScore: 9.0
        },
        {
          id: 'q6',
          questionId: 'diversity-2',
          question: 'How would you contribute to diversity and inclusion in our MBA program?',
          answer: 'As a first-generation college graduate from a Latino family, I bring perspectives shaped by experiences navigating educational and professional environments where I was often the only person who looked like me. I would contribute by sharing these experiences in class discussions, mentoring other underrepresented students, and helping create inclusive spaces where all voices are heard. I also plan to leverage my bilingual skills and cultural competency to support international students and contribute to discussions about global business practices. Additionally, I would actively participate in diversity-focused student organizations and help organize events that celebrate our community\'s diverse backgrounds.',
          questionType: 'text',
          category: 'personal',
          submittedAt: new Date('2024-01-21'),
          aiScore: 8.8
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
    essays: [
      {
        id: 'default-essay-1',
        type: 'personal_statement',
        title: 'Personal Statement',
        content: `My passion for healthcare began during my childhood when I watched my grandfather struggle with managing his diabetes. The complexity of his treatment regimen and the challenges he faced in understanding his medication schedule made me realize how important it is for healthcare systems to be both effective and accessible. This experience planted the seed for my interest in health informatics and my desire to improve healthcare delivery through technology.

During my undergraduate studies in Computer Science, I focused on courses that combined technical skills with real-world applications. I was particularly drawn to database management, user experience design, and systems analysis. These subjects provided me with the foundation I needed to understand how technology can be leveraged to solve complex problems in healthcare settings.

My internship at Regional Medical Center was a transformative experience that solidified my career goals. Working alongside nurses, physicians, and IT specialists, I gained firsthand insight into the daily challenges faced by healthcare professionals. I observed how fragmented information systems often led to inefficiencies and communication gaps that could impact patient care. This experience motivated me to pursue graduate studies in health informatics, where I can develop the expertise needed to design and implement solutions that truly serve patients and providers.

What attracts me most to your program is its emphasis on practical application combined with rigorous academic foundation. The opportunity to work on real healthcare challenges while building theoretical knowledge aligns perfectly with my learning style and career aspirations. I am particularly interested in courses on clinical decision support systems and healthcare data analytics.

My goal is to become a leader in health informatics who can bridge the gap between technology and clinical practice. I want to develop systems that not only improve efficiency but also enhance the quality of patient care and support healthcare professionals in their vital work.`,
        wordCount: 285,
        submittedAt: new Date('2024-01-10'),
        aiAnalysis: {
          grammarScore: 92,
          clarityScore: 89,
          relevanceScore: 95,
          keyThemes: ['healthcare technology', 'patient care', 'systems improvement', 'career motivation'],
          sentiment: 'positive',
          flaggedConcerns: []
        }
      }
    ],
    formResponses: [
      {
        id: 'default-q1',
        questionId: 'motivation-1',
        question: 'Why are you interested in this specific program?',
        answer: 'This program offers the perfect combination of technical rigor and practical application that I need to achieve my career goals in health informatics. The faculty expertise in clinical decision support and the strong industry partnerships provide opportunities for real-world experience that will prepare me for leadership roles in healthcare technology.',
        questionType: 'text',
        category: 'motivation',
        submittedAt: new Date('2024-01-10'),
        aiScore: 8.7
      },
      {
        id: 'default-q2',
        questionId: 'experience-1',
        question: 'Describe your most significant professional experience.',
        answer: 'My internship at Regional Medical Center was pivotal in shaping my understanding of healthcare technology challenges. I worked with interdisciplinary teams to analyze workflow inefficiencies and proposed technology solutions that could improve patient care coordination. This experience taught me the importance of user-centered design in healthcare applications.',
        questionType: 'text',
        category: 'professional',
        submittedAt: new Date('2024-01-10'),
        aiScore: 8.5
      },
      {
        id: 'default-q3',
        questionId: 'goals-1',
        question: 'What are your long-term career goals?',
        answer: 'I aspire to lead health informatics initiatives that improve patient outcomes and streamline healthcare delivery. My long-term goal is to work in a senior role where I can influence the strategic implementation of health technologies while ensuring they truly serve the needs of patients and healthcare providers.',
        questionType: 'text',
        category: 'professional',
        submittedAt: new Date('2024-01-10'),
        aiScore: 8.9
      }
    ],
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

  // Merge with specific profile data if available, or use ID '1' as default
  const specificProfile = baseProfiles[applicantId] || baseProfiles['1'];
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