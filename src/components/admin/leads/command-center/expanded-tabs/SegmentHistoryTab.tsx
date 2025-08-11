import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search,
  Filter,
  Download,
  RefreshCw,
  MessageSquare,
  PhoneCall,
  Mail,
  UserCheck,
  Clock,
  AlertTriangle,
  CheckCircle,
  FileText,
  Calendar,
  User,
  TrendingUp
} from "lucide-react";
import { useState } from "react";

interface SegmentItem {
  id: string;
  title: string;
  subtitle?: string;
  urgency: "high" | "medium" | "low";
  meta?: string;
}

interface SegmentHistoryTabProps {
  item: SegmentItem | null;
  onAction: (action: string, data?: any) => void;
}

interface ActivityItem {
  id: string;
  type: "email" | "call" | "message" | "assignment" | "status_change" | "note" | "meeting" | "score_update";
  title: string;
  description: string;
  timestamp: string;
  user: string;
  status?: "success" | "pending" | "failed";
  metadata?: Record<string, any>;
}

export function SegmentHistoryTab({ item, onAction }: SegmentHistoryTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");

  if (!item) return null;

  // Mock activity data
  const mockActivities: ActivityItem[] = [
    {
      id: "1",
      type: "email",
      title: "Welcome email sent",
      description: "Automated welcome email sent to lead",
      timestamp: "2 hours ago",
      user: "System",
      status: "success"
    },
    {
      id: "2",
      type: "assignment",
      title: "Assigned to Sarah Johnson",
      description: "Lead assigned to advisor for follow-up",
      timestamp: "4 hours ago",
      user: "John Doe (Manager)",
      status: "success"
    },
    {
      id: "3",
      type: "call",
      title: "First contact call",
      description: "Initial discovery call completed - 15 minutes",
      timestamp: "1 day ago",
      user: "Sarah Johnson",
      status: "success"
    },
    {
      id: "4",
      type: "score_update",
      title: "Lead score updated",
      description: "Score increased from 75 to 85 based on engagement",
      timestamp: "1 day ago",
      user: "System",
      status: "success"
    },
    {
      id: "5",
      type: "message",
      title: "Follow-up message sent",
      description: "Personalized follow-up message with program details",
      timestamp: "2 days ago",
      user: "Sarah Johnson",
      status: "success"
    },
    {
      id: "6",
      type: "meeting",
      title: "Consultation scheduled",
      description: "30-minute consultation meeting scheduled for next week",
      timestamp: "3 days ago",
      user: "Sarah Johnson",
      status: "pending"
    },
    {
      id: "7",
      type: "note",
      title: "Advisor notes added",
      description: "Lead expressed strong interest in investment planning",
      timestamp: "3 days ago",
      user: "Sarah Johnson"
    },
    {
      id: "8",
      type: "status_change",
      title: "Status changed to Qualified",
      description: "Lead status updated from New to Qualified",
      timestamp: "4 days ago",
      user: "Sarah Johnson",
      status: "success"
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "email": return Mail;
      case "call": return PhoneCall;
      case "message": return MessageSquare;
      case "assignment": return UserCheck;
      case "status_change": return CheckCircle;
      case "note": return FileText;
      case "meeting": return Calendar;
      case "score_update": return TrendingUp;
      default: return Clock;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "email": return "text-blue-600";
      case "call": return "text-green-600";
      case "message": return "text-purple-600";
      case "assignment": return "text-orange-600";
      case "status_change": return "text-indigo-600";
      case "note": return "text-gray-600";
      case "meeting": return "text-pink-600";
      case "score_update": return "text-teal-600";
      default: return "text-gray-600";
    }
  };

  const getStatusBadge = (status?: string) => {
    if (!status) return null;
    
    switch (status) {
      case "success":
        return <Badge variant="outline" className="text-green-600 border-green-200">Success</Badge>;
      case "pending":
        return <Badge variant="outline" className="text-yellow-600 border-yellow-200">Pending</Badge>;
      case "failed":
        return <Badge variant="outline" className="text-red-600 border-red-200">Failed</Badge>;
      default:
        return null;
    }
  };

  const filteredActivities = mockActivities.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || activity.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const sortedActivities = [...filteredActivities].sort((a, b) => {
    // For demo purposes, we'll just return the original order
    return sortOrder === "newest" ? 0 : 0;
  });

  return (
    <div className="h-full flex flex-col">
      {/* Search and Filter Controls */}
      <div className="px-6 py-4 border-b space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search activity history..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Activities</SelectItem>
              <SelectItem value="email">Emails</SelectItem>
              <SelectItem value="call">Calls</SelectItem>
              <SelectItem value="message">Messages</SelectItem>
              <SelectItem value="assignment">Assignments</SelectItem>
              <SelectItem value="status_change">Status Changes</SelectItem>
              <SelectItem value="note">Notes</SelectItem>
              <SelectItem value="meeting">Meetings</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            More Filters
          </Button>
        </div>
        
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {sortedActivities.length} of {mockActivities.length} activities
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => onAction("refresh-history")}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={() => onAction("export-history")}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      <ScrollArea className="flex-1">
        <div className="px-6 py-4">
          {sortedActivities.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">No activities found matching your criteria</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedActivities.map((activity, index) => {
                const IconComponent = getActivityIcon(activity.type);
                return (
                  <Card key={activity.id} className="relative">
                    {/* Timeline connector */}
                    {index < sortedActivities.length - 1 && (
                      <div className="absolute left-8 top-12 bottom-0 w-px bg-border" />
                    )}
                    
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-full bg-muted ${getActivityColor(activity.type)}`}>
                          <IconComponent className="h-4 w-4" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium text-sm">{activity.title}</h4>
                            <div className="flex items-center gap-2">
                              {getStatusBadge(activity.status)}
                              <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
                            </div>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-2">{activity.description}</p>
                          
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <User className="h-3 w-3" />
                            <span>{activity.user}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}