import React, { useState, useMemo } from "react";
import { useNavigate } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Search, Filter, Download, MessageSquare, Mail, AlertTriangle, Clock, CheckCircle2, Users, Plus, Upload, Eye, Phone, Edit } from "lucide-react";
import { useConditionalStudents } from "@/hooks/useConditionalStudents";
import { useStudentsPaginated, useStudentMutations, StudentFilters, StudentService } from "@/services/studentService";
import { ConditionalDataWrapper } from "./ConditionalDataWrapper";
import { EnhancedDataTable } from "./EnhancedDataTable";
import { AddStudentModal } from "./modals/AddStudentModal";
import { ImportStudentsModal } from "./modals/ImportStudentsModal";
import { StageTracker } from "./students/StageTracker";
import { StageFilters } from "./students/StageFilters";
import { AISidebar } from "./students/AISidebar";
import { toast } from "sonner";

export default function StudentManagement() {
  const navigate = useNavigate();
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 25,
    sortBy: 'created_at',
    sortOrder: 'desc' as 'asc' | 'desc'
  });
  
  const [filters, setFilters] = useState<StudentFilters>({});
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [activeStage, setActiveStage] = useState<string>('all');

  // Use paginated query for better performance
  const { data: paginatedData, isLoading, refetch } = useStudentsPaginated(pagination, filters);
  const { data: legacyStudents = [], showEmptyState, hasDemoAccess, hasRealData } = useConditionalStudents();
  
  const { bulkDeleteStudents, bulkUpdateStudents } = useStudentMutations();

  // Determine data source: use demo data if available and no real data, otherwise use paginated data
  const students = (hasDemoAccess && !hasRealData && legacyStudents.length > 0) 
    ? legacyStudents 
    : (paginatedData?.data || []);
  const total = (hasDemoAccess && !hasRealData && legacyStudents.length > 0) 
    ? legacyStudents.length 
    : (paginatedData?.total || 0);

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'LEAD_FORM': return 'outline';
      case 'SEND_DOCUMENTS': return 'secondary';
      case 'DOCUMENT_APPROVAL': return 'default';
      case 'FEE_PAYMENT': return 'default';
      case 'ACCEPTED': return 'secondary';
      default: return 'outline';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  const clearAllFilters = () => {
    setFilters({});
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  // Handle filter changes
  const handleFilterChange = (key: keyof StudentFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined
    }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Handle stage change
  const handleStageChange = (stage: string) => {
    setActiveStage(stage);
    if (stage === 'all') {
      const { stage: _, ...filtersWithoutStage } = filters;
      setFilters(filtersWithoutStage);
    } else {
      setFilters(prev => ({ ...prev, stage }));
    }
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Handle bulk actions
  const handleBulkDelete = async () => {
    if (selectedStudents.length === 0) return;
    
    try {
      await bulkDeleteStudents.mutateAsync(selectedStudents);
      toast.success(`Deleted ${selectedStudents.length} students`);
      setSelectedStudents([]);
      refetch();
    } catch (error) {
      toast.error('Failed to delete students');
    }
  };

  const handleBulkStageUpdate = async (newStage: string) => {
    if (selectedStudents.length === 0) return;
    
    try {
      await bulkUpdateStudents.mutateAsync({
        ids: selectedStudents,
        updates: { stage: newStage }
      });
      toast.success(`Updated ${selectedStudents.length} students`);
      setSelectedStudents([]);
      refetch();
    } catch (error) {
      toast.error('Failed to update students');
    }
  };

  // Handle export
  const handleExport = async () => {
    try {
      const exportData = await StudentService.exportStudents(filters);
      const csv = [
        Object.keys(exportData[0]).join(','),
        ...exportData.map(row => Object.values(row).join(','))
      ].join('\n');
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `students-export-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      
      toast.success('Students exported successfully');
    } catch (error) {
      toast.error('Failed to export students');
    }
  };

  // Handle AI bulk actions
  const handleAIBulkAction = async (actionId: string, studentIds: string[]) => {
    // Simulate AI action processing
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`AI Action: ${actionId} for students:`, studentIds);
        resolve(true);
      }, 1000);
    });
  };

  // Calculate pipeline stats from all data for overview
  const pipelineStats = useMemo(() => {
    const allStudents = legacyStudents.length > 0 ? legacyStudents : students;
    const stats = {
      total: total || allStudents.length,
      leadForm: 0,
      documents: 0,
      approval: 0,
      payment: 0,
      accepted: 0
    };

    allStudents.forEach((student: any) => {
      if (!student) return; // Add null check
      switch (student.stage) {
        case 'LEAD_FORM':
          stats.leadForm++;
          break;
        case 'SEND_DOCUMENTS':
          stats.documents++;
          break;
        case 'DOCUMENT_APPROVAL':
          stats.approval++;
          break;
        case 'FEE_PAYMENT':
          stats.payment++;
          break;
        case 'ACCEPTED':
          stats.accepted++;
          break;
      }
    });

    return stats;
  }, [students, legacyStudents, total]);

  // Stage tracker data
  const stageTrackerData = useMemo(() => [
    { key: 'LEAD_FORM', label: 'Lead Form', count: pipelineStats.leadForm, color: 'bg-blue-500' },
    { key: 'SEND_DOCUMENTS', label: 'Documents', count: pipelineStats.documents, color: 'bg-yellow-500' },
    { key: 'DOCUMENT_APPROVAL', label: 'Approval', count: pipelineStats.approval, color: 'bg-orange-500' },
    { key: 'FEE_PAYMENT', label: 'Payment', count: pipelineStats.payment, color: 'bg-purple-500' },
    { key: 'ACCEPTED', label: 'Accepted', count: pipelineStats.accepted, color: 'bg-green-500' }
  ], [pipelineStats]);

  // Define columns for EnhancedDataTable
  const studentColumns = [
    {
      key: 'first_name' as const,
      label: 'Student',
      sortable: true,
      renderType: 'custom' as const,
      render: (value: any, student: any) => {
        if (!student) return <div>Loading...</div>;
        
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">
                {student.first_name?.[0] || 'N'}{student.last_name?.[0] || 'A'}
              </AvatarFallback>
            </Avatar>
            <div>
              <div 
                className="font-medium text-sm cursor-pointer text-primary hover:underline"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/admin/students/detail/${student.id}`);
                }}
              >
                {student.first_name || 'N/A'} {student.last_name || ''}
              </div>
              <div className="text-xs text-muted-foreground">{student.email || 'No email'}</div>
              <div className="text-xs text-muted-foreground">ID: {student.student_id || 'N/A'}</div>
            </div>
          </div>
        );
      }
    },
    {
      key: 'program' as const,
      label: 'Program',
      sortable: true
    },
    {
      key: 'stage' as const,
      label: 'Stage',
      sortable: true,
      renderType: 'custom' as const,
      render: (value: any, student: any) => {
        if (!student) return <div>Loading...</div>;
        return (
          <Badge variant={getStageColor(student.stage || '')}>
            {student.stage?.replace('_', ' ') || 'N/A'}
          </Badge>
        );
      }
    },
    {
      key: 'progress' as const,
      label: 'Progress',
      sortable: true,
      renderType: 'custom' as const,
      render: (value: any, student: any) => {
        if (!student) return <div>Loading...</div>;
        const progress = student.progress || 0;
        return (
          <div className="w-full">
            <div className="flex justify-between text-xs mb-1">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        );
      }
    },
    {
      key: 'risk_level' as const,
      label: 'Risk',
      sortable: true,
      renderType: 'custom' as const,
      render: (value: any, student: any) => {
        if (!student) return <div>Loading...</div>;
        return (
          <Badge variant={getRiskColor(student.risk_level || '')}>
            {student.risk_level || 'N/A'}
          </Badge>
        );
      }
    },
    {
      key: 'country' as const,
      label: 'Location',
      sortable: true,
      renderType: 'custom' as const,
      render: (value: any, student: any) => {
        if (!student) return <div>Loading...</div>;
        return (
          <div className="text-sm">
            <div>{student.city || 'N/A'}</div>
            <div className="text-muted-foreground text-xs">{student.country || 'N/A'}</div>
          </div>
        );
      }
    },
    {
      key: 'actions' as const,
      label: 'Actions',
      sortable: false,
      renderType: 'custom' as const,
      render: (value: any, student: any) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigate(`/admin/students/detail/${student.id}`)}>
              <Eye className="h-4 w-4 mr-2" />
              View Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Mail className="h-4 w-4 mr-2" />
              Send Email
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Phone className="h-4 w-4 mr-2" />
              Call Student
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Edit className="h-4 w-4 mr-2" />
              Edit Details
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  ];

  const filterOptions = [
    {
      key: 'stage' as const,
      label: 'Stage',
      options: [
        { value: 'LEAD_FORM', label: 'Lead Form' },
        { value: 'SEND_DOCUMENTS', label: 'Send Documents' },
        { value: 'DOCUMENT_APPROVAL', label: 'Document Approval' },
        { value: 'FEE_PAYMENT', label: 'Fee Payment' },
        { value: 'ACCEPTED', label: 'Accepted' }
      ]
    },
    {
      key: 'risk_level' as const,
      label: 'Risk Level',
      options: [
        { value: 'low', label: 'Low' },
        { value: 'medium', label: 'Medium' },
        { value: 'high', label: 'High' }
      ]
    }
  ];

  const bulkActions = [
    {
      label: 'Delete Selected',
      onClick: () => handleBulkDelete(),
      variant: 'destructive' as const
    },
    {
      label: 'Move to Documents',
      onClick: () => handleBulkStageUpdate('SEND_DOCUMENTS')
    },
    {
      label: 'Move to Approval',
      onClick: () => handleBulkStageUpdate('DOCUMENT_APPROVAL')
    },
    {
      label: 'Send Message',
      onClick: () => toast.info('Bulk messaging coming soon')
    }
  ];

  return (
    <div className="p-6 space-y-4">
      {/* Header with buttons */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Student Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage and track student applications through their admission journey
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={() => setImportModalOpen(true)}>
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <AISidebar
            activeStage={activeStage}
            selectedStudents={selectedStudents}
            totalStudents={total}
            onBulkAction={handleAIBulkAction}
          />
          <Button size="sm" onClick={() => setAddModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Student
          </Button>
        </div>
      </div>

      <ConditionalDataWrapper 
        isLoading={isLoading} 
        showEmptyState={showEmptyState}
        hasDemoAccess={hasDemoAccess || false}
        hasRealData={hasRealData || false}
        emptyTitle="No Students Yet"
        emptyDescription="Start by adding your first student or importing student data to begin managing applications."
      >
        {/* Compact Stage Tracker and Filters */}
        {!showEmptyState && (
          <div className="space-y-3">
            <StageTracker 
              stages={stageTrackerData}
              activeStage={activeStage}
              onStageChange={handleStageChange}
            />
            
            <StageFilters
              activeStage={activeStage}
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={clearAllFilters}
            />
          </div>
        )}

        {/* Full Width Data Table */}
        {!showEmptyState && (
          <div className="bg-card border rounded-lg">
            <div className="p-4 border-b">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold">Students ({total})</h2>
                  <p className="text-sm text-muted-foreground">
                    Manage student applications and track progress
                  </p>
                </div>
              </div>
            </div>
            <div className="p-0">
              <EnhancedDataTable
                title=""
                columns={studentColumns}
                data={students}
                totalCount={total}
                currentPage={pagination.page}
                totalPages={paginatedData?.totalPages || 1}
                pageSize={pagination.pageSize}
                loading={isLoading}
                searchable={true}
                filterable={true}
                exportable={false}
                selectable={true}
                sortBy={pagination.sortBy}
                sortOrder={pagination.sortOrder}
                filterOptions={filterOptions}
                bulkActions={bulkActions}
                selectedIds={selectedStudents}
                onSelectionChange={setSelectedStudents}
                onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
                onPageSizeChange={(pageSize) => setPagination(prev => ({ ...prev, pageSize, page: 1 }))}
                onSort={(sortBy, sortOrder) => setPagination(prev => ({ ...prev, sortBy, sortOrder }))}
                onSearch={(search) => handleFilterChange('search', search)}
                onFilter={(filters) => {
                  Object.entries(filters).forEach(([key, value]) => {
                    handleFilterChange(key as keyof StudentFilters, value as string);
                  });
                }}
                onRowClick={(student) => navigate(`/admin/students/${student.id}`)}
              />
            </div>
          </div>
        )}
      </ConditionalDataWrapper>

      <AddStudentModal 
        open={addModalOpen} 
        onOpenChange={setAddModalOpen}
      />
      
      <ImportStudentsModal 
        open={importModalOpen} 
        onOpenChange={setImportModalOpen}
      />
    </div>
  );
}