import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePortalNavigation, useNavigationMutations } from "@/hooks/useStudentPortalAdmin";
import { Plus, Loader2, Menu, Edit, Trash2, GripVertical } from "lucide-react";
import { NavigationItemDialog } from "./dialogs/NavigationItemDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const NavigationBuilder = () => {
  const { data: navigation, isLoading } = usePortalNavigation();
  const { createItem, updateItem, deleteItem } = useNavigationMutations();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const handleSave = (item: any) => {
    if (editingItem) {
      updateItem.mutate({ id: editingItem.id, updates: item });
    } else {
      createItem.mutate(item);
    }
    setEditingItem(null);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingItem(null);
    setDialogOpen(true);
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteItem.mutate(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Menu className="h-5 w-5" />
            Navigation Menu Builder
          </CardTitle>
          <CardDescription>
            Drag and drop to reorder menu items, or add new navigation links
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {navigation && navigation.length > 0 ? (
              <div className="space-y-2">
                {navigation.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 border rounded-lg flex items-center justify-between bg-card hover:bg-accent/5 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium">{item.label}</p>
                        </div>
                        <p className="text-sm text-muted-foreground">{item.path || item.external_url}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setDeleteId(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Menu className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No navigation items yet. Click "Add Navigation Item" to get started.</p>
              </div>
            )}

            <Button className="w-full" onClick={handleAdd}>
              <Plus className="mr-2 h-4 w-4" />
              Add Navigation Item
            </Button>
          </div>
        </CardContent>
      </Card>

      <NavigationItemDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSave}
        item={editingItem}
      />

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Navigation Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this navigation item? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
