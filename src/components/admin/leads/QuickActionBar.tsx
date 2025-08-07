import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Phone, Mail, MessageSquare, Calendar, 
  Users, Info, ArrowRight, FileText 
} from 'lucide-react';
import { Lead } from '@/types/lead';
import { ClickToCallButton } from './ClickToCallButton';

interface QuickActionBarProps {
  lead: Lead;
  onUpdate: () => void;
}

export function QuickActionBar({ lead, onUpdate }: QuickActionBarProps) {
  // Mock assigned advisor data
  const assignedAdvisor = {
    id: 'advisor-1',
    name: 'Sarah Johnson',
    avatar: '',
    reason: 'Best match based on MBA specialization and previous conversion rate with similar profiles'
  };

  const handleAdvisorChange = (advisorId: string) => {
    // TODO: Implement advisor reassignment
    console.log('Reassigning to advisor:', advisorId);
  };

  return (
    <div className="bg-card border-b border-border px-6 py-4">
      {/* Lead Header with Assigned Advisor */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-xl font-bold">{lead.first_name} {lead.last_name}</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{lead.email}</span>
              <span>•</span>
              <span>Intake: September 2024</span>
              <span>•</span>
              <span>Payment: Full Payment Preferred</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
          </Badge>
          <div className="text-sm text-muted-foreground">
            Lead Score: <span className="font-semibold text-foreground">{lead.lead_score}</span>
          </div>
        </div>
      </div>

      {/* Assigned Advisor Section */}
      <div className="flex items-center justify-between mb-4 p-3 bg-muted/50 rounded-lg">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary/10 text-primary text-sm">
              {assignedAdvisor.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Assigned to: {assignedAdvisor.name}</span>
              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
            </div>
            <p className="text-xs text-muted-foreground">AI selected based on specialization match</p>
          </div>
        </div>
        
        <Select onValueChange={handleAdvisorChange} defaultValue={assignedAdvisor.id}>
          <SelectTrigger className="w-40 h-8">
            <SelectValue placeholder="Reassign" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="advisor-1">Sarah Johnson</SelectItem>
            <SelectItem value="advisor-2">Michael Chen</SelectItem>
            <SelectItem value="advisor-3">Emily Rodriguez</SelectItem>
            <SelectItem value="advisor-4">David Thompson</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Quick Action Buttons */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          {lead.phone && (
            <ClickToCallButton 
              phoneNumber={lead.phone} 
              leadId={lead.id}
              variant="default"
              size="sm"
            />
          )}
          
          <Button variant="outline" size="sm" className="h-9">
            <Mail className="h-4 w-4 mr-2" />
            Email
          </Button>
          
          <Button variant="outline" size="sm" className="h-9">
            <MessageSquare className="h-4 w-4 mr-2" />
            SMS
          </Button>
          
          <Button variant="outline" size="sm" className="h-9">
            <Calendar className="h-4 w-4 mr-2" />
            Meet
          </Button>
        </div>

        <div className="h-6 w-px bg-border" />

        {/* AI Recommended Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-9 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
            <ArrowRight className="h-4 w-4 mr-2" />
            Send follow-up email
          </Button>
          
          <Button variant="ghost" size="sm" className="h-9 text-green-600 hover:text-green-700 hover:bg-green-50">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule consultation
          </Button>
          
          <Button variant="ghost" size="sm" className="h-9 text-purple-600 hover:text-purple-700 hover:bg-purple-50">
            <FileText className="h-4 w-4 mr-2" />
            Send program info
          </Button>
        </div>
      </div>
    </div>
  );
}