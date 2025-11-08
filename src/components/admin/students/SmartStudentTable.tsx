import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  MoreHorizontal, 
  Phone, 
  Mail, 
  Eye,
  Edit,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface SmartStudentTableProps {
  students: any[];
  loading: boolean;
  selectedStudentIds: string[];
  onStudentSelect: (studentId: string) => void;
  onSelectAll: (selected: boolean) => void;
  onStudentClick: (student: any) => void;
  onBulkAction: (action: string, selectedIds: string[]) => void;
  onSort: (column: string, order: 'asc' | 'desc') => void;
  totalCount: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  columns?: ColumnConfig[];
  bulkActions?: BulkAction[];
}

interface ColumnConfig {
  id: string;
  label: string;
  visible: boolean;
  sortable: boolean;
  width?: string;
}

interface BulkAction {
  label: string;
  onClick: (ids: string[]) => void;
  variant?: 'default' | 'destructive' | 'outline';
}

export function SmartStudentTable({
  students,
  loading,
  selectedStudentIds,
  onStudentSelect,
  onSelectAll,
  onStudentClick,
  onBulkAction,
  onSort,
  totalCount,
  currentPage,
  pageSize,
  totalPages,
  onPageChange,
  onPageSizeChange,
  columns = [],
  bulkActions = []
}: SmartStudentTableProps) {
  const [sortColumn, setSortColumn] = React.useState('created_at');
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('desc');

  const isAllSelected = students.length > 0 && selectedStudentIds.length === students.length;
  const isPartiallySelected = selectedStudentIds.length > 0 && selectedStudentIds.length < students.length;

  const handleSort = (column: string) => {
    const newOrder = sortColumn === column && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortColumn(column);
    setSortOrder(newOrder);
    onSort(column, newOrder);
  };

  const getSortIcon = (column: string) => {
    if (sortColumn !== column) return <ArrowUpDown className="h-4 w-4" />;
    return sortOrder === 'asc' 
      ? <ArrowUp className="h-4 w-4" />
      : <ArrowDown className="h-4 w-4" />;
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'LEAD_FORM': return 'outline';
      case 'SEND_DOCUMENTS': return 'secondary';
      case 'DOCUMENT_APPROVAL': return 'default';
      case 'FEE_PAYMENT': return 'default';
      case 'ACCEPTED': return 'secondary';
      default: return 'outline';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  const visibleColumns = columns.filter(col => col.visible);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-0">
        {/* Bulk Actions Bar */}
        {selectedStudentIds.length > 0 && (
          <div className="bg-primary/10 border-b px-6 py-3 flex items-center justify-between">
            <span className="text-sm font-medium">
              {selectedStudentIds.length} selected
            </span>
            <div className="flex items-center gap-2">
              {bulkActions.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant || "outline"}
                  size="sm"
                  onClick={() => action.onClick(selectedStudentIds)}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="w-12 px-6 py-4">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={(checked) => onSelectAll(!!checked)}
                    aria-label="Select all"
                  />
                </th>
                {visibleColumns.map((column) => (
                  <th
                    key={column.id}
                    className={cn(
                      "px-6 py-4 text-left text-sm font-medium text-muted-foreground",
                      column.sortable && "cursor-pointer hover:text-foreground transition-colors"
                    )}
                    onClick={() => column.sortable && handleSort(column.id)}
                  >
                    <div className="flex items-center gap-2">
                      {column.label}
                      {column.sortable && getSortIcon(column.id)}
                    </div>
                  </th>
                ))}
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {students.length === 0 ? (
                <tr>
                  <td colSpan={visibleColumns.length + 2} className="px-6 py-12 text-center text-muted-foreground">
                    No students found
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr
                    key={student.id}
                    className="hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => onStudentClick(student)}
                  >
                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedStudentIds.includes(student.id)}
                        onCheckedChange={() => onStudentSelect(student.id)}
                        aria-label={`Select ${student.first_name} ${student.last_name}`}
                      />
                    </td>
                    
                    {visibleColumns.map((column) => (
                      <td key={column.id} className="px-6 py-4">
                        {column.id === 'student_name' && (
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 border-2 border-primary/10">
                              <AvatarFallback className="text-sm font-medium bg-primary/5">
                                {student.first_name?.[0] || 'N'}{student.last_name?.[0] || 'A'}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-semibold text-sm">
                                {student.first_name || 'N/A'} {student.last_name || ''}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                ID: {student.student_id || 'N/A'}
                              </div>
                            </div>
                          </div>
                        )}
                        {column.id === 'email' && (
                          <div className="text-sm">{student.email || 'N/A'}</div>
                        )}
                        {column.id === 'program' && (
                          <div className="text-sm">{student.program || 'N/A'}</div>
                        )}
                        {column.id === 'stage' && (
                          <Badge variant={getStageColor(student.stage || '')} className="font-medium">
                            {student.stage?.replace('_', ' ') || 'N/A'}
                          </Badge>
                        )}
                        {column.id === 'progress' && (
                          <div className="w-32">
                            <div className="flex justify-between text-xs font-medium mb-1">
                              <span className="text-muted-foreground">Progress</span>
                              <span>{student.progress || 0}%</span>
                            </div>
                            <div className="w-full bg-muted/50 rounded-full h-2 overflow-hidden">
                              <div 
                                className="bg-primary h-2 rounded-full transition-all"
                                style={{ width: `${student.progress || 0}%` }}
                              />
                            </div>
                          </div>
                        )}
                        {column.id === 'risk_level' && (
                          <Badge variant={getRiskColor(student.risk_level || '')} className="font-medium capitalize">
                            {student.risk_level || 'N/A'}
                          </Badge>
                        )}
                        {column.id === 'location' && (
                          <div className="text-sm">
                            <div className="font-medium">{student.city || 'N/A'}</div>
                            <div className="text-muted-foreground text-xs">{student.country || 'N/A'}</div>
                          </div>
                        )}
                      </td>
                    ))}

                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 bg-popover z-50">
                          <DropdownMenuItem onClick={() => onStudentClick(student)} className="cursor-pointer">
                            <Eye className="h-4 w-4 mr-2" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <Mail className="h-4 w-4 mr-2" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <Phone className="h-4 w-4 mr-2" />
                            Call Student
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Details
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="border-t px-6 py-4 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalCount)} of {totalCount} students
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <div className="text-sm font-medium">
              Page {currentPage} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
