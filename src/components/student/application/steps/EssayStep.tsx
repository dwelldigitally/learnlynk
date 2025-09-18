import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, FileText, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Essay {
  id: string;
  type: 'personal_statement' | 'motivation_letter' | 'academic_goals' | 'program_specific' | 'research_interest';
  title: string;
  content: string;
  wordCount: number;
  maxWords?: number;
  required: boolean;
  prompt?: string;
}

interface EssayData {
  essays?: Essay[];
}

interface EssayStepProps {
  data: EssayData;
  onUpdate: (data: EssayData) => void;
}

const EssayStep: React.FC<EssayStepProps> = ({ data, onUpdate }) => {
  const [formData, setFormData] = useState<EssayData>({
    essays: [],
    ...data
  });

  const [selectedEssay, setSelectedEssay] = useState<Essay | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    onUpdate(formData);
  }, [formData, onUpdate]);

  useEffect(() => {
    // Initialize with required essays if none exist
    if (!formData.essays || formData.essays.length === 0) {
      const requiredEssays: Essay[] = [
        {
          id: crypto.randomUUID(),
          type: 'personal_statement',
          title: 'Personal Statement',
          content: '',
          wordCount: 0,
          maxWords: 500,
          required: true,
          prompt: 'Please write a personal statement that describes your background, interests, and goals. What led you to apply to this program?'
        },
        {
          id: crypto.randomUUID(),
          type: 'motivation_letter',
          title: 'Motivation Letter',
          content: '',
          wordCount: 0,
          maxWords: 400,
          required: true,
          prompt: 'Why are you interested in this specific program? How does it align with your career goals?'
        }
      ];

      setFormData(prev => ({
        ...prev,
        essays: requiredEssays
      }));
    }
  }, []);

  const addEssay = () => {
    const newEssay: Essay = {
      id: crypto.randomUUID(),
      type: 'program_specific',
      title: '',
      content: '',
      wordCount: 0,
      maxWords: 300,
      required: false
    };

    setFormData(prev => ({
      ...prev,
      essays: [...(prev.essays || []), newEssay]
    }));
  };

  const removeEssay = (id: string) => {
    setFormData(prev => ({
      ...prev,
      essays: prev.essays?.filter(essay => essay.id !== id) || []
    }));
  };

  const updateEssay = (id: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      essays: prev.essays?.map(essay => {
        if (essay.id === id) {
          const updatedEssay = { ...essay, [field]: value };
          
          // Auto-update word count if content changes
          if (field === 'content') {
            updatedEssay.wordCount = value.trim().split(/\s+/).filter((word: string) => word.length > 0).length;
          }
          
          return updatedEssay;
        }
        return essay;
      }) || []
    }));
  };

  const getEssayTypeLabel = (type: string) => {
    switch (type) {
      case 'personal_statement':
        return 'Personal Statement';
      case 'motivation_letter':
        return 'Motivation Letter';
      case 'academic_goals':
        return 'Academic Goals';
      case 'program_specific':
        return 'Program-Specific Essay';
      case 'research_interest':
        return 'Research Interest';
      default:
        return 'Essay';
    }
  };

  const getWordCountColor = (wordCount: number, maxWords?: number) => {
    if (!maxWords) return 'text-muted-foreground';
    
    const percentage = (wordCount / maxWords) * 100;
    if (percentage > 100) return 'text-destructive';
    if (percentage > 90) return 'text-yellow-600';
    if (percentage > 50) return 'text-blue-600';
    return 'text-muted-foreground';
  };

  const handlePreview = (essay: Essay) => {
    setSelectedEssay(essay);
    setIsPreviewOpen(true);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-semibold">Essays and Personal Statements</h4>
          <Button onClick={addEssay} size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Additional Essay
          </Button>
        </div>

        {formData.essays && formData.essays.length > 0 ? (
          <div className="space-y-6">
            {formData.essays.map((essay, index) => (
              <Card key={essay.id} className="p-4 border-l-4 border-l-primary">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5" />
                    <div>
                      <h5 className="font-medium">{essay.title || getEssayTypeLabel(essay.type)}</h5>
                      <div className="flex items-center gap-2 mt-1">
                        {essay.required && (
                          <Badge variant="destructive" className="text-xs">Required</Badge>
                        )}
                        <span className={`text-sm ${getWordCountColor(essay.wordCount, essay.maxWords)}`}>
                          {essay.wordCount} {essay.maxWords && `/ ${essay.maxWords}`} words
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {essay.content && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePreview(essay)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    )}
                    {!essay.required && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeEssay(essay.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Essay Type and Title */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Essay Type</Label>
                      <Select 
                        value={essay.type} 
                        onValueChange={(value) => updateEssay(essay.id, 'type', value)}
                        disabled={essay.required}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="personal_statement">Personal Statement</SelectItem>
                          <SelectItem value="motivation_letter">Motivation Letter</SelectItem>
                          <SelectItem value="academic_goals">Academic Goals</SelectItem>
                          <SelectItem value="program_specific">Program-Specific Essay</SelectItem>
                          <SelectItem value="research_interest">Research Interest</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Custom Title (Optional)</Label>
                      <Input
                        value={essay.title}
                        onChange={(e) => updateEssay(essay.id, 'title', e.target.value)}
                        placeholder={getEssayTypeLabel(essay.type)}
                      />
                    </div>
                  </div>

                  {/* Word Limit */}
                  <div>
                    <Label>Word Limit (Optional)</Label>
                    <Input
                      type="number"
                      value={essay.maxWords || ''}
                      onChange={(e) => updateEssay(essay.id, 'maxWords', e.target.value ? parseInt(e.target.value) : undefined)}
                      placeholder="Enter maximum word count"
                      className="w-32"
                    />
                  </div>

                  {/* Prompt */}
                  {essay.prompt && (
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <Label className="text-sm font-medium">Essay Prompt:</Label>
                      <p className="text-sm text-muted-foreground mt-1">{essay.prompt}</p>
                    </div>
                  )}

                  {/* Essay Content */}
                  <div>
                    <Label>Essay Content *</Label>
                    <Textarea
                      value={essay.content}
                      onChange={(e) => updateEssay(essay.id, 'content', e.target.value)}
                      placeholder="Write your essay here..."
                      rows={12}
                      className="min-h-[300px]"
                      required
                    />
                    <div className="flex justify-between items-center mt-2 text-sm">
                      <span className="text-muted-foreground">
                        Tip: Write in clear, concise sentences. Focus on specific examples and achievements.
                      </span>
                      <span className={getWordCountColor(essay.wordCount, essay.maxWords)}>
                        {essay.wordCount} words
                        {essay.maxWords && (
                          <span className="ml-1">
                            ({Math.round((essay.wordCount / essay.maxWords) * 100)}%)
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No essays added yet.</p>
          </div>
        )}
      </Card>

      {/* Essay Guidelines */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h4 className="text-lg font-semibold mb-3 text-blue-900">Essay Writing Guidelines</h4>
        <div className="space-y-2 text-sm text-blue-800">
          <p>• <strong>Be specific:</strong> Use concrete examples and avoid generalizations</p>
          <p>• <strong>Show, don't tell:</strong> Demonstrate your qualities through stories and experiences</p>
          <p>• <strong>Stay focused:</strong> Answer the prompt directly and stay on topic</p>
          <p>• <strong>Be authentic:</strong> Write in your own voice and be genuine</p>
          <p>• <strong>Proofread:</strong> Check for grammar, spelling, and clarity before submitting</p>
        </div>
      </Card>

      {/* Essay Preview Modal */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedEssay?.title || getEssayTypeLabel(selectedEssay?.type || '')}
            </DialogTitle>
          </DialogHeader>
          
          {selectedEssay && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Type: {getEssayTypeLabel(selectedEssay.type)}</span>
                <span>Word Count: {selectedEssay.wordCount}</span>
                {selectedEssay.maxWords && (
                  <span>Limit: {selectedEssay.maxWords} words</span>
                )}
              </div>
              
              {selectedEssay.prompt && (
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h6 className="font-medium mb-2">Prompt:</h6>
                  <p className="text-sm">{selectedEssay.prompt}</p>
                </div>
              )}
              
              <div className="prose max-w-none">
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {selectedEssay.content}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EssayStep;