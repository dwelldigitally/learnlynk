
import React, { useState } from "react";
import { Check, Info } from "lucide-react";
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

const ConversionFactorsScreen: React.FC = () => {
  const [conversionFactors, setConversionFactors] = useState<string[]>([
    "Response time to leads",
    "Industry expertise",
    "Previous relationship"
  ]);
  
  const [ticketSize, setTicketSize] = useState("10000-50000");
  const [wantExplanations, setWantExplanations] = useState("yes");
  const [leadsPerMonth, setLeadsPerMonth] = useState("100-500");
  const [leadExceptions, setLeadExceptions] = useState<string[]>(["Walk-ins", "Phone calls"]);
  const [newFactor, setNewFactor] = useState("");
  
  const handleAddFactor = () => {
    if (newFactor && conversionFactors.length < 3) {
      setConversionFactors([...conversionFactors, newFactor]);
      setNewFactor("");
    }
  };
  
  const handleRemoveFactor = (index: number) => {
    setConversionFactors(conversionFactors.filter((_, i) => i !== index));
  };
  
  const handleToggleLeadException = (exception: string) => {
    if (leadExceptions.includes(exception)) {
      setLeadExceptions(leadExceptions.filter(e => e !== exception));
    } else {
      setLeadExceptions([...leadExceptions, exception]);
    }
  };

  return (
    <div className="slide-container">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">
          Lead Conversion Insights
        </h1>
        <p className="text-saas-gray-medium">
          Help us understand your sales process for better lead assignment
        </p>
      </div>
      
      <div className="space-y-6">
        <div>
          <div className="flex items-center mb-2">
            <h3 className="font-medium">Key Conversion Factors</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" className="p-0 h-auto ml-1">
                    <Info className="w-4 h-4 text-saas-gray-medium" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">Select the 3 most important factors that affect your lead conversion rate</p>
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
                  <span>{factor}</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleRemoveFactor(index)}
                  className="h-6 text-xs"
                >
                  Remove
                </Button>
              </div>
            ))}
            
            {conversionFactors.length < 3 && (
              <div className="flex items-center space-x-2">
                <Input 
                  placeholder="Add a conversion factor"
                  value={newFactor}
                  onChange={(e) => setNewFactor(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleAddFactor} size="sm">Add</Button>
              </div>
            )}
          </div>
          
          <div className="text-sm text-saas-gray-medium mb-6">
            <p>Common factors: product knowledge, follow-up frequency, lead quality, demo effectiveness</p>
          </div>
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
    </div>
  );
};

export default ConversionFactorsScreen;
