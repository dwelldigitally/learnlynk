import React from 'react';
import { BuilderSelectionPage } from '@/components/builder/BuilderSelectionPage';
import { ModernAdminLayout } from '@/components/admin/ModernAdminLayout';

export function UniversalBuilderPage() {
  return (
    <ModernAdminLayout>
      <BuilderSelectionPage />
    </ModernAdminLayout>
  );
}