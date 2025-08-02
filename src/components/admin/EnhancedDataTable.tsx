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
  Plus,
  Settings,
  Eye,
  EyeOff,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Loader2,
  X
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

interface EnhancedDataTableProps {
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

export const EnhancedDataTable: React.FC<EnhancedDataTableProps> = ({
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
          <Badge variant="outline" className="text-xs">
            {value}
          </Badge>
        );
      case 'date':
        return new Date(value).toLocaleDateString();
      case 'number':
        return typeof value === 'number' ? value.toLocaleString() : value;
      default:
        return value;
    }
  };

  const getSortIcon = (columnKey: string) => {
    if (sortBy !== columnKey) {
      return <ArrowUpDown className="h-4 w-4 opacity-50" />;
    }
    return sortOrder === 'asc' 
      ? <ArrowUp className="h-4 w-4" />
      : <ArrowDown className="h-4 w-4" />;
  };

  const visibleColumnsArray = columns.filter(col => col.visible);
  const isAllSelected = data.length > 0 && selectedIds.length === data.length;
  const isPartiallySelected = selectedIds.length > 0 && selectedIds.length < data.length;

  return (
    <Card className={cn("border-0 shadow-soft", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {totalCount.toLocaleString()} total records
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Bulk Actions */}
            {selectable && selectedIds.length > 0 && (
              <div className="flex items-center gap-2 mr-4 p-2 bg-primary/10 rounded-lg">
                <span className="text-sm font-medium">
                  {selectedIds.length} selected
                </span>
                {bulkActions.map((action, index) => (
                  <Button
                    key={index}
                    variant={action.variant || "outline"}
                    size="sm"
                    onClick={() => action.onClick(selectedIds)}
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            )}

            {/* Column Visibility */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {initialColumns.map((column) => (
                  <DropdownMenuItem
                    key={column.key}
                    className="flex items-center gap-2"
                    onClick={() => toggleColumnVisibility(column.key)}
                  >
                    {visibleColumns[column.key] !== false ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                    {column.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {exportable && (
              <Button variant="outline" size="sm" onClick={onExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            )}
          </div>
        </div>
        
        {/* Search and Filters */}
        <div className="flex items-center gap-3 mt-4">
          {searchable && (
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search leads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
          )}

          {/* Quick Filters */}
          {quickFilters.map((quickFilter, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => onFilter(quickFilter.filter)}
            >
              {quickFilter.label}
            </Button>
          ))}

          {filterable && filterOptions.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter
              {Object.keys(activeFilters).length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs">
                  {Object.keys(activeFilters).length}
                </Badge>
              )}
            </Button>
          )}

          {/* Page Size Selector */}
          <Select value={pageSize.toString()} onValueChange={(value) => onPageSizeChange(Number(value))}>
            <SelectTrigger className="w-20">
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

        {/* Advanced Filters Panel */}
        {showFilters && filterOptions.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 p-4 bg-muted/50 rounded-lg">
            {filterOptions.map((filter) => (
              <div key={filter.key} className="space-y-1">
                <label className="text-xs font-medium">{filter.label}</label>
                <Select
                  value={activeFilters[filter.key] || 'all'}
                  onValueChange={(value) => handleFilterChange(filter.key, value)}
                >
                  <SelectTrigger className="h-8">
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
            {Object.keys(activeFilters).length > 0 && (
              <div className="flex items-end">
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </div>
            )}
          </div>
        )}
      </CardHeader>
      
      <CardContent className="p-0">
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading...</span>
          </div>
        )}

        {/* Table */}
        {!loading && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
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
                        "px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider",
                        column.sortable && "cursor-pointer hover:text-foreground",
                        column.width && `w-${column.width}`
                      )}
                      onClick={() => column.sortable && handleSort(column.key)}
                    >
                      <div className="flex items-center gap-2">
                        {column.label}
                        {column.sortable && getSortIcon(column.key)}
                      </div>
                    </th>
                  ))}
                  <th className="px-6 py-4 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider w-16">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.map((row, index) => (
                  <tr
                    key={row.id || index}
                    className={cn(
                      "hover:bg-muted/50 transition-colors duration-150",
                      onRowClick && "cursor-pointer",
                      selectedIds.includes(row.id) && "bg-primary/5"
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
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Empty State */}
        {!loading && data.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">No data found</p>
          </div>
        )}
        
        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-border">
            <div className="text-sm text-muted-foreground">
              Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalCount)} of {totalCount.toLocaleString()} results
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex items-center gap-1">
                {/* Smart pagination - show first, last, and around current page */}
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  let page: number;
                  if (totalPages <= 7) {
                    page = i + 1;
                  } else if (currentPage <= 4) {
                    page = i + 1;
                  } else if (currentPage >= totalPages - 3) {
                    page = totalPages - 6 + i;
                  } else {
                    page = currentPage - 3 + i;
                  }
                  
                  return (
                    <Button
                      key={page}
                      variant={page === currentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => onPageChange(page)}
                      className="h-8 w-8 p-0 text-xs"
                    >
                      {page}
                    </Button>
                  );
                })}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};