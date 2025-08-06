import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useBuilder } from '@/contexts/BuilderContext';
import { UniversalElement } from '@/types/universalBuilder';
import { Plus, Trash2, Mail, Clock, Eye, Send, MessageSquare, Phone } from 'lucide-react';
import { getElementTypesForBuilder } from '@/config/elementTypes';

interface FlowCanvasProps {
  onAddElement: (elementType: string) => void;
}

export function FlowCanvas({ onAddElement }: FlowCanvasProps) {
  const { state, dispatch } = useBuilder();

  const handleDeleteElement = (elementId: string) => {
    dispatch({ type: 'DELETE_ELEMENT', payload: elementId });
  };

  const handleSelectElement = (elementId: string) => {
    dispatch({ type: 'SELECT_ELEMENT', payload: elementId });
  };

  const getElementIcon = (elementType: string) => {
    switch (elementType) {
      case 'send_email':
      case 'email_campaign':
        return Mail;
      case 'send_site_message':
      case 'send_sms':
      case 'sms_campaign':
        return MessageSquare;
      case 'send_sms':
        return Phone;
      case 'wait':
      case 'wait_and_check':
      case 'wait_and_send':
        return Clock;
      case 'wait_and_check':
        return Eye;
      case 'wait_and_send':
        return Send;
      default:
        return Mail;
    }
  };

  const renderFlowElement = (element: UniversalElement, index: number) => {
    const Icon = getElementIcon(element.type);
    const isSelected = state.selectedElementId === element.id;
    
    return (
      <div key={element.id} className="flex flex-col items-center">
        {/* Connection line from previous element */}
        {index > 0 && (
          <div className="w-px h-8 bg-border mb-4"></div>
        )}
        
        {/* Element Card */}
        <Card 
          className={`w-80 cursor-pointer transition-all duration-200 ${
            isSelected 
              ? 'ring-2 ring-primary border-primary shadow-lg' 
              : 'hover:border-primary/50 hover:shadow-md'
          }`}
          onClick={() => handleSelectElement(element.id)}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-sm truncate">{element.title}</h3>
                  {element.config.isDraft && (
                    <Badge variant="secondary" className="text-xs">Draft</Badge>
                  )}
                </div>
                
                {element.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {element.description}
                  </p>
                )}
                
                {/* Show quick config info */}
                <div className="text-xs text-muted-foreground mt-1">
                  {element.config.subject && (
                    <span>Subject: "{element.config.subject}"</span>
                  )}
                  {element.config.delay && (
                    <span>{element.config.delay.value} {element.config.delay.unit}</span>
                  )}
                </div>
              </div>
              
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteElement(element.id);
                }}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Add button between elements */}
        <div className="my-4">
          <Button
            size="sm"
            variant="outline"
            className="rounded-full w-8 h-8 p-0 border-dashed"
            onClick={() => onAddElement(getDefaultElementType(state.config.type))}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  if (state.config.elements.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[500px] p-8">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <Plus className="w-8 h-8 text-primary" />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">
              Start this {state.config.type} when one of these actions takes place
            </h3>
            <p className="text-muted-foreground">
              Begin by adding a trigger to start your {state.config.type}
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button 
              onClick={() => onAddElement('trigger')}
              className="flex items-center gap-2"
            >
              Task is completed
            </Button>
            <Button 
              variant="outline" 
              onClick={() => onAddElement('trigger')}
              className="border-dashed"
            >
              Add a new trigger
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto">
      <div className="p-8">
        {/* Flow Header */}
        <div className="text-center mb-8">
          <h2 className="text-lg font-semibold mb-2">
            Start this {state.config.type} when one of these actions takes place
          </h2>
          
          {/* Trigger buttons */}
          <div className="flex justify-center gap-3 mb-6">
            {state.config.elements.filter(el => el.type === 'trigger').map((trigger) => (
              <Button 
                key={trigger.id}
                variant={state.selectedElementId === trigger.id ? "default" : "outline"}
                onClick={() => handleSelectElement(trigger.id)}
                className="flex items-center gap-2"
              >
                {trigger.title}
              </Button>
            ))}
            <Button 
              variant="outline" 
              onClick={() => onAddElement('trigger')}
              className="border-dashed"
            >
              Add a new trigger
            </Button>
          </div>
        </div>

        {/* Flow Steps */}
        <div className="flex flex-col items-center space-y-0">
          {state.config.elements
            .filter(el => el.type !== 'trigger')
            .map((element, index) => renderFlowElement(element, index))}
        </div>

        {/* Suggested next steps - only show if we have elements */}
        {state.config.elements.length > 0 && (
          <div className="mt-8 max-w-md mx-auto">
            <Card className="border-dashed">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-sm">Suggested next steps</h4>
                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                    ×
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start h-auto p-2"
                    onClick={() => onAddElement('wait')}
                  >
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">Wait for 7 days</span>
                    </div>
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start h-auto p-2"
                    onClick={() => onAddElement('wait_and_check')}
                  >
                    <div className="flex items-center gap-3">
                      <Eye className="w-4 h-4" />
                      <span className="text-sm">Wait for 7 days and check if the email was opened</span>
                    </div>
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start h-auto p-2"
                    onClick={() => onAddElement('wait_and_send')}
                  >
                    <div className="flex items-center gap-3">
                      <Send className="w-4 h-4" />
                      <span className="text-sm">Wait for 7 days and send email</span>
                    </div>
                  </Button>
                </div>
                
                <Button 
                  variant="link" 
                  size="sm" 
                  className="w-full mt-2 text-primary"
                >
                  View all automation actions
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

function getDefaultElementType(builderType: string): string {
  switch (builderType) {
    case 'workflow':
      return 'send_email';
    case 'campaign':
      return 'email_campaign';
    default:
      return 'send_email';
  }
}