import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  ChevronLeft, 
  ChevronRight,
  Download,
  Settings,
  Eye,
  EyeOff,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Loader2,
  X,
  ChevronDown,
  Users,
  Calendar,
  TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/hooks/useDebounce';

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  visible?: boolean;
  type?: 'text' | 'number' | 'date' | 'badge' | 'custom';
  render?: (value: any, row: any) => React.ReactNode;
}

interface FilterOption {
  key: string;
  label: string;
  options: Array<{ value: string; label: string }>;
}

interface RefinedLeadTableProps {
  title: string;
  columns: Column[];
  data: any[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  loading?: boolean;
  searchable?: boolean;
  filterable?: boolean;
  exportable?: boolean;
  selectable?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filterOptions?: FilterOption[];
  quickFilters?: Array<{ label: string; filter: any }>;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onSearch: (query: string) => void;
  onSort: (column: string, order: 'asc' | 'desc') => void;
  onFilter: (filters: Record<string, any>) => void;
  onExport?: () => void;
  onRowClick?: (row: any) => void;
  onSelectionChange?: (selectedIds: string[]) => void;
  selectedIds?: string[];
  bulkActions?: Array<{ label: string; onClick: (selectedIds: string[]) => void; variant?: 'default' | 'destructive' }>;
  className?: string;
}

const PAGE_SIZE_OPTIONS = [25, 50, 100];

export const RefinedLeadTable: React.FC<RefinedLeadTableProps> = ({
  title,
  columns: initialColumns,
  data,
  totalCount,
  currentPage,
  totalPages,
  pageSize,
  loading = false,
  searchable = true,
  filterable = true,
  exportable = true,
  selectable = false,
  sortBy,
  sortOrder,
  filterOptions = [],
  quickFilters = [],
  onPageChange,
  onPageSizeChange,
  onSearch,
  onSort,
  onFilter,
  onExport,
  onRowClick,
  onSelectionChange,
  selectedIds = [],
  bulkActions = [],
  className
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({});
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
  const [showFilters, setShowFilters] = useState(false);
  
  const debouncedSearch = useDebounce(searchQuery, 300);

  const columns = useMemo(() => {
    return initialColumns.map(col => ({
      ...col,
      visible: visibleColumns[col.key] !== false
    }));
  }, [initialColumns, visibleColumns]);

  useEffect(() => {
    onSearch(debouncedSearch);
  }, [debouncedSearch, onSearch]);

  const handleSort = (columnKey: string) => {
    const column = columns.find(col => col.key === columnKey);
    if (!column?.sortable) return;

    let newOrder: 'asc' | 'desc' = 'asc';
    if (sortBy === columnKey && sortOrder === 'asc') {
      newOrder = 'desc';
    }
    
    onSort(columnKey, newOrder);
  };

  const handleSelectAll = useCallback((checked: boolean) => {
    if (checked) {
      const allIds = data.map(row => row.id);
      onSelectionChange?.(allIds);
    } else {
      onSelectionChange?.([]);
    }
  }, [data, onSelectionChange]);

  const handleRowSelect = useCallback((rowId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange?.([...selectedIds, rowId]);
    } else {
      onSelectionChange?.(selectedIds.filter(id => id !== rowId));
    }
  }, [selectedIds, onSelectionChange]);

  const toggleColumnVisibility = (columnKey: string) => {
    setVisibleColumns(prev => ({
      ...prev,
      [columnKey]: !prev[columnKey]
    }));
  };

  const handleFilterChange = (filterKey: string, value: any) => {
    const newFilters = { ...activeFilters };
    if (value === null || value === undefined || value === '' || value === 'all') {
      delete newFilters[filterKey];
    } else {
      newFilters[filterKey] = value;
    }
    setActiveFilters(newFilters);
    onFilter(newFilters);
  };

  const clearFilters = () => {
    setActiveFilters({});
    onFilter({});
  };

  const renderCellContent = (column: Column, value: any, row: any) => {
    if (column.render) {
      return column.render(value, row);
    }

    switch (column.type) {
      case 'badge':
        return (
          <Badge variant="outline" className="text-xs font-medium">
            {value}
          </Badge>
        );
      case 'date':
        return (
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            {new Date(value).toLocaleDateString()}
          </div>
        );
      case 'number':
        return (
          <div className="flex items-center gap-2 text-sm font-medium">
            <TrendingUp className="h-3 w-3 text-muted-foreground" />
            {typeof value === 'number' ? value.toLocaleString() : value}
          </div>
        );
      default:
        return <span className="text-sm">{value}</span>;
    }
  };

  const getSortIcon = (columnKey: string) => {
    if (sortBy !== columnKey) {
      return <ArrowUpDown className="h-3 w-3 opacity-40" />;
    }
    return sortOrder === 'asc' 
      ? <ArrowUp className="h-3 w-3 text-primary" />
      : <ArrowDown className="h-3 w-3 text-primary" />;
  };

  const visibleColumnsArray = columns.filter(col => col.visible);
  const isAllSelected = data.length > 0 && selectedIds.length === data.length;
  const isPartiallySelected = selectedIds.length > 0 && selectedIds.length < data.length;

  const renderPaginationNumbers = () => {
    const maxVisiblePages = 5;
    const pages = [];
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  return (
    <div className={cn("w-full space-y-4", className)}>
      {/* Modern Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
            <Badge variant="outline" className="text-xs">
              {totalCount.toLocaleString()}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Manage and track your leads efficiently
          </p>
        </div>
        
        {/* Action Bar */}
        <div className="flex items-center gap-2">
          {selectable && selectedIds.length > 0 && (
            <div className="flex items-center gap-2 mr-3 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-lg">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                {selectedIds.length} selected
              </span>
              {bulkActions.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant === 'destructive' ? 'destructive' : 'outline'}
                  size="sm"
                  onClick={() => action.onClick(selectedIds)}
                  className="h-7"
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <Settings className="h-4 w-4 mr-2" />
                View
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                Toggle Columns
              </div>
              <DropdownMenuSeparator />
              {initialColumns.map((column) => (
                <DropdownMenuItem
                  key={column.key}
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => toggleColumnVisibility(column.key)}
                >
                  {visibleColumns[column.key] !== false ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4 opacity-50" />
                  )}
                  <span className={cn(
                    "text-sm",
                    visibleColumns[column.key] === false && "opacity-50"
                  )}>
                    {column.label}
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {exportable && (
            <Button variant="outline" size="sm" onClick={onExport} className="h-9">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          )}
        </div>
      </div>

      {/* Enhanced Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        {searchable && (
          <div className="relative flex-1 min-w-[280px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search leads by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 bg-background border-border"
            />
          </div>
        )}

        <div className="flex items-center gap-2 flex-wrap">
          {/* Quick Filters */}
          {quickFilters.map((quickFilter, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => onFilter(quickFilter.filter)}
              className="h-10 text-xs"
            >
              {quickFilter.label}
            </Button>
          ))}

          {filterable && filterOptions.length > 0 && (
            <Button
              variant={showFilters ? "default" : "outline"}
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="h-10"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {Object.keys(activeFilters).length > 0 && (
                <Badge variant="secondary" className="ml-2 h-4 px-1.5 text-xs">
                  {Object.keys(activeFilters).length}
                </Badge>
              )}
            </Button>
          )}

          <Select value={pageSize.toString()} onValueChange={(value) => onPageSizeChange(Number(value))}>
            <SelectTrigger className="w-20 h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZE_OPTIONS.map(size => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showFilters && filterOptions.length > 0 && (
        <Card className="border-dashed">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {filterOptions.map((filter) => (
                <div key={filter.key} className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {filter.label}
                  </label>
                  <Select
                    value={activeFilters[filter.key] || 'all'}
                    onValueChange={(value) => handleFilterChange(filter.key, value)}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      {filter.options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
            {Object.keys(activeFilters).length > 0 && (
              <div className="flex justify-end mt-4">
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-2" />
                  Clear all filters
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Modern Table */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Loading leads...</p>
              </div>
            </div>
          ) : data.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  <Users className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-medium">No leads found</h3>
                  <p className="text-sm text-muted-foreground">
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/50">
                      {selectable && (
                        <th className="px-6 py-4 w-12">
                          <Checkbox
                            checked={isAllSelected || isPartiallySelected}
                            onCheckedChange={handleSelectAll}
                          />
                        </th>
                      )}
                      {visibleColumnsArray.map((column) => (
                        <th
                          key={column.key}
                          className={cn(
                            "px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider",
                            column.sortable && "cursor-pointer hover:text-foreground select-none",
                            column.width && `w-${column.width}`
                          )}
                          onClick={() => column.sortable && handleSort(column.key)}
                        >
                          <div className="flex items-center gap-2">
                            {column.label}
                            {column.sortable && (
                              <div className="transition-colors">
                                {getSortIcon(column.key)}
                              </div>
                            )}
                          </div>
                        </th>
                      ))}
                      <th className="px-6 py-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider w-16">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {data.map((row, index) => (
                      <tr
                        key={row.id || index}
                        className={cn(
                          "group hover:bg-muted/30 transition-all duration-150",
                          onRowClick && "cursor-pointer",
                          selectedIds.includes(row.id) && "bg-primary/5 hover:bg-primary/10"
                        )}
                        onClick={() => onRowClick?.(row)}
                      >
                        {selectable && (
                          <td className="px-6 py-4">
                            <Checkbox
                              checked={selectedIds.includes(row.id)}
                              onCheckedChange={(checked) => handleRowSelect(row.id, checked as boolean)}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </td>
                        )}
                        {visibleColumnsArray.map((column) => (
                          <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                            {renderCellContent(column, row[column.key], row)}
                          </td>
                        ))}
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Enhanced Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            Showing <span className="font-medium">{((currentPage - 1) * pageSize) + 1}</span> to{' '}
            <span className="font-medium">{Math.min(currentPage * pageSize, totalCount)}</span> of{' '}
            <span className="font-medium">{totalCount.toLocaleString()}</span> results
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
              className="h-9 w-9 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center gap-1">
              {renderPaginationNumbers().map((page) => (
                <Button
                  key={page}
                  variant={page === currentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(page)}
                  className="h-9 w-9 p-0 text-sm"
                >
                  {page}
                </Button>
              ))}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              className="h-9 w-9 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};