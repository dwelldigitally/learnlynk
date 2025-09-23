import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Clock, Check, AlertCircle, Star, Pin, Archive, 
  Download, FileText, Calendar, AlertTriangle, 
  CheckCircle2, Info, Eye, Phone, Video 
} from "lucide-react";

interface MessageStatusIndicatorProps {
  status: 'sent' | 'delivered' | 'read';
}

export const MessageStatusIndicator: React.FC<MessageStatusIndicatorProps> = ({ status }) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'sent':
        return <Clock className="w-3 h-3 text-muted-foreground" />;
      case 'delivered':
        return <Check className="w-3 h-3 text-blue-500" />;
      case 'read':
        return <div className="flex"><Check className="w-3 h-3 text-blue-500" /><Check className="w-3 h-3 text-blue-500 -ml-1" /></div>;
      default:
        return null;
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          {getStatusIcon()}
        </TooltipTrigger>
        <TooltipContent>
          <p className="capitalize">{status}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

interface ThreadPreviewProps {
  thread: any;
  isSelected: boolean;
  onClick: () => void;
  onMarkAsRead: () => void;
  onArchive: () => void;
  onPin: () => void;
}

export const ThreadPreview: React.FC<ThreadPreviewProps> = ({ 
  thread, 
  isSelected, 
  onClick, 
  onMarkAsRead, 
  onArchive, 
  onPin 
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'documents': return <FileText className="w-4 h-4" />;
      case 'application': return <CheckCircle2 className="w-4 h-4" />;
      case 'payment': return <AlertTriangle className="w-4 h-4" />;
      case 'system': return <Info className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  const formatTime = (date: Date) => {
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

  return (
    <Card 
      className={`p-4 cursor-pointer transition-all hover:shadow-md border-l-4 ${
        isSelected 
          ? 'bg-primary/5 border-l-primary shadow-sm' 
          : thread.unreadCount > 0 
            ? 'border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20' 
            : 'border-l-transparent'
      }`}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <div className="relative">
          <Avatar className="w-10 h-10">
            <AvatarImage src={thread.participants.advisor.avatar} />
            <AvatarFallback>{thread.participants.advisor.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
          </Avatar>
          {thread.participants.advisor.isOnline && (
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm truncate">
                {thread.participants.advisor.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {thread.participants.advisor.role}
              </span>
              {thread.isPinned && <Pin className="w-3 h-3 text-orange-500" />}
            </div>
            <div className="flex items-center gap-1">
              {getCategoryIcon(thread.category)}
              <span className="text-xs text-muted-foreground">
                {formatTime(thread.lastMessage.timestamp)}
              </span>
            </div>
          </div>
          
          <h4 className="font-medium text-sm mb-1 truncate">{thread.subject}</h4>
          
          <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
            {thread.lastMessage.content}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge className={`text-xs ${getPriorityColor(thread.priority)}`}>
                {thread.priority.toUpperCase()}
              </Badge>
              {thread.relatedApplication && (
                <Badge variant="outline" className="text-xs">
                  {thread.relatedApplication}
                </Badge>
              )}
              {thread.tags?.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
            
            {thread.unreadCount > 0 && (
              <Badge className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center p-0">
                {thread.unreadCount}
              </Badge>
            )}
          </div>
          
          {thread.documentProgress && (
            <div className="mt-2 space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Document Progress</span>
                <span>{thread.documentProgress.approved}/{thread.documentProgress.required}</span>
              </div>
              <Progress 
                value={(thread.documentProgress.approved / thread.documentProgress.required) * 100} 
                className="h-1"
              />
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

interface TypingIndicatorProps {
  advisorName: string;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({ advisorName }) => {
  return (
    <div className="flex items-center gap-2 p-3 text-sm text-muted-foreground">
      <div className="flex gap-1">
        <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
      <span>{advisorName} is typing...</span>
    </div>
  );
};

interface DocumentRequestCardProps {
  documentRequest: any;
  onUpload: () => void;
}

export const DocumentRequestCard: React.FC<DocumentRequestCardProps> = ({ documentRequest, onUpload }) => {
  const isOverdue = documentRequest.deadline && new Date() > new Date(documentRequest.deadline);
  const daysLeft = documentRequest.deadline 
    ? Math.ceil((new Date(documentRequest.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <Card className={`p-4 border-l-4 ${
      documentRequest.isUrgent 
        ? 'border-l-red-500 bg-red-50/50 dark:bg-red-950/20' 
        : 'border-l-orange-500 bg-orange-50/50 dark:bg-orange-950/20'
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <FileText className={`w-5 h-5 ${documentRequest.isUrgent ? 'text-red-500' : 'text-orange-500'}`} />
          <h4 className="font-medium">Document Required</h4>
          {documentRequest.isUrgent && (
            <Badge variant="destructive" className="text-xs">URGENT</Badge>
          )}
        </div>
        {documentRequest.deadline && (
          <div className="text-right">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>Due: {new Date(documentRequest.deadline).toLocaleDateString()}</span>
            </div>
            {daysLeft !== null && (
              <p className={`text-xs mt-1 ${
                isOverdue ? 'text-red-600' : daysLeft <= 2 ? 'text-orange-600' : 'text-muted-foreground'
              }`}>
                {isOverdue ? 'Overdue!' : `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left`}
              </p>
            )}
          </div>
        )}
      </div>
      
      <h5 className="font-medium mb-2">{documentRequest.description}</h5>
      
      <div className="space-y-2 mb-4">
        <p className="text-sm font-medium text-muted-foreground">Requirements:</p>
        <ul className="text-sm space-y-1">
          {documentRequest.requirements.map((req: string, index: number) => (
            <li key={index} className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>{req}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <Button 
        onClick={onUpload}
        className="w-full"
        variant={documentRequest.isUrgent ? "destructive" : "default"}
      >
        <FileText className="w-4 h-4 mr-2" />
        Upload {documentRequest.description}
      </Button>
    </Card>
  );
};

interface QuickActionsProps {
  thread: any;
  onScheduleCall: () => void;
  onVideoCall: () => void;
  onMarkImportant: () => void;
  onArchive: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  thread,
  onScheduleCall,
  onVideoCall,
  onMarkImportant,
  onArchive
}) => {
  return (
    <div className="flex gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm" onClick={onScheduleCall}>
              <Phone className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Schedule a call</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm" onClick={onVideoCall}>
              <Video className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Start video call</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onMarkImportant}
              className={thread.isPinned ? "bg-orange-100 text-orange-600 dark:bg-orange-950/20" : ""}
            >
              <Star className={`w-4 h-4 ${thread.isPinned ? 'fill-current' : ''}`} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Mark as important</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm" onClick={onArchive}>
              <Archive className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Archive thread</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};