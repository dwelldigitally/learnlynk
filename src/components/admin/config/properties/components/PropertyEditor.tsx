import React, { useState, useEffect } from 'react';
import { SystemProperty, PropertyFormData } from '@/types/systemProperties';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Loader2 } from 'lucide-react';
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
  onSave: (data: PropertyFormData) => void | Promise<void>;
  property?: SystemProperty;
  title: string;
  description: string;
  isLoading?: boolean;
}

const COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#F97316', // Orange
  '#6366F1', // Indigo
  '#84CC16', // Lime
];

export function PropertyEditor({ open, onClose, onSave, property, title, description, isLoading = false }: PropertyEditorProps) {
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
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        icon: '',
        order_index: 0,
        is_active: true,
      });
    }
  }, [property, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
  };

  const handleLabelChange = (label: string) => {
    const key = label.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
    setFormData({
      ...formData,
      property_label: label,
      property_key: property ? formData.property_key : key, // Only auto-generate for new properties
    });
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
                onChange={(e) => handleLabelChange(e.target.value)}
                placeholder="e.g., Certificate"
                required
              />
            </div>

            <div>
              <Label htmlFor="property_key">Key *</Label>
              <Input
                id="property_key"
                value={formData.property_key}
                onChange={(e) => setFormData({ ...formData, property_key: e.target.value.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '') })}
                placeholder="e.g., certificate"
                required
                disabled={!!property}
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Unique identifier (auto-generated from label)
              </p>
            </div>

            <div>
              <Label htmlFor="property_description">Description</Label>
              <Textarea
                id="property_description"
                value={formData.property_description}
                onChange={(e) => setFormData({ ...formData, property_description: e.target.value })}
                placeholder="Optional description..."
                rows={2}
              />
            </div>

            <div>
              <Label>Color</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      formData.color === color ? 'border-foreground scale-110' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setFormData({ ...formData, color })}
                  />
                ))}
              </div>
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
            <Button type="submit" disabled={!formData.property_label || !formData.property_key || isLoading}>
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {property ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
