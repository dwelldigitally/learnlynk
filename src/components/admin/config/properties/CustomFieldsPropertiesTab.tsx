import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';

export function CustomFieldsPropertiesTab() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Custom Fields</CardTitle>
          <CardDescription>
            Manage custom fields for Leads, Applicants, Students, and Programs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
            <Info className="w-5 h-5 text-primary mt-0.5" />
            <div className="space-y-2">
              <p className="font-medium">Custom Fields Management</p>
              <p className="text-sm text-muted-foreground">
                Custom fields are managed through the dedicated Custom Fields page in System Configuration.
                Navigate to <span className="font-semibold">Configuration → Custom Fields</span> to add, edit, 
                or remove custom fields for different entity types.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
