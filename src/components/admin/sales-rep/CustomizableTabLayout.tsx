import { ReactNode } from 'react';
import GridLayout, { Layout } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { cn } from '@/lib/utils';

interface CustomizableTabLayoutProps {
  layout: Layout[];
  widgets: { [key: string]: ReactNode };
  isLocked: boolean;
  onLayoutChange: (layout: Layout[]) => void;
  className?: string;
}

export const CustomizableTabLayout = ({
  layout,
  widgets,
  isLocked,
  onLayoutChange,
  className,
}: CustomizableTabLayoutProps) => {
  return (
    <div className={cn('relative', className)}>
      <GridLayout
        className={cn(
          'layout transition-all duration-300',
          !isLocked && 'grid-background'
        )}
        layout={layout}
        cols={12}
        rowHeight={80}
        width={1200}
        isDraggable={!isLocked}
        isResizable={!isLocked}
        onLayoutChange={onLayoutChange}
        draggableHandle=".drag-handle"
        margin={[16, 16]}
        containerPadding={[0, 0]}
        compactType="vertical"
        preventCollision={false}
      >
        {Object.entries(widgets).map(([key, widget]) => (
          <div key={key} className="widget-container">
            {widget}
          </div>
        ))}
      </GridLayout>

      <style>{`
        .grid-background {
          background-image: 
            linear-gradient(to right, hsl(var(--border) / 0.3) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--border) / 0.3) 1px, transparent 1px);
          background-size: 40px 40px;
          background-position: -1px -1px;
        }

        .layout {
          position: relative;
        }

        .widget-container {
          overflow: hidden;
        }

        .react-grid-item {
          transition: all 200ms ease;
          transition-property: transform, width, height;
        }

        .react-grid-item.react-grid-placeholder {
          background: hsl(var(--primary) / 0.15);
          border-radius: 8px;
          border: 2px dashed hsl(var(--primary) / 0.5);
          transition-duration: 100ms;
          z-index: 2;
        }

        .react-grid-item.cssTransforms {
          transition-property: transform, width, height;
        }

        .react-grid-item > .react-resizable-handle {
          background: none;
        }

        .react-grid-item > .react-resizable-handle::after {
          content: "";
          position: absolute;
          right: 3px;
          bottom: 3px;
          width: 8px;
          height: 8px;
          border-right: 2px solid hsl(var(--primary) / 0.6);
          border-bottom: 2px solid hsl(var(--primary) / 0.6);
        }

        .react-grid-item.react-draggable-dragging {
          transition: none;
          z-index: 100;
          opacity: 0.9;
        }

        .react-grid-item.resizing {
          opacity: 0.9;
          z-index: 100;
        }

        .drag-handle {
          cursor: move;
        }

        .drag-handle:hover {
          background: hsl(var(--accent));
        }
      `}</style>
    </div>
  );
};
