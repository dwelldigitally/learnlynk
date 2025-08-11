import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  Users, 
  MessageSquare, 
  Bell, 
  Calendar,
  UserPlus,
  Clock,
  CheckCircle,
  AlertCircle,
  AtSign
} from "lucide-react";

interface CollaborationSidebarProps {
  applicantId: string;
  onAssign: (userId: string, role: string) => void;
  onComment: (comment: string) => void;
}

export const CollaborationSidebar: React.FC<CollaborationSidebarProps> = ({
  applicantId,
  onAssign,
  onComment
}) => {
  const [newComment, setNewComment] = useState('');
  const [selectedReviewer, setSelectedReviewer] = useState('');

  // Mock team members
  const teamMembers = [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      role: 'Academic Director',
      email: 'sarah.johnson@university.edu',
      avatar: '',
      status: 'online',
      workload: 12
    },
    {
      id: '2',
      name: 'Prof. Michael Chen',
      role: 'Program Coordinator',
      email: 'michael.chen@university.edu',
      avatar: '',
      status: 'away',
      workload: 8
    },
    {
      id: '3',
      name: 'Dr. Emily Rodriguez',
      role: 'Senior Reviewer',
      email: 'emily.rodriguez@university.edu',
      avatar: '',
      status: 'online',
      workload: 15
    }
  ];

  // Mock assigned reviewers
  const assignedReviewers = [
    {
      id: '1',
      user: teamMembers[0],
      role: 'Primary Reviewer',
      assignedAt: '2024-01-15T10:00:00Z',
      status: 'reviewing',
      progress: 75
    },
    {
      id: '2',
      user: teamMembers[1],
      role: 'Secondary Reviewer',
      assignedAt: '2024-01-16T09:00:00Z',
      status: 'pending',
      progress: 0
    }
  ];

  // Mock comments/activity
  const comments = [
    {
      id: '1',
      author: teamMembers[0],
      content: 'Excellent academic background. Transcripts show consistent high performance.',
      timestamp: '2024-01-16T14:30:00Z',
      type: 'comment',
      mentions: []
    },
    {
      id: '2',
      author: teamMembers[1],
      content: 'Personal statement is well-written but could benefit from more specific examples.',
      timestamp: '2024-01-16T11:15:00Z',
      type: 'comment',
      mentions: ['@emily.rodriguez']
    },
    {
      id: '3',
      author: { id: 'system', name: 'System', role: 'System' },
      content: 'Application moved to "Under Review" stage',
      timestamp: '2024-01-15T16:00:00Z',
      type: 'system',
      mentions: []
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'reviewing': return <Clock className="h-4 w-4 text-warning" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'pending': return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getWorkloadColor = (workload: number) => {
    if (workload <= 5) return 'text-success';
    if (workload <= 10) return 'text-warning';
    return 'text-destructive';
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    onComment(newComment);
    setNewComment('');
  };

  const handleAssignReviewer = () => {
    if (!selectedReviewer) return;
    onAssign(selectedReviewer, 'reviewer');
    setSelectedReviewer('');
  };

  return (
    <div className="space-y-6">
      {/* Current Assignments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Assigned Team
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {assignedReviewers.map((assignment) => (
            <div key={assignment.id} className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={assignment.user.avatar} alt={assignment.user.name} />
                <AvatarFallback>
                  {assignment.user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{assignment.user.name}</span>
                  {getStatusIcon(assignment.status)}
                </div>
                <div className="text-xs text-muted-foreground">{assignment.role}</div>
                <div className="w-full bg-muted rounded-full h-1 mt-1">
                  <div 
                    className="bg-primary h-1 rounded-full transition-all duration-300"
                    style={{ width: `${assignment.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
          
          <Separator />
          
          {/* Add New Reviewer */}
          <div className="space-y-2">
            <Select value={selectedReviewer} onValueChange={setSelectedReviewer}>
              <SelectTrigger>
                <UserPlus className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Assign reviewer" />
              </SelectTrigger>
              <SelectContent>
                {teamMembers
                  .filter(member => !assignedReviewers.some(assigned => assigned.user.id === member.id))
                  .map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{member.name}</span>
                        <span className={`text-xs ${getWorkloadColor(member.workload)}`}>
                          ({member.workload} cases)
                        </span>
                      </div>
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <Button size="sm" className="w-full" onClick={handleAssignReviewer} disabled={!selectedReviewer}>
              Assign Reviewer
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Team Activity & Comments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Team Discussion
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add Comment */}
          <div className="space-y-2">
            <Textarea
              placeholder="Add a comment or mention a team member with @..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
            />
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">
                Use @ to mention team members
              </span>
              <Button size="sm" onClick={handleAddComment} disabled={!newComment.trim()}>
                <MessageSquare className="h-4 w-4 mr-1" />
                Comment
              </Button>
            </div>
          </div>
          
          <Separator />
          
          {/* Comments List */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {comments.map((comment) => (
              <div key={comment.id} className="flex items-start gap-3">
                {comment.type === 'system' ? (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                    <Bell className="h-4 w-4" />
                  </div>
                ) : (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="" alt={comment.author.name} />
                    <AvatarFallback className="text-xs">
                      {comment.author.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">{comment.author.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(comment.timestamp).toLocaleString()}
                    </span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mt-1">
                    {comment.content}
                  </p>
                  
                  {comment.mentions.length > 0 && (
                    <div className="flex items-center gap-1 mt-1">
                      {comment.mentions.map((mention, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          <AtSign className="h-3 w-3 mr-1" />
                          {mention.replace('@', '')}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Team Meeting
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Bell className="h-4 w-4 mr-2" />
              Set Reminder
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <MessageSquare className="h-4 w-4 mr-2" />
              Request Additional Info
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};