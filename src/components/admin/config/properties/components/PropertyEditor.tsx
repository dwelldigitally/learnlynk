import React, { useState, useEffect } from 'react';
import { SystemProperty, PropertyFormData } from '@/types/systemProperties';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface PropertyEditorProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: PropertyFormData) => void;
  property?: SystemProperty;
  title: string;
  description: string;
}

export function PropertyEditor({ open, onClose, onSave, property, title, description }: PropertyEditorProps) {
  const [formData, setFormData] = useState<PropertyFormData>({
    property_key: '',
    property_label: '',
    property_description: '',
    color: '#3B82F6',
    icon: '',
    order_index: 0,
    is_active: true,
  });

  useEffect(() => {
    if (property) {
      setFormData({
        property_key: property.property_key,
        property_label: property.property_label,
        property_description: property.property_description || '',
        color: property.color || '#3B82F6',
        icon: property.icon || '',
        order_index: property.order_index,
        is_active: property.is_active,
      });
    } else {
      setFormData({
        property_key: '',
        property_label: '',
        property_description: '',
        color: '#3B82F6',
        icon: '',
        order_index: 0,
        is_active: true,
      });
    }
  }, [property, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleKeyChange = (value: string) => {
    // Convert to snake_case
    const snakeCase = value.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
    setFormData({ ...formData, property_key: snakeCase });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="property_label">Label *</Label>
              <Input
                id="property_label"
                value={formData.property_label}
                onChange={(e) => setFormData({ ...formData, property_label: e.target.value })}
                placeholder="e.g., Certificate"
                required
              />
            </div>

            <div>
              <Label htmlFor="property_key">Key *</Label>
              <Input
                id="property_key"
                value={formData.property_key}
                onChange={(e) => handleKeyChange(e.target.value)}
                placeholder="e.g., certificate"
                required
                disabled={property?.is_system}
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Lowercase with underscores (auto-formatted)
              </p>
            </div>

            <div>
              <Label htmlFor="property_description">Description</Label>
              <Textarea
                id="property_description"
                value={formData.property_description}
                onChange={(e) => setFormData({ ...formData, property_description: e.target.value })}
                placeholder="Optional description..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="color">Color</Label>
              <div className="flex gap-2">
                <Input
                  id="color"
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-20 h-10"
                />
                <Input
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  placeholder="#3B82F6"
                  className="flex-1 font-mono"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="icon">Icon (Lucide name)</Label>
              <Input
                id="icon"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="e.g., Award, GraduationCap"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="is_active">Active</Label>
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {property ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
