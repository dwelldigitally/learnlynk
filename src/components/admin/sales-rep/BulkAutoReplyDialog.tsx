import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Sparkles, Edit3, Send, CheckCircle, XCircle, Brain, GraduationCap, Calendar, Target, AlertCircle, Mail, MessageSquare, Phone, Clock, History, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Communication {
  id: string;
  lead_id: string;
  type: string;
  subject?: string;
  content: string;
  direction: string;
  communication_date: string;
  lead_name?: string;
  is_urgent?: boolean;
}

interface LeadProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  academicJourney: string;
  programInterest: string;
  leadScore: number;
  lastActivity: string;
  status: string;
  communicationHistory: Array<{
    date: string;
    type: string;
    subject?: string;
    content: string;
    direction: string;
  }>;
}

interface GeneratedReply {
  communicationId: string;
  subject?: string;
  content: string;
  reasoning: string;
  confidenceScore: number;
  approved: boolean;
  leadProfile: LeadProfile;
}

interface BulkAutoReplyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  communications: Communication[];
  onRepliesSent?: (sentReplies: GeneratedReply[]) => void;
}

export function BulkAutoReplyDialog({ open, onOpenChange, communications, onRepliesSent }: BulkAutoReplyDialogProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [generatedReplies, setGeneratedReplies] = useState<GeneratedReply[]>([]);
  const [selectedTone, setSelectedTone] = useState('professional');
  const [currentStep, setCurrentStep] = useState<'generate' | 'preview' | 'sending'>('generate');
  const [selectedReplyIndex, setSelectedReplyIndex] = useState(0);
  const { toast } = useToast();

  // Mock lead profiles - in real implementation, fetch from API
  const mockLeadProfiles: Record<string, LeadProfile> = {
    'lead-1': {
      id: 'lead-1',
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      phone: '+1-555-0123',
      academicJourney: 'Application Submitted',
      programInterest: 'MBA Program',
      leadScore: 85,
      lastActivity: '2 hours ago',
      status: 'Hot Lead',
      communicationHistory: [
        {
          date: '2024-01-15',
          type: 'email',
          subject: 'MBA Program Information Request',
          content: 'I am interested in learning more about your MBA program...',
          direction: 'inbound'
        },
        {
          date: '2024-01-16',
          type: 'email',
          subject: 'Re: MBA Program Information',
          content: 'Thank you for your interest. Here is the detailed brochure...',
          direction: 'outbound'
        }
      ]
    },
    'lead-2': {
      id: 'lead-2',
      name: 'Michael Chen',
      email: 'mchen@email.com',
      phone: '+1-555-0456',
      academicJourney: 'Initial Inquiry',
      programInterest: 'Executive MBA',
      leadScore: 72,
      lastActivity: '5 hours ago',
      status: 'Warm Lead',
      communicationHistory: [
        {
          date: '2024-01-14',
          type: 'sms',
          content: 'Hi, I saw your ad about Executive MBA program. Can you send me more info?',
          direction: 'inbound'
        }
      ]
    },
    'lead-3': {
      id: 'lead-3',
      name: 'Emily Rodriguez',
      email: 'emily.r@email.com',
      academicJourney: 'Interview Scheduled',
      programInterest: 'MBA Program',
      leadScore: 90,
      lastActivity: '1 day ago',
      status: 'Hot Lead',
      communicationHistory: [
        {
          date: '2024-01-10',
          type: 'email',
          subject: 'Application Submission Confirmation',
          content: 'Your application has been received and is under review...',
          direction: 'outbound'
        }
      ]
    },
    'lead-4': {
      id: 'lead-4',
      name: 'David Kim',
      email: 'david.k@email.com',
      academicJourney: 'Program Comparison',
      programInterest: 'MBA vs Executive MBA',
      leadScore: 68,
      lastActivity: '8 hours ago',
      status: 'Warm Lead',
      communicationHistory: []
    },
    'lead-5': {
      id: 'lead-5',
      name: 'Lisa Wang',
      email: 'lisa.w@email.com',
      academicJourney: 'Campus Visit Requested',
      programInterest: 'MBA Program',
      leadScore: 75,
      lastActivity: '12 hours ago',
      status: 'Warm Lead',
      communicationHistory: []
    }
  };

  const handleGenerateAllReplies = async () => {
    setIsGenerating(true);
    setCurrentStep('generate');
    
    try {
      const replies: GeneratedReply[] = [];
      
      for (const comm of communications) {
        const leadProfile = mockLeadProfiles[comm.lead_id];
        
        // Simulate API call to generate reply
        const response = await supabase.functions.invoke('generate-reply-ai', {
          body: {
            leadName: comm.lead_name || 'Valued Prospect',
            leadContext: `Communication type: ${comm.type}. ${comm.subject ? `Subject: ${comm.subject}` : ''} Academic Journey: ${leadProfile?.academicJourney}. Program Interest: ${leadProfile?.programInterest}. Lead Score: ${leadProfile?.leadScore}`,
            communicationHistory: `Recent: ${comm.content}. Previous communications: ${leadProfile?.communicationHistory.map(h => `${h.type}: ${h.content}`).join('; ')}`,
            tone: selectedTone
          }
        });

        if (response.error) throw response.error;

        const { generatedReply } = response.data;
        
        // Generate reasoning based on communication analysis
        const reasoning = generateReasoning(comm, leadProfile);
        
        // Generate subject if this is an email
        let subject = '';
        if (comm.type === 'email') {
          subject = comm.subject?.startsWith('Re:') 
            ? comm.subject 
            : `Re: ${comm.subject || 'Your Inquiry'}`;
        }

        replies.push({
          communicationId: comm.id,
          subject,
          content: generatedReply,
          reasoning,
          confidenceScore: Math.floor(Math.random() * 20) + 80, // 80-100%
          approved: true,
          leadProfile: leadProfile || {
            id: comm.lead_id,
            name: comm.lead_name || 'Unknown',
            email: 'unknown@email.com',
            academicJourney: 'Unknown',
            programInterest: 'Unknown',
            leadScore: 50,
            lastActivity: 'Unknown',
            status: 'New Lead',
            communicationHistory: []
          }
        });
      }
      
      setGeneratedReplies(replies);
      setCurrentStep('preview');
      
      toast({
        title: "Replies Generated",
        description: `Generated ${replies.length} AI-powered replies for review.`,
      });
    } catch (error) {
      console.error('Error generating bulk replies:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate AI replies. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateReasoning = (comm: Communication, leadProfile?: LeadProfile): string => {
    const reasons = [];
    
    if (comm.is_urgent) {
      reasons.push("Marked as urgent - prioritizing quick response");
    }
    
    if (leadProfile?.academicJourney) {
      reasons.push(`Lead is at "${leadProfile.academicJourney}" stage - tailoring response accordingly`);
    }
    
    if (leadProfile?.leadScore && leadProfile.leadScore > 80) {
      reasons.push("High lead score - providing detailed, personalized response");
    }
    
    if (comm.content.toLowerCase().includes('deadline')) {
      reasons.push("Question about deadlines - including specific dates and urgency");
    }
    
    if (comm.content.toLowerCase().includes('scholarship') || comm.content.toLowerCase().includes('fee')) {
      reasons.push("Financial inquiry detected - including scholarship and payment options");
    }
    
    if (comm.content.toLowerCase().includes('visit') || comm.content.toLowerCase().includes('campus')) {
      reasons.push("Campus visit interest - suggesting scheduling and virtual alternatives");
    }
    
    return reasons.length > 0 ? reasons.join('. ') : "Standard informative response based on inquiry content";
  };

  const handleSendAllReplies = async () => {
    const approvedReplies = generatedReplies.filter(reply => reply.approved);
    
    if (approvedReplies.length === 0) {
      toast({
        title: "No Replies Selected",
        description: "Please approve at least one reply to send.",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    setCurrentStep('sending');
    
    try {
      // Mock sending logic - in real implementation, this would integrate with email/SMS services
      for (const reply of approvedReplies) {
        console.log('Sending reply:', {
          to: reply.leadProfile.name,
          email: reply.leadProfile.email,
          subject: reply.subject,
          content: reply.content,
          communicationId: reply.communicationId
        });
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      toast({
        title: "Replies Sent",
        description: `Successfully sent ${approvedReplies.length} replies.`,
      });

      onRepliesSent?.(approvedReplies);
      onOpenChange(false);
      
      // Reset form
      setGeneratedReplies([]);
      setCurrentStep('generate');
      setSelectedReplyIndex(0);
    } catch (error) {
      console.error('Error sending replies:', error);
      toast({
        title: "Send Failed",
        description: "Failed to send some replies. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleReplyApprovalToggle = (index: number) => {
    setGeneratedReplies(prev => prev.map((reply, i) => 
      i === index ? { ...reply, approved: !reply.approved } : reply
    ));
  };

  const handleReplyEdit = (index: number, field: 'subject' | 'content', value: string) => {
    setGeneratedReplies(prev => prev.map((reply, i) => 
      i === index ? { ...reply, [field]: value } : reply
    ));
  };

  const resetDialog = () => {
    setGeneratedReplies([]);
    setCurrentStep('generate');
    setSelectedReplyIndex(0);
    setSelectedTone('professional');
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetDialog();
    }
    onOpenChange(newOpen);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="w-4 h-4" />;
      case 'sms': return <MessageSquare className="w-4 h-4" />;
      case 'call': return <Phone className="w-4 h-4" />;
      default: return <Mail className="w-4 h-4" />;
    }
  };

  const getJourneyColor = (stage: string) => {
    switch (stage.toLowerCase()) {
      case 'initial inquiry': return 'bg-blue-100 text-blue-800';
      case 'application submitted': return 'bg-yellow-100 text-yellow-800';
      case 'interview scheduled': return 'bg-green-100 text-green-800';
      case 'program comparison': return 'bg-purple-100 text-purple-800';
      case 'campus visit requested': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const approvedCount = generatedReplies.filter(reply => reply.approved).length;
  const selectedReply = generatedReplies[selectedReplyIndex];

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Bulk AI Auto-Reply for {communications.length} Communications
          </DialogTitle>
          <DialogDescription>
            Generate and customize AI-powered replies for multiple communications at once.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          {currentStep === 'generate' && (
            <div className="space-y-4">
              {/* Tone Selection */}
              <div className="space-y-2">
                <Label htmlFor="tone">Reply Tone for All Communications</Label>
                <Select value={selectedTone} onValueChange={setSelectedTone}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Communications Preview */}
              <div className="space-y-3">
                <h4 className="font-medium">Communications to Reply To:</h4>
                <ScrollArea className="max-h-60">
                  <div className="space-y-2">
                    {communications.map((comm) => (
                      <Card key={comm.id} className="p-3">
                        <div className="flex items-start gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="text-xs">
                              {comm.lead_name?.split(' ').map(n => n[0]).join('') || 'UN'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium text-sm">{comm.lead_name}</p>
                              {comm.is_urgent && <AlertCircle className="w-3 h-3 text-destructive" />}
                              <div className="flex items-center gap-1 ml-auto">
                                {getTypeIcon(comm.type)}
                                <Badge variant="outline" className="text-xs">{comm.type}</Badge>
                              </div>
                            </div>
                            {comm.subject && (
                              <p className="text-xs font-medium mb-1">{comm.subject}</p>
                            )}
                            <p className="text-xs text-muted-foreground line-clamp-2">{comm.content}</p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              <div className="text-center py-4">
                <Button 
                  onClick={handleGenerateAllReplies} 
                  disabled={isGenerating}
                  className="gap-2"
                  size="lg"
                >
                  {isGenerating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  {isGenerating ? 'Generating AI Replies...' : 'Generate All AI Replies'}
                </Button>
              </div>
            </div>
          )}

          {currentStep === 'preview' && selectedReply && (
            <div className="grid grid-cols-12 gap-4 h-full">
              {/* Left Sidebar - Reply List */}
              <div className="col-span-4 border-r pr-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">Generated Replies</h4>
                  <Badge variant="secondary">{approvedCount}/{generatedReplies.length} approved</Badge>
                </div>
                <ScrollArea className="h-96">
                  <div className="space-y-2">
                    {generatedReplies.map((reply, index) => (
                      <Card 
                        key={reply.communicationId}
                        className={`p-3 cursor-pointer transition-colors ${
                          index === selectedReplyIndex ? 'ring-2 ring-primary' : ''
                        }`}
                        onClick={() => setSelectedReplyIndex(index)}
                      >
                        <div className="flex items-start gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium text-sm truncate">{reply.leadProfile.name}</p>
                              <div 
                                className="w-4 h-4 rounded border-2 cursor-pointer flex items-center justify-center"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleReplyApprovalToggle(index);
                                }}
                              >
                                {reply.approved && <CheckCircle className="w-3 h-3 text-green-600" />}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className="text-xs">{reply.confidenceScore}%</Badge>
                              <Badge className={`text-xs ${getJourneyColor(reply.leadProfile.academicJourney)}`}>
                                {reply.leadProfile.academicJourney}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {reply.content.substring(0, 100)}...
                            </p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              {/* Right Content - Selected Reply Details */}
              <div className="col-span-8">
                <Tabs defaultValue="reply" className="h-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="reply">Reply</TabsTrigger>
                    <TabsTrigger value="reasoning">AI Reasoning</TabsTrigger>
                    <TabsTrigger value="history">History</TabsTrigger>
                    <TabsTrigger value="profile">Lead Profile</TabsTrigger>
                  </TabsList>

                  <TabsContent value="reply" className="space-y-4 mt-4">
                    <div className="flex items-center gap-2 mb-3">
                      <h4 className="font-medium">Reply for {selectedReply.leadProfile.name}</h4>
                      <Badge variant={selectedReply.approved ? "default" : "secondary"}>
                        {selectedReply.approved ? "Approved" : "Not Approved"}
                      </Badge>
                    </div>

                    {selectedReply.subject && (
                      <div className="space-y-2">
                        <Label>Subject Line</Label>
                        <Input
                          value={selectedReply.subject}
                          onChange={(e) => handleReplyEdit(selectedReplyIndex, 'subject', e.target.value)}
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        Reply Content
                        <Edit3 className="w-3 h-3" />
                      </Label>
                      <Textarea
                        value={selectedReply.content}
                        onChange={(e) => handleReplyEdit(selectedReplyIndex, 'content', e.target.value)}
                        rows={12}
                        className="resize-none"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="reasoning" className="mt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Brain className="w-4 h-4" />
                          AI Reasoning & Analysis
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <h5 className="font-medium text-sm mb-2">Why this response was generated:</h5>
                          <p className="text-sm text-muted-foreground">{selectedReply.reasoning}</p>
                        </div>
                        <Separator />
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h5 className="font-medium text-sm mb-1">Confidence Score</h5>
                            <Badge variant="outline">{selectedReply.confidenceScore}%</Badge>
                          </div>
                          <div>
                            <h5 className="font-medium text-sm mb-1">Lead Score</h5>
                            <Badge variant="outline">{selectedReply.leadProfile.leadScore}/100</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="history" className="mt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm flex items-center gap-2">
                          <History className="w-4 h-4" />
                          Communication History
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-64">
                          {selectedReply.leadProfile.communicationHistory.length > 0 ? (
                            <div className="space-y-3">
                              {selectedReply.leadProfile.communicationHistory.map((comm, index) => (
                                <div key={index} className="border-l-2 border-muted pl-3">
                                  <div className="flex items-center gap-2 mb-1">
                                    {getTypeIcon(comm.type)}
                                    <span className="text-xs font-medium">{comm.date}</span>
                                    <Badge variant={comm.direction === 'inbound' ? 'default' : 'secondary'} className="text-xs">
                                      {comm.direction}
                                    </Badge>
                                  </div>
                                  {comm.subject && (
                                    <p className="text-xs font-medium mb-1">{comm.subject}</p>
                                  )}
                                  <p className="text-xs text-muted-foreground">{comm.content}</p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-8 text-muted-foreground">
                              <History className="w-8 h-8 mx-auto mb-2 opacity-50" />
                              <p className="text-sm">No previous communication history</p>
                            </div>
                          )}
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="profile" className="mt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Lead Profile Overview
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h5 className="font-medium text-sm mb-1">Contact Information</h5>
                            <div className="space-y-1">
                              <p className="text-sm">{selectedReply.leadProfile.name}</p>
                              <p className="text-xs text-muted-foreground">{selectedReply.leadProfile.email}</p>
                              {selectedReply.leadProfile.phone && (
                                <p className="text-xs text-muted-foreground">{selectedReply.leadProfile.phone}</p>
                              )}
                            </div>
                          </div>
                          <div>
                            <h5 className="font-medium text-sm mb-1">Lead Status</h5>
                            <div className="space-y-2">
                              <Badge variant="outline">{selectedReply.leadProfile.status}</Badge>
                              <p className="text-xs text-muted-foreground">
                                Last activity: {selectedReply.leadProfile.lastActivity}
                              </p>
                            </div>
                          </div>
                        </div>
                        <Separator />
                        <div>
                          <h5 className="font-medium text-sm mb-2 flex items-center gap-2">
                            <GraduationCap className="w-4 h-4" />
                            Academic Journey
                          </h5>
                          <div className="space-y-2">
                            <Badge className={getJourneyColor(selectedReply.leadProfile.academicJourney)}>
                              {selectedReply.leadProfile.academicJourney}
                            </Badge>
                            <p className="text-sm text-muted-foreground">
                              Interested in: {selectedReply.leadProfile.programInterest}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          )}

          {currentStep === 'sending' && (
            <div className="text-center py-12">
              <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-primary" />
              <h4 className="font-medium mb-2">Sending Replies...</h4>
              <p className="text-sm text-muted-foreground">
                Processing {approvedCount} approved replies
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          
          {currentStep === 'generate' && (
            <Button 
              onClick={handleGenerateAllReplies} 
              disabled={isGenerating}
              className="gap-2"
            >
              {isGenerating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              {isGenerating ? 'Generating...' : 'Generate AI Replies'}
            </Button>
          )}
          
          {currentStep === 'preview' && (
            <>
              <Button 
                variant="outline" 
                onClick={() => setCurrentStep('generate')}
                className="gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Regenerate All
              </Button>
              
              <Button 
                onClick={handleSendAllReplies}
                disabled={isSending || approvedCount === 0}
                className="gap-2"
              >
                {isSending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                {isSending ? 'Sending...' : `Send ${approvedCount} Approved Replies`}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}