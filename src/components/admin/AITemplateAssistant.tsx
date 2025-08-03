import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles, Lightbulb, CheckCircle, Wand2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CommunicationTemplate, TemplateType } from '@/types/leadEnhancements';

interface AITemplateAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (template: any) => void;
  existingTemplate?: CommunicationTemplate;
  mode: 'generate' | 'improve';
}

interface AIResponse {
  subject?: string;
  content: string;
  variables: string[];
  suggestions: string[];
  improvements?: string[];
  generationPrompt: string;
}

export function AITemplateAssistant({ 
  isOpen, 
  onClose, 
  onSave, 
  existingTemplate, 
  mode 
}: AITemplateAssistantProps) {
  const [loading, setLoading] = useState(false);
  const [generatedTemplate, setGeneratedTemplate] = useState<AIResponse | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: existingTemplate?.type || 'email' as TemplateType,
    purpose: '',
    tone: 'professional',
    audience: 'prospects',
    keyPoints: ''
  });

  const handleGenerate = async () => {
    if (mode === 'generate' && (!formData.purpose || !formData.name)) {
      toast.error('Please fill in template name and purpose');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-template-assistant', {
        body: {
          action: mode,
          templateType: formData.type,
          purpose: formData.purpose,
          tone: formData.tone,
          audience: formData.audience,
          keyPoints: formData.keyPoints.split(',').map(p => p.trim()).filter(Boolean),
          existingContent: existingTemplate?.content,
          existingSubject: existingTemplate?.subject
        }
      });

      if (error) throw error;

      if (data.success) {
        setGeneratedTemplate(data.data);
        toast.success(`Template ${mode === 'generate' ? 'generated' : 'improved'} successfully!`);
      } else {
        throw new Error(data.error || 'AI generation failed');
      }
    } catch (error) {
      console.error('AI generation error:', error);
      toast.error(`Failed to ${mode} template: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!generatedTemplate) return;

    const templateData = {
      name: formData.name,
      type: formData.type,
      subject: generatedTemplate.subject,
      content: generatedTemplate.content,
      variables: generatedTemplate.variables,
      ai_generated: true,
      generation_prompt: generatedTemplate.generationPrompt,
      ai_suggestions: generatedTemplate.suggestions
    };

    onSave(templateData);
    setGeneratedTemplate(null);
    setFormData({
      name: '',
      type: 'email' as TemplateType,
      purpose: '',
      tone: 'professional',
      audience: 'prospects',
      keyPoints: ''
    });
    onClose();
  };

  const handleRegenerate = () => {
    setGeneratedTemplate(null);
    handleGenerate();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            {mode === 'generate' ? 'Generate Template with AI' : 'Improve Template with AI'}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="form" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="form" disabled={loading}>
              {mode === 'generate' ? 'Generate' : 'Improve'}
            </TabsTrigger>
            <TabsTrigger value="result" disabled={!generatedTemplate}>
              Preview & Save
            </TabsTrigger>
          </TabsList>

          <TabsContent value="form" className="space-y-6">
            {mode === 'generate' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Template Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Welcome Email for New Leads"
                    />
                  </div>

                  <div>
                    <Label htmlFor="type">Template Type</Label>
                    <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as TemplateType }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="sms">SMS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="purpose">Purpose</Label>
                    <Select value={formData.purpose} onValueChange={(value) => setFormData(prev => ({ ...prev, purpose: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select template purpose" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="welcome">Welcome Message</SelectItem>
                        <SelectItem value="follow-up">Follow-up</SelectItem>
                        <SelectItem value="reminder">Reminder</SelectItem>
                        <SelectItem value="thank-you">Thank You</SelectItem>
                        <SelectItem value="program-info">Program Information</SelectItem>
                        <SelectItem value="application-deadline">Application Deadline</SelectItem>
                        <SelectItem value="enrollment">Enrollment</SelectItem>
                        <SelectItem value="re-engagement">Re-engagement</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="tone">Tone</Label>
                    <Select value={formData.tone} onValueChange={(value) => setFormData(prev => ({ ...prev, tone: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="friendly">Friendly</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                        <SelectItem value="casual">Casual</SelectItem>
                        <SelectItem value="encouraging">Encouraging</SelectItem>
                        <SelectItem value="informative">Informative</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="audience">Target Audience</Label>
                    <Select value={formData.audience} onValueChange={(value) => setFormData(prev => ({ ...prev, audience: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="prospects">Prospects</SelectItem>
                        <SelectItem value="new-leads">New Leads</SelectItem>
                        <SelectItem value="applicants">Applicants</SelectItem>
                        <SelectItem value="enrolled-students">Enrolled Students</SelectItem>
                        <SelectItem value="parents">Parents/Guardians</SelectItem>
                        <SelectItem value="alumni">Alumni</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="keyPoints">Key Points (comma-separated)</Label>
                    <Textarea
                      id="keyPoints"
                      value={formData.keyPoints}
                      onChange={(e) => setFormData(prev => ({ ...prev, keyPoints: e.target.value }))}
                      placeholder="e.g., scholarship opportunities, application deadline, campus tour"
                      className="h-20"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Template Name</Label>
                  <Input
                    id="name"
                    value={formData.name || existingTemplate?.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Template name"
                  />
                </div>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Current Template</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {existingTemplate?.subject && (
                      <div className="mb-3">
                        <Label className="text-xs text-muted-foreground">Subject:</Label>
                        <p className="text-sm">{existingTemplate.subject}</p>
                      </div>
                    )}
                    <div>
                      <Label className="text-xs text-muted-foreground">Content:</Label>
                      <p className="text-sm whitespace-pre-wrap">{existingTemplate?.content}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button onClick={handleGenerate} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {mode === 'generate' ? 'Generating...' : 'Improving...'}
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4 mr-2" />
                    {mode === 'generate' ? 'Generate Template' : 'Improve Template'}
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="result" className="space-y-6">
            {generatedTemplate && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      Generated Template
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {generatedTemplate.subject && (
                      <div>
                        <Label className="text-sm font-medium">Subject Line:</Label>
                        <p className="text-sm bg-muted p-3 rounded-md mt-1">{generatedTemplate.subject}</p>
                      </div>
                    )}
                    
                    <div>
                      <Label className="text-sm font-medium">Content:</Label>
                      <div className="text-sm bg-muted p-3 rounded-md mt-1 whitespace-pre-wrap">
                        {generatedTemplate.content}
                      </div>
                    </div>

                    {generatedTemplate.variables.length > 0 && (
                      <div>
                        <Label className="text-sm font-medium">Variables Used:</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {generatedTemplate.variables.map((variable, index) => (
                            <Badge key={index} variant="secondary">{variable}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {generatedTemplate.suggestions.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-yellow-500" />
                        AI Suggestions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {generatedTemplate.suggestions.map((suggestion, index) => (
                          <li key={index} className="text-sm flex items-start gap-2">
                            <span className="text-muted-foreground">•</span>
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {mode === 'improve' && generatedTemplate.improvements && generatedTemplate.improvements.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-blue-500" />
                        Improvements Made
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {generatedTemplate.improvements.map((improvement, index) => (
                          <li key={index} className="text-sm flex items-start gap-2">
                            <span className="text-muted-foreground">•</span>
                            {improvement}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={handleRegenerate} disabled={loading}>
                    <Wand2 className="h-4 w-4 mr-2" />
                    Regenerate
                  </Button>
                  <Button onClick={handleSave}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Save Template
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}