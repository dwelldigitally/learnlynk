import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useSendReceipt, useReceiptTemplates } from '@/services/paymentService';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface SendReceiptButtonProps {
  paymentId: string;
  onSent?: () => void;
}

export function SendReceiptButton({ paymentId, onSent }: SendReceiptButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  
  const { data: templates = [] } = useReceiptTemplates();
  const sendReceiptMutation = useSendReceipt();

  const handleSend = async () => {
    await sendReceiptMutation.mutateAsync({
      paymentId,
      templateId: selectedTemplateId || undefined,
    });
    setIsOpen(false);
    onSent?.();
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
      >
        <Mail className="h-4 w-4 mr-2" />
        Send Receipt
      </Button>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Send Receipt</AlertDialogTitle>
            <AlertDialogDescription>
              This will send a payment receipt to the student's email address.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-2 py-4">
            <Label>Receipt Template</Label>
            <Select value={selectedTemplateId} onValueChange={setSelectedTemplateId}>
              <SelectTrigger>
                <SelectValue placeholder="Default template will be used" />
              </SelectTrigger>
              <SelectContent>
                {templates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name} {template.is_default && '(Default)'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSend}
              disabled={sendReceiptMutation.isPending}
            >
              {sendReceiptMutation.isPending ? 'Sending...' : 'Send Receipt'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
