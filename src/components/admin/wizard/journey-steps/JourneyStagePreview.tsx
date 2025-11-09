import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Edit,
  Copy,
  MoreVertical,
  Plus,
  Clock,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Trash2,
} from 'lucide-react';
import { JourneyStage } from '@/types/academicJourney';

interface JourneyStagePreviewProps {
  stages: any[];
  onEditStage: (stage: any) => void;
  onDuplicateStage: (stage: any) => void;
  onDeleteStage: (stageId: string) => void;
  onAddStageBetween: (index: number) => void;
  onMoveStageUp: (index: number) => void;
  onMoveStageDown: (index: number) => void;
}

export function JourneyStagePreview({
  stages,
  onEditStage,
  onDuplicateStage,
  onDeleteStage,
  onAddStageBetween,
  onMoveStageUp,
  onMoveStageDown,
}: JourneyStagePreviewProps) {
  const [expandedStages, setExpandedStages] = useState<Set<string>>(new Set());

  const toggleStageExpansion = (stageId: string) => {
    setExpandedStages((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(stageId)) {
        newSet.delete(stageId);
      } else {
        newSet.add(stageId);
      }
      return newSet;
    });
  };

  if (!stages || stages.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No stages configured yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {stages.map((stage, index) => {
        const isExpanded = expandedStages.has(stage.id);
        
        return (
          <div key={stage.id}>
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-medium flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium truncate">{stage.name || `Stage ${index + 1}`}</h4>
                        <Badge variant={stage.is_required !== false ? "default" : "secondary"} className="text-xs">
                          {stage.is_required !== false ? 'Required' : 'Optional'}
                        </Badge>
                      </div>
                      {stage.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {stage.description}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleStageExpansion(stage.id)}
                    >
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onEditStage(stage)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onDuplicateStage(stage)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="ghost">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => onMoveStageUp(index)}
                          disabled={index === 0}
                        >
                          Move Up
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onMoveStageDown(index)}
                          disabled={index === stages.length - 1}
                        >
                          Move Down
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onDeleteStage(stage.id)}
                          className="text-destructive"
                        >
                          Delete Stage
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              
              {isExpanded && (
                <CardContent className="pt-0 space-y-4">
                  <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-muted-foreground">Expected Duration</div>
                        <div className="font-medium">
                          {stage.timing_config?.expected_duration_days || 0} days
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <AlertCircle className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-muted-foreground">Stall Threshold</div>
                        <div className="font-medium">
                          {stage.timing_config?.stall_threshold_days || 0} days
                        </div>
                      </div>
                    </div>
                  </div>

                  {stage.stage_type && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Stage Type:</span>
                      <Badge variant="outline" className="ml-2 capitalize">
                        {stage.stage_type.replace(/_/g, ' ')}
                      </Badge>
                    </div>
                  )}
                </CardContent>
              )}
            </Card>

            {index < stages.length - 1 && (
              <div className="flex justify-center my-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onAddStageBetween(index)}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Stage
                </Button>
              </div>
            )}
          </div>
        );
      })}

      <div className="flex justify-center pt-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onAddStageBetween(stages.length - 1)}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Stage at End
        </Button>
      </div>
    </div>
  );
}
