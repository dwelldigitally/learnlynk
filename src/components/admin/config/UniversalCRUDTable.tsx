import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Edit, Trash2, Copy } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface Column {
  key: string;
  label: string;
  type: 'text' | 'number' | 'boolean' | 'badge' | 'date' | 'array' | 'color';
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
}

interface CRUDAction {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary';
  onClick: (item: any) => void;
}

interface UniversalCRUDTableProps {
  title?: string;
  description?: string;
  data: any[];
  columns: Column[];
  actions?: CRUDAction[];
  onAdd?: () => void;
  onEdit?: (item: any) => void;
  onDelete?: (item: any) => void;
  onDuplicate?: (item: any) => void;
  loading?: boolean;
  searchPlaceholder?: string;
  emptyMessage?: string;
  showAddButton?: boolean;
  showSearch?: boolean;
  customFilters?: React.ReactNode;
}

export const UniversalCRUDTable: React.FC<UniversalCRUDTableProps> = ({
  title,
  description,
  data,
  columns,
  actions = [],
  onAdd,
  onEdit,
  onDelete,
  onDuplicate,
  loading = false,
  searchPlaceholder = "Search...",
  emptyMessage = "No items found",
  showAddButton = true,
  showSearch = true,
  customFilters
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Default actions
  const defaultActions: CRUDAction[] = [
    ...(onEdit ? [{
      id: 'edit',
      label: 'Edit',
      icon: Edit,
      variant: 'outline' as const,
      onClick: onEdit
    }] : []),
    ...(onDuplicate ? [{
      id: 'duplicate',
      label: 'Duplicate',
      icon: Copy,
      variant: 'outline' as const,
      onClick: onDuplicate
    }] : []),
    ...(onDelete ? [{
      id: 'delete',
      label: 'Delete',
      icon: Trash2,
      variant: 'destructive' as const,
      onClick: onDelete
    }] : [])
  ];

  const allActions = [...defaultActions, ...actions];

  // Filter and search data
  const filteredData = data.filter(item => {
    if (!searchTerm) return true;
    return columns.some(column => {
      const value = item[column.key];
      if (value === null || value === undefined) return false;
      return String(value).toLowerCase().includes(searchTerm.toLowerCase());
    });
  });

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn) return 0;
    
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];
    
    if (aValue === null || aValue === undefined) return 1;
    if (bValue === null || bValue === undefined) return -1;
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  const renderCellValue = (value: any, column: Column) => {
    if (value === null || value === undefined) {
      return <span className="text-muted-foreground">-</span>;
    }

    switch (column.type) {
      case 'boolean':
        return <Switch checked={value} disabled />;
      case 'badge':
        return <Badge variant={value ? 'default' : 'secondary'}>{String(value)}</Badge>;
      case 'date':
        return new Date(value).toLocaleDateString();
      case 'array':
        return Array.isArray(value) ? (
          <div className="flex flex-wrap gap-1">
            {value.slice(0, 3).map((item, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {String(item)}
              </Badge>
            ))}
            {value.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{value.length - 3}
              </Badge>
            )}
          </div>
        ) : String(value);
      case 'color':
        return (
          <div className="flex items-center gap-2">
            <div 
              className="w-4 h-4 rounded border" 
              style={{ backgroundColor: value }}
            />
            <span className="text-sm">{value}</span>
          </div>
        );
      case 'number':
        return typeof value === 'number' ? value.toLocaleString() : String(value);
      default:
        return String(value);
    }
  };

  if (loading) {
    return (
      <Card>
        {title && (
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
          </CardHeader>
        )}
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      {title && (
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{title}</CardTitle>
              {description && <p className="text-sm text-muted-foreground">{description}</p>}
            </div>
            {showAddButton && onAdd && (
              <Button onClick={onAdd}>
                <Plus className="w-4 h-4 mr-2" />
                Add New
              </Button>
            )}
          </div>
        </CardHeader>
      )}
      {!title && showAddButton && onAdd && (
        <CardHeader>
          <div className="flex justify-end">
            <Button onClick={onAdd}>
              <Plus className="w-4 h-4 mr-2" />
              Add New
            </Button>
          </div>
        </CardHeader>
      )}
      <CardContent>
        <div className="space-y-4">
          {/* Search and Filters */}
          {(showSearch || customFilters) && (
            <div className="flex flex-col sm:flex-row gap-4">
              {showSearch && (
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder={searchPlaceholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              )}
              {customFilters && (
                <div className="flex gap-2">
                  {customFilters}
                </div>
              )}
            </div>
          )}

          {/* Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((column) => (
                    <TableHead 
                      key={column.key}
                      className={`${column.width || ''} ${column.sortable ? 'cursor-pointer hover:bg-muted/50' : ''}`}
                      onClick={column.sortable ? () => handleSort(column.key) : undefined}
                    >
                      <div className="flex items-center gap-2">
                        {column.label}
                        {column.sortable && sortColumn === column.key && (
                          <span className="text-xs">
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </TableHead>
                  ))}
                  {allActions.length > 0 && (
                    <TableHead className="w-32">Actions</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedData.length === 0 ? (
                  <TableRow>
                    <TableCell 
                      colSpan={columns.length + (allActions.length > 0 ? 1 : 0)} 
                      className="text-center py-8 text-muted-foreground"
                    >
                      {emptyMessage}
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedData.map((item, index) => (
                    <TableRow key={item.id || index}>
                      {columns.map((column) => (
                        <TableCell key={column.key}>
                          {renderCellValue(item[column.key], column)}
                        </TableCell>
                      ))}
                      {allActions.length > 0 && (
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {allActions.map((action) => {
                              const IconComponent = action.icon;
                              return (
                                <Button
                                  key={action.id}
                                  variant={action.variant || 'outline'}
                                  size="sm"
                                  onClick={() => action.onClick(item)}
                                  className="h-8 w-8 p-0"
                                >
                                  <IconComponent className="w-4 h-4" />
                                </Button>
                              );
                            })}
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Summary */}
          {sortedData.length > 0 && (
            <div className="text-sm text-muted-foreground">
              Showing {sortedData.length} of {data.length} items
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};