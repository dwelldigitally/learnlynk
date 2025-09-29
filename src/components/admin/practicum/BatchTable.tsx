import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  MoreHorizontal,
  Eye, 
  Send, 
  Download,
  Users,
  Calendar,
  MapPin,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText
} from 'lucide-react';

interface BatchData {
  id: string;
  program: string;
  intakeDate: string;
  studentCount: number;
  capacity: number;
  status: 'about-to-start' | 'active' | 'about-to-end' | 'unscheduled' | 'missing-docs' | 'missing-attendance' | 'completed';
  completionRate?: number;
  attendanceRate?: number;
  documentComplianceRate?: number;
  site?: string;
  startDate?: string;
  endDate?: string;
  urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
  students: Array<{
    id: string;
    name: string;
    progress: number;
    missingItems?: string[];
    lastActivity?: string;
  }>;
}

interface BatchTableProps {
  batches: BatchData[];
  selectedBatches: Set<string>;
  onSelectBatch: (batchId: string, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
  onBatchClick: (batch: BatchData) => void;
}

export function BatchTable({ 
  batches, 
  selectedBatches, 
  onSelectBatch, 
  onSelectAll, 
  onBatchClick 
}: BatchTableProps) {
  const statusConfig = {
    'about-to-start': { 
      icon: Clock, 
      label: 'Starting Soon', 
      variant: 'default' as const,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 border-blue-200'
    },
    'active': { 
      icon: Activity, 
      label: 'Active', 
      variant: 'default' as const,
      color: 'text-green-600',
      bgColor: 'bg-green-50 border-green-200'
    },
    'about-to-end': { 
      icon: AlertTriangle, 
      label: 'Ending Soon', 
      variant: 'secondary' as const,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 border-orange-200'
    },
    'unscheduled': { 
      icon: Calendar, 
      label: 'Unscheduled', 
      variant: 'secondary' as const,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50 border-gray-200'
    },
    'missing-docs': { 
      icon: FileText, 
      label: 'Missing Docs', 
      variant: 'destructive' as const,
      color: 'text-red-600',
      bgColor: 'bg-red-50 border-red-200'
    },
    'missing-attendance': { 
      icon: AlertTriangle, 
      label: 'Missing Attendance', 
      variant: 'secondary' as const,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50 border-amber-200'
    },
    'completed': { 
      icon: CheckCircle, 
      label: 'Completed', 
      variant: 'default' as const,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50 border-emerald-200'
    }
  };

  const urgencyColors = {
    low: 'border-l-green-500',
    medium: 'border-l-yellow-500',
    high: 'border-l-orange-500',
    critical: 'border-l-red-500'
  };

  const getDaysUntil = (date: string) => {
    const diffTime = new Date(date).getTime() - new Date().getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const allSelected = batches.length > 0 && batches.every(batch => selectedBatches.has(batch.id));
  const someSelected = batches.some(batch => selectedBatches.has(batch.id));

  return (
    <div className="border rounded-lg bg-card">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-b">
            <TableHead className="w-12">
            <Checkbox
              checked={allSelected}
              onCheckedChange={onSelectAll}
              aria-label="Select all batches"
              className={someSelected && !allSelected ? "data-[state=checked]:bg-primary/50" : ""}
            />
            </TableHead>
            <TableHead className="min-w-[200px]">Program & Status</TableHead>
            <TableHead className="text-center">Students</TableHead>
            <TableHead className="text-center">Progress</TableHead>
            <TableHead className="text-center">Attendance</TableHead>
            <TableHead className="min-w-[150px]">Site</TableHead>
            <TableHead className="text-center">Timeline</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {batches.map((batch) => {
            const config = statusConfig[batch.status];
            const StatusIcon = config.icon;
            const isSelected = selectedBatches.has(batch.id);
            const daysUntilEnd = batch.endDate ? getDaysUntil(batch.endDate) : null;
            
            return (
              <TableRow 
                key={batch.id}
                className={`cursor-pointer hover:bg-muted/50 transition-colors border-l-4 ${urgencyColors[batch.urgencyLevel]} ${isSelected ? 'bg-muted/30' : ''}`}
                onClick={() => onBatchClick(batch)}
              >
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={(checked) => onSelectBatch(batch.id, checked as boolean)}
                    aria-label={`Select ${batch.program}`}
                  />
                </TableCell>
                
                <TableCell>
                  <div className="space-y-2">
                    <div className="font-medium">{batch.program}</div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={config.variant}
                        className={`gap-1 ${config.bgColor} ${config.color} border`}
                      >
                        <StatusIcon className="h-3 w-3" />
                        {config.label}
                      </Badge>
                      {batch.urgencyLevel === 'critical' && (
                        <Badge variant="destructive" className="text-xs">
                          Urgent
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(batch.intakeDate).toLocaleDateString()}
                    </div>
                  </div>
                </TableCell>
                
                <TableCell className="text-center">
                  <div className="space-y-1">
                    <div className="font-medium">{batch.studentCount}/{batch.capacity}</div>
                    <Progress 
                      value={(batch.studentCount / batch.capacity) * 100} 
                      className="w-16 h-2 mx-auto"
                    />
                    <div className="text-xs text-muted-foreground">
                      {Math.round((batch.studentCount / batch.capacity) * 100)}% full
                    </div>
                  </div>
                </TableCell>
                
                <TableCell className="text-center">
                  {batch.completionRate ? (
                    <div className="space-y-1">
                      <div className="font-medium">{batch.completionRate}%</div>
                      <Progress value={batch.completionRate} className="w-16 h-2 mx-auto" />
                    </div>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                
                <TableCell className="text-center">
                  {batch.attendanceRate ? (
                    <div className="space-y-1">
                      <div className={`font-medium ${batch.attendanceRate < 85 ? 'text-red-600' : batch.attendanceRate < 95 ? 'text-yellow-600' : 'text-green-600'}`}>
                        {batch.attendanceRate}%
                      </div>
                      <Progress value={batch.attendanceRate} className="w-16 h-2 mx-auto" />
                    </div>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                
                <TableCell>
                  {batch.site ? (
                    <div className="flex items-center gap-1 text-sm">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      {batch.site}
                    </div>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                
                <TableCell className="text-center">
                  {daysUntilEnd !== null ? (
                    <div className="space-y-1">
                      <div className={`text-sm font-medium ${daysUntilEnd < 30 ? 'text-orange-600' : daysUntilEnd < 7 ? 'text-red-600' : ''}`}>
                        {daysUntilEnd > 0 ? `${daysUntilEnd} days` : 'Overdue'}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {daysUntilEnd > 0 ? 'remaining' : ''}
                      </div>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onBatchClick(batch)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Send className="h-4 w-4 mr-2" />
                        Send Reminder
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="h-4 w-4 mr-2" />
                        Export Data
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      
      {batches.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <div className="text-lg font-medium">No batches found</div>
          <div className="text-sm">Try adjusting your search or filter criteria</div>
        </div>
      )}
    </div>
  );
}