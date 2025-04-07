
import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface OrganizationFormValues {
  name: string;
  website: string;
  address: string;
  phone: string;
  industry: string;
  customerType: string;
  winMetric: string;
}

interface OrganizationSetupProps {
  onComplete: () => void;
}

const industries = [
  "Technology", "Healthcare", "Finance", "Education", "Retail", 
  "Manufacturing", "Real Estate", "Marketing", "Consulting", "Other"
];

const customerTypes = [
  "B2B", "B2C", "Both"
];

const OrganizationSetupScreen: React.FC<OrganizationSetupProps> = ({ onComplete }) => {
  const form = useForm<OrganizationFormValues>({
    defaultValues: {
      name: "",
      website: "",
      address: "",
      phone: "",
      industry: "",
      customerType: "",
      winMetric: ""
    }
  });

  const onSubmit = async (values: OrganizationFormValues) => {
    try {
      console.log("Organization details:", values);
      // Here we would save the organization details
      // In a real implementation, we would call an API to save the data
      
      toast.success("Organization created successfully!");
      onComplete(); // Move to the next step
    } catch (error) {
      console.error("Error creating organization:", error);
      toast.error("Failed to create organization");
    }
  };

  return (
    <div className="slide-container">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">
          Create Your Organization
        </h1>
        <p className="text-saas-gray-medium">
          Provide details about your company to set up your Learnlynk organization
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Acme Inc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input placeholder="https://www.example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="123 Main St, City, State" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="(555) 123-4567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="industry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Industry</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {industries.map(industry => (
                        <SelectItem key={industry} value={industry}>
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="customerType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Who is your customer?</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select customer type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {customerTypes.map(type => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="winMetric"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>What do you count as a win in HubSpot?</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Closed deal, Demo scheduled, etc." {...field} />
                  </FormControl>
                  <FormDescription>
                    This will help us track your success metrics
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end mt-6">
            <Button 
              type="submit" 
              className="bg-saas-blue hover:bg-blue-600"
            >
              Create Organization
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default OrganizationSetupScreen;
