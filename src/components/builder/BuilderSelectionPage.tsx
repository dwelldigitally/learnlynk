import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FormInput, 
  Workflow, 
  Mail, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  FileText,
  MoreHorizontal
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { CampaignService, type Campaign } from '@/services/campaignService';
import { WorkflowService, type Workflow as WorkflowType } from '@/services/workflowService';
import { FormService, type Form } from '@/services/formService';
import { useToast } from '@/hooks/use-toast';

export function BuilderSelectionPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [workflows, setWorkflows] = useState<WorkflowType[]>([]);
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [campaignsData, workflowsData, formsData] = await Promise.all([
        CampaignService.getCampaigns(),
        WorkflowService.getWorkflows(),
        FormService.getForms(),
      ]);
      
      setCampaigns(campaignsData);
      setWorkflows(workflowsData);
      setForms(formsData);
    } catch (error) {
      console.error('Error loading builder data:', error);
      toast({
        title: "Error",
        description: "Failed to load builder data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (type: 'campaign' | 'workflow' | 'form', id: string) => {
    try {
      if (type === 'campaign') {
        await CampaignService.deleteCampaign(id);
        setCampaigns(prev => prev.filter(c => c.id !== id));
      } else if (type === 'workflow') {
        await WorkflowService.deleteWorkflow(id);
        setWorkflows(prev => prev.filter(w => w.id !== id));
      } else if (type === 'form') {
        await FormService.deleteForm(id);
        setForms(prev => prev.filter(f => f.id !== id));
      }
      
      toast({
        title: "Success",
        description: `${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to delete ${type}`,
        variant: "destructive",
      });
    }
  };

  const builderOptions = [
    {
      type: 'forms',
      title: 'Form Builder',
      description: 'Create custom forms, applications, and surveys with advanced field types and conditional logic',
      icon: FormInput,
      color: 'from-blue-500 to-blue-600',
      route: '/admin/builder/forms'
    },
    {
      type: 'workflows',
      title: 'Workflow Builder',
      description: 'Build automated lead routing, process workflows, and decision trees with visual flow interface',
      icon: Workflow,
      color: 'from-purple-500 to-purple-600',
      route: '/admin/builder/workflows'
    },
    {
      type: 'campaigns',
      title: 'Campaign Builder',
      description: 'Design email and SMS marketing campaigns with automation, targeting, and A/B testing',
      icon: Mail,
      color: 'from-green-500 to-green-600',
      route: '/admin/builder/campaigns'
    }
  ];

  const renderItemsTable = (items: any[], type: string) => {
    if (loading) {
      return <div className="text-center py-8 text-muted-foreground">Loading...</div>;
    }

    if (items.length === 0) {
      return (
        <div className="text-center py-12 text-muted-foreground">
          <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p className="font-medium">No {type} created yet</p>
          <p className="text-sm">Start building your first {type.slice(0, -1)}</p>
        </div>
      );
    }

    return (
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div>
                    <p className="font-medium text-sm">{item.name || item.title}</p>
                    <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                      {item.description}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={(item.status === 'active' || item.status === 'published' || item.is_active) ? 'default' : 'secondary'} className="text-xs">
                    {item.status || (item.is_active ? 'active' : 'inactive')}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {new Date(item.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => navigate(`/admin/builder/${type}/${item.id}`)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate(`/admin/builder/${type}/${item.id}/edit`)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDelete(type.slice(0, -1) as any, item.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <div className="h-full bg-background">
      <div className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Universal Builder</h1>
              <p className="text-muted-foreground mt-1">
                Create forms, workflows, and campaigns with powerful drag-and-drop builders
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <FormInput className="h-4 w-4 text-blue-500" />
                  <span className="text-muted-foreground">{forms.length} Forms</span>
                </div>
                <div className="flex items-center gap-1">
                  <Workflow className="h-4 w-4 text-purple-500" />
                  <span className="text-muted-foreground">{workflows.length} Workflows</span>
                </div>
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4 text-green-500" />
                  <span className="text-muted-foreground">{campaigns.length} Campaigns</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Create New Builders */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-2">Create New</h2>
              <p className="text-muted-foreground text-sm">Choose a builder to get started</p>
            </div>
            
            <div className="space-y-4">
              {builderOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <Card key={option.type} className="relative overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group">
                    <div className={`absolute inset-0 bg-gradient-to-br ${option.color} opacity-5 group-hover:opacity-10 transition-opacity`} />
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${option.color} p-3 flex-shrink-0`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg mb-2">{option.title}</h3>
                          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                            {option.description}
                          </p>
                          <Button 
                            className="w-full" 
                            onClick={() => navigate(option.route)}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Create {option.title.split(' ')[0]}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Right Side - Manage Existing */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-2">Manage Existing</h2>
              <p className="text-muted-foreground text-sm">View and edit your current builders</p>
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FormInput className="h-5 w-5 text-blue-500" />
                    Forms
                    <Badge variant="secondary" className="ml-auto">
                      {forms.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {renderItemsTable(forms, 'forms')}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Workflow className="h-5 w-5 text-purple-500" />
                    Workflows
                    <Badge variant="secondary" className="ml-auto">
                      {workflows.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {renderItemsTable(workflows, 'workflows')}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Mail className="h-5 w-5 text-green-500" />
                    Campaigns
                    <Badge variant="secondary" className="ml-auto">
                      {campaigns.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {renderItemsTable(campaigns, 'campaigns')}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}