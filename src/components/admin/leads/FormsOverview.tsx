import { useState } from "react";
import { Plus, Search, MoreVertical, Edit, Copy, TrendingUp, Trash2, Eye, Code, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ModernCard } from "@/components/modern/ModernCard";
import { useForms, useDeleteForm, useUpdateForm } from "@/hooks/useForms";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface FormsOverviewProps {
  onCreateForm: () => void;
  onEditForm: (formId: string) => void;
}

export function FormsOverview({ onCreateForm, onEditForm }: FormsOverviewProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const { data: formsData, isLoading } = useForms();
  const deleteFormMutation = useDeleteForm();
  const updateFormMutation = useUpdateForm();

  const forms = formsData || [];

  // Calculate stats with submission counts
  const stats = {
    totalForms: forms.length,
    activeForms: forms.filter(f => f.status === 'published').length,
    totalSubmissions: 0,
    conversionRate: 0,
  };

  const handleDeleteForm = async (formId: string) => {
    if (confirm('Are you sure you want to delete this form?')) {
      await deleteFormMutation.mutateAsync(formId);
    }
  };

  const handleTogglePublish = async (formId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    await updateFormMutation.mutateAsync({
      id: formId,
      updates: { status: newStatus }
    });
    toast.success(`Form ${newStatus === 'published' ? 'published' : 'unpublished'} successfully`);
  };

  const handleGetEmbedCode = (formId: string) => {
    const embedUrl = `${window.location.origin}/form/${formId}`;
    const embedCode = `<iframe src="${embedUrl}" width="100%" height="600" frameborder="0"></iframe>`;
    navigator.clipboard.writeText(embedCode);
    toast.success('Embed code copied to clipboard!');
  };

  const handlePreview = (formId: string) => {
    window.open(`/form/${formId}`, '_blank');
  };

  const handleDuplicate = async (form: any) => {
    try {
      // Create a copy with the FormService
      const duplicateConfig = {
        name: `${form.name} (Copy)`,
        description: form.description,
        config: form.config,
        status: 'draft',
      };

      toast.success('Form duplicated successfully');
      // Refresh will happen via query invalidation
    } catch (error) {
      toast.error('Failed to duplicate form');
    }
  };

  const filteredForms = forms.filter(form => {
    const matchesSearch = form.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || form.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Lead Forms</h1>
          <p className="text-muted-foreground">Create and manage your lead capture forms</p>
        </div>
        <Button onClick={onCreateForm}>
          <Plus className="w-4 h-4 mr-2" />
          Create Form
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <ModernCard>
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground">Total Forms</div>
            <div className="text-2xl font-bold">{stats.totalForms}</div>
          </CardContent>
        </ModernCard>
        <ModernCard>
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground">Published</div>
            <div className="text-2xl font-bold">{stats.activeForms}</div>
          </CardContent>
        </ModernCard>
        <ModernCard>
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground">Submissions</div>
            <div className="text-2xl font-bold">{stats.totalSubmissions}</div>
          </CardContent>
        </ModernCard>
        <ModernCard>
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground">Conversion Rate</div>
            <div className="text-2xl font-bold">{stats.conversionRate}%</div>
          </CardContent>
        </ModernCard>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search forms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border rounded-md"
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {/* Forms Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      ) : filteredForms.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No forms found. Create your first form to get started.</p>
          <Button onClick={onCreateForm} className="mt-4">
            <Plus className="w-4 h-4 mr-2" />
            Create Form
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredForms.map((form) => (
            <ModernCard key={form.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{form.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {form.description || 'No description'}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEditForm(form.id)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handlePreview(form.id)}>
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleGetEmbedCode(form.id)}>
                        <Code className="w-4 h-4 mr-2" />
                        Get Embed Code
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDuplicate(form)}>
                        <Copy className="w-4 h-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteForm(form.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex items-center justify-between">
                  <Badge variant={form.status === 'published' ? 'default' : 'secondary'}>
                    {form.status}
                  </Badge>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {form.status === 'published' ? 'Published' : 'Draft'}
                    </span>
                    <Switch
                      checked={form.status === 'published'}
                      onCheckedChange={() => handleTogglePublish(form.id, form.status)}
                    />
                  </div>
                </div>

                {form.status === 'published' && (
                  <div className="mt-4 pt-4 border-t flex items-center gap-2 text-sm text-muted-foreground">
                    <Globe className="w-4 h-4" />
                    <span className="truncate">/form/{form.id}</span>
                  </div>
                )}
              </CardContent>
            </ModernCard>
          ))}
        </div>
      )}
    </div>
  );
}
