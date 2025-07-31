import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  ChevronLeft, 
  ChevronRight,
  Download,
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
}

interface ModernDataTableProps {
  title: string;
  columns: Column[];
  data: any[];
  searchable?: boolean;
  filterable?: boolean;
  exportable?: boolean;
  addButton?: {
    label: string;
    onClick: () => void;
  };
  onRowClick?: (row: any) => void;
  className?: string;
}

const ModernDataTable: React.FC<ModernDataTableProps> = ({
  title,
  columns,
  data,
  searchable = true,
  filterable = true,
  exportable = true,
  addButton,
  onRowClick,
  className
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter data based on search query
  const filteredData = data.filter(row =>
    columns.some(column =>
      String(row[column.key]).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const renderCellContent = (value: any, key: string) => {
    if (key === 'avatar' && value) {
      return (
        <Avatar className="h-8 w-8">
          <AvatarImage src={value} />
          <AvatarFallback className="text-xs bg-primary/10 text-primary">
            {String(value).charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      );
    }
    
    if (key === 'status') {
      const statusColors = {
        active: 'bg-success/10 text-success border-success/20',
        pending: 'bg-warning/10 text-warning border-warning/20',
        inactive: 'bg-muted text-muted-foreground border-border',
        rejected: 'bg-destructive/10 text-destructive border-destructive/20'
      };
      
      return (
        <Badge 
          variant="outline" 
          className={cn("text-xs font-medium", statusColors[value as keyof typeof statusColors] || statusColors.inactive)}
        >
          {String(value).charAt(0).toUpperCase() + String(value).slice(1)}
        </Badge>
      );
    }
    
    if (key === 'email') {
      return <span className="text-sm text-muted-foreground">{value}</span>;
    }
    
    return <span className="text-sm text-foreground">{value}</span>;
  };

  return (
    <Card className={cn("border-0 shadow-soft", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {filteredData.length} total records
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {exportable && (
              <Button variant="outline" size="sm" className="h-9">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            )}
            {addButton && (
              <Button size="sm" className="h-9" onClick={addButton.onClick}>
                <Plus className="h-4 w-4 mr-2" />
                {addButton.label}
              </Button>
            )}
          </div>
        </div>
        
        {(searchable || filterable) && (
          <div className="flex items-center gap-3 mt-4">
            {searchable && (
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9"
                />
              </div>
            )}
            {filterable && (
              <Button variant="outline" size="sm" className="h-9">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            )}
          </div>
        )}
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={cn(
                      "px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider",
                      column.width && `w-${column.width}`
                    )}
                  >
                    {column.label}
                  </th>
                ))}
                <th className="px-6 py-4 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider w-16">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedData.map((row, index) => (
                <tr
                  key={index}
                  className={cn(
                    "hover:bg-muted/50 transition-colors duration-150",
                    onRowClick && "cursor-pointer"
                  )}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((column) => (
                    <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                      {renderCellContent(row[column.key], column.key)}
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
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-border">
            <div className="text-sm text-muted-foreground">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} results
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={page === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="h-8 w-8 p-0 text-xs"
                  >
                    {page}
                  </Button>
                ))}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
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

export default ModernDataTable;