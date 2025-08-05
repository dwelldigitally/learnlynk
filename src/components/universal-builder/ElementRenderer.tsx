import React from 'react';
import { UniversalElement, FormElement, WorkflowElement, CampaignElement } from '@/types/universalBuilder';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, MessageSquare, Clock, Zap, GitBranch, Play, Timer } from 'lucide-react';

interface ElementRendererProps {
  element: UniversalElement;
  isPreview?: boolean;
  value?: any;
  onChange?: (value: any) => void;
}

export function ElementRenderer({ element, isPreview = false, value, onChange }: ElementRendererProps) {
  if (element.elementType === 'form') {
    return <FormElementRenderer element={element as FormElement} isPreview={isPreview} value={value} onChange={onChange} />;
  }
  
  if (element.elementType === 'workflow') {
    return <WorkflowElementRenderer element={element as WorkflowElement} isPreview={isPreview} />;
  }
  
  if (element.elementType === 'campaign') {
    return <CampaignElementRenderer element={element as CampaignElement} isPreview={isPreview} />;
  }

  return <div>Unknown element type</div>;
}

function FormElementRenderer({ element, isPreview, value, onChange }: {
  element: FormElement;
  isPreview: boolean;
  value?: any;
  onChange?: (value: any) => void;
}) {
  const handleChange = (newValue: any) => {
    if (onChange) {
      onChange(newValue);
    }
  };

  if (isPreview) {
    return (
      <div className="space-y-2">
        <div className="text-sm text-muted-foreground">
          {element.description && <p>{element.description}</p>}
        </div>
        <div className="text-xs text-muted-foreground">
          Label: {element.label} • Type: {element.type} • Required: {element.required ? 'Yes' : 'No'}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">
        {element.label}
        {element.required && <span className="text-destructive ml-1">*</span>}
      </Label>
      
      {element.type === 'text' && (
        <Input
          placeholder={element.placeholder}
          value={value || ''}
          onChange={(e) => handleChange(e.target.value)}
        />
      )}
      
      {element.type === 'email' && (
        <Input
          type="email"
          placeholder={element.placeholder}
          value={value || ''}
          onChange={(e) => handleChange(e.target.value)}
        />
      )}
      
      {element.type === 'textarea' && (
        <Textarea
          placeholder={element.placeholder}
          rows={element.config.rows || 4}
          value={value || ''}
          onChange={(e) => handleChange(e.target.value)}
        />
      )}
      
      {element.type === 'select' && (
        <Select value={value} onValueChange={handleChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            {element.options?.map((option, index) => (
              <SelectItem key={index} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      
      {element.type === 'checkbox' && (
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={value || false}
            onCheckedChange={handleChange}
          />
          <Label className="text-sm">{element.label}</Label>
        </div>
      )}
      
      {element.type === 'radio' && element.options && (
        <RadioGroup value={value} onValueChange={handleChange}>
          {element.options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem value={option.value} />
              <Label className="text-sm">{option.label}</Label>
            </div>
          ))}
        </RadioGroup>
      )}
    </div>
  );
}

function WorkflowElementRenderer({ element, isPreview }: {
  element: WorkflowElement;
  isPreview: boolean;
}) {
  const getIcon = () => {
    switch (element.type) {
      case 'trigger':
        return <Zap className="h-4 w-4" />;
      case 'condition':
        return <GitBranch className="h-4 w-4" />;
      case 'action':
        return <Play className="h-4 w-4" />;
      case 'delay':
        return <Clock className="h-4 w-4" />;
      default:
        return <div className="h-4 w-4" />;
    }
  };

  const getDescription = () => {
    switch (element.type) {
      case 'trigger':
        return `Trigger: ${element.triggerType || 'Not configured'}`;
      case 'condition':
        return `If ${element.config.field || 'field'} ${element.config.operator || '='} ${element.config.value || 'value'}`;
      case 'action':
        return `Action: ${element.actionType || 'Not configured'}`;
      case 'delay':
        return `Wait ${element.delay?.value || 0} ${element.delay?.unit || 'hours'}`;
      default:
        return element.description || 'No description';
    }
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-accent/20 rounded-lg">
      <div className="flex-shrink-0">
        {getIcon()}
      </div>
      <div className="flex-1">
        <div className="text-sm font-medium">{element.title}</div>
        <div className="text-xs text-muted-foreground">{getDescription()}</div>
      </div>
    </div>
  );
}

function CampaignElementRenderer({ element, isPreview }: {
  element: CampaignElement;
  isPreview: boolean;
}) {
  const getIcon = () => {
    switch (element.type) {
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'sms':
        return <MessageSquare className="h-4 w-4" />;
      case 'wait':
        return <Timer className="h-4 w-4" />;
      case 'condition':
        return <GitBranch className="h-4 w-4" />;
      default:
        return <div className="h-4 w-4" />;
    }
  };

  const getDescription = () => {
    switch (element.type) {
      case 'email':
        return `Subject: ${element.subject || 'No subject'}`;
      case 'sms':
        return `Message: ${element.content?.substring(0, 50) || 'No content'}...`;
      case 'wait':
        return `Wait ${element.waitTime?.value || 0} ${element.waitTime?.unit || 'days'}`;
      case 'condition':
        return `If ${element.config.field || 'field'} ${element.config.operator || '='} ${element.config.value || 'value'}`;
      default:
        return element.description || 'No description';
    }
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-accent/20 rounded-lg">
      <div className="flex-shrink-0">
        {getIcon()}
      </div>
      <div className="flex-1">
        <div className="text-sm font-medium">{element.title}</div>
        <div className="text-xs text-muted-foreground">{getDescription()}</div>
      </div>
    </div>
  );
}