
import { toast } from "sonner";

// HubSpot API endpoints
const HUBSPOT_API_BASE = "https://api.hubapi.com/crm/v3";

// Define types for HubSpot data
export interface HubSpotProperty {
  name: string;
  label: string;
  description?: string;
  type: string;
  fieldType: string;
  groupName?: string;
}

export interface HubSpotContact {
  id: string;
  properties: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export interface HubSpotDeal {
  id: string;
  properties: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export interface HubSpotCompany {
  id: string;
  properties: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export interface HubSpotImportStats {
  contacts: number;
  companies: number;
  deals: number;
  activities: number;
}

class HubSpotService {
  private apiKey: string | null = null;
  private isAuthenticated: boolean = false;
  private contactProperties: HubSpotProperty[] = [];
  private dealProperties: HubSpotProperty[] = [];
  private companyProperties: HubSpotProperty[] = [];

  setApiKey(key: string) {
    this.apiKey = key;
    localStorage.setItem('hubspot_api_key', key);
    this.isAuthenticated = true;
    return this.testConnection();
  }

  getStoredApiKey(): string | null {
    const key = localStorage.getItem('hubspot_api_key');
    if (key) {
      this.apiKey = key;
      this.isAuthenticated = true;
    }
    return key;
  }

  isConnected(): boolean {
    return this.isAuthenticated;
  }

  async testConnection(): Promise<boolean> {
    try {
      if (!this.apiKey) {
        return false;
      }
      
      const response = await fetch(`${HUBSPOT_API_BASE}/objects/contacts?limit=1`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        this.isAuthenticated = false;
        throw new Error("Failed to connect to HubSpot API");
      }
      
      this.isAuthenticated = true;
      return true;
    } catch (error) {
      console.error("HubSpot connection test failed:", error);
      this.isAuthenticated = false;
      return false;
    }
  }

  async fetchContactProperties(): Promise<HubSpotProperty[]> {
    if (!this.apiKey) {
      throw new Error("Not authenticated with HubSpot");
    }

    try {
      const response = await fetch(`${HUBSPOT_API_BASE}/properties/contacts`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch contact properties");
      }

      const data = await response.json();
      this.contactProperties = data.results;
      return this.contactProperties;
    } catch (error) {
      console.error("Failed to fetch contact properties:", error);
      toast.error("Failed to fetch contact properties");
      return [];
    }
  }

  async fetchDealProperties(): Promise<HubSpotProperty[]> {
    if (!this.apiKey) {
      throw new Error("Not authenticated with HubSpot");
    }

    try {
      const response = await fetch(`${HUBSPOT_API_BASE}/properties/deals`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch deal properties");
      }

      const data = await response.json();
      this.dealProperties = data.results;
      return this.dealProperties;
    } catch (error) {
      console.error("Failed to fetch deal properties:", error);
      toast.error("Failed to fetch deal properties");
      return [];
    }
  }

  async fetchCompanyProperties(): Promise<HubSpotProperty[]> {
    if (!this.apiKey) {
      throw new Error("Not authenticated with HubSpot");
    }

    try {
      const response = await fetch(`${HUBSPOT_API_BASE}/properties/companies`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch company properties");
      }

      const data = await response.json();
      this.companyProperties = data.results;
      return this.companyProperties;
    } catch (error) {
      console.error("Failed to fetch company properties:", error);
      toast.error("Failed to fetch company properties");
      return [];
    }
  }

  async importData(selectedObjects: string[]): Promise<HubSpotImportStats> {
    if (!this.apiKey) {
      throw new Error("Not authenticated with HubSpot");
    }
    
    const stats: HubSpotImportStats = {
      contacts: 0,
      companies: 0,
      deals: 0,
      activities: 0
    };

    try {
      // Simulate importing data with a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (selectedObjects.includes('contact')) {
        // In a real implementation, we would page through all contacts
        const response = await fetch(`${HUBSPOT_API_BASE}/objects/contacts?limit=100`, {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          stats.contacts = data.results.length;
        }
      }
      
      if (selectedObjects.includes('company')) {
        // Simulate fetching companies
        stats.companies = Math.floor(Math.random() * 50) + 20;
      }
      
      if (selectedObjects.includes('deals')) {
        // Simulate fetching deals
        stats.deals = Math.floor(Math.random() * 100) + 30;
      }
      
      if (selectedObjects.includes('activities')) {
        // Simulate fetching activities
        stats.activities = Math.floor(Math.random() * 500) + 100;
      }
      
      return stats;
    } catch (error) {
      console.error("Failed to import data from HubSpot:", error);
      toast.error("Failed to import data from HubSpot");
      return stats;
    }
  }

  async fetchRecommendedConversionFactors(): Promise<string[]> {
    // In a real implementation, this would analyze your HubSpot data
    // to find the most impactful properties for lead conversion
    
    // For now, we'll return a mix of actual HubSpot properties
    return [
      "hs_lead_status",
      "first_conversion_date",
      "hs_analytics_source",
      "lifecyclestage",
      "hs_pipeline",
      "dealstage",
      "hs_sales_email_last_replied"
    ];
  }

  getContactProperties(): HubSpotProperty[] {
    return this.contactProperties;
  }

  getDealProperties(): HubSpotProperty[] {
    return this.dealProperties;
  }

  getCompanyProperties(): HubSpotProperty[] {
    return this.companyProperties;
  }
}

// Create a singleton instance
const hubspotService = new HubSpotService();
export default hubspotService;
