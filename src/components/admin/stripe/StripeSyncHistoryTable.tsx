import React from 'react';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';
import type { StripeSyncLog } from '@/services/stripeDataService';

interface StripeSyncHistoryTableProps {
  history: StripeSyncLog[];
}

export const StripeSyncHistoryTable = ({ history }: StripeSyncHistoryTableProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-500 animate-pulse" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default">Completed</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      case 'in_progress':
        return <Badge variant="secondary">In Progress</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (history.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No sync history yet. Click "Sync All" to start syncing Stripe data.
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Status</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Started</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Records</TableHead>
            <TableHead>Matched</TableHead>
            <TableHead className="max-w-[200px]">Error</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {history.map((log) => (
            <TableRow key={log.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  {getStatusIcon(log.status)}
                  {getStatusBadge(log.status)}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="capitalize">
                  {log.sync_type}
                </Badge>
              </TableCell>
              <TableCell className="text-sm">
                {format(new Date(log.started_at), 'MMM dd, HH:mm:ss')}
              </TableCell>
              <TableCell className="text-sm">
                {log.duration_ms ? `${(log.duration_ms / 1000).toFixed(2)}s` : '-'}
              </TableCell>
              <TableCell>
                {log.records_synced && Object.keys(log.records_synced).length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(log.records_synced).map(([key, value]) => (
                      <span key={key} className="text-xs text-muted-foreground">
                        {key}: {value as number}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell>
                {log.customers_matched > 0 ? (
                  <Badge variant="secondary">{log.customers_matched}</Badge>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground">
                {log.error_message || '-'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};