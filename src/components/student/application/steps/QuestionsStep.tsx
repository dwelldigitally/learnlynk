import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, Clock } from "lucide-react";

interface ProgramQuestion {
  id: string;
  question: string;
  type: 'text' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'rating';
  required: boolean;
  category: 'motivation' | 'academic' | 'career' | 'personal' | 'program_specific';
  options?: string[];
  placeholder?: string;
  maxLength?: number;
  helpText?: string;
}

interface QuestionsData {
  responses?: { [questionId: string]: any };
}

interface QuestionsStepProps {
  data: QuestionsData;
  onUpdate: (data: QuestionsData) => void;
}

const QuestionsStep: React.FC<QuestionsStepProps> = ({ data, onUpdate }) => {
  const [formData, setFormData] = useState<QuestionsData>({
    responses: {},
    ...data
  });

  // Predefined program questions
  const programQuestions: ProgramQuestion[] = [
    {
      id: 'why_program',
      question: 'Why are you interested in this specific program?',
      type: 'textarea',
      required: true,
      category: 'motivation',
      maxLength: 500,
      helpText: 'Explain what attracts you to this program and how it aligns with your goals.'
    },
    {
      id: 'career_goals',
      question: 'What are your short-term and long-term career goals?',
      type: 'textarea',
      required: true,
      category: 'career',
      maxLength: 400,
      helpText: 'Describe your career aspirations for the next 5-10 years.'
    },
    {
      id: 'relevant_experience',
      question: 'How has your previous experience prepared you for this program?',
      type: 'textarea',
      required: true,
      category: 'academic',
      maxLength: 400
    },
    {
      id: 'contribution',
      question: 'How do you plan to contribute to the program community?',
      type: 'textarea',
      required: true,
      category: 'program_specific',
      maxLength: 300
    },
    {
      id: 'learning_style',
      question: 'What is your preferred learning style?',
      type: 'radio',
      required: true,
      category: 'academic',
      options: ['Visual', 'Auditory', 'Kinesthetic', 'Reading/Writing', 'Multimodal']
    },
    {
      id: 'study_mode',
      question: 'Which study mode do you prefer?',
      type: 'select',
      required: true,
      category: 'program_specific',
      options: ['Full-time', 'Part-time', 'Online', 'Hybrid', 'Flexible']
    },
    {
      id: 'challenges_overcome',
      question: 'Describe a significant challenge you have overcome.',
      type: 'textarea',
      required: false,
      category: 'personal',
      maxLength: 350,
      helpText: 'This helps us understand your resilience and problem-solving abilities.'
    },
    {
      id: 'research_interests',
      question: 'What areas of research or specialization interest you most?',
      type: 'checkbox',
      required: false,
      category: 'academic',
      options: ['Data Science', 'Artificial Intelligence', 'Business Strategy', 'Marketing', 'Finance', 'Operations', 'Human Resources', 'Technology Management', 'Sustainability', 'Innovation']
    },
    {
      id: 'program_rating',
      question: 'How would you rate your preparedness for this program?',
      type: 'rating',
      required: true,
      category: 'academic',
      helpText: 'Rate yourself on a scale of 1-5 (1 = Not prepared, 5 = Very well prepared)'
    },
    {
      id: 'additional_info',
      question: 'Is there anything else you would like us to know about your application?',
      type: 'textarea',
      required: false,
      category: 'personal',
      maxLength: 300,
      placeholder: 'Optional: Share any additional information that might be relevant to your application...'
    }
  ];

  useEffect(() => {
    onUpdate(formData);
  }, [formData, onUpdate]);

  const updateResponse = (questionId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      responses: {
        ...prev.responses,
        [questionId]: value
      }
    }));
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'motivation':
        return 'bg-blue-100 text-blue-800';
      case 'academic':
        return 'bg-green-100 text-green-800';
      case 'career':
        return 'bg-purple-100 text-purple-800';
      case 'personal':
        return 'bg-orange-100 text-orange-800';
      case 'program_specific':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'motivation':
        return 'Motivation';
      case 'academic':
        return 'Academic';
      case 'career':
        return 'Career';
      case 'personal':
        return 'Personal';
      case 'program_specific':
        return 'Program Specific';
      default:
        return 'General';
    }
  };

  const getWordCount = (text: string) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const renderQuestion = (question: ProgramQuestion) => {
    const response = formData.responses?.[question.id];

    const renderInput = () => {
      switch (question.type) {
        case 'text':
          return (
            <Input
              value={response || ''}
              onChange={(e) => updateResponse(question.id, e.target.value)}
              placeholder={question.placeholder}
              required={question.required}
            />
          );

        case 'textarea':
          const wordCount = response ? getWordCount(response) : 0;
          const isOverLimit = question.maxLength && wordCount > question.maxLength;
          
          return (
            <div className="space-y-2">
              <Textarea
                value={response || ''}
                onChange={(e) => updateResponse(question.id, e.target.value)}
                placeholder={question.placeholder}
                rows={4}
                required={question.required}
                className={isOverLimit ? 'border-destructive' : ''}
              />
              {question.maxLength && (
                <div className={`text-sm flex justify-between ${isOverLimit ? 'text-destructive' : 'text-muted-foreground'}`}>
                  <span>Words: {wordCount} / {question.maxLength}</span>
                  {isOverLimit && <span>Exceeds word limit</span>}
                </div>
              )}
            </div>
          );

        case 'select':
          return (
            <Select value={response || ''} onValueChange={(value) => updateResponse(question.id, value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {question.options?.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );

        case 'radio':
          return (
            <RadioGroup
              value={response || ''}
              onValueChange={(value) => updateResponse(question.id, value)}
            >
              {question.options?.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`${question.id}-${option}`} />
                  <Label htmlFor={`${question.id}-${option}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          );

        case 'checkbox':
          const selectedOptions = response || [];
          return (
            <div className="space-y-2">
              {question.options?.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${question.id}-${option}`}
                    checked={selectedOptions.includes(option)}
                    onCheckedChange={(checked) => {
                      const newSelection = checked
                        ? [...selectedOptions, option]
                        : selectedOptions.filter((item: string) => item !== option);
                      updateResponse(question.id, newSelection);
                    }}
                  />
                  <Label htmlFor={`${question.id}-${option}`}>{option}</Label>
                </div>
              ))}
            </div>
          );

        case 'rating':
          return (
            <RadioGroup
              value={response || ''}
              onValueChange={(value) => updateResponse(question.id, value)}
              className="flex space-x-4"
            >
              {[1, 2, 3, 4, 5].map((rating) => (
                <div key={rating} className="flex items-center space-x-1">
                  <RadioGroupItem value={rating.toString()} id={`${question.id}-${rating}`} />
                  <Label htmlFor={`${question.id}-${rating}`}>{rating}</Label>
                </div>
              ))}
            </RadioGroup>
          );

        default:
          return null;
      }
    };

    return (
      <Card key={question.id} className="p-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge className={getCategoryColor(question.category)}>
                  {getCategoryLabel(question.category)}
                </Badge>
                {question.required && (
                  <Badge variant="destructive" className="text-xs">Required</Badge>
                )}
              </div>
              <Label className="text-base font-medium">
                {question.question}
              </Label>
            </div>
          </div>

          {question.helpText && (
            <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <HelpCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-blue-700">{question.helpText}</p>
            </div>
          )}

          {renderInput()}
        </div>
      </Card>
    );
  };

  // Group questions by category
  const questionsByCategory = programQuestions.reduce((acc, question) => {
    if (!acc[question.category]) {
      acc[question.category] = [];
    }
    acc[question.category].push(question);
    return acc;
  }, {} as Record<string, ProgramQuestion[]>);

  const completedQuestions = programQuestions.filter(q => {
    const response = formData.responses?.[q.id];
    if (q.required) {
      return response && response !== '' && (Array.isArray(response) ? response.length > 0 : true);
    }
    return true;
  }).length;

  const requiredQuestions = programQuestions.filter(q => q.required).length;
  const totalQuestions = programQuestions.length;

  return (
    <div className="space-y-6">
      {/* Progress Summary */}
      <Card className="p-6 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-lg font-semibold">Application Questions</h4>
            <p className="text-muted-foreground">
              Please answer the following questions to help us understand your motivations and qualifications.
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">
              {completedQuestions} / {totalQuestions}
            </div>
            <div className="text-sm text-muted-foreground">
              {requiredQuestions} required
            </div>
          </div>
        </div>
      </Card>

      {/* Questions by Category */}
      {Object.entries(questionsByCategory).map(([category, questions]) => (
        <div key={category} className="space-y-4">
          <div className="flex items-center gap-2">
            <h5 className="text-lg font-semibold capitalize">
              {getCategoryLabel(category)} Questions
            </h5>
            <Badge className={getCategoryColor(category)}>
              {questions.length} question{questions.length !== 1 ? 's' : ''}
            </Badge>
          </div>
          
          <div className="space-y-4">
            {questions.map(renderQuestion)}
          </div>
        </div>
      ))}

      {/* Completion Tips */}
      <Card className="p-6 bg-yellow-50 border-yellow-200">
        <div className="flex items-start gap-2">
          <Clock className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-yellow-900 mb-2">Tips for Success</h4>
            <div className="space-y-1 text-sm text-yellow-800">
              <p>• Take your time to thoughtfully answer each question</p>
              <p>• Be specific and provide concrete examples where possible</p>
              <p>• Review your answers before proceeding to the next step</p>
              <p>• Your responses help us understand if you're a good fit for the program</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default QuestionsStep;