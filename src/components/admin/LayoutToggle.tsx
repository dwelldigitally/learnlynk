import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LayoutGrid, Sidebar, ArrowRight } from "lucide-react";

interface LayoutToggleProps {
  onUseSidebarLayout: () => void;
}

export function LayoutToggle({ onUseSidebarLayout }: LayoutToggleProps) {
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Layout Settings</h1>
        <p className="text-muted-foreground mt-2">
          Choose your preferred admin layout style
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Layout */}
        <Card className="relative">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LayoutGrid className="h-5 w-5" />
                <CardTitle>Current Layout</CardTitle>
              </div>
              <Badge variant="default">Active</Badge>
            </div>
            <CardDescription>
              Top navigation with dropdown menus
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-muted rounded-lg border-2 border-dashed border-border flex items-center justify-center">
              <div className="text-center space-y-2">
                <LayoutGrid className="h-8 w-8 mx-auto text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Top Navigation Layout</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Classic horizontal navigation with mega menus and dropdown sections.
            </p>
          </CardContent>
        </Card>

        {/* Sidebar Layout */}
        <Card className="relative border-primary/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sidebar className="h-5 w-5" />
                <CardTitle>Sidebar Layout</CardTitle>
              </div>
              <Badge variant="secondary">Test</Badge>
            </div>
            <CardDescription>
              Left sidebar navigation with collapsible sections
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-muted rounded-lg border-2 border-dashed border-primary/30 flex items-center justify-center">
              <div className="text-center space-y-2">
                <Sidebar className="h-8 w-8 mx-auto text-primary" />
                <p className="text-sm text-primary">Sidebar Navigation Layout</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Organized sidebar navigation with grouped sections and clean content area.
            </p>
            <Button 
              onClick={onUseSidebarLayout}
              className="w-full mt-4 gap-2"
            >
              Test Sidebar Layout
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950">
        <CardHeader>
          <CardTitle className="text-amber-800 dark:text-amber-200">Testing Mode</CardTitle>
          <CardDescription className="text-amber-700 dark:text-amber-300">
            You can safely test the sidebar layout and easily return to the current layout at any time.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-amber-700 dark:text-amber-300">
          <ul className="space-y-1">
            <li>• All functionality remains exactly the same</li>
            <li>• Easy one-click return to current layout</li>
            <li>• No data loss or configuration changes</li>
            <li>• Test as long as you want</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}