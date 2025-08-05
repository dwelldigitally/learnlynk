import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Settings, 
  MessageSquare, 
  FileText, 
  Users, 
  Plus,
  Edit,
  Trash2,
  Eye,
  Bell
} from "lucide-react";

export const StudentPortalManagement = () => {
  const [activeTab, setActiveTab] = useState("content");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Student Portal Management</h1>
          <p className="text-muted-foreground">
            Manage student portal content, messages, and configuration
          </p>
        </div>
        <Button>
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
              <div className="grid gap-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <h4 className="font-medium">Welcome Message</h4>
                    <p className="text-sm text-muted-foreground">
                      Welcome to your student portal dashboard
                    </p>
                    <div className="flex gap-2">
                      <Badge variant="secondary">Announcement</Badge>
                      <Badge variant="outline">Published</Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <h4 className="font-medium">Academic Calendar Update</h4>
                    <p className="text-sm text-muted-foreground">
                      Important dates for the upcoming semester
                    </p>
                    <div className="flex gap-2">
                      <Badge variant="secondary">News</Badge>
                      <Badge variant="outline">Published</Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
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
                <div className="space-y-4 p-4 border rounded-lg">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Message Title</label>
                    <Input placeholder="Enter message title" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Message Content</label>
                    <Textarea placeholder="Enter message content" rows={4} />
                  </div>
                  <div className="flex gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Message Type</label>
                      <select className="w-full p-2 border rounded-md">
                        <option value="info">Information</option>
                        <option value="warning">Warning</option>
                        <option value="success">Success</option>
                        <option value="error">Error</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Priority</label>
                      <select className="w-full p-2 border rounded-md">
                        <option value="normal">Normal</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button>
                      <Bell className="mr-2 h-4 w-4" />
                      Send Message
                    </Button>
                    <Button variant="outline">Save Draft</Button>
                  </div>
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
              <div className="grid gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">General Settings</h4>
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Portal Title</label>
                      <Input defaultValue="Student Portal" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Welcome Message</label>
                      <Textarea defaultValue="Welcome to your student portal" rows={3} />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Feature Toggles</h4>
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium">Application Tracking</label>
                        <p className="text-xs text-muted-foreground">Allow students to track their applications</p>
                      </div>
                      <input type="checkbox" defaultChecked className="h-4 w-4" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium">Fee Payments</label>
                        <p className="text-xs text-muted-foreground">Enable fee payment functionality</p>
                      </div>
                      <input type="checkbox" defaultChecked className="h-4 w-4" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium">Message Center</label>
                        <p className="text-xs text-muted-foreground">Enable student message center</p>
                      </div>
                      <input type="checkbox" defaultChecked className="h-4 w-4" />
                    </div>
                  </div>
                </div>

                <Button>Save Configuration</Button>
              </div>
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
              <div className="grid gap-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <h4 className="font-medium">John Smith</h4>
                    <p className="text-sm text-muted-foreground">john.smith@email.com</p>
                    <div className="flex gap-2">
                      <Badge variant="secondary">Computer Science</Badge>
                      <Badge variant="outline">Active</Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">View Portal</Button>
                    <Button variant="outline" size="sm">Manage Access</Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <h4 className="font-medium">Sarah Johnson</h4>
                    <p className="text-sm text-muted-foreground">sarah.johnson@email.com</p>
                    <div className="flex gap-2">
                      <Badge variant="secondary">Business Administration</Badge>
                      <Badge variant="outline">Active</Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">View Portal</Button>
                    <Button variant="outline" size="sm">Manage Access</Button>
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