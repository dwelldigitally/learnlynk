import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  History, ChevronDown, Eye, Download, FileText, 
  CheckCircle, XCircle, Clock, Upload, User
} from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { documentService } from '@/services/documentService';

interface DocumentVersion {
  id: string;
  document_name: string;
  original_filename: string | null;
  file_path: string | null;
  file_size: number | null;
  version: number;
  is_latest: boolean;
  admin_status: string | null;
  admin_comments: string | null;
  admin_reviewed_by: string | null;
  admin_reviewed_at: string | null;
  created_at: string;
  superseded_at: string | null;
}

interface ActivityLogEntry {
  id: string;
  action_type: string;
  title: string;
  description: string | null;
  old_value: any;
  new_value: any;
  created_at: string;
  user_name: string | null;
}

interface DocumentVersionHistoryProps {
  leadId: string;
  requirementId: string;
  onViewDocument: (filePath: string) => void;
  onDownloadDocument: (filePath: string, filename: string) => void;
}

export function DocumentVersionHistory({ 
  leadId, 
  requirementId,
  onViewDocument,
  onDownloadDocument 
}: DocumentVersionHistoryProps) {
  const [versions, setVersions] = useState<DocumentVersion[]>([]);
  const [activities, setActivities] = useState<ActivityLogEntry[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadVersionHistory = async () => {
    if (!isOpen) return;
    
    setLoading(true);
    try {
      // Fetch all versions for this requirement
      const { data: docs, error: docsError } = await supabase
        .from('lead_documents')
        .select('*')
        .eq('lead_id', leadId)
        .eq('requirement_id', requirementId)
        .order('version', { ascending: false });

      if (docsError) throw docsError;
      setVersions((docs || []) as DocumentVersion[]);

      // Fetch activity logs for these documents
      const documentIds = (docs || []).map(d => d.id);
      if (documentIds.length > 0) {
        const { data: logs, error: logsError } = await supabase
          .from('lead_activity_logs')
          .select(`
            id,
            action_type,
            title,
            description,
            old_value,
            new_value,
            created_at,
            profiles!lead_activity_logs_user_id_fkey(first_name, last_name)
          `)
          .eq('lead_id', leadId)
          .in('action_type', ['document_uploaded', 'document_status_change', 'document_deleted'])
          .order('created_at', { ascending: false });

        if (!logsError && logs) {
          const mappedLogs = logs.map((log: any) => ({
            id: log.id,
            action_type: log.action_type,
            title: log.title,
            description: log.description,
            old_value: log.old_value,
            new_value: log.new_value,
            created_at: log.created_at,
            user_name: log.profiles 
              ? `${log.profiles.first_name || ''} ${log.profiles.last_name || ''}`.trim() || 'System'
              : 'System'
          }));
          setActivities(mappedLogs);
        }
      }
    } catch (error) {
      console.error('Error loading version history:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVersionHistory();
  }, [isOpen, leadId, requirementId]);

  const getStatusIcon = (status?: string | null) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-3 w-3 text-green-500" />;
      case 'rejected': return <XCircle className="h-3 w-3 text-red-500" />;
      case 'pending': return <Clock className="h-3 w-3 text-yellow-500" />;
      default: return <Clock className="h-3 w-3 text-muted-foreground" />;
    }
  };

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'document_uploaded': return <Upload className="h-3 w-3 text-blue-500" />;
      case 'document_status_change': return <CheckCircle className="h-3 w-3 text-green-500" />;
      case 'document_deleted': return <XCircle className="h-3 w-3 text-red-500" />;
      default: return <FileText className="h-3 w-3" />;
    }
  };

  const formatFileSize = (bytes?: number | null) => {
    if (!bytes) return '';
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  if (versions.length <= 1 && activities.length === 0) {
    return null; // Don't show if only one version and no activity
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" size="sm" className="w-full justify-between text-xs h-7">
          <span className="flex items-center gap-1.5">
            <History className="h-3 w-3" />
            Version History ({versions.length} version{versions.length !== 1 ? 's' : ''})
          </span>
          <ChevronDown className={`h-3 w-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2 space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />
          </div>
        ) : (
          <>
            {/* Document Versions */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Document Versions</p>
              {versions.map((version) => (
                <div 
                  key={version.id} 
                  className={`p-2 rounded-lg border text-xs ${version.is_latest ? 'bg-primary/5 border-primary/20' : 'bg-muted/50'}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant={version.is_latest ? 'default' : 'secondary'} className="text-[10px] h-5">
                        v{version.version}
                      </Badge>
                      {getStatusIcon(version.admin_status)}
                      <span className="truncate max-w-[150px]">
                        {version.original_filename || version.document_name}
                      </span>
                      {version.file_size && (
                        <span className="text-muted-foreground">({formatFileSize(version.file_size)})</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {version.file_path && (
                        <>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 w-6 p-0"
                            onClick={() => onViewDocument(version.file_path!)}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 w-6 p-0"
                            onClick={() => onDownloadDocument(version.file_path!, version.original_filename || version.document_name)}
                          >
                            <Download className="h-3 w-3" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                    <span>{format(new Date(version.created_at), 'MMM d, yyyy HH:mm')}</span>
                    {version.superseded_at && (
                      <span>• Superseded {format(new Date(version.superseded_at), 'MMM d')}</span>
                    )}
                  </div>
                  {version.admin_comments && (
                    <p className="mt-1 text-muted-foreground italic">"{version.admin_comments}"</p>
                  )}
                </div>
              ))}
            </div>

            {/* Activity Timeline */}
            {activities.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Activity Timeline</p>
                <div className="relative pl-4 border-l border-border space-y-2">
                  {activities.slice(0, 5).map((activity) => (
                    <div key={activity.id} className="relative">
                      <div className="absolute -left-[21px] bg-background p-0.5">
                        {getActionIcon(activity.action_type)}
                      </div>
                      <div className="text-xs">
                        <div className="flex items-center gap-1">
                          <span className="font-medium">{activity.title}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <User className="h-2.5 w-2.5" />
                          <span>{activity.user_name}</span>
                          <span>•</span>
                          <span>{format(new Date(activity.created_at), 'MMM d, HH:mm')}</span>
                        </div>
                        {activity.description && (
                          <p className="text-muted-foreground mt-0.5">{activity.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}
