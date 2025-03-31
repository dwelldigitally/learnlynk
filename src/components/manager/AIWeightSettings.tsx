
import React, { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AIWeightSettings: React.FC = () => {
  const { toast } = useToast();
  const [weights, setWeights] = useState({
    responseTime: 80,
    industryExpertise: 65,
    workloadBalance: 50,
    dealSize: 40,
    geography: 30,
    leadSource: 45,
    priorSuccess: 70
  });
  const [command, setCommand] = useState("");

  const handleWeightChange = (factor: keyof typeof weights, value: number[]) => {
    setWeights(prev => ({
      ...prev,
      [factor]: value[0]
    }));
  };

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!command.trim()) return;
    
    // Simple NLP simulation - in a real app this would be more sophisticated
    const lowerCommand = command.toLowerCase();
    
    if (lowerCommand.includes("response time") || lowerCommand.includes("response speed")) {
      const newValue = lowerCommand.includes("high") ? 90 : 
                       lowerCommand.includes("medium") ? 50 : 
                       lowerCommand.includes("low") ? 20 : 70;
                       
      setWeights(prev => ({
        ...prev,
        responseTime: newValue
      }));
      
      toast({
        title: "Weight Updated",
        description: `Response time importance set to ${newValue}%`,
      });
    } else if (lowerCommand.includes("geography") || lowerCommand.includes("location")) {
      const newValue = lowerCommand.includes("high") ? 80 : 
                       lowerCommand.includes("medium") ? 50 : 
                       lowerCommand.includes("low") ? 20 : 60;
                       
      setWeights(prev => ({
        ...prev,
        geography: newValue
      }));
      
      toast({
        title: "Weight Updated",
        description: `Geographic proximity importance set to ${newValue}%`,
      });
    } else {
      toast({
        title: "Command Processed",
        description: "Your settings have been adjusted based on your input",
      });
    }
    
    setCommand("");
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Response Time</span>
              <Badge variant="outline">{weights.responseTime}%</Badge>
            </div>
            <Slider
              min={0}
              max={100}
              step={5}
              value={[weights.responseTime]}
              onValueChange={(value) => handleWeightChange("responseTime", value)}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Industry Expertise</span>
              <Badge variant="outline">{weights.industryExpertise}%</Badge>
            </div>
            <Slider
              min={0}
              max={100}
              step={5}
              value={[weights.industryExpertise]}
              onValueChange={(value) => handleWeightChange("industryExpertise", value)}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Workload Balance</span>
              <Badge variant="outline">{weights.workloadBalance}%</Badge>
            </div>
            <Slider
              min={0}
              max={100}
              step={5}
              value={[weights.workloadBalance]}
              onValueChange={(value) => handleWeightChange("workloadBalance", value)}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Deal Size Alignment</span>
              <Badge variant="outline">{weights.dealSize}%</Badge>
            </div>
            <Slider
              min={0}
              max={100}
              step={5}
              value={[weights.dealSize]}
              onValueChange={(value) => handleWeightChange("dealSize", value)}
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Geographic Proximity</span>
              <Badge variant="outline">{weights.geography}%</Badge>
            </div>
            <Slider
              min={0}
              max={100}
              step={5}
              value={[weights.geography]}
              onValueChange={(value) => handleWeightChange("geography", value)}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Lead Source Familiarity</span>
              <Badge variant="outline">{weights.leadSource}%</Badge>
            </div>
            <Slider
              min={0}
              max={100}
              step={5}
              value={[weights.leadSource]}
              onValueChange={(value) => handleWeightChange("leadSource", value)}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Prior Success Rate</span>
              <Badge variant="outline">{weights.priorSuccess}%</Badge>
            </div>
            <Slider
              min={0}
              max={100}
              step={5}
              value={[weights.priorSuccess]}
              onValueChange={(value) => handleWeightChange("priorSuccess", value)}
            />
          </div>
        </div>
      </div>
      
      <div className="pt-4 border-t">
        <h3 className="text-md font-medium mb-2">Text-Based Commands</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Fine-tune the AI with natural language commands
        </p>
        
        <form onSubmit={handleCommandSubmit} className="flex gap-2">
          <Input
            placeholder="e.g., 'Prioritize response time over geography'"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            className="flex-1"
          />
          <Button type="submit">
            <Send className="h-4 w-4" />
          </Button>
        </form>
        
        <div className="mt-3 text-xs text-muted-foreground">
          Example commands: "Make geography more important", "Set response time to high priority"
        </div>
      </div>
    </div>
  );
};

export default AIWeightSettings;
