import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Mail, MessageSquare, Phone, Clock, AlertCircle, Reply, Sparkles, Zap } from 'lucide-react';
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

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'email': return 'bg-[hsl(200,80%,92%)] text-[hsl(200,80%,40%)]';
      case 'sms': return 'bg-[hsl(158,64%,90%)] text-[hsl(158,64%,35%)]';
      case 'call': return 'bg-[hsl(245,90%,94%)] text-primary';
      default: return 'bg-muted text-muted-foreground';
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
    console.log('Reply to:', comm);
  };

  const handleAutoReply = (comm: Communication) => {
    setSelectedCommunication(comm);
    setAutoReplyOpen(true);
  };

  const handleSingleReplySuccess = (communicationId: string) => {
    setCommunications(prev => prev.filter(comm => comm.id !== communicationId));
  };

  const handleBulkAutoReply = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setBulkAutoReplyOpen(true);
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse bg-muted rounded-2xl h-24"></div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-2 mb-4">
        <Badge className="bg-[hsl(24,95%,92%)] text-[hsl(24,95%,40%)] border-0 rounded-full px-3 py-1 text-xs font-medium ml-auto">
          {communications.length} unread
        </Badge>
        {communications.length > 1 && (
          <Button 
            size="sm" 
            variant="outline" 
            className="h-7 px-3 text-xs gap-1.5 rounded-full border-border hover:bg-[hsl(245,90%,94%)] hover:border-primary/30"
            onClick={handleBulkAutoReply}
          >
            <Zap className="w-3 h-3" />
            Auto Reply All
          </Button>
        )}
      </div>
      
      <div className="space-y-3">
        {communications.length === 0 ? (
          <div className="text-center py-10">
            <div className="p-4 bg-[hsl(158,64%,90%)] rounded-2xl w-14 h-14 mx-auto mb-4 flex items-center justify-center">
              <Mail className="w-6 h-6 text-[hsl(158,64%,40%)]" />
            </div>
            <p className="font-semibold text-foreground">All caught up!</p>
            <p className="text-sm text-muted-foreground mt-1">No unread messages</p>
          </div>
        ) : (
          <>
            {communications.map((comm) => (
              <div
                key={comm.id}
                className={cn(
                  "p-4 rounded-2xl border transition-all duration-200 bg-card hover:shadow-sm",
                  comm.is_urgent 
                    ? "border-[hsl(24,95%,85%)] bg-[hsl(24,95%,98%)]" 
                    : "border-border hover:border-primary/20"
                )}
              >
                <div className="flex items-start gap-3">
                  <Avatar className="w-10 h-10 ring-2 ring-background">
                    <AvatarFallback className="text-xs font-medium bg-[hsl(245,90%,94%)] text-primary">
                      {comm.lead_name?.split(' ').map(n => n[0]).join('') || 'UN'}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <p className="font-medium text-sm text-foreground truncate">
                        {comm.lead_name || 'Unknown Contact'}
                      </p>
                      {comm.is_urgent && (
                        <AlertCircle className="w-3.5 h-3.5 text-[hsl(24,95%,50%)]" />
                      )}
                      <div className="flex items-center gap-1.5 ml-auto shrink-0">
                        <Badge className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium border-0 flex items-center gap-1", getTypeStyles(comm.type))}>
                          {getTypeIcon(comm.type)}
                          <span className="capitalize">{comm.type}</span>
                        </Badge>
                      </div>
                    </div>
                    
                    {comm.subject && (
                      <p className="text-xs font-medium text-foreground mb-1 truncate">
                        {comm.subject}
                      </p>
                    )}
                    
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                      {comm.content}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>{formatTimeAgo(comm.communication_date)}</span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 px-3 text-xs rounded-full border-border hover:bg-muted"
                          onClick={() => handleReply(comm)}
                        >
                          <Reply className="w-3 h-3 mr-1.5" />
                          Reply
                        </Button>
                        
                        <Button
                          size="sm"
                          className="h-7 px-3 text-xs gap-1.5 rounded-full bg-primary hover:bg-primary-hover"
                          onClick={() => handleAutoReply(comm)}
                        >
                          <Sparkles className="w-3 h-3" />
                          AI Reply
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

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
          const repliedCommunicationIds = sentReplies.map(reply => reply.communicationId);
          setCommunications(prev => 
            prev.filter(comm => !repliedCommunicationIds.includes(comm.id))
          );
        }}
      />
    </>
  );
}