
import React, { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import WinDefinitionSection, { WinDefinitionValues } from "./WinDefinitionSection";
import hubspotService from "@/services/hubspotService";

const ConversionFactorsScreen: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [recommendedFactors, setRecommendedFactors] = useState<string[]>([]);
  const [selectedFactors, setSelectedFactors] = useState<Record<string, boolean>>({});
  const [winDefinition, setWinDefinition] = useState<WinDefinitionValues | null>(null);
  
  useEffect(() => {
    const fetchFactors = async () => {
      setIsLoading(true);
      try {
        // Get recommended conversion factors from HubSpot data
        const factors = await hubspotService.fetchRecommendedConversionFactors();
        setRecommendedFactors(factors);
        
        // Initialize all factors as selected by default
        const initialSelectedState: Record<string, boolean> = {};
        factors.forEach(factor => {
          initialSelectedState[factor] = true;
        });
        setSelectedFactors(initialSelectedState);
      } catch (error) {
        console.error("Failed to fetch conversion factors:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFactors();
  }, []);
  
  const handleFactorChange = (factor: string) => {
    setSelectedFactors(prev => ({
      ...prev,
      [factor]: !prev[factor]
    }));
  };
  
  const handleWinDefinitionChange = (definition: WinDefinitionValues) => {
    setWinDefinition(definition);
  };
  
  return (
    <div className="slide-container">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Configure Success Metrics</h1>
        <p className="text-saas-gray-medium">
          Define what success means for your team and select the HubSpot properties that contribute to lead conversion
        </p>
      </div>
      
      <Card className="mb-6">
        <CardContent className="pt-6">
          <WinDefinitionSection onDefinitionChange={handleWinDefinitionChange} />
        </CardContent>
      </Card>
      
      <Separator className="my-6" />
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Conversion Factors</h2>
        <p className="text-saas-gray-medium">
          Select the HubSpot properties that our AI should use to determine lead conversion potential
        </p>
      </div>
      
      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-sm text-saas-gray-medium">Loading recommended factors...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendedFactors.map((factor) => (
            <div key={factor} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <Checkbox 
                id={`factor-${factor}`} 
                checked={selectedFactors[factor] || false}
                onCheckedChange={() => handleFactorChange(factor)}
              />
              <div>
                <Label htmlFor={`factor-${factor}`} className="font-medium">{factor}</Label>
                <p className="text-sm text-saas-gray-medium">
                  {getPropertyDescription(factor)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <h3 className="text-blue-800 font-medium mb-2">How does this work?</h3>
        <p className="text-sm text-blue-700">
          Learnlynk uses these factors to train our AI on what contributes to successful lead conversion in your organization. 
          The more accurate these selections, the better the AI will perform at routing leads to the right team members.
        </p>
      </div>
    </div>
  );
};

// Helper function to provide descriptions for common HubSpot properties
const getPropertyDescription = (propertyName: string): string => {
  const descriptions: Record<string, string> = {
    "hs_lead_status": "The current status of the lead in your pipeline",
    "first_conversion_date": "When the contact first converted on your website",
    "hs_analytics_source": "The original source of the lead",
    "lifecyclestage": "The current lifecycle stage of the contact",
    "hs_pipeline": "The pipeline the deal is associated with",
    "dealstage": "The current stage of the deal",
    "hs_sales_email_last_replied": "When the contact last replied to a sales email",
    "hs_content_membership_status": "Contact's content membership status",
    "hs_email_sends": "Number of marketing emails sent to this contact",
    "hs_email_open": "Whether the contact has opened emails",
    "hs_email_click": "Whether the contact has clicked emails",
  };
  
  return descriptions[propertyName] || "HubSpot property related to lead conversion";
};

export default ConversionFactorsScreen;
