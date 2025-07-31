import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const programFeeSchema = z.object({
  programName: z.string().min(1, "Program name is required"),
  domesticFee: z.string().min(1, "Domestic fee is required"),
  internationalFee: z.string().min(1, "International fee is required"),
  applicationFee: z.string().min(1, "Application fee is required"),
  currency: z.string().min(1, "Currency is required"),
});

type ProgramFeeForm = z.infer<typeof programFeeSchema>;

interface ProgramFeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ProgramFeeForm) => void;
  program?: any;
  title: string;
}

export const ProgramFeeModal = ({ isOpen, onClose, onSave, program, title }: ProgramFeeModalProps) => {
  const form = useForm<ProgramFeeForm>({
    resolver: zodResolver(programFeeSchema),
    defaultValues: {
      programName: program?.name || "",
      domesticFee: program?.domesticFee || "",
      internationalFee: program?.internationalFee || "",
      applicationFee: program?.applicationFee || "",
      currency: program?.currency || "CAD",
    },
  });

  const handleSubmit = (data: ProgramFeeForm) => {
    onSave(data);
    onClose();
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="programName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Program Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter program name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="CAD">CAD</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="domesticFee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Domestic Fee</FormLabel>
                  <FormControl>
                    <Input placeholder="0.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="internationalFee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>International Fee</FormLabel>
                  <FormControl>
                    <Input placeholder="0.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="applicationFee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Application Fee</FormLabel>
                  <FormControl>
                    <Input placeholder="0.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};