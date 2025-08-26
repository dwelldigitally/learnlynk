import React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useBuilder } from '@/contexts/BuilderContext';
import { UniversalElement } from '@/types/universalBuilder';
import { ElementRenderer } from './ElementRenderer';
import { FlowCanvas } from './FlowCanvas';
import { Plus, Trash2, Copy } from 'lucide-react';

interface CanvasAreaProps {
  onAddElement: (elementType: string) => void;
}

export function CanvasArea({ onAddElement }: CanvasAreaProps) {
  const { state, dispatch } = useBuilder();

  // Use FlowCanvas for workflows and campaigns
  if (state.config.type === 'workflow' || state.config.type === 'campaign') {
    return <FlowCanvas onAddElement={onAddElement} />;
  }

  // Use SequentialJourneyCanvas for journeys
  if (state.config.type === 'journey') {
    const { SequentialJourneyCanvas } = require('@/components/journey-builder/SequentialJourneyCanvas');
    return <SequentialJourneyCanvas onAddElement={onAddElement} />;
  }

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

  if (state.config.elements.length === 0) {
    return (
      <Card className="h-full flex items-center justify-center">
        <CardContent className="text-center p-8">
          <div className="space-y-4">
            <div className="text-muted-foreground">
              <Plus className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium">Start Building</h3>
              <p className="text-sm">
                Drag elements from the palette or click below to add your first element
              </p>
            </div>
            <Button onClick={() => onAddElement(getDefaultElementType(state.config.type))}>
              Add First Element
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="canvas" direction="vertical">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`space-y-4 min-h-[400px] ${
                  snapshot.isDraggingOver ? 'bg-accent/20 rounded-lg p-2' : ''
                }`}
              >
                {state.config.elements.map((element, index) => (
                  <Draggable key={element.id} draggableId={element.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`group relative ${
                          snapshot.isDragging ? 'opacity-50' : ''
                        }`}
                      >
                        <Card
                          className={`transition-all duration-200 ${
                            state.selectedElementId === element.id
                              ? 'ring-2 ring-primary border-primary'
                              : 'hover:border-primary/50'
                          }`}
                          onClick={() => handleSelectElement(element.id)}
                        >
                          <CardContent className="p-4">
                            {/* Element Header */}
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <div
                                  {...provided.dragHandleProps}
                                  className="cursor-grab hover:cursor-grabbing p-1 rounded hover:bg-accent"
                                >
                                  <div className="w-2 h-2 bg-muted-foreground/40 rounded-full mb-1"></div>
                                  <div className="w-2 h-2 bg-muted-foreground/40 rounded-full mb-1"></div>
                                  <div className="w-2 h-2 bg-muted-foreground/40 rounded-full"></div>
                                </div>
                                <Badge variant="secondary" className="text-xs">
                                  {element.type}
                                </Badge>
                                <span className="font-medium text-sm">{element.title}</span>
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

                            {/* Element Preview */}
                            <ElementRenderer element={element} isPreview={true} />
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </CardContent>
    </Card>
  );
}

function getDefaultElementType(builderType: string): string {
  switch (builderType) {
    case 'form':
      return 'text';
    case 'workflow':
      return 'trigger';
    case 'campaign':
      return 'email';
    default:
      return 'text';
  }
}