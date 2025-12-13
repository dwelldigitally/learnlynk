import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DollarSign, TrendingUp, Clock, CheckCircle2, Eye, FileText, Mail, Loader2, CreditCard, Filter, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { salesRepService, StudentPaymentPending, RecentPayment } from '@/services/salesRepService';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export function FinanceTrackerTab() {
  const navigate = useNavigate();
  const [paymentDaysFilter, setPaymentDaysFilter] = useState<7 | 30 | 90>(30);
  
  // Advanced Filters State
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    paymentStatus: 'all',
    paymentType: 'all',
    minAmount: '',
    maxAmount: '',
    program: 'all',
    pendingStatus: 'all'
  });

  const { data: paymentPendingStudents = [], isLoading: loadingPending } = useQuery({
    queryKey: ['sales-rep-payment-pending'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      return salesRepService.getPaymentPendingStudents(user.id);
    },
    staleTime: 5 * 60 * 1000,
  });

  const { data: recentPayments = [], isLoading: loadingPayments } = useQuery({
    queryKey: ['sales-rep-recent-payments', paymentDaysFilter],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      return salesRepService.getRecentPaymentsForAssignedStudents(user.id, paymentDaysFilter);
    },
    staleTime: 5 * 60 * 1000,
  });

  const isLoading = loadingPending || loadingPayments;

  // Apply filters
  const filteredPayments = recentPayments.filter(payment => {
    if (filters.paymentStatus !== 'all' && payment.status !== filters.paymentStatus) return false;
    if (filters.paymentType !== 'all' && payment.payment_type !== filters.paymentType) return false;
    if (filters.minAmount && Number(payment.amount) < Number(filters.minAmount)) return false;
    if (filters.maxAmount && Number(payment.amount) > Number(filters.maxAmount)) return false;
    return true;
  });

  const filteredPendingStudents = paymentPendingStudents.filter(student => {
    if (filters.pendingStatus !== 'all' && student.payment_status !== filters.pendingStatus) return false;
    if (filters.program !== 'all' && !student.program.toLowerCase().includes(filters.program.toLowerCase())) return false;
    if (filters.minAmount && student.outstanding_amount < Number(filters.minAmount)) return false;
    if (filters.maxAmount && student.outstanding_amount > Number(filters.maxAmount)) return false;
    return true;
  });

  // Calculate stats with filtered data
  const totalRevenue = filteredPayments
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + Number(p.amount), 0);
  
  const pendingRevenue = filteredPendingStudents.reduce(
    (sum, s) => sum + s.outstanding_amount, 
    0
  );

  const resetFilters = () => {
    setFilters({
      paymentStatus: 'all',
      paymentType: 'all',
      minAmount: '',
      maxAmount: '',
      program: 'all',
      pendingStatus: 'all'
    });
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== 'all' && v !== '');

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
    <div className="space-y-4">
      {/* Advanced Filters */}
      <Card>
        <CardHeader className="p-6">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Filter className="w-5 h-5" />
              Advanced Filters
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-2">
                  {Object.values(filters).filter(v => v !== 'all' && v !== '').length} active
                </Badge>
              )}
            </CardTitle>
            <div className="flex gap-2">
              {hasActiveFilters && (
                <Button variant="outline" size="sm" onClick={resetFilters}>
                  <X className="w-4 h-4 mr-1" />
                  Clear All
                </Button>
              )}
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                {showFilters ? 'Hide' : 'Show'} Filters
              </Button>
            </div>
          </div>
        </CardHeader>
        {showFilters && (
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Payment Status</Label>
                <Select value={filters.paymentStatus} onValueChange={(v) => setFilters({...filters, paymentStatus: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="partial">Partial</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Payment Type</Label>
                <Select value={filters.paymentType} onValueChange={(v) => setFilters({...filters, paymentType: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="tuition_deposit">Tuition Deposit</SelectItem>
                    <SelectItem value="full_tuition">Full Tuition</SelectItem>
                    <SelectItem value="partial_payment">Partial Payment</SelectItem>
                    <SelectItem value="application_fee">Application Fee</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Pending Status</Label>
                <Select value={filters.pendingStatus} onValueChange={(v) => setFilters({...filters, pendingStatus: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="partial">Partial</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Min Amount</Label>
                <Input 
                  type="number" 
                  placeholder="$0"
                  value={filters.minAmount}
                  onChange={(e) => setFilters({...filters, minAmount: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label>Max Amount</Label>
                <Input 
                  type="number" 
                  placeholder="$100,000"
                  value={filters.maxAmount}
                  onChange={(e) => setFilters({...filters, maxAmount: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label>Program</Label>
                <Input 
                  placeholder="Search program..."
                  value={filters.program === 'all' ? '' : filters.program}
                  onChange={(e) => setFilters({...filters, program: e.target.value || 'all'})}
                />
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
        <div className="p-4 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700">Total Revenue ({paymentDaysFilter}d)</p>
              <p className="text-2xl font-bold text-green-900">{formatCurrency(totalRevenue)}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="p-4 rounded-lg bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-700">Pending Revenue</p>
              <p className="text-2xl font-bold text-yellow-900">{formatCurrency(pendingRevenue)}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700">Students Pending</p>
              <p className="text-2xl font-bold text-blue-900">{filteredPendingStudents.length}</p>
            </div>
            <DollarSign className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">Pending Payments ({filteredPendingStudents.length})</TabsTrigger>
          <TabsTrigger value="recent">Recent Payments ({filteredPayments.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          {filteredPendingStudents.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-green-500" />
                <h3 className="text-lg font-semibold mb-2">No Pending Payments</h3>
                <p className="text-muted-foreground">All assigned students are up to date with their payments.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredPendingStudents.map((student) => {
                const statusConfig = getPaymentStatusConfig(student.payment_status);
                return (
                  <Card key={student.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>
                              {student.first_name?.[0]}{student.last_name?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{student.first_name} {student.last_name}</p>
                            <p className="text-sm text-muted-foreground">{student.program}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-semibold text-destructive">
                              {formatCurrency(student.outstanding_amount)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {student.days_since_approval} days since approval
                            </p>
                          </div>
                          <Badge className={cn(statusConfig.bg, statusConfig.color)}>
                            {statusConfig.label}
                          </Badge>
                          <Button variant="outline" size="sm">
                            <Mail className="w-4 h-4 mr-1" />
                            Remind
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="recent">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Payment History</h3>
            <Select 
              value={paymentDaysFilter.toString()} 
              onValueChange={(v) => setPaymentDaysFilter(parseInt(v) as 7 | 30 | 90)}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredPayments.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <CreditCard className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Recent Payments</h3>
                <p className="text-muted-foreground">No payments recorded in the selected time period.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredPayments.map((payment) => {
                const statusConfig = getPaymentStatusConfig(payment.status);
                return (
                  <Card key={payment.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>
                              {payment.student_name?.split(' ').map(n => n[0]).join('') || '?'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{payment.student_name || 'Unknown Student'}</p>
                            <p className="text-sm text-muted-foreground capitalize">
                              {payment.payment_type?.replace(/_/g, ' ')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-semibold">{formatCurrency(Number(payment.amount))}</p>
                            <p className="text-xs text-muted-foreground">
                              {payment.paid_at ? formatDate(payment.paid_at) : 'Pending'}
                            </p>
                          </div>
                          <Badge className={cn(statusConfig.bg, statusConfig.color)}>
                            {statusConfig.label}
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
