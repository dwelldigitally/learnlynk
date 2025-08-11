import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  User,
  Star,
  ExternalLink,
  MessageSquare,
  Activity
} from "lucide-react";

interface SegmentItem {
  id: string;
  title: string;
  subtitle?: string;
  urgency: "high" | "medium" | "low";
  meta?: string;
  email?: string;
  phone?: string;
  source?: string;
  score?: number;
  lastActivity?: string;
  assignedTo?: string;
  status?: string;
  value?: number;
}

interface SegmentDetailsTabProps {
  item: SegmentItem | null;
  onAction: (action: string, data?: any) => void;
}

export function SegmentDetailsTab({ item, onAction }: SegmentDetailsTabProps) {
  if (!item) return null;

  const mockData = {
    email: item.email || "john.smith@example.com",
    phone: item.phone || "+1 (555) 123-4567",
    source: item.source || "Website Form",
    score: item.score || 85,
    lastActivity: item.lastActivity || "2 hours ago",
    assignedTo: item.assignedTo || "Unassigned",
    status: item.status || "New",
    value: item.value || 12500,
    location: "San Francisco, CA",
    joinDate: "March 15, 2024",
    engagementLevel: "High",
    responseRate: "92%",
    averageResponseTime: "2.3 hours",
    totalInteractions: 24,
    programs: ["Financial Advisory", "Investment Planning"],
    tags: ["High Value", "Enterprise", "Warm Lead"]
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getEngagementColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "high": return "bg-green-100 text-green-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <ScrollArea className="h-full px-6 py-4">
      <div className="space-y-6">
        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="h-4 w-4" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{mockData.email}</p>
                  <p className="text-xs text-muted-foreground">Primary Email</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{mockData.phone}</p>
                  <p className="text-xs text-muted-foreground">Mobile</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{mockData.location}</p>
                  <p className="text-xs text-muted-foreground">Location</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{mockData.joinDate}</p>
                  <p className="text-xs text-muted-foreground">First Contact</p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAction("email")}
                className="flex items-center gap-2"
              >
                <Mail className="h-3 w-3" />
                Send Email
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAction("call")}
                className="flex items-center gap-2"
              >
                <Phone className="h-3 w-3" />
                Call
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAction("view-profile")}
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-3 w-3" />
                View Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Lead Scoring & Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4" />
              Lead Scoring & Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <Star className={`h-5 w-5 mx-auto mb-1 ${getScoreColor(mockData.score)}`} />
                <p className={`text-lg font-bold ${getScoreColor(mockData.score)}`}>
                  {mockData.score}
                </p>
                <p className="text-xs text-muted-foreground">Lead Score</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <DollarSign className="h-5 w-5 mx-auto mb-1 text-green-600" />
                <p className="text-lg font-bold text-green-600">
                  ${mockData.value.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">Est. Value</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <MessageSquare className="h-5 w-5 mx-auto mb-1 text-blue-600" />
                <p className="text-lg font-bold text-blue-600">{mockData.responseRate}</p>
                <p className="text-xs text-muted-foreground">Response Rate</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <Clock className="h-5 w-5 mx-auto mb-1 text-purple-600" />
                <p className="text-lg font-bold text-purple-600">{mockData.averageResponseTime}</p>
                <p className="text-xs text-muted-foreground">Avg Response</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Engagement & Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Activity className="h-4 w-4" />
              Engagement & Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium mb-2">Current Status</p>
                <Badge variant="outline" className="text-sm">
                  {mockData.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Engagement Level</p>
                <Badge className={getEngagementColor(mockData.engagementLevel)}>
                  {mockData.engagementLevel}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Assigned To</p>
                <p className="text-sm text-muted-foreground">{mockData.assignedTo}</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Last Activity</p>
                <p className="text-sm text-muted-foreground">{mockData.lastActivity}</p>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <p className="text-sm font-medium mb-2">Programs of Interest</p>
              <div className="flex flex-wrap gap-2">
                {mockData.programs.map((program, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {program}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium mb-2">Tags</p>
              <div className="flex flex-wrap gap-2">
                {mockData.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}