import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, User, FileText, DollarSign, Clock, Plus, Search, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ApplicantService } from "@/services/applicantService";
import { Applicant, ApplicantSearchFilters } from "@/types/applicant";
import { RefinedLeadTable } from "./RefinedLeadTable";
import { ConditionalDataWrapper } from "./ConditionalDataWrapper";
import { Link, useNavigate } from "react-router-dom";
export const ApplicantManagement = () => {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ApplicantSearchFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize, setPageSize] = useState(50);
  const { toast } = useToast();
  const navigate = useNavigate();

  const totalPages = Math.ceil(totalCount / pageSize);

  useEffect(() => {
    loadApplicants();
  }, [currentPage, pageSize, filters]);

  const loadApplicants = async () => {
    try {
      setLoading(true);
      const { applicants: data, total } = await ApplicantService.getApplicants(
        filters,
        currentPage,
        pageSize
      );
      setApplicants(data);
      setTotalCount(total);
    } catch (error) {
      console.error('Error loading applicants:', error);
      toast({
        title: "Error",
        description: "Failed to load applicants",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getSubstageBadgeVariant = (substage: string) => {
    switch (substage) {
      case 'application_started': return 'outline';
      case 'documents_submitted': return 'secondary';
      case 'under_review': return 'default';
      case 'decision_pending': return 'destructive';
      case 'approved': return 'default';
      case 'rejected': return 'secondary';
      default: return 'outline';
    }
  };

  const getDecisionBadgeVariant = (decision?: string) => {
    switch (decision) {
      case 'approved': return 'default';
      case 'rejected': return 'destructive';
      case 'waitlisted': return 'secondary';
      default: return 'outline';
    }
  };

  const getPaymentStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'partial': return 'secondary';
      case 'pending': return 'outline';
      case 'refunded': return 'destructive';
      default: return 'outline';
    }
  };

  const handleApprove = async (applicantId: string) => {
    try {
      await ApplicantService.approveApplicant(applicantId, 'Approved via admin panel');
      toast({
        title: "Success",
        description: "Applicant approved and moved to student stage",
      });
      loadApplicants();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve applicant",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (applicantId: string) => {
    try {
      await ApplicantService.rejectApplicant(applicantId, 'Rejected via admin panel');
      toast({
        title: "Success",
        description: "Applicant rejected",
      });
      loadApplicants();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject applicant",
        variant: "destructive",
      });
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (item: any) => {
        if (!item) return null;
        return (
          <div>
            <Link to={`/admin/applicants/detail/${item.id}`} className="font-medium hover:underline">
              {item.master_records?.first_name} {item.master_records?.last_name}
            </Link>
            <div className="text-sm text-muted-foreground">{item.master_records?.email}</div>
          </div>
        );
      }
    },
    {
      key: 'program',
      label: 'Program',
      sortable: true
    },
    {
      key: 'substage',
      label: 'Stage',
      render: (item: Applicant) => {
        if (!item) return null;
        const stage = (item.substage || 'application_started') as string;
        return (
          <Badge variant={getSubstageBadgeVariant(stage)}>
            {stage.replace('_', ' ').toUpperCase()}
          </Badge>
        );
      }
    },
    {
      key: 'application_type',
      label: 'Type',
      render: (item: Applicant) => {
        if (!item) return null;
        const type = (item.application_type || 'direct_enrollment') as string;
        return (
          <Badge variant="outline">
            {type.replace('_', ' ').toUpperCase()}
          </Badge>
        );
      }
    },
    {
      key: 'decision',
      label: 'Decision',
      render: (item: Applicant) => {
        if (!item) return null;
        return item.decision ? (
          <Badge variant={getDecisionBadgeVariant(item.decision)}>
            {item.decision.toUpperCase()}
          </Badge>
        ) : (
          <Badge variant="outline">PENDING</Badge>
        );
      }
    },
    {
      key: 'payment_status',
      label: 'Payment',
      render: (item: Applicant) => {
        if (!item) return null;
        const pay = (item.payment_status || 'pending') as string;
        return (
          <Badge variant={getPaymentStatusBadgeVariant(pay)}>
            {pay.toUpperCase()}
          </Badge>
        );
      }
    },
    {
      key: 'created_at',
      label: 'Applied',
      sortable: true,
      render: (item: Applicant) => {
        if (!item) return null;
        return new Date(item.created_at).toLocaleDateString();
      }
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (item: Applicant) => {
        if (!item) return null;
        return (
          <div className="flex space-x-2">
            <Link to={`/admin/applicants/detail/${item.id}`}>
              <Button size="sm" variant="ghost" className="h-8">View</Button>
            </Link>
            {item.decision === 'pending' && (
              <>
                <Button
                  size="sm"
                  onClick={() => handleApprove(item.id)}
                  className="h-8"
                >
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleReject(item.id)}
                  className="h-8"
                >
                  Reject
                </Button>
              </>
            )}
          </div>
        );
      }
    }
  ];

  const stageStats = useMemo(() => {
    const stats: Record<string, number> = {};
    applicants.forEach(applicant => {
      stats[applicant.substage] = (stats[applicant.substage] || 0) + 1;
    });
    return [
      { key: 'all', label: 'All Applications', count: applicants.length, color: 'bg-blue-500' },
      { key: 'application_started', label: 'Started', count: stats.application_started || 0, color: 'bg-yellow-500' },
      { key: 'documents_submitted', label: 'Documents Submitted', count: stats.documents_submitted || 0, color: 'bg-orange-500' },
      { key: 'under_review', label: 'Under Review', count: stats.under_review || 0, color: 'bg-purple-500' },
      { key: 'decision_pending', label: 'Decision Pending', count: stats.decision_pending || 0, color: 'bg-red-500' },
      { key: 'approved', label: 'Approved', count: stats.approved || 0, color: 'bg-green-500' },
    ];
  }, [applicants]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Applicant Management</h2>
          <p className="text-muted-foreground">
            Manage applications and admission decisions
          </p>
        </div>
        <Button onClick={async () => {
          try {
            const created = await ApplicantService.createSampleApplicant();
            toast({ title: "Sample applicant created", description: `${created.master_records?.first_name || 'Sample'} ${created.master_records?.last_name || ''}`.trim() });
            navigate(`/admin/applicants/detail/${created.id}`);
          } catch (e) {
            toast({ title: "Error", description: "Failed to create sample applicant", variant: "destructive" });
          }
        }}>
          <Plus className="w-4 h-4 mr-2" />
          Add Applicant
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stageStats.map((stat) => (
          <Card key={stat.key} className="relative overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.count}</p>
                </div>
                <div className={`w-3 h-3 rounded-full ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search applicants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select
              value={filters.substage?.[0] || 'all'}
              onValueChange={(value) =>
                setFilters({ ...filters, substage: value === 'all' ? undefined : [value as any] })
              }
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                <SelectItem value="application_started">Application Started</SelectItem>
                <SelectItem value="documents_submitted">Documents Submitted</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="decision_pending">Decision Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Applicants Table */}
      <ConditionalDataWrapper
        isLoading={loading}
        showEmptyState={applicants.length === 0 && !loading}
        hasDemoAccess={false}
        hasRealData={applicants.length > 0}
        emptyTitle="No applicants found"
        emptyDescription="No applicants match your current filters."
      >
        <RefinedLeadTable
          title="Applicants"
          data={applicants}
          columns={columns}
          loading={loading}
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalCount={totalCount}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          onSearch={(term) => setSearchTerm(term)}
          onSort={() => {}}
          onFilter={() => {}}
        />
      </ConditionalDataWrapper>
    </div>
  );
};