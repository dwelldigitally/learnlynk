import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { 
  Mail,
  Search,
  Paperclip,
  Star,
  Reply,
  RefreshCw,
  ExternalLink,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { useOutlookConnection } from '@/hooks/useOutlookConnection';
import { OutlookService } from '@/services/outlookService';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface EmailItem {
  id: string;
  subject?: string | null;
  from_email?: string | null;
  from_name?: string | null;
  received_at?: string | null;
  sent_at?: string | null;
  body_preview?: string | null;
  is_read?: boolean | null;
  has_attachments?: boolean | null;
  importance?: string | null;
  direction?: string | null;
}

export function OutlookEmailWidget() {
  const { connectionStatus, loading: connectionLoading, connect } = useOutlookConnection();
  const [emails, setEmails] = useState<EmailItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (connectionStatus.connected) {
      loadEmails();
    } else {
      setLoading(false);
    }
  }, [connectionStatus.connected]);

  const loadEmails = async () => {
    setLoading(true);
    try {
      // Fetch emails from local database (already synced)
      const { data, error } = await supabase
        .from('emails')
        .select('*')
        .eq('sent_via_outlook', true)
        .order('received_at', { ascending: false, nullsFirst: false })
        .order('sent_at', { ascending: false, nullsFirst: false })
        .limit(20);

      if (error) throw error;
      setEmails(data || []);
    } catch (error) {
      console.error('Error loading emails:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const result = await OutlookService.syncEmails({ top: 50 });
      toast.success(`Synced ${result.newlySynced} new emails`);
      await loadEmails();
    } catch (error) {
      console.error('Error syncing emails:', error);
      toast.error('Failed to sync emails');
    } finally {
      setSyncing(false);
    }
  };

  const filteredEmails = emails.filter(email =>
    email.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    email.from_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    email.from_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    email.body_preview?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const unreadCount = emails.filter(email => !email.is_read && email.direction === 'inbound').length;

  if (connectionLoading) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!connectionStatus.connected) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mail className="h-5 w-5" />
            <span>Outlook Email</span>
          </CardTitle>
          <CardDescription>
            Connect your Outlook account to sync emails
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8 space-y-4">
          <div className="p-4 rounded-full bg-blue-500/10">
            <Mail className="h-12 w-12 text-blue-600" />
          </div>
          <div className="text-center space-y-2">
            <h3 className="font-medium">Connect Outlook Email</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              Send and receive emails from your real Outlook inbox, 
              automatically linked to your leads
            </p>
          </div>
          <Button onClick={connect}>
            <ExternalLink className="h-4 w-4 mr-2" />
            Connect Outlook
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Mail className="h-5 w-5" />
            <CardTitle>Outlook Email</CardTitle>
            <Badge variant="default" className="bg-emerald-500 text-xs">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Connected
            </Badge>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadCount} unread
              </Badge>
            )}
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleSync}
            disabled={syncing}
          >
            {syncing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        </div>
        <CardDescription>
          {connectionStatus.email} • Synced emails from Outlook
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search emails..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2 p-3 border rounded-lg">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-3 w-full" />
              </div>
            ))}
          </div>
        ) : filteredEmails.length === 0 ? (
          <div className="text-center py-8 space-y-4">
            <Mail className="h-12 w-12 text-muted-foreground mx-auto" />
            <div className="space-y-2">
              <h3 className="font-medium">
                {searchQuery ? 'No matching emails' : 'No emails synced yet'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {searchQuery ? 'Try a different search term' : 'Click sync to fetch your emails'}
              </p>
            </div>
            {!searchQuery && (
              <Button variant="outline" size="sm" onClick={handleSync} disabled={syncing}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Sync Now
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredEmails.map((email) => (
              <div
                key={email.id}
                className={`p-3 rounded-lg border cursor-pointer transition-colors hover:bg-muted/50 ${
                  !email.is_read && email.direction === 'inbound' 
                    ? 'bg-blue-50/50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800' 
                    : 'bg-card'
                }`}
              >
                <div className="flex items-start justify-between space-x-2">
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center space-x-2">
                      <Badge variant={email.direction === 'inbound' ? 'secondary' : 'outline'} className="text-xs">
                        {email.direction === 'inbound' ? 'Received' : 'Sent'}
                      </Badge>
                      <h4 className={`font-medium text-sm truncate ${
                        !email.is_read && email.direction === 'inbound' ? 'font-semibold' : ''
                      }`}>
                        {email.subject || '(No Subject)'}
                      </h4>
                      
                      <div className="flex items-center space-x-1">
                        {email.importance === 'high' && (
                          <AlertCircle className="h-3 w-3 text-red-500" />
                        )}
                        {email.has_attachments && (
                          <Paperclip className="h-3 w-3 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="truncate font-medium">
                        {email.from_name || email.from_email}
                      </span>
                      <span className="whitespace-nowrap ml-2">
                        {email.received_at || email.sent_at 
                          ? format(new Date(email.received_at || email.sent_at!), 'MMM dd, h:mm a')
                          : '-'
                        }
                      </span>
                    </div>

                    {email.body_preview && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {email.body_preview}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {emails.length > 0 && (
          <div className="flex justify-center pt-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.open('https://outlook.live.com/mail', '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open in Outlook
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
