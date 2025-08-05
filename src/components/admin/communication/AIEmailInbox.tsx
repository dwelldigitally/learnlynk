import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Mail, 
  Search, 
  Filter, 
  Star, 
  Clock, 
  User, 
  Brain, 
  TrendingUp,
  MessageSquare,
  FileText,
  AlertCircle,
  CheckCircle2,
  Zap
} from 'lucide-react';
import { generateDummyEmails, getHighPriorityEmails, getUnreadEmails } from '@/services/dummyEmailService';

export function AIEmailInbox() {
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  
  const allEmails = generateDummyEmails();
  const highPriorityEmails = getHighPriorityEmails();
  const unreadEmails = getUnreadEmails();

  const filteredEmails = allEmails.filter(email => {
    const matchesSearch = email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         email.from_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         email.body_content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = filterCategory === 'all' || email.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  const selectedEmailData = selectedEmail ? allEmails.find(e => e.id === selectedEmail) : null;

  const getPriorityColor = (score: number) => {
    if (score >= 90) return 'text-red-600 bg-red-50';
    if (score >= 70) return 'text-orange-600 bg-orange-50';
    return 'text-green-600 bg-green-50';
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'inquiry': return <MessageSquare className="h-4 w-4" />;
      case 'application': return <FileText className="h-4 w-4" />;
      case 'complaint': return <AlertCircle className="h-4 w-4" />;
      case 'follow_up': return <CheckCircle2 className="h-4 w-4" />;
      default: return <Mail className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI-Powered Communication Hub</h1>
          <p className="text-muted-foreground">
            Intelligent email management with AI insights and automated actions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button>
            <Brain className="h-4 w-4 mr-2" />
            AI Actions
          </Button>
        </div>
      </div>

      {/* AI Insights Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              Total Emails
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allEmails.length}</div>
            <p className="text-xs text-muted-foreground">
              {unreadEmails.length} unread
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-orange-600" />
              High Priority
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{highPriorityEmails.length}</div>
            <p className="text-xs text-muted-foreground">
              AI Score 80+
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Brain className="h-4 w-4 text-primary" />
              AI Processed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">100%</div>
            <p className="text-xs text-muted-foreground">
              All emails analyzed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Zap className="h-4 w-4 text-green-600" />
              Auto Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">12</div>
            <p className="text-xs text-muted-foreground">
              Suggested today
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search emails by subject, sender, or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={filterCategory === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterCategory('all')}
          >
            All
          </Button>
          <Button
            variant={filterCategory === 'inquiry' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterCategory('inquiry')}
          >
            Inquiries
          </Button>
          <Button
            variant={filterCategory === 'application' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterCategory('application')}
          >
            Applications
          </Button>
          <Button
            variant={filterCategory === 'complaint' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterCategory('complaint')}
          >
            Issues
          </Button>
        </div>
      </div>

      {/* Email List and Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Email List */}
        <div className="lg:col-span-1 space-y-3">
          <h3 className="font-semibold text-lg">Inbox ({filteredEmails.length})</h3>
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {filteredEmails.map((email) => (
              <Card
                key={email.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedEmail === email.id ? 'ring-2 ring-primary' : ''
                } ${!email.is_read ? 'bg-blue-50/50' : ''}`}
                onClick={() => setSelectedEmail(email.id)}
              >
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-1 rounded bg-primary/10">
                          {getCategoryIcon(email.category)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{email.from_name}</p>
                          <p className="text-xs text-muted-foreground truncate">{email.from_email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {!email.is_read && (
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                        )}
                        <Badge className={`text-xs ${getPriorityColor(email.ai_priority_score)}`}>
                          {email.ai_priority_score}
                        </Badge>
                      </div>
                    </div>
                    
                    <div>
                      <p className={`text-sm ${!email.is_read ? 'font-semibold' : ''} truncate`}>
                        {email.subject}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                        {email.body_preview}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{new Date(email.received_datetime).toLocaleTimeString()}</span>
                      <div className="flex items-center gap-1">
                        <Brain className="h-3 w-3" />
                        <span>{email.ai_suggested_actions.length} actions</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Email Detail View */}
        <div className="lg:col-span-2">
          {selectedEmailData ? (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{selectedEmailData.subject}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <User className="h-4 w-4" />
                      <span>{selectedEmailData.from_name} &lt;{selectedEmailData.from_email}&gt;</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {new Date(selectedEmailData.received_datetime).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getPriorityColor(selectedEmailData.ai_priority_score)}>
                      AI Score: {selectedEmailData.ai_priority_score}
                    </Badge>
                    <Badge variant="outline" className="capitalize">
                      {selectedEmailData.category}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Email Content */}
                <div className="bg-muted/50 p-4 rounded-lg">
                  <pre className="whitespace-pre-wrap font-sans text-sm">
                    {selectedEmailData.body_content}
                  </pre>
                </div>

                {/* AI Insights */}
                <div className="space-y-4">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Brain className="h-4 w-4 text-primary" />
                    AI Insights & Suggestions
                  </h4>
                  
                  {/* Lead Match */}
                  {selectedEmailData.lead_match && (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Lead Match Found</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{selectedEmailData.lead_match.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Interested in: {selectedEmailData.lead_match.program_interest.join(', ')}
                            </p>
                          </div>
                          <Badge className="bg-green-50 text-green-700">
                            {selectedEmailData.lead_match.score}% match
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Suggested Actions */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Suggested Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selectedEmailData.ai_suggested_actions.map((action, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <div>
                              <p className="font-medium text-sm">{action.description}</p>
                              <p className="text-xs text-muted-foreground capitalize">
                                {action.type.replace('_', ' ')}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">
                                {action.confidence}% confidence
                              </Badge>
                              <Button size="sm">Execute</Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-4 border-t">
                  <Button>Reply</Button>
                  <Button variant="outline">Forward</Button>
                  <Button variant="outline">Archive</Button>
                  <Button variant="outline">
                    <Brain className="h-4 w-4 mr-2" />
                    Generate AI Response
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-96">
                <div className="text-center">
                  <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold">Select an email to view</h3>
                  <p className="text-muted-foreground">
                    Choose an email from the list to see AI insights and suggestions
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}