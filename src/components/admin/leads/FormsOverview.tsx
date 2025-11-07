import { useState } from "react";
import { Plus, Search, Filter, Edit, Copy, Trash2, BarChart3, FileText, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HelpIcon } from "@/components/ui/help-icon";
import { useHelpContent } from "@/hooks/useHelpContent";
import { Input } from "@/components/ui/input";
import { CardContent } from "@/components/ui/card";
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
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data for demonstration
  const formsStats = {
    total: 12,
    active: 8,
    draft: 3,
    archived: 1,
    submissions: 1247,
    conversionRate: 68.5
  };

  const mockForms = [
    {
      id: "1",
      name: "Program Application Form",
      status: "active",
      submissions: 156,
      conversionRate: 72.3,
      lastModified: "2024-01-15",
      createdBy: "John Doe"
    },
    {
      id: "2", 
      name: "Contact Us Form",
      status: "active",
      submissions: 89,
      conversionRate: 65.1,
      lastModified: "2024-01-12",
      createdBy: "Jane Smith"
    },
    {
      id: "3",
      name: "Newsletter Signup",
      status: "draft",
      submissions: 0,
      conversionRate: 0,
      lastModified: "2024-01-10",
      createdBy: "John Doe"
    },
    {
      id: "4",
      name: "Event Registration",
      status: "active", 
      submissions: 234,
      conversionRate: 81.2,
      lastModified: "2024-01-08",
      createdBy: "Sarah Wilson"
    }
  ];

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
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockForms.map((form) => (
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
                    {form.status.toUpperCase()}
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
                <MetadataItem
                  icon={TrendingUp}
                  label="Submissions"
                  value={form.submissions.toLocaleString()}
                />
                
                <MetadataItem
                  icon={BarChart3}
                  label="Conversion Rate"
                  value={`${form.conversionRate}%`}
                />

                <MetadataItem
                  label="Created By"
                  value={form.createdBy}
                />
              </div>

              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  Last modified {new Date(form.lastModified).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </p>
              </div>
            </CardContent>
          </ModernCard>
        ))}
      </div>
    </div>
  );
}