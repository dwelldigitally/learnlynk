import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, Plus } from "lucide-react";

export function LeadStatusConfiguration() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Lead Statuses & Priorities
            </CardTitle>
            <CardDescription>
              Manage lead status options and priority levels
            </CardDescription>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Status
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-muted-foreground">
          <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Lead status and priority configuration will be implemented here.</p>
          <p className="text-sm">Define custom statuses and priority levels for leads.</p>
        </div>
      </CardContent>
    </Card>
  );
}