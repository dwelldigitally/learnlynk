import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, UserCheck, UserX, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import hubspotService, { HubSpotOwner } from "@/services/hubspotService";
import { supabase } from "@/integrations/supabase/client";

interface OwnerMapping {
  id: string;
  hubspot_owner_id: string;
  advisor_id?: string;
  is_active: boolean;
}

export function HubSpotOwnerManagement() {
  const [owners, setOwners] = useState<HubSpotOwner[]>([]);
  const [mappings, setMappings] = useState<OwnerMapping[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    checkConnection();
    if (hubspotService.isConnected()) {
      loadOwners();
      loadMappings();
    }
  }, []);

  const checkConnection = () => {
    setIsConnected(hubspotService.isConnected());
  };

  const loadOwners = async () => {
    setIsLoading(true);
    try {
      const hubspotOwners = await hubspotService.fetchOwners();
      setOwners(hubspotOwners);
    } catch (error) {
      console.error("Failed to load owners:", error);
      toast.error("Failed to load HubSpot owners");
    } finally {
      setIsLoading(false);
    }
  };

  const loadMappings = async () => {
    try {
      const { data, error } = await supabase
        .from('owner_advisor_mappings')
        .select('*');
      
      if (error) throw error;
      setMappings(data || []);
    } catch (error) {
      console.error("Failed to load mappings:", error);
    }
  };

  const syncOwnersToDatabase = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Store owners in database
      for (const owner of owners) {
        const { error } = await supabase
          .from('hubspot_owners')
          .upsert({
            user_id: user.id,
            hubspot_owner_id: owner.id,
            email: owner.email,
            first_name: owner.firstName,
            last_name: owner.lastName,
            active: owner.active,
          }, {
            onConflict: 'hubspot_owner_id'
          });

        if (error) {
          console.error("Failed to store owner:", error);
        }
      }

      toast.success(`Synced ${owners.length} HubSpot owners to database`);
      loadMappings();
    } catch (error) {
      console.error("Failed to sync owners:", error);
      toast.error("Failed to sync owners to database");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>HubSpot Owner Management</CardTitle>
          <CardDescription>
            Connect to HubSpot to manage contact owners and lead routing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Please connect to HubSpot first to view and manage contact owners.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>HubSpot Owners</CardTitle>
              <CardDescription>
                Manage HubSpot contact owners and their lead routing assignments
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={loadOwners}
                disabled={isLoading}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button
                onClick={syncOwnersToDatabase}
                disabled={isLoading || owners.length === 0}
              >
                Sync to Database
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <RefreshCw className="w-6 h-6 animate-spin mr-2" />
              Loading HubSpot owners...
            </div>
          ) : owners.length === 0 ? (
            <div className="text-center p-8">
              <p className="text-muted-foreground">No HubSpot owners found</p>
              <Button variant="outline" onClick={loadOwners} className="mt-2">
                <RefreshCw className="w-4 h-4 mr-2" />
                Load Owners
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {owners.map((owner) => {
                const mapping = mappings.find(m => m.hubspot_owner_id === owner.id);
                
                return (
                  <div
                    key={owner.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <h4 className="font-medium">{owner.fullName || owner.email}</h4>
                        <p className="text-sm text-muted-foreground">{owner.email}</p>
                        <p className="text-xs text-muted-foreground">ID: {owner.id}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant={owner.active ? "default" : "secondary"}>
                          {owner.active ? "Active" : "Inactive"}
                        </Badge>
                        {mapping?.is_active && (
                          <Badge variant="outline">
                            <UserCheck className="w-3 h-3 mr-1" />
                            Mapped
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`https://app.hubspot.com/contacts/${owner.id}`, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {owners.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Integration Status</CardTitle>
            <CardDescription>
              HubSpot owners successfully loaded and ready for lead routing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-background rounded-lg border">
                <div className="text-2xl font-bold text-primary">{owners.length}</div>
                <p className="text-sm text-muted-foreground">Total Owners</p>
              </div>
              <div className="p-4 bg-background rounded-lg border">
                <div className="text-2xl font-bold text-primary">
                  {owners.filter(o => o.active).length}
                </div>
                <p className="text-sm text-muted-foreground">Active Owners</p>
              </div>
              <div className="p-4 bg-background rounded-lg border">
                <div className="text-2xl font-bold text-primary">
                  {mappings.filter(m => m.is_active).length}
                </div>
                <p className="text-sm text-muted-foreground">Mapped to Advisors</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}