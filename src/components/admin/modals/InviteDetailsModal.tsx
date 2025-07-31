import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Mail, Clock, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PendingInvite {
  id: string;
  email: string;
  role: string;
  department: string;
  sentDate: string;
  expiresDate: string;
  sentBy: string;
  message?: string;
}

interface InviteDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  invite: PendingInvite | null;
  onResendInvite: (inviteId: string, customMessage?: string) => void;
  onCancelInvite: (inviteId: string) => void;
}

const InviteDetailsModal: React.FC<InviteDetailsModalProps> = ({
  isOpen,
  onClose,
  invite,
  onResendInvite,
  onCancelInvite
}) => {
  const [customMessage, setCustomMessage] = useState("");
  const [isResending, setIsResending] = useState(false);
  const { toast } = useToast();

  const handleResend = async () => {
    if (!invite) return;
    
    setIsResending(true);
    try {
      await onResendInvite(invite.id, customMessage);
      toast({
        title: "Invitation Resent",
        description: `A new invitation has been sent to ${invite.email}`,
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resend invitation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleCancel = () => {
    if (!invite) return;
    
    onCancelInvite(invite.id);
    toast({
      title: "Invitation Cancelled",
      description: `The invitation for ${invite.email} has been cancelled.`,
    });
    onClose();
  };

  if (!invite) return null;

  const isExpired = new Date(invite.expiresDate) < new Date();
  const daysUntilExpiry = Math.ceil(
    (new Date(invite.expiresDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-6 w-6" />
            Invitation Details
          </DialogTitle>
          <DialogDescription>
            Manage the pending invitation for {invite.email}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Invitation Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                Invitation Status
                <Badge variant={isExpired ? "destructive" : "default"}>
                  {isExpired ? "Expired" : "Pending"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="font-medium">{invite.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Role</p>
                    <p className="font-medium">{invite.role}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Sent Date</p>
                    <p className="font-medium">{invite.sentDate}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {isExpired ? "Expired" : "Expires"}
                    </p>
                    <p className="font-medium">
                      {isExpired ? invite.expiresDate : `In ${daysUntilExpiry} days`}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground">Sent by</p>
                <p className="font-medium">{invite.sentBy}</p>
              </div>

              {invite.message && (
                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground">Original Message</p>
                  <p className="text-sm bg-muted p-3 rounded-md mt-1">{invite.message}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Resend Options */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Resend Invitation</CardTitle>
              <DialogDescription>
                Optionally include a custom message with the new invitation.
              </DialogDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="message">Custom Message (Optional)</Label>
                <Textarea
                  id="message"
                  placeholder="Add a personal message to the invitation..."
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <div className="flex gap-2 w-full">
            <Button 
              variant="destructive" 
              onClick={handleCancel}
              className="flex-1"
            >
              Cancel Invitation
            </Button>
            <Button 
              onClick={handleResend}
              disabled={isResending}
              className="flex-1"
            >
              {isResending ? "Sending..." : "Resend Invitation"}
            </Button>
          </div>
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InviteDetailsModal;