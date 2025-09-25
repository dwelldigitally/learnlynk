// Student Portal TypeScript interfaces

export interface StudentPortalContextType {
  session: any;
  accessToken: string | null;
  leadId: string | null;
  sessionId: string | null;
  isLoading: boolean;
}

export interface PortalData {
  access_token: string;
  student_name: string;
  expires_at: string;
  status: string;
  [key: string]: any;
}

export interface TokenValidationState {
  accessToken: string | null;
  portalData: PortalData | null;
  isValidating: boolean;
  showWelcome: boolean;
}

export interface WelcomeFlowState {
  showWelcome: boolean;
  setShowWelcome: (show: boolean) => void;
  handleWelcomeComplete: () => void;
}