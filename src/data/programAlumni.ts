
import { AlumniProfile } from "@/types/application";
import alumniNicole from "@/assets/alumni-nicole.jpg";
import advisorNicole from "@/assets/advisor-nicole.jpg";
import authorSarah from "@/assets/author-sarah.jpg";
import authorAhmed from "@/assets/author-ahmed.jpg";
import authorRobert from "@/assets/author-robert.jpg";

export const programAlumni: Record<string, AlumniProfile> = {
  "Health Care Assistant": {
    name: "Nicole Ye",
    graduationYear: "2022",
    currentRole: "Health Care Assistant",
    workplace: "Vancouver General Hospital",
    testimonial: "I graduated from the Health Care Assistant program and now work at Vancouver General Hospital. The program prepared me well for real-world patient care.",
    avatar: alumniNicole
  },
  "Aviation": {
    name: "Captain Sarah Johnson",
    graduationYear: "2020",
    currentRole: "Commercial Pilot",
    workplace: "Air Canada",
    testimonial: "The Aviation program at WCC gave me the foundation I needed to become a commercial pilot. Now I'm flying across Canada with Air Canada.",
    avatar: authorSarah
  },
  "Education Assistant": {
    name: "Maria Rodriguez",
    graduationYear: "2021",
    currentRole: "Education Assistant",
    workplace: "Vancouver Elementary School",
    testimonial: "Working with children has always been my passion. The Education Assistant program taught me classroom management and child development skills.",
    avatar: advisorNicole
  },
  "Hospitality": {
    name: "David Chen",
    graduationYear: "2019",
    currentRole: "Hotel Manager",
    workplace: "Fairmont Hotel Vancouver",
    testimonial: "The Hospitality program opened doors to the tourism industry. I started as front desk and worked my way up to hotel management.",
    avatar: authorRobert
  },
  "ECE": {
    name: "Jennifer Kim",
    graduationYear: "2023",
    currentRole: "Daycare Director",
    workplace: "Little Stars Daycare",
    testimonial: "The ECE program gave me deep understanding of child development. I now run my own daycare center helping families in the community.",
    avatar: authorAhmed
  },
  "MLA": {
    name: "Dr. Alex Thompson",
    graduationYear: "2018",
    currentRole: "Lab Technician",
    workplace: "BC Children's Hospital",
    testimonial: "The MLA program prepared me for the precision required in medical laboratory work. I now help diagnose illnesses at BC Children's Hospital.",
    avatar: authorSarah
  }
};
