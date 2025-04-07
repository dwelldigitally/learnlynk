
import React, { useState, useEffect } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import hubspotService from "@/services/hubspotService";

interface WinDefinitionProps {
  onDefinitionChange: (definition: WinDefinitionValues) => void;
}

export interface WinDefinitionValues {
  winDefinition: string;
  customDealStage?: string;
  hasChanged: string;
  previousDefinition?: string;
  changeDate?: string;
}

const WinDefinitionSection: React.FC<WinDefinitionProps> = ({ onDefinitionChange }) => {
  const [dealStages, setDealStages] = useState<string[]>([
    "Closed Won", 
    "Deal Created",
    "Demo Scheduled",
    "Proposal Sent",
    "Contract Signed",
    "Custom"
  ]);

  const form = useForm<WinDefinitionValues>({
    defaultValues: {
      winDefinition: "",
      customDealStage: "",
      hasChanged: "no",
      previousDefinition: "",
      changeDate: "",
    }
  });

  // Watch the form values to trigger the callback when they change
  const formValues = form.watch();
  
  useEffect(() => {
    onDefinitionChange(formValues);
  }, [formValues, onDefinitionChange]);

  // Fetch real deal stages from HubSpot in a real implementation
  useEffect(() => {
    const fetchDealStages = async () => {
      // In a real implementation, we would fetch the deal stages from HubSpot
      // For now we're using a mock list
      try {
        const isConnected = await hubspotService.testConnection();
        if (isConnected) {
          // In a real implementation:
          // const stages = await hubspotService.fetchDealStages();
          // setDealStages([...stages, "Custom"]);
        }
      } catch (error) {
        console.error("Error fetching deal stages:", error);
      }
    };
    
    fetchDealStages();
  }, []);

  return (
    <Form {...form}>
      <form className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">What do you count as a win in HubSpot?</h3>
          
          <FormField
            control={form.control}
            name="winDefinition"
            render={({ field }) => (
              <FormItem>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select what counts as a win" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {dealStages.map(stage => (
                      <SelectItem key={stage} value={stage}>
                        {stage}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  This helps us track your success metrics accurately
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {form.watch("winDefinition") === "Custom" && (
            <FormField
              control={form.control}
              name="customDealStage"
              render={({ field }) => (
                <FormItem className="mt-4">
                  <FormLabel>Custom Deal Stage</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter custom deal stage" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-2">Has your definition of a win changed since you started using HubSpot?</h3>
          
          <FormField
            control={form.control}
            name="hasChanged"
            render={({ field }) => (
              <FormItem>
                <RadioGroup 
                  onValueChange={field.onChange} 
                  value={field.value} 
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="no" id="no-change" />
                    <Label htmlFor="no-change">No, it has always been the same</Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="yes" id="yes-change" />
                    <Label htmlFor="yes-change">Yes, the definition has changed</Label>
                  </div>
                </RadioGroup>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {form.watch("hasChanged") === "yes" && (
            <div className="mt-4 space-y-4">
              <FormField
                control={form.control}
                name="previousDefinition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What was your previous definition of a win?</FormLabel>
                    <FormControl>
                      <Input placeholder="Previous win definition" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="changeDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>When did you change the definition? (approximate date)</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>
      </form>
    </Form>
  );
};

export default WinDefinitionSection;
