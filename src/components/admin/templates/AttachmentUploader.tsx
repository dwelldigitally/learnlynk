import React, { useCallback, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, X, FileText, Download } from 'lucide-react';
import { AttachmentMetadata } from '@/types/leadEnhancements';
import { CommunicationTemplateService } from '@/services/communicationTemplateService';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

interface AttachmentUploaderProps {
  attachments: AttachmentMetadata[];
  onAttachmentsChange: (attachments: AttachmentMetadata[]) => void;
  userId: string;
  maxAttachments?: number;
}

export function AttachmentUploader({
  attachments,
  onAttachmentsChange,
  userId,
  maxAttachments = 5,
}: AttachmentUploaderProps) {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getTotalSize = (): string => {
    const total = attachments.reduce((sum, att) => sum + att.file_size, 0);
    return formatFileSize(total);
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    if (attachments.length + files.length > maxAttachments) {
      toast({
        title: "Too many attachments",
        description: `Maximum ${maxAttachments} attachments allowed`,
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    const newAttachments: AttachmentMetadata[] = [];
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const metadata = await CommunicationTemplateService.uploadAttachment(file, userId);
        newAttachments.push(metadata);
        setUploadProgress(((i + 1) / files.length) * 100);
      }

      onAttachmentsChange([...attachments, ...newAttachments]);
      toast({
        title: "Success",
        description: `${files.length} file(s) uploaded successfully`,
      });
    } catch (error: any) {
      console.error('Error uploading files:', error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload files",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleRemoveAttachment = async (attachment: AttachmentMetadata) => {
    try {
      await CommunicationTemplateService.removeAttachment(attachment.file_path);
      onAttachmentsChange(attachments.filter(a => a.id !== attachment.id));
      toast({
        title: "Attachment removed",
        description: `${attachment.file_name} has been removed`,
      });
    } catch (error) {
      console.error('Error removing attachment:', error);
      toast({
        title: "Error",
        description: "Failed to remove attachment",
        variant: "destructive",
      });
    }
  };

  const handleDownload = async (attachment: AttachmentMetadata) => {
    try {
      const url = await CommunicationTemplateService.getAttachmentUrl(attachment.file_path);
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error downloading attachment:', error);
      toast({
        title: "Error",
        description: "Failed to download attachment",
        variant: "destructive",
      });
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  }, [attachments, userId]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Attachments (PDF only, max 10MB each)</Label>
        <span className="text-sm text-muted-foreground">
          {attachments.length}/{maxAttachments} files • {getTotalSize()}
        </span>
      </div>

      {/* Upload Area */}
      <Card
        className={`border-2 border-dashed p-6 transition-colors ${
          dragActive ? 'border-primary bg-primary/5' : 'border-border'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <Upload className="h-10 w-10 text-muted-foreground" />
          <div className="text-center">
            <p className="text-sm font-medium">
              Drag and drop PDF files here, or click to browse
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Maximum file size: 10MB
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            disabled={uploading || attachments.length >= maxAttachments}
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            <Upload className="h-4 w-4 mr-2" />
            Choose Files
          </Button>
          <input
            id="file-upload"
            type="file"
            accept=".pdf,application/pdf"
            multiple
            className="hidden"
            onChange={(e) => handleFileUpload(e.target.files)}
            disabled={uploading}
          />
        </div>

        {uploading && (
          <div className="mt-4">
            <Progress value={uploadProgress} className="h-2" />
            <p className="text-xs text-center text-muted-foreground mt-2">
              Uploading... {Math.round(uploadProgress)}%
            </p>
          </div>
        )}
      </Card>

      {/* Attachment List */}
      {attachments.length > 0 && (
        <div className="space-y-2">
          {attachments.map((attachment) => (
            <Card key={attachment.id} className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <FileText className="h-5 w-5 text-red-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {attachment.file_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(attachment.file_size)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownload(attachment)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveAttachment(attachment)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
