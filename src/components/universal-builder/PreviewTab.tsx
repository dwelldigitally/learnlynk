import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useBuilder } from '@/contexts/BuilderContext';
import { Eye, Mail, Clock, Zap, CheckCircle2, AlertCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export function PreviewTab() {
  const { state } = useBuilder();
  const elements = state.config.elements || [];

  const getElementIcon = (type: string) => {
    switch (type) {
      case 'email':
        return Mail;
      case 'wait':
        return Clock;
      case 'trigger':
        return Zap;
      default:
        return CheckCircle2;
    }
  };

  const getElementColor = (type: string) => {
    switch (type) {
      case 'email':
        return 'text-blue-500 bg-blue-500/10';
      case 'wait':
        return 'text-orange-500 bg-orange-500/10';
      case 'trigger':
        return 'text-green-500 bg-green-500/10';
      default:
        return 'text-purple-500 bg-purple-500/10';
    }
  };

  return (
    <div className="h-full w-full bg-muted/30">
      <div className="max-w-5xl mx-auto p-8 space-y-6">
        {/* Header Section */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Eye className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Campaign Preview</h2>
              <p className="text-muted-foreground">Review your campaign flow and steps</p>
            </div>
          </div>
        </div>

        {/* Campaign Summary */}
        <Card className="border-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{state.config.name || 'Untitled Campaign'}</CardTitle>
                <CardDescription className="mt-2">
                  {state.config.description || 'No description provided'}
                </CardDescription>
              </div>
              <Badge variant="secondary" className="text-base px-4 py-2">
                {elements.length} {elements.length === 1 ? 'Step' : 'Steps'}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Campaign Steps */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Campaign Flow
            </CardTitle>
            <CardDescription>The sequence of actions in your campaign</CardDescription>
          </CardHeader>
          <CardContent>
            {elements.length === 0 ? (
              <div className="text-center py-16 border-2 border-dashed rounded-lg">
                <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground font-medium">No steps added yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Go to the Build tab to add steps to your campaign
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {elements.map((element, index) => {
                  const Icon = getElementIcon(element.type);
                  const colorClass = getElementColor(element.type);
                  
                  return (
                    <div key={element.id}>
                      <div className="flex gap-4 items-start">
                        {/* Step Number */}
                        <div className="flex flex-col items-center">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                            {index + 1}
                          </div>
                          {index < elements.length - 1 && (
                            <div className="w-0.5 h-16 bg-border my-2" />
                          )}
                        </div>

                        {/* Step Content */}
                        <div className="flex-1 pb-4">
                          <Card>
                            <CardContent className="p-4">
                              <div className="flex items-start gap-3">
                                <div className={`p-2 rounded-lg ${colorClass}`}>
                                  <Icon className="h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-semibold">{element.title}</h4>
                                    <Badge variant="outline" className="text-xs">
                                      {element.type}
                                    </Badge>
                                  </div>
                                  {element.description && (
                                    <p className="text-sm text-muted-foreground">
                                      {element.description}
                                    </p>
                                  )}
                                  {element.config && Object.keys(element.config).length > 0 && (
                                    <div className="mt-3 p-3 bg-muted/50 rounded-md">
                                      <p className="text-xs font-medium text-muted-foreground mb-2">Configuration:</p>
                                      <div className="space-y-1">
                                        {Object.entries(element.config).map(([key, value]) => (
                                          <div key={key} className="text-xs flex gap-2">
                                            <span className="text-muted-foreground">{key}:</span>
                                            <span className="font-medium">{String(value)}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Campaign Settings Preview */}
        {state.config.type === 'campaign' && state.config.settings && (
          <Card>
            <CardHeader>
              <CardTitle>Schedule & Settings</CardTitle>
              <CardDescription>Campaign timing and configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {state.config.settings.frequency && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Frequency</p>
                    <p className="font-medium capitalize">{state.config.settings.frequency}</p>
                  </div>
                )}
                {state.config.settings.startDateTime && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Start Date</p>
                    <p className="font-medium">
                      {new Date(state.config.settings.startDateTime).toLocaleString()}
                    </p>
                  </div>
                )}
                {state.config.settings.recurrence && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Recurrence</p>
                    <p className="font-medium capitalize">{state.config.settings.recurrence}</p>
                  </div>
                )}
                {state.config.settings.endDateTime && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">End Date</p>
                    <p className="font-medium">
                      {new Date(state.config.settings.endDateTime).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
              
              {(state.config.settings.autoActivate || state.config.settings.sendTest) && (
                <>
                  <Separator />
                  <div className="flex gap-2">
                    {state.config.settings.autoActivate && (
                      <Badge variant="secondary">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Auto-activate enabled
                      </Badge>
                    )}
                    {state.config.settings.sendTest && (
                      <Badge variant="secondary">
                        <Mail className="h-3 w-3 mr-1" />
                        Test email enabled
                      </Badge>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
