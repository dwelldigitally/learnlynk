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
  Archive,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';
import { MicrosoftGraphService } from '@/services/microsoftGraphService';
import { format } from 'date-fns';

interface OutlookEmail {
  id: string;
  subject: string;
  sender: {
    emailAddress: {
      name: string;
      address: string;
    };
  };
  receivedDateTime: string;
  bodyPreview: string;
  importance: 'low' | 'normal' | 'high';
  isRead: boolean;
  hasAttachments: boolean;
  flag?: {
    flagStatus: string;
  };
}

export function OutlookEmailWidget() {
  const [emails, setEmails] = useState<OutlookEmail[]>([]);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmail, setSelectedEmail] = useState<OutlookEmail | null>(null);
  const [demoMode, setDemoMode] = useState(true);

  useEffect(() => {
    // Always start in demo mode
    enableDemoMode();
  }, []);

  const checkConnection = async () => {
    try {
      const token = localStorage.getItem('outlook_access_token');
      if (token) {
        setAccessToken(token);
        setIsConnected(true);
        await loadRecentEmails(token);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error checking Outlook connection:', error);
      setLoading(false);
    }
  };

  const loadDemoEmails = () => {
    setLoading(true);
    try {
      // Generate sample demo emails inline
      const sampleEmails: OutlookEmail[] = [
        {
          id: 'demo-1',
          subject: 'Welcome to LearnLynk',
          sender: { emailAddress: { name: 'Support Team', address: 'support@learnlynk.com' } },
          receivedDateTime: new Date().toISOString(),
          bodyPreview: 'Welcome to LearnLynk! Get started with your CRM today.',
          importance: 'normal',
          isRead: false,
          hasAttachments: false
        },
        {
          id: 'demo-2',
          subject: 'Program Inquiry',
          sender: { emailAddress: { name: 'John Smith', address: 'john.smith@email.com' } },
          receivedDateTime: new Date(Date.now() - 3600000).toISOString(),
          bodyPreview: 'I am interested in learning more about your healthcare programs.',
          importance: 'high',
          isRead: false,
          hasAttachments: false
        }
      ];
      setEmails(sampleEmails);
    } catch (error) {
      console.error('Error loading demo emails:', error);
      toast.error('Failed to load demo emails');
    } finally {
      setLoading(false);
    }
  };

  const enableDemoMode = () => {
    setDemoMode(true);
    setIsConnected(true);
    loadDemoEmails();
  };

  const connectOutlook = async () => {
    try {
      const authUrl = MicrosoftGraphService.getAuthUrl();
      window.open(authUrl, '_blank', 'width=500,height=600');
      
      // Listen for auth completion
      const handleAuthMessage = (event: MessageEvent) => {
        if (event.data.type === 'OUTLOOK_AUTH_SUCCESS') {
          setAccessToken(event.data.accessToken);
          setIsConnected(true);
          localStorage.setItem('outlook_access_token', event.data.accessToken);
          loadRecentEmails(event.data.accessToken);
          window.removeEventListener('message', handleAuthMessage);
        }
      };
      
      window.addEventListener('message', handleAuthMessage);
    } catch (error) {
      console.error('Error connecting to Outlook:', error);
      toast.error('Failed to connect to Outlook');
    }
  };

  const loadRecentEmails = async (token: string) => {
    setLoading(true);
    try {
      const response = await MicrosoftGraphService.getInboxEmails(token, {
        top: 20,
        orderby: 'receivedDateTime desc'
      });

      // Convert MicrosoftGraphMessage to OutlookEmail format
      const convertedEmails: OutlookEmail[] = response?.value?.map((msg: any) => ({
        id: msg.id,
        subject: msg.subject,
        sender: msg.sender,
        receivedDateTime: msg.receivedDateTime,
        bodyPreview: msg.bodyPreview,
        importance: msg.importance,
        isRead: msg.isRead,
        hasAttachments: msg.hasAttachments,
        flag: msg.flag
      })) || [];
      
      setEmails(convertedEmails);
    } catch (error) {
      console.error('Error loading emails:', error);
      toast.error('Failed to load emails');
    } finally {
      setLoading(false);
    }
  };

  const refreshEmails = () => {
    if (demoMode) {
      loadDemoEmails();
    } else if (accessToken) {
      loadRecentEmails(accessToken);
    }
  };

  const markAsRead = async (emailId: string) => {
    if (demoMode) {
      // Demo mode - just update local state
      setEmails(emails.map(email => 
        email.id === emailId ? { ...email, isRead: true } : email
      ));
      return;
    }
    
    if (!accessToken) return;
    
    try {
      await MicrosoftGraphService.updateEmailReadStatus(emailId, accessToken, true);
      setEmails(emails.map(email => 
        email.id === emailId ? { ...email, isRead: true } : email
      ));
    } catch (error) {
      console.error('Error marking email as read:', error);
      toast.error('Failed to mark email as read');
    }
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'high': return 'text-red-600';
      case 'normal': return 'text-blue-600';
      case 'low': return 'text-gray-400';
      default: return 'text-blue-600';
    }
  };

  const filteredEmails = emails.filter(email =>
    email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    email.sender.emailAddress.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    email.bodyPreview.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const unreadCount = emails.filter(email => !email.isRead).length;

  if (!isConnected) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mail className="h-5 w-5" />
            <span>Outlook Email</span>
          </CardTitle>
          <CardDescription>
            Connect your Outlook email to see recent messages
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8 space-y-4">
          <Mail className="h-12 w-12 text-muted-foreground" />
          <div className="text-center space-y-2">
            <h3 className="font-medium">Connect Outlook Email</h3>
            <p className="text-sm text-muted-foreground">
              View and manage your emails from Outlook
            </p>
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={connectOutlook}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Connect Outlook
            </Button>
            <Button variant="outline" onClick={enableDemoMode}>
              <Mail className="h-4 w-4 mr-2" />
              Demo Mode
            </Button>
          </div>
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
            {demoMode && (
              <Badge variant="secondary" className="text-xs">
                Demo Mode
              </Badge>
            )}
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadCount} unread
              </Badge>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={refreshEmails}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription>
          {demoMode ? 'Demo emails for product demonstration' : 'Recent emails from your Outlook inbox'}
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
                {searchQuery ? 'No matching emails' : 'No emails found'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {searchQuery ? 'Try a different search term' : 'Your inbox is empty'}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredEmails.map((email) => (
              <div
                key={email.id}
                className={`p-3 rounded-lg border cursor-pointer transition-colors hover:bg-muted/50 ${
                  !email.isRead ? 'bg-blue-50/50 border-blue-200' : 'bg-card'
                }`}
                onClick={() => {
                  setSelectedEmail(email);
                  if (!email.isRead) {
                    markAsRead(email.id);
                  }
                }}
              >
                <div className="flex items-start justify-between space-x-2">
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center space-x-2">
                      <h4 className={`font-medium text-sm truncate ${
                        !email.isRead ? 'font-semibold' : ''
                      }`}>
                        {email.subject || '(No Subject)'}
                      </h4>
                      
                      <div className="flex items-center space-x-1">
                        {email.importance === 'high' && (
                          <span className="text-red-500 text-lg">!</span>
                        )}
                        {email.hasAttachments && (
                          <Paperclip className="h-3 w-3 text-muted-foreground" />
                        )}
                        {email.flag?.flagStatus === 'flagged' && (
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="truncate font-medium">
                        {email.sender.emailAddress.name || email.sender.emailAddress.address}
                      </span>
                      <span className="whitespace-nowrap ml-2">
                        {format(new Date(email.receivedDateTime), 'MMM dd, h:mm a')}
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {email.bodyPreview}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {emails.length > 0 && !demoMode && (
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
        
        {demoMode && (
          <div className="flex justify-center pt-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setDemoMode(false);
                setIsConnected(false);
                setEmails([]);
              }}
            >
              Exit Demo Mode
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}