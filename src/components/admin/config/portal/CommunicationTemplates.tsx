import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCommunicationTemplates, useTemplateMutations } from "@/hooks/useStudentPortalAdmin";
import { Plus, Loader2, MessageSquare, Mail, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const CommunicationTemplates = () => {
  const { data: templates, isLoading } = useCommunicationTemplates();

  const getTemplateIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'sms':
        return <Phone className="h-4 w-4" />;
      case 'portal_message':
        return <MessageSquare className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

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
            <MessageSquare className="h-5 w-5" />
            Communication Templates
          </CardTitle>
          <CardDescription>
            Create and manage reusable templates for emails, SMS, and portal messages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {templates && templates.length > 0 ? (
              <div className="grid gap-4">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className="p-4 border rounded-lg bg-card hover:bg-accent/5 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {getTemplateIcon(template.template_type)}
                          <h4 className="font-medium">{template.template_name}</h4>
                          <Badge variant={template.is_active ? "default" : "secondary"}>
                            {template.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        {template.subject && (
                          <p className="text-sm text-muted-foreground mb-2">
                            Subject: {template.subject}
                          </p>
                        )}
                        <div className="flex gap-2 flex-wrap">
                          <Badge variant="outline">Type: {template.template_type}</Badge>
                          {template.template_category && (
                            <Badge variant="outline">{template.template_category}</Badge>
                          )}
                          <Badge variant="outline">Used {template.times_used} times</Badge>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No templates created yet. Click "Create Template" to add one.</p>
              </div>
            )}

            <Button className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Create Template
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
