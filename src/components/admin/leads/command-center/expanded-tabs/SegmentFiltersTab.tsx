import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";

import { 
  Filter,
  Save,
  RotateCcw,
  Search,
  Plus,
  X,
  Calendar,
  DollarSign,
  Star,
  MapPin,
  Users,
  Tag,
  TrendingUp
} from "lucide-react";
import { useState } from "react";

interface SegmentFiltersTabProps {
  segmentType: string;
  currentFilters: Record<string, any>;
  onFiltersChange: (filters: Record<string, any>) => void;
}

export function SegmentFiltersTab({ 
  segmentType, 
  currentFilters, 
  onFiltersChange 
}: SegmentFiltersTabProps) {
  const [localFilters, setLocalFilters] = useState(currentFilters);
  const [savedFilters, setSavedFilters] = useState([
    { id: "1", name: "High Value Leads", filters: { minValue: 10000, urgency: ["high"] } },
    { id: "2", name: "Unresponsive This Week", filters: { lastActivity: "week", status: ["new"] } },
    { id: "3", name: "Enterprise Prospects", filters: { tags: ["enterprise"], score: [80, 100] } }
  ]);

  const updateFilter = (key: string, value: any) => {
    const updated = { ...localFilters, [key]: value };
    setLocalFilters(updated);
    onFiltersChange(updated);
  };

  const clearAllFilters = () => {
    setLocalFilters({});
    onFiltersChange({});
  };

  const applyPresetFilter = (preset: any) => {
    setLocalFilters(preset.filters);
    onFiltersChange(preset.filters);
  };

  const getSegmentSpecificFilters = () => {
    switch (segmentType) {
      case "Unassigned Leads":
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="h-4 w-4" />
                Assignment Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Workload Capacity</Label>
                <Select value={localFilters.capacity} onValueChange={(value) => updateFilter('capacity', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any capacity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available advisors only</SelectItem>
                    <SelectItem value="partial">Partial capacity</SelectItem>
                    <SelectItem value="full">Full capacity</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Specialization</Label>
                <div className="space-y-2 mt-2">
                  {["Financial Planning", "Investment Advisory", "Retirement Planning", "Tax Planning"].map((spec) => (
                    <div key={spec} className="flex items-center space-x-2">
                      <Checkbox 
                        id={spec}
                        checked={localFilters.specializations?.includes(spec)}
                        onCheckedChange={(checked) => {
                          const current = localFilters.specializations || [];
                          const updated = checked 
                            ? [...current, spec]
                            : current.filter((s: string) => s !== spec);
                          updateFilter('specializations', updated);
                        }}
                      />
                      <Label htmlFor={spec} className="text-sm">{spec}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      
      case "SLA Violations":
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Calendar className="h-4 w-4" />
                SLA Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Violation Severity</Label>
                <Select value={localFilters.severity} onValueChange={(value) => updateFilter('severity', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All severities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="critical">Critical (over 24h overdue)</SelectItem>
                    <SelectItem value="high">High (12-24h overdue)</SelectItem>
                    <SelectItem value="medium">Medium (6-12h overdue)</SelectItem>
                    <SelectItem value="low">Low (under 6h overdue)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Response Type</Label>
                <div className="space-y-2 mt-2">
                  {["First Response", "Follow-up", "Status Update", "Resolution"].map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox 
                        id={type}
                        checked={localFilters.responseTypes?.includes(type)}
                        onCheckedChange={(checked) => {
                          const current = localFilters.responseTypes || [];
                          const updated = checked 
                            ? [...current, type]
                            : current.filter((t: string) => t !== type);
                          updateFilter('responseTypes', updated);
                        }}
                      />
                      <Label htmlFor={type} className="text-sm">{type}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Filter Controls Header */}
      <div className="px-6 py-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Advanced Filters</h3>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={clearAllFilters}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Clear All
            </Button>
            <Button variant="outline" size="sm">
              <Save className="h-4 w-4 mr-2" />
              Save Filter
            </Button>
          </div>
        </div>
        
        {/* Active Filters */}
        {Object.keys(localFilters).length > 0 && (
          <div className="flex flex-wrap gap-2">
            {Object.entries(localFilters).map(([key, value]) => (
              <Badge key={key} variant="secondary" className="flex items-center gap-1">
                {key}: {Array.isArray(value) ? value.join(", ") : String(value)}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => {
                    const { [key]: removed, ...rest } = localFilters;
                    setLocalFilters(rest);
                    onFiltersChange(rest);
                  }}
                />
              </Badge>
            ))}
          </div>
        )}
      </div>

      <ScrollArea className="flex-1">
        <div className="px-6 py-4 space-y-6">
          {/* Saved Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Save className="h-4 w-4" />
                Quick Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {savedFilters.map((preset) => (
                  <Button
                    key={preset.id}
                    variant="outline"
                    size="sm"
                    onClick={() => applyPresetFilter(preset)}
                    className="justify-start"
                  >
                    <Filter className="h-3 w-3 mr-2" />
                    {preset.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Lead Score */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Star className="h-4 w-4" />
                Lead Score
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Score Range: {localFilters.scoreRange?.[0] || 0} - {localFilters.scoreRange?.[1] || 100}</Label>
                <Slider
                  value={localFilters.scoreRange || [0, 100]}
                  onValueChange={(value) => updateFilter('scoreRange', value)}
                  max={100}
                  min={0}
                  step={5}
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>

          {/* Lead Value */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <DollarSign className="h-4 w-4" />
                Lead Value
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Minimum Value</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={localFilters.minValue || ""}
                    onChange={(e) => updateFilter('minValue', e.target.value ? parseInt(e.target.value) : null)}
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Maximum Value</Label>
                  <Input
                    type="number"
                    placeholder="No limit"
                    value={localFilters.maxValue || ""}
                    onChange={(e) => updateFilter('maxValue', e.target.value ? parseInt(e.target.value) : null)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status & Urgency */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="h-4 w-4" />
                Status & Priority
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Status</Label>
                <div className="space-y-2 mt-2">
                  {["New", "Contacted", "Qualified", "Proposal", "Closed"].map((status) => (
                    <div key={status} className="flex items-center space-x-2">
                      <Checkbox 
                        id={status}
                        checked={localFilters.statuses?.includes(status)}
                        onCheckedChange={(checked) => {
                          const current = localFilters.statuses || [];
                          const updated = checked 
                            ? [...current, status]
                            : current.filter((s: string) => s !== status);
                          updateFilter('statuses', updated);
                        }}
                      />
                      <Label htmlFor={status} className="text-sm">{status}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <Label className="text-sm font-medium">Priority</Label>
                <div className="space-y-2 mt-2">
                  {["High", "Medium", "Low"].map((priority) => (
                    <div key={priority} className="flex items-center space-x-2">
                      <Checkbox 
                        id={priority}
                        checked={localFilters.priorities?.includes(priority.toLowerCase())}
                        onCheckedChange={(checked) => {
                          const current = localFilters.priorities || [];
                          const updated = checked 
                            ? [...current, priority.toLowerCase()]
                            : current.filter((p: string) => p !== priority.toLowerCase());
                          updateFilter('priorities', updated);
                        }}
                      />
                      <Label htmlFor={priority} className="text-sm">{priority}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <MapPin className="h-4 w-4" />
                Location
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">State/Region</Label>
                <Select value={localFilters.region} onValueChange={(value) => updateFilter('region', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CA">California</SelectItem>
                    <SelectItem value="NY">New York</SelectItem>
                    <SelectItem value="TX">Texas</SelectItem>
                    <SelectItem value="FL">Florida</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Tag className="h-4 w-4" />
                Tags
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Include Tags</Label>
                <div className="space-y-2 mt-2">
                  {["High Value", "Enterprise", "Warm Lead", "Referral", "VIP"].map((tag) => (
                    <div key={tag} className="flex items-center space-x-2">
                      <Checkbox 
                        id={tag}
                        checked={localFilters.tags?.includes(tag)}
                        onCheckedChange={(checked) => {
                          const current = localFilters.tags || [];
                          const updated = checked 
                            ? [...current, tag]
                            : current.filter((t: string) => t !== tag);
                          updateFilter('tags', updated);
                        }}
                      />
                      <Label htmlFor={tag} className="text-sm">{tag}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Segment-specific filters */}
          {getSegmentSpecificFilters()}
        </div>
      </ScrollArea>
    </div>
  );
}