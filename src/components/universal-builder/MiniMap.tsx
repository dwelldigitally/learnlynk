import React, { useRef, useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Minimize2, Maximize2, X } from 'lucide-react';
import { useBuilder } from '@/contexts/BuilderContext';
import { campaignElementTypes } from '@/config/elementTypes';

interface MiniMapProps {
  containerRef: React.RefObject<HTMLDivElement>;
}

export function MiniMap({ containerRef }: MiniMapProps) {
  const { state } = useBuilder();
  const miniMapRef = useRef<HTMLDivElement>(null);
  const [viewportRect, setViewportRect] = useState({ top: 0, height: 0 });
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const scale = isExpanded ? 0.15 : 0.08;
  const miniMapWidth = isExpanded ? 280 : 200;
  const miniMapHeight = isExpanded ? 400 : 280;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateViewport = () => {
      const containerHeight = container.clientHeight;
      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight;

      const viewportTop = (scrollTop / scrollHeight) * miniMapHeight;
      const viewportHeight = (containerHeight / scrollHeight) * miniMapHeight;

      setViewportRect({
        top: Math.max(0, viewportTop),
        height: Math.min(miniMapHeight - viewportTop, viewportHeight),
      });
    };

    updateViewport();
    container.addEventListener('scroll', updateViewport);
    window.addEventListener('resize', updateViewport);

    return () => {
      container.removeEventListener('scroll', updateViewport);
      window.removeEventListener('resize', updateViewport);
    };
  }, [containerRef, miniMapHeight]);

  const handleMiniMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container || !miniMapRef.current) return;

    const rect = miniMapRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const scrollPercentage = y / miniMapHeight;
    const scrollTop = scrollPercentage * container.scrollHeight;

    container.scrollTo({
      top: scrollTop,
      behavior: 'smooth',
    });
  };

  const getElementIcon = (type: string) => {
    const elementType = campaignElementTypes.find(et => et.type === type);
    return elementType?.icon || '📋';
  };

  if (!isVisible) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="fixed bottom-4 right-4 z-10 shadow-lg"
        onClick={() => setIsVisible(true)}
      >
        Show Mini-map
      </Button>
    );
  }

  return (
    <Card
      className="fixed bottom-4 right-4 z-10 shadow-xl border-2 overflow-hidden"
      style={{ width: miniMapWidth, height: miniMapHeight }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-2 border-b bg-muted/50">
        <span className="text-xs font-medium">Campaign Overview</span>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => setIsVisible(false)}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Mini-map Content */}
      <div
        ref={miniMapRef}
        className="relative bg-background cursor-pointer overflow-hidden"
        style={{ height: miniMapHeight - 40 }}
        onClick={handleMiniMapClick}
      >
        {/* Flow Elements */}
        <div className="p-2 space-y-1">
          {state.config.elements.map((element, index) => {
            const isTrigger = element.type === 'trigger';
            
            return (
              <div
                key={element.id}
                className={`flex items-center gap-1 p-1 rounded text-xs border transition-all ${
                  isTrigger
                    ? 'bg-purple-100 border-purple-300 dark:bg-purple-900/30 dark:border-purple-700'
                    : 'bg-muted border-border hover:border-primary'
                }`}
                style={{
                  fontSize: isExpanded ? '10px' : '8px',
                  padding: isExpanded ? '4px' : '2px',
                }}
              >
                <span className="flex-shrink-0">{getElementIcon(element.type)}</span>
                <span className="truncate flex-1 font-medium">
                  {element.title || element.type}
                </span>
              </div>
            );
          })}

          {state.config.elements.length === 0 && (
            <div className="flex items-center justify-center h-full text-xs text-muted-foreground">
              No steps yet
            </div>
          )}
        </div>

        {/* Viewport Indicator */}
        <div
          className="absolute left-0 right-0 bg-primary/20 border-2 border-primary pointer-events-none"
          style={{
            top: `${viewportRect.top}px`,
            height: `${viewportRect.height}px`,
          }}
        />
      </div>

      {/* Footer Stats */}
      <div className="absolute bottom-0 left-0 right-0 p-2 border-t bg-muted/50 text-xs text-muted-foreground">
        {state.config.elements.length} step{state.config.elements.length !== 1 ? 's' : ''}
      </div>
    </Card>
  );
}
