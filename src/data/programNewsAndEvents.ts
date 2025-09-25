import healthcareWelcome from "@/assets/healthcare-welcome.jpg";
import ucatMaster from "@/assets/ucat-master.jpg";
import ucatScore from "@/assets/ucat-score.jpg";
import ucatUltimate from "@/assets/ucat-ultimate.jpg";
import { NewsItem, Event } from "@/types/student";

interface ProgramNewsAndEvents {
  news: NewsItem[];
  events: Event[];
}

export const programNewsAndEvents: Record<string, ProgramNewsAndEvents> = {
  "Health Care Assistant": {
    news: [
      {
        id: "hca-news-1",
        title: "The Future of Healthcare: Why HCA Roles Are Essential",
        description: "Discover how Healthcare Assistants are becoming the backbone of modern healthcare systems, supporting patients and medical teams in unprecedented ways.",
        image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=400&h=400&fit=crop",
        type: "blog",
        date: "2024-01-15",
        readTime: "5 min read",
        author: "Dr. Sarah Chen",
        tags: ["Healthcare", "Career Development", "Patient Care"],
        content: `
          <p>The healthcare landscape is rapidly evolving, and Healthcare Assistants (HCAs) are at the forefront of this transformation. As our population ages and healthcare needs become more complex, the role of HCAs has expanded far beyond traditional boundaries.</p>
          
          <h2>The Growing Demand</h2>
          <p>Healthcare systems worldwide are experiencing unprecedented demand for qualified healthcare support professionals. HCAs now provide 70% of direct patient care in many healthcare facilities, making them absolutely essential to day-to-day operations.</p>
          
          <h2>Expanding Responsibilities</h2>
          <p>Modern HCAs are taking on increasingly complex responsibilities:</p>
          <ul>
            <li>Advanced patient monitoring and assessment</li>
            <li>Medication administration and management</li>
            <li>Patient education and health promotion</li>
            <li>Care coordination and communication</li>
            <li>Technology integration and digital health tools</li>
          </ul>
          
          <h2>Career Growth Opportunities</h2>
          <p>The HCA role serves as an excellent stepping stone to advanced healthcare careers. Many of our graduates have progressed to become registered nurses, therapy assistants, and healthcare team leaders within just a few years of graduation.</p>
          
          <h2>Why Choose Our Program?</h2>
          <p>Our comprehensive HCA program combines theoretical knowledge with extensive practical experience, ensuring you're job-ready from day one. We maintain strong partnerships with local healthcare facilities, providing excellent placement opportunities and career support.</p>
          
          <p>Join the next generation of healthcare professionals who are making a real difference in their communities every day.</p>
        `
      },
      {
        id: "hca-news-2",
        title: "Alumni Spotlight: Sarah's Journey from Student to Senior HCA",
        description: "Read about Sarah Martinez's inspiring career progression from our HCA program to leading a team at Vancouver General Hospital in just 3 years.",
        image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=400&h=400&fit=crop",
        type: "alumni_story",
        date: "2024-01-10",
        readTime: "7 min read"
      },
      {
        id: "hca-news-3",
        title: "Meet Your Instructor: Dr. Jennifer Thompson, RN",
        description: "Get to know our lead HCA instructor with 15 years of clinical experience and a passion for training the next generation of healthcare professionals.",
        image: "https://images.unsplash.com/photo-1473091534298-04dcbce3278c?w=400&h=400&fit=crop",
        type: "instructor_profile",
        date: "2024-01-05",
        readTime: "4 min read"
      }
    ],
    events: [
      {
        id: "hca-event-1",
        title: "Healthcare Career Info Session",
        description: "Learn about opportunities in healthcare and how our HCA program prepares you for success",
        image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=400&h=400&fit=crop",
        date: "2024-02-15",
        time: "6:00 PM - 7:30 PM",
        registeredCount: 45,
        maxCapacity: 60,
        eventType: "info_session"
      },
      {
        id: "hca-event-2",
        title: "Hands-on Patient Care Workshop",
        description: "Experience real-world patient care scenarios with our simulation lab equipment",
        image: "https://images.unsplash.com/photo-1487887235947-a955ef187fcc?w=400&h=400&fit=crop",
        date: "2024-02-20",
        time: "2:00 PM - 5:00 PM",
        registeredCount: 28,
        maxCapacity: 30,
        eventType: "workshop"
      },
      {
        id: "hca-event-3",
        title: "Campus Tour & Lab Demo",
        description: "Tour our state-of-the-art healthcare simulation labs and meet current students",
        image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=400&h=400&fit=crop",
        date: "2024-02-25",
        time: "10:00 AM - 12:00 PM",
        registeredCount: 22,
        maxCapacity: 40,
        eventType: "campus_tour"
      },
      {
        id: "hca-event-4",
        title: "Healthcare Professionals Networking Night",
        description: "Connect with industry professionals and learn about career pathways",
        image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400&h=400&fit=crop",
        date: "2024-03-01",
        time: "6:00 PM - 8:00 PM",
        registeredCount: 35,
        maxCapacity: 50,
        eventType: "networking"
      },
      {
        id: "hca-event-5",
        title: "Guest Lecture: Innovations in Patient Care",
        description: "Leading healthcare expert discusses the latest innovations transforming patient care",
        image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=400&h=400&fit=crop",
        date: "2024-03-05",
        time: "7:00 PM - 8:30 PM",
        registeredCount: 52,
        maxCapacity: 80,
        eventType: "guest_lecture"
      },
      {
        id: "hca-event-6",
        title: "Mental Health First Aid Workshop",
        description: "Learn essential mental health support skills for healthcare environments",
        image: "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?w=400&h=400&fit=crop",
        date: "2024-03-10",
        time: "1:00 PM - 4:00 PM",
        registeredCount: 18,
        maxCapacity: 25,
        eventType: "workshop"
      }
    ]
  },
  "Aviation": {
    news: [
      {
        id: "av-news-1",
        title: "Sky-High Opportunities: The Aviation Industry Boom",
        description: "With pilot shortages worldwide, aviation careers offer unprecedented opportunities for growth and adventure.",
        image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=400&fit=crop",
        type: "blog",
        date: "2024-01-12",
        readTime: "6 min read"
      },
      {
        id: "av-news-2",
        title: "From Student to First Officer: Mike's Success Story",
        description: "Follow Mike Chen's journey from our aviation program to flying commercial aircraft with WestJet Airlines.",
        image: "https://images.unsplash.com/photo-1517022812141-23620dba5c23?w=400&h=400&fit=crop",
        type: "alumni_story",
        date: "2024-01-08",
        readTime: "8 min read"
      }
    ],
    events: [
      {
        id: "av-event-1",
        title: "Aviation Career Discovery Session",
        description: "Explore diverse career paths in aviation from pilot to air traffic control",
        image: "https://images.unsplash.com/photo-1488972685288-c3fd157d7c7a?w=400&h=400&fit=crop",
        date: "2024-02-18",
        time: "7:00 PM - 8:30 PM",
        registeredCount: 38,
        maxCapacity: 50,
        eventType: "info_session"
      },
      {
        id: "av-event-2",
        title: "Flight Simulator Experience",
        description: "Try our professional flight simulators and experience commercial aviation",
        image: "https://images.unsplash.com/photo-1496307653780-42ee777d4833?w=400&h=400&fit=crop",
        date: "2024-02-22",
        time: "10:00 AM - 4:00 PM",
        registeredCount: 15,
        maxCapacity: 20,
        eventType: "workshop"
      },
      {
        id: "av-event-3",
        title: "Airport & Training Facility Tour",
        description: "Visit YVR and see our aviation training facilities firsthand",
        image: "https://images.unsplash.com/photo-1473177104440-ffee2f376098?w=400&h=400&fit=crop",
        date: "2024-02-28",
        time: "9:00 AM - 1:00 PM",
        registeredCount: 25,
        maxCapacity: 35,
        eventType: "campus_tour"
      },
      {
        id: "av-event-4",
        title: "Aviation Industry Networking Event",
        description: "Meet airline representatives and aviation professionals",
        image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400&h=400&fit=crop",
        date: "2024-03-03",
        time: "5:00 PM - 7:00 PM",
        registeredCount: 42,
        maxCapacity: 60,
        eventType: "networking"
      },
      {
        id: "av-event-5",
        title: "Future of Aviation Technology",
        description: "Industry expert presentation on emerging aviation technologies",
        image: "https://images.unsplash.com/photo-1441057206919-63d19fac2369?w=400&h=400&fit=crop",
        date: "2024-03-08",
        time: "6:30 PM - 8:00 PM",
        registeredCount: 31,
        maxCapacity: 45,
        eventType: "guest_lecture"
      }
    ]
  }
  // Additional programs would be added here following the same pattern
};