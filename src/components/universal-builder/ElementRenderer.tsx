import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UniversalElement, FormElement, WorkflowElement, CampaignElement } from '@/types/universalBuilder';
import { Mail, Clock, MessageSquare, Phone, Eye, Send, Filter, TestTube } from 'lucide-react';

interface ElementRendererProps {
  element: UniversalElement;
  isPreview?: boolean;
  formData?: Record<string, any>;
  onFieldChange?: (fieldId: string, value: any) => void;
}

export function ElementRenderer({ element, isPreview = false, formData = {}, onFieldChange }: ElementRendererProps) {
  if (element.elementType === 'form') {
    return <FormElementRenderer element={element as FormElement} isPreview={isPreview} formData={formData} onFieldChange={onFieldChange} />;
  }
  
  if (element.elementType === 'workflow') {
    return <WorkflowElementRenderer element={element as WorkflowElement} isPreview={isPreview} />;
  }
  
  if (element.elementType === 'campaign') {
    return <CampaignElementRenderer element={element as CampaignElement} isPreview={isPreview} />;
  }

  return <div className="text-muted-foreground text-sm">Unknown element type</div>;
}

function FormElementRenderer({ element, isPreview, formData, onFieldChange }: {
  element: FormElement;
  isPreview: boolean;
  formData: Record<string, any>;
  onFieldChange?: (fieldId: string, value: any) => void;
}) {
  const value = formData[element.id] || '';

  const handleChange = (newValue: any) => {
    if (onFieldChange) {
      onFieldChange(element.id, newValue);
    }
  };

  if (!isPreview) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {element.fieldType}
          </Badge>
          {element.required && (
            <Badge variant="destructive" className="text-xs">
              Required
            </Badge>
          )}
        </div>
        <div className="text-sm text-muted-foreground">
          {element.description || `${element.label} field configuration`}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={element.id} className="text-sm font-medium">
        {element.label}
        {element.required && <span className="text-destructive ml-1">*</span>}
      </Label>
      
      {element.type === 'text' && (
        <Input
          id={element.id}
          placeholder={element.placeholder}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          required={element.required}
        />
      )}
      
      {element.type === 'email' && (
        <Input
          id={element.id}
          type="email"
          placeholder={element.placeholder || 'Enter email address'}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          required={element.required}
        />
      )}
      
      {element.type === 'textarea' && (
        <Textarea
          id={element.id}
          placeholder={element.placeholder}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          required={element.required}
          rows={3}
        />
      )}
      
      {element.type === 'select' && element.options && (
        <Select value={value} onValueChange={handleChange}>
          <SelectTrigger>
            <SelectValue placeholder={element.placeholder || 'Select an option'} />
          </SelectTrigger>
          <SelectContent>
            {element.options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      
      {element.type === 'checkbox' && (
        <div className="flex items-center space-x-2">
          <Checkbox
            id={element.id}
            checked={value === true}
            onCheckedChange={handleChange}
            required={element.required}
          />
          <Label htmlFor={element.id} className="text-sm font-normal">
            {element.placeholder || 'Check this box'}
          </Label>
        </div>
      )}
      
      {element.type === 'radio' && element.options && (
        <RadioGroup value={value} onValueChange={handleChange}>
          {element.options.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem value={option.value} id={`${element.id}-${option.value}`} />
              <Label htmlFor={`${element.id}-${option.value}`} className="text-sm font-normal">
                {option.label}
              </Label>
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
    // Handle actual workflow element types
    if (element.type === 'trigger' || element.triggerType) {
      return null;
    }
    if (element.type === 'condition') {
      return Eye;
    }
    if (element.type === 'action' || element.actionType) {
      return Send;
    }
    if (element.type === 'delay' || element.delay) {
      return Clock;
    }
    if (element.type === 'assignment') {
      return Mail;
    }
    
    // Handle specific action types
    if (element.actionType === 'send_email') return Mail;
    if (element.actionType === 'send_site_message') return MessageSquare;
    if (element.actionType === 'send_sms') return Phone;
    
    return Mail;
  };

  const Icon = getIcon();

  if (!isPreview) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
          <Badge variant="outline" className="text-xs">
            {element.actionType || element.triggerType || element.type}
          </Badge>
        </div>
        <div className="text-sm text-muted-foreground">
          {element.description || `${element.title} configuration`}
        </div>
        {element.conditions && element.conditions.length > 0 && (
          <div className="text-xs text-muted-foreground">
            Conditions: {element.conditions.length} rule(s)
          </div>
        )}
        {element.delay && (
          <div className="text-xs text-muted-foreground">
            Delay: {element.delay.value} {element.delay.unit}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="h-4 w-4 text-primary" />}
        <span className="font-medium text-sm">{element.title}</span>
      </div>
      {element.description && (
        <p className="text-xs text-muted-foreground">{element.description}</p>
      )}
      {element.delay && (
        <div className="text-xs text-muted-foreground">
          ⏱️ Wait {element.delay.value} {element.delay.unit}
        </div>
      )}
    </div>
  );
}

function CampaignElementRenderer({ element, isPreview }: {
  element: CampaignElement;
  isPreview: boolean;
}) {
  const getIcon = () => {
    // Handle actual campaign element types
    if (element.type === 'email') return Mail;
    if (element.type === 'sms') return Phone;
    if (element.type === 'wait') return Clock;
    if (element.type === 'condition') return Filter;
    if (element.type === 'split') return TestTube;
    
    return Mail;
  };

  const Icon = getIcon();

  if (!isPreview) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-muted-foreground" />
          <Badge variant="outline" className="text-xs">
            {element.type}
          </Badge>
        </div>
        <div className="text-sm text-muted-foreground">
          {element.description || `${element.title} configuration`}
        </div>
        {element.subject && (
          <div className="text-xs text-muted-foreground">
            Subject: {element.subject}
          </div>
        )}
        {element.waitTime && (
          <div className="text-xs text-muted-foreground">
            Wait: {element.waitTime.value} {element.waitTime.unit}
          </div>
        )}
      </div>
    );
  }

  return (
    <Card className="border-dashed">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1">
            <div className="font-medium text-sm">{element.title}</div>
            {element.subject && (
              <div className="text-xs text-muted-foreground">"{element.subject}"</div>
            )}
            {element.content && (
              <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {element.content}
              </div>
            )}
            {element.waitTime && (
              <div className="text-xs text-muted-foreground mt-1">
                ⏱️ {element.waitTime.value} {element.waitTime.unit}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}