import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { DollarSign, Plus, CreditCard, FileText, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Lead } from '@/types/lead';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface Payment {
  id: string;
  lead_id: string;
  amount: number;
  currency: string;
  payment_type: 'deposit' | 'tuition' | 'application_fee' | 'other';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_method: 'stripe' | 'bank_transfer' | 'check' | 'cash';
  reference_number?: string;
  due_date?: string;
  paid_date?: string;
  notes?: string;
  created_at: string;
}

interface Contract {
  id: string;
  lead_id: string;
  contract_type: 'enrollment' | 'financial_agreement' | 'scholarship' | 'other';
  title: string;
  status: 'draft' | 'sent' | 'signed' | 'expired' | 'cancelled';
  total_amount: number;
  currency: string;
  start_date: string;
  end_date?: string;
  signed_date?: string;
  contract_url?: string;
  notes?: string;
  created_at: string;
}

interface PaymentsContractsProps {
  lead: Lead;
  onUpdate: () => void;
}

export function PaymentsContracts({ lead, onUpdate }: PaymentsContractsProps) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [contractDialogOpen, setContractDialogOpen] = useState(false);
  const { toast } = useToast();

  const [newPayment, setNewPayment] = useState({
    amount: '',
    payment_type: 'deposit' as Payment['payment_type'],
    payment_method: 'stripe' as Payment['payment_method'],
    due_date: '',
    notes: ''
  });

  const [newContract, setNewContract] = useState({
    title: '',
    contract_type: 'enrollment' as Contract['contract_type'],
    total_amount: '',
    start_date: '',
    end_date: '',
    notes: ''
  });

  useEffect(() => {
    loadData();
  }, [lead.id]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Mock payment data
      const mockPayments: Payment[] = [
        {
          id: '1',
          lead_id: lead.id,
          amount: 500,
          currency: 'USD',
          payment_type: 'application_fee',
          status: 'completed',
          payment_method: 'stripe',
          reference_number: 'PAY_001_2024',
          paid_date: '2024-01-10T10:00:00Z',
          notes: 'Application fee payment',
          created_at: '2024-01-08T10:00:00Z'
        },
        {
          id: '2',
          lead_id: lead.id,
          amount: 5000,
          currency: 'USD',
          payment_type: 'deposit',
          status: 'pending',
          payment_method: 'bank_transfer',
          due_date: '2024-02-15T00:00:00Z',
          notes: 'Enrollment deposit - due before semester start',
          created_at: '2024-01-12T14:30:00Z'
        }
      ];

      // Mock contract data
      const mockContracts: Contract[] = [
        {
          id: '1',
          lead_id: lead.id,
          contract_type: 'enrollment',
          title: 'MBA Program Enrollment Agreement',
          status: 'sent',
          total_amount: 45000,
          currency: 'USD',
          start_date: '2024-09-01T00:00:00Z',
          end_date: '2026-06-30T00:00:00Z',
          contract_url: '/contracts/mba_enrollment_2024.pdf',
          notes: 'Full program enrollment contract',
          created_at: '2024-01-15T09:00:00Z'
        }
      ];

      setPayments(mockPayments);
      setContracts(mockContracts);
    } catch (error) {
      console.error('Error loading payments and contracts:', error);
      toast({
        title: "Error",
        description: "Failed to load financial data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePayment = async () => {
    try {
      const payment: Payment = {
        id: `pay-${Date.now()}`,
        lead_id: lead.id,
        amount: parseFloat(newPayment.amount),
        currency: 'USD',
        payment_type: newPayment.payment_type,
        status: 'pending',
        payment_method: newPayment.payment_method,
        due_date: newPayment.due_date || undefined,
        notes: newPayment.notes || undefined,
        created_at: new Date().toISOString()
      };

      setPayments(prev => [payment, ...prev]);
      setNewPayment({
        amount: '',
        payment_type: 'deposit',
        payment_method: 'stripe',
        due_date: '',
        notes: ''
      });
      setPaymentDialogOpen(false);
      onUpdate();

      toast({
        title: "Success",
        description: "Payment record created successfully"
      });
    } catch (error) {
      console.error('Error creating payment:', error);
      toast({
        title: "Error",
        description: "Failed to create payment record",
        variant: "destructive"
      });
    }
  };

  const handleCreateContract = async () => {
    try {
      const contract: Contract = {
        id: `contract-${Date.now()}`,
        lead_id: lead.id,
        contract_type: newContract.contract_type,
        title: newContract.title,
        status: 'draft',
        total_amount: parseFloat(newContract.total_amount),
        currency: 'USD',
        start_date: newContract.start_date,
        end_date: newContract.end_date || undefined,
        notes: newContract.notes || undefined,
        created_at: new Date().toISOString()
      };

      setContracts(prev => [contract, ...prev]);
      setNewContract({
        title: '',
        contract_type: 'enrollment',
        total_amount: '',
        start_date: '',
        end_date: '',
        notes: ''
      });
      setContractDialogOpen(false);
      onUpdate();

      toast({
        title: "Success",
        description: "Contract created successfully"
      });
    } catch (error) {
      console.error('Error creating contract:', error);
      toast({
        title: "Error",
        description: "Failed to create contract",
        variant: "destructive"
      });
    }
  };

  const getPaymentStatusIcon = (status: Payment['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'refunded': return <XCircle className="h-4 w-4 text-orange-500" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      default: return <DollarSign className="h-4 w-4" />;
    }
  };

  const getContractStatusIcon = (status: Contract['status']) => {
    switch (status) {
      case 'signed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'expired': 
      case 'cancelled': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'sent': return <Clock className="h-4 w-4 text-blue-500" />;
      case 'draft': return <FileText className="h-4 w-4 text-gray-500" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const formatCurrency = (amount: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const getTotalPaid = () => {
    return payments
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0);
  };

  const getTotalPending = () => {
    return payments
      .filter(p => p.status === 'pending')
      .reduce((sum, p) => sum + p.amount, 0);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Payments & Contracts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Loading financial data...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Payments & Contracts
          </div>
          <div className="flex gap-2">
            <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-1" />
                  Payment
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Payment Record</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="payment-amount">Amount</Label>
                      <Input
                        id="payment-amount"
                        type="number"
                        value={newPayment.amount}
                        onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <Label>Payment Type</Label>
                      <Select value={newPayment.payment_type} onValueChange={(value: Payment['payment_type']) => setNewPayment({ ...newPayment, payment_type: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="deposit">Deposit</SelectItem>
                          <SelectItem value="tuition">Tuition</SelectItem>
                          <SelectItem value="application_fee">Application Fee</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Payment Method</Label>
                    <Select value={newPayment.payment_method} onValueChange={(value: Payment['payment_method']) => setNewPayment({ ...newPayment, payment_method: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="stripe">Credit Card (Stripe)</SelectItem>
                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                        <SelectItem value="check">Check</SelectItem>
                        <SelectItem value="cash">Cash</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="payment-due-date">Due Date (Optional)</Label>
                    <Input
                      id="payment-due-date"
                      type="date"
                      value={newPayment.due_date}
                      onChange={(e) => setNewPayment({ ...newPayment, due_date: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="payment-notes">Notes</Label>
                    <Textarea
                      id="payment-notes"
                      value={newPayment.notes}
                      onChange={(e) => setNewPayment({ ...newPayment, notes: e.target.value })}
                      placeholder="Payment notes..."
                      rows={3}
                    />
                  </div>
                  
                  <Button onClick={handleCreatePayment} disabled={!newPayment.amount}>
                    Create Payment Record
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={contractDialogOpen} onOpenChange={setContractDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-1" />
                  Contract
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Contract</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="contract-title">Contract Title</Label>
                    <Input
                      id="contract-title"
                      value={newContract.title}
                      onChange={(e) => setNewContract({ ...newContract, title: e.target.value })}
                      placeholder="Contract title"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Contract Type</Label>
                      <Select value={newContract.contract_type} onValueChange={(value: Contract['contract_type']) => setNewContract({ ...newContract, contract_type: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="enrollment">Enrollment Agreement</SelectItem>
                          <SelectItem value="financial_agreement">Financial Agreement</SelectItem>
                          <SelectItem value="scholarship">Scholarship Agreement</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="contract-amount">Total Amount</Label>
                      <Input
                        id="contract-amount"
                        type="number"
                        value={newContract.total_amount}
                        onChange={(e) => setNewContract({ ...newContract, total_amount: e.target.value })}
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contract-start-date">Start Date</Label>
                      <Input
                        id="contract-start-date"
                        type="date"
                        value={newContract.start_date}
                        onChange={(e) => setNewContract({ ...newContract, start_date: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="contract-end-date">End Date (Optional)</Label>
                      <Input
                        id="contract-end-date"
                        type="date"
                        value={newContract.end_date}
                        onChange={(e) => setNewContract({ ...newContract, end_date: e.target.value })}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="contract-notes">Notes</Label>
                    <Textarea
                      id="contract-notes"
                      value={newContract.notes}
                      onChange={(e) => setNewContract({ ...newContract, notes: e.target.value })}
                      placeholder="Contract notes..."
                      rows={3}
                    />
                  </div>
                  
                  <Button onClick={handleCreateContract} disabled={!newContract.title || !newContract.total_amount || !newContract.start_date}>
                    Create Contract
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Financial Summary */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(getTotalPaid())}
            </div>
            <div className="text-sm text-muted-foreground">Total Paid</div>
          </div>
          <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">
              {formatCurrency(getTotalPending())}
            </div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </div>
          <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {contracts.length}
            </div>
            <div className="text-sm text-muted-foreground">Contracts</div>
          </div>
        </div>

        <Separator />

        {/* Payments Section */}
        <div>
          <h3 className="font-medium mb-3 flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Payments ({payments.length})
          </h3>
          {payments.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              <DollarSign className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No payments recorded yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {payments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getPaymentStatusIcon(payment.status)}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{formatCurrency(payment.amount)}</span>
                        <Badge variant="outline" className="text-xs">
                          {payment.payment_type.replace('_', ' ')}
                        </Badge>
                        <Badge variant={payment.status === 'completed' ? 'default' : 'secondary'} className="text-xs">
                          {payment.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {payment.payment_method} • {format(new Date(payment.created_at), 'MMM d, yyyy')}
                        {payment.due_date && ` • Due: ${format(new Date(payment.due_date), 'MMM d, yyyy')}`}
                      </div>
                      {payment.notes && (
                        <div className="text-xs text-muted-foreground mt-1">{payment.notes}</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <Separator />

        {/* Contracts Section */}
        <div>
          <h3 className="font-medium mb-3 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Contracts ({contracts.length})
          </h3>
          {contracts.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No contracts created yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {contracts.map((contract) => (
                <div key={contract.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getContractStatusIcon(contract.status)}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{contract.title}</span>
                        <Badge variant="outline" className="text-xs">
                          {contract.contract_type.replace('_', ' ')}
                        </Badge>
                        <Badge variant={contract.status === 'signed' ? 'default' : 'secondary'} className="text-xs">
                          {contract.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatCurrency(contract.total_amount)} • {format(new Date(contract.start_date), 'MMM d, yyyy')}
                        {contract.end_date && ` - ${format(new Date(contract.end_date), 'MMM d, yyyy')}`}
                      </div>
                      {contract.notes && (
                        <div className="text-xs text-muted-foreground mt-1">{contract.notes}</div>
                      )}
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    View Contract
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}