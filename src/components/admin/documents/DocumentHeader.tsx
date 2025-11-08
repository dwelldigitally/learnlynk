import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Upload, 
  Settings, 
  Download,
  Filter
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DocumentHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedCount: number;
  onBulkAction?: (action: string) => void;
  onShowFilters?: () => void;
}

export const DocumentHeader: React.FC<DocumentHeaderProps> = ({
  searchQuery,
  onSearchChange,
  selectedCount,
  onBulkAction,
  onShowFilters
}) => {
  return (
    <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b sticky top-0 z-10">
      <div className="flex flex-col gap-4 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Documents</h1>
            <p className="text-sm text-muted-foreground">
              Review and manage student documents
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Upload Documents
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search documents, students, or IDs..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>

          <Button variant="outline" size="sm" onClick={onShowFilters}>
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>

          {selectedCount > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="default" size="sm">
                  Bulk Actions ({selectedCount})
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onBulkAction?.('approve')}>
                  Approve Selected
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onBulkAction?.('reject')}>
                  Reject Selected
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onBulkAction?.('download')}>
                  Download Selected
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onBulkAction?.('assign')}>
                  Assign Reviewer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Column Settings</DropdownMenuItem>
              <DropdownMenuItem>Export Data</DropdownMenuItem>
              <DropdownMenuItem>Document Standards</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};
