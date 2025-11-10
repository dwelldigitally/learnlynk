import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { TeamHierarchyNode } from '@/types/team-management';

export const useTeamHierarchy = () => {
  return useQuery({
    queryKey: ['team-hierarchy'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('team_hierarchy' as any)
        .select('*')
        .order('name', { ascending: true });
      
      if (error) throw error;
      
      // Build hierarchy tree
      const nodes = (data || []) as unknown as TeamHierarchyNode[];
      const nodeMap = new Map<string, TeamHierarchyNode>();
      const roots: TeamHierarchyNode[] = [];
      
      nodes.forEach(node => {
        nodeMap.set(node.id, { ...node, children: [] });
      });
      
      nodes.forEach(node => {
        const currentNode = nodeMap.get(node.id)!;
        if (node.parent_id) {
          const parent = nodeMap.get(node.parent_id);
          if (parent) {
            parent.children = parent.children || [];
            parent.children.push(currentNode);
          }
        } else {
          roots.push(currentNode);
        }
      });
      
      return roots;
    },
  });
};

export const useCreateTeamNode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (node: Partial<TeamHierarchyNode>) => {
      const { error } = await supabase
        .from('team_hierarchy' as any)
        .insert(node);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-hierarchy'] });
    },
  });
};

export const useUpdateTeamNode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<TeamHierarchyNode> }) => {
      const { error } = await supabase
        .from('team_hierarchy' as any)
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-hierarchy'] });
    },
  });
};

export const useDeleteTeamNode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('team_hierarchy' as any)
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-hierarchy'] });
    },
  });
};
