import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Plus, Download, Upload, Search, Settings2, Eye, EyeOff, GripVertical, X } from 'lucide-react';
import { StudentFilters } from '@/services/studentService';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AdmissionStage } from '@/types/student';

export interface ColumnConfig {
  id: string;
  label: string;
  visible: boolean;
  sortable: boolean;
  width?: string;
}

interface StageStats {
  key: string;
  label: string;
  count: number;
  color: string;
}

interface UnifiedStudentHeaderProps {
  stages: StageStats[];
  activeStage: string;
  selectedStudentsCount: number;
  filters: StudentFilters;
  onStageChange: (stage: string) => void;
  onFilterChange: (filters: Partial<StudentFilters>) => void;
  onClearFilters: () => void;
  onAddStudent: () => void;
  onImport: () => void;
  onExport: () => void;
  onSearch?: (query: string) => void;
  columns?: ColumnConfig[];
  onColumnsChange?: (columns: ColumnConfig[]) => void;
}

export function UnifiedStudentHeader({
  stages,
  activeStage,
  selectedStudentsCount,
  filters,
  onStageChange,
  onFilterChange,
  onClearFilters,
  onAddStudent,
  onImport,
  onExport,
  onSearch,
  columns = [],
  onColumnsChange
}: UnifiedStudentHeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showColumnSettings, setShowColumnSettings] = useState(false);
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);

  const getTotalStudents = () => stages.reduce((sum, stage) => sum + stage.count, 0);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (onSearch) {
      const timeoutId = setTimeout(() => {
        onSearch(value);
      }, 300);
      return () => clearTimeout(timeoutId);
    }
  };

  const toggleColumnVisibility = (columnId: string) => {
    if (onColumnsChange) {
      const updatedColumns = columns.map(col =>
        col.id === columnId ? { ...col, visible: !col.visible } : col
      );
      onColumnsChange(updatedColumns);
    }
  };

  const handleDragStart = (columnId: string) => {
    setDraggedColumn(columnId);
  };

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    if (!draggedColumn || draggedColumn === columnId) return;

    if (onColumnsChange) {
      const draggedIndex = columns.findIndex(col => col.id === draggedColumn);
      const targetIndex = columns.findIndex(col => col.id === columnId);
      
      const newColumns = [...columns];
      const [removed] = newColumns.splice(draggedIndex, 1);
      newColumns.splice(targetIndex, 0, removed);
      
      onColumnsChange(newColumns);
    }
  };

  const handleDragEnd = () => {
    setDraggedColumn(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Title with Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Student Management</h1>
          <p className="text-muted-foreground mt-1">
            Track and manage students through their admission journey
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name, email, or ID..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-9"
              maxLength={100}
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                onClick={() => {
                  setSearchQuery('');
                  if (onSearch) onSearch('');
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
          {columns.length > 0 && onColumnsChange && (
            <DropdownMenu open={showColumnSettings} onOpenChange={setShowColumnSettings}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Settings2 className="w-4 h-4 mr-2" />
                  Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 bg-popover z-50">
                <div className="p-2">
                  <div className="text-sm font-medium mb-2">Manage Columns</div>
                  <div className="space-y-2">
                    {columns.map((column) => (
                      <div 
                        key={column.id}
                        className="flex items-center justify-between p-2 rounded hover:bg-muted/50 cursor-move bg-popover"
                        draggable
                        onDragStart={() => handleDragStart(column.id)}
                        onDragOver={(e) => handleDragOver(e, column.id)}
                        onDragEnd={handleDragEnd}
                      >
                        <div className="flex items-center gap-2">
                          <GripVertical className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{column.label}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => toggleColumnVisibility(column.id)}
                        >
                          {column.visible ? (
                            <Eye className="h-4 w-4" />
                          ) : (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <Button variant="outline" onClick={onImport}>
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" onClick={onExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={onAddStudent}>
            <Plus className="w-4 h-4 mr-2" />
            Add Student
          </Button>
        </div>
      </div>

      {/* Stage Timeline - Compact Horizontal */}
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant={activeStage === "all" ? "default" : "outline"}
          onClick={() => onStageChange("all")}
          size="sm"
          className="whitespace-nowrap flex-shrink-0"
        >
          All <Badge variant="secondary" className="ml-1.5">{getTotalStudents()}</Badge>
        </Button>
        {stages.map((stage, index) => (
          <div key={stage.key} className="flex items-center gap-1.5 flex-shrink-0">
            {index > 0 && <div className="h-px w-4 sm:w-6 bg-border hidden sm:block" />}
            <Button
              variant={activeStage === stage.key ? "default" : "outline"}
              onClick={() => onStageChange(stage.key)}
              size="sm"
              className="whitespace-nowrap text-xs sm:text-sm"
            >
              <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full mr-1.5 ${stage.color}`} />
              <span className="hidden sm:inline">{stage.label}</span>
              <span className="sm:hidden">{stage.label.split(' ')[0]}</span>
              <Badge variant="secondary" className="ml-1.5">{stage.count}</Badge>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
