import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Calendar, MapPin, Users, Filter, SortAsc, Bell, Target } from 'lucide-react';
import { enhancedIntakeService, type EnhancedIntake, type IntakeFilters, type SortOptions } from '@/services/enhancedIntakeService';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const EnhancedPipelinePlanner: React.FC = () => {
  const [intakes, setIntakes] = useState<EnhancedIntake[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<IntakeFilters>({});
  const [sort, setSort] = useState<SortOptions>({ field: 'start_date', direction: 'asc' });
  const [filterOptions, setFilterOptions] = useState<any>({});
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  useEffect(() => {
    loadData();
  }, [filters, sort]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [intakeData, options] = await Promise.all([
        enhancedIntakeService.getIntakesWithProgramData(filters, sort),
        enhancedIntakeService.getFilterOptions()
      ]);
      setIntakes(intakeData);
      setFilterOptions(options);
    } catch (error) {
      console.error('Failed to load pipeline data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproachChange = async (intakeId: string, approach: 'aggressive' | 'balanced' | 'neutral') => {
    const success = await enhancedIntakeService.updateSalesApproach(intakeId, approach);
    if (success) {
      setIntakes(prev => prev.map(intake => 
        intake.id === intakeId ? { ...intake, sales_approach: approach } : intake
      ));
    }
  };

  const handleFilterChange = (key: keyof IntakeFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value === 'all' ? undefined : value }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'open': return 'default';
      case 'closed': return 'secondary';
      case 'full': return 'destructive';
      default: return 'outline';
    }
  };

  const getHealthStatusColor = (status: 'healthy' | 'warning' | 'critical') => {
    switch (status) {
      case 'healthy': return 'hsl(var(--success))';
      case 'warning': return 'hsl(var(--warning))';
      case 'critical': return 'hsl(var(--destructive))';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const activeFiltersCount = Object.values(filters).filter(v => v && v !== '').length;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="p-4">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-2 w-full mb-2" />
              <Skeleton className="h-6 w-1/2" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Pipeline Planner</h2>
          <p className="text-muted-foreground">
            Manage intake enrollments and sales approaches across all programs
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => toast.info('AI Notifications feature coming soon')}>
            <Bell className="h-4 w-4 mr-2" />
            Schedule AI Notifications
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search programs or intakes..."
                  value={filters.search || ''}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <Select value={sort.field} onValueChange={(value) => setSort(prev => ({ ...prev, field: value as any }))}>
              <SelectTrigger className="w-48">
                <SortAsc className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="start_date">Start Date</SelectItem>
                <SelectItem value="enrollment_percentage">Enrollment %</SelectItem>
                <SelectItem value="program_name">Program Name</SelectItem>
                <SelectItem value="campus">Campus</SelectItem>
                <SelectItem value="capacity">Capacity</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => setSort(prev => ({ ...prev, direction: prev.direction === 'asc' ? 'desc' : 'asc' }))}
            >
              {sort.direction === 'asc' ? '↑' : '↓'}
            </Button>

            <Button
              variant="outline"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={cn(activeFiltersCount > 0 && "border-primary")}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
            </Button>

            {activeFiltersCount > 0 && (
              <Button variant="ghost" onClick={clearFilters}>
                Clear Filters
              </Button>
            )}
          </div>

          {showAdvancedFilters && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 pt-4 border-t">
              <Select value={filters.program_type || ''} onValueChange={(value) => handleFilterChange('program_type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Program Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {filterOptions.programTypes?.map((type: string) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filters.delivery_method || ''} onValueChange={(value) => handleFilterChange('delivery_method', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Delivery Method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Methods</SelectItem>
                  {filterOptions.deliveryMethods?.map((method: string) => (
                    <SelectItem key={method} value={method}>{method}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filters.campus || ''} onValueChange={(value) => handleFilterChange('campus', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Campus" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Campuses</SelectItem>
                  {filterOptions.campuses?.map((campus: string) => (
                    <SelectItem key={campus} value={campus}>{campus}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filters.status || ''} onValueChange={(value) => handleFilterChange('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {filterOptions.statuses?.map((status: string) => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Intake Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {intakes.map((intake) => {
          const strategy = enhancedIntakeService.getSalesApproachStrategy(intake.sales_approach);
          
          return (
            <Card key={intake.id} className="relative overflow-hidden hover:shadow-lg transition-shadow">
              <div 
                className="absolute top-0 left-0 right-0 h-1" 
                style={{ backgroundColor: getHealthStatusColor(intake.health_status) }}
              />
              
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-2">
                  <div className="min-w-0">
                    <CardTitle className="text-sm font-semibold truncate">
                      {intake.program_name}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground truncate">
                      {intake.name}
                    </p>
                  </div>
                  <Badge variant={getStatusBadgeVariant(intake.status)} className="shrink-0">
                    {intake.status}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Date and Location */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(intake.start_date)}</span>
                  </div>
                  {intake.campus && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{intake.campus}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Users className="h-3 w-3" />
                    <span>{intake.study_mode} • {intake.delivery_method}</span>
                  </div>
                </div>

                {/* Enrollment Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Enrollment</span>
                    <span className="font-medium">
                      {intake.enrolled_count}/{intake.capacity}
                    </span>
                  </div>
                  <Progress 
                    value={intake.capacity_percentage} 
                    className="h-2"
                    indicatorClassName={cn(
                      intake.health_status === 'critical' && "bg-destructive",
                      intake.health_status === 'warning' && "bg-warning",
                      intake.health_status === 'healthy' && "bg-success"
                    )}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{intake.enrollment_percentage.toFixed(0)}% filled</span>
                    <span className={cn(
                      "font-medium",
                      intake.health_status === 'critical' && "text-destructive",
                      intake.health_status === 'warning' && "text-warning",
                      intake.health_status === 'healthy' && "text-success"
                    )}>
                      {intake.health_status}
                    </span>
                  </div>
                </div>

                {/* Sales Approach */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1 text-xs font-medium">
                    <Target className="h-3 w-3" />
                    Sales Approach
                  </div>
                  <ToggleGroup
                    type="single"
                    value={intake.sales_approach}
                    onValueChange={(value) => value && handleApproachChange(intake.id, value as any)}
                    className="grid grid-cols-3 h-8"
                  >
                    <ToggleGroupItem value="aggressive" className="text-xs">
                      Aggressive
                    </ToggleGroupItem>
                    <ToggleGroupItem value="balanced" className="text-xs">
                      Balanced
                    </ToggleGroupItem>
                    <ToggleGroupItem value="neutral" className="text-xs">
                      Neutral
                    </ToggleGroupItem>
                  </ToggleGroup>
                  
                  <div className="text-xs text-muted-foreground">
                    {strategy.description}
                  </div>
                </div>

                {/* Recommended Actions */}
                <div className="space-y-1">
                  <div className="text-xs font-medium">Recommended Actions:</div>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {strategy.actions.slice(0, 2).map((action, index) => (
                      <li key={index} className="flex items-start gap-1">
                        <span className="text-primary mt-1">•</span>
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {intakes.length === 0 && !loading && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Intakes Found</h3>
            <p className="text-muted-foreground text-center">
              {activeFiltersCount > 0
                ? "No intakes match your current filters. Try adjusting your search criteria."
                : "No intakes have been configured yet. Create your first program intake to get started."
              }
            </p>
            {activeFiltersCount > 0 && (
              <Button variant="outline" onClick={clearFilters} className="mt-4">
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export { EnhancedPipelinePlanner };