import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLeadCommunications } from '@/hooks/useLeadData';
import { MessageSquare, Mail, Phone, Calendar, Plus, Bot, User } from 'lucide-react';
import { format } from 'date-fns';

interface RealDataCommunicationsProps {
  leadId: string;
}

export function RealDataCommunications({ leadId }: RealDataCommunicationsProps) {
  const { communications, loading, error } = useLeadCommunications(leadId);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'sms':
        return <MessageSquare className="h-4 w-4" />;
      case 'call':
        return <Phone className="h-4 w-4" />;
      case 'meeting':
        return <Calendar className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      sent: 'bg-blue-100 text-blue-800',
      delivered: 'bg-green-100 text-green-800',
      opened: 'bg-purple-100 text-purple-800',
      replied: 'bg-indigo-100 text-indigo-800',
      failed: 'bg-red-100 text-red-800',
      completed: 'bg-green-100 text-green-800'
    };
    
    return (
      <Badge className={colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
        {status}
      </Badge>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Communications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-2">Loading communications...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Communications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-600">Error: {error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Communications ({communications.length})
          </CardTitle>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Communication
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {communications.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No communications yet</p>
            <p className="text-sm text-muted-foreground">Start engaging with this lead</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            <div className="space-y-4">
              {communications.map((comm) => (
                <div key={comm.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(comm.type)}
                      <span className="font-medium capitalize">{comm.type}</span>
                      {comm.direction === 'inbound' ? (
                        <User className="h-3 w-3 text-blue-600" />
                      ) : comm.is_ai_generated ? (
                        <Bot className="h-3 w-3 text-purple-600" />
                      ) : (
                        <User className="h-3 w-3 text-green-600" />
                      )}
                    </div>
                    {getStatusBadge(comm.status)}
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2">
                    {format(new Date(comm.communication_date || comm.created_at), 'PPP at p')}
                  </p>
                  
                  <div className="text-sm">
                    <p className="line-clamp-3">{comm.content}</p>
                  </div>
                  
                  {comm.metadata && Object.keys(comm.metadata).length > 0 && (
                    <div className="mt-2 text-xs text-muted-foreground">
                      <details>
                        <summary className="cursor-pointer">Additional details</summary>
                        <pre className="mt-1 text-xs">{JSON.stringify(comm.metadata, null, 2)}</pre>
                      </details>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}