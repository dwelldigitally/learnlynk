import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageSquare, 
  Search,
  Star,
  Calendar,
  Filter,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { ApplicationFormResponse } from '@/types/applicationData';

interface ApplicationResponsesViewerProps {
  responses: ApplicationFormResponse[];
}

export const ApplicationResponsesViewer: React.FC<ApplicationResponsesViewerProps> = ({ responses }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedResponse, setExpandedResponse] = useState<string | null>(null);

  const categories = ['all', 'academic', 'personal', 'professional', 'motivation', 'background'];
  
  const filteredResponses = responses.filter(response => {
    const matchesSearch = searchTerm === '' || 
      response.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      response.answer.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || response.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const responsesByCategory = categories.reduce((acc, category) => {
    if (category === 'all') {
      acc[category] = responses;
    } else {
      acc[category] = responses.filter(r => r.category === category);
    }
    return acc;
  }, {} as Record<string, ApplicationFormResponse[]>);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const getScoreColor = (score?: number) => {
    if (!score) return 'text-muted-foreground';
    if (score >= 9) return 'text-green-600';
    if (score >= 7) return 'text-blue-600';
    if (score >= 5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      academic: 'bg-blue-100 text-blue-800',
      personal: 'bg-green-100 text-green-800',
      professional: 'bg-purple-100 text-purple-800',
      motivation: 'bg-orange-100 text-orange-800',
      background: 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const ResponseCard: React.FC<{ response: ApplicationFormResponse }> = ({ response }) => {
    const isExpanded = expandedResponse === response.id;
    const shouldTruncate = response.answer.length > 300;

    return (
      <Card key={response.id}>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <CardTitle className="text-base leading-relaxed">
                {response.question}
              </CardTitle>
              <div className="flex items-center gap-3 mt-2">
                <Badge className={getCategoryColor(response.category)}>
                  {response.category}
                </Badge>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {formatDate(response.submittedAt)}
                </div>
              </div>
            </div>
            
            {response.aiScore && (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className={`font-semibold ${getScoreColor(response.aiScore)}`}>
                  {response.aiScore.toFixed(1)}
                </span>
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-3">
            <div className={`prose prose-sm max-w-none ${!isExpanded && shouldTruncate ? 'line-clamp-4' : ''}`}>
              <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                {response.answer}
              </p>
            </div>
            
            {shouldTruncate && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpandedResponse(isExpanded ? null : response.id)}
                className="mt-2"
              >
                {isExpanded ? (
                  <>
                    Show Less <ChevronUp className="h-4 w-4 ml-1" />
                  </>
                ) : (
                  <>
                    Read More <ChevronDown className="h-4 w-4 ml-1" />
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  if (!responses || responses.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No application responses submitted yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Search */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Application Responses ({responses.length})
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                <Input
                  placeholder="Search questions and answers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Category Tabs */}
      <Card>
        <CardContent className="pt-6">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
              {categories.map((category) => (
                <TabsTrigger key={category} value={category} className="flex items-center gap-2">
                  <span className="capitalize">
                    {category === 'all' ? 'All' : category}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {category === 'all' ? responses.length : responsesByCategory[category]?.length || 0}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>
            
            {/* Results */}
            <div className="mt-6">
              {filteredResponses.length === 0 ? (
                <div className="text-center py-8">
                  <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    No responses found matching your criteria
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredResponses.map((response) => (
                    <ResponseCard key={response.id} response={response} />
                  ))}
                </div>
              )}
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};