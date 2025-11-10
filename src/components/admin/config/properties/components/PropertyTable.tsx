import React from 'react';
import { SystemProperty } from '@/types/systemProperties';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Edit, Trash2, Lock } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface PropertyTableProps {
  properties: SystemProperty[];
  onEdit: (property: SystemProperty) => void;
  onDelete: (property: SystemProperty) => void;
  onToggleActive: (property: SystemProperty) => void;
}

export function PropertyTable({ properties, onEdit, onDelete, onToggleActive }: PropertyTableProps) {
  return (
    <div className="rounded-md border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">Color</TableHead>
            <TableHead>Label</TableHead>
            <TableHead>Key</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="w-[100px]">Active</TableHead>
            <TableHead className="w-[120px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {properties.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                No properties found. Click "Add Property" to create one.
              </TableCell>
            </TableRow>
          ) : (
            properties.map((property) => (
              <TableRow key={property.id}>
                <TableCell>
                  <div
                    className="w-6 h-6 rounded border border-border"
                    style={{ backgroundColor: property.color || '#6B7280' }}
                  />
                </TableCell>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {property.property_label}
                    {property.is_system && (
                      <Badge variant="secondary" className="text-xs">
                        <Lock className="w-3 h-3 mr-1" />
                        System
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-mono text-sm text-muted-foreground">
                  {property.property_key}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {property.property_description || '-'}
                </TableCell>
                <TableCell>
                  <Switch
                    checked={property.is_active}
                    onCheckedChange={() => onToggleActive(property)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(property)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(property)}
                      disabled={property.is_system}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
