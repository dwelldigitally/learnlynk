import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, RefreshCw, Settings } from "lucide-react";
import hubspotService from "@/services/hubspotService";
import { supabase } from "@/integrations/supabase/client";

interface IntegrationStats {
  ownersInDatabase: number;
  contactsInDatabase: number;
  activeMappings: number;
  lastSyncTime: string | null;
}

export function HubSpotIntegrationStatus() {
  const [isConnected, setIsConnected] = useState(false);
  const [stats, setStats] = useState<IntegrationStats>({
    ownersInDatabase: 0,
    contactsInDatabase: 0,
    activeMappings: 0,
    lastSyncTime: null
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkConnectionStatus();
    loadStats();
  }, []);

  const checkConnectionStatus = async () => {
    setIsLoading(true);
    try {
      const connected = await hubspotService.testConnection();
      setIsConnected(connected);
    } catch (error) {
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get owners count
      const { count: ownersCount } = await supabase
        .from('hubspot_owners')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id);

      // Get contacts count
      const { count: contactsCount } = await supabase
        .from('hubspot_contacts')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id);

      // Get active mappings count
      const { count: mappingsCount } = await supabase
        .from('owner_advisor_mappings')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id)
        .eq('is_active', true);

      setStats({
        ownersInDatabase: ownersCount || 0,
        contactsInDatabase: contactsCount || 0,
        activeMappings: mappingsCount || 0,
        lastSyncTime: new Date().toISOString()
      });
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              HubSpot Integration Status
              {isConnected ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
            </CardTitle>
            <CardDescription>
              Monitor your HubSpot integration and data sync status
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={checkConnectionStatus}
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Check Status
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <div>
              <p className="font-medium">HubSpot API Connection</p>
              <p className="text-sm text-muted-foreground">
                {isConnected ? 'Successfully connected' : 'Not connected or authentication failed'}
              </p>
            </div>
          </div>
          <Badge variant={isConnected ? "default" : "destructive"}>
            {isConnected ? "Connected" : "Disconnected"}
          </Badge>
        </div>

        {isConnected && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-background rounded-lg border text-center">
              <div className="text-2xl font-bold text-primary">{stats.ownersInDatabase}</div>
              <p className="text-sm text-muted-foreground">HubSpot Owners</p>
              <p className="text-xs text-muted-foreground mt-1">Synced to database</p>
            </div>
            <div className="p-4 bg-background rounded-lg border text-center">
              <div className="text-2xl font-bold text-primary">{stats.contactsInDatabase}</div>
              <p className="text-sm text-muted-foreground">HubSpot Contacts</p>
              <p className="text-xs text-muted-foreground mt-1">Imported contacts</p>
            </div>
            <div className="p-4 bg-background rounded-lg border text-center">
              <div className="text-2xl font-bold text-primary">{stats.activeMappings}</div>
              <p className="text-sm text-muted-foreground">Active Mappings</p>
              <p className="text-xs text-muted-foreground mt-1">Owner to advisor mappings</p>
            </div>
          </div>
        )}

        {stats.lastSyncTime && (
          <div className="text-sm text-muted-foreground text-center">
            Last updated: {new Date(stats.lastSyncTime).toLocaleString()}
          </div>
        )}

        {!isConnected && (
          <div className="text-center p-6 bg-muted rounded-lg">
            <p className="text-muted-foreground mb-4">
              Connect to HubSpot to start importing owners and contacts for lead routing
            </p>
            <Button asChild>
              <a href="/admin/database/integrations">
                <Settings className="w-4 h-4 mr-2" />
                Configure HubSpot Integration
              </a>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}