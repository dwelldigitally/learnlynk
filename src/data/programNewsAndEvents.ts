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
        image: healthcareWelcome,
        type: "blog",
        date: "2024-01-15",
        readTime: "5 min read"
      },
      {
        id: "hca-news-2",
        title: "Alumni Spotlight: Sarah's Journey from Student to Senior HCA",
        description: "Read about Sarah Martinez's inspiring career progression from our HCA program to leading a team at Vancouver General Hospital in just 3 years.",
        image: ucatScore,
        type: "alumni_story",
        date: "2024-01-10",
        readTime: "7 min read"
      },
      {
        id: "hca-news-3",
        title: "Meet Your Instructor: Dr. Jennifer Thompson, RN",
        description: "Get to know our lead HCA instructor with 15 years of clinical experience and a passion for training the next generation of healthcare professionals.",
        image: ucatUltimate,
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
        image: healthcareWelcome,
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
        image: ucatScore,
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
        image: ucatUltimate,
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
        image: healthcareWelcome,
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
        image: ucatScore,
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
        image: ucatUltimate,
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
        image: ucatMaster,
        type: "blog",
        date: "2024-01-12",
        readTime: "6 min read"
      },
      {
        id: "av-news-2",
        title: "From Student to First Officer: Mike's Success Story",
        description: "Follow Mike Chen's journey from our aviation program to flying commercial aircraft with WestJet Airlines.",
        image: ucatScore,
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
        image: ucatMaster,
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
        image: ucatScore,
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
        image: ucatUltimate,
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
        image: ucatMaster,
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
        image: ucatScore,
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