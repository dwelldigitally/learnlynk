import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";

const scholarshipSchema = z.object({
  name: z.string().min(1, "Scholarship name is required"),
  description: z.string().min(1, "Description is required"),
  amount: z.string().min(1, "Amount is required"),
  totalBudget: z.string().min(1, "Total budget is required"),
  deadline: z.string().min(1, "Deadline is required"),
  eligibilityCriteria: z.string().min(1, "Eligibility criteria is required"),
  programs: z.array(z.string()).min(1, "At least one program must be selected"),
  requiresEssay: z.boolean(),
  requiresTranscript: z.boolean(),
  requiresRecommendation: z.boolean(),
});

type ScholarshipForm = z.infer<typeof scholarshipSchema>;

interface ScholarshipModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ScholarshipForm) => void;
  scholarship?: any;
  title: string;
}

const availablePrograms = [
  "Health Care Assistant",
  "Medical Office Assistant", 
  "Pharmacy Technician",
  "Dental Assistant",
  "Personal Support Worker"
];

export const ScholarshipModal = ({ isOpen, onClose, onSave, scholarship, title }: ScholarshipModalProps) => {
  const form = useForm<ScholarshipForm>({
    resolver: zodResolver(scholarshipSchema),
    defaultValues: {
      name: scholarship?.name || "",
      description: scholarship?.description || "",
      amount: scholarship?.amount?.replace('$', '') || "",
      totalBudget: scholarship?.totalBudget?.replace('$', '') || "",
      deadline: scholarship?.deadline || "",
      eligibilityCriteria: scholarship?.eligibilityCriteria || "",
      programs: scholarship?.programs || [],
      requiresEssay: scholarship?.requiresEssay || false,
      requiresTranscript: scholarship?.requiresTranscript || false,
      requiresRecommendation: scholarship?.requiresRecommendation || false,
    },
  });

  const handleSubmit = (data: ScholarshipForm) => {
    onSave(data);
    onClose();
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Scholarship Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter scholarship name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount per Award</FormLabel>
                    <FormControl>
                      <Input placeholder="5000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="totalBudget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Budget</FormLabel>
                    <FormControl>
                      <Input placeholder="50000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="deadline"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Application Deadline</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter scholarship description"
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="eligibilityCriteria"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Eligibility Criteria</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter eligibility requirements"
                      className="min-h-[80px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="programs"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Eligible Programs</FormLabel>
                  <FormDescription>
                    Select which programs this scholarship applies to
                  </FormDescription>
                  <div className="grid grid-cols-2 gap-2">
                    {availablePrograms.map((program) => (
                      <div key={program} className="flex items-center space-x-2">
                        <Checkbox
                          id={program}
                          checked={field.value?.includes(program)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              field.onChange([...field.value, program]);
                            } else {
                              field.onChange(field.value?.filter((p) => p !== program));
                            }
                          }}
                        />
                        <label
                          htmlFor={program}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {program}
                        </label>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-3">
              <FormLabel>Application Requirements</FormLabel>
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="requiresEssay"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Requires Essay
                      </FormLabel>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="requiresTranscript"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Requires Official Transcript
                      </FormLabel>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="requiresRecommendation"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Requires Letter of Recommendation
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Save Scholarship</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};