import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Eye, Star, Receipt } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  useReceiptTemplates,
  useDeleteReceiptTemplate,
  ReceiptTemplate,
} from '@/services/paymentService';
import { TemplateEditor } from './TemplateEditor';
import { TemplatePreviewModal } from './TemplatePreviewModal';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export const ReceiptTemplateTable = () => {
  const { data: templates = [], isLoading } = useReceiptTemplates();
  const deleteTemplate = useDeleteReceiptTemplate();
  const [editingTemplate, setEditingTemplate] = useState<ReceiptTemplate | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<ReceiptTemplate | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleDelete = async () => {
    if (templateToDelete) {
      await deleteTemplate.mutateAsync(templateToDelete);
      setDeleteDialogOpen(false);
      setTemplateToDelete(null);
    }
  };

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Loading templates...</div>;
  }

  if (showCreateForm || editingTemplate) {
    return (
      <TemplateEditor
        template={editingTemplate || undefined}
        type="receipt"
        onClose={() => {
          setShowCreateForm(false);
          setEditingTemplate(null);
        }}
      />
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            {templates.length} template(s) configured
          </p>
          <Button onClick={() => setShowCreateForm(true)} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Create Template
          </Button>
        </div>

        {templates.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Receipt className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No receipt templates found</p>
            <p className="text-sm">Create your first template to get started</p>
          </div>
        ) : (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {templates.map((template) => (
                  <TableRow key={template.id}>
                    <TableCell className="font-medium">{template.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{template.template_type}</Badge>
                    </TableCell>
                    <TableCell>
                      {template.is_default && (
                        <Badge className="bg-primary/10 text-primary border-primary/20">
                          <Star className="h-3 w-3 mr-1 fill-current" />
                          Default
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setPreviewTemplate(template)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingTemplate(template)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setTemplateToDelete(template.id);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {previewTemplate && (
        <TemplatePreviewModal
          template={previewTemplate}
          type="receipt"
          onClose={() => setPreviewTemplate(null)}
        />
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Template?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the receipt template.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
