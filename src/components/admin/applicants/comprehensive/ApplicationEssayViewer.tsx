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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

interface ApplicationEssayViewerProps {
  essays: ApplicationEssay[];
}

export const ApplicationEssayViewer: React.FC<ApplicationEssayViewerProps> = ({ essays }) => {
  const [expandedEssay, setExpandedEssay] = useState<string | null>(null);
  const [selectedEssay, setSelectedEssay] = useState<string>(essays[0]?.id || '');
  const [manualGrades, setManualGrades] = useState<Record<string, {
    score: number;
    feedback: string;
    gradedBy: string;
    gradedAt: Date;
  }>>({});

  const handleManualGrade = (essayId: string, score: number, feedback: string) => {
    setManualGrades(prev => ({
      ...prev,
      [essayId]: {
        score,
        feedback,
        gradedBy: 'Current Evaluator', // In real app, this would be the logged-in user
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

          {/* Manual Grading Card */}
          <ManualGradingCard 
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

// Manual Grading Component
interface ManualGradingCardProps {
  essayId: string;
  existingGrade?: {
    score: number;
    feedback: string;
    gradedBy: string;
    gradedAt: Date;
  };
  onGrade: (essayId: string, score: number, feedback: string) => void;
}

const ManualGradingCard: React.FC<ManualGradingCardProps> = ({ 
  essayId, 
  existingGrade, 
  onGrade 
}) => {
  const [score, setScore] = useState(existingGrade?.score?.toString() || '');
  const [feedback, setFeedback] = useState(existingGrade?.feedback || '');
  const [gradeLevel, setGradeLevel] = useState('');

  const handleSave = () => {
    const numericScore = parseInt(score);
    if (numericScore >= 0 && numericScore <= 100 && feedback.trim()) {
      onGrade(essayId, numericScore, feedback);
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCheck className="h-5 w-5" />
          Manual Evaluation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {existingGrade && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="font-medium">Current Grade</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-lg font-bold ${getGradeColor(existingGrade.score)}`}>
                  {existingGrade.score}/100
                </span>
                <Badge variant="secondary">
                  {getGradeLetter(existingGrade.score)}
                </Badge>
              </div>
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

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="score">Score (0-100)</Label>
              <Input
                id="score"
                type="number"
                min="0"
                max="100"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                placeholder="Enter score"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="grade-level">Grade Level</Label>
              <Select value={gradeLevel} onValueChange={setGradeLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A+">A+ (97-100) - Exceptional</SelectItem>
                  <SelectItem value="A">A (93-96) - Excellent</SelectItem>
                  <SelectItem value="A-">A- (90-92) - Very Good</SelectItem>
                  <SelectItem value="B+">B+ (87-89) - Good</SelectItem>
                  <SelectItem value="B">B (83-86) - Above Average</SelectItem>
                  <SelectItem value="B-">B- (80-82) - Average</SelectItem>
                  <SelectItem value="C+">C+ (77-79) - Below Average</SelectItem>
                  <SelectItem value="C">C (73-76) - Poor</SelectItem>
                  <SelectItem value="C-">C- (70-72) - Very Poor</SelectItem>
                  <SelectItem value="D">D (60-69) - Failing</SelectItem>
                  <SelectItem value="F">F (0-59) - Unacceptable</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="feedback">Evaluator Feedback</Label>
            <Textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Provide detailed feedback on the essay's strengths, weaknesses, and areas for improvement..."
              rows={4}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              onClick={handleSave} 
              disabled={!score || !feedback.trim()}
              className="flex-1"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Grade
            </Button>
            <Button variant="outline" className="flex-1">
              <MessageSquare className="h-4 w-4 mr-2" />
              Add Comment
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};