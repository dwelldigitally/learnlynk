import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { EmailService } from '@/services/emailService';
import { MicrosoftGraphService } from '@/services/microsoftGraphService';
import { Email, EmailFilter, EmailStats } from '@/types/email';
import {
  Mail,
  Inbox,
  Send,
  Users,
  Clock,
  AlertTriangle,
  Search,
  Filter,
  Bot,
  Paperclip,
  Star,
  Archive,
  MoreHorizontal,
  CheckCircle,
  Circle,
  UserPlus,
  Zap,
  TrendingUp,
  BarChart3,
  Settings,
  Plus,
  Building
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const EmailManagement: React.FC = () => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [emailStats, setEmailStats] = useState<EmailStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [filters, setFilters] = useState<EmailFilter>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('team');
  
  const { toast } = useToast();

  useEffect(() => {
    loadEmails();
    loadEmailStats();
  }, [filters]);

  const loadEmails = async () => {
    setLoading(true);
    try {
      const { emails: fetchedEmails } = await EmailService.getEmails(filters);
      setEmails(fetchedEmails);
    } catch (error) {
      console.error('Error loading emails:', error);
      toast({
        title: "Error",
        description: "Failed to load emails",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadEmailStats = async () => {
    try {
      const stats = await EmailService.getEmailStats(filters);
      setEmailStats(stats);
    } catch (error) {
      console.error('Error loading email stats:', error);
    }
  };

  const handleConnectOutlook = () => {
    toast({
      title: "Demo Mode",
      description: "Outlook integration would require a configured Microsoft app registration. This is a demo environment.",
      variant: "default"
    });
  };

  const handleEmailAction = async (emailId: string, action: string) => {
    try {
      switch (action) {
        case 'mark_read':
          await EmailService.updateEmailReadStatus(emailId, true);
          break;
        case 'mark_unread':
          await EmailService.updateEmailReadStatus(emailId, false);
          break;
        case 'assign':
          // This would open an assignment modal
          break;
        case 'ai_analyze':
          await EmailService.analyzeEmailWithAI(emailId);
          break;
      }
      
      await loadEmails();
      toast({
        title: "Success",
        description: "Email updated successfully",
      });
    } catch (error) {
      console.error('Error updating email:', error);
      toast({
        title: "Error",
        description: "Failed to update email",
        variant: "destructive",
      });
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedEmails.length === 0) {
      toast({
        title: "No emails selected",
        description: "Please select emails to perform bulk actions.",
        variant: "destructive"
      });
      return;
    }

    try {
      const updates: any = {};
      
      switch (action) {
        case 'mark_read':
          updates.is_read = true;
          break;
        case 'mark_unread':
          updates.is_read = false;
          break;
        case 'archive':
          updates.status = 'resolved';
          break;
      }

      await EmailService.bulkUpdateEmails(selectedEmails, updates);
      await loadEmails();
      setSelectedEmails([]);
      
      toast({
        title: "Success",
        description: `Bulk action applied to ${selectedEmails.length} emails.`
      });
    } catch (error) {
      console.error('Error performing bulk action:', error);
      toast({
        title: "Error",
        description: "Failed to perform bulk action",
        variant: "destructive",
      });
    }
  };

  const getPriorityColor = (score: number, importance: string) => {
    if (importance === 'high' || score > 80) return 'text-destructive';
    if (importance === 'normal' || score > 50) return 'text-warning';
    return 'text-muted-foreground';
  };

  const getPriorityIcon = (score: number, importance: string) => {
    if (importance === 'high' || score > 80) return <AlertTriangle className="h-4 w-4" />;
    if (importance === 'normal' || score > 50) return <Clock className="h-4 w-4" />;
    return <Circle className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Email Management</h1>
          <p className="text-muted-foreground">AI-powered email prioritization and lead management</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleConnectOutlook}>
            <Building className="h-4 w-4 mr-2" />
            Connect Outlook
          </Button>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Compose
          </Button>
        </div>
      </div>

      {/* Email Stats */}
      {emailStats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {[
            { title: "Total Emails", count: emailStats.total_emails, icon: Mail, color: "text-primary" },
            { title: "Unread", count: emailStats.unread_count, icon: Circle, color: "text-warning" },
            { title: "High Priority", count: emailStats.high_priority_count, icon: AlertTriangle, color: "text-destructive" },
            { title: "Assigned", count: emailStats.assigned_count, icon: UserPlus, color: "text-success" },
            { title: "Lead Matches", count: emailStats.lead_conversion_count, icon: TrendingUp, color: "text-accent" }
          ].map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.count}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="team">Team Inbox</TabsTrigger>
          <TabsTrigger value="individual">My Inbox</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="ai">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="team" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex flex-wrap gap-4 items-center">
                  <div className="flex-1 min-w-[300px]">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Search emails..." 
                        className="pl-10" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <Select 
                    value={filters.status?.[0] || 'all'} 
                    onValueChange={(value) => 
                      setFilters({...filters, status: value === 'all' ? undefined : [value as any]})
                    }
                  >
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="assigned">Assigned</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="replied">Replied</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select 
                    value={filters.importance?.[0] || 'all'} 
                    onValueChange={(value) => 
                      setFilters({...filters, importance: value === 'all' ? undefined : [value as any]})
                    }
                  >
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priority</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {selectedEmails.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBulkAction('mark_read')}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Mark Read
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBulkAction('assign')}
                    >
                      <UserPlus className="h-4 w-4 mr-1" />
                      Assign
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBulkAction('archive')}
                    >
                      <Archive className="h-4 w-4 mr-1" />
                      Archive
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Emails Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Inbox className="h-5 w-5" />
                Team Inbox ({emails.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>From</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Lead Match</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Received</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {emails.map((email) => (
                    <TableRow 
                      key={email.id} 
                      className={`cursor-pointer hover:bg-accent/50 ${!email.is_read ? 'bg-primary/5 font-medium' : ''}`}
                    >
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedEmails.includes(email.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedEmails([...selectedEmails, email.id]);
                            } else {
                              setSelectedEmails(selectedEmails.filter(id => id !== email.id));
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <div className={`flex items-center gap-2 ${getPriorityColor(email.ai_priority_score, email.importance)}`}>
                          {getPriorityIcon(email.ai_priority_score, email.importance)}
                          <span className="text-sm font-medium">
                            {Math.round(email.ai_priority_score)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{email.from_name || email.from_email}</div>
                          <div className="text-sm text-muted-foreground">{email.from_email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[300px]">
                          <div className="font-medium truncate">{email.subject}</div>
                          <div className="text-sm text-muted-foreground truncate">
                            {email.body_preview}
                          </div>
                          {email.has_attachments && (
                            <Paperclip className="h-4 w-4 inline mt-1 text-muted-foreground" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {email.lead_id ? (
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            {Math.round(email.ai_lead_match_confidence * 100)}%
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">No match</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          email.status === 'new' ? 'destructive' :
                          email.status === 'assigned' ? 'secondary' :
                          email.status === 'in_progress' ? 'default' :
                          email.status === 'replied' ? 'outline' : 'secondary'
                        }>
                          {email.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {formatDistanceToNow(new Date(email.received_datetime), { addSuffix: true })}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEmailAction(email.id, email.is_read ? 'mark_unread' : 'mark_read')}
                          >
                            {email.is_read ? <Circle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEmailAction(email.id, 'ai_analyze')}
                          >
                            <Bot className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="individual">
          <Card>
            <CardContent className="p-8 text-center">
              <Mail className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Individual Inbox</h3>
              <p className="text-muted-foreground mb-4">
                Connect your personal Outlook account to manage individual emails.
              </p>
              <Button onClick={handleConnectOutlook}>
                <Building className="h-4 w-4 mr-2" />
                Connect Personal Outlook
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Response Times
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Average Response Time</span>
                    <span className="font-medium">{emailStats?.avg_response_time_hours.toFixed(1)} hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Response Rate</span>
                    <span className="font-medium">{((emailStats?.response_rate || 0) * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Lead Conversion
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Emails with Lead Matches</span>
                    <span className="font-medium">{emailStats?.lead_conversion_count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Conversion Rate</span>
                    <span className="font-medium">
                      {emailStats ? ((emailStats.lead_conversion_count / emailStats.total_emails) * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ai">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                AI-Powered Email Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center py-8">
                  <Bot className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">AI Email Analysis</h3>
                  <p className="text-muted-foreground mb-4">
                    AI automatically analyzes emails for lead scoring, priority, and suggested responses.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                    <div className="p-4 bg-primary/5 rounded-lg">
                      <h4 className="font-medium mb-2">Smart Prioritization</h4>
                      <p className="text-sm text-muted-foreground">
                        Emails are scored based on lead value, urgency, and conversion potential.
                      </p>
                    </div>
                    <div className="p-4 bg-accent/5 rounded-lg">
                      <h4 className="font-medium mb-2">Lead Matching</h4>
                      <p className="text-sm text-muted-foreground">
                        Automatically matches emails to existing leads and prospects.
                      </p>
                    </div>
                    <div className="p-4 bg-secondary/5 rounded-lg">
                      <h4 className="font-medium mb-2">Response Suggestions</h4>
                      <p className="text-sm text-muted-foreground">
                        AI suggests reply templates and relevant documents.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmailManagement;