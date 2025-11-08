import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  FileText, 
  Clock, 
  Eye, 
  CheckCircle, 
  XCircle, 
  AlertTriangle 
} from 'lucide-react';

interface DocumentStatsProps {
  stats: {
    total: number;
    pending: number;
    underReview: number;
    approved: number;
    rejected: number;
    highPriority: number;
  };
  activeStatus?: string;
  onStatusClick?: (status: string) => void;
}

export const DocumentStats: React.FC<DocumentStatsProps> = ({ 
  stats, 
  activeStatus,
  onStatusClick 
}) => {
  const statItems = [
    { 
      title: 'Total', 
      count: stats.total, 
      icon: FileText, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
      status: 'all'
    },
    { 
      title: 'Pending', 
      count: stats.pending, 
      icon: Clock, 
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50 dark:bg-yellow-950',
      status: 'pending'
    },
    { 
      title: 'Under Review', 
      count: stats.underReview, 
      icon: Eye, 
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950',
      status: 'under-review'
    },
    { 
      title: 'Approved', 
      count: stats.approved, 
      icon: CheckCircle, 
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950',
      status: 'approved'
    },
    { 
      title: 'Rejected', 
      count: stats.rejected, 
      icon: XCircle, 
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-950',
      status: 'rejected'
    },
    { 
      title: 'High Priority', 
      count: stats.highPriority, 
      icon: AlertTriangle, 
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-950',
      status: 'high-priority'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 p-6">
      {statItems.map((stat) => {
        const isActive = activeStatus === stat.status;
        return (
          <Card
            key={stat.title}
            className={`cursor-pointer transition-all hover:shadow-md ${
              isActive ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => onStatusClick?.(stat.status)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold">{stat.count}</p>
                </div>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
