import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, Plus } from "lucide-react";

export function LeadScoringConfiguration() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Lead Scoring Algorithms
            </CardTitle>
            <CardDescription>
              Configure scoring rules and weights for lead qualification
            </CardDescription>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Rule
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-muted-foreground">
          <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Lead scoring configuration will be implemented here.</p>
          <p className="text-sm">Define criteria and weights for automatic lead scoring.</p>
        </div>
      </CardContent>
    </Card>
  );
}