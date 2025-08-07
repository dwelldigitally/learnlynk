import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Route, Plus } from "lucide-react";

export function LeadRoutingRulesConfiguration() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Route className="h-5 w-5" />
              Lead Routing Rules
            </CardTitle>
            <CardDescription>
              Configure automatic lead assignment and routing strategies
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
          <Route className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Routing rules configuration will be implemented here.</p>
          <p className="text-sm">Define how leads are automatically assigned to advisors.</p>
        </div>
      </CardContent>
    </Card>
  );
}