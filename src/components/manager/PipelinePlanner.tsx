
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { AlertCircle, ArrowDown, ArrowUp, Calendar, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Intake } from "@/types/pipeline";
import { IntakeService } from "@/services/intakeService";

const PipelinePlanner: React.FC = () => {
  const [intakes, setIntakes] = useState<Intake[]>([]);
  const [sortBy, setSortBy] = useState<string>("date");
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchIntakes = async () => {
      setLoading(true);
      try {
        const data = await IntakeService.getAllIntakes();
        // Transform data to match expected Intake interface
        const transformedData = data.map((intake: any) => ({
          id: intake.id,
          program: intake.programs?.name || 'Unknown Program',
          date: new Date(intake.start_date).toLocaleDateString(),
          time: 'TBA', // Not available in new structure
          location: intake.campus || 'TBA',
          enrollmentPercentage: 0, // Would need to calculate from enrollment data
          capacityPercentage: 0, // Would need to calculate from enrollment data
          status: (intake.status === 'open' ? 'healthy' : 'warning') as "healthy" | "warning" | "critical",
          approach: intake.sales_approach || 'balanced'
        }));
        setIntakes(transformedData);
      } catch (error) {
        console.error("Error fetching intakes:", error);
        toast({
          title: "Error",
          description: "Failed to load intake data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchIntakes();
  }, [toast]);

  const handleApproachChange = async (intakeId: string, newApproach: "aggressive" | "balanced" | "neutral") => {
    try {
      await IntakeService.updateSalesApproach(intakeId, newApproach);
      const success = true;
      
      if (success) {
        setIntakes(prevIntakes => 
          prevIntakes.map(intake => 
            intake.id === intakeId 
              ? { ...intake, approach: newApproach }
              : intake
          )
        );
        
        toast({
          title: "Sales approach updated",
          description: `The approach has been changed to ${newApproach} for this intake.`,
        });
      }
    } catch (error) {
      console.error("Error updating approach:", error);
      toast({
        title: "Error",
        description: "Failed to update sales approach",
        variant: "destructive",
      });
    }
  };

  const handleSort = (value: string) => {
    setSortBy(value);
    let sortedIntakes = [...intakes];
    
    switch (value) {
      case "date":
        // Simple sort by date (in a real app would use proper date parsing)
        sortedIntakes.sort((a, b) => a.date.localeCompare(b.date));
        break;
      case "enrollment":
        sortedIntakes.sort((a, b) => a.enrollmentPercentage - b.enrollmentPercentage);
        break;
      case "capacity":
        sortedIntakes.sort((a, b) => a.capacityPercentage - b.capacityPercentage);
        break;
      case "program":
        sortedIntakes.sort((a, b) => a.program.localeCompare(b.program));
        break;
    }
    
    setIntakes(sortedIntakes);
  };

  // Mock strategies for the old intake structure
  const strategies = {
    aggressive: {
      actions: [
        "Assign leads to top performers",
        "Prepare email campaigns",
        "Increase marketing budget",
        "Prioritize follow-ups"
      ]
    },
    balanced: {
      actions: [
        "Distribute leads evenly",
        "Standard follow-up sequence",
        "Normal marketing budget",
        "Regular engagement tracking"
      ]
    },
    neutral: {
      actions: [
        "Self-service registration",
        "Minimal direct outreach",
        "Reduced marketing spend",
        "Automated workflows"
      ]
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-bold">Upcoming Intakes</CardTitle>
        <div className="flex items-center gap-2">
          <Select value={sortBy} onValueChange={handleSort}>
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center">
                <Filter className="w-4 h-4 mr-2" />
                <span>Sort By</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="enrollment">Enrollment</SelectItem>
              <SelectItem value="capacity">Capacity</SelectItem>
              <SelectItem value="program">Program</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        {loading ? (
          <div className="flex justify-center p-8">
            <div className="animate-pulse text-center">
              <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full max-w-md mb-2.5"></div>
              <div className="h-4 bg-gray-200 rounded w-full max-w-md mb-2.5"></div>
            </div>
          </div>
        ) : intakes.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No upcoming intakes available</p>
          </div>
        ) : (
          intakes.map((intake) => (
            <div key={intake.id} className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4 border-t">
              <div className="lg:col-span-2">
                <div className="mb-2">
                  <h3 className="text-xl font-bold">{intake.program}</h3>
                  <div className="text-saas-gray-medium flex items-center gap-2 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" /> {intake.date}
                    </span>
                    <span className="mx-1">|</span>
                    <span>{intake.time}</span>
                    <span className="mx-1">|</span>
                    <span>{intake.location}</span>
                    {intake.status === "warning" && (
                      <AlertCircle className="w-4 h-4 text-amber-500 ml-1" />
                    )}
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between items-center text-sm mb-1">
                    <span>Enrollment: <strong>{intake.enrollmentPercentage}%</strong></span>
                    <span>Capacity: <strong>{intake.capacityPercentage}%</strong></span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden flex">
                    <div 
                      className={`h-full rounded-l-full ${
                        intake.enrollmentPercentage < 40 ? 'bg-red-600' : 
                        intake.enrollmentPercentage < 70 ? 'bg-green-600' : 'bg-green-700'
                      }`} 
                      style={{ width: `${intake.enrollmentPercentage}%` }}
                    />
                    <div 
                      className={`h-full ${
                        intake.capacityPercentage < 60 ? 'bg-teal-400' : 
                        intake.capacityPercentage < 90 ? 'bg-teal-500' : 'bg-teal-600'
                      }`} 
                      style={{ width: `${intake.capacityPercentage - intake.enrollmentPercentage}%` }}
                    />
                  </div>
                  
                  <div className="mt-3 flex items-center justify-between flex-wrap gap-2">
                    {intake.status === "warning" && (
                      <div className="text-xs text-amber-600 bg-amber-50 py-1 px-2 rounded flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Low enrollment - Consider increasing marketing budget
                      </div>
                    )}
                    {intake.capacityPercentage >= 90 && (
                      <div className="text-xs text-green-600 bg-green-50 py-1 px-2 rounded flex items-center">
                        <ArrowUp className="w-3 h-3 mr-1" />
                        Near capacity - Consider closing intake soon
                      </div>
                    )}
                    {intake.enrollmentPercentage < 30 && (
                      <div className="text-xs text-red-600 bg-red-50 py-1 px-2 rounded flex items-center">
                        <ArrowDown className="w-3 h-3 mr-1" />
                        Critical: Low enrollment - AI recommends aggressive approach
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium mb-3">Sales Approach</h4>
                <ToggleGroup 
                  type="single" 
                  value={intake.approach}
                  onValueChange={(value) => {
                    if (value) {
                      handleApproachChange(
                        intake.id, 
                        value as "aggressive" | "balanced" | "neutral"
                      );
                    }
                  }}
                  className="flex justify-between"
                >
                  <ToggleGroupItem 
                    value="aggressive" 
                    className={`rounded-full px-4 py-2 ${
                      intake.approach === "aggressive" 
                        ? "bg-green-800 text-white" 
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    Aggressive
                  </ToggleGroupItem>
                  <ToggleGroupItem 
                    value="balanced" 
                    className={`rounded-full px-4 py-2 ${
                      intake.approach === "balanced" 
                        ? "bg-green-600 text-white" 
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    Balanced
                  </ToggleGroupItem>
                  <ToggleGroupItem 
                    value="neutral" 
                    className={`rounded-full px-4 py-2 ${
                      intake.approach === "neutral" 
                        ? "bg-green-500 text-white" 
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    Neutral
                  </ToggleGroupItem>
                </ToggleGroup>
                
                <div className="mt-4 text-xs text-gray-500">
                  <p className="mb-1"><strong>Current Strategy:</strong></p>
                  <ul className="list-disc pl-4 space-y-1">
                    {strategies[intake.approach]?.actions.map((action, index) => (
                      <li key={index}>{action}</li>
                    ))}
                  </ul>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-4 text-xs"
                  onClick={() => {
                    toast({
                      title: "AI notifications scheduled",
                      description: `Automated emails will be sent based on ${intake.approach} approach`,
                    });
                  }}
                >
                  Schedule AI Notifications
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default PipelinePlanner;
