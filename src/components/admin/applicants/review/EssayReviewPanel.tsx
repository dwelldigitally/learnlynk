import React, { useState } from 'react';
import { ReviewSession } from '@/types/review';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { BookOpen, MessageSquare, Star, AlertTriangle } from 'lucide-react';

interface EssayReviewPanelProps {
  applicantId: string;
  session: ReviewSession;
}

// Mock essay data
const mockEssays = [
  {
    id: '1',
    type: 'personal_statement',
    title: 'Personal Statement',
    content: `As I stood in the operating room observing my first surgery, I realized that medicine was not just about treating illness, but about understanding the intricate balance between science and humanity. This moment crystallized my determination to pursue a career in medicine.

My journey toward medicine began during my undergraduate studies in biology, where I developed a deep appreciation for the complexity of life sciences. Through coursework in biochemistry, genetics, and physiology, I gained a solid foundation in the scientific principles that underpin medical practice. However, it was my volunteer work at the local hospital that truly opened my eyes to the human side of healthcare.

During my three years as a volunteer in the emergency department, I witnessed firsthand how healthcare professionals combine technical expertise with compassion to provide optimal patient care. I observed how a simple gesture of kindness could alleviate a patient's anxiety, and how clear communication could bridge the gap between complex medical procedures and patient understanding. These experiences reinforced my belief that effective medical practice requires both scientific knowledge and emotional intelligence.

My research experience in Dr. Smith's laboratory further solidified my commitment to medicine. Working on a project investigating novel therapeutic targets for cardiovascular disease, I learned to think critically about complex problems and develop systematic approaches to finding solutions. The rigorous methodology and attention to detail required in research are skills that I know will serve me well in medical practice.

I am particularly drawn to the field of internal medicine because of its emphasis on comprehensive patient care and diagnostic reasoning. The opportunity to build long-term relationships with patients while addressing their diverse health needs appeals to my desire to make a meaningful impact on people's lives. I believe my strong academic background, combined with my volunteer experience and research training, has prepared me well for the challenges of medical school and a career in medicine.`,
    wordCount: 267,
    aiAnalysis: {
      grammarScore: 92,
      clarityScore: 88,
      relevanceScore: 95,
      keyThemes: ['Medical motivation', 'Scientific foundation', 'Patient care', 'Research experience'],
      sentiment: 'positive',
      flaggedConcerns: []
    }
  },
  {
    id: '2',
    type: 'motivation_letter',
    title: 'Why This Program?',
    content: `Your program's innovative curriculum and emphasis on research-based learning align perfectly with my academic goals and career aspirations. The opportunity to engage in cutting-edge research while receiving comprehensive clinical training makes this program uniquely suited to my educational needs.

I am particularly excited about the program's focus on personalized medicine and its integration of technology in healthcare delivery. Having worked with bioinformatics tools during my undergraduate research, I understand the potential of data-driven approaches to improve patient outcomes. Your faculty's groundbreaking work in genomic medicine and precision therapeutics represents exactly the kind of innovative thinking I want to be part of.

The program's commitment to community engagement also resonates with my values. My volunteer work has shown me the importance of addressing healthcare disparities, and I am eager to contribute to your community outreach initiatives. I believe that meaningful healthcare extends beyond hospital walls to encompass education, prevention, and advocacy.

Furthermore, the collaborative learning environment fostered by your program appeals to my belief that medicine is fundamentally a team effort. The opportunity to work alongside diverse peers and learn from experienced faculty in small group settings will undoubtedly enhance my educational experience and prepare me for collaborative practice.`,
    wordCount: 189,
    aiAnalysis: {
      grammarScore: 94,
      clarityScore: 90,
      relevanceScore: 93,
      keyThemes: ['Program alignment', 'Research interest', 'Community service', 'Collaboration'],
      sentiment: 'positive',
      flaggedConcerns: ['Could be more specific about research interests']
    }
  }
];

export function EssayReviewPanel({ applicantId, session }: EssayReviewPanelProps) {
  const [selectedEssay, setSelectedEssay] = useState(mockEssays[0]);
  const [scores, setScores] = useState({
    content: [85],
    structure: [80],
    originality: [88],
    relevance: [92]
  });
  const [comments, setComments] = useState('');

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      default: return 'text-yellow-600';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const overallScore = Math.round(
    (scores.content[0] + scores.structure[0] + scores.originality[0] + scores.relevance[0]) / 4
  );

  return (
    <div className="h-full flex">
      {/* Essay List */}
      <div className="w-1/4 p-6 border-r">
        <h2 className="text-lg font-semibold mb-4">Essays</h2>
        
        <div className="space-y-3">
          {mockEssays.map((essay) => (
            <Card 
              key={essay.id}
              className={`cursor-pointer transition-colors ${
                selectedEssay.id === essay.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
              }`}
              onClick={() => setSelectedEssay(essay)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-sm">{essay.title}</h3>
                  <div className="text-xs text-muted-foreground">
                    {essay.wordCount}w
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span>Grammar</span>
                    <span className={getScoreColor(essay.aiAnalysis.grammarScore)}>
                      {essay.aiAnalysis.grammarScore}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span>Clarity</span>
                    <span className={getScoreColor(essay.aiAnalysis.clarityScore)}>
                      {essay.aiAnalysis.clarityScore}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span>Relevance</span>
                    <span className={getScoreColor(essay.aiAnalysis.relevanceScore)}>
                      {essay.aiAnalysis.relevanceScore}%
                    </span>
                  </div>
                </div>

                <div className="mt-3">
                  <Badge className={`text-xs ${getSentimentColor(essay.aiAnalysis.sentiment)}`}>
                    {essay.aiAnalysis.sentiment}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Essay Content */}
      <div className="w-1/2 p-6 border-r">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{selectedEssay.title}</h3>
          <div className="flex items-center space-x-2">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {selectedEssay.wordCount} words
            </span>
          </div>
        </div>

        {/* AI Analysis Summary */}
        <Card className="mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center">
              <Star className="h-4 w-4 mr-2" />
              AI Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-3 gap-4 text-center mb-4">
              <div>
                <div className={`text-lg font-bold ${getScoreColor(selectedEssay.aiAnalysis.grammarScore)}`}>
                  {selectedEssay.aiAnalysis.grammarScore}%
                </div>
                <div className="text-xs text-muted-foreground">Grammar</div>
              </div>
              <div>
                <div className={`text-lg font-bold ${getScoreColor(selectedEssay.aiAnalysis.clarityScore)}`}>
                  {selectedEssay.aiAnalysis.clarityScore}%
                </div>
                <div className="text-xs text-muted-foreground">Clarity</div>
              </div>
              <div>
                <div className={`text-lg font-bold ${getScoreColor(selectedEssay.aiAnalysis.relevanceScore)}`}>
                  {selectedEssay.aiAnalysis.relevanceScore}%
                </div>
                <div className="text-xs text-muted-foreground">Relevance</div>
              </div>
            </div>

            {/* Key Themes */}
            <div className="mb-3">
              <div className="text-xs font-medium mb-2">Key Themes:</div>
              <div className="flex flex-wrap gap-1">
                {selectedEssay.aiAnalysis.keyThemes.map((theme, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {theme}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Flagged Concerns */}
            {selectedEssay.aiAnalysis.flaggedConcerns.length > 0 && (
              <div>
                <div className="text-xs font-medium mb-2 flex items-center">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Concerns:
                </div>
                <div className="space-y-1">
                  {selectedEssay.aiAnalysis.flaggedConcerns.map((concern, idx) => (
                    <div key={idx} className="text-xs text-amber-600">
                      • {concern}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Essay Content */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Essay Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none text-sm leading-relaxed">
              {selectedEssay.content.split('\n\n').map((paragraph, idx) => (
                <p key={idx} className="mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grading Panel */}
      <div className="w-1/4 p-6">
        <h3 className="text-lg font-semibold mb-4">Grade Essay</h3>

        {/* Overall Score */}
        <Card className="mb-6">
          <CardContent className="p-4 text-center">
            <div className={`text-3xl font-bold ${getScoreColor(overallScore)}`}>
              {overallScore}%
            </div>
            <div className="text-sm text-muted-foreground">Overall Score</div>
          </CardContent>
        </Card>

        {/* Rubric-Based Grading */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Grading Rubric</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-4">
            {Object.entries(scores).map(([criterion, value]) => {
              const rubricDescriptions = {
                content: {
                  90: 'Exceptional depth and insight',
                  80: 'Strong content with good examples',
                  70: 'Adequate content, some gaps',
                  60: 'Basic content, lacks depth'
                },
                structure: {
                  90: 'Clear, logical flow throughout',
                  80: 'Well-organized with minor issues',
                  70: 'Generally organized, some confusion',
                  60: 'Poor organization, hard to follow'
                },
                originality: {
                  90: 'Highly original and creative',
                  80: 'Some original thinking',
                  70: 'Limited originality',
                  60: 'Generic, lacks personal voice'
                },
                relevance: {
                  90: 'Directly addresses all prompts',
                  80: 'Mostly relevant with good focus',
                  70: 'Generally relevant, some drift',
                  60: 'Tangential or off-topic'
                }
              };

              const getCurrentDescription = (score: number) => {
                const descriptions = rubricDescriptions[criterion as keyof typeof rubricDescriptions];
                if (score >= 90) return descriptions[90];
                if (score >= 80) return descriptions[80];
                if (score >= 70) return descriptions[70];
                return descriptions[60];
              };

              return (
                <div key={criterion} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium capitalize">
                      {criterion}
                    </label>
                    <span className="text-sm font-medium">{value[0]}%</span>
                  </div>
                  
                  <Slider
                    value={value}
                    onValueChange={(newValue) => 
                      setScores(prev => ({ ...prev, [criterion]: newValue }))
                    }
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  
                  <div className="text-xs text-muted-foreground">
                    {getCurrentDescription(value[0])}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Comments */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center">
              <MessageSquare className="h-4 w-4 mr-2" />
              Comments
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <Textarea
              placeholder="Add your review comments..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={6}
              className="mb-4"
            />
            <div className="flex space-x-2">
              <Button size="sm" className="flex-1">
                Save Grade
              </Button>
              <Button size="sm" variant="outline">
                Templates
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}