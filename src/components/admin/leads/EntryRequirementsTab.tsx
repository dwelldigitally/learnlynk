import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  CheckCircle2,
  XCircle,
  Clock,
  ChevronDown,
  ChevronRight,
  FileText,
  GraduationCap,
  Languages,
  Briefcase,
  HelpCircle,
  Link2,
  Unlink,
  Sparkles,
  AlertTriangle,
  Eye,
} from 'lucide-react';
import { useLeadEntryRequirements } from '@/hooks/useLeadEntryRequirements';
import { LeadEntryRequirement } from '@/services/entryRequirementService';
import { DocumentApprovalDialog } from './DocumentApprovalDialog';
import { supabase } from '@/integrations/supabase/client';
import { entryRequirementService } from '@/services/entryRequirementService';
import { useToast } from '@/hooks/use-toast';

interface EntryRequirementsTabProps {
  leadId: string;
  programName?: string;
  onRefresh?: () => void;
}

const typeIcons: Record<string, React.ReactNode> = {
  academic: <GraduationCap className="h-4 w-4" />,
  language: <Languages className="h-4 w-4" />,
  experience: <Briefcase className="h-4 w-4" />,
  other: <HelpCircle className="h-4 w-4" />,
};

const statusConfig: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
  pending: { color: 'bg-amber-500/10 text-amber-600 border-amber-500/20', icon: <Clock className="h-3 w-3" />, label: 'Pending' },
  approved: { color: 'bg-green-500/10 text-green-600 border-green-500/20', icon: <CheckCircle2 className="h-3 w-3" />, label: 'Approved' },
  auto_approved: { color: 'bg-blue-500/10 text-blue-600 border-blue-500/20', icon: <Sparkles className="h-3 w-3" />, label: 'Auto-Approved' },
  rejected: { color: 'bg-red-500/10 text-red-600 border-red-500/20', icon: <XCircle className="h-3 w-3" />, label: 'Rejected' },
};

export function EntryRequirementsTab({ leadId, programName, onRefresh }: EntryRequirementsTabProps) {
  const {
    requirements,
    isLoading,
    progress,
    refetch,
    approveRequirement,
    rejectRequirement,
    linkDocument,
    unlinkDocument,
  } = useLeadEntryRequirements(leadId, programName);

  const { toast } = useToast();
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedRequirement, setSelectedRequirement] = useState<LeadEntryRequirement | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [availableDocuments, setAvailableDocuments] = useState<any[]>([]);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string>('');
  const [documentApprovalOpen, setDocumentApprovalOpen] = useState(false);
  const [documentToApprove, setDocumentToApprove] = useState<any>(null);
  const [requirementForDocument, setRequirementForDocument] = useState<LeadEntryRequirement | null>(null);

  // Group requirements by type
  const groupedRequirements = requirements.reduce((acc, req) => {
    const type = req.requirement_type || 'other';
    if (!acc[type]) acc[type] = [];
    acc[type].push(req);
    return acc;
  }, {} as Record<string, LeadEntryRequirement[]>);

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleApprove = async (req: LeadEntryRequirement) => {
    // If has linked document that's not approved, can't approve
    if (req.linked_document_id && req.linked_document?.status !== 'approved') {
      toast({
        title: 'Cannot Approve',
        description: 'The linked document must be approved first.',
        variant: 'destructive',
      });
      return;
    }
    await approveRequirement(req.id);
    onRefresh?.();
  };

  const handleRejectClick = (req: LeadEntryRequirement) => {
    setSelectedRequirement(req);
    setRejectionReason('');
    setRejectDialogOpen(true);
  };

  const handleRejectConfirm = async () => {
    if (!selectedRequirement || !rejectionReason.trim()) return;
    await rejectRequirement(selectedRequirement.id, rejectionReason);
    setRejectDialogOpen(false);
    setSelectedRequirement(null);
    setRejectionReason('');
    onRefresh?.();
  };

  const handleLinkDocumentClick = async (req: LeadEntryRequirement) => {
    setSelectedRequirement(req);
    // Fetch available documents for this lead
    const { data } = await supabase
      .from('lead_documents')
      .select('id, file_name, status, entry_requirement_id')
      .eq('lead_id', leadId);
    
    // Filter to unlinked documents or already linked to this requirement
    const available = (data || []).filter(
      (doc: any) => !doc.entry_requirement_id || doc.entry_requirement_id === req.entry_requirement_id
    );
    setAvailableDocuments(available);
    setSelectedDocumentId('');
    setLinkDialogOpen(true);
  };

  const handleLinkConfirm = async () => {
    if (!selectedRequirement || !selectedDocumentId) return;
    
    // Update the document's entry_requirement_id
    await supabase
      .from('lead_documents')
      .update({ entry_requirement_id: selectedRequirement.entry_requirement_id })
      .eq('id', selectedDocumentId);
    
    await linkDocument(selectedRequirement.id, selectedDocumentId);
    setLinkDialogOpen(false);
    onRefresh?.();
  };

  const handleUnlinkDocument = async (req: LeadEntryRequirement) => {
    if (req.linked_document_id) {
      // Clear the entry_requirement_id on the document
      await supabase
        .from('lead_documents')
        .update({ entry_requirement_id: null })
        .eq('id', req.linked_document_id);
    }
    await unlinkDocument(req.id);
    onRefresh?.();
  };

  const handleDocumentApprove = (req: LeadEntryRequirement) => {
    if (!req.linked_document) return;
    setDocumentToApprove(req.linked_document);
    setRequirementForDocument(req);
    setDocumentApprovalOpen(true);
  };

  const handleDocumentApprovalConfirm = async (notes: string) => {
    if (!documentToApprove) return;
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Approve the document
    await supabase
      .from('lead_documents')
      .update({ 
        status: 'approved',
        approved_at: new Date().toISOString(),
        approved_by: user.id,
        notes: notes || null,
      })
      .eq('id', documentToApprove.id);

    // Auto-approve linked requirement
    await entryRequirementService.autoApproveFromDocument(documentToApprove.id, user.id);

    toast({
      title: 'Document Approved',
      description: requirementForDocument 
        ? 'Document and linked entry requirement have been approved.'
        : 'Document has been approved.',
    });

    setDocumentApprovalOpen(false);
    setDocumentToApprove(null);
    setRequirementForDocument(null);
    await refetch();
    onRefresh?.();
  };

  const handleDocumentReject = async (reason: string) => {
    if (!documentToApprove) return;
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from('lead_documents')
      .update({ 
        status: 'rejected',
        notes: reason,
      })
      .eq('id', documentToApprove.id);

    toast({
      title: 'Document Rejected',
      description: 'The document has been rejected.',
    });

    setDocumentApprovalOpen(false);
    setDocumentToApprove(null);
    setRequirementForDocument(null);
    await refetch();
    onRefresh?.();
  };

  if (isLoading) {
    return (
      <div className="space-y-4 p-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-full" />
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (requirements.length === 0) {
    return (
      <div className="p-6">
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <GraduationCap className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg mb-2">No Entry Requirements</h3>
            <p className="text-muted-foreground max-w-md">
              {programName 
                ? `No entry requirements are configured for the ${programName} program.`
                : 'No program selected for this lead, so no entry requirements are available.'}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Progress Header */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold">Requirements Progress</h3>
              <p className="text-sm text-muted-foreground">
                {progress.approved} of {progress.total} mandatory requirements completed
              </p>
            </div>
            <Badge 
              variant="outline" 
              className={progress.percentage === 100 ? 'bg-green-500/10 text-green-600' : ''}
            >
              {progress.percentage}%
            </Badge>
          </div>
          <Progress value={progress.percentage} className="h-2" />
        </CardContent>
      </Card>

      {/* Grouped Requirements */}
      {Object.entries(groupedRequirements).map(([type, reqs]) => (
        <div key={type} className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wide">
            {typeIcons[type] || typeIcons.other}
            <span>{type} Requirements</span>
            <Badge variant="secondary" className="text-xs">{reqs.length}</Badge>
          </div>

          {reqs.map((req) => {
            const status = statusConfig[req.status] || statusConfig.pending;
            const isExpanded = expandedIds.has(req.id);
            const hasLinkedDoc = !!req.linked_document_id;
            const docStatus = req.linked_document?.status;
            const canApproveManually = !hasLinkedDoc && req.status === 'pending';
            const needsDocApproval = hasLinkedDoc && docStatus !== 'approved' && req.status === 'pending';

            return (
              <Card key={req.id} className="overflow-hidden">
                <Collapsible open={isExpanded} onOpenChange={() => toggleExpand(req.id)}>
                  <CollapsibleTrigger asChild>
                    <CardHeader className="p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5">
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <CardTitle className="text-base">{req.requirement_title}</CardTitle>
                              {req.is_mandatory && (
                                <Badge variant="destructive" className="text-xs">Required</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {req.requirement_description || 'No description provided'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {hasLinkedDoc && (
                            <Badge variant="outline" className="text-xs gap-1">
                              <FileText className="h-3 w-3" />
                              Doc Linked
                            </Badge>
                          )}
                          <Badge variant="outline" className={`${status.color} gap-1`}>
                            {status.icon}
                            {status.label}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <CardContent className="p-4 pt-0 border-t bg-muted/30">
                      <div className="space-y-4">
                        {/* Threshold Info */}
                        {req.threshold_data && (
                          <div className="p-3 bg-background rounded-lg border">
                            <div className="flex items-center gap-2 mb-2">
                              <AlertTriangle className="h-4 w-4 text-amber-500" />
                              <span className="font-medium text-sm">Threshold Requirements</span>
                            </div>
                            <ul className="text-sm space-y-1 text-muted-foreground">
                              {req.threshold_data.minimum_grade && (
                                <li>• Minimum Grade: <strong className="text-foreground">{req.threshold_data.minimum_grade}</strong></li>
                              )}
                              {req.threshold_data.minimum_score && (
                                <li>• Minimum Score: <strong className="text-foreground">{req.threshold_data.minimum_score}</strong></li>
                              )}
                              {req.threshold_data.years_required && (
                                <li>• Years Required: <strong className="text-foreground">{req.threshold_data.years_required} years</strong></li>
                              )}
                              {req.threshold_data.description && !req.threshold_data.minimum_grade && !req.threshold_data.minimum_score && !req.threshold_data.years_required && (
                                <li>• {req.threshold_data.description}</li>
                              )}
                            </ul>
                            {req.threshold_data.alternatives && req.threshold_data.alternatives.length > 0 && (
                              <p className="text-xs text-muted-foreground mt-2 pt-2 border-t">
                                Alternatives accepted: {req.threshold_data.alternatives.join(', ')}
                              </p>
                            )}
                          </div>
                        )}

                        {/* Linked Document Section */}
                        <div className="p-3 bg-background rounded-lg border">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-primary" />
                              <span className="font-medium text-sm">Linked Document</span>
                            </div>
                            {!hasLinkedDoc ? (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleLinkDocumentClick(req)}
                              >
                                <Link2 className="h-3 w-3 mr-1" />
                                Link Document
                              </Button>
                            ) : (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleUnlinkDocument(req)}
                                className="text-muted-foreground hover:text-destructive"
                              >
                                <Unlink className="h-3 w-3 mr-1" />
                                Unlink
                              </Button>
                            )}
                          </div>

                          {hasLinkedDoc && req.linked_document ? (
                            <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{req.linked_document.document_name}</span>
                                <Badge 
                                  variant="outline" 
                                  className={
                                    docStatus === 'approved' ? 'bg-green-500/10 text-green-600' :
                                    docStatus === 'rejected' ? 'bg-red-500/10 text-red-600' :
                                    'bg-amber-500/10 text-amber-600'
                                  }
                                >
                                  {docStatus || 'pending'}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-1">
                                {req.linked_document.file_path && (
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    asChild
                                  >
                                    <a href={req.linked_document.file_path} target="_blank" rel="noopener noreferrer">
                                      <Eye className="h-3 w-3 mr-1" />
                                      View
                                    </a>
                                  </Button>
                                )}
                                {docStatus !== 'approved' && docStatus !== 'rejected' && (
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="text-green-600"
                                    onClick={() => handleDocumentApprove(req)}
                                  >
                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                    Review
                                  </Button>
                                )}
                              </div>
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground">
                              No document linked. Link a document to enable auto-approval when the document is approved.
                            </p>
                          )}
                        </div>

                        {/* Approval Actions */}
                        {req.status === 'pending' && (
                          <div className="flex items-center justify-between p-3 bg-background rounded-lg border">
                            <div>
                              {needsDocApproval ? (
                                <p className="text-sm text-amber-600 flex items-center gap-2">
                                  <Clock className="h-4 w-4" />
                                  Waiting for linked document to be approved
                                </p>
                              ) : canApproveManually ? (
                                <p className="text-sm text-muted-foreground">
                                  This requirement can be manually approved or rejected.
                                </p>
                              ) : null}
                            </div>
                            {canApproveManually && (
                              <div className="flex items-center gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="text-destructive hover:text-destructive"
                                  onClick={() => handleRejectClick(req)}
                                >
                                  <XCircle className="h-3 w-3 mr-1" />
                                  Reject
                                </Button>
                                <Button 
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700"
                                  onClick={() => handleApprove(req)}
                                >
                                  <CheckCircle2 className="h-3 w-3 mr-1" />
                                  Approve
                                </Button>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Approval Info */}
                        {(req.status === 'approved' || req.status === 'auto_approved') && req.approved_at && (
                          <div className="text-xs text-muted-foreground">
                            {req.status === 'auto_approved' ? 'Auto-approved' : 'Approved'} on {new Date(req.approved_at).toLocaleDateString()}
                            {req.approver?.full_name && ` by ${req.approver.full_name}`}
                            {req.notes && ` — ${req.notes}`}
                          </div>
                        )}

                        {req.status === 'rejected' && req.notes && (
                          <div className="text-xs text-red-600">
                            Rejection reason: {req.notes}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            );
          })}
        </div>
      ))}

      {/* Rejection Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Requirement</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting "{selectedRequirement?.requirement_title}".
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Enter rejection reason..."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            rows={3}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleRejectConfirm}
              disabled={!rejectionReason.trim()}
            >
              Reject Requirement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Link Document Dialog */}
      <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Link Document</DialogTitle>
            <DialogDescription>
              Select a document to link to "{selectedRequirement?.requirement_title}".
            </DialogDescription>
          </DialogHeader>
          {availableDocuments.length > 0 ? (
            <Select value={selectedDocumentId} onValueChange={setSelectedDocumentId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a document..." />
              </SelectTrigger>
              <SelectContent>
                {availableDocuments.map(doc => (
                  <SelectItem key={doc.id} value={doc.id}>
                    {doc.file_name} ({doc.status})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <p className="text-sm text-muted-foreground py-4 text-center">
              No documents available to link. Upload a document first.
            </p>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setLinkDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleLinkConfirm}
              disabled={!selectedDocumentId}
            >
              Link Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Document Approval Dialog */}
      <DocumentApprovalDialog
        open={documentApprovalOpen}
        onOpenChange={setDocumentApprovalOpen}
        document={documentToApprove}
        linkedRequirement={requirementForDocument}
        onApprove={handleDocumentApprovalConfirm}
        onReject={handleDocumentReject}
      />
    </div>
  );
}
