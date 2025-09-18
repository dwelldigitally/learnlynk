// @ts-nocheck
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  FileText, 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Calendar,
  BarChart3,
  UserCheck,
  Star,
  MessageSquare,
  Save
} from 'lucide-react';
import { ApplicationEssay } from '@/types/applicationData';

interface RubricScores {
  content: number;
  organization: number;
  language: number;
  relevance: number;
  originality: number;
}

interface ManualGrade {
  totalScore: number;
  rubricScores: RubricScores;
  feedback: string;
  gradedBy: string;
  gradedAt: Date;
}

interface ApplicationEssayViewerProps {
  essays: ApplicationEssay[];
}

export const ApplicationEssayViewer: React.FC<ApplicationEssayViewerProps> = ({ essays }) => {
  const [expandedEssay, setExpandedEssay] = useState<string | null>(null);
  const [selectedEssay, setSelectedEssay] = useState<string>(essays[0]?.id || '');
  const [manualGrades, setManualGrades] = useState<Record<string, ManualGrade>>({});

  const handleManualGrade = (essayId: string, rubricScores: RubricScores, feedback: string) => {
    const totalScore = Math.round(
      (rubricScores.content + rubricScores.organization + rubricScores.language + 
       rubricScores.relevance + rubricScores.originality) / 5 * 25
    );
    
    setManualGrades(prev => ({
      ...prev,
      [essayId]: {
        totalScore,
        rubricScores,
        feedback,
        gradedBy: 'Current Evaluator',
        gradedAt: new Date()
      }
    }));
  };

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
            <TabsList className="w-full flex-wrap h-auto p-1">
              {essays.map((essay) => (
                <TabsTrigger 
                  key={essay.id} 
                  value={essay.id} 
                  className="flex-1 min-w-0 flex flex-col items-center gap-1 p-3 text-xs sm:text-sm"
                >
                  <span className="font-medium truncate w-full text-center">
                    {getEssayTypeLabel(essay.type)}
                  </span>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {essay.wordCount} words
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* Selected Essay Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Essay Content - Main Column */}
        <div className="xl:col-span-2 space-y-6">
          {/* Essay Content Card */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                <div className="flex-1 min-w-0">
                  <CardTitle className="truncate">{selectedEssayData.title}</CardTitle>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">Submitted: {formatDate(selectedEssayData.submittedAt)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BarChart3 className="h-4 w-4 flex-shrink-0" />
                      <span>{selectedEssayData.wordCount} words</span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setExpandedEssay(expandedEssay === selectedEssayData.id ? null : selectedEssayData.id)}
                  className="flex-shrink-0"
                >
                  {expandedEssay === selectedEssayData.id ? (
                    <>
                      <span className="hidden sm:inline">Collapse</span>
                      <ChevronUp className="h-4 w-4 sm:ml-1" />
                    </>
                  ) : (
                    <>
                      <span className="hidden sm:inline">Expand</span>
                      <ChevronDown className="h-4 w-4 sm:ml-1" />
                    </>
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

          {/* Rubric-Based Grading Card */}
          <RubricBasedGradingCard 
            essayId={selectedEssayData.id}
            existingGrade={manualGrades[selectedEssayData.id]}
            onGrade={handleManualGrade}
          />
        </div>

        {/* AI Analysis Sidebar */}
        <div className="xl:col-span-1 space-y-6">
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

// Rubric-Based Grading Component
interface RubricBasedGradingCardProps {
  essayId: string;
  existingGrade?: ManualGrade;
  onGrade: (essayId: string, rubricScores: RubricScores, feedback: string) => void;
}

const RubricBasedGradingCard: React.FC<RubricBasedGradingCardProps> = ({ 
  essayId, 
  existingGrade, 
  onGrade 
}) => {
  const [rubricScores, setRubricScores] = useState({
    content: existingGrade?.rubricScores?.content?.toString() || '',
    organization: existingGrade?.rubricScores?.organization?.toString() || '',
    language: existingGrade?.rubricScores?.language?.toString() || '',
    relevance: existingGrade?.rubricScores?.relevance?.toString() || '',
    originality: existingGrade?.rubricScores?.originality?.toString() || ''
  });
  const [feedback, setFeedback] = useState(existingGrade?.feedback || '');

  const rubricCriteria = [
    {
      key: 'content' as const,
      title: 'Content Quality',
      description: 'Depth of ideas, supporting evidence, critical thinking',
      icon: MessageSquare
    },
    {
      key: 'organization' as const,
      title: 'Organization',
      description: 'Structure, flow, logical progression, transitions',
      icon: BarChart3
    },
    {
      key: 'language' as const,
      title: 'Language & Style',
      description: 'Grammar, vocabulary, tone, clarity of expression',
      icon: FileText
    },
    {
      key: 'relevance' as const,
      title: 'Relevance',
      description: 'Addresses prompt, stays on topic, meets requirements',
      icon: CheckCircle
    },
    {
      key: 'originality' as const,
      title: 'Originality',
      description: 'Unique perspective, creativity, personal voice',
      icon: Star
    }
  ];

  const scoreDescriptions = {
    4: { label: 'Excellent', description: 'Exceeds expectations significantly', color: 'text-green-600' },
    3: { label: 'Good', description: 'Meets expectations well', color: 'text-blue-600' },
    2: { label: 'Satisfactory', description: 'Meets basic expectations', color: 'text-yellow-600' },
    1: { label: 'Needs Improvement', description: 'Below expectations', color: 'text-red-600' }
  };

  const handleScoreChange = (criterion: string, value: string) => {
    setRubricScores(prev => ({
      ...prev,
      [criterion]: value
    }));
  };

  const calculateTotalScore = () => {
    const scores = Object.values(rubricScores).map(score => parseInt(score) || 0);
    const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    return Math.round((average / 4) * 100);
  };

  const handleSave = () => {
    const numericScores = {
      content: parseInt(rubricScores.content) || 0,
      organization: parseInt(rubricScores.organization) || 0,
      language: parseInt(rubricScores.language) || 0,
      relevance: parseInt(rubricScores.relevance) || 0,
      originality: parseInt(rubricScores.originality) || 0
    };

    const allScoresValid = Object.values(numericScores).every(score => score >= 1 && score <= 4);
    
    if (allScoresValid && feedback.trim()) {
      onGrade(essayId, numericScores, feedback);
    }
  };

  const getGradeColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getGradeLetter = (score: number) => {
    if (score >= 97) return 'A+';
    if (score >= 93) return 'A';
    if (score >= 90) return 'A-';
    if (score >= 87) return 'B+';
    if (score >= 83) return 'B';
    if (score >= 80) return 'B-';
    if (score >= 77) return 'C+';
    if (score >= 73) return 'C';
    if (score >= 70) return 'C-';
    if (score >= 60) return 'D';
    return 'F';
  };

  const totalScore = calculateTotalScore();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCheck className="h-5 w-5" />
          Rubric-Based Evaluation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {existingGrade && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="font-medium">Current Grade</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-lg font-bold ${getGradeColor(existingGrade.totalScore)}`}>
                  {existingGrade.totalScore}/100
                </span>
                <Badge variant="secondary">
                  {getGradeLetter(existingGrade.totalScore)}
                </Badge>
              </div>
            </div>
            
            {/* Existing Rubric Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-4">
              {rubricCriteria.map((criterion) => {
                const score = existingGrade.rubricScores[criterion.key];
                return (
                  <div key={criterion.key} className="text-center p-2 bg-white rounded border">
                    <div className="text-xs text-muted-foreground truncate">{criterion.title}</div>
                    <div className={`text-sm font-semibold ${scoreDescriptions[score as keyof typeof scoreDescriptions]?.color}`}>
                      {score}/4
                    </div>
                  </div>
                );
              })}
            </div>
            
            <p className="text-sm text-muted-foreground mb-2">
              Graded by {existingGrade.gradedBy} on {existingGrade.gradedAt.toLocaleDateString()}
            </p>
            <div className="text-sm">
              <span className="font-medium">Feedback:</span>
              <p className="mt-1 text-muted-foreground">{existingGrade.feedback}</p>
            </div>
          </div>
        )}

        {/* Rubric Scoring */}
        <div className="space-y-4">
          <h4 className="font-medium">Evaluation Criteria (4-Point Scale)</h4>
          
          {rubricCriteria.map((criterion) => {
            const IconComponent = criterion.icon;
            const currentScore = parseInt(rubricScores[criterion.key]) || 0;
            
            return (
              <div key={criterion.key} className="space-y-3 p-4 border rounded-lg">
                <div className="flex items-start gap-3">
                  <IconComponent className="h-5 w-5 mt-0.5 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">{criterion.title}</div>
                    <div className="text-sm text-muted-foreground">{criterion.description}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map((score) => (
                    <button
                      key={score}
                      type="button"
                      onClick={() => handleScoreChange(criterion.key, score.toString())}
                      className={`p-2 text-xs rounded border text-center transition-colors ${
                        currentScore === score
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-background hover:bg-muted border-border'
                      }`}
                    >
                      <div className="font-medium">{score}</div>
                      <div className={scoreDescriptions[score as keyof typeof scoreDescriptions].color}>
                        {scoreDescriptions[score as keyof typeof scoreDescriptions].label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Total Score Preview */}
        {Object.values(rubricScores).some(score => score !== '') && (
          <div className="p-3 bg-muted rounded-lg">
            <div className="flex items-center justify-between">
              <span className="font-medium">Calculated Total Score:</span>
              <div className="flex items-center gap-2">
                <span className={`text-lg font-bold ${getGradeColor(totalScore)}`}>
                  {totalScore}/100
                </span>
                <Badge variant="outline">
                  {getGradeLetter(totalScore)}
                </Badge>
              </div>
            </div>
          </div>
        )}

        {/* Feedback */}
        <div className="space-y-2">
          <Label htmlFor="feedback">Detailed Feedback</Label>
          <Textarea
            id="feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Provide specific feedback addressing each criterion, strengths, and areas for improvement..."
            rows={4}
          />
        </div>

        <Button 
          onClick={handleSave}
          disabled={
            Object.values(rubricScores).some(score => !score || parseInt(score) < 1 || parseInt(score) > 4) ||
            !feedback.trim()
          }
          className="w-full"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Rubric Evaluation
        </Button>
      </CardContent>
    </Card>
  );
};
