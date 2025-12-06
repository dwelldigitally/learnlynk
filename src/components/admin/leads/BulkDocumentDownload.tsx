import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, FolderArchive, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import JSZip from 'jszip';

interface BulkDocumentDownloadProps {
  leadId: string;
  leadName: string;
  documentRequirements: Array<{ id: string; name: string }>;
}

interface DocumentForDownload {
  id: string;
  document_name: string;
  original_filename: string | null;
  file_path: string | null;
  requirement_id: string | null;
  version: number;
  is_latest: boolean;
  created_at: string;
}

export function BulkDocumentDownload({ 
  leadId, 
  leadName,
  documentRequirements 
}: BulkDocumentDownloadProps) {
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const handleBulkDownload = async () => {
    setDownloading(true);
    setProgress(0);

    try {
      // Fetch all documents for this lead (including all versions)
      const { data: documents, error } = await supabase
        .from('lead_documents')
        .select('id, document_name, original_filename, file_path, requirement_id, version, is_latest, created_at')
        .eq('lead_id', leadId)
        .order('requirement_id')
        .order('version', { ascending: false });

      if (error) throw error;

      if (!documents || documents.length === 0) {
        toast({
          title: "No documents",
          description: "There are no documents to download",
          variant: "destructive"
        });
        return;
      }

      // Create a map of requirement IDs to names
      const requirementNameMap = new Map<string, string>();
      documentRequirements.forEach(req => {
        requirementNameMap.set(req.id, req.name);
      });

      // Create ZIP file
      const zip = new JSZip();
      const sanitizedLeadName = leadName.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_');
      const rootFolder = zip.folder(`${sanitizedLeadName}_Documents`)!;

      // Group documents by requirement
      const groupedDocs = new Map<string, DocumentForDownload[]>();
      
      (documents as DocumentForDownload[]).forEach(doc => {
        const key = doc.requirement_id || 'Other_Documents';
        if (!groupedDocs.has(key)) {
          groupedDocs.set(key, []);
        }
        groupedDocs.get(key)!.push(doc);
      });

      // Download and add files to ZIP
      let processedCount = 0;
      const totalDocs = documents.length;

      for (const [requirementId, docs] of groupedDocs) {
        // Get folder name from requirement or use 'Other Documents'
        const folderName = requirementId === 'Other_Documents' 
          ? 'Other_Documents'
          : (requirementNameMap.get(requirementId) || 'Unknown_Requirement').replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_');
        
        const folder = rootFolder.folder(folderName)!;

        for (const doc of docs) {
          if (!doc.file_path) {
            processedCount++;
            continue;
          }

          try {
            // Get signed URL and download file
            const { data: urlData, error: urlError } = await supabase.storage
              .from('lead-documents')
              .createSignedUrl(doc.file_path, 60);

            if (urlError || !urlData?.signedUrl) {
              console.error('Error getting signed URL:', urlError);
              processedCount++;
              continue;
            }

            const response = await fetch(urlData.signedUrl);
            if (!response.ok) {
              console.error('Error downloading file:', response.statusText);
              processedCount++;
              continue;
            }

            const blob = await response.blob();
            
            // Create filename with version prefix if not latest
            const baseFilename = doc.original_filename || doc.document_name;
            const extension = baseFilename.split('.').pop() || '';
            const nameWithoutExt = baseFilename.replace(/\.[^/.]+$/, '');
            const filename = doc.is_latest 
              ? baseFilename
              : `v${doc.version}_${nameWithoutExt}.${extension}`;

            folder.file(filename, blob);
          } catch (fileError) {
            console.error('Error processing file:', fileError);
          }

          processedCount++;
          setProgress(Math.round((processedCount / totalDocs) * 100));
        }
      }

      // Generate and download ZIP
      const zipBlob = await zip.generateAsync({ 
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 }
      });

      // Trigger download
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${sanitizedLeadName}_Documents.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Download complete",
        description: `Downloaded ${processedCount} documents in organized folders`
      });
    } catch (error) {
      console.error('Error during bulk download:', error);
      toast({
        title: "Download failed",
        description: "Failed to download documents. Please try again.",
        variant: "destructive"
      });
    } finally {
      setDownloading(false);
      setProgress(0);
    }
  };

  return (
    <Button 
      size="sm" 
      variant="outline" 
      onClick={handleBulkDownload}
      disabled={downloading}
    >
      {downloading ? (
        <>
          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
          {progress}%
        </>
      ) : (
        <>
          <FolderArchive className="h-4 w-4 mr-1" />
          Download All
        </>
      )}
    </Button>
  );
}
