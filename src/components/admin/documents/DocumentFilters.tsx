import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
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
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string) => void;
  onClearFilters: () => void;
}

export function DocumentFilters({ filters, onFilterChange, onClearFilters }: DocumentFiltersProps) {
  const hasActiveFilters = Object.values(filters).some(v => v !== 'all');

  return (
    <div className="space-y-6 py-4">
      {hasActiveFilters && (
        <Button
          variant="ghost"
          onClick={onClearFilters}
          className="w-full gap-2"
        >
          <X className="h-4 w-4" />
          Clear All Filters
        </Button>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={filters.status} onValueChange={(v) => onFilterChange('status', v)}>
            <SelectTrigger>
              <SelectValue />
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
          <Label>Program</Label>
          <Select value={filters.program} onValueChange={(v) => onFilterChange('program', v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Programs</SelectItem>
              <SelectItem value="Health Care Assistant">Health Care Assistant</SelectItem>
              <SelectItem value="Business Administration">Business Administration</SelectItem>
              <SelectItem value="Aviation Maintenance">Aviation Maintenance</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Campus</Label>
          <Select value={filters.campus} onValueChange={(v) => onFilterChange('campus', v)}>
            <SelectTrigger>
              <SelectValue />
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
          <Label>Student Type</Label>
          <Select value={filters.studentType} onValueChange={(v) => onFilterChange('studentType', v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="domestic">Domestic</SelectItem>
              <SelectItem value="international">International</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Priority</Label>
          <Select value={filters.priority} onValueChange={(v) => onFilterChange('priority', v)}>
            <SelectTrigger>
              <SelectValue />
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
          <Label>Reviewer</Label>
          <Select value={filters.reviewer} onValueChange={(v) => onFilterChange('reviewer', v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reviewers</SelectItem>
              <SelectItem value="Dr. Smith">Dr. Smith</SelectItem>
              <SelectItem value="Jane Doe">Jane Doe</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Intake</Label>
          <Select value={filters.intake} onValueChange={(v) => onFilterChange('intake', v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Intakes</SelectItem>
              <SelectItem value="April 2024">April 2024</SelectItem>
              <SelectItem value="June 2024">June 2024</SelectItem>
              <SelectItem value="September 2024">September 2024</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
