
export interface Intake {
  id: string;
  program: string;
  date: string;
  time: string;
  location: string;
  enrollmentPercentage: number;
  capacityPercentage: number;
  status: "healthy" | "warning" | "critical";
  approach: "aggressive" | "balanced" | "neutral";
}

export interface IntakeStrategy {
  approach: "aggressive" | "balanced" | "neutral";
  description: string;
  actions: string[];
}

export interface IntakeMetrics {
  enrollmentRate: number;
  conversionRate: number;
  fillRate: number;
  timeToFill: number;
}

export interface IntakeNotification {
  type: "email" | "sms" | "system";
  scheduledDate: string;
  recipient: "leads" | "team" | "management";
  status: "scheduled" | "sent" | "failed";
}
