import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Mail, MessageSquare, Phone, Clock, AlertCircle, Reply, Sparkles, Zap } from 'lucide-react';
import { LeadCommunicationService } from '@/services/leadCommunicationService';
import { AutoReplyDialog } from './AutoReplyDialog';
import { BulkAutoReplyDialog } from './BulkAutoReplyDialog';

interface Communication {
  id: string;
  lead_id: string;
  type: string;
  subject?: string;
  content: string;
  direction: string;
  communication_date: string;
  lead_name?: string;
  is_urgent?: boolean;
}

export function UnreadCommunications() {
  const isMobile = useIsMobile();
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCommunication, setSelectedCommunication] = useState<Communication | null>(null);
  const [autoReplyOpen, setAutoReplyOpen] = useState(false);
  const [bulkAutoReplyOpen, setBulkAutoReplyOpen] = useState(false);

  useEffect(() => {
    loadUnreadCommunications();
  }, []);

  const loadUnreadCommunications = async () => {
    try {
      // Enhanced mock communications with more variety
      const mockCommunications: Communication[] = [
        {
          id: '1',
          lead_id: 'lead-1',
          type: 'email',
          subject: 'Re: MBA Program Inquiry - Application Deadline Question',
          content: 'Hi! Thank you for the detailed information about the MBA program. I have a few urgent questions about the application deadline and required documents. When is the latest I can submit my application for the Spring intake? Also, do I need to submit GMAT scores immediately or can I send them later?',
          direction: 'inbound',
          communication_date: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          lead_name: 'Sarah Johnson',
          is_urgent: true
        },
        {
          id: '2',
          lead_id: 'lead-2',
          type: 'sms',
          subject: undefined,
          content: 'Hi, can we schedule a call to discuss the program fees and scholarship opportunities? I\'m very interested but need to understand the financial aspects better.',
          direction: 'inbound',
          communication_date: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
          lead_name: 'Michael Chen'
        },
        {
          id: '3',
          lead_id: 'lead-3',
          type: 'email',
          subject: 'Application Status Update Request',
          content: 'Hello! I submitted my application last week and wanted to check on the status. I\'m particularly anxious about the interview process timing as I need to plan my schedule accordingly.',
          direction: 'inbound',
          communication_date: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          lead_name: 'Emily Rodriguez'
        },
        {
          id: '4',
          lead_id: 'lead-4',
          type: 'email',
          subject: 'Program Comparison - MBA vs Executive MBA',
          content: 'I\'ve been reviewing both the MBA and Executive MBA programs. Could you help me understand which would be better for someone with 8 years of work experience? I\'m looking for career advancement opportunities.',
          direction: 'inbound',
          communication_date: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
          lead_name: 'David Kim',
          is_urgent: false
        },
        {
          id: '5',
          lead_id: 'lead-5',
          type: 'sms',
          subject: undefined,
          content: 'Thank you for the brochure! The program looks amazing. Can we set up a campus visit next week?',
          direction: 'inbound',
          communication_date: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          lead_name: 'Lisa Wang'
        }
      ];
      
      setCommunications(mockCommunications);
    } catch (error) {
      console.error('Failed to load unread communications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="w-3 h-3" />;
      case 'sms': return <MessageSquare className="w-3 h-3" />;
      case 'call': return <Phone className="w-3 h-3" />;
      default: return <Mail className="w-3 h-3" />;
    }
  };

  const formatTimeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const handleReply = (comm: Communication) => {
    // Handle reply action
    console.log('Reply to:', comm);
  };

  const handleAutoReply = (comm: Communication) => {
    setSelectedCommunication(comm);
    setAutoReplyOpen(true);
  };

  const handleSingleReplySuccess = (communicationId: string) => {
    // Remove the replied communication from the list
    setCommunications(prev => prev.filter(comm => comm.id !== communicationId));
  };

  const handleBulkAutoReply = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setBulkAutoReplyOpen(true);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Unread Communications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-muted rounded-lg h-20"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="pb-3 p-6">
        <div className="text-base flex items-center gap-2">
          <Badge variant="destructive" className="ml-auto">{communications.length}</Badge>
          {communications.length > 1 && (
            <Button 
              size="sm" 
              variant="outline" 
              className="h-6 px-2 text-xs gap-1"
              onClick={handleBulkAutoReply}
            >
              <Zap className="w-3 h-3" />
              Auto Reply All
            </Button>
          )}
        </div>
      </div>
      <div className="p-6 pt-0">
        {communications.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Mail className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">All caught up!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {communications.map((comm) => (
              <div
                key={comm.id}
                className={cn(
                  "p-3 rounded-lg border transition-colors",
                  comm.is_urgent 
                    ? "border-destructive/20 bg-destructive/5" 
                    : "border-border hover:bg-muted/50"
                )}
              >
                <div className="flex items-start gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="text-xs">
                      {comm.lead_name?.split(' ').map(n => n[0]).join('') || 'UN'}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm truncate">
                        {comm.lead_name || 'Unknown Contact'}
                      </p>
                      {comm.is_urgent && (
                        <AlertCircle className="w-3 h-3 text-destructive" />
                      )}
                      <div className="flex items-center gap-1 ml-auto">
                        {getTypeIcon(comm.type)}
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {formatTimeAgo(comm.communication_date)}
                        </span>
                      </div>
                    </div>
                    
                    {comm.subject && (
                      <p className="text-xs font-medium text-foreground mb-1 truncate">
                        {comm.subject}
                      </p>
                    )}
                    
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                      {comm.content}
                    </p>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 px-2 text-xs"
                        onClick={() => handleReply(comm)}
                      >
                        <Reply className="w-3 h-3 mr-1" />
                        Reply
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="default"
                        className="h-7 px-2 text-xs gap-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                        onClick={() => handleAutoReply(comm)}
                      >
                        <Sparkles className="w-3 h-3" />
                        AI Reply
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <AutoReplyDialog
          open={autoReplyOpen}
          onOpenChange={setAutoReplyOpen}
          communication={selectedCommunication}
          onReplyGenerated={(reply) => {
            console.log('Reply generated:', reply);
          }}
          onReplySent={() => {
            if (selectedCommunication) {
              handleSingleReplySuccess(selectedCommunication.id);
            }
          }}
        />

        <BulkAutoReplyDialog
          open={bulkAutoReplyOpen}
          onOpenChange={setBulkAutoReplyOpen}
          communications={communications}
          onRepliesSent={(sentReplies) => {
            console.log('Bulk replies sent:', sentReplies);
            // Remove replied communications from the list
            const repliedCommunicationIds = sentReplies.map(reply => reply.communicationId);
            setCommunications(prev => 
              prev.filter(comm => !repliedCommunicationIds.includes(comm.id))
            );
          }}
        />
      </div>
    </div>
  );
}