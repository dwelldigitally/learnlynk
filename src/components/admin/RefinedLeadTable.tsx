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
      {/* Enhanced Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 px-6 py-5 bg-gradient-subtle border-b border-border/50">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">{title}</h2>
            <Badge variant="outline" className="text-xs bg-primary-light text-primary font-medium border-primary/20">
              {totalCount.toLocaleString()}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Manage and track your leads efficiently
          </p>
        </div>
        
        {/* Action Bar */}
        <div className="flex items-center gap-3">
          {selectable && selectedIds.length > 0 && (
            <div className="flex items-center gap-3 mr-4 px-4 py-2 bg-primary/10 border border-primary/20 rounded-xl backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                <Users className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">
                  {selectedIds.length} selected
                </span>
              </div>
              <div className="w-px h-4 bg-primary/20"></div>
              {bulkActions.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant === 'destructive' ? 'destructive' : 'outline'}
                  size="sm"
                  onClick={() => action.onClick(selectedIds)}
                  className="h-8 text-xs"
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-10 px-4 border-border/50 hover:border-accent hover:bg-accent-light/50">
                <Settings className="h-4 w-4 mr-2" />
                View
                <ChevronDown className="h-4 w-4 ml-2 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <div className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider border-b border-border/50">
                Toggle Columns
              </div>
              {initialColumns.map((column) => (
                <DropdownMenuItem
                  key={column.key}
                  className="flex items-center gap-3 cursor-pointer py-2.5"
                  onClick={() => toggleColumnVisibility(column.key)}
                >
                  {visibleColumns[column.key] !== false ? (
                    <Eye className="h-4 w-4 text-accent" />
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
            <Button variant="outline" size="sm" onClick={onExport} className="h-10 px-4 border-border/50 hover:border-accent hover:bg-accent-light/50">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          )}
        </div>
      </div>

      {/* Enhanced Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4 px-6 py-4 bg-background border-b border-border/30">
        {searchable && (
          <div className="relative flex-1 min-w-[320px]">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search leads by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 h-11 bg-background border-border/50 focus:border-accent focus:ring-accent/20"
            />
          </div>
        )}

        <div className="flex items-center gap-3 flex-wrap">
          {/* Quick Filters */}
          {quickFilters.map((quickFilter, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => onFilter(quickFilter.filter)}
              className="h-11 px-4 text-xs border-border/50 hover:border-accent hover:bg-accent-light/50 hover:text-accent-foreground"
            >
              {quickFilter.label}
            </Button>
          ))}

          {filterable && filterOptions.length > 0 && (
            <Button
              variant={showFilters ? "default" : "outline"}
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "h-11 px-4",
                !showFilters && "border-border/50 hover:border-accent hover:bg-accent-light/50",
                showFilters && "bg-accent text-accent-foreground"
              )}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {Object.keys(activeFilters).length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 px-2 text-xs bg-accent-light text-accent">
                  {Object.keys(activeFilters).length}
                </Badge>
              )}
            </Button>
          )}

          <Select value={pageSize.toString()} onValueChange={(value) => onPageSizeChange(Number(value))}>
            <SelectTrigger className="w-24 h-11 border-border/50 focus:border-accent focus:ring-accent/20">
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
        <Card className="mx-6 border-dashed border-accent/30 bg-accent-light/20">
          <CardContent className="p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filterOptions.map((filter) => (
                <div key={filter.key} className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {filter.label}
                  </label>
                  <Select
                    value={activeFilters[filter.key] || 'all'}
                    onValueChange={(value) => handleFilterChange(filter.key, value)}
                  >
                    <SelectTrigger className="h-10 border-border/50 focus:border-accent focus:ring-accent/20">
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
              <div className="flex justify-end mt-5 pt-4 border-t border-border/30">
                <Button variant="outline" size="sm" onClick={clearFilters} className="border-border/50 hover:border-accent hover:bg-accent-light/50">
                  <X className="h-4 w-4 mr-2" />
                  Clear all filters
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Modern Table */}
      <Card className="mx-6 mb-6 border-0 shadow-medium bg-card">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <Loader2 className="h-8 w-8 animate-spin text-accent" />
                  <div className="absolute inset-0 w-8 h-8 border-2 border-accent/20 rounded-full"></div>
                </div>
                <p className="text-sm text-muted-foreground font-medium">Loading leads...</p>
              </div>
            </div>
          ) : data.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-subtle flex items-center justify-center">
                  <Users className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-foreground">No leads found</h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    Try adjusting your search or filter criteria to find the leads you're looking for
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full overflow-hidden rounded-lg">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-subtle">
                    <tr className="border-b border-border/30">
                      {selectable && (
                        <th className="px-6 py-5 w-16">
                          <Checkbox
                            checked={isAllSelected || isPartiallySelected}
                            onCheckedChange={handleSelectAll}
                            className="border-border/50 data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                          />
                        </th>
                      )}
                      {visibleColumnsArray.map((column) => (
                        <th
                          key={column.key}
                          className={cn(
                            "px-6 py-5 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider",
                            column.sortable && "cursor-pointer hover:text-accent select-none transition-colors",
                            column.width && `w-${column.width}`
                          )}
                          onClick={() => column.sortable && handleSort(column.key)}
                        >
                          <div className="flex items-center gap-2">
                            {column.label}
                            {column.sortable && (
                              <div className="transition-all duration-200">
                                {getSortIcon(column.key)}
                              </div>
                            )}
                          </div>
                        </th>
                      ))}
                      <th className="px-6 py-5 text-right text-xs font-bold text-muted-foreground uppercase tracking-wider w-20">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/20 bg-background">
                    {data.map((row, index) => (
                      <tr
                        key={row.id || index}
                        className={cn(
                          "group hover:bg-accent-light/30 transition-all duration-200",
                          onRowClick && "cursor-pointer",
                          selectedIds.includes(row.id) && "bg-primary-light/40 hover:bg-primary-light/60 border-l-4 border-l-primary"
                        )}
                        onClick={() => onRowClick?.(row)}
                      >
                        {selectable && (
                          <td className="px-6 py-5">
                            <Checkbox
                              checked={selectedIds.includes(row.id)}
                              onCheckedChange={(checked) => handleRowSelect(row.id, checked as boolean)}
                              onClick={(e) => e.stopPropagation()}
                              className="border-border/50 data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                            />
                          </td>
                        )}
                        {visibleColumnsArray.map((column) => (
                          <td key={column.key} className="px-6 py-5 whitespace-nowrap">
                            {renderCellContent(column, row[column.key], row)}
                          </td>
                        ))}
                        <td className="px-6 py-5 whitespace-nowrap text-right">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-9 w-9 p-0 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-accent-light/50 hover:text-accent"
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
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 px-6 py-5 border-t border-border/30 bg-gradient-subtle">
          <div className="text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{((currentPage - 1) * pageSize) + 1}</span> to{' '}
            <span className="font-semibold text-foreground">{Math.min(currentPage * pageSize, totalCount)}</span> of{' '}
            <span className="font-semibold text-foreground">{totalCount.toLocaleString()}</span> results
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
              className="h-10 w-10 p-0 border-border/50 hover:border-accent hover:bg-accent-light/50 disabled:opacity-50"
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
                  className={cn(
                    "h-10 w-10 p-0 text-sm",
                    page === currentPage 
                      ? "bg-accent text-accent-foreground border-accent" 
                      : "border-border/50 hover:border-accent hover:bg-accent-light/50"
                  )}
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
              className="h-10 w-10 p-0 border-border/50 hover:border-accent hover:bg-accent-light/50 disabled:opacity-50"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};