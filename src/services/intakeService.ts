
import { Intake, IntakeMetrics, IntakeStrategy } from "../types/pipeline";
import hubspotService from "./hubspotService";
import { toast } from "sonner";

// Mock data for intakes
const mockIntakes: Intake[] = [
  {
    id: "1",
    program: "Health Care Assistant",
    date: "March 20",
    time: "Evening",
    location: "Abbotsford",
    enrollmentPercentage: 61,
    capacityPercentage: 90,
    status: "healthy",
    approach: "balanced",
  },
  {
    id: "2",
    program: "Health Care Assistant",
    date: "April 23",
    time: "Morning",
    location: "Surrey",
    enrollmentPercentage: 32,
    capacityPercentage: 50,
    status: "warning",
    approach: "aggressive",
  },
  {
    id: "3",
    program: "Medical Lab Assistant",
    date: "May 15",
    time: "Evening",
    location: "Vancouver",
    enrollmentPercentage: 85,
    capacityPercentage: 100,
    status: "healthy",
    approach: "neutral",
  }
];

class IntakeService {
  private useMockData = true; // Set to false when ready to use real HubSpot data

  async getIntakes(): Promise<Intake[]> {
    if (this.useMockData) {
      return Promise.resolve(mockIntakes);
    }

    try {
      // In a real implementation, this would fetch data from HubSpot
      if (!hubspotService.isConnected()) {
        throw new Error("Not connected to HubSpot");
      }

      // This is a placeholder for the real implementation
      // Here we would make API calls to fetch intake data from HubSpot
      // const response = await fetch("HubSpot API endpoint", ...)
      
      toast.error("Real HubSpot data fetching not implemented yet");
      return mockIntakes;
    } catch (error) {
      console.error("Failed to fetch intakes:", error);
      toast.error("Failed to fetch intake data");
      return [];
    }
  }

  async updateIntakeApproach(
    intakeId: string,
    approach: "aggressive" | "balanced" | "neutral"
  ): Promise<boolean> {
    try {
      if (this.useMockData) {
        // For mock data, just pretend we successfully updated it
        return true;
      }

      // In a real implementation, this would update the approach in HubSpot
      // const response = await fetch("HubSpot API endpoint", ...)
      
      toast.success(`Intake approach updated to ${approach}`);
      return true;
    } catch (error) {
      console.error("Failed to update intake approach:", error);
      toast.error("Failed to update intake approach");
      return false;
    }
  }

  getIntakeMetrics(intakeId: string): IntakeMetrics {
    // In a real implementation, this would calculate metrics based on real data
    return {
      enrollmentRate: Math.random() * 100,
      conversionRate: Math.random() * 100,
      fillRate: Math.random() * 100,
      timeToFill: Math.floor(Math.random() * 30),
    };
  }

  getIntakeStrategies(): Record<string, IntakeStrategy> {
    return {
      aggressive: {
        approach: "aggressive",
        description: "Maximize enrollment with prioritized resources",
        actions: [
          "Assign leads to top performers",
          "Prepare email campaigns",
          "Increase marketing budget",
          "Prioritize follow-ups"
        ]
      },
      balanced: {
        approach: "balanced",
        description: "Equitable lead distribution with standard follow-up",
        actions: [
          "Distribute leads evenly",
          "Standard follow-up sequence",
          "Normal marketing budget",
          "Regular engagement tracking"
        ]
      },
      neutral: {
        approach: "neutral",
        description: "Passive enrollment with self-service focus",
        actions: [
          "Self-service registration",
          "Minimal direct outreach",
          "Reduced marketing spend",
          "Automated workflows"
        ]
      }
    };
  }
}

const intakeService = new IntakeService();
export default intakeService;
