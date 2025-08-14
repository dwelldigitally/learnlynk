import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  TrendingUp, 
  TrendingDown,
  Users, 
  Phone, 
  Target,
  ExternalLink
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TeamMemberCardProps {
  member: {
    id: string;
    name: string;
    role: string;
    avatar?: string;
    status: 'online' | 'busy' | 'away' | 'offline';
    metrics: {
      leadsToday: number;
      callsToday: number;
      conversionRate: number;
      trend: 'up' | 'down' | 'stable';
    };
  };
}

export function TeamMemberCard({ member }: TeamMemberCardProps) {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'busy': return 'bg-red-500';
      case 'away': return 'bg-yellow-500';
      default: return 'bg-gray-400';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <div className="h-4 w-4" />;
    }
  };

  const handleViewDashboard = () => {
    navigate('/admin/sales-rep-dashboard', { 
      state: { salesRepId: member.id } 
    });
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Avatar className="h-10 w-10">
                <AvatarImage src={member.avatar} alt={member.name} />
                <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${getStatusColor(member.status)}`} />
            </div>
            <div>
              <h4 className="font-medium text-foreground">{member.name}</h4>
              <p className="text-sm text-muted-foreground">{member.role}</p>
            </div>
          </div>
          <Badge variant="outline" className="text-xs capitalize">
            {member.status}
          </Badge>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-3">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1">
              <Users className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">{member.metrics.leadsToday}</span>
            </div>
            <p className="text-xs text-muted-foreground">Leads</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1">
              <Phone className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">{member.metrics.callsToday}</span>
            </div>
            <p className="text-xs text-muted-foreground">Calls</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1">
              <Target className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium">{member.metrics.conversionRate}%</span>
              {getTrendIcon(member.metrics.trend)}
            </div>
            <p className="text-xs text-muted-foreground">Conv Rate</p>
          </div>
        </div>

        <Button 
          onClick={handleViewDashboard}
          variant="outline" 
          size="sm" 
          className="w-full"
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          View Dashboard
        </Button>
      </CardContent>
    </Card>
  );
}