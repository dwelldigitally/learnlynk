import React from 'react';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { 
  Play, Pause, BarChart3, Settings, Trash2, 
  RefreshCw, Zap, GitBranch, MoreHorizontal,
  Users, CheckCircle2
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { ModernCard } from '@/components/modern/ModernCard';
import { InfoBadge } from '@/components/modern/InfoBadge';
import { MetadataItem } from '@/components/modern/MetadataItem';
import { format } from 'date-fns';
import type { Automation } from '@/services/automationService';

interface AutomationCardProps {
  automation: Automation;
  onToggle: (automation: Automation) => void;
  onEdit: (automation: Automation) => void;
  onDelete: (automation: Automation) => void;
  onAnalytics: (automation: Automation) => void;
  onReEnroll: (automation: Automation) => void;
  onExecute: (automation: Automation) => void;
}

export function AutomationCard({
  automation,
  onToggle,
  onEdit,
  onDelete,
  onAnalytics,
  onReEnroll,
  onExecute
}: AutomationCardProps) {
  const getStatusVariant = () => {
    if (automation.is_active) return 'success';
    if (automation.status === 'draft') return 'secondary';
    return 'warning';
  };

  const getStatusLabel = () => {
    if (automation.is_active) return 'ACTIVE';
    if (automation.status === 'draft') return 'DRAFT';
    return 'PAUSED';
  };

  const enrollmentCount = automation.execution_stats?.total_enrollments || 
                          automation.execution_stats?.total_executions || 0;
  const completionRate = automation.execution_stats?.completion_rate || 
                         automation.execution_stats?.success_rate || 0;
  
  const stepCount = automation.elements?.length || automation.trigger_config?.elements?.length || 0;

  return (
    <ModernCard>
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-primary/10">
            <Zap className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base text-foreground mb-2 truncate">
              {automation.name}
            </h3>
            <div className="flex flex-wrap gap-1.5">
              <InfoBadge variant={getStatusVariant()}>
                {getStatusLabel()}
              </InfoBadge>
              <InfoBadge variant="default">
                {stepCount} STEPS
              </InfoBadge>
              {automation.trigger_type && (
                <InfoBadge variant="secondary">
                  {automation.trigger_type.replace(/_/g, ' ').toUpperCase()}
                </InfoBadge>
              )}
            </div>
          </div>
          
          {/* Quick Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => onExecute(automation)}>
                <Play className="mr-2 h-4 w-4" />
                Run Now
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onReEnroll(automation)}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Re-enroll Leads
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAnalytics(automation)}>
                <BarChart3 className="mr-2 h-4 w-4" />
                View Analytics
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onEdit(automation)}>
                <Settings className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(automation)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Description */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {automation.description || "No description provided"}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Enrolled:</span>
            <span className="font-medium">{enrollmentCount}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Completion:</span>
            <span className="font-medium">{completionRate}%</span>
          </div>
        </div>

        {/* Metadata */}
        <MetadataItem
          icon={GitBranch}
          label="Created"
          value={format(new Date(automation.created_at), 'MMM dd, yyyy')}
          className="mb-4"
        />

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onToggle(automation)}
            className="flex-1"
          >
            {automation.is_active ? (
              <>
                <Pause className="h-3.5 w-3.5 mr-1.5" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 mr-1.5" />
                Activate
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(automation)}
            className="flex-1"
          >
            <Settings className="h-3.5 w-3.5 mr-1.5" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAnalytics(automation)}
            className="flex-1"
          >
            <BarChart3 className="h-3.5 w-3.5 mr-1.5" />
            Stats
          </Button>
        </div>
      </CardContent>
    </ModernCard>
  );
}
