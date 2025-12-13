import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Phone, 
  CheckCircle, 
  AlertCircle,
  Eye,
  EyeOff,
  Loader2,
  RefreshCw,
  Settings,
  Users,
  PhoneCall
} from 'lucide-react';
import { useTenant } from '@/contexts/TenantContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AircallConnection {
  id: string;
  tenant_id: string;
  api_id: string;
  api_token_encrypted: string;
  is_active: boolean;
  connection_status: string;
  last_sync_at: string | null;
  connected_at: string | null;
  auto_log_calls: boolean;
  auto_create_leads: boolean;
  call_recording_enabled: boolean;
  transcription_enabled: boolean;
}

export const AircallIntegrationSettings = () => {
  const { tenantId, isAdmin, isOwner } = useTenant();
  const { toast } = useToast();
  
  const [connection, setConnection] = useState<AircallConnection | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  
  const [apiId, setApiId] = useState('');
  const [apiToken, setApiToken] = useState('');
  const [showToken, setShowToken] = useState(false);
  
  const [settings, setSettings] = useState({
    auto_log_calls: true,
    auto_create_leads: true,
    call_recording_enabled: true,
    transcription_enabled: false
  });

  const canManage = isAdmin || isOwner;

  useEffect(() => {
    if (tenantId) {
      fetchConnection();
    }
  }, [tenantId]);

  const fetchConnection = async () => {
    if (!tenantId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('tenant_aircall_connections')
        .select('*')
        .eq('tenant_id', tenantId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setConnection(data as AircallConnection);
        setApiId(data.api_id || '');
        setSettings({
          auto_log_calls: data.auto_log_calls ?? true,
          auto_create_leads: data.auto_create_leads ?? true,
          call_recording_enabled: data.call_recording_enabled ?? true,
          transcription_enabled: data.transcription_enabled ?? false
        });
      }
    } catch (error) {
      console.error('Error fetching Aircall connection:', error);
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async () => {
    if (!apiId || !apiToken) {
      toast({
        title: "Missing credentials",
        description: "Please enter both API ID and API Token",
        variant: "destructive"
      });
      return;
    }

    setTesting(true);
    try {
      const response = await fetch('https://api.aircall.io/v1/ping', {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${btoa(`${apiId}:${apiToken}`)}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        toast({
          title: "Connection successful",
          description: "Your Aircall credentials are valid",
        });
      } else {
        const errorData = await response.json();
        toast({
          title: "Connection failed",
          description: errorData.message || "Invalid API credentials",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Connection failed",
        description: "Could not connect to Aircall API",
        variant: "destructive"
      });
    } finally {
      setTesting(false);
    }
  };

  const saveConnection = async () => {
    if (!tenantId || !apiId || !apiToken) {
      toast({
        title: "Missing credentials",
        description: "Please enter both API ID and API Token",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const connectionData = {
        tenant_id: tenantId,
        api_id: apiId,
        api_token_encrypted: apiToken,
        is_active: true,
        connection_status: 'connected',
        connected_at: new Date().toISOString(),
        connected_by: user?.id,
        ...settings
      };

      if (connection) {
        const { error } = await supabase
          .from('tenant_aircall_connections')
          .update(connectionData)
          .eq('id', connection.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('tenant_aircall_connections')
          .insert(connectionData);

        if (error) throw error;
      }

      toast({
        title: "Connection saved",
        description: "Aircall integration has been configured successfully",
      });
      
      fetchConnection();
    } catch (error: any) {
      console.error('Error saving Aircall connection:', error);
      toast({
        title: "Error saving connection",
        description: error.message || "Failed to save Aircall configuration",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const disconnectAircall = async () => {
    if (!connection) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('tenant_aircall_connections')
        .update({
          is_active: false,
          connection_status: 'disconnected'
        })
        .eq('id', connection.id);

      if (error) throw error;

      toast({
        title: "Disconnected",
        description: "Aircall integration has been disconnected",
      });
      
      fetchConnection();
    } catch (error: any) {
      toast({
        title: "Error disconnecting",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const isConnected = connection?.is_active && connection?.connection_status === 'connected';

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Phone className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Aircall Integration</CardTitle>
              <CardDescription>
                Connect your institution's Aircall account for click-to-call and call tracking
              </CardDescription>
            </div>
          </div>
          <Badge 
            variant={isConnected ? "default" : "secondary"} 
            className="flex items-center space-x-1"
          >
            {isConnected ? (
              <>
                <CheckCircle className="h-3 w-3" />
                <span>Connected</span>
              </>
            ) : (
              <>
                <AlertCircle className="h-3 w-3" />
                <span>Disconnected</span>
              </>
            )}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {isConnected && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Last synchronized: {connection?.last_sync_at 
                ? new Date(connection.last_sync_at).toLocaleString() 
                : 'Never'}
            </AlertDescription>
          </Alert>
        )}

        {/* API Credentials */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <Settings className="h-4 w-4" />
            API Credentials
          </h4>
          <p className="text-sm text-muted-foreground">
            Get your API credentials from your Aircall dashboard under{' '}
            <span className="font-medium">Settings → Integrations → API Keys</span>
          </p>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="api-id">API ID</Label>
              <Input
                id="api-id"
                value={apiId}
                onChange={(e) => setApiId(e.target.value)}
                placeholder="Enter your Aircall API ID"
                disabled={!canManage}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="api-token">API Token</Label>
              <div className="flex space-x-2">
                <Input
                  id="api-token"
                  type={showToken ? 'text' : 'password'}
                  value={apiToken}
                  onChange={(e) => setApiToken(e.target.value)}
                  placeholder="Enter your Aircall API Token"
                  disabled={!canManage}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setShowToken(!showToken)}
                >
                  {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Integration Settings */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <PhoneCall className="h-4 w-4" />
            Call Settings
          </h4>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Auto-log calls</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically log all calls to lead records
                </p>
              </div>
              <Switch
                checked={settings.auto_log_calls}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, auto_log_calls: checked }))
                }
                disabled={!canManage}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Auto-create leads</Label>
                <p className="text-sm text-muted-foreground">
                  Create new leads for unknown caller numbers
                </p>
              </div>
              <Switch
                checked={settings.auto_create_leads}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, auto_create_leads: checked }))
                }
                disabled={!canManage}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Call recording</Label>
                <p className="text-sm text-muted-foreground">
                  Enable call recording (must be enabled in Aircall)
                </p>
              </div>
              <Switch
                checked={settings.call_recording_enabled}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, call_recording_enabled: checked }))
                }
                disabled={!canManage}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Transcription</Label>
                <p className="text-sm text-muted-foreground">
                  Enable call transcription (requires Aircall AI add-on)
                </p>
              </div>
              <Switch
                checked={settings.transcription_enabled}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, transcription_enabled: checked }))
                }
                disabled={!canManage}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* User Access Info */}
        <div className="space-y-2">
          <h4 className="font-medium flex items-center gap-2">
            <Users className="h-4 w-4" />
            User Access
          </h4>
          <p className="text-sm text-muted-foreground">
            Team members need their own Aircall user accounts to make calls. 
            Invite users in your Aircall dashboard, then they can login to the 
            Aircall phone widget in LearnLynk with their personal credentials.
          </p>
        </div>

        {/* Action Buttons */}
        {canManage && (
          <div className="flex flex-wrap gap-2 pt-4">
            <Button 
              onClick={saveConnection} 
              disabled={saving || !apiId || !apiToken}
            >
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isConnected ? 'Update Connection' : 'Connect Aircall'}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={testConnection}
              disabled={testing || !apiId || !apiToken}
            >
              {testing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              Test Connection
            </Button>
            
            {isConnected && (
              <Button 
                variant="destructive" 
                onClick={disconnectAircall}
                disabled={saving}
              >
                Disconnect
              </Button>
            )}
          </div>
        )}

        {!canManage && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Only tenant administrators can manage Aircall integration settings.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
