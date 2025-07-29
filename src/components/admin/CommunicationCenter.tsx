import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MessageSquare, 
  Send, 
  Mail, 
  Phone,
  Search,
  Plus,
  Settings,
  Clock,
  CheckCircle
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const CommunicationCenter: React.FC = () => {
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);

  const messages = [
    {
      id: "1",
      studentName: "Sarah Johnson",
      subject: "Question about HCA Program Requirements",
      message: "Hi, I have a question about the clinical placement requirements for the Health Care Assistant program...",
      timestamp: "2024-01-15 14:30",
      status: "unread",
      priority: "normal",
      assignedTo: "Nicole Adams",
      program: "Health Care Assistant",
      channel: "email"
    },
    {
      id: "2",
      studentName: "Michael Chen", 
      subject: "Payment Plan Inquiry",
      message: "I would like to know more about the available payment plans for the ECE program...",
      timestamp: "2024-01-15 12:15",
      status: "replied",
      priority: "normal",
      assignedTo: "Robert Smith",
      program: "Early Childhood Education",
      channel: "portal"
    },
    {
      id: "3",
      studentName: "Emma Davis",
      subject: "Document Upload Issue",
      message: "I'm having trouble uploading my transcript. The file seems to be the right size but...",
      timestamp: "2024-01-15 09:45",
      status: "in-progress",
      priority: "high",
      assignedTo: "Sarah Kim",
      program: "Aviation Maintenance",
      channel: "portal"
    }
  ];

  const automations = [
    {
      id: "1",
      name: "Welcome Email Sequence",
      trigger: "New application submitted",
      status: "active",
      lastSent: "2 hours ago",
      recipients: 25
    },
    {
      id: "2",
      name: "Document Reminder",
      trigger: "7 days after document request",
      status: "active", 
      lastSent: "1 day ago",
      recipients: 12
    },
    {
      id: "3",
      name: "Payment Due Reminder",
      trigger: "3 days before payment deadline",
      status: "paused",
      lastSent: "5 days ago",
      recipients: 0
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "unread": return "destructive";
      case "replied": return "default";
      case "in-progress": return "secondary";
      case "resolved": return "outline";
      default: return "outline";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-600";
      case "medium": return "text-yellow-600";
      case "normal": return "text-green-600";
      default: return "text-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Communication Center</h1>
          <p className="text-muted-foreground">Manage all student communications and automations</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button>
            <Send className="h-4 w-4 mr-2" />
            Send Message
          </Button>
        </div>
      </div>

      {/* Communication Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: "Unread Messages", count: 23, icon: MessageSquare, color: "text-red-600" },
          { title: "Emails Sent Today", count: 156, icon: Mail, color: "text-blue-600" },
          { title: "Response Time", count: "2.5h", icon: Clock, color: "text-green-600" },
          { title: "Resolved Today", count: 89, icon: CheckCircle, color: "text-purple-600" }
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

      <Tabs defaultValue="messages" className="space-y-4">
        <TabsList>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="automations">Automations</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="messages" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search messages..." className="pl-10" />
                  </div>
                </div>
                <Select>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="unread">Unread</SelectItem>
                    <SelectItem value="replied">Replied</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Assigned to" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Staff</SelectItem>
                    <SelectItem value="nicole">Nicole Adams</SelectItem>
                    <SelectItem value="robert">Robert Smith</SelectItem>
                    <SelectItem value="sarah">Sarah Kim</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Messages Table */}
          <Card>
            <CardHeader>
              <CardTitle>Student Messages ({messages.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Program</TableHead>
                    <TableHead>Channel</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {messages.map((message) => (
                    <TableRow key={message.id} className={message.status === 'unread' ? 'bg-blue-50' : ''}>
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedMessages.includes(message.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedMessages([...selectedMessages, message.id]);
                            } else {
                              setSelectedMessages(selectedMessages.filter(id => id !== message.id));
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src="/placeholder.svg" />
                            <AvatarFallback>{message.studentName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{message.studentName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{message.subject}</p>
                          <p className="text-sm text-muted-foreground line-clamp-1">{message.message}</p>
                        </div>
                      </TableCell>
                      <TableCell>{message.program}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          {message.channel === 'email' ? (
                            <Mail className="h-4 w-4 text-blue-600" />
                          ) : (
                            <MessageSquare className="h-4 w-4 text-green-600" />
                          )}
                          <span className="text-sm capitalize">{message.channel}</span>
                        </div>
                      </TableCell>
                      <TableCell>{message.assignedTo}</TableCell>
                      <TableCell>
                        <span className={`text-sm ${getPriorityColor(message.priority)}`}>
                          {message.priority}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(message.status)}>
                          {message.status.replace('-', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(message.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automations" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Communication Automations</CardTitle>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Automation
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {automations.map((automation) => (
                  <div key={automation.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{automation.name}</h3>
                      <p className="text-sm text-muted-foreground">Trigger: {automation.trigger}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Last sent: {automation.lastSent} • {automation.recipients} recipients
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={automation.status === 'active' ? 'default' : 'secondary'}>
                        {automation.status}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>Message Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Create and manage reusable message templates for common communications.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Communication Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Track response times, message volume, and communication effectiveness.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommunicationCenter;