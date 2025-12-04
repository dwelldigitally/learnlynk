import React from 'react';
import { SystemProperty } from '@/types/systemProperties';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Edit, Trash2, Lock, AlertCircle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface PropertyTableProps {
  properties: SystemProperty[];
  onEdit: (property: SystemProperty) => void;
  onDelete: (property: SystemProperty) => void;
  onToggleActive: (property: SystemProperty) => void;
  getUsageCount?: (propertyKey: string) => number;
}

export function PropertyTable({ properties, onEdit, onDelete, onToggleActive, getUsageCount }: PropertyTableProps) {
  return (
    <div className="rounded-md border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">Color</TableHead>
            <TableHead>Label</TableHead>
            <TableHead>Key</TableHead>
            <TableHead>Description</TableHead>
            {getUsageCount && <TableHead className="w-[100px]">Usage</TableHead>}
            <TableHead className="w-[100px]">Active</TableHead>
            <TableHead className="w-[120px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {properties.length === 0 ? (
            <TableRow>
              <TableCell colSpan={getUsageCount ? 7 : 6} className="text-center text-muted-foreground py-8">
                No properties found. Click "Add Property" to create one.
              </TableCell>
            </TableRow>
          ) : (
            properties.map((property) => {
              const usageCount = getUsageCount ? getUsageCount(property.property_key) : 0;
              const isInUse = usageCount > 0;
              const canDelete = !property.is_system && !isInUse;

              return (
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
                  <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                    {property.property_description || '-'}
                  </TableCell>
                  {getUsageCount && (
                    <TableCell>
                      {isInUse ? (
                        <Badge variant="outline" className="text-xs">
                          {usageCount} record{usageCount !== 1 ? 's' : ''}
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">Not used</span>
                      )}
                    </TableCell>
                  )}
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
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onDelete(property)}
                                disabled={!canDelete}
                                className={!canDelete ? 'opacity-50 cursor-not-allowed' : ''}
                              >
                                {isInUse ? (
                                  <AlertCircle className="w-4 h-4 text-amber-500" />
                                ) : (
                                  <Trash2 className="w-4 h-4" />
                                )}
                              </Button>
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            {property.is_system
                              ? 'System properties cannot be deleted'
                              : isInUse
                              ? `Cannot delete: in use by ${usageCount} record${usageCount !== 1 ? 's' : ''}`
                              : 'Delete property'}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
