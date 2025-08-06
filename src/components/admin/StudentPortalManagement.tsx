import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { 
  Settings, 
  MessageSquare, 
  FileText, 
  Users, 
  Plus,
  Edit,
  Trash2,
  Eye,
  Bell,
  Send,
  Calendar,
  Clock
} from "lucide-react";
import { usePortalContent, useContentMutations, usePortalMessages, useMessageMutations, usePortalConfig, useConfigMutations, useRealTimePortalUpdates } from "@/hooks/useStudentPortal";
import { useConditionalStudents } from "@/hooks/useConditionalStudents";
import { StudentPortalContent, StudentPortalMessage, StudentPortalConfig } from "@/services/studentPortalService";

export const StudentPortalManagement = () => {
  const [activeTab, setActiveTab] = useState("content");
  const [showContentDialog, setShowContentDialog] = useState(false);
  const [editingContent, setEditingContent] = useState<StudentPortalContent | null>(null);
  const [contentForm, setContentForm] = useState<{
    title: string;
    content: string;
    content_type: 'announcement' | 'news' | 'alert' | 'document';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    is_published: boolean;
    publish_date: string;
    expiry_date: string;
    target_audience: string[];
  }>({
    title: "",
    content: "",
    content_type: "announcement",
    priority: "medium",
    is_published: false,
    publish_date: "",
    expiry_date: "",
    target_audience: []
  });
  const [messageForm, setMessageForm] = useState<{
    title: string;
    content: string;
    message_type: 'info' | 'warning' | 'success' | 'error';
    priority: 'normal' | 'high' | 'urgent';
    target_students: string[];
    scheduled_for: string;
  }>({
    title: "",
    content: "",
    message_type: "info",
    priority: "normal",
    target_students: [],
    scheduled_for: ""
  });

  // Hooks
  const { data: portalContent = [], isLoading: isLoadingContent } = usePortalContent();
  const { data: portalMessages = [], isLoading: isLoadingMessages } = usePortalMessages();
  const { data: portalConfig, isLoading: isLoadingConfig } = usePortalConfig();
  const { data: students = [] } = useConditionalStudents();
  
  const { createContent, updateContent, deleteContent } = useContentMutations();
  const { createMessage, deleteMessage } = useMessageMutations();
  const { saveConfig } = useConfigMutations();
  
  useRealTimePortalUpdates();

  const [configForm, setConfigForm] = useState({
    portal_title: portalConfig?.portal_title || "Student Portal",
    welcome_message: portalConfig?.welcome_message || "Welcome to your student portal",
    features: {
      application_tracking: portalConfig?.features?.application_tracking ?? true,
      fee_payments: portalConfig?.features?.fee_payments ?? true,
      message_center: portalConfig?.features?.message_center ?? true,
      document_upload: portalConfig?.features?.document_upload ?? true,
      advisor_contact: portalConfig?.features?.advisor_contact ?? true,
      event_registration: portalConfig?.features?.event_registration ?? true
    }
  });

  // Update config form when data loads
  React.useEffect(() => {
    if (portalConfig) {
      setConfigForm({
        portal_title: portalConfig.portal_title,
        welcome_message: portalConfig.welcome_message,
        features: { ...portalConfig.features }
      });
    }
  }, [portalConfig]);

  const handleCreateContent = () => {
    setEditingContent(null);
    setContentForm({
      title: "",
      content: "",
      content_type: "announcement",
      priority: "medium",
      is_published: false,
      publish_date: "",
      expiry_date: "",
      target_audience: []
    });
    setShowContentDialog(true);
  };

  const handleEditContent = (content: StudentPortalContent) => {
    setEditingContent(content);
    setContentForm({
      title: content.title,
      content: content.content,
      content_type: content.content_type,
      priority: content.priority,
      is_published: content.is_published,
      publish_date: content.publish_date || "",
      expiry_date: content.expiry_date || "",
      target_audience: content.target_audience || []
    });
    setShowContentDialog(true);
  };

  const handleSaveContent = () => {
    if (editingContent) {
      updateContent.mutate({
        id: editingContent.id,
        updates: contentForm
      });
    } else {
      createContent.mutate(contentForm);
    }
    setShowContentDialog(false);
  };

  const handleSendMessage = () => {
    if (messageForm.title && messageForm.content && messageForm.target_students.length > 0) {
      createMessage.mutate(messageForm);
      setMessageForm({
        title: "",
        content: "",
        message_type: "info",
        priority: "normal",
        target_students: [],
        scheduled_for: ""
      });
    }
  };

  const handleSaveConfig = () => {
    saveConfig.mutate(configForm);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getContentTypeColor = (type: string) => {
    switch (type) {
      case "announcement": return "bg-blue-100 text-blue-800";
      case "news": return "bg-green-100 text-green-800";
      case "alert": return "bg-red-100 text-red-800";
      case "document": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-100 text-red-800";
      case "high": return "bg-orange-100 text-orange-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Student Portal Management</h1>
          <p className="text-muted-foreground">
            Manage student portal content, messages, and configuration
          </p>
        </div>
        <Button onClick={handleCreateContent}>
          <Plus className="mr-2 h-4 w-4" />
          Add Content
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="content" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Content
          </TabsTrigger>
          <TabsTrigger value="messages" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Messages
          </TabsTrigger>
          <TabsTrigger value="config" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Configuration
          </TabsTrigger>
          <TabsTrigger value="students" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Student Access
          </TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Portal Content</CardTitle>
              <CardDescription>
                Manage announcements, news, and informational content for the student portal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoadingContent ? (
                <div className="text-center py-8">Loading content...</div>
              ) : portalContent.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No content created yet. Click "Add Content" to get started.
                </div>
              ) : (
                <div className="grid gap-4">
                  {portalContent.map((content) => (
                    <div key={content.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <h4 className="font-medium">{content.title}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {content.content}
                        </p>
                        <div className="flex gap-2">
                          <Badge className={getContentTypeColor(content.content_type)}>
                            {content.content_type}
                          </Badge>
                          <Badge className={getPriorityColor(content.priority)}>
                            {content.priority}
                          </Badge>
                          <Badge variant={content.is_published ? "default" : "secondary"}>
                            {content.is_published ? "Published" : "Draft"}
                          </Badge>
                          {content.publish_date && (
                            <Badge variant="outline">
                              <Calendar className="w-3 h-3 mr-1" />
                              {formatDate(content.publish_date)}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditContent(content)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Content</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{content.title}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteContent.mutate(content.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Student Messages</CardTitle>
              <CardDescription>
                Send targeted messages to students and manage notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                {/* Send New Message Form */}
                <div className="space-y-4 p-4 border rounded-lg">
                  <div className="space-y-2">
                    <Label htmlFor="message-title">Message Title</Label>
                    <Input 
                      id="message-title"
                      placeholder="Enter message title"
                      value={messageForm.title}
                      onChange={(e) => setMessageForm({ ...messageForm, title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message-content">Message Content</Label>
                    <Textarea 
                      id="message-content"
                      placeholder="Enter message content"
                      rows={4}
                      value={messageForm.content}
                      onChange={(e) => setMessageForm({ ...messageForm, content: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Message Type</Label>
                      <Select value={messageForm.message_type} onValueChange={(value: any) => setMessageForm({ ...messageForm, message_type: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="info">Information</SelectItem>
                          <SelectItem value="warning">Warning</SelectItem>
                          <SelectItem value="success">Success</SelectItem>
                          <SelectItem value="error">Error</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Priority</Label>
                      <Select value={messageForm.priority} onValueChange={(value: any) => setMessageForm({ ...messageForm, priority: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Schedule For</Label>
                      <Input 
                        type="datetime-local"
                        value={messageForm.scheduled_for}
                        onChange={(e) => setMessageForm({ ...messageForm, scheduled_for: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Target Students</Label>
                    <Select 
                      value={messageForm.target_students.length > 0 ? "selected" : ""} 
                      onValueChange={(value) => {
                        if (value === "all") {
                          setMessageForm({ ...messageForm, target_students: students.map(s => s.id) });
                        } else if (value === "none") {
                          setMessageForm({ ...messageForm, target_students: [] });
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={`${messageForm.target_students.length} students selected`} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Students ({students.length})</SelectItem>
                        <SelectItem value="none">Clear Selection</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSendMessage} disabled={!messageForm.title || !messageForm.content || messageForm.target_students.length === 0}>
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </Button>
                  </div>
                </div>

                {/* Sent Messages List */}
                <div className="space-y-4">
                  <h4 className="font-medium">Recent Messages</h4>
                  {isLoadingMessages ? (
                    <div className="text-center py-4">Loading messages...</div>
                  ) : portalMessages.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground">
                      No messages sent yet.
                    </div>
                  ) : (
                    portalMessages.slice(0, 5).map((message) => (
                      <div key={message.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-1">
                          <h5 className="font-medium">{message.title}</h5>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {message.content}
                          </p>
                          <div className="flex gap-2">
                            <Badge className={`${message.message_type === 'error' ? 'bg-red-100 text-red-800' : message.message_type === 'warning' ? 'bg-yellow-100 text-yellow-800' : message.message_type === 'success' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                              {message.message_type}
                            </Badge>
                            <Badge className={getPriorityColor(message.priority)}>
                              {message.priority}
                            </Badge>
                            <Badge variant="outline">
                              {message.target_students.length} recipients
                            </Badge>
                            {message.scheduled_for && (
                              <Badge variant="outline">
                                <Clock className="w-3 h-3 mr-1" />
                                Scheduled
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Message</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{message.title}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteMessage.mutate(message.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="config" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Portal Configuration</CardTitle>
              <CardDescription>
                Configure portal settings and appearance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoadingConfig ? (
                <div className="text-center py-8">Loading configuration...</div>
              ) : (
                <div className="grid gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">General Settings</h4>
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="portal-title">Portal Title</Label>
                        <Input 
                          id="portal-title"
                          value={configForm.portal_title}
                          onChange={(e) => setConfigForm({ ...configForm, portal_title: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="welcome-message">Welcome Message</Label>
                        <Textarea 
                          id="welcome-message"
                          value={configForm.welcome_message}
                          onChange={(e) => setConfigForm({ ...configForm, welcome_message: e.target.value })}
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Feature Toggles</h4>
                    <div className="grid gap-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="app-tracking">Application Tracking</Label>
                          <p className="text-xs text-muted-foreground">Allow students to track their applications</p>
                        </div>
                        <Switch
                          id="app-tracking"
                          checked={configForm.features.application_tracking}
                          onCheckedChange={(checked) => 
                            setConfigForm({ 
                              ...configForm, 
                              features: { ...configForm.features, application_tracking: checked }
                            })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="fee-payments">Fee Payments</Label>
                          <p className="text-xs text-muted-foreground">Enable fee payment functionality</p>
                        </div>
                        <Switch
                          id="fee-payments"
                          checked={configForm.features.fee_payments}
                          onCheckedChange={(checked) => 
                            setConfigForm({ 
                              ...configForm, 
                              features: { ...configForm.features, fee_payments: checked }
                            })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="message-center">Message Center</Label>
                          <p className="text-xs text-muted-foreground">Enable student message center</p>
                        </div>
                        <Switch
                          id="message-center"
                          checked={configForm.features.message_center}
                          onCheckedChange={(checked) => 
                            setConfigForm({ 
                              ...configForm, 
                              features: { ...configForm.features, message_center: checked }
                            })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="document-upload">Document Upload</Label>
                          <p className="text-xs text-muted-foreground">Allow students to upload documents</p>
                        </div>
                        <Switch
                          id="document-upload"
                          checked={configForm.features.document_upload}
                          onCheckedChange={(checked) => 
                            setConfigForm({ 
                              ...configForm, 
                              features: { ...configForm.features, document_upload: checked }
                            })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="advisor-contact">Advisor Contact</Label>
                          <p className="text-xs text-muted-foreground">Enable advisor contact features</p>
                        </div>
                        <Switch
                          id="advisor-contact"
                          checked={configForm.features.advisor_contact}
                          onCheckedChange={(checked) => 
                            setConfigForm({ 
                              ...configForm, 
                              features: { ...configForm.features, advisor_contact: checked }
                            })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="event-registration">Event Registration</Label>
                          <p className="text-xs text-muted-foreground">Allow students to register for events</p>
                        </div>
                        <Switch
                          id="event-registration"
                          checked={configForm.features.event_registration}
                          onCheckedChange={(checked) => 
                            setConfigForm({ 
                              ...configForm, 
                              features: { ...configForm.features, event_registration: checked }
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <Button onClick={handleSaveConfig}>Save Configuration</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Student Access Management</CardTitle>
              <CardDescription>
                Manage student portal access and permissions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {students.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No students found.
                </div>
              ) : (
                <div className="grid gap-4">
                  {students.map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <h4 className="font-medium">{student.first_name} {student.last_name}</h4>
                        <p className="text-sm text-muted-foreground">{student.email}</p>
                        <div className="flex gap-2">
                          <Badge variant="secondary">{student.program}</Badge>
                          <Badge variant="outline">{student.stage}</Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">View Portal</Button>
                        <Button variant="outline" size="sm">Manage Access</Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Content Create/Edit Dialog */}
      <Dialog open={showContentDialog} onOpenChange={setShowContentDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingContent ? 'Edit Content' : 'Create New Content'}</DialogTitle>
            <DialogDescription>
              {editingContent ? 'Update the portal content details.' : 'Create new content for the student portal.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="content-title">Title</Label>
              <Input
                id="content-title"
                value={contentForm.title}
                onChange={(e) => setContentForm({ ...contentForm, title: e.target.value })}
                placeholder="Enter content title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content-text">Content</Label>
              <Textarea
                id="content-text"
                value={contentForm.content}
                onChange={(e) => setContentForm({ ...contentForm, content: e.target.value })}
                placeholder="Enter content text"
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Content Type</Label>
                <Select value={contentForm.content_type} onValueChange={(value: any) => setContentForm({ ...contentForm, content_type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="announcement">Announcement</SelectItem>
                    <SelectItem value="news">News</SelectItem>
                    <SelectItem value="alert">Alert</SelectItem>
                    <SelectItem value="document">Document</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select value={contentForm.priority} onValueChange={(value: any) => setContentForm({ ...contentForm, priority: value })}>
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Publish Date</Label>
                <Input
                  type="datetime-local"
                  value={contentForm.publish_date}
                  onChange={(e) => setContentForm({ ...contentForm, publish_date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Expiry Date (Optional)</Label>
                <Input
                  type="datetime-local"
                  value={contentForm.expiry_date}
                  onChange={(e) => setContentForm({ ...contentForm, expiry_date: e.target.value })}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="is-published"
                checked={contentForm.is_published}
                onCheckedChange={(checked) => setContentForm({ ...contentForm, is_published: checked })}
              />
              <Label htmlFor="is-published">Publish immediately</Label>
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowContentDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveContent}>
              {editingContent ? 'Update' : 'Create'} Content
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};