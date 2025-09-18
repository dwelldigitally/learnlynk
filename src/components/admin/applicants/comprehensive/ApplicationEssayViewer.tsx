import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Calendar,
  BarChart3
} from 'lucide-react';
import { ApplicationEssay } from '@/types/applicationData';

interface ApplicationEssayViewerProps {
  essays: ApplicationEssay[];
}

export const ApplicationEssayViewer: React.FC<ApplicationEssayViewerProps> = ({ essays }) => {
  const [expandedEssay, setExpandedEssay] = useState<string | null>(null);
  const [selectedEssay, setSelectedEssay] = useState<string>(essays[0]?.id || '');

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const getEssayTypeLabel = (type: ApplicationEssay['type']) => {
    const labels = {
      'personal_statement': 'Personal Statement',
      'motivation_letter': 'Motivation Letter',
      'academic_goals': 'Academic Goals',
      'research_interest': 'Research Interest',
      'career_aspirations': 'Career Aspirations'
    };
    return labels[type] || type;
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreVariant = (score: number): "default" | "secondary" | "destructive" => {
    if (score >= 90) return 'default';
    if (score >= 70) return 'secondary';
    return 'destructive';
  };

  if (!essays || essays.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No essays submitted yet</p>
        </CardContent>
      </Card>
    );
  }

  const selectedEssayData = essays.find(essay => essay.id === selectedEssay) || essays[0];

  return (
    <div className="space-y-6">
      {/* Essay Selection Tabs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Application Essays ({essays.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedEssay} onValueChange={setSelectedEssay}>
            <TabsList className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {essays.map((essay) => (
                <TabsTrigger key={essay.id} value={essay.id} className="flex flex-col items-start p-3">
                  <span className="font-medium">{getEssayTypeLabel(essay.type)}</span>
                  <span className="text-xs text-muted-foreground">{essay.wordCount} words</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* Selected Essay Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Essay Content - Main Column */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{selectedEssayData.title}</CardTitle>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Submitted: {formatDate(selectedEssayData.submittedAt)}
                    </div>
                    <div className="flex items-center gap-1">
                      <BarChart3 className="h-4 w-4" />
                      {selectedEssayData.wordCount} words
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setExpandedEssay(expandedEssay === selectedEssayData.id ? null : selectedEssayData.id)}
                >
                  {expandedEssay === selectedEssayData.id ? (
                    <>Collapse <ChevronUp className="h-4 w-4 ml-1" /></>
                  ) : (
                    <>Expand <ChevronDown className="h-4 w-4 ml-1" /></>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div 
                className={`prose prose-sm max-w-none text-justify ${
                  expandedEssay === selectedEssayData.id ? '' : 'max-h-96 overflow-hidden'
                }`}
              >
                {selectedEssayData.content.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
              {expandedEssay !== selectedEssayData.id && selectedEssayData.content.length > 1000 && (
                <div className="mt-4 text-center">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setExpandedEssay(selectedEssayData.id)}
                  >
                    Read More
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* AI Analysis Sidebar */}
        <div className="lg:col-span-1">
          {selectedEssayData.aiAnalysis && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Quality Scores */}
                <div className="space-y-4">
                  <h4 className="font-medium">Quality Assessment</h4>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Grammar</span>
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={selectedEssayData.aiAnalysis.grammarScore} 
                          className="w-16 h-2" 
                        />
                        <span className={`text-sm font-medium ${getScoreColor(selectedEssayData.aiAnalysis.grammarScore)}`}>
                          {selectedEssayData.aiAnalysis.grammarScore}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Clarity</span>
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={selectedEssayData.aiAnalysis.clarityScore} 
                          className="w-16 h-2" 
                        />
                        <span className={`text-sm font-medium ${getScoreColor(selectedEssayData.aiAnalysis.clarityScore)}`}>
                          {selectedEssayData.aiAnalysis.clarityScore}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Relevance</span>
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={selectedEssayData.aiAnalysis.relevanceScore} 
                          className="w-16 h-2" 
                        />
                        <span className={`text-sm font-medium ${getScoreColor(selectedEssayData.aiAnalysis.relevanceScore)}`}>
                          {selectedEssayData.aiAnalysis.relevanceScore}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Key Themes */}
                <div>
                  <h4 className="font-medium mb-3">Key Themes</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedEssayData.aiAnalysis.keyThemes.map((theme, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {theme}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Sentiment */}
                <div>
                  <h4 className="font-medium mb-3">Overall Sentiment</h4>
                  <Badge variant={
                    selectedEssayData.aiAnalysis.sentiment === 'positive' ? 'default' :
                    selectedEssayData.aiAnalysis.sentiment === 'neutral' ? 'secondary' : 'destructive'
                  }>
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {selectedEssayData.aiAnalysis.sentiment.charAt(0).toUpperCase() + selectedEssayData.aiAnalysis.sentiment.slice(1)}
                  </Badge>
                </div>

                {/* Concerns */}
                {selectedEssayData.aiAnalysis.flaggedConcerns.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        Flagged Concerns
                      </h4>
                      <div className="space-y-2">
                        {selectedEssayData.aiAnalysis.flaggedConcerns.map((concern, index) => (
                          <div key={index} className="text-sm p-2 bg-yellow-50 border border-yellow-200 rounded">
                            {concern}
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {selectedEssayData.aiAnalysis.flaggedConcerns.length === 0 && (
                  <>
                    <Separator />
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">No concerns flagged</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};