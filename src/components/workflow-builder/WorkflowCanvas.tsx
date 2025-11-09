import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useBuilder } from '@/contexts/BuilderContext';
import { UniversalElement, WorkflowElement } from '@/types/universalBuilder';
import { Plus, Trash2, Copy, GripVertical, ChevronDown, ChevronUp } from 'lucide-react';
import { workflowElementTypes } from '@/config/elementTypes';
import { getIconComponent } from '@/lib/iconHelper';
import { TriggerConditionBuilder } from '../universal-builder/TriggerConditionBuilder';

interface WorkflowCanvasProps {
  onAddElement: (elementType: string) => void;
}

export function WorkflowCanvas({ onAddElement }: WorkflowCanvasProps) {
  const { state, dispatch } = useBuilder();
  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);

  const handleDeleteElement = (elementId: string) => {
    dispatch({ type: 'DELETE_ELEMENT', payload: elementId });
  };

  const handleDuplicateElement = (element: any) => {
    const newElement = {
      ...element,
      id: crypto.randomUUID(),
      title: `${element.title} (Copy)`
    };
    dispatch({ type: 'ADD_ELEMENT', payload: newElement });
  };

  const handleSelectElement = (elementId: string) => {
    dispatch({ type: 'SELECT_ELEMENT', payload: elementId });
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(state.config.elements.filter(el => el.type !== 'trigger'));
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

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

  const getWorkflowActions = () => {
    return workflowElementTypes.filter(type => type.type !== 'trigger');
  };

  const handleAddAction = (actionType: string, popoverId: string) => {
    onAddElement(actionType);
    setOpenPopoverId(null);
  };

  const getTriggerSummary = (trigger: WorkflowElement): string => {
    const conditionGroups = (trigger as any).conditionGroups || (trigger.config as any)?.conditionGroups || [];
    
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
    const elementTypeConfig = workflowElementTypes.find(t => t.type === element.type);
    const Icon = elementTypeConfig ? getIconComponent(elementTypeConfig.icon) : null;
    const isSelected = state.selectedElementId === element.id;
    
    return (
      <div className="flex flex-col items-center">
        {index > 0 && (
          <div className="w-px h-8 bg-border mb-4"></div>
        )}
        
        <Card 
          className={`w-full max-w-2xl cursor-pointer transition-all duration-200 group ${
            isSelected 
              ? 'ring-2 ring-primary border-primary shadow-lg' 
              : 'hover:border-primary/50 hover:shadow-md'
          } ${isDragging ? 'shadow-2xl rotate-1' : ''}`}
          onClick={() => handleSelectElement(element.id)}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors">
                <GripVertical className="w-5 h-5" />
              </div>

              {Icon && (
                <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
              )}
              
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
                
                <div className="text-xs text-muted-foreground mt-1">
                  {element.config.subject && (
                    <span>Subject: "{element.config.subject}"</span>
                  )}
                  {element.config.waitTime && (
                    <span>{element.config.waitTime.value} {element.config.waitTime.unit}</span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDuplicateElement(element);
                  }}
                  className="h-8 w-8 p-0"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteElement(element.id);
                  }}
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
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
            <PopoverContent className="w-80 p-2" align="center">
              <div className="space-y-1 max-h-96 overflow-y-auto">
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground sticky top-0 bg-popover">
                  Add Action
                </div>
                {getWorkflowActions().map((action) => {
                  const ActionIcon = getIconComponent(action.icon);
                  return (
                    <Button
                      key={action.type}
                      variant="ghost"
                      className="w-full justify-start h-auto py-3 px-3 hover:bg-accent"
                      onClick={() => handleAddAction(action.type, `element-${index}`)}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                          {ActionIcon && <ActionIcon className="w-4 h-4 text-primary" />}
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
        <div className="text-center space-y-6 max-w-md">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <Plus className="w-8 h-8 text-primary" />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">
              Start building your workflow
            </h3>
            <p className="text-muted-foreground">
              Add a trigger to define when this workflow should start, then add actions to automate your processes
            </p>
          </div>
          
          <div className="flex gap-3 justify-center">
            <Button 
              onClick={() => onAddElement('trigger')}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Trigger
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto bg-muted/20">
      <div className="p-8">
        <div className="text-center mb-8">
          <h2 className="text-lg font-semibold mb-2">
            Start this workflow when one of these events occurs
          </h2>
          
          <div className="space-y-6 mb-6">
            {state.config.elements.filter(el => el.type === 'trigger').map((trigger: any) => {
              const summary = getTriggerSummary(trigger);
              const conditionCount = trigger.conditionGroups?.[0]?.conditions?.length || 
                                   trigger.config?.conditionGroups?.[0]?.conditions?.length || 0;
              const isSelected = state.selectedElementId === trigger.id;
              
              return (
                <div key={trigger.id} className="max-w-3xl mx-auto">
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
                            conditionGroups={trigger.conditionGroups || trigger.config?.conditionGroups || []}
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
          </div>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="workflow-actions">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-0"
              >
                {state.config.elements
                  .filter(el => el.type !== 'trigger')
                  .map((element, index) => (
                    <Draggable key={element.id} draggableId={element.id} index={index}>
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
      </div>
    </div>
  );
}
