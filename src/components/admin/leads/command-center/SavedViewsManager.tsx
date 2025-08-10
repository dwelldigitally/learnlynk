import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Filter, Plus, Trash2 } from 'lucide-react';
import { useSavedViews } from '@/hooks/useSavedViews';

interface SavedViewsManagerProps {
  currentFilters: {
    severityFilter?: string;
    segmentFilter?: string | null;
    query?: string;
  };
  onApplyFilters: (filters: any) => void;
}

export function SavedViewsManager({ currentFilters, onApplyFilters }: SavedViewsManagerProps) {
  const { savedViews, saveView, deleteView, applyView } = useSavedViews();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [viewName, setViewName] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  const handleSaveView = async () => {
    if (!viewName.trim()) return;
    
    try {
      await saveView(viewName, currentFilters, isDefault);
      setViewName('');
      setIsDefault(false);
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving view:', error);
    }
  };

  const handleApplyView = (view: any) => {
    const filters = applyView(view);
    onApplyFilters(filters);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Filter className="h-4 w-4" />
          Saved Views
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <Plus className="h-4 w-4 mr-2" />
              Save Current View
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Save View</DialogTitle>
              <DialogDescription>
                Save your current filter settings as a view for quick access.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="view-name">View Name</Label>
                <Input
                  id="view-name"
                  value={viewName}
                  onChange={(e) => setViewName(e.target.value)}
                  placeholder="Enter view name..."
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is-default"
                  checked={isDefault}
                  onCheckedChange={(checked) => setIsDefault(checked as boolean)}
                />
                <Label htmlFor="is-default">Set as default view</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveView} disabled={!viewName.trim()}>
                Save View
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {savedViews.length > 0 && (
          <>
            <DropdownMenuSeparator />
            {savedViews.map((view) => (
              <DropdownMenuItem
                key={view.id}
                className="flex items-center justify-between"
                onSelect={() => handleApplyView(view)}
              >
                <span className="flex items-center gap-2">
                  {view.name}
                  {view.isDefault && (
                    <span className="text-xs bg-primary text-primary-foreground px-1 rounded">
                      default
                    </span>
                  )}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteView(view.id);
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </DropdownMenuItem>
            ))}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}