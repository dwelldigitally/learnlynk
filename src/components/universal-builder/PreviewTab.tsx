import React from 'react';
import { PreviewPanel } from './PreviewPanel';

export function PreviewTab() {
  return (
    <div className="h-full w-full overflow-auto">
      <div className="p-6">
        <PreviewPanel />
      </div>
    </div>
  );
}
