import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, User, Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function PracticumDemoNotice() {
  const [user, setUser] = React.useState<any>(null);
  
  React.useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);
  
  // Only show this notice for admin users in the student portal
  if (!user || user.user_metadata?.user_role !== 'admin') {
    return null;
  }

  return (
    <Alert className="mb-6 border-blue-200 bg-blue-50">
      <Info className="h-4 w-4 text-blue-600" />
      <AlertDescription className="text-blue-900">
        <div className="flex items-center justify-between">
          <div>
            <strong>Demo Mode Active</strong> - You're viewing the student practicum interface as an admin user with demo data.
          </div>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <User className="h-3 w-3 mr-1" />
            Admin Preview
          </Badge>
        </div>
      </AlertDescription>
    </Alert>
  );
}