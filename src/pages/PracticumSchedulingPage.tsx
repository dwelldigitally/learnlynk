import React from 'react';
import { ModernAdminLayout } from '@/components/admin/ModernAdminLayout';
import { SchedulingDashboard } from '@/components/scheduling/SchedulingDashboard';

export function PracticumSchedulingPage() {
  return (
    <ModernAdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Practicum Scheduling
          </h1>
          <p className="text-muted-foreground">
            Smart assignment of students to practicum sites based on program eligibility and capacity
          </p>
        </div>
        <SchedulingDashboard />
      </div>
    </ModernAdminLayout>
  );
}