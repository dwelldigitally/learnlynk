import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  RefreshCw, Users, Package, CreditCard, DollarSign, Link2, CheckCircle,
  AlertCircle, Clock, TrendingUp
} from 'lucide-react';
import {
  useStripeSyncStatus,
  useTriggerSync,
  useSyncHistory,
  useSyncStats
} from '@/services/stripeDataService';
import { StripeSyncHistoryTable } from './StripeSyncHistoryTable';
import { formatDistanceToNow } from 'date-fns';
import { formatCurrency } from '@/utils/currency';

export const StripeSyncDashboard = () => {
  const { data: syncStatus, isLoading: statusLoading } = useStripeSyncStatus();
  const { data: syncHistory } = useSyncHistory(10);
  const { data: stats } = useSyncStats();
  const triggerSync = useTriggerSync();

  const handleSync = (syncType: 'customers' | 'products' | 'payments' | 'full') => {
    triggerSync.mutate(syncType);
  };

  const getSyncStatusBadge = () => {
    if (!syncStatus) return null;
    
    switch (syncStatus.status) {
      case 'in_progress':
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <RefreshCw className="h-3 w-3 animate-spin" />
            Syncing...
          </Badge>
        );
      case 'completed':
        return (
          <Badge variant="default" className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Synced {formatDistanceToNow(new Date(syncStatus.completed_at!), { addSuffix: true })}
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Failed
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Sync Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Stripe Data Sync</h2>
          <p className="text-muted-foreground">
            Automatically syncs every 5 minutes. {getSyncStatusBadge()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => handleSync('customers')}
            variant="outline"
            size="sm"
            disabled={triggerSync.isPending || syncStatus?.status === 'in_progress'}
          >
            <Users className="h-4 w-4 mr-2" />
            Sync Customers
          </Button>
          <Button
            onClick={() => handleSync('products')}
            variant="outline"
            size="sm"
            disabled={triggerSync.isPending || syncStatus?.status === 'in_progress'}
          >
            <Package className="h-4 w-4 mr-2" />
            Sync Products
          </Button>
          <Button
            onClick={() => handleSync('payments')}
            variant="outline"
            size="sm"
            disabled={triggerSync.isPending || syncStatus?.status === 'in_progress'}
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Sync Payments
          </Button>
          <Button
            onClick={() => handleSync('full')}
            disabled={triggerSync.isPending || syncStatus?.status === 'in_progress'}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${triggerSync.isPending ? 'animate-spin' : ''}`} />
            Sync All
          </Button>
        </div>
      </div>

      {/* Sync Status Alert */}
      {syncStatus?.status === 'failed' && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Last sync failed: {syncStatus.error_message}
          </AlertDescription>
        </Alert>
      )}

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalCustomers || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats?.linkedCustomers || 0} linked to leads ({stats?.linkagePercentage || 0}%)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalProducts || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Active catalog items
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalPayments || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats?.successfulPayments || 0} successful
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.totalRevenue ? formatCurrency(stats.totalRevenue / 100, 'USD') : '$0'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              From successful payments
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Last Sync Info */}
      {syncStatus && (
        <Card>
          <CardHeader>
            <CardTitle>Last Sync Details</CardTitle>
            <CardDescription>
              {syncStatus.status === 'completed' 
                ? `Completed ${formatDistanceToNow(new Date(syncStatus.completed_at!), { addSuffix: true })}`
                : syncStatus.status === 'in_progress'
                ? 'Sync in progress...'
                : 'Sync failed'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <div className="text-sm text-muted-foreground">Type</div>
                <div className="text-lg font-semibold capitalize">{syncStatus.sync_type}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Duration</div>
                <div className="text-lg font-semibold">
                  {syncStatus.duration_ms ? `${(syncStatus.duration_ms / 1000).toFixed(2)}s` : '-'}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Customers Matched</div>
                <div className="text-lg font-semibold flex items-center gap-2">
                  {syncStatus.customers_matched || 0}
                  <Link2 className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>
            {syncStatus.records_synced && Object.keys(syncStatus.records_synced).length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <div className="text-sm text-muted-foreground mb-2">Records Synced</div>
                <div className="flex gap-4">
                  {Object.entries(syncStatus.records_synced).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2">
                      <Badge variant="secondary">{key}</Badge>
                      <span className="font-semibold">{value as number}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Sync History */}
      <Card>
        <CardHeader>
          <CardTitle>Sync History</CardTitle>
          <CardDescription>Recent synchronization operations</CardDescription>
        </CardHeader>
        <CardContent>
          <StripeSyncHistoryTable history={syncHistory || []} />
        </CardContent>
      </Card>
    </div>
  );
};