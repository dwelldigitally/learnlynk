import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Mail, Phone, MessageSquare, Calendar, User, Send } from 'lucide-react';
import { LeadCommunication, CommunicationFormData } from '@/types/leadEnhancements';
import { LeadCommunicationService } from '@/services/leadCommunicationService';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';

interface CommunicationPanelProps {
  leadId: string;
  communications: LeadCommunication[];
  onCommunicationCreated: (communication: LeadCommunication) => void;
  loading: boolean;
}

export function CommunicationPanel({
  leadId,
  communications,
  onCommunicationCreated,
  loading
}: CommunicationPanelProps) {
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const { register, handleSubmit, reset, setValue, watch } = useForm<CommunicationFormData>({
    defaultValues: {
      type: 'email',
      direction: 'outbound',
      content: '',
    }
  });

  const watchedType = watch('type');
  const watchedDirection = watch('direction');

  const onSubmit = async (data: CommunicationFormData) => {
    setIsCreating(true);
    try {
      const newCommunication = await LeadCommunicationService.createCommunication(leadId, data);
      onCommunicationCreated(newCommunication);
      setShowCreateDialog(false);
      reset();
      toast({
        title: "Success",
        description: "Communication logged successfully",
      });
    } catch (error) {
      console.error('Error creating communication:', error);
      toast({
        title: "Error",
        description: "Failed to log communication",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const getCommunicationIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'phone':
        return <Phone className="h-4 w-4" />;
      case 'sms':
        return <MessageSquare className="h-4 w-4" />;
      case 'meeting':
        return <Calendar className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getDirectionBadgeVariant = (direction: string) => {
    return direction === 'inbound' ? 'default' : 'secondary';
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'scheduled':
        return 'secondary';
      case 'failed':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Communications</h3>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Log Communication
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Log New Communication</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select onValueChange={(value) => setValue('type', value as any)} defaultValue="email">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="phone">Phone Call</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                      <SelectItem value="meeting">Meeting</SelectItem>
                      <SelectItem value="note">Note</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="direction">Direction</Label>
                  <Select onValueChange={(value) => setValue('direction', value as any)} defaultValue="outbound">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="outbound">Outbound</SelectItem>
                      <SelectItem value="inbound">Inbound</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {(watchedType === 'email' || watchedType === 'meeting') && (
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input {...register('subject')} placeholder="Communication subject" />
                </div>
              )}

              <div>
                <Label htmlFor="content">Content/Notes</Label>
                <Textarea 
                  {...register('content', { required: true })}
                  placeholder="Describe the communication..."
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="communication_date">Date & Time</Label>
                <Input 
                  {...register('communication_date')}
                  type="datetime-local"
                  defaultValue={new Date().toISOString().slice(0, 16)}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isCreating}>
                  {isCreating ? 'Logging...' : 'Log Communication'}
                  <Send className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {loading ? (
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">Loading communications...</p>
            </CardContent>
          </Card>
        ) : communications.length === 0 ? (
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">
                No communications logged yet. Start by logging your first interaction with this lead.
              </p>
            </CardContent>
          </Card>
        ) : (
          communications.map((communication) => (
            <Card key={communication.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getCommunicationIcon(communication.type)}
                    <CardTitle className="text-sm capitalize">
                      {communication.type}
                      {communication.subject && ` - ${communication.subject}`}
                    </CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getDirectionBadgeVariant(communication.direction)}>
                      {communication.direction}
                    </Badge>
                    <Badge variant={getStatusBadgeVariant(communication.status)}>
                      {communication.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">{communication.content}</p>
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>
                    {new Date(communication.communication_date).toLocaleString()}
                  </span>
                  <span>
                    Created {new Date(communication.created_at).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}