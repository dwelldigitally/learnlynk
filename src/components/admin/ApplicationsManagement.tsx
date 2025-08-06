import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, FileText, Clock, CheckCircle, XCircle, Eye, User, Database } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useConditionalApplications } from '@/hooks/useConditionalApplications';
import { EnhancedDataTable } from './EnhancedDataTable';
import { ApplicationQuickViewModal } from './modals/ApplicationQuickViewModal';
import { StudentApplication } from '@/types/application';
import { ConditionalDataWrapper } from './ConditionalDataWrapper';
import { ApplicationService } from '@/services/applicationService';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

export function ApplicationsManagement() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: applications, isLoading, showEmptyState, hasDemoAccess, hasRealData, refetch } = useConditionalApplications();
  const [selectedApplication, setSelectedApplication] = useState<StudentApplication | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isAddingDummies, setIsAddingDummies] = useState(false);

  const pageSize = 10;
  const filteredApplications = applications || [];
  const totalPages = Math.ceil(filteredApplications.length / pageSize);
  const paginatedData = filteredApplications.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'under-review': return 'bg-blue-100 text-blue-800';
      case 'pending-documents': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleQuickView = (application: StudentApplication) => {
    setSelectedApplication(application);
    setIsQuickViewOpen(true);
  };

  const handleAddDummyApplications = async () => {
    setIsAddingDummies(true);
    try {
      await ApplicationService.addDummyApplications();
      await refetch();
      toast({
        title: "Success",
        description: "5 dummy applications have been added to your database",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add dummy applications. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAddingDummies(false);
    }
  };

  const handleViewFullProfile = (studentId: string) => {
    setIsQuickViewOpen(false);
    navigate(`/admin/students/detail/${studentId}`);
  };

  const columns = [
    { 
      key: 'studentName', 
      label: 'Student Name', 
      sortable: true, 
      render: (value: string, row: StudentApplication) => (
        <button
          onClick={() => handleViewFullProfile(row.studentId)}
          className="text-left hover:text-primary hover:underline font-medium cursor-pointer"
        >
          {value}
        </button>
      )
    },
    { key: 'program', label: 'Program', sortable: true },
    { 
      key: 'applicationDate', 
      label: 'Application Date', 
      sortable: true,
      render: (value: Date) => format(value, 'MMM dd, yyyy')
    },
    { 
      key: 'status', 
      label: 'Status', 
      sortable: true,
      render: (value: string) => (
        <Badge className={getStatusColor(value)}>
          {value.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </Badge>
      )
    },
    { 
      key: 'priority', 
      label: 'Priority', 
      sortable: true,
      render: (value: string) => (
        <Badge className={getPriorityColor(value)}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </Badge>
      )
    },
    { 
      key: 'progress', 
      label: 'Progress', 
      sortable: true,
      render: (value: number) => `${value}%`
    },
    { key: 'advisorAssigned', label: 'Advisor', sortable: true },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row: StudentApplication) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleQuickView(row)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleViewFullProfile(row.studentId)}
          >
            <User className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  const stats = useMemo(() => {
    if (!applications || applications.length === 0) {
      return {
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0
      };
    }

    return {
      total: applications.length,
      pending: applications.filter(app => ['submitted', 'under-review', 'pending-documents'].includes(app.status)).length,
      approved: applications.filter(app => app.status === 'approved').length,
      rejected: applications.filter(app => app.status === 'rejected').length
    };
  }, [applications]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Applications Management</h1>
          <p className="text-muted-foreground">
            Monitor and manage student applications across all programs
          </p>
        </div>
        <div className="flex gap-2">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Application
          </Button>
          {!hasRealData && (
            <Button 
              variant="outline" 
              onClick={handleAddDummyApplications}
              disabled={isAddingDummies}
            >
              <Database className="h-4 w-4 mr-2" />
              {isAddingDummies ? 'Adding...' : 'Add Sample Data'}
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All applications</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approved}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0}% approval rate
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.rejected}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0 ? Math.round((stats.rejected / stats.total) * 100) : 0}% rejection rate
            </p>
          </CardContent>
        </Card>
      </div>

      <ConditionalDataWrapper
        isLoading={isLoading}
        showEmptyState={showEmptyState}
        hasDemoAccess={hasDemoAccess}
        hasRealData={hasRealData}
        emptyTitle="No Applications Found"
        emptyDescription="No student applications have been submitted yet."
      >
        <EnhancedDataTable
          title="Applications"
          data={paginatedData}
          columns={columns}
          totalCount={filteredApplications.length}
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          searchable={true}
          exportable={true}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onPageChange={setCurrentPage}
          onPageSizeChange={() => {}}
          onSearch={setSearchQuery}
          onSort={(column, order) => {
            setSortBy(column);
            setSortOrder(order);
          }}
          onFilter={() => {}}
        />
      </ConditionalDataWrapper>

      <ApplicationQuickViewModal
        application={selectedApplication}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
        onViewFullProfile={handleViewFullProfile}
      />
    </div>
  );
}