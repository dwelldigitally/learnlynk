import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface NavigationItem {
  id?: string;
  label: string;
  path?: string;
  external_url?: string;
  icon?: string;
  order_index: number;
  is_active: boolean;
  requires_auth: boolean;
  parent_id?: string;
}

interface NavigationItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (item: Omit<NavigationItem, 'id'>) => void;
  item?: NavigationItem;
}

export const NavigationItemDialog = ({ open, onOpenChange, onSave, item }: NavigationItemDialogProps) => {
  const [formData, setFormData] = useState<Omit<NavigationItem, 'id'>>({
    label: '',
    path: '',
    external_url: '',
    icon: 'Home',
    order_index: 0,
    is_active: true,
    requires_auth: false,
  });

  useEffect(() => {
    if (item) {
      setFormData({
        label: item.label,
        path: item.path || '',
        external_url: item.external_url || '',
        icon: item.icon || 'Home',
        order_index: item.order_index,
        is_active: item.is_active,
        requires_auth: item.requires_auth,
        parent_id: item.parent_id,
      });
    } else {
      setFormData({
        label: '',
        path: '',
        external_url: '',
        icon: 'Home',
        order_index: 0,
        is_active: true,
        requires_auth: false,
      });
    }
  }, [item, open]);

  const handleSave = () => {
    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{item ? 'Edit Navigation Item' : 'Add Navigation Item'}</DialogTitle>
          <DialogDescription>
            Configure the navigation menu item for the student portal.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="label">Label</Label>
            <Input
              id="label"
              value={formData.label}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              placeholder="Home"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="path">Internal Path</Label>
              <Input
                id="path"
                value={formData.path}
                onChange={(e) => setFormData({ ...formData, path: e.target.value, external_url: '' })}
                placeholder="/dashboard"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="external_url">External URL</Label>
              <Input
                id="external_url"
                value={formData.external_url}
                onChange={(e) => setFormData({ ...formData, external_url: e.target.value, path: '' })}
                placeholder="https://example.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="icon">Icon</Label>
              <Select value={formData.icon} onValueChange={(value) => setFormData({ ...formData, icon: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Home">Home</SelectItem>
                  <SelectItem value="User">Profile</SelectItem>
                  <SelectItem value="FileText">Documents</SelectItem>
                  <SelectItem value="Calendar">Calendar</SelectItem>
                  <SelectItem value="MessageSquare">Messages</SelectItem>
                  <SelectItem value="Settings">Settings</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="order">Order</Label>
              <Input
                id="order"
                type="number"
                value={formData.order_index}
                onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Active</Label>
              <p className="text-sm text-muted-foreground">Show this item in the menu</p>
            </div>
            <Switch
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Requires Authentication</Label>
              <p className="text-sm text-muted-foreground">Only show to logged-in students</p>
            </div>
            <Switch
              checked={formData.requires_auth}
              onCheckedChange={(checked) => setFormData({ ...formData, requires_auth: checked })}
            />
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {item ? 'Update' : 'Create'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
