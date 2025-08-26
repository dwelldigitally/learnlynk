import React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useBuilder } from '@/contexts/BuilderContext';
import { UniversalElement } from '@/types/universalBuilder';
import { JourneyElementRenderer } from './JourneyElementRenderer';
import { Plus, Trash2, Copy, ArrowDown, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface SequentialJourneyCanvasProps {
  onAddElement: (elementType: string) => void;
}

export function SequentialJourneyCanvas({ onAddElement }: SequentialJourneyCanvasProps) {
  const { state, dispatch } = useBuilder();

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    dispatch({
      type: 'REORDER_ELEMENTS',
      payload: {
        oldIndex: result.source.index,
        newIndex: result.destination.index,
      },
    });
  };

  const handleDeleteElement = (elementId: string) => {
    dispatch({ type: 'DELETE_ELEMENT', payload: elementId });
  };

  const handleDuplicateElement = (element: UniversalElement) => {
    const duplicatedElement: UniversalElement = {
      ...element,
      id: `${element.id}-copy-${Date.now()}`,
      title: `${element.title} (Copy)`,
      position: state.config.elements.length,
    };
    dispatch({ type: 'ADD_ELEMENT', payload: duplicatedElement });
  };

  const handleSelectElement = (elementId: string) => {
    dispatch({ type: 'SELECT_ELEMENT', payload: elementId });
  };

  const getStepStatus = (element: UniversalElement, index: number) => {
    // In a real implementation, this would check actual journey execution status
    if (index === 0) return 'current';
    if (index < 2) return 'completed';
    return 'pending';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'current':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'border-green-200 bg-green-50';
      case 'current':
        return 'border-blue-200 bg-blue-50';
      case 'pending':
        return 'border-gray-200 bg-gray-50';
      default:
        return '';
    }
  };

  if (state.config.elements.length === 0) {
    return (
      <Card className="h-full flex items-center justify-center">
        <CardContent className="text-center p-8">
          <div className="space-y-4">
            <div className="text-muted-foreground">
              <Plus className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium">Start Building Your Journey</h3>
              <p className="text-sm">
                Add steps to create a sequential journey for your applicants
              </p>
            </div>
            <Button onClick={() => onAddElement('phone-interview')}>
              Add First Step
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardContent className="p-6">
        {/* Journey Timeline Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Journey Steps</h3>
            <Badge variant="outline" className="text-xs">
              {state.config.elements.length} steps
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Configure the sequential steps for your application journey
          </p>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="journey-canvas" direction="vertical">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`space-y-4 min-h-[400px] ${
                  snapshot.isDraggingOver ? 'bg-accent/20 rounded-lg p-2' : ''
                }`}
              >
                {state.config.elements.map((element, index) => {
                  const status = getStepStatus(element, index);
                  const isSelected = state.selectedElementId === element.id;
                  
                  return (
                    <React.Fragment key={element.id}>
                      <Draggable draggableId={element.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`group relative ${
                              snapshot.isDragging ? 'opacity-50' : ''
                            }`}
                          >
                            <Card
                              className={`transition-all duration-200 cursor-pointer ${
                                isSelected
                                  ? 'ring-2 ring-primary border-primary'
                                  : 'hover:border-primary/50'
                              } ${getStatusColor(status)}`}
                              onClick={() => handleSelectElement(element.id)}
                            >
                              <CardContent className="p-4">
                                {/* Step Header */}
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center gap-3">
                                    {/* Step Number */}
                                    <div className="flex items-center gap-2">
                                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                                        {index + 1}
                                      </div>
                                      {getStatusIcon(status)}
                                    </div>
                                    
                                    {/* Drag Handle */}
                                    <div
                                      {...provided.dragHandleProps}
                                      className="cursor-grab hover:cursor-grabbing p-1 rounded hover:bg-accent"
                                    >
                                      <div className="w-2 h-2 bg-muted-foreground/40 rounded-full mb-1"></div>
                                      <div className="w-2 h-2 bg-muted-foreground/40 rounded-full mb-1"></div>
                                      <div className="w-2 h-2 bg-muted-foreground/40 rounded-full"></div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                      <Badge variant="secondary" className="text-xs">
                                        {element.type.replace('-', ' ')}
                                      </Badge>
                                      <span className="font-medium text-sm">{element.title}</span>
                                    </div>
                                  </div>
                                  
                                  {/* Element Actions */}
                                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDuplicateElement(element);
                                      }}
                                      className="h-7 w-7 p-0"
                                    >
                                      <Copy className="h-3 w-3" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteElement(element.id);
                                      }}
                                      className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>

                                {/* Element Content */}
                                <JourneyElementRenderer element={element} isPreview={true} />

                                {/* Step Metadata */}
                                <div className="mt-3 pt-3 border-t border-border/50">
                                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                    {element.config.duration && (
                                      <span className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {element.config.duration} min
                                      </span>
                                    )}
                                    {element.config.required && (
                                      <Badge variant="outline" className="text-xs">
                                        Required
                                      </Badge>
                                    )}
                                    {element.config.autoAdvance && (
                                      <span className="text-green-600">Auto-advance</span>
                                    )}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        )}
                      </Draggable>
                      
                      {/* Flow Connector Arrow */}
                      {index < state.config.elements.length - 1 && (
                        <div className="flex justify-center py-2">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                            <ArrowDown className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
                {provided.placeholder}
                
                {/* Add Step Button */}
                <div className="flex justify-center pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onAddElement('phone-interview')}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Next Step
                  </Button>
                </div>
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </CardContent>
    </Card>
  );
}