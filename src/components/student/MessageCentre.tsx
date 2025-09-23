import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, Mail, Clock, Check, AlertCircle, Paperclip, Send, Upload, X, Search, Filter, Eye, EyeOff, MoreVertical, Download, Phone, Video, Star, Archive, Volume2, Settings, Users, Calendar, FileText, CheckCircle2, AlertTriangle, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";
import advisorNicole from "@/assets/advisor-nicole.jpg";
import { usePageEntranceAnimation, useStaggeredReveal, useCountUp } from "@/hooks/useAnimations";
import { dummyMessages, dummyStudentProfile } from "@/data/studentPortalDummyData";
import { useToast } from "@/hooks/use-toast";
import { MessageStatusIndicator, ThreadPreview, TypingIndicator, DocumentRequestCard, QuickActions } from "./MessageCentreComponents";

interface Message {
  id: string;
  from: string;
  fromRole: string;
  avatar: string;
  content: string;
  timestamp: Date;
  isFromAdvisor: boolean;
  type: 'text' | 'system' | 'document_request' | 'milestone' | 'reminder';
  status: 'sent' | 'delivered' | 'read';
  attachments?: Attachment[];
  documentRequest?: DocumentRequest;
  systemData?: SystemMessageData;
  isEdited?: boolean;
  editedAt?: Date;
}

interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  downloadUrl?: string;
}

interface DocumentRequest {
  documentType: string;
  description: string;
  deadline?: Date;
  isUrgent: boolean;
  requirements: string[];
}

interface SystemMessageData {
  eventType: 'application_received' | 'document_approved' | 'payment_required' | 'deadline_reminder' | 'milestone_reached';
  title: string;
  details: Record<string, any>;
}

interface MessageThread {
  id: string;
  subject: string;
  participants: {
    advisor: {
      name: string;
      role: string;
      avatar: string;
      isOnline?: boolean;
      lastSeen?: Date;
    };
    student: {
      name: string;
      avatar: string;
    };
  };
  messages: Message[];
  lastMessage: Message;
  unreadCount: number;
  priority: "high" | "medium" | "low";
  relatedApplication?: string;
  category: 'general' | 'documents' | 'application' | 'payment' | 'system';
  isArchived?: boolean;
  isPinned?: boolean;
  tags?: string[];
  documentProgress?: {
    required: number;
    submitted: number;
    approved: number;
  };
}

const MessageCentre: React.FC = () => {
  const [selectedThread, setSelectedThread] = useState<MessageThread | null>(null);
  const [replyText, setReplyText] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedDocumentType, setSelectedDocumentType] = useState<string>("");
  
  // Enhanced state for new features
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showArchived, setShowArchived] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [showDocumentPanel, setShowDocumentPanel] = useState(false);
  const [messageFilter, setMessageFilter] = useState<'all' | 'unread' | 'important'>('all');
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Hooks
  const { toast } = useToast();
  
  // Animation hooks
  const isLoaded = usePageEntranceAnimation();
  const { visibleItems: threadItems, ref: threadRef } = useStaggeredReveal(5, 150);
  const { visibleItems: messageItems, ref: messageRef } = useStaggeredReveal(10, 100);
  const { count: unreadCount, ref: unreadRef } = useCountUp(0, 1000);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (selectedThread && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedThread?.messages]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate advisor online status changes
      if (Math.random() > 0.8) {
        setIsTyping(prev => !prev);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Enhanced mock message threads with more realistic data
  const messageThreads: MessageThread[] = [
    {
      id: "thread-1",
      subject: "Document Review Update - Health Care Assistant",
      participants: {
        advisor: {
          name: "Nicole Ye",
          role: "Senior Admissions Advisor",
          avatar: advisorNicole,
          isOnline: true,
          lastSeen: new Date(),
        },
        student: {
          name: "Tushar Malhotra",
          avatar: "/lovable-uploads/3c634d34-1dd4-4d6c-a352-49362db4fc12.png",
        },
      },
      messages: [
        {
          id: "msg-1",
          from: "Nicole Ye",
          fromRole: "Senior Admissions Advisor",
          avatar: advisorNicole,
          content: `Dear Tushar,

Welcome to Western Community College! I'm Nicole Ye, your dedicated admissions advisor for the Health Care Assistant program.

I'm here to guide you through every step of the admissions process. Please don't hesitate to reach out if you have any questions about:

• Document requirements
• Application deadlines
• Program information
• Career prospects

I've noticed you've started your application - great first step! I'll be monitoring your progress and will reach out with updates as your application moves through our review process.

Looking forward to helping you achieve your career goals in healthcare!

Best regards,
Nicole Ye
nicole@wcc.ca
(604)-594-3500`,
          timestamp: new Date("2025-01-15T14:20:00"),
          isFromAdvisor: true,
          type: 'text',
          status: 'read',
        },
        {
          id: "msg-2",
          from: "Nicole Ye",
          fromRole: "Senior Admissions Advisor",
          avatar: advisorNicole,
          content: `Dear Tushar,

I have reviewed your submitted documents for the Health Care Assistant program. Here's the status update:

✅ Official Transcripts - Approved
✅ Photo ID - Approved  
✅ Criminal Record Check - Approved
⏳ Immunization Records - Under Review
❌ First Aid Certificate - Needs Attention

Your First Aid certificate has expired. Please upload a current First Aid certificate to proceed with your application. You can obtain this from any certified provider like Red Cross or St. John Ambulance.

The immunization records are being verified with our medical team. You should receive an update within 2-3 business days.

Please upload the new First Aid certificate at your earliest convenience to avoid any delays in processing your application.

Best regards,
Nicole Ye
Senior Admissions Advisor
Western Community College`,
          timestamp: new Date("2025-01-17T10:30:00"),
          isFromAdvisor: true,
          type: 'document_request',
          status: 'delivered',
          documentRequest: {
            documentType: 'first-aid',
            description: 'Current First Aid Certificate',
            deadline: new Date("2025-01-24T23:59:59"),
            isUrgent: true,
            requirements: [
              'Must be from certified provider (Red Cross, St. John Ambulance)',
              'Certificate must be current and not expired',
              'Clear, legible scan or photo'
            ]
          },
        },
      ],
      lastMessage: {
        id: "msg-2",
        from: "Nicole Ye",
        fromRole: "Senior Admissions Advisor",
        avatar: advisorNicole,
        content: "Your First Aid certificate has expired. Please upload a current First Aid certificate to proceed with your application...",
        timestamp: new Date("2025-01-17T10:30:00"),
        isFromAdvisor: true,
        type: 'document_request',
        status: 'delivered',
      },
      unreadCount: 1,
      priority: "high",
      relatedApplication: "HCA-1047859",
      category: 'documents',
      isPinned: true,
      tags: ['urgent', 'documents'],
      documentProgress: {
        required: 6,
        submitted: 5,
        approved: 3
      }
    },
    {
      id: "thread-2",
      subject: "Application Received - Health Care Assistant",
      participants: {
        advisor: {
          name: "Admissions Office",
          role: "Automated System",
          avatar: "/lovable-uploads/120260b6-bc38-4844-841b-c6a5b6067560.png",
          isOnline: false,
        },
        student: {
          name: "Tushar Malhotra",
          avatar: "/lovable-uploads/3c634d34-1dd4-4d6c-a352-49362db4fc12.png",
        },
      },
      messages: [
        {
          id: "msg-3",
          from: "Admissions Office",
          fromRole: "Automated System",
          avatar: "/lovable-uploads/120260b6-bc38-4844-841b-c6a5b6067560.png",
          content: `Dear Tushar Malhotra,

Thank you for submitting your application for the Health Care Assistant program!

Application Details:
• Application ID: HCA-1047859
• Program: Health Care Assistant
• Selected Intake: 15th March 2025
• Submission Date: January 15, 2025

Your application is now in our system and will be reviewed by our admissions team. You will receive updates as your application progresses through the following stages:

1. ✅ Application Received
2. 🔄 Document Review (Current Stage)
3. ⏳ Document Approval
4. ⏳ Fee Payment
5. ⏳ Final Approval

You can track your application progress in your student portal at any time.

If you have any questions, please contact your admissions advisor Nicole Ye at nicole@wcc.ca.

Best regards,
Western Community College Admissions Office`,
          timestamp: new Date("2025-01-15T09:45:00"),
          isFromAdvisor: true,
          type: 'system',
          status: 'read',
          systemData: {
            eventType: 'application_received',
            title: 'Application Received',
            details: {
              applicationId: 'HCA-1047859',
              program: 'Health Care Assistant',
              intake: '15th March 2025'
            }
          },
        }
      ],
      lastMessage: {
        id: "msg-3",
        from: "Admissions Office",
        fromRole: "Automated System",
        avatar: "/lovable-uploads/120260b6-bc38-4844-841b-c6a5b6067560.png",
        content: "Thank you for submitting your application for the Health Care Assistant program!...",
        timestamp: new Date("2025-01-15T09:45:00"),
        isFromAdvisor: true,
        type: 'system',
        status: 'read',
      },
      unreadCount: 0,
      priority: "low",
      relatedApplication: "HCA-1047859",
      category: 'system',
      tags: ['automated']
    }
  ];

  // Filter threads based on search and category
  const filteredThreads = messageThreads.filter(thread => {
    const matchesSearch = thread.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         thread.participants.advisor.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || thread.category === selectedCategory;
    const matchesArchived = showArchived ? thread.isArchived : !thread.isArchived;
    const matchesFilter = messageFilter === 'all' || 
                         (messageFilter === 'unread' && thread.unreadCount > 0) ||
                         (messageFilter === 'important' && (thread.priority === 'high' || thread.isPinned));
    
    return matchesSearch && matchesCategory && matchesArchived && matchesFilter;
  });

  const totalUnreadCount = messageThreads.reduce((sum, thread) => sum + thread.unreadCount, 0);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800 border-red-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  // Enhanced file handling with drag and drop
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    handleFilesAdded(files);
  };

  const handleFilesAdded = (files: File[]) => {
    const validFiles = files.filter(file => {
      const isValidType = file.type.includes('pdf') || file.type.includes('image') || 
                         file.type.includes('document') || file.type.includes('text');
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit
      
      if (!isValidType) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not a supported file type.`,
          variant: "destructive",
        });
        return false;
      }
      
      if (!isValidSize) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds the 10MB limit.`,
          variant: "destructive",
        });
        return false;
      }
      
      return true;
    });
    
    setSelectedFiles(prev => [...prev, ...validFiles]);
    
    if (validFiles.length > 0) {
      toast({
        title: "Files added",
        description: `${validFiles.length} file(s) ready to send.`,
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    handleFilesAdded(files);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSendReply = () => {
    if (!selectedThread || (!replyText.trim() && selectedFiles.length === 0)) return;

    // Create attachments from selected files
    const attachments: Attachment[] = selectedFiles.map(file => ({
      id: `att-${Date.now()}-${Math.random()}`,
      name: file.name,
      type: file.type,
      size: file.size,
      url: URL.createObjectURL(file),
    }));

    // Create new message from student
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      from: "Tushar Malhotra",
      fromRole: "Student",
      avatar: "/lovable-uploads/3c634d34-1dd4-4d6c-a352-49362db4fc12.png",
      content: replyText,
      timestamp: new Date(),
      isFromAdvisor: false,
      type: 'text',
      status: 'sent',
      attachments: attachments.length > 0 ? attachments : undefined,
    };

    // Update the selected thread with the new message
    const updatedThread = {
      ...selectedThread,
      messages: [...selectedThread.messages, newMessage],
      lastMessage: newMessage,
    };

    setSelectedThread(updatedThread);

    // Show success toast
    toast({
      title: "Message sent",
      description: selectedFiles.length > 0 
        ? `Message sent with ${selectedFiles.length} attachment(s).`
        : "Message sent successfully.",
    });

    // Reset form
    setReplyText("");
    setSelectedFiles([]);
    setSelectedDocumentType("");
    
    // Simulate message status updates
    setTimeout(() => {
      const deliveredMessage = { ...newMessage, status: 'delivered' as const };
      const updatedThreadDelivered = {
        ...updatedThread,
        messages: updatedThread.messages.map(msg => 
          msg.id === newMessage.id ? deliveredMessage : msg
        ),
      };
      setSelectedThread(updatedThreadDelivered);
    }, 1000);
  };

  // Simulate typing indicator
  const handleTypingStart = () => {
    if (typingTimeout) clearTimeout(typingTimeout);
    setIsTyping(true);
    
    const timeout = setTimeout(() => {
      setIsTyping(false);
    }, 3000);
    
    setTypingTimeout(timeout);
  };

  // Mark message as read
  const markAsRead = (threadId: string) => {
    // This would typically call an API to mark messages as read
    toast({
      title: "Marked as read",
      description: "All messages in this thread have been marked as read.",
    });
  };

  // Mock document requirements for the HCA program with status
  const documentRequirements = [
    { id: "transcript", name: "Official Transcripts", status: "approved" },
    { id: "photo-id", name: "Photo ID", status: "approved" },
    { id: "criminal-check", name: "Criminal Record Check", status: "approved" },
    { id: "immunization", name: "Immunization Records", status: "under-review" },
    { id: "first-aid", name: "First Aid Certificate", status: "needs-attention" },
    { id: "english-proof", name: "English Proficiency Test", status: "not-submitted" },
  ];

  const getDocumentStatusIcon = (status: string) => {
    switch (status) {
      case "approved": return "✅";
      case "under-review": return "⏳";
      case "needs-attention": return "❌";
      case "not-submitted": return "📄";
      default: return "📄";
    }
  };

  if (selectedThread) {
    return (
      <div className="max-w-6xl mx-auto">
        {/* Enhanced Thread View Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => setSelectedThread(null)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Messages
            </Button>
            <div className="flex items-center gap-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src={selectedThread.participants.advisor.avatar} />
                <AvatarFallback>
                  {selectedThread.participants.advisor.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{selectedThread.participants.advisor.name}</span>
                  {selectedThread.participants.advisor.isOnline && (
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-green-600">Online</span>
                    </div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{selectedThread.participants.advisor.role}</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => markAsRead(selectedThread.id)}>
              <Eye className="w-4 h-4 mr-2" />
              Mark as Read
            </Button>
            <TooltipProvider>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => toast({ title: "Scheduling call...", description: "This feature will be available soon." })}>
                    <Phone className="w-4 h-4 mr-2" />
                    Schedule Call
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast({ title: "Starting video call...", description: "This feature will be available soon." })}>
                    <Video className="w-4 h-4 mr-2" />
                    Video Call
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => toast({ title: "Thread archived", description: "This conversation has been archived." })}>
                    <Archive className="w-4 h-4 mr-2" />
                    Archive
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TooltipProvider>
            {showDocumentPanel && (
              <Button variant="outline" size="sm" onClick={() => setShowDocumentPanel(false)}>
                <X className="w-4 h-4 mr-2" />
                Close Panel
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main conversation area */}
          <div className="lg:col-span-2 space-y-4">
            {/* Thread Header */}
            <Card className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold mb-2">{selectedThread.subject}</h2>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Application: {selectedThread.relatedApplication}</span>
                    <span>•</span>
                    <span>{selectedThread.messages.length} messages</span>
                    {selectedThread.documentProgress && (
                      <>
                        <span>•</span>
                        <span>Documents: {selectedThread.documentProgress.approved}/{selectedThread.documentProgress.required} approved</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getPriorityColor(selectedThread.priority)}>
                    {selectedThread.priority.toUpperCase()}
                  </Badge>
                  {selectedThread.isPinned && (
                    <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-200">
                      <Star className="w-3 h-3 mr-1 fill-current" />
                      Pinned
                    </Badge>
                  )}
                </div>
              </div>
              
              {selectedThread.documentProgress && (
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">Document Progress</span>
                    <span>{selectedThread.documentProgress.approved}/{selectedThread.documentProgress.required} approved</span>
                  </div>
                  <Progress 
                    value={(selectedThread.documentProgress.approved / selectedThread.documentProgress.required) * 100} 
                    className="h-2"
                  />
                </div>
              )}
            </Card>

            {/* Messages in Thread */}
            <ScrollArea className="h-[600px]">
              <div className="space-y-4 pr-4">
                {selectedThread.messages.map((message, index) => (
                  <div key={message.id}>
                    {/* System messages get special treatment */}
                    {message.type === 'system' && (
                      <div className="flex justify-center my-4">
                        <div className="bg-muted px-4 py-2 rounded-full text-sm text-muted-foreground flex items-center gap-2">
                          <Info className="w-4 h-4" />
                          {message.systemData?.title || 'System Message'}
                        </div>
                      </div>
                    )}
                    
                    <Card className={`p-4 ${
                      message.isFromAdvisor 
                        ? 'bg-background' 
                        : 'bg-primary/5 ml-12'
                    } ${message.type === 'document_request' ? 'border-l-4 border-l-orange-500' : ''}`}>
                      <div className="flex items-start gap-4">
                        <Avatar className="w-10 h-10 flex-shrink-0">
                          <AvatarImage src={message.avatar} />
                          <AvatarFallback>
                            {message.from.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">{message.from}</span>
                              <span className="text-xs text-muted-foreground">- {message.fromRole}</span>
                              {message.type === 'document_request' && (
                                <Badge variant="outline" className="text-xs bg-orange-100 text-orange-700 border-orange-200">
                                  <FileText className="w-3 h-3 mr-1" />
                                  Document Request
                                </Badge>
                              )}
                              {message.type === 'system' && (
                                <Badge variant="outline" className="text-xs">
                                  <Settings className="w-3 h-3 mr-1" />
                                  System
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">
                                {message.timestamp.toLocaleString()}
                              </span>
                              {!message.isFromAdvisor && (
                                <MessageStatusIndicator status={message.status} />
                              )}
                            </div>
                          </div>
                          
                          <div className="whitespace-pre-line text-foreground leading-relaxed mb-3">
                            {message.content}
                          </div>
                          
                          {/* Attachments */}
                          {message.attachments && message.attachments.length > 0 && (
                            <div className="space-y-2 mb-3">
                              <p className="text-sm font-medium text-muted-foreground">Attachments:</p>
                              {message.attachments.map((attachment) => (
                                <div key={attachment.id} className="flex items-center gap-2 bg-muted p-2 rounded-md">
                                  <FileText className="w-4 h-4 text-muted-foreground" />
                                  <span className="text-sm flex-1">{attachment.name}</span>
                                  <span className="text-xs text-muted-foreground">
                                    ({(attachment.size / 1024 / 1024).toFixed(2)} MB)
                                  </span>
                                  <Button variant="ghost" size="sm">
                                    <Download className="w-4 h-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {/* Document request details */}
                          {message.type === 'document_request' && message.documentRequest && (
                            <DocumentRequestCard 
                              documentRequest={message.documentRequest}
                              onUpload={() => setShowDocumentPanel(true)}
                            />
                          )}
                        </div>
                      </div>
                    </Card>
                  </div>
                ))}
                
                {/* Typing indicator */}
                {isTyping && (
                  <TypingIndicator advisorName={selectedThread.participants.advisor.name} />
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Enhanced Reply Section */}
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Send className="w-5 h-5" />
                Reply to {selectedThread.participants.advisor.name}
              </h3>
              
              <div className="space-y-4">
                <div 
                  className={`relative ${dragOver ? 'border-primary border-dashed bg-primary/5' : ''}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <Textarea
                    placeholder="Type your message here... (or drag and drop files)"
                    value={replyText}
                    onChange={(e) => {
                      setReplyText(e.target.value);
                      handleTypingStart();
                    }}
                    className="min-h-[120px] resize-none"
                  />
                  {dragOver && (
                    <div className="absolute inset-0 bg-primary/10 border-2 border-dashed border-primary rounded-md flex items-center justify-center">
                      <div className="text-center">
                        <Upload className="w-8 h-8 mx-auto mb-2 text-primary" />
                        <p className="text-sm font-medium text-primary">Drop files here to attach</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Enhanced File Upload Section */}
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                      <Input
                        ref={fileInputRef}
                        type="file"
                        onChange={handleFileSelect}
                        multiple
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.txt,.xlsx,.ppt,.pptx"
                        className="hidden"
                        id="file-upload"
                      />
                      <Button
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full"
                      >
                        <Paperclip className="w-4 h-4 mr-2" />
                        Attach Files
                      </Button>
                    </div>
                    
                    <div>
                      <Select value={selectedDocumentType} onValueChange={setSelectedDocumentType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Document Type" />
                        </SelectTrigger>
                        <SelectContent>
                          {documentRequirements.map((req) => (
                            <SelectItem key={req.id} value={req.id}>
                              <div className="flex items-center gap-2">
                                <span>{getDocumentStatusIcon(req.status)}</span>
                                <Upload className="w-4 h-4" />
                                <span>{req.name}</span>
                                <Badge variant="outline" className="ml-auto text-xs">
                                  {req.status.replace('-', ' ')}
                                </Badge>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Enhanced Selected Files Display */}
                  {selectedFiles.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-foreground">Attached Files ({selectedFiles.length}):</p>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setSelectedFiles([])}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          Clear All
                        </Button>
                      </div>
                      <div className="grid gap-2">
                        {selectedFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-muted p-3 rounded-md border">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="p-2 bg-primary/10 rounded-md flex-shrink-0">
                                <FileText className="w-4 h-4 text-primary" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium truncate">{file.name}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-xs text-muted-foreground">
                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                  </span>
                                  {selectedDocumentType && (
                                    <Badge variant="secondary" className="text-xs">
                                      {documentRequirements.find(req => req.id === selectedDocumentType)?.name}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(index)}
                              className="text-muted-foreground hover:text-destructive flex-shrink-0"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
            </div>

                  {/* Enhanced Send Button */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      {selectedFiles.length > 0 && (
                        <span>{selectedFiles.length} file(s) attached</span>
                      )}
                      {replyText.length > 0 && (
                        <span>{replyText.length} characters</span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setReplyText("");
                          setSelectedFiles([]);
                          setSelectedDocumentType("");
                        }}
                        disabled={!replyText.trim() && selectedFiles.length === 0}
                      >
                        Clear
                      </Button>
                      <Button
                        onClick={handleSendReply}
                        disabled={!replyText.trim() && selectedFiles.length === 0}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Send Reply
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
            
            {/* Right sidebar for document panel and quick actions */}
            <div className="lg:col-span-1 space-y-4">
              {/* Application Overview Card */}
              <Card className="p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Application Overview
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Application ID:</span>
                    <span className="font-medium">{selectedThread.relatedApplication}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Program:</span>
                    <span className="font-medium">Health Care Assistant</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge variant="outline">Document Review</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Priority:</span>
                    <Badge className={getPriorityColor(selectedThread.priority)}>
                      {selectedThread.priority.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </Card>
              
              {/* Quick Actions */}
              <Card className="p-4">
                <h3 className="font-semibold mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" onClick={() => toast({ title: "Feature coming soon", description: "Phone call scheduling will be available soon." })}>
                    <Phone className="w-4 h-4 mr-2" />
                    Schedule Call
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => toast({ title: "Feature coming soon", description: "Video calls will be available soon." })}>
                    <Video className="w-4 h-4 mr-2" />
                    Video Meeting
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => setShowDocumentPanel(true)}>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Documents
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => toast({ title: "Application viewed", description: "Opening your application details..." })}>
                    <Eye className="w-4 h-4 mr-2" />
                    View Application
                  </Button>
                </div>
              </Card>
              
              {/* Document Status */}
              {selectedThread.documentProgress && (
                <Card className="p-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    Document Status
                  </h3>
                  <div className="space-y-3">
                    {documentRequirements.map((req) => (
                      <div key={req.id} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span>{getDocumentStatusIcon(req.status)}</span>
                          <span className="truncate">{req.name}</span>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            req.status === 'approved' ? 'bg-green-100 text-green-700 border-green-200' :
                            req.status === 'under-review' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                            req.status === 'needs-attention' ? 'bg-red-100 text-red-700 border-red-200' :
                            'bg-gray-100 text-gray-700 border-gray-200'
                          }`}
                        >
                          {req.status.replace('-', ' ')}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className={`max-w-7xl mx-auto ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`}>
        {/* Enhanced Header */}
        <div className="flex items-center justify-between mb-6 animate-slide-down">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
              <Mail className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Message Centre
              </h1>
              <p className="text-muted-foreground mt-1">
                Secure communication with your admissions team
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {totalUnreadCount > 0 && (
              <Badge className="animate-pulse bg-red-500 text-white">
                {totalUnreadCount} unread
              </Badge>
            )}
          </div>
        </div>

        {/* Enhanced Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6" ref={threadRef}>
          {[
            {
              title: "Total Messages",
              value: messageThreads.reduce((sum, thread) => sum + thread.messages.length, 0),
              icon: Mail,
              color: "text-blue-600",
              bgColor: "bg-blue-100 dark:bg-blue-900/20",
            },
            {
              title: "Unread Messages", 
              value: totalUnreadCount,
              icon: AlertCircle,
              color: "text-red-600",
              bgColor: "bg-red-100 dark:bg-red-900/20",
            },
            {
              title: "Active Threads",
              value: filteredThreads.length,
              icon: Users,
              color: "text-green-600", 
              bgColor: "bg-green-100 dark:bg-green-900/20",
            },
            {
              title: "Document Requests",
              value: messageThreads.filter(t => t.messages.some(m => m.type === 'document_request')).length,
              icon: FileText,
              color: "text-orange-600",
              bgColor: "bg-orange-100 dark:bg-orange-900/20",
            },
          ].map((stat, index) => (
            <Card
              key={stat.title}
              className={`p-4 transition-all duration-300 hover:shadow-md ${
                threadItems[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Enhanced Message Threads */}
        <div className="space-y-4" ref={messageRef}>
          {filteredThreads.length === 0 ? (
            <Card className="p-8 text-center">
              <Mail className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No messages found</h3>
              <p className="text-muted-foreground">
                {searchQuery || selectedCategory !== 'all' || messageFilter !== 'all' 
                  ? 'Try adjusting your filters or search terms.'
                  : 'You don\'t have any messages yet. Your advisor will reach out soon!'}
              </p>
            </Card>
          ) : (
            filteredThreads.map((thread, index) => (
              <div
                key={thread.id}
                className={`transition-all duration-300 ${
                  messageItems[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                <ThreadPreview
                  thread={thread}
                  isSelected={false}
                  onClick={() => setSelectedThread(thread)}
                  onMarkAsRead={() => markAsRead(thread.id)}
                  onArchive={() => toast({ title: "Thread archived", description: "This conversation has been archived." })}
                  onPin={() => toast({ title: "Thread pinned", description: "This conversation has been pinned to the top." })}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default MessageCentre;