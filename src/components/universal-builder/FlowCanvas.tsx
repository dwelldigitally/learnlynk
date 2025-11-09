import React, { useState, useRef } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useBuilder } from '@/contexts/BuilderContext';
import { UniversalElement, CampaignElement } from '@/types/universalBuilder';
import { Plus, Trash2, Mail, Clock, MessageSquare, ChevronDown, ChevronUp, GitBranch, Split, GripVertical, UserCog, UserCheck, Bell, Target, LogOut, Copy, CheckSquare, Eye, Send } from 'lucide-react';
import { getElementTypesForBuilder } from '@/config/elementTypes';
import { TriggerConditionBuilder } from './TriggerConditionBuilder';
import { MiniMap } from './MiniMap';

interface FlowCanvasProps {
  onAddElement: (elementType: string) => void;
}

export function FlowCanvas({ onAddElement }: FlowCanvasProps) {
  const { state, dispatch } = useBuilder();
  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleDeleteElement = (elementId: string) => {
    dispatch({ type: 'DELETE_ELEMENT', payload: elementId });
  };

  const handleSelectElement = (elementId: string) => {
    dispatch({ type: 'SELECT_ELEMENT', payload: elementId });
  };

  const getElementIcon = (elementType: string) => {
    switch (elementType) {
      case 'email':
        return Mail;
      case 'sms':
        return MessageSquare;
      case 'wait':
        return Clock;
      case 'condition':
        return GitBranch;
      case 'split':
        return Split;
      case 'update-lead':
        return UserCog;
      case 'assign-advisor':
        return UserCheck;
      case 'internal-notification':
        return Bell;
      case 'goal-tracking':
        return Target;
      case 'remove-from-campaign':
        return LogOut;
      case 'copy-to-campaign':
        return Copy;
      case 'create-task':
        return CheckSquare;
      default:
        return Mail;
    }
  };

  const getCampaignActions = () => {
    const elementTypes = getElementTypesForBuilder('campaign');
    return elementTypes.filter(type => type.type !== 'trigger');
  };

  const handleAddAction = (actionType: string, popoverId: string) => {
    onAddElement(actionType);
    setOpenPopoverId(null);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(state.config.elements.filter(el => el.type !== 'trigger'));
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Combine triggers with reordered elements
    const triggers = state.config.elements.filter(el => el.type === 'trigger');
    const reorderedElements = [...triggers, ...items];

    dispatch({
      type: 'SET_CONFIG',
      payload: {
        ...state.config,
        elements: reorderedElements
      }
    });
  };

  const getTriggerSummary = (trigger: CampaignElement): string => {
    const conditionGroups = trigger.conditionGroups || trigger.config?.conditionGroups || [];
    
    if (conditionGroups.length === 0 || !conditionGroups[0]?.conditions || conditionGroups[0].conditions.length === 0) {
      return 'No conditions set';
    }

    const conditions = conditionGroups[0].conditions;
    
    if (conditions.length === 1) {
      const cond = conditions[0];
      const value = Array.isArray(cond.value) ? cond.value.join(', ') : cond.value;
      return `${cond.field} ${cond.operator} ${value}`;
    }
    
    if (conditions.length === 2) {
      const operator = conditionGroups[0].operator;
      return `${conditions[0].field} ${operator} ${conditions[1].field}`;
    }
    
    return `${conditions.length} conditions defined`;
  };


  const renderFlowElement = (element: UniversalElement, index: number, isDragging: boolean = false) => {
    const Icon = getElementIcon(element.type);
    const isSelected = state.selectedElementId === element.id;
    
    return (
      <div className="flex flex-col items-center">
        {/* Connection line from previous element */}
        {index > 0 && (
          <div className="w-px h-8 bg-border mb-4"></div>
        )}
        
        {/* Element Card */}
        <Card 
          className={`w-80 cursor-pointer transition-all duration-200 group ${
            isSelected 
              ? 'ring-2 ring-primary border-primary shadow-lg' 
              : 'hover:border-primary/50 hover:shadow-md'
          } ${isDragging ? 'shadow-2xl rotate-2' : ''}`}
          onClick={() => handleSelectElement(element.id)}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              {/* Drag Handle */}
              <div className="flex-shrink-0 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors">
                <GripVertical className="w-5 h-5" />
              </div>

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
                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive transition-opacity"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Add button between elements */}
        <div className="my-4 flex justify-center">
          <Popover 
            open={openPopoverId === `element-${index}`} 
            onOpenChange={(open) => setOpenPopoverId(open ? `element-${index}` : null)}
          >
            <PopoverTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="rounded-full w-10 h-10 p-0 border-dashed hover:border-solid hover:bg-primary/10 transition-all"
              >
                <Plus className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-2" align="center">
              <div className="space-y-1">
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                  Add Action
                </div>
                {getCampaignActions().map((action) => {
                  const ActionIcon = getElementIcon(action.type);
                  return (
                    <Button
                      key={action.type}
                      variant="ghost"
                      className="w-full justify-start h-auto py-3 px-3 hover:bg-accent"
                      onClick={() => handleAddAction(action.type, `element-${index}`)}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                          <ActionIcon className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="font-medium text-sm">{action.label}</div>
                          <div className="text-xs text-muted-foreground">
                            {action.category}
                          </div>
                        </div>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    );
  };

  if (state.config.elements.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[500px] p-8">
        <div className="text-center space-y-6">
          <Popover 
            open={openPopoverId === 'empty-state'} 
            onOpenChange={(open) => setOpenPopoverId(open ? 'empty-state' : null)}
          >
            <PopoverTrigger asChild>
              <button className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto hover:bg-primary/20 transition-all cursor-pointer hover:scale-110">
                <Plus className="w-8 h-8 text-primary" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-2" align="center">
              <div className="space-y-1">
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                  Add First Action
                </div>
                <Button
                  variant="ghost"
                  className="w-full justify-start h-auto py-3 px-3 hover:bg-accent"
                  onClick={() => {
                    onAddElement('trigger');
                    setOpenPopoverId(null);
                  }}
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Plus className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium text-sm">Trigger</div>
                      <div className="text-xs text-muted-foreground">
                        Start your campaign
                      </div>
                    </div>
                  </div>
                </Button>
                {getCampaignActions().map((action) => {
                  const ActionIcon = getElementIcon(action.type);
                  return (
                    <Button
                      key={action.type}
                      variant="ghost"
                      className="w-full justify-start h-auto py-3 px-3 hover:bg-accent"
                      onClick={() => handleAddAction(action.type, 'empty-state')}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                          <ActionIcon className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="font-medium text-sm">{action.label}</div>
                          <div className="text-xs text-muted-foreground">
                            {action.category}
                          </div>
                        </div>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </PopoverContent>
          </Popover>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">
              Start this {state.config.type} when one of these actions takes place
            </h3>
            <p className="text-muted-foreground">
              Begin by adding a trigger to start your {state.config.type}
            </p>
          </div>
          
          <div className="flex gap-3 justify-center">
            <Button 
              onClick={() => onAddElement('trigger')}
              className="flex items-center gap-2"
            >
              Add Trigger
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={scrollContainerRef} className="h-full overflow-auto relative">
      <MiniMap containerRef={scrollContainerRef} />
      <div className="p-8">
        {/* Flow Header */}
        <div className="text-center mb-8">
          <h2 className="text-lg font-semibold mb-2">
            Start this {state.config.type} when one of these actions takes place
          </h2>
          
          {/* Trigger buttons and expanded condition builder */}
          <div className="space-y-6 mb-6">
            {state.config.elements.filter(el => el.type === 'trigger').map((trigger) => {
              const campaignTrigger = trigger as CampaignElement;
              const summary = getTriggerSummary(campaignTrigger);
              const conditionCount = campaignTrigger.conditionGroups?.[0]?.conditions?.length || 
                                   campaignTrigger.config?.conditionGroups?.[0]?.conditions?.length || 0;
              const isSelected = state.selectedElementId === trigger.id;
              
              return (
                <div key={trigger.id} className="max-w-3xl mx-auto">
                  {/* Trigger Button */}
                  <Button 
                    variant={isSelected ? "default" : "outline"}
                    onClick={() => handleSelectElement(trigger.id)}
                    className="w-full flex items-center justify-between gap-2 h-auto py-3 px-4"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{trigger.title}</span>
                      {conditionCount > 0 && (
                        <Badge variant="secondary" className="ml-1">
                          {conditionCount} condition{conditionCount !== 1 ? 's' : ''}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm opacity-70">{summary}</span>
                      {isSelected ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </div>
                  </Button>

                  {/* Expanded Condition Builder */}
                  {isSelected && (
                    <Card className="mt-2 border-2">
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">Configure Trigger Conditions</h3>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteElement(trigger.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Trigger
                            </Button>
                          </div>
                          
                          <TriggerConditionBuilder
                            conditionGroups={campaignTrigger.conditionGroups || campaignTrigger.config?.conditionGroups || []}
                            onChange={(groups) => {
                              dispatch({
                                type: 'UPDATE_ELEMENT',
                                payload: {
                                  id: trigger.id,
                                  updates: {
                                    conditionGroups: groups,
                                    config: { ...trigger.config, conditionGroups: groups }
                                  }
                                }
                              });
                            }}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              );
            })}

            {/* Add Action Button */}
            <div className="max-w-3xl mx-auto flex justify-center mt-8">
              <Popover 
                open={openPopoverId === 'add-after-triggers'} 
                onOpenChange={(open) => setOpenPopoverId(open ? 'add-after-triggers' : null)}
              >
                <PopoverTrigger asChild>
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full w-12 h-12 p-0 border-dashed hover:border-solid hover:bg-primary/10 transition-all"
                  >
                    <Plus className="h-6 w-6" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-72 p-2" align="center">
                  <div className="space-y-1">
                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                      Add Action
                    </div>
                    {getCampaignActions().map((action) => {
                      const ActionIcon = getElementIcon(action.type);
                      return (
                        <Button
                          key={action.type}
                          variant="ghost"
                          className="w-full justify-start h-auto py-3 px-3 hover:bg-accent"
                          onClick={() => handleAddAction(action.type, 'add-after-triggers')}
                        >
                          <div className="flex items-center gap-3 w-full">
                            <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                              <ActionIcon className="w-4 h-4 text-primary" />
                            </div>
                            <div className="flex-1 text-left">
                              <div className="font-medium text-sm">{action.label}</div>
                              <div className="text-xs text-muted-foreground">
                                {action.category}
                              </div>
                            </div>
                          </div>
                        </Button>
                      );
                    })}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        {/* Flow Steps with Drag and Drop */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="campaign-flow">
            {(provided, snapshot) => (
              <div 
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="flex flex-col items-center space-y-0"
              >
                {state.config.elements
                  .filter(el => el.type !== 'trigger')
                  .map((element, index) => (
                    <Draggable 
                      key={element.id} 
                      draggableId={element.id} 
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          {renderFlowElement(element, index, snapshot.isDragging)}
                        </div>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

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