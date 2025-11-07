import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useContentCategories, useCategoryMutations, useMediaLibrary, useMediaMutations } from "@/hooks/useStudentPortalAdmin";
import { Plus, Loader2, FolderOpen, Image, Edit, Trash2, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CategoryDialog } from "./dialogs/CategoryDialog";
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
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const ContentManagement = () => {
  const { data: categories, isLoading: categoriesLoading } = useContentCategories();
  const { data: media, isLoading: mediaLoading } = useMediaLibrary();
  const { createCategory, updateCategory, deleteCategory } = useCategoryMutations();
  const { uploadMedia, deleteMedia } = useMediaMutations();
  
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [deleteCategoryId, setDeleteCategoryId] = useState<string | null>(null);
  const [deleteMediaId, setDeleteMediaId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  if (categoriesLoading || mediaLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const handleCategorySave = (category: any) => {
    if (editingCategory) {
      updateCategory.mutate({ id: editingCategory.id, updates: category });
    } else {
      createCategory.mutate(category);
    }
    setEditingCategory(null);
  };

  const handleCategoryEdit = (category: any) => {
    setEditingCategory(category);
    setCategoryDialogOpen(true);
  };

  const handleCategoryAdd = () => {
    setEditingCategory(null);
    setCategoryDialogOpen(true);
  };

  const handleCategoryDelete = () => {
    if (deleteCategoryId) {
      deleteCategory.mutate(deleteCategoryId);
      setDeleteCategoryId(null);
    }
  };

  const handleMediaDelete = () => {
    if (deleteMediaId) {
      deleteMedia.mutate(deleteMediaId);
      setDeleteMediaId(null);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      await uploadMedia.mutateAsync({
        file,
        folder: 'root',
        metadata: {
          file_name: file.name,
          file_type: file.type.startsWith('image/') ? 'image' : 'document',
          file_size: file.size,
        }
      });

      toast.success('File uploaded successfully');
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="categories" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="categories">Content Categories</TabsTrigger>
          <TabsTrigger value="media">Media Library</TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderOpen className="h-5 w-5" />
                Content Categories
              </CardTitle>
              <CardDescription>
                Organize your portal content with custom categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categories && categories.length > 0 ? (
                  <div className="grid gap-3">
                    {categories.map((category) => (
                      <div
                        key={category.id}
                        className="p-4 border rounded-lg bg-card hover:bg-accent/5 transition-colors flex items-center justify-between"
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{category.category_name}</h4>
                            <Badge variant={category.is_public ? "default" : "secondary"}>
                              {category.is_public ? "Public" : "Private"}
                            </Badge>
                          </div>
                          {category.category_description && (
                            <p className="text-sm text-muted-foreground">{category.category_description}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleCategoryEdit(category)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => setDeleteCategoryId(category.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <FolderOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No categories created yet. Click "Add Category" to create one.</p>
                  </div>
                )}

                <Button className="w-full" onClick={handleCategoryAdd}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Category
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="media" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="h-5 w-5" />
                Media Library
              </CardTitle>
              <CardDescription>
                Upload and manage images, videos, and documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {media && media.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {media.map((item) => (
                      <div
                        key={item.id}
                        className="border rounded-lg p-3 bg-card hover:bg-accent/5 transition-colors group relative"
                      >
                        {item.file_type === 'image' && item.file_url ? (
                          <img
                            src={item.file_url}
                            alt={item.alt_text || item.file_name}
                            className="w-full h-32 object-cover rounded mb-2"
                          />
                        ) : (
                          <div className="w-full h-32 bg-muted rounded flex items-center justify-center mb-2">
                            <Image className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}
                        <p className="text-sm font-medium truncate">{item.file_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(item.file_size / 1024).toFixed(0)} KB
                        </p>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => setDeleteMediaId(item.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Image className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No media uploaded yet. Click "Upload Media" to add files.</p>
                  </div>
                )}

                <div className="relative">
                  <Input
                    type="file"
                    accept="image/*,video/*,.pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    className="hidden"
                    id="media-upload"
                  />
                  <Button 
                    className="w-full" 
                    onClick={() => document.getElementById('media-upload')?.click()}
                    disabled={uploading}
                  >
                    {uploading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="mr-2 h-4 w-4" />
                    )}
                    {uploading ? 'Uploading...' : 'Upload Media'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <CategoryDialog
        open={categoryDialogOpen}
        onOpenChange={setCategoryDialogOpen}
        onSave={handleCategorySave}
        category={editingCategory}
      />

      <AlertDialog open={!!deleteCategoryId} onOpenChange={(open) => !open && setDeleteCategoryId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this category? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleCategoryDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!deleteMediaId} onOpenChange={(open) => !open && setDeleteMediaId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Media</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this media file? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleMediaDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
