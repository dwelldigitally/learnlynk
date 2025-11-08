import { usePaymentTransactions } from '@/services/paymentService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, CheckCircle2, Bell, RefreshCcw, DollarSign } from 'lucide-react';
import { formatCurrency } from '@/utils/currency';
import type { Currency } from '@/utils/currency';

interface PaymentHistoryListProps {
  paymentId: string;
}

export function PaymentHistoryList({ paymentId }: PaymentHistoryListProps) {
  const { data: transactions = [], isLoading } = usePaymentTransactions(paymentId);

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'invoice_sent':
        return <Mail className="h-4 w-4" />;
      case 'charge':
        return <DollarSign className="h-4 w-4" />;
      case 'reminder_sent':
        return <Bell className="h-4 w-4" />;
      case 'refund':
        return <RefreshCcw className="h-4 w-4" />;
      default:
        return <CheckCircle2 className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'failed':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  if (isLoading) {
    return <div>Loading transaction history...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No transactions yet
          </p>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-start gap-3 p-3 border rounded-lg"
              >
                <div className="mt-1">{getTransactionIcon(transaction.transaction_type)}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium capitalize">
                      {transaction.transaction_type.replace('_', ' ')}
                    </span>
                    <Badge variant={getStatusColor(transaction.status)}>
                      {transaction.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {new Date(transaction.created_at).toLocaleString()}
                  </p>
                  {transaction.amount && (
                    <p className="text-sm font-medium mt-1">
                      Amount: ${transaction.amount.toFixed(2)}
                    </p>
                  )}
                  {transaction.stripe_transaction_id && (
                    <p className="text-xs text-muted-foreground mt-1 font-mono">
                      ID: {transaction.stripe_transaction_id}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
