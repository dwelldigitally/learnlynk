import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Mail, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Loader2,
  RefreshCw,
  ExternalLink,
  Link,
  Unlink,
  Bell,
  Inbox,
  CalendarDays,
  Sparkles
} from 'lucide-react';
import { useOutlookConnection } from '@/hooks/useOutlookConnection';
import { OutlookService } from '@/services/outlookService';
import { useToast } from '@/hooks/use-toast';

export function OutlookIntegrationSettings() {
  const { toast } = useToast();
  const { connectionStatus, loading, connecting, connect, disconnect, refresh } = useOutlookConnection();
  const [syncing, setSyncing] = useState(false);
  const [creatingSubscriptions, setCreatingSubscriptions] = useState(false);

  const handleSyncEmails = async () => {
    setSyncing(true);
    try {
      const result = await OutlookService.syncEmails({ top: 50 });
      toast({
        title: 'Emails Synced',
        description: `Synced ${result.newlySynced} new emails (${result.totalFetched} total)`,
      });
    } catch (error) {
      toast({
        title: 'Sync Failed',
        description: 'Failed to sync emails from Outlook',
        variant: 'destructive',
      });
    } finally {
      setSyncing(false);
    }
  };

  const handleSyncCalendar = async () => {
    setSyncing(true);
    try {
      const result = await OutlookService.syncCalendarEvents();
      toast({
        title: 'Calendar Synced',
        description: `Synced ${result.syncedEvents.length} events`,
      });
    } catch (error) {
      toast({
        title: 'Sync Failed',
        description: 'Failed to sync calendar from Outlook',
        variant: 'destructive',
      });
    } finally {
      setSyncing(false);
    }
  };

  const handleEnableRealTime = async () => {
    setCreatingSubscriptions(true);
    try {
      await OutlookService.createEmailSubscription();
      await OutlookService.createCalendarSubscription();
      toast({
        title: 'Real-time Sync Enabled',
        description: 'You will receive instant updates for emails and calendar events',
      });
    } catch (error) {
      toast({
        title: 'Failed to Enable',
        description: 'Could not create real-time subscriptions',
        variant: 'destructive',
      });
    } finally {
      setCreatingSubscriptions(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Mail className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                Microsoft Outlook
                {connectionStatus.connected ? (
                  <Badge variant="default" className="bg-emerald-500">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Connected
                  </Badge>
                ) : (
                  <Badge variant="secondary">
                    <XCircle className="h-3 w-3 mr-1" />
                    Not Connected
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                {connectionStatus.connected 
                  ? `Connected as ${connectionStatus.email}` 
                  : 'Connect your Outlook account for email and calendar integration'}
              </CardDescription>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={refresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {!connectionStatus.connected ? (
          <div className="flex flex-col items-center py-6 space-y-4">
            <div className="flex items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
                <Mail className="h-5 w-5" />
                <span>Email</span>
              </div>
              <span>+</span>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
                <Calendar className="h-5 w-5" />
                <span>Calendar</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground text-center max-w-md">
              Connect your Microsoft Outlook account to send emails from your real inbox, 
              sync calendar events, and receive real-time notifications.
            </p>
            <Button onClick={connect} disabled={connecting} size="lg">
              {connecting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Link className="h-4 w-4 mr-2" />
              )}
              Connect Outlook
            </Button>
          </div>
        ) : (
          <>
            {/* Email Integration */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Inbox className="h-4 w-4 text-primary" />
                <h4 className="font-medium">Email Integration</h4>
              </div>
              
              <div className="grid gap-3 pl-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Send via Outlook</Label>
                    <p className="text-sm text-muted-foreground">
                      Emails sent from LearnLynk will appear in your Outlook Sent folder
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto-sync Inbox</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically sync incoming emails and match to leads
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleSyncEmails} 
                  disabled={syncing}
                  className="w-fit"
                >
                  {syncing ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-2" />
                  )}
                  Sync Emails Now
                </Button>
              </div>
            </div>

            <Separator />

            {/* Calendar Integration */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-primary" />
                <h4 className="font-medium">Calendar Integration</h4>
              </div>
              
              <div className="grid gap-3 pl-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Sync to Outlook</Label>
                    <p className="text-sm text-muted-foreground">
                      Meetings booked in LearnLynk appear in your Outlook calendar
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Check Availability</Label>
                    <p className="text-sm text-muted-foreground">
                      Use Outlook free/busy to prevent double-booking
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Teams Meetings</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically create Teams meeting links for virtual meetings
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleSyncCalendar} 
                  disabled={syncing}
                  className="w-fit"
                >
                  {syncing ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-2" />
                  )}
                  Sync Calendar Now
                </Button>
              </div>
            </div>

            <Separator />

            {/* Real-time Notifications */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-primary" />
                <h4 className="font-medium">Real-time Updates</h4>
                <Badge variant="outline" className="text-xs">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Recommended
                </Badge>
              </div>
              
              <div className="grid gap-3 pl-6">
                <p className="text-sm text-muted-foreground">
                  Enable real-time sync to instantly receive new emails and calendar updates 
                  without manual refresh.
                </p>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleEnableRealTime} 
                  disabled={creatingSubscriptions}
                  className="w-fit"
                >
                  {creatingSubscriptions ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Bell className="h-4 w-4 mr-2" />
                  )}
                  Enable Real-time Sync
                </Button>
              </div>
            </div>

            <Separator />

            {/* Disconnect */}
            <div className="flex items-center justify-between pt-2">
              <div>
                <Label className="text-destructive">Disconnect Outlook</Label>
                <p className="text-sm text-muted-foreground">
                  Remove connection and stop syncing
                </p>
              </div>
              <Button variant="destructive" size="sm" onClick={disconnect}>
                <Unlink className="h-4 w-4 mr-2" />
                Disconnect
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
