import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Upload, Download, Filter, CheckCircle, XCircle, Eye, Clock, Star } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

interface DocumentHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCount: number;
  onBulkApprove: () => void;
  onBulkReject: () => void;
  onExport: () => void;
  stats: {
    total: number;
    pending: number;
    underReview: number;
    approved: number;
    rejected: number;
    highPriority: number;
  };
  children?: React.ReactNode;
}

export function DocumentHeader({
  searchQuery,
  onSearchChange,
  selectedCount,
  onBulkApprove,
  onBulkReject,
  onExport,
  stats,
  children
}: DocumentHeaderProps) {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Document Management</h1>
        <p className="text-muted-foreground mt-1">Review and manage student documents</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-card border rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Total</p>
            <Badge variant="outline" className="h-5 w-5 rounded-full p-0 flex items-center justify-center">
              {stats.total}
            </Badge>
          </div>
          <p className="text-2xl font-bold mt-2">{stats.total}</p>
        </div>

        <div className="bg-card border rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Pending</p>
            <Clock className="h-4 w-4 text-yellow-600" />
          </div>
          <p className="text-2xl font-bold mt-2">{stats.pending}</p>
        </div>

        <div className="bg-card border rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Under Review</p>
            <Eye className="h-4 w-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold mt-2">{stats.underReview}</p>
        </div>

        <div className="bg-card border rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Approved</p>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </div>
          <p className="text-2xl font-bold mt-2">{stats.approved}</p>
        </div>

        <div className="bg-card border rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Rejected</p>
            <XCircle className="h-4 w-4 text-red-600" />
          </div>
          <p className="text-2xl font-bold mt-2">{stats.rejected}</p>
        </div>

        <div className="bg-card border rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">High Priority</p>
            <Star className="h-4 w-4 text-orange-600" />
          </div>
          <p className="text-2xl font-bold mt-2">{stats.highPriority}</p>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by student name, ID, or document..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {selectedCount > 0 && (
            <>
              <Badge variant="secondary" className="px-3 py-1">
                {selectedCount} selected
              </Badge>
              <Button
                size="sm"
                variant="outline"
                onClick={onBulkApprove}
                className="gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                Approve
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={onBulkReject}
                className="gap-2"
              >
                <XCircle className="h-4 w-4" />
                Reject
              </Button>
            </>
          )}
          
          <Sheet>
            <SheetTrigger asChild>
              <Button size="sm" variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filter Documents</SheetTitle>
              </SheetHeader>
              {children}
            </SheetContent>
          </Sheet>

          <Button size="sm" variant="outline" onClick={onExport} className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
    </div>
  );
}
