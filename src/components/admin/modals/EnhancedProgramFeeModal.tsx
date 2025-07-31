import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const feeItemSchema = z.object({
  type: z.string().min(1, "Fee type is required"),
  amount: z.string().min(1, "Amount is required"),
  currency: z.string().min(1, "Currency is required"),
  required: z.boolean().default(true),
});

const programFeeSchema = z.object({
  programName: z.string().min(1, "Program name is required"),
  domesticFees: z.array(feeItemSchema).min(1, "At least one domestic fee is required"),
  internationalFees: z.array(feeItemSchema).min(1, "At least one international fee is required"),
});

type ProgramFeeForm = z.infer<typeof programFeeSchema>;

interface EnhancedProgramFeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ProgramFeeForm) => void;
  program?: any;
  title: string;
  mode: "add" | "edit";
}

const FEE_TYPES = [
  "Tuition Fee",
  "Application Fee", 
  "Technology Fee",
  "Lab Fee",
  "Books & Materials",
  "Equipment Fee",
  "Student Services Fee",
  "Registration Fee",
  "Graduation Fee",
  "Activity Fee"
];

const CURRENCIES = ["CAD", "USD", "EUR", "GBP"];

export const EnhancedProgramFeeModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  program, 
  title, 
  mode 
}: EnhancedProgramFeeModalProps) => {
  const form = useForm<ProgramFeeForm>({
    resolver: zodResolver(programFeeSchema),
    defaultValues: {
      programName: "",
      domesticFees: [{ type: "Tuition Fee", amount: "", currency: "CAD", required: true }],
      internationalFees: [{ type: "Tuition Fee", amount: "", currency: "CAD", required: true }],
    },
  });

  // Reset form when program data changes
  React.useEffect(() => {
    if (isOpen && program) {
      form.reset({
        programName: program.name || "",
        domesticFees: program.domesticFees || [{ type: "Tuition Fee", amount: "", currency: "CAD", required: true }],
        internationalFees: program.internationalFees || [{ type: "Tuition Fee", amount: "", currency: "CAD", required: true }],
      });
    } else if (isOpen && !program) {
      form.reset({
        programName: "",
        domesticFees: [{ type: "Tuition Fee", amount: "", currency: "CAD", required: true }],
        internationalFees: [{ type: "Tuition Fee", amount: "", currency: "CAD", required: true }],
      });
    }
  }, [isOpen, program, form]);

  const { fields: domesticFields, append: appendDomestic, remove: removeDomestic } = useFieldArray({
    control: form.control,
    name: "domesticFees"
  });

  const { fields: intlFields, append: appendIntl, remove: removeIntl } = useFieldArray({
    control: form.control,
    name: "internationalFees"
  });

  const handleSubmit = (data: ProgramFeeForm) => {
    onSave(data);
    onClose();
    form.reset();
  };

  const addDomesticFee = () => {
    appendDomestic({ type: "", amount: "", currency: "CAD", required: true });
  };

  const addInternationalFee = () => {
    appendIntl({ type: "", amount: "", currency: "CAD", required: true });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="programName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Program Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter program name" 
                      {...field} 
                      disabled={mode === "edit"}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Domestic Fees */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle className="text-base">Domestic Student Fees</CardTitle>
                  <Button
                    type="button"
                    onClick={addDomesticFee}
                    size="sm"
                    variant="outline"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Fee
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {domesticFields.map((field, index) => (
                    <div key={field.id} className="border p-4 rounded-lg space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Fee {index + 1}</h4>
                        {domesticFields.length > 1 && (
                          <Button
                            type="button"
                            onClick={() => removeDomestic(index)}
                            size="sm"
                            variant="ghost"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      
                      <FormField
                        control={form.control}
                        name={`domesticFees.${index}.type`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Fee Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select fee type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {FEE_TYPES.map((feeType) => (
                                  <SelectItem key={feeType} value={feeType}>
                                    {feeType}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-2">
                        <FormField
                          control={form.control}
                          name={`domesticFees.${index}.amount`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Amount</FormLabel>
                              <FormControl>
                                <Input placeholder="0.00" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`domesticFees.${index}.currency`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Currency</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {CURRENCIES.map((currency) => (
                                    <SelectItem key={currency} value={currency}>
                                      {currency}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* International Fees */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle className="text-base">International Student Fees</CardTitle>
                  <Button
                    type="button"
                    onClick={addInternationalFee}
                    size="sm"
                    variant="outline"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Fee
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {intlFields.map((field, index) => (
                    <div key={field.id} className="border p-4 rounded-lg space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Fee {index + 1}</h4>
                        {intlFields.length > 1 && (
                          <Button
                            type="button"
                            onClick={() => removeIntl(index)}
                            size="sm"
                            variant="ghost"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      
                      <FormField
                        control={form.control}
                        name={`internationalFees.${index}.type`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Fee Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select fee type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {FEE_TYPES.map((feeType) => (
                                  <SelectItem key={feeType} value={feeType}>
                                    {feeType}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-2">
                        <FormField
                          control={form.control}
                          name={`internationalFees.${index}.amount`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Amount</FormLabel>
                              <FormControl>
                                <Input placeholder="0.00" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`internationalFees.${index}.currency`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Currency</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {CURRENCIES.map((currency) => (
                                    <SelectItem key={currency} value={currency}>
                                      {currency}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {mode === "add" ? "Create Program" : "Update Program"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};