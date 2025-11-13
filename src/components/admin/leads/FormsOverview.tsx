import { useState, useEffect } from "react";
import { Plus, Search, Filter, Edit, Copy, Trash2, BarChart3, FileText, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HelpIcon } from "@/components/ui/help-icon";
import { useHelpContent } from "@/hooks/useHelpContent";
import { Input } from "@/components/ui/input";
import { CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ModernStatsCard from "../ModernStatsCard";
import { PageHeader } from "@/components/modern/PageHeader";
import { ModernCard } from "@/components/modern/ModernCard";
import { InfoBadge } from "@/components/modern/InfoBadge";
import { MetadataItem } from "@/components/modern/MetadataItem";

interface FormsOverviewProps {
  onCreateForm: () => void;
  onEditForm: (formId: string) => void;
}

export function FormsOverview({ onCreateForm, onEditForm }: FormsOverviewProps) {
  const { getHelpContent } = useHelpContent();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [forms, setForms] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setForms([]);
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('forms')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setForms(data || []);
    } catch (error) {
      console.error('Error fetching forms:', error);
      toast({
        title: "Error",
        description: "Failed to load forms",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate stats from actual data
  const formsStats = {
    total: forms.length,
    active: forms.filter(f => f.status === 'active').length,
    draft: forms.filter(f => f.status === 'draft').length,
    archived: forms.filter(f => f.status === 'archived').length,
    submissions: 0, // TODO: Calculate from form_submissions table
    conversionRate: 0 // TODO: Calculate from form_submissions
  };

  const getStatusVariant = (status: string): 'success' | 'warning' | 'destructive' | 'default' | 'secondary' => {
    switch (status) {
      case "active":
        return "success";
      case "draft":
        return "warning";
      case "archived":
        return "secondary";
      default:
        return "default";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <PageHeader
        title="Lead Forms"
        subtitle="Manage and track your lead capture forms"
      />

      <div className="mb-6 flex justify-end">
        <Button onClick={onCreateForm} size="lg">
          <Plus className="w-4 h-4 mr-2" />
          Create Form
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <ModernStatsCard
          title="Total Forms"
          value={formsStats.total.toString()}
          change={null}
          icon={FileText}
        />
        <ModernStatsCard
          title="Active Forms"
          value={formsStats.active.toString()}
          change={null}
          icon={FileText}
        />
        <ModernStatsCard
          title="Total Submissions"
          value={formsStats.submissions.toLocaleString()}
          change={{ value: 12.5, type: "increase", period: "last month" }}
          icon={TrendingUp}
        />
        <ModernStatsCard
          title="Avg. Conversion Rate"
          value={`${formsStats.conversionRate}%`}
          change={{ value: 3.2, type: "increase", period: "last month" }}
          icon={BarChart3}
          helpContent={getHelpContent('formConversion')}
        />
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search forms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Forms Grid */}
      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">
          Loading forms...
        </div>
      ) : forms.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
          <h3 className="text-lg font-semibold mb-2">No forms yet</h3>
          <p className="text-muted-foreground mb-6">
            Create your first lead capture form to start collecting submissions
          </p>
          <Button onClick={onCreateForm}>
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Form
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {forms.map((form) => (
          <ModernCard key={form.id}>
            <CardContent className="p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center flex-shrink-0">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-base text-foreground mb-2 truncate">
                    {form.name}
                  </h3>
                  <InfoBadge variant={getStatusVariant(form.status)}>
                    {form.status?.toUpperCase() || 'DRAFT'}
                  </InfoBadge>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <BarChart3 className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEditForm(form.id)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Copy className="w-4 h-4 mr-2" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <BarChart3 className="w-4 h-4 mr-2" />
                      View Analytics
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-3 mb-4">
                {form.description && (
                  <p className="text-sm text-muted-foreground mb-2">{form.description}</p>
                )}
              </div>

              <div className="pt-4 border-t border-border">
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">
                    Created {new Date(form.created_at).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Last modified {new Date(form.updated_at).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </ModernCard>
          ))}
        </div>
      )}
    </div>
  );
}