import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const configurationSchema = z.object({
  programId: z.string().min(1, "Program is required"),
  paymentDeadlines: z.object({
    fullPaymentDays: z.string().min(1, "Full payment deadline is required"),
    installmentDays: z.string().min(1, "Installment deadline is required"),
  }),
  lateFees: z.object({
    enabled: z.boolean(),
    amount: z.string().optional(),
    gracePeriodDays: z.string().optional(),
  }),
  paymentPlans: z.object({
    enabled: z.boolean(),
    maxInstallments: z.string().optional(),
    downPaymentPercentage: z.string().optional(),
  }),
  discounts: z.object({
    earlyBirdEnabled: z.boolean(),
    earlyBirdPercentage: z.string().optional(),
    earlyBirdDeadline: z.string().optional(),
    loyaltyEnabled: z.boolean(),
    loyaltyPercentage: z.string().optional(),
  }),
  refundPolicy: z.object({
    enabled: z.boolean(),
    cutoffDays: z.string().optional(),
    refundPercentage: z.string().optional(),
    terms: z.string().optional(),
  }),
});

type ConfigurationForm = z.infer<typeof configurationSchema>;

interface ProgramConfigurationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ConfigurationForm) => void;
  program?: any;
  programs: any[];
}

export const ProgramConfigurationModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  program,
  programs 
}: ProgramConfigurationModalProps) => {
  const form = useForm<ConfigurationForm>({
    resolver: zodResolver(configurationSchema),
    defaultValues: {
      programId: program?.id || "",
      paymentDeadlines: {
        fullPaymentDays: program?.paymentDeadlines?.fullPaymentDays || "30",
        installmentDays: program?.paymentDeadlines?.installmentDays || "14",
      },
      lateFees: {
        enabled: program?.lateFees?.enabled || false,
        amount: program?.lateFees?.amount || "",
        gracePeriodDays: program?.lateFees?.gracePeriodDays || "7",
      },
      paymentPlans: {
        enabled: program?.paymentPlans?.enabled || false,
        maxInstallments: program?.paymentPlans?.maxInstallments || "3",
        downPaymentPercentage: program?.paymentPlans?.downPaymentPercentage || "25",
      },
      discounts: {
        earlyBirdEnabled: program?.discounts?.earlyBirdEnabled || false,
        earlyBirdPercentage: program?.discounts?.earlyBirdPercentage || "",
        earlyBirdDeadline: program?.discounts?.earlyBirdDeadline || "",
        loyaltyEnabled: program?.discounts?.loyaltyEnabled || false,
        loyaltyPercentage: program?.discounts?.loyaltyPercentage || "",
      },
      refundPolicy: {
        enabled: program?.refundPolicy?.enabled || false,
        cutoffDays: program?.refundPolicy?.cutoffDays || "14",
        refundPercentage: program?.refundPolicy?.refundPercentage || "100",
        terms: program?.refundPolicy?.terms || "",
      },
    },
  });

  const handleSubmit = (data: ConfigurationForm) => {
    onSave(data);
    onClose();
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Configure Program Settings</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="programId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Program</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a program to configure" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {programs.map((prog) => (
                        <SelectItem key={prog.id} value={prog.id}>
                          {prog.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Tabs defaultValue="payment-deadlines" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="payment-deadlines">Deadlines</TabsTrigger>
                <TabsTrigger value="late-fees">Late Fees</TabsTrigger>
                <TabsTrigger value="payment-plans">Payment Plans</TabsTrigger>
                <TabsTrigger value="discounts">Discounts</TabsTrigger>
                <TabsTrigger value="refunds">Refunds</TabsTrigger>
              </TabsList>

              <TabsContent value="payment-deadlines">
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Deadlines</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="paymentDeadlines.fullPaymentDays"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Payment Due (days before start)</FormLabel>
                          <FormControl>
                            <Input placeholder="30" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="paymentDeadlines.installmentDays"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Installment Payment Due (days before start)</FormLabel>
                          <FormControl>
                            <Input placeholder="14" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="late-fees">
                <Card>
                  <CardHeader>
                    <CardTitle>Late Fee Configuration</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="lateFees.enabled"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Enable Late Fees</FormLabel>
                            <div className="text-sm text-muted-foreground">
                              Charge late fees for overdue payments
                            </div>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lateFees.amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Late Fee Amount ($)</FormLabel>
                          <FormControl>
                            <Input placeholder="50.00" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lateFees.gracePeriodDays"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Grace Period (days)</FormLabel>
                          <FormControl>
                            <Input placeholder="7" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="payment-plans">
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Plan Configuration</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="paymentPlans.enabled"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Enable Payment Plans</FormLabel>
                            <div className="text-sm text-muted-foreground">
                              Allow students to pay in installments
                            </div>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="paymentPlans.maxInstallments"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Maximum Installments</FormLabel>
                          <FormControl>
                            <Input placeholder="3" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="paymentPlans.downPaymentPercentage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Down Payment (%)</FormLabel>
                          <FormControl>
                            <Input placeholder="25" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="discounts">
                <Card>
                  <CardHeader>
                    <CardTitle>Discount Configuration</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="discounts.earlyBirdEnabled"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Early Bird Discount</FormLabel>
                            <div className="text-sm text-muted-foreground">
                              Discount for early payments
                            </div>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="discounts.earlyBirdPercentage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Early Bird Discount (%)</FormLabel>
                            <FormControl>
                              <Input placeholder="10" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="discounts.earlyBirdDeadline"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Deadline (days before start)</FormLabel>
                            <FormControl>
                              <Input placeholder="60" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="refunds">
                <Card>
                  <CardHeader>
                    <CardTitle>Refund Policy</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="refundPolicy.enabled"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Enable Refunds</FormLabel>
                            <div className="text-sm text-muted-foreground">
                              Allow refunds based on policy
                            </div>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="refundPolicy.cutoffDays"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Refund Cutoff (days before start)</FormLabel>
                            <FormControl>
                              <Input placeholder="14" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="refundPolicy.refundPercentage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Refund Percentage (%)</FormLabel>
                            <FormControl>
                              <Input placeholder="100" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="refundPolicy.terms"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Additional Terms</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Enter additional refund policy terms..."
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Save Configuration</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};