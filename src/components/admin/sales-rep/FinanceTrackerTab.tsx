import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, TrendingUp, Clock, CheckCircle2, Eye, FileText, Mail, Loader2, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { salesRepService, StudentPaymentPending, RecentPayment } from '@/services/salesRepService';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export function FinanceTrackerTab() {
  const navigate = useNavigate();
  const [paymentDaysFilter, setPaymentDaysFilter] = useState<7 | 30 | 90>(30);

  // Mock data for demonstration
  const mockPaymentPendingStudents: StudentPaymentPending[] = [
    {
      id: '1',
      master_record_id: 'mr-1',
      first_name: 'Sarah',
      last_name: 'Johnson',
      email: 'sarah.johnson@email.com',
      program: 'MBA - Business Analytics',
      payment_status: 'partial',
      outstanding_amount: 8500,
      days_since_approval: 18,
      approved_at: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '2',
      master_record_id: 'mr-2',
      first_name: 'Michael',
      last_name: 'Chen',
      email: 'michael.chen@email.com',
      program: 'Executive MBA',
      payment_status: 'pending',
      outstanding_amount: 25000,
      days_since_approval: 7,
      approved_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '3',
      master_record_id: 'mr-3',
      first_name: 'Emily',
      last_name: 'Rodriguez',
      email: 'emily.rodriguez@email.com',
      program: 'Digital Marketing Certificate',
      payment_status: 'pending',
      outstanding_amount: 3500,
      days_since_approval: 22,
      approved_at: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '4',
      master_record_id: 'mr-4',
      first_name: 'David',
      last_name: 'Kim',
      email: 'david.kim@email.com',
      program: 'Data Science Certificate',
      payment_status: 'partial',
      outstanding_amount: 2200,
      days_since_approval: 5,
      approved_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '5',
      master_record_id: 'mr-5',
      first_name: 'Jennifer',
      last_name: 'Wilson',
      email: 'jennifer.wilson@email.com',
      program: 'Finance MBA',
      payment_status: 'pending',
      outstanding_amount: 18000,
      days_since_approval: 15,
      approved_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  const mockRecentPayments: RecentPayment[] = [
    {
      id: 'pay-1',
      lead_id: 'mr-6',
      amount: 5000,
      currency: 'USD',
      payment_type: 'tuition_deposit',
      status: 'paid',
      paid_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      student_name: 'Jessica Williams',
      student_email: 'jessica.williams@email.com'
    },
    {
      id: 'pay-2',
      lead_id: 'mr-7',
      amount: 12500,
      currency: 'USD',
      payment_type: 'full_tuition',
      status: 'paid',
      paid_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      student_name: 'Robert Taylor',
      student_email: 'robert.taylor@email.com'
    },
    {
      id: 'pay-3',
      lead_id: 'mr-1',
      amount: 6500,
      currency: 'USD',
      payment_type: 'partial_payment',
      status: 'paid',
      paid_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      student_name: 'Sarah Johnson',
      student_email: 'sarah.johnson@email.com'
    },
    {
      id: 'pay-4',
      lead_id: 'mr-8',
      amount: 3500,
      currency: 'USD',
      payment_type: 'application_fee',
      status: 'paid',
      paid_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      student_name: 'Amanda Martinez',
      student_email: 'amanda.martinez@email.com'
    },
    {
      id: 'pay-5',
      lead_id: 'mr-4',
      amount: 2800,
      currency: 'USD',
      payment_type: 'partial_payment',
      status: 'paid',
      paid_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
      student_name: 'David Kim',
      student_email: 'david.kim@email.com'
    },
    {
      id: 'pay-6',
      lead_id: 'mr-9',
      amount: 8500,
      currency: 'USD',
      payment_type: 'tuition_deposit',
      status: 'pending',
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      student_name: 'Christopher Lee',
      student_email: 'christopher.lee@email.com'
    },
    {
      id: 'pay-7',
      lead_id: 'mr-10',
      amount: 15000,
      currency: 'USD',
      payment_type: 'full_tuition',
      status: 'paid',
      paid_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      student_name: 'Patricia Anderson',
      student_email: 'patricia.anderson@email.com'
    },
    {
      id: 'pay-8',
      lead_id: 'mr-11',
      amount: 4200,
      currency: 'USD',
      payment_type: 'application_fee',
      status: 'paid',
      paid_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      student_name: 'Daniel Brown',
      student_email: 'daniel.brown@email.com'
    },
    {
      id: 'pay-9',
      lead_id: 'mr-12',
      amount: 1500,
      currency: 'USD',
      payment_type: 'partial_payment',
      status: 'failed',
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      student_name: 'Michelle Garcia',
      student_email: 'michelle.garcia@email.com'
    },
    {
      id: 'pay-10',
      lead_id: 'mr-13',
      amount: 22000,
      currency: 'USD',
      payment_type: 'full_tuition',
      status: 'paid',
      paid_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
      student_name: 'Thomas White',
      student_email: 'thomas.white@email.com'
    }
  ];

  const { data: paymentPendingStudents = mockPaymentPendingStudents, isLoading: loadingPending } = useQuery({
    queryKey: ['sales-rep-payment-pending'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return mockPaymentPendingStudents;
      try {
        const result = await salesRepService.getPaymentPendingStudents(user.id);
        return result.length > 0 ? result : mockPaymentPendingStudents;
      } catch (error) {
        console.error('Error fetching payment pending students, using mock data:', error);
        return mockPaymentPendingStudents;
      }
    },
    staleTime: 5 * 60 * 1000,
  });

  const { data: recentPayments = mockRecentPayments, isLoading: loadingPayments } = useQuery({
    queryKey: ['sales-rep-recent-payments', paymentDaysFilter],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return mockRecentPayments;
      try {
        const result = await salesRepService.getRecentPaymentsForAssignedStudents(user.id, paymentDaysFilter);
        return result.length > 0 ? result : mockRecentPayments;
      } catch (error) {
        console.error('Error fetching recent payments, using mock data:', error);
        return mockRecentPayments;
      }
    },
    staleTime: 5 * 60 * 1000,
  });

  const isLoading = loadingPending || loadingPayments;

  // Calculate stats
  const totalRevenue = recentPayments
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + Number(p.amount), 0);
  
  const pendingRevenue = paymentPendingStudents.reduce(
    (sum, s) => sum + s.outstanding_amount, 
    0
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getPaymentStatusConfig = (status: string) => {
    switch (status) {
      case 'paid':
        return { color: 'text-green-600', bg: 'bg-green-100', label: 'Paid' };
      case 'pending':
        return { color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Pending' };
      case 'partial':
        return { color: 'text-orange-600', bg: 'bg-orange-100', label: 'Partial' };
      case 'failed':
        return { color: 'text-destructive', bg: 'bg-destructive/10', label: 'Failed' };
      default:
        return { color: 'text-muted-foreground', bg: 'bg-muted', label: status };
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700">Total Revenue ({paymentDaysFilter}d)</p>
              <p className="text-2xl font-bold text-green-900">{formatCurrency(totalRevenue)}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="p-4 rounded-lg bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-700">Pending Payment</p>
              <p className="text-2xl font-bold text-orange-900">{formatCurrency(pendingRevenue)}</p>
            </div>
            <Clock className="w-8 h-8 text-orange-600" />
          </div>
        </div>

        <div className="p-4 rounded-lg bg-card border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Students Awaiting</p>
              <p className="text-2xl font-bold text-foreground">{paymentPendingStudents.length}</p>
            </div>
            <DollarSign className="w-8 h-8 text-primary" />
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Payments */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-primary" />
              Recent Payments
            </h3>
            <Tabs value={paymentDaysFilter.toString()} onValueChange={(v) => setPaymentDaysFilter(Number(v) as any)}>
              <TabsList className="h-9">
                <TabsTrigger value="7" className="text-sm">7d</TabsTrigger>
                <TabsTrigger value="30" className="text-sm">30d</TabsTrigger>
                <TabsTrigger value="90" className="text-sm">90d</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {recentPayments.length === 0 ? (
              <div className="text-center py-8 bg-card rounded-lg border border-border">
                <DollarSign className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No payments in the last {paymentDaysFilter} days</p>
              </div>
            ) : (
              recentPayments.map((payment) => {
                const statusConfig = getPaymentStatusConfig(payment.status);
                
                return (
                  <div
                    key={payment.id}
                    className="p-3 rounded-lg border border-border bg-card hover:border-primary/30 transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {payment.student_name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm text-foreground">{payment.student_name}</p>
                          <p className="text-xs text-muted-foreground">{payment.student_email}</p>
                        </div>
                      </div>
                      <Badge className={cn("text-xs", statusConfig.color, statusConfig.bg)}>
                        {statusConfig.label}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-foreground">{formatCurrency(Number(payment.amount))}</span>
                      <span className="text-xs text-muted-foreground">{formatDate(payment.created_at)}</span>
                    </div>
                    
                    {payment.payment_type && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Type: {payment.payment_type.replace('_', ' ')}
                      </p>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Payment Pending Students */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-foreground flex items-center gap-2 mb-2">
            <Clock className="w-6 h-6 text-orange-500" />
            Payment Pending Students
          </h3>

          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {paymentPendingStudents.length === 0 ? (
              <div className="text-center py-8 bg-card rounded-lg border border-border">
                <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">All students have completed payments!</p>
              </div>
            ) : (
              paymentPendingStudents.map((student) => (
                <div
                  key={student.id}
                  className={cn(
                    "p-4 rounded-lg border bg-card transition-all hover:shadow-md cursor-pointer",
                    student.days_since_approval > 14 ? "border-orange-300" : "border-border"
                  )}
                  onClick={() => navigate(`/admin/leads/detail/${student.master_record_id}`)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {student.first_name[0]}{student.last_name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold text-foreground">
                          {student.first_name} {student.last_name}
                        </h4>
                        <p className="text-sm text-muted-foreground">{student.program}</p>
                      </div>
                    </div>
                    {student.days_since_approval > 14 && (
                      <Badge variant="outline" className="text-orange-600 border-orange-300">
                        Urgent
                      </Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground">Outstanding</p>
                      <p className="font-semibold text-foreground">{formatCurrency(student.outstanding_amount)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Days Since Approval</p>
                      <p className="font-semibold text-foreground">{student.days_since_approval}d</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-border">
                    <Button
                      size="sm"
                      variant="default"
                      className="flex items-center gap-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        toast.info('Invoice feature coming soon');
                      }}
                    >
                      <FileText className="w-3 h-3" />
                      Send Invoice
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/admin/leads/detail/${student.master_record_id}`);
                      }}
                    >
                      <Eye className="w-3 h-3" />
                      View
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
