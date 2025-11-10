import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, FileCheck, Clock, TrendingUp } from 'lucide-react';
import { usePaymentOverviewStats } from '@/services/paymentService';
import { formatCurrency } from '@/utils/currency';

export const PaymentStatsDashboard = () => {
  const { data: stats, isLoading } = usePaymentOverviewStats();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-24 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-32 bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue, 'USD'),
      icon: DollarSign,
      description: 'All-time revenue from paid invoices',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Paid Invoices',
      value: stats.totalPaidInvoices.toString(),
      icon: FileCheck,
      description: 'Successfully completed payments',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Outstanding',
      value: stats.outstandingInvoices.toString(),
      icon: Clock,
      description: `${formatCurrency(stats.outstandingAmount, 'USD')} pending`,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
    },
    {
      title: 'Average Payment',
      value: formatCurrency(stats.averagePayment, 'USD'),
      icon: TrendingUp,
      description: 'Mean transaction value',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Payments Processed</span>
              <span className="text-sm font-semibold text-foreground">{stats.totalPayments}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Payment Success Rate</span>
              <span className="text-sm font-semibold text-foreground">
                {stats.totalPayments > 0 
                  ? `${((stats.totalPaidInvoices / stats.totalPayments) * 100).toFixed(1)}%`
                  : '0%'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
