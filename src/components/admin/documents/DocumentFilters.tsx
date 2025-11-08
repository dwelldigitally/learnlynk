import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { X } from 'lucide-react';

interface FilterState {
  program: string;
  campus: string;
  intake: string;
  status: string;
  studentType: string;
  priority: string;
  reviewer: string;
}

interface DocumentFiltersProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string) => void;
  onReset: () => void;
}

export const DocumentFilters: React.FC<DocumentFiltersProps> = ({
  open,
  onOpenChange,
  filters,
  onFilterChange,
  onReset
}) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filter Documents</SheetTitle>
          <SheetDescription>
            Apply filters to refine your document search
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 mt-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <Select 
              value={filters.status} 
              onValueChange={(value) => onFilterChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="under-review">Under Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Program</label>
            <Select 
              value={filters.program} 
              onValueChange={(value) => onFilterChange('program', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Programs" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Programs</SelectItem>
                <SelectItem value="Health Care Assistant">Health Care Assistant</SelectItem>
                <SelectItem value="Education Assistant">Education Assistant</SelectItem>
                <SelectItem value="Aviation">Aviation</SelectItem>
                <SelectItem value="Hospitality">Hospitality</SelectItem>
                <SelectItem value="ECE">ECE</SelectItem>
                <SelectItem value="MLA">MLA</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Campus</label>
            <Select 
              value={filters.campus} 
              onValueChange={(value) => onFilterChange('campus', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Campuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Campuses</SelectItem>
                <SelectItem value="Main Campus">Main Campus</SelectItem>
                <SelectItem value="Downtown Campus">Downtown Campus</SelectItem>
                <SelectItem value="Technical Campus">Technical Campus</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Student Type</label>
            <Select 
              value={filters.studentType} 
              onValueChange={(value) => onFilterChange('studentType', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="domestic">Domestic</SelectItem>
                <SelectItem value="international">International</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Priority</label>
            <Select 
              value={filters.priority} 
              onValueChange={(value) => onFilterChange('priority', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Priorities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Reviewer</label>
            <Select 
              value={filters.reviewer} 
              onValueChange={(value) => onFilterChange('reviewer', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Reviewers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Reviewers</SelectItem>
                <SelectItem value="Dr. Smith">Dr. Smith</SelectItem>
                <SelectItem value="Jane Doe">Jane Doe</SelectItem>
                <SelectItem value="unassigned">Unassigned</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="pt-4 space-y-2">
            <Button onClick={onReset} variant="outline" className="w-full">
              <X className="h-4 w-4 mr-2" />
              Reset Filters
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
