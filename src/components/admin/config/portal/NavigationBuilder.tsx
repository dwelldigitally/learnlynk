import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePortalNavigation, useNavigationMutations } from "@/hooks/useStudentPortalAdmin";
import { Plus, Loader2, Menu } from "lucide-react";

export const NavigationBuilder = () => {
  const { data: navigation, isLoading } = usePortalNavigation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Menu className="h-5 w-5" />
            Navigation Menu Builder
          </CardTitle>
          <CardDescription>
            Drag and drop to reorder menu items, or add new navigation links
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {navigation && navigation.length > 0 ? (
              <div className="space-y-2">
                {navigation.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 border rounded-lg flex items-center justify-between bg-card hover:bg-accent/5 transition-colors"
                  >
                    <div>
                      <p className="font-medium">{item.label}</p>
                      <p className="text-sm text-muted-foreground">{item.path || item.external_url}</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Menu className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No navigation items yet. Click "Add Navigation Item" to get started.</p>
              </div>
            )}

            <Button className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Add Navigation Item
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
