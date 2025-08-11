import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Send, 
  Settings, 
  FileText, 
  MessageSquare,
  Users,
  Shield,
  Bell,
  Palette
} from 'lucide-react';
import { 
  useRecruiterPortalContent,
  useRecruiterContentMutations,
  useRecruiterPortalMessages,
  useRecruiterMessageMutations,
  useRecruiterPortalConfig,
  useRecruiterConfigMutations,
  useRealTimeRecruiterPortalUpdates
} from '@/hooks/useRecruiterPortal';
import type { RecruiterPortalContent, RecruiterPortalMessage, RecruiterPortalConfig } from '@/types/recruiterPortal';

export default function RecruiterPortalManagement() {
  const [activeTab, setActiveTab] = useState('content');
  const [showContentModal, setShowContentModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedContent, setSelectedContent] = useState<RecruiterPortalContent | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<RecruiterPortalMessage | null>(null);

  // Data hooks
  const { data: content = [], isLoading: contentLoading } = useRecruiterPortalContent();
  const { data: messages = [], isLoading: messagesLoading } = useRecruiterPortalMessages();
  const { data: config, isLoading: configLoading } = useRecruiterPortalConfig();

  // Mutation hooks
  const { createContent, updateContent, deleteContent } = useRecruiterContentMutations();
  const { createMessage, updateMessage, deleteMessage } = useRecruiterMessageMutations();
  const { saveConfig } = useRecruiterConfigMutations();

  // Real-time updates
  useRealTimeRecruiterPortalUpdates();

  const handleContentSubmit = async (data: Partial<RecruiterPortalContent>) => {
    if (selectedContent) {
      updateContent.mutate({ id: selectedContent.id, updates: data });
    } else {
      createContent.mutate(data);
    }
    setShowContentModal(false);
    setSelectedContent(null);
  };

  const handleMessageSubmit = async (data: Partial<RecruiterPortalMessage>) => {
    if (selectedMessage) {
      updateMessage.mutate({ id: selectedMessage.id, updates: data });
    } else {
      createMessage.mutate(data);
    }
    setShowMessageModal(false);
    setSelectedMessage(null);
  };

  const handleConfigSave = async (data: Partial<RecruiterPortalConfig>) => {
    saveConfig.mutate(data);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Recruiter Portal Management</h2>
          <p className="text-muted-foreground">Manage content, messages, and configuration for the recruiter portal</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="content" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Content
          </TabsTrigger>
          <TabsTrigger value="messages" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Messages
          </TabsTrigger>
          <TabsTrigger value="config" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Configuration
          </TabsTrigger>
          <TabsTrigger value="access" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Access Control
          </TabsTrigger>
        </TabsList>

        <TabsContent value="content">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Portal Content</CardTitle>
                <CardDescription>Manage announcements, news, and documents for recruiters</CardDescription>
              </div>
              <Dialog open={showContentModal} onOpenChange={setShowContentModal}>
                <DialogTrigger asChild>
                  <Button onClick={() => setSelectedContent(null)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Content
                  </Button>
                </DialogTrigger>
                <ContentModal 
                  content={selectedContent}
                  onSave={handleContentSubmit}
                />
              </Dialog>
            </CardHeader>
            <CardContent>
              {contentLoading ? (
                <div className="flex items-center justify-center h-32">Loading...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="w-24">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {content.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.title}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.content_type}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={item.priority === 'urgent' ? 'destructive' : 'secondary'}>
                            {item.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={item.is_published ? 'default' : 'secondary'}>
                            {item.is_published ? 'Published' : 'Draft'}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(item.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedContent(item);
                                setShowContentModal(true);
                              }}
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteContent.mutate(item.id)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Portal Messages</CardTitle>
                <CardDescription>Send messages and communications to recruiter companies</CardDescription>
              </div>
              <Dialog open={showMessageModal} onOpenChange={setShowMessageModal}>
                <DialogTrigger asChild>
                  <Button onClick={() => setSelectedMessage(null)}>
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </DialogTrigger>
                <MessageModal 
                  message={selectedMessage}
                  onSave={handleMessageSubmit}
                />
              </Dialog>
            </CardHeader>
            <CardContent>
              {messagesLoading ? (
                <div className="flex items-center justify-center h-32">Loading...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Subject</TableHead>
                      <TableHead>Recipients</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Sent</TableHead>
                      <TableHead className="w-24">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {messages.map((message) => (
                      <TableRow key={message.id}>
                        <TableCell className="font-medium">{message.subject}</TableCell>
                        <TableCell>{message.recipient_type}</TableCell>
                        <TableCell>
                          <Badge variant={message.priority === 'urgent' ? 'destructive' : 'secondary'}>
                            {message.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={message.is_read ? 'default' : 'secondary'}>
                            {message.is_read ? 'Read' : 'Unread'}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(message.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedMessage(message);
                                setShowMessageModal(true);
                              }}
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteMessage.mutate(message.id)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="config">
          <ConfigurationTab config={config} onSave={handleConfigSave} loading={configLoading} />
        </TabsContent>

        <TabsContent value="access">
          <AccessControlTab config={config} onSave={handleConfigSave} loading={configLoading} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ContentModal({ content, onSave }: { content: RecruiterPortalContent | null; onSave: (data: Partial<RecruiterPortalContent>) => void }) {
  const [formData, setFormData] = useState({
    title: content?.title || '',
    content: content?.content || '',
    content_type: content?.content_type || 'announcement',
    priority: content?.priority || 'medium',
    is_published: content?.is_published || false,
    target_companies: content?.target_companies || [],
    target_roles: content?.target_roles || []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{content ? 'Edit Content' : 'Add New Content'}</DialogTitle>
        <DialogDescription>Create content for the recruiter portal</DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="content_type">Content Type</Label>
            <Select value={formData.content_type} onValueChange={(value) => setFormData(prev => ({ ...prev, content_type: value as any }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="announcement">Announcement</SelectItem>
                <SelectItem value="news">News</SelectItem>
                <SelectItem value="document">Document</SelectItem>
                <SelectItem value="training">Training</SelectItem>
                <SelectItem value="policy">Policy</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="priority">Priority</Label>
            <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value as any }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="content">Content *</Label>
          <Textarea
            id="content"
            value={formData.content}
            onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
            rows={6}
            required
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="is_published"
            checked={formData.is_published}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_published: checked }))}
          />
          <Label htmlFor="is_published">Publish immediately</Label>
        </div>

        <div className="flex justify-end gap-2">
          <Button type="submit">
            {content ? 'Update Content' : 'Create Content'}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
}

function MessageModal({ message, onSave }: { message: RecruiterPortalMessage | null; onSave: (data: Partial<RecruiterPortalMessage>) => void }) {
  const [formData, setFormData] = useState({
    subject: message?.subject || '',
    message: message?.message || '',
    priority: message?.priority || 'normal',
    recipient_type: message?.recipient_type || 'all',
    recipient_companies: message?.recipient_companies || [],
    recipient_users: message?.recipient_users || []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{message ? 'Edit Message' : 'Send New Message'}</DialogTitle>
        <DialogDescription>Send a message to recruiter companies</DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="subject">Subject *</Label>
          <Input
            id="subject"
            value={formData.subject}
            onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="recipient_type">Recipient Type</Label>
            <Select value={formData.recipient_type} onValueChange={(value) => setFormData(prev => ({ ...prev, recipient_type: value as any }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Recruiters</SelectItem>
                <SelectItem value="company">Specific Companies</SelectItem>
                <SelectItem value="individual">Individual Users</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="priority">Priority</Label>
            <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value as any }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="message">Message *</Label>
          <Textarea
            id="message"
            value={formData.message}
            onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
            rows={6}
            required
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button type="submit">
            {message ? 'Update Message' : 'Send Message'}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
}

function ConfigurationTab({ config, onSave, loading }: { config: RecruiterPortalConfig | null; onSave: (data: Partial<RecruiterPortalConfig>) => void; loading: boolean }) {
  const [formData, setFormData] = useState({
    portal_title: config?.portal_title || 'Recruiter Portal',
    welcome_message: config?.welcome_message || '',
    primary_color: config?.primary_color || '#0066cc',
    secondary_color: config?.secondary_color || '#f8f9fa',
    features: config?.features || {
      application_submission: true,
      commission_tracking: true,
      document_management: true,
      performance_metrics: true,
      communication_center: true,
      training_materials: true,
      company_directory: false,
      automated_notifications: true
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-32">Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="w-5 h-5" />
          Portal Configuration
        </CardTitle>
        <CardDescription>Configure the appearance and features of the recruiter portal</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="portal_title">Portal Title</Label>
              <Input
                id="portal_title"
                value={formData.portal_title}
                onChange={(e) => setFormData(prev => ({ ...prev, portal_title: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="primary_color">Primary Color</Label>
              <Input
                id="primary_color"
                type="color"
                value={formData.primary_color}
                onChange={(e) => setFormData(prev => ({ ...prev, primary_color: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="welcome_message">Welcome Message</Label>
            <Textarea
              id="welcome_message"
              value={formData.welcome_message}
              onChange={(e) => setFormData(prev => ({ ...prev, welcome_message: e.target.value }))}
              rows={3}
              placeholder="Welcome to the recruiter portal..."
            />
          </div>

          <div>
            <Label className="text-base font-semibold">Features</Label>
            <div className="grid grid-cols-2 gap-4 mt-2">
              {Object.entries(formData.features).map(([key, value]) => (
                <div key={key} className="flex items-center space-x-2">
                  <Switch
                    id={key}
                    checked={value}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({
                        ...prev,
                        features: { ...prev.features, [key]: checked }
                      }))
                    }
                  />
                  <Label htmlFor={key} className="text-sm">
                    {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit">Save Configuration</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function AccessControlTab({ config, onSave, loading }: { config: RecruiterPortalConfig | null; onSave: (data: Partial<RecruiterPortalConfig>) => void; loading: boolean }) {
  const [formData, setFormData] = useState({
    access_control: config?.access_control || {
      require_approval: true,
      allow_self_registration: false,
      session_timeout: 60,
      max_login_attempts: 5
    },
    notification_settings: config?.notification_settings || {
      email_notifications: true,
      new_application_alerts: true,
      commission_updates: true,
      system_announcements: true
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-32">Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Access Control
          </CardTitle>
          <CardDescription>Configure security and access settings</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="require_approval"
                  checked={formData.access_control.require_approval}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({
                      ...prev,
                      access_control: { ...prev.access_control, require_approval: checked }
                    }))
                  }
                />
                <Label htmlFor="require_approval">Require admin approval for new accounts</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="allow_self_registration"
                  checked={formData.access_control.allow_self_registration}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({
                      ...prev,
                      access_control: { ...prev.access_control, allow_self_registration: checked }
                    }))
                  }
                />
                <Label htmlFor="allow_self_registration">Allow self-registration</Label>
              </div>

              <div>
                <Label htmlFor="session_timeout">Session Timeout (minutes)</Label>
                <Input
                  id="session_timeout"
                  type="number"
                  value={formData.access_control.session_timeout}
                  onChange={(e) => 
                    setFormData(prev => ({
                      ...prev,
                      access_control: { ...prev.access_control, session_timeout: Number(e.target.value) }
                    }))
                  }
                />
              </div>

              <div>
                <Label htmlFor="max_login_attempts">Max Login Attempts</Label>
                <Input
                  id="max_login_attempts"
                  type="number"
                  value={formData.access_control.max_login_attempts}
                  onChange={(e) => 
                    setFormData(prev => ({
                      ...prev,
                      access_control: { ...prev.access_control, max_login_attempts: Number(e.target.value) }
                    }))
                  }
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit">Save Settings</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notification Settings
          </CardTitle>
          <CardDescription>Configure notification preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(formData.notification_settings).map(([key, value]) => (
              <div key={key} className="flex items-center space-x-2">
                <Switch
                  id={key}
                  checked={value}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({
                      ...prev,
                      notification_settings: { ...prev.notification_settings, [key]: checked }
                    }))
                  }
                />
                <Label htmlFor={key} className="text-sm">
                  {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}