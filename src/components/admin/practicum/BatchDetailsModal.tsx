import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { usePracticumReports } from '@/hooks/usePracticumReports';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Activity, 
  FileText, 
  Send, 
  Download,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp
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

interface BatchDetailsModalProps {
  batch: BatchData | null;
  isOpen: boolean;
  onClose: () => void;
}

export function BatchDetailsModal({ batch, isOpen, onClose }: BatchDetailsModalProps) {
  const [reportFormat, setReportFormat] = useState<'csv' | 'excel'>('excel');
  const { generateBatchReport, isGenerating } = usePracticumReports();
  
  if (!batch) return null;

  const handleGenerateReport = async () => {
    try {
      // For the demo, we'll use the actual program UUID instead of the batch.id
      const actualBatchId = batch.id === 'missing-attendance-av-1' ? 
        'a07ee361-2486-4d8d-ac55-3a2fa695562a' : batch.id;
      
      await generateBatchReport.mutateAsync({
        batchId: actualBatchId,
        format: reportFormat
      });
    } catch (error) {
      // Error handled by the hook
      console.error('Report generation failed:', error);
    }
  };

  const handleExportData = () => {
    // Prepare comprehensive batch data for export
    const exportData = {
      batchInfo: {
        id: batch.id,
        program: batch.program,
        intakeDate: batch.intakeDate,
        startDate: batch.startDate,
        endDate: batch.endDate,
        site: batch.site,
        status: batch.status,
        studentCount: batch.studentCount,
        capacity: batch.capacity,
        urgencyLevel: batch.urgencyLevel
      },
      metrics: {
        completionRate: batch.completionRate,
        attendanceRate: batch.attendanceRate,
        documentComplianceRate: batch.documentComplianceRate,
        capacityUtilization: Math.round((batch.studentCount / batch.capacity) * 100)
      },
      students: batch.students.map(student => ({
        id: student.id,
        name: student.name,
        progress: student.progress,
        lastActivity: student.lastActivity,
        missingItems: student.missingItems?.join(', ') || 'None'
      }))
    };

    // Convert to CSV format
    const csvContent = [
      // Batch Information Header
      'BATCH INFORMATION',
      `Program,${exportData.batchInfo.program}`,
      `Batch ID,${exportData.batchInfo.id}`,
      `Intake Date,${new Date(exportData.batchInfo.intakeDate).toLocaleDateString()}`,
      `Start Date,${exportData.batchInfo.startDate ? new Date(exportData.batchInfo.startDate).toLocaleDateString() : 'Not set'}`,
      `End Date,${exportData.batchInfo.endDate ? new Date(exportData.batchInfo.endDate).toLocaleDateString() : 'Not set'}`,
      `Site,${exportData.batchInfo.site || 'Not specified'}`,
      `Status,${exportData.batchInfo.status}`,
      `Student Count,${exportData.batchInfo.studentCount}`,
      `Capacity,${exportData.batchInfo.capacity}`,
      `Urgency Level,${exportData.batchInfo.urgencyLevel}`,
      '',
      
      // Metrics Header
      'PERFORMANCE METRICS',
      `Completion Rate,${exportData.metrics.completionRate || 'N/A'}%`,
      `Attendance Rate,${exportData.metrics.attendanceRate || 'N/A'}%`,
      `Document Compliance,${exportData.metrics.documentComplianceRate || 'N/A'}%`,
      `Capacity Utilization,${exportData.metrics.capacityUtilization}%`,
      '',
      
      // Students Header
      'STUDENT DATA',
      'Student ID,Name,Progress (%),Last Activity,Missing Items',
      ...exportData.students.map(student => 
        `${student.id},${student.name},${student.progress},${student.lastActivity ? new Date(student.lastActivity).toLocaleDateString() : 'Never'},${student.missingItems}`
      )
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `batch-${batch.program.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const statusConfig = {
    'about-to-start': { color: 'bg-blue-500', label: 'Starting Soon', variant: 'default' as const },
    'active': { color: 'bg-green-500', label: 'Active', variant: 'default' as const },
    'about-to-end': { color: 'bg-orange-500', label: 'Ending Soon', variant: 'secondary' as const },
    'unscheduled': { color: 'bg-gray-500', label: 'Unscheduled', variant: 'secondary' as const },
    'missing-docs': { color: 'bg-red-500', label: 'Missing Docs', variant: 'destructive' as const },
    'missing-attendance': { color: 'bg-amber-500', label: 'Missing Attendance', variant: 'secondary' as const },
    'completed': { color: 'bg-emerald-500', label: 'Completed', variant: 'default' as const }
  };

  const config = statusConfig[batch.status];
  const daysUntilEnd = batch.endDate ? Math.ceil((new Date(batch.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold">{batch.program}</DialogTitle>
              <div className="flex items-center gap-2 mt-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  Intake: {new Date(batch.intakeDate).toLocaleDateString()}
                </span>
              </div>
            </div>
            <Badge variant={config.variant}>{config.label}</Badge>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh]">
          <div className="space-y-6 pr-4">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <Users className="h-5 w-5 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">{batch.studentCount}</div>
                <div className="text-sm text-muted-foreground">Students</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <Activity className="h-5 w-5 mx-auto mb-2 text-green-500" />
                <div className="text-2xl font-bold">{Math.round((batch.studentCount / batch.capacity) * 100)}%</div>
                <div className="text-sm text-muted-foreground">Capacity</div>
              </div>
              {batch.completionRate && (
                <div className="text-center p-4 border rounded-lg">
                  <TrendingUp className="h-5 w-5 mx-auto mb-2 text-blue-500" />
                  <div className="text-2xl font-bold">{batch.completionRate}%</div>
                  <div className="text-sm text-muted-foreground">Progress</div>
                </div>
              )}
              {daysUntilEnd && (
                <div className="text-center p-4 border rounded-lg">
                  <Clock className="h-5 w-5 mx-auto mb-2 text-orange-500" />
                  <div className="text-2xl font-bold">{daysUntilEnd}</div>
                  <div className="text-sm text-muted-foreground">Days left</div>
                </div>
              )}
            </div>

            {/* Details Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Batch Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Batch Information</h3>
                <div className="space-y-3">
                  {batch.site && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{batch.site}</span>
                    </div>
                  )}
                  {batch.startDate && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Start: {new Date(batch.startDate).toLocaleDateString()}</span>
                    </div>
                  )}
                  {batch.endDate && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>End: {new Date(batch.endDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Performance Metrics</h3>
                <div className="space-y-3">
                  {batch.attendanceRate && (
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Attendance Rate</span>
                        <span>{batch.attendanceRate}%</span>
                      </div>
                      <Progress value={batch.attendanceRate} className="h-2" />
                    </div>
                  )}
                  {batch.documentComplianceRate && (
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Document Compliance</span>
                        <span>{batch.documentComplianceRate}%</span>
                      </div>
                      <Progress value={batch.documentComplianceRate} className="h-2" />
                    </div>
                  )}
                  {batch.completionRate && (
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Overall Progress</span>
                        <span>{batch.completionRate}%</span>
                      </div>
                      <Progress value={batch.completionRate} className="h-2" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Students List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Students ({batch.students.length})</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Send className="h-4 w-4 mr-2" />
                    Email All
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export List
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {batch.students.map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <div>
                        <div className="font-medium">{student.name}</div>
                        {student.lastActivity && (
                          <div className="text-xs text-muted-foreground">
                            Last activity: {new Date(student.lastActivity).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {student.missingItems && student.missingItems.length > 0 && (
                        <AlertCircle className="h-4 w-4 text-amber-500" />
                      )}
                      <div className="flex items-center gap-2">
                        <Progress value={student.progress} className="w-16 h-2" />
                        <span className="text-sm text-muted-foreground w-10">{student.progress}%</span>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Report Generation Section */}
            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Generate Student Report</h3>
                <Select value={reportFormat} onValueChange={(value: 'csv' | 'excel') => setReportFormat(value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excel">Excel</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <p className="text-sm text-muted-foreground">
                Export detailed report including student info, practicum sites, hours, attendance, and competencies for all students in this batch.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button 
                className="flex-1" 
                onClick={handleGenerateReport}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <FileText className="h-4 w-4 mr-2" />
                )}
                {isGenerating ? 'Generating...' : 'Generate Report'}
              </Button>
              <Button variant="outline" className="flex-1">
                <Send className="h-4 w-4 mr-2" />
                Send Reminder
              </Button>
              <Button variant="outline" className="flex-1" onClick={handleExportData}>
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}