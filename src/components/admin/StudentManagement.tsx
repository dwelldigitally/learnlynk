import React, { useState, useMemo } from "react";
import { useNavigate } from 'react-router-dom';
import { useConditionalStudents } from "@/hooks/useConditionalStudents";
import { useStudentsPaginated, useStudentMutations, StudentFilters, StudentService } from "@/services/studentService";
import { ConditionalDataWrapper } from "./ConditionalDataWrapper";
import { AddStudentModal } from "./modals/AddStudentModal";
import { ImportStudentsModal } from "./modals/ImportStudentsModal";
import { AdvancedFilters } from "./students/AdvancedFilters";
import { UnifiedStudentHeader, ColumnConfig } from "./students/UnifiedStudentHeader";
import { SmartStudentTable } from "./students/SmartStudentTable";
import { toast } from "sonner";

export default function StudentManagement() {
  const navigate = useNavigate();
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 50,
    sortBy: 'created_at',
    sortOrder: 'desc' as 'asc' | 'desc'
  });
  const [filters, setFilters] = useState<StudentFilters>({});
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [activeStage, setActiveStage] = useState<string>('all');
  const [tableColumns, setTableColumns] = useState<ColumnConfig[]>([
    { id: 'student_name', label: 'Student', visible: true, sortable: true },
    { id: 'email', label: 'Email', visible: true, sortable: true },
    { id: 'program', label: 'Program', visible: true, sortable: true },
    { id: 'stage', label: 'Stage', visible: true, sortable: true },
    { id: 'progress', label: 'Progress', visible: true, sortable: true },
    { id: 'risk_level', label: 'Risk', visible: true, sortable: true },
    { id: 'location', label: 'Location', visible: true, sortable: true },
  ]);

  // Use paginated query for better performance
  const {
    data: paginatedData,
    isLoading,
    refetch
  } = useStudentsPaginated(pagination, filters);
  const {
    data: legacyStudents = [],
    showEmptyState,
    hasDemoAccess,
    hasRealData
  } = useConditionalStudents();
  const {
    bulkDeleteStudents,
    bulkUpdateStudents
  } = useStudentMutations();

  // Determine data source: use demo data if available and no real data, otherwise use paginated data
  const students = hasDemoAccess && !hasRealData && legacyStudents.length > 0 ? legacyStudents : paginatedData?.data || [];
  const total = hasDemoAccess && !hasRealData && legacyStudents.length > 0 ? legacyStudents.length : paginatedData?.total || 0;
  
  const clearAllFilters = () => {
    setFilters({});
    setActiveStage('all');
    setPagination(prev => ({
      ...prev,
      page: 1
    }));
  };

  // Handle filter changes
  const handleFilterChange = (key: keyof StudentFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined
    }));
    setPagination(prev => ({
      ...prev,
      page: 1
    }));
  };

  // Handle advanced filter changes (for multi-select filters)
  const handleAdvancedFilterChange = (newFilters: StudentFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({
      ...prev,
      page: 1
    }));
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
    setPagination(prev => ({
      ...prev,
      page: 1
    }));
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

  // Handle search
  const handleSearch = (query: string) => {
    setFilters(prev => ({
      ...prev,
      search: query || undefined
    }));
    setPagination(prev => ({
      ...prev,
      page: 1
    }));
  };

  // Handle select all
  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedStudents(students.map((s: any) => s.id));
    } else {
      setSelectedStudents([]);
    }
  };

  // Handle individual selection
  const handleStudentSelect = (studentId: string) => {
    setSelectedStudents(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
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
      if (!student) return;
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
  const stageTrackerData = useMemo(() => [{
    key: 'LEAD_FORM',
    label: 'Lead Form',
    count: pipelineStats.leadForm,
    color: 'bg-blue-500'
  }, {
    key: 'SEND_DOCUMENTS',
    label: 'Documents',
    count: pipelineStats.documents,
    color: 'bg-yellow-500'
  }, {
    key: 'DOCUMENT_APPROVAL',
    label: 'Approval',
    count: pipelineStats.approval,
    color: 'bg-orange-500'
  }, {
    key: 'FEE_PAYMENT',
    label: 'Payment',
    count: pipelineStats.payment,
    color: 'bg-purple-500'
  }, {
    key: 'ACCEPTED',
    label: 'Accepted',
    count: pipelineStats.accepted,
    color: 'bg-green-500'
  }], [pipelineStats]);

  const bulkActions = [{
    label: 'Delete Selected',
    onClick: () => handleBulkDelete(),
    variant: 'destructive' as const
  }, {
    label: 'Move to Documents',
    onClick: () => handleBulkStageUpdate('SEND_DOCUMENTS')
  }, {
    label: 'Move to Approval',
    onClick: () => handleBulkStageUpdate('DOCUMENT_APPROVAL')
  }, {
    label: 'Send Message',
    onClick: () => toast.info('Bulk messaging coming soon')
  }];

  return (
    <div className="h-full flex flex-col bg-muted/30">
      {/* Modern Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm">
        <div className="px-6 py-6">
          <UnifiedStudentHeader
            stages={stageTrackerData}
            activeStage={activeStage}
            selectedStudentsCount={selectedStudents.length}
            filters={filters}
            onStageChange={handleStageChange}
            onFilterChange={handleAdvancedFilterChange}
            onClearFilters={clearAllFilters}
            onAddStudent={() => setAddModalOpen(true)}
            onImport={() => setImportModalOpen(true)}
            onExport={handleExport}
            onSearch={handleSearch}
            columns={tableColumns}
            onColumnsChange={setTableColumns}
          />
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
        {/* Main Content Area */}
        <div className="flex-1 p-6 space-y-6">
          {/* Advanced Filters */}
          {!showEmptyState && (
            <AdvancedFilters 
              filters={filters}
              onFilterChange={handleAdvancedFilterChange}
              onClearFilters={clearAllFilters}
            />
          )}

          {/* Students Table */}
          {!showEmptyState && (
            <SmartStudentTable
              students={students}
              loading={isLoading}
              selectedStudentIds={selectedStudents}
              onStudentSelect={handleStudentSelect}
              onSelectAll={handleSelectAll}
              onStudentClick={(student) => navigate(`/admin/students/detail/${student.id}`)}
              onBulkAction={(action, ids) => {
                console.log('Bulk action:', action, ids);
              }}
              onSort={(sortBy, sortOrder) => setPagination(prev => ({
                ...prev,
                sortBy,
                sortOrder
              }))}
              totalCount={total}
              currentPage={pagination.page}
              pageSize={pagination.pageSize}
              totalPages={paginatedData?.totalPages || 1}
              onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
              onPageSizeChange={(pageSize) => setPagination(prev => ({ ...prev, pageSize, page: 1 }))}
              columns={tableColumns}
              bulkActions={bulkActions}
            />
          )}
        </div>
      </ConditionalDataWrapper>

      {/* Modals */}
      <AddStudentModal open={addModalOpen} onOpenChange={setAddModalOpen} />
      <ImportStudentsModal open={importModalOpen} onOpenChange={setImportModalOpen} />
    </div>
  );
}
