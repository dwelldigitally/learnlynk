
import React, { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormContext } from "react-hook-form";

export interface WinDefinitionValues {
  winType: string;
  customDealStage?: string;
  hasChanged: boolean;
  previousDefinition?: string;
  changeDate?: string;
}

interface WinDefinitionSectionProps {
  onDefinitionChange: (values: WinDefinitionValues) => void;
}

const WinDefinitionSection: React.FC<WinDefinitionSectionProps> = ({ onDefinitionChange }) => {
  // Access the form context provided by the parent Form component
  const form = useFormContext();
  
  const [winType, setWinType] = useState("closed_won");
  const [hasDefinitionChanged, setHasDefinitionChanged] = useState(false);
  const [previousDefinition, setPreviousDefinition] = useState("");
  const [changeDate, setChangeDate] = useState("");
  const [customDealStage, setCustomDealStage] = useState("");
  
  const handleWinTypeChange = (value: string) => {
    setWinType(value);
    updateParent(value, customDealStage, hasDefinitionChanged, previousDefinition, changeDate);
  };
  
  const handleCustomStageChange = (value: string) => {
    setCustomDealStage(value);
    updateParent(winType, value, hasDefinitionChanged, previousDefinition, changeDate);
  };
  
  const handleDefinitionChangeToggle = (value: string) => {
    const hasChanged = value === "yes";
    setHasDefinitionChanged(hasChanged);
    updateParent(winType, customDealStage, hasChanged, previousDefinition, changeDate);
  };
  
  const handlePreviousDefinitionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPreviousDefinition(e.target.value);
    updateParent(winType, customDealStage, hasDefinitionChanged, e.target.value, changeDate);
  };
  
  const handleChangeDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChangeDate(e.target.value);
    updateParent(winType, customDealStage, hasDefinitionChanged, previousDefinition, e.target.value);
  };
  
  const updateParent = (
    winType: string, 
    customDealStage: string, 
    hasChanged: boolean, 
    previousDef: string, 
    changeDate: string
  ) => {
    onDefinitionChange({
      winType,
      customDealStage: customDealStage || undefined,
      hasChanged,
      previousDefinition: previousDef || undefined,
      changeDate: changeDate || undefined
    });
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Define a "Win" in your organization</h3>
        
        <Select value={winType} onValueChange={handleWinTypeChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select what constitutes a win" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="closed_won">Deal is closed won</SelectItem>
            <SelectItem value="deal_created">Deal is created</SelectItem>
            <SelectItem value="custom_stage">Deal stage is...</SelectItem>
          </SelectContent>
        </Select>
        
        {winType === "custom_stage" && (
          <div className="mt-4">
            <Label htmlFor="custom-stage">Custom Deal Stage</Label>
            <Select 
              value={customDealStage} 
              onValueChange={handleCustomStageChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a deal stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="appointment_scheduled">Appointment Scheduled</SelectItem>
                <SelectItem value="qualified_to_buy">Qualified to Buy</SelectItem>
                <SelectItem value="presentation_scheduled">Presentation Scheduled</SelectItem>
                <SelectItem value="decision_maker_bought_in">Decision Maker Bought-In</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
      
      <div>
        <h3 className="text-base font-semibold mb-2">Has this definition changed?</h3>
        <p className="text-sm text-saas-gray-medium mb-4">
          This helps us calibrate our AI model to your historical data
        </p>
        
        <RadioGroup
          value={hasDefinitionChanged ? "yes" : "no"}
          onValueChange={handleDefinitionChangeToggle}
          className="flex gap-6"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="definition-no-change" />
            <Label htmlFor="definition-no-change">No, it's always been the same</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="definition-changed" />
            <Label htmlFor="definition-changed">Yes, it has changed</Label>
          </div>
        </RadioGroup>
        
        {hasDefinitionChanged && (
          <div className="mt-4 space-y-4 bg-gray-50 p-4 rounded-md">
            <div>
              <Label htmlFor="previous-definition">Previous definition of a win</Label>
              <Input
                id="previous-definition"
                value={previousDefinition}
                onChange={handlePreviousDefinitionChange}
                placeholder="e.g., Contract signed"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="change-date">When did this definition change?</Label>
              <Input
                id="change-date"
                type="date"
                value={changeDate}
                onChange={handleChangeDateChange}
                className="mt-1"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WinDefinitionSection;
