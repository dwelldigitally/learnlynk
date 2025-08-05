import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBuilder } from '@/contexts/BuilderContext';
import { ElementRenderer } from './ElementRenderer';

export function PreviewPanel() {
  const { state } = useBuilder();

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Preview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {state.config.elements.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No elements to preview. Add some elements to see the preview.
          </div>
        ) : (
          state.config.elements.map((element) => (
            <div key={element.id} className="border rounded-lg p-4">
              <ElementRenderer element={element} isPreview={false} />
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}