import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  usePotentialDuplicates, 
  useExactDuplicates, 
  useDuplicateStats,
  useDuplicatePreventionSetting,
  useDeleteDuplicates
} from '@/hooks/useDuplicateDetection';
import { DuplicateGroupCard } from '@/components/admin/duplicates/DuplicateGroupCard';
import { MergeLeadsDialog } from '@/components/admin/duplicates/MergeLeadsDialog';
import { BulkMergeDialog } from '@/components/admin/duplicates/BulkMergeDialog';
import { DuplicateGroup } from '@/services/duplicateLeadService';
import { Lead } from '@/types/lead';
import { 
  ArrowLeft, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  Settings,
  Copy,
  Trash2,
  Info,
  GitMerge
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function DuplicateContactsDashboard() {
  const navigate = useNavigate();
  const [selectedGroup, setSelectedGroup] = useState<DuplicateGroup | null>(null);
  const [showMergeDialog, setShowMergeDialog] = useState(false);
  const [selectedGroupIds, setSelectedGroupIds] = useState<Set<string>>(new Set());
  const [showBulkMergeDialog, setShowBulkMergeDialog] = useState(false);
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);
  
  const { data: setting, isLoading: settingLoading } = useDuplicatePreventionSetting();
  const { data: potentialDuplicates = [], isLoading: loadingPotential, refetch: refetchPotential } = usePotentialDuplicates();
  const { data: exactDuplicates = [], isLoading: loadingExact, refetch: refetchExact } = useExactDuplicates();
  const stats = useDuplicateStats();
  const deleteDuplicates = useDeleteDuplicates();

  const isLoading = loadingPotential || loadingExact || settingLoading;

  const handleMerge = (group: DuplicateGroup) => {
    setSelectedGroup(group);
    setShowMergeDialog(true);
  };

  const toggleGroupSelection = (groupId: string) => {
    setSelectedGroupIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

  const selectAllGroups = (groups: DuplicateGroup[]) => {
    setSelectedGroupIds(new Set(groups.map(g => g.id)));
  };

  const clearSelection = () => {
    setSelectedGroupIds(new Set());
  };

  const getSelectedGroups = (): DuplicateGroup[] => {
    return potentialDuplicates.filter(g => selectedGroupIds.has(g.id));
  };

  const handleBulkDelete = async () => {
    const selectedGroups = getSelectedGroups();
    // Get all non-primary lead IDs from selected groups
    const leadIdsToDelete: string[] = [];
    selectedGroups.forEach(group => {
      group.leads.forEach((lead, index) => {
        // Keep the first lead (primary), delete the rest
        if (index > 0) {
          leadIdsToDelete.push(lead.id);
        }
      });
    });
    
    await deleteDuplicates.mutateAsync(leadIdsToDelete);
    setShowBulkDeleteDialog(false);
    clearSelection();
    refetchPotential();
    refetchExact();
  };

  const handleBulkMergeSuccess = () => {
    clearSelection();
    refetchPotential();
    refetchExact();
  };

  const getMatchTypeLabel = (type: string) => {
    switch (type) {
      case 'exact_email': return 'Email Match';
      case 'exact_phone': return 'Phone Match';
      case 'exact_both': return 'Email & Phone';
      case 'similar_name': return 'Similar Name';
      case 'name_program': return 'Name + Program';
      default: return type;
    }
  };

  const getMatchTypeBadgeVariant = (type: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (type) {
      case 'exact_email':
      case 'exact_phone':
      case 'exact_both':
        return 'destructive';
      case 'similar_name':
        return 'secondary';
      case 'name_program':
        return 'outline';
      default:
        return 'default';
    }
  };

  const hasSelection = selectedGroupIds.size > 0;

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8 max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin/leads')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Duplicate Contacts</h1>
            <p className="text-muted-foreground">Review and manage potential duplicate leads</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {hasSelection && (
            <>
              <Button variant="outline" size="sm" onClick={clearSelection}>
                Clear ({selectedGroupIds.size})
              </Button>
              <Button 
                variant="default" 
                size="sm"
                onClick={() => setShowBulkMergeDialog(true)}
              >
                <GitMerge className="h-4 w-4 mr-2" />
                Bulk Merge
              </Button>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => setShowBulkDeleteDialog(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Bulk Delete
              </Button>
            </>
          )}
          <Button variant="outline" onClick={() => navigate('/admin/setup/duplicate-prevention')}>
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Prevention Status */}
      {!settingLoading && (
        <Alert variant={setting ? "default" : "destructive"}>
          <Info className="h-4 w-4" />
          <AlertDescription>
            {setting ? (
              <>
                <strong>Duplicate Prevention Active:</strong> New leads with matching{' '}
                <Badge variant="outline" className="mx-1">
                  {setting === 'both' ? 'Email or Phone' : setting === 'email' ? 'Email' : 'Phone'}
                </Badge>
                will be blocked automatically.
              </>
            ) : (
              <>
                <strong>Duplicate Prevention Not Configured.</strong>{' '}
                <Button variant="link" className="p-0 h-auto" onClick={() => navigate('/admin/setup/duplicate-prevention')}>
                  Configure now
                </Button>{' '}
                to prevent future duplicates.
              </>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-destructive/10">
                <Users className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.isLoading ? '-' : stats.totalDuplicates}</p>
                <p className="text-sm text-muted-foreground">Total Duplicates</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.isLoading ? '-' : stats.exactMatches}</p>
                <p className="text-sm text-muted-foreground">Exact Matches</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-500/10">
                <Copy className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.isLoading ? '-' : stats.nearMatches}</p>
                <p className="text-sm text-muted-foreground">Near Matches</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <CheckCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.isLoading ? '-' : stats.totalGroups}</p>
                <p className="text-sm text-muted-foreground">Duplicate Groups</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Duplicate Groups */}
      <Tabs defaultValue="all" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All Duplicates ({potentialDuplicates.length})</TabsTrigger>
            <TabsTrigger value="exact">Exact Matches ({exactDuplicates.length})</TabsTrigger>
            <TabsTrigger value="similar">Similar Names</TabsTrigger>
          </TabsList>
          {potentialDuplicates.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => selectAllGroups(potentialDuplicates)}
            >
              Select All
            </Button>
          )}
        </div>

        <TabsContent value="all" className="space-y-4">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-40 w-full" />)}
            </div>
          ) : potentialDuplicates.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Duplicates Found</h3>
                <p className="text-muted-foreground">Your lead database is clean!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {potentialDuplicates.map(group => (
                <DuplicateGroupCard
                  key={group.id}
                  group={group}
                  onMerge={() => handleMerge(group)}
                  getMatchTypeLabel={getMatchTypeLabel}
                  getMatchTypeBadgeVariant={getMatchTypeBadgeVariant}
                  isSelected={selectedGroupIds.has(group.id)}
                  onSelectionChange={() => toggleGroupSelection(group.id)}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="exact" className="space-y-4">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2].map(i => <Skeleton key={i} className="h-40 w-full" />)}
            </div>
          ) : exactDuplicates.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Exact Duplicates</h3>
                <p className="text-muted-foreground">No leads with identical email or phone numbers found.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {exactDuplicates.map(group => (
                <DuplicateGroupCard
                  key={group.id}
                  group={group}
                  onMerge={() => handleMerge(group)}
                  getMatchTypeLabel={getMatchTypeLabel}
                  getMatchTypeBadgeVariant={getMatchTypeBadgeVariant}
                  isSelected={selectedGroupIds.has(group.id)}
                  onSelectionChange={() => toggleGroupSelection(group.id)}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="similar" className="space-y-4">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2].map(i => <Skeleton key={i} className="h-40 w-full" />)}
            </div>
          ) : (
            <>
              {potentialDuplicates
                .filter(g => g.matchType === 'similar_name' || g.matchType === 'name_program')
                .length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Similar Names Found</h3>
                    <p className="text-muted-foreground">No leads with similar names detected.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {potentialDuplicates
                    .filter(g => g.matchType === 'similar_name' || g.matchType === 'name_program')
                    .map(group => (
                      <DuplicateGroupCard
                        key={group.id}
                        group={group}
                        onMerge={() => handleMerge(group)}
                        getMatchTypeLabel={getMatchTypeLabel}
                        getMatchTypeBadgeVariant={getMatchTypeBadgeVariant}
                        isSelected={selectedGroupIds.has(group.id)}
                        onSelectionChange={() => toggleGroupSelection(group.id)}
                      />
                    ))}
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>

      {/* Merge Dialog */}
      {selectedGroup && (
        <MergeLeadsDialog
          open={showMergeDialog}
          onOpenChange={setShowMergeDialog}
          group={selectedGroup}
        />
      )}

      {/* Bulk Merge Dialog */}
      <BulkMergeDialog
        open={showBulkMergeDialog}
        onOpenChange={setShowBulkMergeDialog}
        groups={getSelectedGroups()}
        onSuccess={handleBulkMergeSuccess}
      />

      {/* Bulk Delete Confirmation */}
      <AlertDialog open={showBulkDeleteDialog} onOpenChange={setShowBulkDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Duplicate Leads?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete the non-primary leads from {selectedGroupIds.size} duplicate groups.
              The oldest lead in each group will be kept. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleBulkDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Duplicates
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
