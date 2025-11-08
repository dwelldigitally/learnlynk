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

  const { data: paymentPendingStudents = [], isLoading: loadingPending } = useQuery({
    queryKey: ['sales-rep-payment-pending'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      return salesRepService.getPaymentPendingStudents(user.id);
    },
    staleTime: 5 * 60 * 1000,
  });

  const { data: recentPayments = [], isLoading: loadingPayments } = useQuery({
    queryKey: ['sales-rep-recent-payments', paymentDaysFilter],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      return salesRepService.getRecentPaymentsForAssignedStudents(user.id, paymentDaysFilter);
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
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              Recent Payments
            </h3>
            <Tabs value={paymentDaysFilter.toString()} onValueChange={(v) => setPaymentDaysFilter(Number(v) as any)}>
              <TabsList className="h-8">
                <TabsTrigger value="7" className="text-xs h-7">7d</TabsTrigger>
                <TabsTrigger value="30" className="text-xs h-7">30d</TabsTrigger>
                <TabsTrigger value="90" className="text-xs h-7">90d</TabsTrigger>
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
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-500" />
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
