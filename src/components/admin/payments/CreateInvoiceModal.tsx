import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { InvoiceTemplateSelector } from './InvoiceTemplateSelector';
import { SUPPORTED_CURRENCIES } from '@/utils/currency';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

interface CreateInvoiceModalProps {
  leadId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateInvoiceModal({ leadId, open, onOpenChange }: CreateInvoiceModalProps) {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<string>('USD');
  const [paymentType, setPaymentType] = useState('application_fee');
  const [notes, setNotes] = useState('');
  const [templateId, setTemplateId] = useState<string>('');
  const [dueDate, setDueDate] = useState<Date>();

  const queryClient = useQueryClient();

  const createPaymentMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from('payments')
        .insert({
          lead_id: leadId,
          amount: parseFloat(amount),
          currency,
          payment_type: paymentType,
          notes,
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lead-payments', leadId] });
      queryClient.invalidateQueries({ queryKey: ['payment-stats', leadId] });
      toast({
        title: 'Success',
        description: 'Payment created successfully',
      });
      resetForm();
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: `Failed to create payment: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const createAndSendMutation = useMutation({
    mutationFn: async () => {
      // First create the payment
      const { data: payment, error: createError } = await supabase
        .from('payments')
        .insert({
          lead_id: leadId,
          amount: parseFloat(amount),
          currency,
          payment_type: paymentType,
          notes,
          status: 'pending',
        })
        .select()
        .single();

      if (createError) throw createError;

      // Then send the invoice
      const { error: sendError } = await supabase.functions.invoke('send-invoice-email', {
        body: { payment_id: payment.id, template_id: templateId || undefined }
      });

      if (sendError) throw sendError;
      return payment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lead-payments', leadId] });
      queryClient.invalidateQueries({ queryKey: ['payment-stats', leadId] });
      toast({
        title: 'Success',
        description: 'Invoice created and sent successfully',
      });
      resetForm();
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: `Failed to create and send invoice: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const resetForm = () => {
    setAmount('');
    setCurrency('USD');
    setPaymentType('application_fee');
    setNotes('');
    setTemplateId('');
    setDueDate(undefined);
  };

  const isValid = amount && parseFloat(amount) > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Invoice</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Currency *</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SUPPORTED_CURRENCIES.map((curr) => (
                    <SelectItem key={curr} value={curr}>
                      {curr}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment-type">Payment Type *</Label>
            <Select value={paymentType} onValueChange={setPaymentType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="application_fee">Application Fee</SelectItem>
                <SelectItem value="tuition">Tuition</SelectItem>
                <SelectItem value="deposit">Deposit</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, 'PPP') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="template">Invoice Template</Label>
            <InvoiceTemplateSelector value={templateId} onChange={setTemplateId} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Add any additional notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="outline"
            onClick={() => createPaymentMutation.mutate()}
            disabled={!isValid || createPaymentMutation.isPending}
          >
            Save as Draft
          </Button>
          <Button
            onClick={() => createAndSendMutation.mutate()}
            disabled={!isValid || createAndSendMutation.isPending}
          >
            {createAndSendMutation.isPending ? 'Sending...' : 'Create & Send'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
