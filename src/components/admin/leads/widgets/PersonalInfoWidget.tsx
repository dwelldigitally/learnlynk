import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MapPin, GraduationCap, Calendar, GripVertical, User } from 'lucide-react';
import { Lead } from '@/types/lead';

interface PersonalInfoWidgetProps {
  lead: Lead;
}

export function PersonalInfoWidget({ lead }: PersonalInfoWidgetProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="cursor-move drag-handle flex-shrink-0">
        <CardTitle className="text-lg flex items-center gap-2">
          <GripVertical className="h-4 w-4 text-muted-foreground" />
          <User className="h-5 w-5 text-primary" />
          Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Full Name</p>
              <p className="font-medium">{lead.first_name} {lead.last_name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium flex items-center gap-2">
                <Mail className="h-3 w-3" />
                {lead.email}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-medium flex items-center gap-2">
                <Phone className="h-3 w-3" />
                {lead.phone || 'Not provided'}
              </p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="font-medium flex items-center gap-2">
                <MapPin className="h-3 w-3" />
                {lead.city || lead.country || 'Not provided'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Program Interest</p>
              <p className="font-medium flex items-center gap-2">
                <GraduationCap className="h-3 w-3" />
                {lead.program_interest?.[0] || 'Not specified'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Lead Created</p>
              <p className="font-medium flex items-center gap-2">
                <Calendar className="h-3 w-3" />
                {lead.created_at ? new Date(lead.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Unknown'}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
