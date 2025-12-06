import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  FileText, Upload, Download, Eye, Plus, CheckCircle, XCircle, Clock, AlertCircle,
  GraduationCap, BookOpen, Briefcase, Globe, Shield
} from 'lucide-react';
import { Lead } from '@/types/lead';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { documentService, LeadDocument } from '@/services/documentService';
import { presetDocumentService, PresetDocumentRequirement } from '@/services/presetDocumentService';
import { useDocumentTypeOptions } from '@/hooks/usePropertyOptions';
import { supabase } from '@/integrations/supabase/client';

interface DocumentsSectionProps {
  lead: Lead;
  onUpdate: () => void;
}

interface EntryRequirement {
  id: string;
  title: string;
  type: string;
  description?: string;
  mandatory: boolean;
  minimumGrade?: string | number;
  linkedDocumentTemplates?: string[];
}

interface ProgramRequirements {
  documentRequirements: PresetDocumentRequirement[];
  entryRequirements: EntryRequirement[];
}

export function DocumentsSection({ lead, onUpdate }: DocumentsSectionProps) {
  const [documents, setDocuments] = useState<LeadDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState('');
  const [documentName, setDocumentName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [programRequirements, setProgramRequirements] = useState<ProgramRequirements>({
    documentRequirements: [],
    entryRequirements: []
  });
  const [requirementsLoading, setRequirementsLoading] = useState(true);
  const [selectedRequirement, setSelectedRequirement] = useState<string>('');
  const { toast } = useToast();
  const { options: documentTypeOptions } = useDocumentTypeOptions();

  useEffect(() => {
    loadDocuments();
    loadProgramRequirements();
  }, [lead.id, lead.program_interest]);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const docs = await documentService.getLeadDocuments(lead.id);
      setDocuments(docs);
    } catch (error) {
      console.error('Error loading documents:', error);
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  const loadProgramRequirements = async () => {
    try {
      setRequirementsLoading(true);
      const programName = lead.program_interest?.[0]?.trim();
      
      if (!programName) {
        setProgramRequirements({ documentRequirements: [], entryRequirements: [] });
        return;
      }

      console.log('Loading requirements for program:', programName);

      // Fetch program from database using ILIKE for flexible matching
      const { data: programs, error } = await supabase
        .from('programs')
        .select('document_requirements, entry_requirements')
        .ilike('name', `%${programName}%`)
        .limit(1);

      if (error) {
        console.error('Error fetching program:', error);
        return;
      }

      const program = programs?.[0];
      console.log('Found program:', program);
      console.log('Raw entry_requirements:', program?.entry_requirements);
      
      // First, extract ALL linked document template IDs from entry requirements BEFORE parsing
      const rawEntryReqs = program?.entry_requirements;
      const linkedDocIds: string[] = [];
      
      if (rawEntryReqs && Array.isArray(rawEntryReqs)) {
        for (const req of rawEntryReqs as any[]) {
          console.log('Processing entry requirement:', req);
          if (req.linkedDocumentTemplates && Array.isArray(req.linkedDocumentTemplates)) {
            console.log('Found linkedDocumentTemplates:', req.linkedDocumentTemplates);
            linkedDocIds.push(...req.linkedDocumentTemplates);
          }
        }
      }
      
      // Deduplicate linked document IDs
      const uniqueLinkedDocIds = [...new Set(linkedDocIds)];
      console.log('Unique linked document template IDs:', uniqueLinkedDocIds);
      
      // Parse document requirements
      let docReqs: PresetDocumentRequirement[] = [];
      if (program?.document_requirements && Array.isArray(program.document_requirements)) {
        docReqs = (program.document_requirements as any[]).map((req, idx) => ({
          id: req.id || `doc-req-${idx}`,
          name: req.name || 'Unknown Document',
          description: req.description || '',
          required: req.mandatory ?? true,
          programName
        }));
      }

      // Parse entry requirements
      let entryReqs: EntryRequirement[] = [];
      if (program?.entry_requirements) {
        if (Array.isArray(program.entry_requirements)) {
          entryReqs = (program.entry_requirements as any[]).map((req, idx) => ({
            id: req.id || `entry-req-${idx}`,
            title: req.title || req.name || 'Unknown Requirement',
            type: req.type || 'other',
            description: req.description || '',
            mandatory: req.mandatory ?? true,
            minimumGrade: req.minimumGrade,
            linkedDocumentTemplates: req.linkedDocumentTemplates || []
          }));
        } else if (typeof program.entry_requirements === 'object') {
          // Handle old format: { academic: {...}, language: {...} }
          const oldFormat = program.entry_requirements as Record<string, any>;
          if (oldFormat.academic) {
            entryReqs.push({
              id: 'academic-req',
              title: 'Academic Requirements',
              type: 'academic',
              description: oldFormat.academic.min_gpa 
                ? `Minimum GPA: ${oldFormat.academic.min_gpa}` 
                : JSON.stringify(oldFormat.academic),
              mandatory: true
            });
          }
          if (oldFormat.language) {
            entryReqs.push({
              id: 'language-req',
              title: 'Language Requirements',
              type: 'language',
              description: oldFormat.language.ielts 
                ? `IELTS: ${oldFormat.language.ielts}` 
                : JSON.stringify(oldFormat.language),
              mandatory: true
            });
          }
        }
      }

      // Always fetch linked document templates from entry requirements, regardless of docReqs
      if (uniqueLinkedDocIds.length > 0) {
        console.log('Fetching document templates for IDs:', uniqueLinkedDocIds);
        const { data: templates, error: templateError } = await supabase
          .from('document_templates')
          .select('id, name, description, mandatory')
          .in('id', uniqueLinkedDocIds);
        
        console.log('Fetched templates:', templates, 'Error:', templateError);
        
        if (templates && templates.length > 0) {
          // Add these templates to docReqs (avoiding duplicates)
          const existingIds = new Set(docReqs.map(r => r.id));
          const newDocReqs = templates
            .filter(t => !existingIds.has(t.id))
            .map(t => ({
              id: t.id,
              name: t.name,
              description: t.description || '',
              required: t.mandatory,
              programName
            }));
          docReqs = [...docReqs, ...newDocReqs];
        }
      }

      // Also get from presetDocumentService as fallback
      if (docReqs.length === 0) {
        docReqs = await presetDocumentService.getPresetRequirementsAsync(programName);
      }

      setProgramRequirements({
        documentRequirements: docReqs,
        entryRequirements: entryReqs
      });
    } catch (error) {
      console.error('Error loading program requirements:', error);
    } finally {
      setRequirementsLoading(false);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile || (!documentType && !selectedRequirement)) {
      toast({
        title: "Error",
        description: "Please select a file and document type",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    try {
      const reqId = selectedRequirement || undefined;
      const programName = lead.program_interest?.[0] || '';
      
      if (reqId && programName) {
        // Use presetDocumentService for requirement-based upload
        const newDocument = await presetDocumentService.uploadDocument(
          lead.id,
          selectedFile,
          reqId,
          programName
        );
        setDocuments(prev => [newDocument as unknown as LeadDocument, ...prev]);
      } else {
        // Standard upload
        const newDocument = await documentService.uploadDocument(
          lead.id,
          selectedFile,
          undefined,
          documentName || selectedFile.name
        );
        setDocuments(prev => [newDocument, ...prev]);
      }

      setSelectedFile(null);
      setDocumentType('');
      setDocumentName('');
      setSelectedRequirement('');
      setUploadDialogOpen(false);
      onUpdate();

      toast({
        title: "Success",
        description: "Document uploaded successfully"
      });
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        title: "Error",
        description: "Failed to upload document",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleUploadForRequirement = (requirementId: string) => {
    setSelectedRequirement(requirementId);
    setUploadDialogOpen(true);
  };

  const handleStatusUpdate = async (documentId: string, newStatus: string, reviewComments?: string) => {
    try {
      await documentService.updateDocumentStatus(documentId, newStatus, reviewComments);
      
      setDocuments(prev => prev.map(doc => 
        doc.id === documentId 
          ? { 
              ...doc, 
              admin_status: newStatus, 
              admin_reviewed_at: new Date().toISOString(),
              admin_comments: reviewComments || doc.admin_comments
            }
          : doc
      ));

      toast({
        title: "Success",
        description: `Document ${newStatus}`
      });
    } catch (error) {
      console.error('Error updating document status:', error);
      toast({
        title: "Error",
        description: "Failed to update document status",
        variant: "destructive"
      });
    }
  };

  const handleViewDocument = async (doc: LeadDocument) => {
    if (!doc.file_path) {
      toast({
        title: "Error",
        description: "Document file not found",
        variant: "destructive"
      });
      return;
    }

    try {
      const url = await documentService.getDocumentUrl(doc.file_path);
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error getting document URL:', error);
      toast({
        title: "Error",
        description: "Failed to open document",
        variant: "destructive"
      });
    }
  };

  const handleDownloadDocument = async (doc: LeadDocument) => {
    if (!doc.file_path) {
      toast({
        title: "Error",
        description: "Document file not found",
        variant: "destructive"
      });
      return;
    }

    try {
      const url = await documentService.getDocumentUrl(doc.file_path);
      const link = document.createElement('a');
      link.href = url;
      link.download = doc.original_filename || doc.document_name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading document:', error);
      toast({
        title: "Error",
        description: "Failed to download document",
        variant: "destructive"
      });
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'under_review': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'pending': return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusVariant = (status?: string): "default" | "destructive" | "secondary" | "outline" => {
    switch (status) {
      case 'approved': return 'default';
      case 'rejected': return 'destructive';
      case 'under_review': return 'secondary';
      case 'pending': return 'outline';
      default: return 'outline';
    }
  };

  const getRequirementTypeIcon = (type: string) => {
    switch (type) {
      case 'academic': return <GraduationCap className="h-4 w-4" />;
      case 'language': return <Globe className="h-4 w-4" />;
      case 'experience': return <Briefcase className="h-4 w-4" />;
      case 'other': return <BookOpen className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown size';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  // Calculate document progress
  const getDocumentForRequirement = (requirementId: string) => {
    return documents.find(doc => doc.requirement_id === requirementId);
  };

  const requiredDocCount = programRequirements.documentRequirements.filter(r => r.required).length;
  const uploadedRequiredDocs = programRequirements.documentRequirements
    .filter(r => r.required)
    .filter(r => getDocumentForRequirement(r.id))
    .length;
  const progressPercent = requiredDocCount > 0 ? (uploadedRequiredDocs / requiredDocCount) * 100 : 0;

  // Use dynamic document types from Properties Management
  const documentTypes = documentTypeOptions.length > 0 
    ? documentTypeOptions 
    : [{ value: 'other', label: 'Other' }];

  if (loading || requirementsLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Documents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Entry Requirements Overview */}
      {programRequirements.entryRequirements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Entry Requirements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {programRequirements.entryRequirements.map((req) => (
                <div key={req.id} className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="p-2 rounded-full bg-primary/10">
                    {getRequirementTypeIcon(req.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{req.title}</span>
                      {req.mandatory && (
                        <Badge variant="secondary" className="text-xs">Required</Badge>
                      )}
                      <Badge variant="outline" className="text-xs capitalize">{req.type}</Badge>
                    </div>
                    {req.description && (
                      <p className="text-sm text-muted-foreground mt-1">{req.description}</p>
                    )}
                    {req.minimumGrade && (
                      <p className="text-sm text-muted-foreground">Minimum Grade: {req.minimumGrade}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Document Requirements Checklist */}
      {programRequirements.documentRequirements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Required Documents
              </div>
              <Badge variant={progressPercent === 100 ? 'default' : 'secondary'}>
                {uploadedRequiredDocs}/{requiredDocCount} Complete
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={progressPercent} className="h-2" />
            
            <div className="space-y-2">
              {programRequirements.documentRequirements.map((req) => {
                const uploadedDoc = getDocumentForRequirement(req.id);
                return (
                  <div key={req.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {uploadedDoc ? (
                        getStatusIcon(uploadedDoc.admin_status)
                      ) : (
                        <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/50" />
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={uploadedDoc ? 'font-medium' : ''}>{req.name}</span>
                          {req.required && (
                            <Badge variant="outline" className="text-xs">Required</Badge>
                          )}
                        </div>
                        {req.description && (
                          <p className="text-xs text-muted-foreground">{req.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {uploadedDoc ? (
                        <>
                          <Badge variant={getStatusVariant(uploadedDoc.admin_status)}>
                            {(uploadedDoc.admin_status || 'pending').replace('_', ' ')}
                          </Badge>
                          <Button size="sm" variant="ghost" onClick={() => handleViewDocument(uploadedDoc)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => handleUploadForRequirement(req.id)}>
                          <Upload className="h-4 w-4 mr-1" />
                          Upload
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Uploaded Documents */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Uploaded Documents ({documents.length})
            </div>
            <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Upload Document
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload New Document</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  {selectedRequirement && (
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <p className="text-sm font-medium">
                        Uploading for: {programRequirements.documentRequirements.find(r => r.id === selectedRequirement)?.name}
                      </p>
                    </div>
                  )}
                  
                  <div>
                    <Label htmlFor="document-file">Select File</Label>
                    <Input
                      id="document-file"
                      type="file"
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    />
                    {selectedFile && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                      </p>
                    )}
                  </div>
                  
                  {!selectedRequirement && (
                    <>
                      {programRequirements.documentRequirements.length > 0 && (
                        <div>
                          <Label>Link to Requirement (Optional)</Label>
                          <Select value={selectedRequirement} onValueChange={setSelectedRequirement}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a requirement" />
                            </SelectTrigger>
                            <SelectContent>
                              {programRequirements.documentRequirements.map(req => (
                                <SelectItem key={req.id} value={req.id}>
                                  {req.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                      
                      <div>
                        <Label>Document Type</Label>
                        <Select value={documentType} onValueChange={setDocumentType}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select document type" />
                          </SelectTrigger>
                          <SelectContent>
                            {documentTypes.map(type => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}

                  <div>
                    <Label htmlFor="document-name">Document Name (Optional)</Label>
                    <Input
                      id="document-name"
                      value={documentName}
                      onChange={(e) => setDocumentName(e.target.value)}
                      placeholder="Enter a custom name for this document"
                    />
                  </div>
                  
                  <Button 
                    onClick={handleFileUpload} 
                    disabled={!selectedFile || (!documentType && !selectedRequirement) || uploading}
                  >
                    {uploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Document
                      </>
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {documents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No documents uploaded yet</p>
              <p className="text-sm mt-1">Upload the first document to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {documents.map((doc) => (
                <div key={doc.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <FileText className="h-5 w-5 mt-0.5 text-muted-foreground" />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{doc.document_name}</span>
                          <Badge variant="outline" className="text-xs">
                            {documentTypes.find(t => t.value === doc.document_type)?.label || doc.document_type}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{formatFileSize(doc.file_size)}</span>
                          <span>Uploaded {format(new Date(doc.created_at), 'MMM d, yyyy')}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {getStatusIcon(doc.admin_status)}
                        <Badge variant={getStatusVariant(doc.admin_status)} className="text-xs">
                          {(doc.admin_status || 'pending').replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {doc.admin_comments && (
                    <div className="bg-muted/50 p-2 rounded text-sm">
                      <span className="font-medium">Comments: </span>
                      {doc.admin_comments}
                    </div>
                  )}

                  {doc.ai_insight && (
                    <div className="bg-primary/5 p-2 rounded text-sm">
                      <span className="font-medium">AI Insight: </span>
                      {doc.ai_insight}
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleViewDocument(doc)}>
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDownloadDocument(doc)}>
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                    
                    {doc.admin_status === 'pending' && (
                      <>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleStatusUpdate(doc.id, 'approved', 'Document approved')}
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleStatusUpdate(doc.id, 'rejected', 'Document rejected - please resubmit')}
                        >
                          <XCircle className="h-3 w-3 mr-1" />
                          Reject
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
