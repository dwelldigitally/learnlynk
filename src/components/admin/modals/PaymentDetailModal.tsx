import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar, DollarSign, Mail, Phone, User } from "lucide-react";

interface PaymentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: any;
  onSendInvoice: (paymentId: string) => void;
  onSendReminder: (paymentId: string) => void;
  onEditPayment: (payment: any) => void;
}

export const PaymentDetailModal = ({ 
  isOpen, 
  onClose, 
  payment, 
  onSendInvoice, 
  onSendReminder, 
  onEditPayment 
}: PaymentDetailModalProps) => {
  if (!payment) return null;

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      "ready": { variant: "secondary" as const, label: "Ready to Send" },
      "sent": { variant: "default" as const, label: "Invoice Sent" },
      "received": { variant: "default" as const, label: "Payment Received" },
      "pending": { variant: "outline" as const, label: "Pending" },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Payment Details - {payment.student}
            {getStatusBadge(payment.status)}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Student Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Student Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{payment.student}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Program</p>
                  <p className="font-medium">{payment.program}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Student ID</p>
                  <p className="font-medium">{payment.studentId}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Application Date</p>
                  <p className="font-medium">{payment.applicationDate}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="font-medium text-lg">{payment.amount}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Due Date</p>
                  <p className="font-medium">{payment.dueDate}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Payment Type</p>
                  <p className="font-medium">Application Fee</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-medium">{payment.status}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{payment.email || "student@example.com"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{payment.phone || "+1 (555) 123-4567"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Actions */}
          <div className="flex justify-between">
            <div className="space-x-2">
              <Button 
                variant="outline" 
                onClick={() => onEditPayment(payment)}
              >
                Edit Payment
              </Button>
            </div>
            <div className="space-x-2">
              {payment.status === "ready" && (
                <Button onClick={() => onSendInvoice(payment.id)}>
                  Send Invoice
                </Button>
              )}
              {payment.status === "sent" && (
                <Button 
                  variant="outline" 
                  onClick={() => onSendReminder(payment.id)}
                >
                  Send Reminder
                </Button>
              )}
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};