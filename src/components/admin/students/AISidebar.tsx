import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";
import { AIBulkActions } from "./AIBulkActions";

interface AISidebarProps {
  activeStage: string;
  selectedStudents: string[];
  totalStudents: number;
  onBulkAction: (action: string, studentIds: string[]) => void;
}

export function AISidebar({ activeStage, selectedStudents, totalStudents, onBulkAction }: AISidebarProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          <Bot className="h-4 w-4 mr-2" />
          AI Actions
          {selectedStudents.length > 0 && (
            <span className="ml-2 bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
              {selectedStudents.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>AI-Powered Actions</SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <AIBulkActions
            activeStage={activeStage}
            selectedStudents={selectedStudents}
            totalStudents={totalStudents}
            onBulkAction={onBulkAction}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}