import { useState } from "react";
import { Plus, Search, Filter, MoreHorizontal, Edit, Copy, Trash2, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ModernStatsCard from "../ModernStatsCard";

interface FormsOverviewProps {
  onCreateForm: () => void;
  onEditForm: (formId: string) => void;
}

export function FormsOverview({ onCreateForm, onEditForm }: FormsOverviewProps) {
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>;
      case "draft":
        return <Badge variant="secondary">Draft</Badge>;
      case "archived":
        return <Badge variant="outline">Archived</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Lead Forms</h1>
          <p className="text-muted-foreground">Manage and track your lead capture forms</p>
        </div>
        <Button onClick={onCreateForm} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Form
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ModernStatsCard
          title="Total Forms"
          value={formsStats.total.toString()}
          change={null}
          icon={BarChart3}
        />
        <ModernStatsCard
          title="Active Forms"
          value={formsStats.active.toString()}
          change={null}
          icon={BarChart3}
        />
        <ModernStatsCard
          title="Total Submissions"
          value={formsStats.submissions.toLocaleString()}
          change={{ value: 12.5, type: "increase", period: "last month" }}
          icon={BarChart3}
        />
        <ModernStatsCard
          title="Avg. Conversion Rate"
          value={`${formsStats.conversionRate}%`}
          change={{ value: 3.2, type: "increase", period: "last month" }}
          icon={BarChart3}
        />
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search forms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Forms Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Forms</CardTitle>
          <CardDescription>
            Overview of all your lead capture forms and their performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockForms.map((form) => (
              <div
                key={form.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-medium">{form.name}</h3>
                    {getStatusBadge(form.status)}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Created by {form.createdBy}</span>
                    <span>•</span>
                    <span>Modified {form.lastModified}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-6 text-sm">
                  <div className="text-center">
                    <div className="font-medium">{form.submissions}</div>
                    <div className="text-muted-foreground">Submissions</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">{form.conversionRate}%</div>
                    <div className="text-muted-foreground">Conversion</div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
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
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}