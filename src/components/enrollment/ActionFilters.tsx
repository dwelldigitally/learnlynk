import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Phone, Mail, Clock, TrendingUp, AlertTriangle } from 'lucide-react';

interface ActionFiltersProps {
  selectedActionType: string;
  selectedSLAStatus: string;
  selectedYieldRange: string;
  onActionTypeChange: (value: string) => void;
  onSLAStatusChange: (value: string) => void;
  onYieldRangeChange: (value: string) => void;
  filteredCount: number;
  totalCount: number;
  onClearFilters: () => void;
}

export function ActionFilters({
  selectedActionType,
  selectedSLAStatus, 
  selectedYieldRange,
  onActionTypeChange,
  onSLAStatusChange,
  onYieldRangeChange,
  filteredCount,
  totalCount,
  onClearFilters
}: ActionFiltersProps) {
  
  const actionTypeIcons = {
    'Call Student': Phone,
    'Send Email': Mail,
    'Schedule Meeting': Calendar,
    'Send Reminder': Clock,
  };

  const getActionIcon = (actionType: string) => {
    const IconComponent = actionTypeIcons[actionType as keyof typeof actionTypeIcons];
    return IconComponent ? <IconComponent className="h-4 w-4" /> : <Phone className="h-4 w-4" />;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        {/* Action Type Filter */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-foreground">Action Type:</span>
          <Select value={selectedActionType} onValueChange={onActionTypeChange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All actions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              <SelectItem value="Call Student">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>Call Student</span>
                </div>
              </SelectItem>
              <SelectItem value="Send Email">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>Send Email</span>
                </div>
              </SelectItem>
              <SelectItem value="Schedule Meeting">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>Schedule Meeting</span>
                </div>
              </SelectItem>
              <SelectItem value="Send Reminder">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>Send Reminder</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* SLA Status Filter */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-foreground">SLA Status:</span>
          <Select value={selectedSLAStatus} onValueChange={onSLAStatusChange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All SLA" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All SLA</SelectItem>
              <SelectItem value="overdue">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <span>Overdue</span>
                </div>
              </SelectItem>
              <SelectItem value="urgent">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-orange-500" />
                  <span>Due Soon</span>
                </div>
              </SelectItem>
              <SelectItem value="normal">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span>On Track</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Yield Score Range Filter */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-foreground">Yield Score:</span>
          <Select value={selectedYieldRange} onValueChange={onYieldRangeChange}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="All scores" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Scores</SelectItem>
              <SelectItem value="80-100">80-100 (High)</SelectItem>
              <SelectItem value="60-79">60-79 (Medium)</SelectItem>
              <SelectItem value="0-59">0-59 (Low)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Clear Filters Button */}
        {(selectedActionType !== 'all' || selectedSLAStatus !== 'all' || selectedYieldRange !== 'all') && (
          <Button variant="outline" size="sm" onClick={onClearFilters}>
            Clear Filters
          </Button>
        )}
      </div>

      {/* Quick Filter Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground">Quick filters:</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            onActionTypeChange('Call Student');
            onSLAStatusChange('all');
          }}
          className="h-8"
        >
          <Phone className="h-3 w-3 mr-1" />
          Ready to Call
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            onActionTypeChange('Send Email');
            onSLAStatusChange('all');
          }}
          className="h-8"
        >
          <Mail className="h-3 w-3 mr-1" />
          Email Ready
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            onSLAStatusChange('overdue');
            onActionTypeChange('all');
          }}
          className="h-8"
        >
          <AlertTriangle className="h-3 w-3 mr-1" />
          Overdue Only
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            onYieldRangeChange('80-100');
            onActionTypeChange('all');
          }}
          className="h-8"
        >
          <TrendingUp className="h-3 w-3 mr-1" />
          High Yield
        </Button>
      </div>

      {/* Results Summary */}
      <div className="flex items-center space-x-2">
        <Badge variant="secondary">
          {filteredCount} of {totalCount} actions shown
        </Badge>
        {filteredCount !== totalCount && (
          <span className="text-sm text-muted-foreground">
            ({totalCount - filteredCount} filtered out)
          </span>
        )}
      </div>
    </div>
  );
}