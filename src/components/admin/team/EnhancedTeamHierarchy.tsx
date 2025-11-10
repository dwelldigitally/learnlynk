import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ChevronRight, ChevronDown, Plus, Edit, Trash2, Building2, Users as UsersIcon, User } from 'lucide-react';
import type { TeamHierarchyNode } from '@/types/team-management';
import { toast } from 'sonner';

// Mock data for demonstration
const mockHierarchy: TeamHierarchyNode[] = [
  {
    id: 'team_root',
    name: 'Western College',
    type: 'department',
    parent_id: null,
    manager_id: null,
    description: 'Root organization node',
    is_active: true,
    metadata: {},
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    memberCount: 8,
    children: [
      {
        id: 'team_admissions',
        name: 'Admissions & Enrollment',
        type: 'department',
        parent_id: 'team_root',
        manager_id: null,
        description: 'Manages all admissions and enrollment activities',
        is_active: true,
        metadata: {},
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        memberCount: 3,
        children: [
          {
            id: 'team_domestic',
            name: 'Domestic Admissions Team',
            type: 'team',
            parent_id: 'team_admissions',
            manager_id: '2',
            description: 'Handles domestic student admissions',
            is_active: true,
            metadata: {},
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z',
            memberCount: 2
          },
          {
            id: 'team_international',
            name: 'International Admissions Team',
            type: 'team',
            parent_id: 'team_admissions',
            manager_id: '6',
            description: 'Handles international student admissions',
            is_active: true,
            metadata: {},
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z',
            memberCount: 1
          }
        ]
      },
      {
        id: 'team_academic',
        name: 'Academic Affairs',
        type: 'department',
        parent_id: 'team_root',
        manager_id: null,
        description: 'Oversees academic programs and policies',
        is_active: true,
        metadata: {},
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        memberCount: 3,
        children: [
          {
            id: 'team_advisors',
            name: 'Program Advisors',
            type: 'team',
            parent_id: 'team_academic',
            manager_id: null,
            description: 'Provides academic advising services',
            is_active: true,
            metadata: {},
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z',
            memberCount: 2
          },
          {
            id: 'team_registrar',
            name: 'Registrar Office',
            type: 'team',
            parent_id: 'team_academic',
            manager_id: null,
            description: 'Manages student records and registration',
            is_active: true,
            metadata: {},
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z',
            memberCount: 1
          }
        ]
      },
      {
        id: 'team_financial',
        name: 'Financial Services',
        type: 'department',
        parent_id: 'team_root',
        manager_id: '1',
        description: 'Handles all financial operations',
        is_active: true,
        metadata: {},
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        memberCount: 2
      }
    ]
  }
];

export function EnhancedTeamHierarchy() {
  const hierarchy = mockHierarchy;
  const isLoading = false;
  
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['team_root']));
  const [showDialog, setShowDialog] = useState(false);
  const [editingNode, setEditingNode] = useState<TeamHierarchyNode | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'team' as 'team' | 'department' | 'individual',
    description: '',
    parent_id: null as string | null,
  });

  const toggleNode = (nodeId: string) => {
    setExpandedNodes(prev => {
      const next = new Set(prev);
      if (next.has(nodeId)) next.delete(nodeId);
      else next.add(nodeId);
      return next;
    });
  };

  const handleSave = () => {
    console.log('Mock save:', formData);
    toast.success(editingNode ? 'Node updated (demo)' : 'Node created (demo)');
    setShowDialog(false);
    resetForm();
  };

  const handleEdit = (node: TeamHierarchyNode) => {
    setEditingNode(node);
    setFormData({
      name: node.name,
      type: node.type,
      description: node.description || '',
      parent_id: node.parent_id,
    });
    setShowDialog(true);
  };

  const handleDelete = (nodeId: string) => {
    if (confirm('Are you sure you want to delete this node? This will also delete all children.')) {
      console.log('Mock delete:', nodeId);
      toast.success('Node deleted (demo)');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'team',
      description: '',
      parent_id: null,
    });
    setEditingNode(null);
  };

  const renderNode = (node: TeamHierarchyNode, level = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodes.has(node.id);
    const Icon = node.type === 'department' ? Building2 : node.type === 'team' ? UsersIcon : User;

    return (
      <div key={node.id} className="mb-2">
        <div
          className="flex items-center gap-2 p-3 rounded-lg hover:bg-muted/50 transition-colors"
          style={{ marginLeft: `${level * 24}px` }}
        >
          {hasChildren ? (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => toggleNode(node.id)}
            >
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          ) : (
            <div className="h-6 w-6" />
          )}
          
          <Icon className="h-4 w-4 text-muted-foreground" />
          
          <div className="flex-1">
            <div className="font-medium">{node.name}</div>
            {node.description && (
              <div className="text-xs text-muted-foreground">{node.description}</div>
            )}
          </div>

          {node.memberCount !== undefined && (
            <Badge variant="outline">{node.memberCount} members</Badge>
          )}

          <Badge variant="outline" className="capitalize">{node.type}</Badge>
          
          {node.is_active ? (
            <Badge className="bg-success text-success-foreground">Active</Badge>
          ) : (
            <Badge variant="secondary">Inactive</Badge>
          )}

          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => handleEdit(node)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => handleDelete(node.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {isExpanded && hasChildren && (
          <div>
            {node.children!.map(child => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-12">Loading hierarchy...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Team Hierarchy</h3>
          <p className="text-sm text-muted-foreground">Organizational structure and reporting lines</p>
        </div>
        <Button onClick={() => { resetForm(); setShowDialog(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Add Node
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {hierarchy.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No hierarchy nodes yet. Create your first one above.
            </div>
          ) : (
            <div className="space-y-2">
              {hierarchy.map(node => renderNode(node))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingNode ? 'Edit Node' : 'Create Node'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter node name"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Type</label>
              <Select
                value={formData.type}
                onValueChange={(v) => setFormData(prev => ({ ...prev, type: v as any }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="department">Department</SelectItem>
                  <SelectItem value="team">Team</SelectItem>
                  <SelectItem value="individual">Individual</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Optional description"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
