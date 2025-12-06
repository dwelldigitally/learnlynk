import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, AlertCircle, Clock, CheckCircle2, Eye, Mail, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { salesRepService, StudentWithMissingDocuments, PendingDocument } from '@/services/salesRepService';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { SalesRepDocumentApprovalModal } from './SalesRepDocumentApprovalModal';

export function DocumentsTrackerTab() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<'all' | 'critical' | 'high' | 'normal'>('all');
  const [selectedDocument, setSelectedDocument] = useState<{
    document: PendingDocument;
    leadInfo: { id: string; name: string; email: string; program: string; campus?: string };
  } | null>(null);

  const { data: students = [], isLoading, refetch } = useQuery({
    queryKey: ['sales-rep-documents'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      return salesRepService.getAssignedStudentsWithMissingDocuments(user.id);
    },
    staleTime: 5 * 60 * 1000,
  });

  const filteredStudents = students.filter(student => 
    activeFilter === 'all' || student.priority === activeFilter
  );

  const criticalCount = students.filter(s => s.priority === 'critical').length;
  const pendingApprovalsCount = students.reduce(
    (sum, s) => sum + s.pendingDocuments.length, 
    0
  );

  const handleSendReminder = async (student: StudentWithMissingDocuments) => {
    try {
      await salesRepService.sendDocumentReminder(
        student.master_record_id, 
        student.missingDocuments
      );
      toast.success(`Reminder sent to ${student.first_name} ${student.last_name}`);
    } catch (error) {
      toast.error('Failed to send reminder');
    }
  };

  const handleDocumentClick = (doc: PendingDocument, student: StudentWithMissingDocuments) => {
    setSelectedDocument({
      document: doc,
      leadInfo: {
        id: student.id,
        name: `${student.first_name} ${student.last_name}`,
        email: student.email,
        program: student.program,
        campus: student.campus
      }
    });
  };

  const handleDocumentApproved = () => {
    refetch();
  };

  const getPriorityConfig = (priority: 'critical' | 'high' | 'normal') => {
    switch (priority) {
      case 'critical':
        return {
          color: 'text-destructive',
          bgColor: 'bg-destructive/10',
          borderColor: 'border-destructive/30',
          icon: AlertCircle,
          label: 'Critical'
        };
      case 'high':
        return {
          color: 'text-orange-600',
          bgColor: 'bg-orange-100',
          borderColor: 'border-orange-300',
          icon: Clock,
          label: 'High Priority'
        };
      default:
        return {
          color: 'text-primary',
          bgColor: 'bg-primary/10',
          borderColor: 'border-primary/30',
          icon: FileText,
          label: 'Normal'
        };
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
    <div className="max-w-7xl mx-auto space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
        <div className="p-3 rounded-lg bg-card border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Leads with Documents</p>
              <p className="text-2xl font-bold text-foreground">{students.length}</p>
            </div>
            <FileText className="w-8 h-8 text-primary" />
          </div>
        </div>

        <div className="p-3 rounded-lg bg-card border border-destructive/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Critical Deadlines</p>
              <p className="text-2xl font-bold text-destructive">{criticalCount}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
        </div>

        <div className="p-3 rounded-lg bg-card border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pending Approvals</p>
              <p className="text-2xl font-bold text-foreground">{pendingApprovalsCount}</p>
            </div>
            <Clock className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <Tabs value={activeFilter} onValueChange={(v) => setActiveFilter(v as any)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All ({students.length})</TabsTrigger>
          <TabsTrigger value="critical">Critical ({students.filter(s => s.priority === 'critical').length})</TabsTrigger>
          <TabsTrigger value="high">High ({students.filter(s => s.priority === 'high').length})</TabsTrigger>
          <TabsTrigger value="normal">Normal ({students.filter(s => s.priority === 'normal').length})</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Students List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredStudents.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-card rounded-lg border border-border">
            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-foreground mb-2">All Clear!</h3>
            <p className="text-sm text-muted-foreground">
              {activeFilter === 'all' 
                ? 'No leads have missing or pending documents.' 
                : `No leads in ${activeFilter} priority.`}
            </p>
          </div>
        ) : (
          filteredStudents.map((student) => {
            const priorityConfig = getPriorityConfig(student.priority);
            const PriorityIcon = priorityConfig.icon;

            return (
              <div
                key={student.id}
                className={cn(
                  "p-4 rounded-lg border bg-card transition-all hover:shadow-md flex flex-col h-full",
                  priorityConfig.borderColor
                )}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {student.first_name[0]}{student.last_name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {student.first_name} {student.last_name}
                      </h3>
                      <p className="text-sm text-muted-foreground">{student.program}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={cn("flex items-center gap-1", priorityConfig.color)}>
                      <PriorityIcon className="w-3 h-3" />
                      {priorityConfig.label}
                    </Badge>
                    {student.daysUntilDeadline !== undefined && (
                      <Badge variant="outline" className="text-xs">
                        {student.daysUntilDeadline}d left
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Missing Documents */}
                {student.missingDocuments.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      Missing Documents ({student.missingDocuments.length})
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {student.missingDocuments.map((doc, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {doc}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pending Approvals - Clickable */}
                {student.pendingDocuments.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Pending Approval ({student.pendingDocuments.length})
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {student.pendingDocuments.map((doc) => (
                        <Badge 
                          key={doc.id} 
                          variant="outline" 
                          className="text-xs border-orange-300 text-orange-600 cursor-pointer hover:bg-orange-50 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDocumentClick(doc, student);
                          }}
                        >
                          {doc.document_name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-2 border-t border-border mt-auto">
                  <Button
                    size="sm"
                    variant="default"
                    className="flex items-center gap-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/admin/leads/detail/${student.master_record_id}`);
                    }}
                  >
                    <Eye className="w-3 h-3" />
                    View Profile
                  </Button>
                  {student.missingDocuments.length > 0 && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSendReminder(student);
                      }}
                    >
                      <Mail className="w-3 h-3" />
                      Send Reminder
                    </Button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Document Approval Modal */}
      <SalesRepDocumentApprovalModal
        isOpen={!!selectedDocument}
        onClose={() => setSelectedDocument(null)}
        document={selectedDocument?.document || null}
        leadInfo={selectedDocument?.leadInfo || { id: '', name: '', email: '', program: '' }}
        onApproved={handleDocumentApproved}
      />
    </div>
  );
}