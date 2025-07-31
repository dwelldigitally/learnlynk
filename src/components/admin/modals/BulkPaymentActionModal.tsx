import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Mail, MessageSquare } from "lucide-react";

const bulkActionSchema = z.object({
  action: z.string().min(1, "Action is required"),
  template: z.string().min(1, "Template is required"),
  customMessage: z.string().optional(),
});

type BulkActionForm = z.infer<typeof bulkActionSchema>;

interface BulkPaymentActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: BulkActionForm) => void;
  selectedStudents: any[];
  actionType: "invoice" | "reminder";
}

export const BulkPaymentActionModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  selectedStudents, 
  actionType 
}: BulkPaymentActionModalProps) => {
  const form = useForm<BulkActionForm>({
    resolver: zodResolver(bulkActionSchema),
    defaultValues: {
      action: actionType,
      template: "",
      customMessage: "",
    },
  });

  const handleSubmit = (data: BulkActionForm) => {
    onConfirm(data);
    onClose();
    form.reset();
  };

  const getActionTitle = () => {
    return actionType === "invoice" ? "Send Bulk Invoices" : "Send Bulk Reminders";
  };

  const getActionIcon = () => {
    return actionType === "invoice" ? <Mail className="h-5 w-5" /> : <MessageSquare className="h-5 w-5" />;
  };

  const templates = actionType === "invoice" 
    ? [
        { id: "standard_invoice", name: "Standard Invoice Template" },
        { id: "urgent_invoice", name: "Urgent Payment Invoice" },
        { id: "friendly_invoice", name: "Friendly Payment Request" },
      ]
    : [
        { id: "gentle_reminder", name: "Gentle Reminder" },
        { id: "urgent_reminder", name: "Urgent Payment Reminder" },
        { id: "final_notice", name: "Final Notice" },
      ];

  const totalAmount = selectedStudents.reduce((sum, student) => sum + (student.amountDue || 0), 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            {getActionIcon()}
            <span>{getActionTitle()}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Selection Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <span>Action Summary</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-medium">Selected Students:</div>
                  <div className="text-2xl font-bold text-blue-600">{selectedStudents.length}</div>
                </div>
                <div>
                  <div className="font-medium">Total Amount Due:</div>
                  <div className="text-2xl font-bold text-red-600">
                    ${totalAmount.toLocaleString()}
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="font-medium mb-2">Selected Students:</div>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {selectedStudents.slice(0, 5).map((student) => (
                    <div key={student.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="text-sm">{student.name}</span>
                      <Badge variant="outline">${student.amountDue}</Badge>
                    </div>
                  ))}
                  {selectedStudents.length > 5 && (
                    <div className="text-sm text-muted-foreground text-center p-2">
                      ... and {selectedStudents.length - 5} more students
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="template"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {actionType === "invoice" ? "Invoice Template" : "Reminder Template"}
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a template" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {templates.map((template) => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.name}
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
                name="customMessage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Message (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add a custom message to include with the template..."
                        {...field}
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <div className="font-medium">Important:</div>
                    <div>
                      This action will send {actionType === "invoice" ? "invoices" : "reminders"} to {selectedStudents.length} students. 
                      Make sure you have reviewed the selection and chosen the appropriate template.
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit">
                  Send {actionType === "invoice" ? "Invoices" : "Reminders"} ({selectedStudents.length})
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};