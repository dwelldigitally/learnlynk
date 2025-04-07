
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface LinkFormValues {
  uniqueCode: string;
}

interface HubSpotLinkProps {
  onComplete: () => void;
}

const HubSpotLinkScreen: React.FC<HubSpotLinkProps> = ({ onComplete }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<LinkFormValues>({
    defaultValues: {
      uniqueCode: ""
    }
  });
  
  const onSubmit = async (values: LinkFormValues) => {
    setIsSubmitting(true);
    try {
      console.log("Linking with code:", values.uniqueCode);
      // Here we would verify the code and link the account
      // In a real implementation, we would call an API to verify the code
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success("Account linked successfully!");
      onComplete();
    } catch (error) {
      console.error("Error linking account:", error);
      toast.error("Failed to link account. Please check your code and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="slide-container">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">
          Link Your HubSpot Account
        </h1>
        <p className="text-saas-gray-medium">
          Enter the unique code displayed in your HubSpot Learnlynk app
        </p>
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
        <h3 className="font-medium text-blue-800 mb-2">Where to find your unique code</h3>
        <ol className="list-decimal list-inside text-sm space-y-2 text-blue-700">
          <li>Log in to your HubSpot account</li>
          <li>Navigate to the Marketplace and open the Learnlynk app</li>
          <li>Find the "Connect Account" section</li>
          <li>Copy the 8-digit unique code displayed there</li>
        </ol>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="uniqueCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unique Code</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter your 8-digit code" 
                      className="text-center text-lg tracking-wider" 
                      maxLength={8}
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    This code links your Learnlynk account to your HubSpot installation
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end pt-2">
              <Button 
                type="submit" 
                className="bg-saas-blue hover:bg-blue-600"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Verifying..." : "Link Account"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default HubSpotLinkScreen;
