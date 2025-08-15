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
  Clock,
  Monitor
} from "lucide-react";
import { usePortalContent, useContentMutations, usePortalMessages, useMessageMutations, usePortalConfig, useConfigMutations, useRealTimePortalUpdates } from "@/hooks/useStudentPortal";
import { useConditionalStudents } from "@/hooks/useConditionalStudents";
import { StudentPortalContent, StudentPortalMessage, StudentPortalConfig } from "@/services/studentPortalService";
import { StudentPortalPreview } from "./StudentPortalPreview";

export const StudentPortalManagement = () => {
  const [activeTab, setActiveTab] = useState("content");
  const [showContentDialog, setShowContentDialog] = useState(false);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
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
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowPreviewDialog(true)}>
            <Monitor className="mr-2 h-4 w-4" />
            Preview Portal
          </Button>
          <Button onClick={handleCreateContent}>
            <Plus className="mr-2 h-4 w-4" />
            Add Content
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
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
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            Preview
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
          <div className="grid gap-6">
            {/* General Settings */}
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Configure basic portal settings and appearance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoadingConfig ? (
                  <div className="text-center py-8">Loading configuration...</div>
                ) : (
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="portal-title">Portal Title</Label>
                      <Input 
                        id="portal-title"
                        placeholder="Enter portal title"
                        value={configForm.portal_title}
                        onChange={(e) => setConfigForm({ ...configForm, portal_title: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="welcome-message">Welcome Message</Label>
                      <Textarea 
                        id="welcome-message"
                        placeholder="Enter welcome message for students"
                        value={configForm.welcome_message}
                        onChange={(e) => setConfigForm({ ...configForm, welcome_message: e.target.value })}
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Portal Theme</Label>
                        <Select defaultValue="default">
                          <SelectTrigger>
                            <SelectValue placeholder="Select theme" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="default">Default</SelectItem>
                            <SelectItem value="blue">Blue Theme</SelectItem>
                            <SelectItem value="green">Green Theme</SelectItem>
                            <SelectItem value="purple">Purple Theme</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Language</Label>
                        <Select defaultValue="en">
                          <SelectTrigger>
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Spanish</SelectItem>
                            <SelectItem value="fr">French</SelectItem>
                            <SelectItem value="pt">Portuguese</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Feature Toggles */}
            <Card>
              <CardHeader>
                <CardTitle>Feature Management</CardTitle>
                <CardDescription>
                  Enable or disable specific portal features for students
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="app-tracking">Application Tracking</Label>
                      <p className="text-xs text-muted-foreground">Allow students to track their applications and progress</p>
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
                      <p className="text-xs text-muted-foreground">Enable online fee payment functionality</p>
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
                      <p className="text-xs text-muted-foreground">Enable student message center and notifications</p>
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
                      <p className="text-xs text-muted-foreground">Allow students to upload required documents</p>
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
                      <p className="text-xs text-muted-foreground">Enable advisor contact and scheduling features</p>
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
                      <p className="text-xs text-muted-foreground">Allow students to register for events and webinars</p>
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
              </CardContent>
            </Card>

            {/* Security & Access Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Security & Access</CardTitle>
                <CardDescription>
                  Configure security settings and access controls
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-xs text-muted-foreground">Require 2FA for student accounts</p>
                    </div>
                    <Switch defaultChecked={false} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Password Requirements</Label>
                      <p className="text-xs text-muted-foreground">Enforce strong password policies</p>
                    </div>
                    <Switch defaultChecked={true} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Session Timeout</Label>
                      <p className="text-xs text-muted-foreground">Auto-logout after inactivity</p>
                    </div>
                    <Select defaultValue="30">
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Data Retention Period</Label>
                      <p className="text-xs text-muted-foreground">How long to keep student data</p>
                    </div>
                    <Select defaultValue="7">
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 year</SelectItem>
                        <SelectItem value="3">3 years</SelectItem>
                        <SelectItem value="5">5 years</SelectItem>
                        <SelectItem value="7">7 years</SelectItem>
                        <SelectItem value="10">10 years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Configure how and when students receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Email Notifications</Label>
                      <p className="text-xs text-muted-foreground">Send notifications via email</p>
                    </div>
                    <Switch defaultChecked={true} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>SMS Notifications</Label>
                      <p className="text-xs text-muted-foreground">Send notifications via SMS</p>
                    </div>
                    <Switch defaultChecked={false} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Push Notifications</Label>
                      <p className="text-xs text-muted-foreground">Send browser push notifications</p>
                    </div>
                    <Switch defaultChecked={true} />
                  </div>
                  <div className="space-y-2">
                    <Label>Notification Frequency</Label>
                    <Select defaultValue="immediate">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediate">Immediate</SelectItem>
                        <SelectItem value="hourly">Hourly Digest</SelectItem>
                        <SelectItem value="daily">Daily Digest</SelectItem>
                        <SelectItem value="weekly">Weekly Summary</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Quiet Hours</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input type="time" defaultValue="22:00" placeholder="Start time" />
                      <Input type="time" defaultValue="08:00" placeholder="End time" />
                    </div>
                    <p className="text-xs text-muted-foreground">No notifications will be sent during these hours</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customization Options */}
            <Card>
              <CardHeader>
                <CardTitle>Portal Customization</CardTitle>
                <CardDescription>
                  Customize the look and feel of the student portal
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label>Institution Logo</Label>
                    <div className="flex items-center gap-2">
                      <Input type="file" accept="image/*" className="flex-1" />
                      <Button variant="outline" size="sm">Upload</Button>
                    </div>
                    <p className="text-xs text-muted-foreground">Recommended size: 200x80px</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Favicon</Label>
                    <div className="flex items-center gap-2">
                      <Input type="file" accept="image/*" className="flex-1" />
                      <Button variant="outline" size="sm">Upload</Button>
                    </div>
                    <p className="text-xs text-muted-foreground">Recommended size: 32x32px</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Custom CSS</Label>
                    <Textarea 
                      placeholder="Add custom CSS to further customize the portal appearance"
                      rows={4}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Dark Mode Support</Label>
                      <p className="text-xs text-muted-foreground">Allow students to switch to dark mode</p>
                    </div>
                    <Switch defaultChecked={true} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Integration Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Integration Settings</CardTitle>
                <CardDescription>
                  Configure third-party service integrations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Google Calendar Integration</Label>
                      <p className="text-xs text-muted-foreground">Sync events with Google Calendar</p>
                    </div>
                    <Switch defaultChecked={false} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Microsoft Teams Integration</Label>
                      <p className="text-xs text-muted-foreground">Enable Teams meeting links</p>
                    </div>
                    <Switch defaultChecked={false} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Payment Gateway</Label>
                      <p className="text-xs text-muted-foreground">Enable online payments</p>
                    </div>
                    <Select defaultValue="none">
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="stripe">Stripe</SelectItem>
                        <SelectItem value="paypal">PayPal</SelectItem>
                        <SelectItem value="square">Square</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Analytics Tracking</Label>
                      <p className="text-xs text-muted-foreground">Track student portal usage</p>
                    </div>
                    <Switch defaultChecked={true} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-2">
              <Button onClick={handleSaveConfig} className="flex-1">
                Save All Settings
              </Button>
              <Button variant="outline" onClick={() => setShowPreviewDialog(true)}>
                Preview Changes
              </Button>
            </div>
          </div>
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

        <TabsContent value="preview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Portal Preview</CardTitle>
              <CardDescription>
                Preview how the student portal appears to students with current content and configuration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-8">
                <Monitor className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h4 className="text-lg font-medium mb-2">Student Portal Preview</h4>
                <p className="text-muted-foreground mb-4">
                  See how your portal looks to students with the current content and settings.
                </p>
                <Button onClick={() => setShowPreviewDialog(true)}>
                  <Eye className="mr-2 h-4 w-4" />
                  Open Preview
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="p-4 border rounded-lg">
                  <h5 className="font-medium mb-2">Current Configuration</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Portal Title:</span>
                      <span className="text-muted-foreground">
                        {portalConfig?.portal_title || 'Student Portal'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Published Content:</span>
                      <span className="text-muted-foreground">
                        {portalContent.filter(c => c.is_published).length} items
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Active Messages:</span>
                      <span className="text-muted-foreground">
                        {portalMessages.length} messages
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h5 className="font-medium mb-2">Enabled Features</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${portalConfig?.features?.application_tracking ? 'bg-green-500' : 'bg-gray-300'}`} />
                      <span>Application Tracking</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${portalConfig?.features?.fee_payments ? 'bg-green-500' : 'bg-gray-300'}`} />
                      <span>Fee Payments</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${portalConfig?.features?.message_center ? 'bg-green-500' : 'bg-gray-300'}`} />
                      <span>Message Center</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${portalConfig?.features?.document_upload ? 'bg-green-500' : 'bg-gray-300'}`} />
                      <span>Document Upload</span>
                    </div>
                  </div>
                </div>
              </div>
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

      {/* Portal Preview Dialog */}
      <StudentPortalPreview 
        open={showPreviewDialog} 
        onOpenChange={setShowPreviewDialog} 
      />
    </div>
  );
};