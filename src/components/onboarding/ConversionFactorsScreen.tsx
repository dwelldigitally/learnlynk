
import React, { useState, useEffect } from "react";
import { Check, Info, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import hubspotService, { HubSpotProperty } from "@/services/hubspotService";
import { toast } from "sonner";

const ConversionFactorsScreen: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [hubspotProperties, setHubspotProperties] = useState<HubSpotProperty[]>([]);
  const [conversionFactors, setConversionFactors] = useState<string[]>([]);
  const [recommendedFactors, setRecommendedFactors] = useState<string[]>([]);
  
  const [ticketSize, setTicketSize] = useState("10000-50000");
  const [wantExplanations, setWantExplanations] = useState("yes");
  const [leadsPerMonth, setLeadsPerMonth] = useState("100-500");
  const [leadExceptions, setLeadExceptions] = useState<string[]>(["Walk-ins", "Phone calls"]);
  const [selectedProperty, setSelectedProperty] = useState("");
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (!hubspotService.isConnected()) {
          const storedKey = hubspotService.getStoredApiKey();
          if (!storedKey) {
            toast.error("Please connect to HubSpot first");
            return;
          }
        }
        
        // Fetch properties from HubSpot
        const contactProps = await hubspotService.fetchContactProperties();
        const dealProps = await hubspotService.fetchDealProperties();
        
        // Combine properties and sort by name
        const allProperties = [...contactProps, ...dealProps]
          .filter(prop => !prop.name.startsWith('hs_') || prop.name.includes('lead') || prop.name.includes('conversion'))
          .sort((a, b) => a.label.localeCompare(b.label));
        
        setHubspotProperties(allProperties);
        
        // Get recommended factors
        const recommended = await hubspotService.fetchRecommendedConversionFactors();
        setRecommendedFactors(recommended);
        
        // Set initial conversion factors if empty
        if (conversionFactors.length === 0) {
          setConversionFactors(recommended.slice(0, 3));
        }
      } catch (error) {
        console.error("Error fetching HubSpot data:", error);
        toast.error("Failed to fetch data from HubSpot");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const handleAddFactor = () => {
    if (selectedProperty && conversionFactors.length < 3) {
      if (!conversionFactors.includes(selectedProperty)) {
        setConversionFactors([...conversionFactors, selectedProperty]);
        setSelectedProperty("");
      } else {
        toast.error("This property is already selected");
      }
    }
  };
  
  const handleRemoveFactor = (factor: string) => {
    setConversionFactors(conversionFactors.filter(f => f !== factor));
  };
  
  const handleToggleLeadException = (exception: string) => {
    if (leadExceptions.includes(exception)) {
      setLeadExceptions(leadExceptions.filter(e => e !== exception));
    } else {
      setLeadExceptions([...leadExceptions, exception]);
    }
  };
  
  const getPropertyLabel = (propertyName: string) => {
    const property = hubspotProperties.find(p => p.name === propertyName);
    return property ? property.label : propertyName;
  };

  return (
    <div className="slide-container">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">
          Lead Conversion Insights
        </h1>
        <p className="text-saas-gray-medium">
          Select HubSpot properties that influence lead conversion in your sales process
        </p>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="ml-2">Loading HubSpot properties...</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <div className="flex items-center mb-2">
              <h3 className="font-medium">Key HubSpot Conversion Factors</h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" className="p-0 h-auto ml-1">
                      <Info className="w-4 h-4 text-saas-gray-medium" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">Select the 3 most important HubSpot properties that affect your lead conversion rate</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <div className="space-y-3 mb-4">
              {conversionFactors.map((factor, index) => (
                <div key={index} className="flex items-center justify-between bg-saas-gray-light p-3 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-saas-blue rounded-full flex items-center justify-center text-white mr-3">
                      {index + 1}
                    </div>
                    <span>{getPropertyLabel(factor)}</span>
                    <span className="ml-2 text-sm text-saas-gray-medium">({factor})</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleRemoveFactor(factor)}
                    className="h-6 text-xs"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                </div>
              ))}
              
              {conversionFactors.length < 3 && (
                <div className="flex items-center space-x-2">
                  <Select value={selectedProperty} onValueChange={setSelectedProperty}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select a HubSpot property" />
                    </SelectTrigger>
                    <SelectContent>
                      <div className="max-h-[300px] overflow-y-auto">
                        {hubspotProperties.map(property => (
                          <SelectItem key={property.name} value={property.name}>
                            {property.label} ({property.name})
                          </SelectItem>
                        ))}
                      </div>
                    </SelectContent>
                  </Select>
                  <Button onClick={handleAddFactor} disabled={!selectedProperty}>Add</Button>
                </div>
              )}
            </div>
            
            {recommendedFactors.length > 0 && (
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                <h4 className="text-sm font-medium mb-2">Recommended properties based on your HubSpot data:</h4>
                <div className="flex flex-wrap gap-2">
                  {recommendedFactors.map(factor => (
                    <Button
                      key={factor}
                      variant="outline"
                      size="sm"
                      className="text-xs bg-white"
                      onClick={() => {
                        if (conversionFactors.length < 3 && !conversionFactors.includes(factor)) {
                          setConversionFactors([...conversionFactors, factor]);
                        } else if (conversionFactors.includes(factor)) {
                          toast.error("This property is already selected");
                        } else {
                          toast.error("You can only select 3 properties");
                        }
                      }}
                    >
                      {factor}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="ticketSize" className="font-medium block mb-2">Average Ticket Size</Label>
              <Select value={ticketSize} onValueChange={setTicketSize}>
                <SelectTrigger id="ticketSize">
                  <SelectValue placeholder="Select ticket size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="less-than-1000">Less than $1,000</SelectItem>
                  <SelectItem value="1000-10000">$1,000 - $10,000</SelectItem>
                  <SelectItem value="10000-50000">$10,000 - $50,000</SelectItem>
                  <SelectItem value="50000-100000">$50,000 - $100,000</SelectItem>
                  <SelectItem value="more-than-100000">More than $100,000</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="leadsPerMonth" className="font-medium block mb-2">Average Leads Per Month</Label>
              <Select value={leadsPerMonth} onValueChange={setLeadsPerMonth}>
                <SelectTrigger id="leadsPerMonth">
                  <SelectValue placeholder="Select lead volume" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="less-than-50">Less than 50</SelectItem>
                  <SelectItem value="50-100">50 - 100</SelectItem>
                  <SelectItem value="100-500">100 - 500</SelectItem>
                  <SelectItem value="500-1000">500 - 1000</SelectItem>
                  <SelectItem value="more-than-1000">More than 1000</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label className="font-medium block mb-3">Want Explanations for Lead Assignments?</Label>
            <RadioGroup 
              value={wantExplanations} 
              onValueChange={setWantExplanations}
              className="flex space-x-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="explanation-yes" />
                <Label htmlFor="explanation-yes">Yes, show explanations</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="explanation-no" />
                <Label htmlFor="explanation-no">No, just assign leads</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div>
            <Label className="font-medium block mb-3">Lead Source Exceptions (non-AI assignment)</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {["Walk-ins", "Phone calls", "Referrals", "Events", "Partner leads"].map((source) => (
                <div 
                  key={source} 
                  className={`p-3 border rounded-lg cursor-pointer ${
                    leadExceptions.includes(source) 
                      ? "border-saas-blue bg-blue-50" 
                      : "border-gray-200"
                  }`}
                  onClick={() => handleToggleLeadException(source)}
                >
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-sm mr-2 flex items-center justify-center ${
                      leadExceptions.includes(source) ? "bg-saas-blue" : "border border-gray-300"
                    }`}>
                      {leadExceptions.includes(source) && (
                        <Check className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <span className="text-sm">{source}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-sm text-saas-gray-medium mt-2">
              Selected sources will use round-robin assignment instead of AI
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversionFactorsScreen;
