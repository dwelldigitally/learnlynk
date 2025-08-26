import { useState } from 'react';
import { Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AIQuickActions } from './AIQuickActions';

export function AIActionsMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/10 min-w-[44px] min-h-[44px] flex items-center justify-center"
          title="AI Quick Actions"
        >
          <Bot className="w-5 h-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-80 bg-background border border-border shadow-lg rounded-md z-50 p-0"
      >
        <div className="p-4">
          <AIQuickActions />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}