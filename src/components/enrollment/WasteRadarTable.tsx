import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Users, Clock } from 'lucide-react';

interface WasteRadarItem {
  id: string;
  student_name: string;
  unresponsive_30d: boolean;
  wrong_intake: boolean;
  duplicate_flag: boolean;
  touch_count: number;
}

interface WasteRadarTableProps {
  items: WasteRadarItem[];
  selectedItems: Set<string>;
  onSelectItem: (itemId: string, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
}

export function WasteRadarTable({ items, selectedItems, onSelectItem, onSelectAll }: WasteRadarTableProps) {
  const allSelected = items.length > 0 && selectedItems.size === items.length;
  const someSelected = selectedItems.size > 0 && selectedItems.size < items.length;

  const getFlags = (item: WasteRadarItem) => {
    const flags = [];
    if (item.unresponsive_30d) {
      flags.push({
        label: 'Unresponsive 30d',
        icon: Clock,
        color: 'bg-red-100 text-red-800 border-red-200'
      });
    }
    if (item.wrong_intake) {
      flags.push({
        label: 'Wrong Intake',
        icon: AlertTriangle,
        color: 'bg-orange-100 text-orange-800 border-orange-200'
      });
    }
    if (item.duplicate_flag) {
      flags.push({
        label: 'Duplicate',
        icon: Users,
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200'
      });
    }
    return flags;
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-green-500" />
        <h3 className="text-lg font-medium text-foreground mb-2">No Waste Detected</h3>
        <p>Your counselor queues are optimized! All contacts appear to be high-value.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Table Header */}
      <div className="grid grid-cols-12 gap-4 p-4 border-b border-border font-medium text-sm text-muted-foreground">
        <div className="col-span-1">
          <Checkbox
            checked={allSelected}
            onCheckedChange={onSelectAll}
            className={someSelected ? "data-[state=checked]:bg-primary data-[state=indeterminate]:bg-primary" : ""}
          />
        </div>
        <div className="col-span-3">Student Name</div>
        <div className="col-span-4">Flags</div>
        <div className="col-span-2">Touch Count</div>
        <div className="col-span-2">Risk Level</div>
      </div>

      {/* Table Rows */}
      {items.map((item) => {
        const flags = getFlags(item);
        const isSelected = selectedItems.has(item.id);
        const riskLevel = flags.length >= 2 ? 'High' : flags.length === 1 ? 'Medium' : 'Low';
        const riskColor = riskLevel === 'High' ? 'text-red-600' : riskLevel === 'Medium' ? 'text-orange-600' : 'text-yellow-600';
        
        return (
          <div 
            key={item.id} 
            className={`grid grid-cols-12 gap-4 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors ${
              isSelected ? 'bg-red-50 border-red-200' : ''
            }`}
          >
            <div className="col-span-1 flex items-center">
              <Checkbox
                checked={isSelected}
                onCheckedChange={(checked) => onSelectItem(item.id, checked as boolean)}
              />
            </div>
            
            <div className="col-span-3">
              <div className="font-medium text-foreground">{item.student_name}</div>
              <div className="text-sm text-muted-foreground">ID: {item.id.slice(0, 8)}</div>
            </div>
            
            <div className="col-span-4">
              <div className="flex flex-wrap gap-1">
                {flags.map((flag, index) => (
                  <Badge 
                    key={index}
                    variant="outline" 
                    className={`text-xs ${flag.color}`}
                  >
                    <flag.icon className="h-3 w-3 mr-1" />
                    {flag.label}
                  </Badge>
                ))}
                {flags.length === 0 && (
                  <span className="text-sm text-muted-foreground">No flags</span>
                )}
              </div>
            </div>
            
            <div className="col-span-2">
              <div className="flex items-center">
                <span className="text-lg font-semibold text-foreground mr-2">{item.touch_count}</span>
                <span className="text-sm text-muted-foreground">touches</span>
              </div>
            </div>
            
            <div className="col-span-2">
              <Badge 
                variant="outline"
                className={`${riskColor} border-current`}
              >
                {riskLevel} Risk
              </Badge>
            </div>
          </div>
        );
      })}

      {/* Selection Summary */}
      {selectedItems.size > 0 && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="text-sm">
            <span className="font-medium text-red-800">
              {selectedItems.size} contacts selected
            </span>
            <span className="text-red-600 ml-2">
              • Total touches to eliminate: {items
                .filter(item => selectedItems.has(item.id))
                .reduce((sum, item) => sum + item.touch_count, 0)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}