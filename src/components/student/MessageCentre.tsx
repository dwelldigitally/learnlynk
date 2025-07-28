import React, { useState } from "react";
import { ArrowLeft, Mail, Clock, Check, AlertCircle, Paperclip, Send, Upload, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import advisorNicole from "@/assets/advisor-nicole.jpg";

interface Message {
  id: string;
  from: string;
  fromRole: string;
  avatar: string;
  subject: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  priority: "high" | "medium" | "low";
  relatedApplication?: string;
}

const MessageCentre: React.FC = () => {
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedDocumentType, setSelectedDocumentType] = useState<string>("");

  // Mock messages from advisor
  const messages: Message[] = [
    {
      id: "msg-1",
      from: "Nicole Ye",
      fromRole: "Senior Admissions Advisor",
      avatar: advisorNicole,
      subject: "Document Review Update - Health Care Assistant",
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
      isRead: false,
      priority: "high",
      relatedApplication: "HCA-1047859"
    },
    {
      id: "msg-2",
      from: "Nicole Ye",
      fromRole: "Senior Admissions Advisor",
      avatar: advisorNicole,
      subject: "Welcome to Western Community College",
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
      isRead: true,
      priority: "medium",
      relatedApplication: "HCA-1047859"
    },
    {
      id: "msg-3",
      from: "Admissions Office",
      fromRole: "Automated System",
      avatar: "/lovable-uploads/120260b6-bc38-4844-841b-c6a5b6067560.png",
      subject: "Application Received - Health Care Assistant",
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
      isRead: true,
      priority: "low",
      relatedApplication: "HCA-1047859"
    }
  ];

  const unreadCount = messages.filter(msg => !msg.isRead).length;

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

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSendReply = () => {
    // Here you would normally send the reply and files to your backend
    console.log('Sending reply:', { replyText, selectedFiles, selectedDocumentType });
    // Reset form
    setReplyText("");
    setSelectedFiles([]);
    setSelectedDocumentType("");
    setShowReplyBox(false);
  };

  // Mock document requirements for the HCA program
  const documentRequirements = [
    { id: "transcript", name: "Official Transcripts" },
    { id: "photo-id", name: "Photo ID" },
    { id: "criminal-check", name: "Criminal Record Check" },
    { id: "immunization", name: "Immunization Records" },
    { id: "first-aid", name: "First Aid Certificate" },
    { id: "english-proof", name: "English Proficiency Test" },
  ];

  if (selectedMessage) {
    return (
      <div className="max-w-4xl mx-auto">
        {/* Message View Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            onClick={() => setSelectedMessage(null)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Messages
          </Button>
        </div>

        {/* Message Content */}
        <Card className="p-6">
          <div className="flex items-start gap-4 mb-6">
            <img 
              src={selectedMessage.avatar} 
              alt={selectedMessage.from}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{selectedMessage.subject}</h2>
                  <p className="text-gray-600">
                    From: <span className="font-medium">{selectedMessage.from}</span> - {selectedMessage.fromRole}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {selectedMessage.timestamp.toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getPriorityColor(selectedMessage.priority)}>
                    {selectedMessage.priority.toUpperCase()}
                  </Badge>
                  {selectedMessage.relatedApplication && (
                    <Badge variant="outline">
                      {selectedMessage.relatedApplication}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="prose max-w-none">
            <div className="whitespace-pre-line text-gray-800 leading-relaxed">
              {selectedMessage.content}
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <Button 
              onClick={() => setShowReplyBox(!showReplyBox)}
              className="bg-purple-900 hover:bg-purple-800 text-white"
            >
              Reply to {selectedMessage.from}
            </Button>
          </div>
        </Card>

        {/* Reply Box */}
        {showReplyBox && (
          <Card className="mt-4 p-6">
            <h3 className="text-lg font-semibold mb-4">Reply to {selectedMessage.from}</h3>
            
            <div className="space-y-4">
              <Textarea
                placeholder="Type your message here..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="min-h-[120px]"
              />

              {/* File Upload Section */}
              <div className="space-y-3">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      type="file"
                      onChange={handleFileSelect}
                      multiple
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                      className="hidden"
                      id="file-upload"
                    />
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById('file-upload')?.click()}
                      className="w-full"
                    >
                      <Paperclip className="w-4 h-4 mr-2" />
                      Attach Files
                    </Button>
                  </div>
                  
                  <div className="flex-1">
                    <Select value={selectedDocumentType} onValueChange={setSelectedDocumentType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Upload Document for Application" />
                      </SelectTrigger>
                      <SelectContent>
                        {documentRequirements.map((req) => (
                          <SelectItem key={req.id} value={req.id}>
                            <div className="flex items-center gap-2">
                              <Upload className="w-4 h-4" />
                              {req.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Selected Files Display */}
                {selectedFiles.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Selected Files:</p>
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                        <div className="flex items-center gap-2">
                          <Paperclip className="w-4 h-4 text-gray-500" />
                          <span className="text-sm">{file.name}</span>
                          <span className="text-xs text-gray-500">
                            ({(file.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                          {selectedDocumentType && (
                            <Badge variant="outline" className="text-xs">
                              {documentRequirements.find(req => req.id === selectedDocumentType)?.name}
                            </Badge>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setShowReplyBox(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSendReply}
                  disabled={!replyText.trim() && selectedFiles.length === 0}
                  className="bg-purple-900 hover:bg-purple-800 text-white"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Reply
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Mail className="w-6 h-6 text-purple-600" />
            Message Centre
          </h1>
          <p className="text-gray-600 mt-1">
            All communications about your applications
          </p>
        </div>
        {unreadCount > 0 && (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            {unreadCount} Unread
          </Badge>
        )}
      </div>

      {/* Messages List */}
      <div className="space-y-3">
        {messages.map((message) => (
          <Card 
            key={message.id}
            className={`p-4 cursor-pointer transition-all hover:shadow-md ${
              !message.isRead ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
            }`}
            onClick={() => setSelectedMessage(message)}
          >
            <div className="flex items-start gap-4">
              <img 
                src={message.avatar} 
                alt={message.from}
                className="w-10 h-10 rounded-full object-cover flex-shrink-0"
              />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-medium truncate ${
                        !message.isRead ? 'font-semibold' : ''
                      }`}>
                        {message.subject}
                      </h3>
                      {!message.isRead && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">
                      From: <span className="font-medium">{message.from}</span> - {message.fromRole}
                    </p>
                    
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {message.content.substring(0, 120)}...
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <span className="text-xs text-gray-500">
                      {formatDate(message.timestamp)}
                    </span>
                    
                    <div className="flex items-center gap-2">
                      <Badge className={getPriorityColor(message.priority)} variant="outline">
                        {message.priority === 'high' && <AlertCircle className="w-3 h-3 mr-1" />}
                        {message.priority === 'medium' && <Clock className="w-3 h-3 mr-1" />}
                        {message.priority === 'low' && <Check className="w-3 h-3 mr-1" />}
                        {message.priority}
                      </Badge>
                      
                      {message.relatedApplication && (
                        <Badge variant="outline" className="text-xs">
                          {message.relatedApplication}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {messages.length === 0 && (
        <Card className="p-8 text-center">
          <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">No Messages Yet</h3>
          <p className="text-gray-500">
            You'll receive messages from your admissions advisor about your applications here.
          </p>
        </Card>
      )}
    </div>
  );
};

export default MessageCentre;