import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Phone, PhoneCall, Clock, TrendingUp, Settings, CheckCircle, AlertCircle } from 'lucide-react';
import { AircallService, AircallSettings } from '@/services/aircallService';
import { useToast } from '@/hooks/use-toast';

interface AircallIntegrationProps {
  leadId?: string;
}

export const AircallIntegration: React.FC<AircallIntegrationProps> = ({ leadId }) => {
  const [settings, setSettings] = useState<AircallSettings | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [apiId, setApiId] = useState('');
  const [apiToken, setApiToken] = useState('');
  const [callStats, setCallStats] = useState<any>(null);
  const [calls, setCalls] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
    loadCallStats();
    loadCalls();
  }, [leadId]);

  const loadSettings = async () => {
    try {
      const data = await AircallService.getSettings();
      setSettings(data);
      if (data) {
        setApiId(data.api_id || '');
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const loadCallStats = async () => {
    try {
      const stats = await AircallService.getCallStats(leadId);
      setCallStats(stats);
    } catch (error) {
      console.error('Error loading call stats:', error);
    }
  };

  const loadCalls = async () => {
    try {
      const callData = await AircallService.getCalls(leadId);
      setCalls(callData);
    } catch (error) {
      console.error('Error loading calls:', error);
    }
  };

  const handleConnect = async () => {
    if (!apiId || !apiToken) {
      toast({
        title: "Missing Credentials",
        description: "Please enter both API ID and API Token",
        variant: "destructive"
      });
      return;
    }

    setIsConnecting(true);
    try {
      // Test connection
      const isValid = await AircallService.testConnection(apiId, apiToken);
      
      if (!isValid) {
        toast({
          title: "Connection Failed",
          description: "Invalid API credentials. Please check your API ID and Token.",
          variant: "destructive"
        });
        return;
      }

      // Save settings
      await AircallService.updateSettings({
        api_id: apiId,
        api_token_encrypted: apiToken, // In production, this should be encrypted
        is_active: true,
        connection_status: 'connected',
        last_sync_at: new Date().toISOString()
      });

      await loadSettings();
      
      toast({
        title: "Connected Successfully",
        description: "Aircall integration is now active"
      });
    } catch (error) {
      console.error('Connection error:', error);
      toast({
        title: "Connection Error",
        description: "Failed to connect to Aircall. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await AircallService.updateSettings({
        is_active: false,
        connection_status: 'disconnected'
      });
      
      await loadSettings();
      
      toast({
        title: "Disconnected",
        description: "Aircall integration has been disabled"
      });
    } catch (error) {
      console.error('Disconnect error:', error);
      toast({
        title: "Error",
        description: "Failed to disconnect. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSettingChange = async (key: keyof AircallSettings, value: boolean) => {
    try {
      await AircallService.updateSettings({ [key]: value });
      await loadSettings();
      
      toast({
        title: "Settings Updated",
        description: "Your preferences have been saved"
      });
    } catch (error) {
      console.error('Settings update error:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update settings. Please try again.",
        variant: "destructive"
      });
    }
  };

  const initiateCall = async (phoneNumber: string) => {
    if (!settings || !settings.is_active) {
      toast({
        title: "Integration Not Active",
        description: "Please connect Aircall first",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);
      await AircallService.initiateCall(phoneNumber, settings);
      
      toast({
        title: "Call Initiated",
        description: `Calling ${phoneNumber}...`
      });
    } catch (error) {
      console.error('Call initiation error:', error);
      toast({
        title: "Call Failed",
        description: "Unable to initiate call. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatPhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0,3)}) ${cleaned.slice(3,6)}-${cleaned.slice(6)}`;
    }
    return phone;
  };

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: any } = {
      connected: { variant: "default", icon: CheckCircle, text: "Connected" },
      disconnected: { variant: "secondary", icon: AlertCircle, text: "Disconnected" },
      error: { variant: "destructive", icon: AlertCircle, text: "Error" }
    };
    
    const config = variants[status] || variants.disconnected;
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center space-x-1">
        <Icon className="h-3 w-3" />
        <span>{config.text}</span>
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Phone className="h-8 w-8 text-primary" />
              <div>
                <CardTitle>Aircall Integration</CardTitle>
                <CardDescription>VoIP calling and CTI features</CardDescription>
              </div>
            </div>
            {settings && getStatusBadge(settings.connection_status)}
          </div>
        </CardHeader>
        <CardContent>
          {!settings?.is_active ? (
            <div className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Connect your Aircall account to enable the floating widget for seamless calling and call management.
                </AlertDescription>
              </Alert>
              
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="api-id">API ID</Label>
                  <Input
                    id="api-id"
                    value={apiId}
                    onChange={(e) => setApiId(e.target.value)}
                    placeholder="Enter your Aircall API ID"
                  />
                </div>
                <div>
                  <Label htmlFor="api-token">API Token</Label>
                  <Input
                    id="api-token"
                    type="password"
                    value={apiToken}
                    onChange={(e) => setApiToken(e.target.value)}
                    placeholder="Enter your Aircall API Token"
                  />
                </div>
              </div>
              
              <Button 
                onClick={handleConnect}
                disabled={isConnecting || !apiId.trim() || !apiToken.trim()}
                className="w-full"
              >
                {isConnecting ? 'Connecting...' : 'Connect Aircall'}
              </Button>
            </div>
          ) : (
            <Tabs defaultValue="dashboard" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="calls">Call History</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="dashboard" className="space-y-4">
                <Alert className="mb-4">
                  <Phone className="h-4 w-4" />
                  <AlertDescription>
                    Aircall Integration is active! Click-to-call buttons are now available throughout the interface.
                    All calls will be automatically logged and synced with your leads.
                  </AlertDescription>
                </Alert>
                
                {callStats && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                          <PhoneCall className="h-4 w-4 text-primary" />
                          <div>
                            <p className="text-sm font-medium">Total Calls</p>
                            <p className="text-2xl font-bold">{callStats.total_calls}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <div>
                            <p className="text-sm font-medium">Answered</p>
                            <p className="text-2xl font-bold">{callStats.answered_calls}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                          <AlertCircle className="h-4 w-4 text-yellow-500" />
                          <div>
                            <p className="text-sm font-medium">Missed</p>
                            <p className="text-2xl font-bold">{callStats.missed_calls}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-blue-500" />
                          <div>
                            <p className="text-sm font-medium">Avg Duration</p>
                            <p className="text-2xl font-bold">{formatDuration(callStats.average_duration)}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="calls" className="space-y-4">
                <div className="space-y-2">
                  {calls.length === 0 ? (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>No calls found.</AlertDescription>
                    </Alert>
                  ) : (
                    calls.map((call) => (
                      <Card key={call.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className={`p-2 rounded-full ${
                                call.direction === 'inbound' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                              }`}>
                                <PhoneCall className="h-4 w-4" />
                              </div>
                              <div>
                                <p className="font-medium">{formatPhoneNumber(call.phone_number)}</p>
                                <p className="text-sm text-muted-foreground">
                                  {call.caller_name || 'Unknown'} • {call.direction} • {formatDuration(call.duration)}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge variant={call.status === 'answered' ? 'default' : 'secondary'}>
                                {call.status}
                              </Badge>
                              <p className="text-sm text-muted-foreground mt-1">
                                {new Date(call.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="settings" className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Auto-create leads</p>
                      <p className="text-sm text-muted-foreground">
                        Automatically create leads for unknown callers
                      </p>
                    </div>
                    <Switch 
                      checked={settings.auto_create_leads}
                      onCheckedChange={(checked) => handleSettingChange('auto_create_leads', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Auto-log calls</p>
                      <p className="text-sm text-muted-foreground">
                        Automatically log all calls to lead records
                      </p>
                    </div>
                    <Switch 
                      checked={settings.auto_log_calls}
                      onCheckedChange={(checked) => handleSettingChange('auto_log_calls', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Click-to-call</p>
                      <p className="text-sm text-muted-foreground">
                        Enable click-to-call buttons throughout the interface
                      </p>
                    </div>
                    <Switch 
                      checked={settings.click_to_call_enabled}
                      onCheckedChange={(checked) => handleSettingChange('click_to_call_enabled', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Call recordings</p>
                      <p className="text-sm text-muted-foreground">
                        Enable call recording and storage
                      </p>
                    </div>
                    <Switch 
                      checked={settings.call_recording_enabled}
                      onCheckedChange={(checked) => handleSettingChange('call_recording_enabled', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Call transcription</p>
                      <p className="text-sm text-muted-foreground">
                        Automatically transcribe call recordings
                      </p>
                    </div>
                    <Switch 
                      checked={settings.transcription_enabled}
                      onCheckedChange={(checked) => handleSettingChange('transcription_enabled', checked)}
                    />
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <Button 
                    variant="destructive" 
                    onClick={handleDisconnect}
                    className="w-full"
                  >
                    Disconnect Aircall
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
};