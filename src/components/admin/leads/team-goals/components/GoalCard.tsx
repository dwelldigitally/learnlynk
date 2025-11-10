import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, Users, User, Trophy } from "lucide-react";
import { TeamGoal } from "@/types/teamGoals";

interface GoalCardProps {
  goal: TeamGoal;
  onEdit?: (goal: TeamGoal) => void;
  onDelete?: (goalId: string) => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({ goal, onEdit, onDelete }) => {
  const percentage = Math.min((goal.current_value / goal.target_value) * 100, 100);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'achieved': return 'bg-green-500/10 text-green-700 dark:text-green-400';
      case 'on_track': return 'bg-blue-500/10 text-blue-700 dark:text-blue-400';
      case 'at_risk': return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400';
      case 'off_track': return 'bg-red-500/10 text-red-700 dark:text-red-400';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/10 text-red-700 dark:text-red-400';
      case 'medium': return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400';
      case 'low': return 'bg-green-500/10 text-green-700 dark:text-green-400';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const formatValue = (value: number) => {
    if (goal.unit === '$') {
      return `$${value.toLocaleString()}`;
    }
    return `${value.toLocaleString()} ${goal.unit}`;
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-base flex items-center gap-2">
              {goal.goal_type === 'team' && <Users className="h-4 w-4" />}
              {goal.goal_type === 'individual' && <User className="h-4 w-4" />}
              {goal.goal_type === 'role_based' && <Trophy className="h-4 w-4" />}
              {goal.goal_name}
            </CardTitle>
            {goal.description && (
              <p className="text-sm text-muted-foreground mt-1">{goal.description}</p>
            )}
          </div>
          <div className="flex gap-1">
            {onEdit && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onEdit(goal)}
                className="h-8 w-8 p-0"
              >
                <Edit2 className="h-3.5 w-3.5" />
              </Button>
            )}
            {onDelete && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onDelete(goal.id)}
                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Badge className={getStatusColor(goal.status)}>
            {goal.status.replace('_', ' ')}
          </Badge>
          <Badge className={getPriorityColor(goal.priority)}>
            {goal.priority} priority
          </Badge>
          <Badge variant="outline">{goal.goal_period}</Badge>
          <Badge variant="outline">{goal.metric_type}</Badge>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{percentage.toFixed(0)}%</span>
          </div>
          <Progress 
            value={percentage} 
            className={`${
              goal.status === 'achieved' || goal.status === 'on_track' 
                ? '[&>div]:bg-green-500' 
                : goal.status === 'at_risk' 
                ? '[&>div]:bg-yellow-500' 
                : '[&>div]:bg-red-500'
            }`}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2 border-t">
          <div>
            <p className="text-xs text-muted-foreground">Current</p>
            <p className="text-sm font-semibold">{formatValue(goal.current_value)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Target</p>
            <p className="text-sm font-semibold">{formatValue(goal.target_value)}</p>
          </div>
        </div>

        {goal.assignee_names && goal.assignee_names.length > 0 && (
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground mb-1">Assigned to</p>
            <div className="flex flex-wrap gap-1">
              {goal.assignee_names.map((name, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between text-xs text-muted-foreground pt-2 border-t">
          <span>{new Date(goal.start_date).toLocaleDateString()}</span>
          <span>to</span>
          <span>{new Date(goal.end_date).toLocaleDateString()}</span>
        </div>
      </CardContent>
    </Card>
  );
};
