import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Building, Users, MapPin, Clock } from 'lucide-react';
import { useSiteCapacity } from '@/hooks/useScheduling';
import { usePracticumPrograms } from '@/hooks/usePracticum';

export function SiteCapacityOverview() {
  const { user } = useAuth();
  const { data: siteCapacity = [] } = useSiteCapacity(user?.id || '');
  const { data: programs = [] } = usePracticumPrograms(user?.id || '');

  // Group capacity by site
  const siteGroups = siteCapacity.reduce((acc, capacity) => {
    const siteId = capacity.site_id;
    if (!acc[siteId]) {
      acc[siteId] = {
        site_name: (capacity as any).practicum_sites?.name || 'Unknown Site',
        capacities: []
      };
    }
    acc[siteId].capacities.push(capacity);
    return acc;
  }, {} as Record<string, { site_name: string; capacities: typeof siteCapacity }>);

  const getUtilizationColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getAvailabilityBadge = (available: number, max: number) => {
    const percentage = (available / max) * 100;
    if (percentage === 0) return { variant: 'destructive' as const, label: 'Full' };
    if (percentage <= 25) return { variant: 'secondary' as const, label: 'Limited' };
    return { variant: 'default' as const, label: 'Available' };
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Site Capacity Overview</h2>
        <p className="text-muted-foreground">
          Monitor capacity utilization across all practicum sites and programs
        </p>
      </div>

      {siteCapacity.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Building className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No capacity data available</h3>
            <p className="text-muted-foreground">
              Site capacity information will appear here once sites are configured with programs
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {Object.entries(siteGroups).map(([siteId, group]) => {
            const totalCapacity = group.capacities.reduce((sum, c) => sum + c.max_capacity, 0);
            const totalUsed = group.capacities.reduce((sum, c) => sum + (c.max_capacity - c.available_spots), 0);
            const utilizationPercentage = totalCapacity > 0 ? (totalUsed / totalCapacity) * 100 : 0;

            return (
              <Card key={siteId}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Building className="h-5 w-5 text-primary" />
                      <div>
                        <CardTitle>{group.site_name}</CardTitle>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <Users className="h-4 w-4" />
                          <span>{totalUsed}/{totalCapacity} students assigned</span>
                          <Clock className="h-4 w-4 ml-2" />
                          <span>{group.capacities.length} programs</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold">{utilizationPercentage.toFixed(0)}%</div>
                      <div className="text-sm text-muted-foreground">Utilization</div>
                    </div>
                  </div>
                  
                  <Progress 
                    value={utilizationPercentage} 
                    className="h-2"
                  />
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Program Breakdown:</h4>
                    <div className="grid gap-3">
                      {group.capacities.map((capacity) => {
                        const programName = (capacity as any).practicum_programs?.program_name || 'Unknown Program';
                        const usedSpots = capacity.max_capacity - capacity.available_spots;
                        const programUtilization = capacity.max_capacity > 0 ? (usedSpots / capacity.max_capacity) * 100 : 0;
                        const badgeInfo = getAvailabilityBadge(capacity.available_spots, capacity.max_capacity);

                        return (
                          <div key={capacity.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <div className="font-medium text-sm">{programName}</div>
                              <div className="text-xs text-muted-foreground">
                                Period: {new Date(capacity.period_start).toLocaleDateString()} - {new Date(capacity.period_end).toLocaleDateString()}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                              <div className="text-right">
                                <div className="text-sm font-medium">
                                  {capacity.available_spots}/{capacity.max_capacity}
                                </div>
                                <div className="text-xs text-muted-foreground">available</div>
                              </div>
                              
                              <Badge variant={badgeInfo.variant}>
                                {badgeInfo.label}
                              </Badge>
                              
                              <div className="w-20">
                                <Progress 
                                  value={programUtilization} 
                                  className="h-2"
                                />
                                <div className="text-xs text-center mt-1 text-muted-foreground">
                                  {programUtilization.toFixed(0)}%
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}