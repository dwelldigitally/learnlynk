import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { StudentPortalAdminService } from '@/services/studentPortalAdminService';
import { toast } from 'sonner';
import type {
  PortalBranding,
  PortalNavigation,
  PortalRole,
  CommunicationTemplate,
  ContentCategory,
  MediaLibraryItem,
} from '@/types/studentPortalAdmin';

// ================== BRANDING HOOKS ==================

export const usePortalBranding = () => {
  return useQuery({
    queryKey: ['portal-branding'],
    queryFn: () => StudentPortalAdminService.getBranding(),
  });
};

export const useBrandingMutations = () => {
  const queryClient = useQueryClient();

  const saveBranding = useMutation({
    mutationFn: (branding: Partial<PortalBranding>) =>
      StudentPortalAdminService.saveBranding(branding),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portal-branding'] });
      toast.success('Branding settings saved successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to save branding: ${error.message}`);
    },
  });

  return { saveBranding };
};

// ================== NAVIGATION HOOKS ==================

export const usePortalNavigation = () => {
  return useQuery({
    queryKey: ['portal-navigation'],
    queryFn: () => StudentPortalAdminService.getNavigation(),
  });
};

export const useNavigationMutations = () => {
  const queryClient = useQueryClient();

  const createItem = useMutation({
    mutationFn: (item: Omit<PortalNavigation, 'id' | 'created_at' | 'updated_at' | 'user_id'>) =>
      StudentPortalAdminService.createNavigationItem(item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portal-navigation'] });
      toast.success('Navigation item created');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create item: ${error.message}`);
    },
  });

  const updateItem = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<PortalNavigation> }) =>
      StudentPortalAdminService.updateNavigationItem(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portal-navigation'] });
      toast.success('Navigation item updated');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update item: ${error.message}`);
    },
  });

  const deleteItem = useMutation({
    mutationFn: (id: string) => StudentPortalAdminService.deleteNavigationItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portal-navigation'] });
      toast.success('Navigation item deleted');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete item: ${error.message}`);
    },
  });

  const reorderItems = useMutation({
    mutationFn: (items: { id: string; position: number }[]) =>
      StudentPortalAdminService.reorderNavigation(items),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portal-navigation'] });
      toast.success('Navigation reordered');
    },
    onError: (error: Error) => {
      toast.error(`Failed to reorder: ${error.message}`);
    },
  });

  return { createItem, updateItem, deleteItem, reorderItems };
};

// ================== ROLES HOOKS ==================

export const usePortalRoles = () => {
  return useQuery({
    queryKey: ['portal-roles'],
    queryFn: () => StudentPortalAdminService.getRoles(),
  });
};

export const useRoleMutations = () => {
  const queryClient = useQueryClient();

  const createRole = useMutation({
    mutationFn: (role: Omit<PortalRole, 'id' | 'created_at' | 'updated_at' | 'user_id'>) =>
      StudentPortalAdminService.createRole(role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portal-roles'] });
      toast.success('Role created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create role: ${error.message}`);
    },
  });

  const updateRole = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<PortalRole> }) =>
      StudentPortalAdminService.updateRole(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portal-roles'] });
      toast.success('Role updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update role: ${error.message}`);
    },
  });

  const deleteRole = useMutation({
    mutationFn: (id: string) => StudentPortalAdminService.deleteRole(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portal-roles'] });
      toast.success('Role deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete role: ${error.message}`);
    },
  });

  return { createRole, updateRole, deleteRole };
};

// ================== COMMUNICATION TEMPLATES HOOKS ==================

export const useCommunicationTemplates = () => {
  return useQuery({
    queryKey: ['communication-templates'],
    queryFn: () => StudentPortalAdminService.getTemplates(),
  });
};

export const useTemplateMutations = () => {
  const queryClient = useQueryClient();

  const createTemplate = useMutation({
    mutationFn: (template: Omit<CommunicationTemplate, 'id' | 'created_at' | 'updated_at' | 'user_id' | 'times_used' | 'last_used_at'>) =>
      StudentPortalAdminService.createTemplate(template),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communication-templates'] });
      toast.success('Template created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create template: ${error.message}`);
    },
  });

  const updateTemplate = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<CommunicationTemplate> }) =>
      StudentPortalAdminService.updateTemplate(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communication-templates'] });
      toast.success('Template updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update template: ${error.message}`);
    },
  });

  const deleteTemplate = useMutation({
    mutationFn: (id: string) => StudentPortalAdminService.deleteTemplate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communication-templates'] });
      toast.success('Template deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete template: ${error.message}`);
    },
  });

  return { createTemplate, updateTemplate, deleteTemplate };
};

// ================== CONTENT CATEGORIES HOOKS ==================

export const useContentCategories = () => {
  return useQuery({
    queryKey: ['content-categories'],
    queryFn: () => StudentPortalAdminService.getCategories(),
  });
};

export const useCategoryMutations = () => {
  const queryClient = useQueryClient();

  const createCategory = useMutation({
    mutationFn: (category: Omit<ContentCategory, 'id' | 'created_at' | 'updated_at' | 'user_id'>) =>
      StudentPortalAdminService.createCategory(category),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content-categories'] });
      toast.success('Category created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create category: ${error.message}`);
    },
  });

  const updateCategory = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<ContentCategory> }) =>
      StudentPortalAdminService.updateCategory(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content-categories'] });
      toast.success('Category updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update category: ${error.message}`);
    },
  });

  const deleteCategory = useMutation({
    mutationFn: (id: string) => StudentPortalAdminService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content-categories'] });
      toast.success('Category deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete category: ${error.message}`);
    },
  });

  return { createCategory, updateCategory, deleteCategory };
};

// ================== MEDIA LIBRARY HOOKS ==================

export const useMediaLibrary = (folder: string = 'root') => {
  return useQuery({
    queryKey: ['media-library', folder],
    queryFn: () => StudentPortalAdminService.getMediaItems(folder),
  });
};

export const useMediaMutations = () => {
  const queryClient = useQueryClient();

  const uploadMedia = useMutation({
    mutationFn: ({ file, folder, metadata }: { file: File; folder?: string; metadata?: Partial<MediaLibraryItem> }) =>
      StudentPortalAdminService.uploadMedia(file, folder, metadata),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media-library'] });
      toast.success('Media uploaded successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to upload media: ${error.message}`);
    },
  });

  const deleteMedia = useMutation({
    mutationFn: (id: string) => StudentPortalAdminService.deleteMedia(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media-library'] });
      toast.success('Media deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete media: ${error.message}`);
    },
  });

  return { uploadMedia, deleteMedia };
};
