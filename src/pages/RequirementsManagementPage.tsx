import React from 'react';
import { RequirementsManagement } from '@/components/admin/database/RequirementsManagement';
import { ModernAdminLayout } from '@/components/admin/ModernAdminLayout';

const RequirementsManagementPage = () => {
  return (
    <ModernAdminLayout>
      <RequirementsManagement />
    </ModernAdminLayout>
  );
};

export default RequirementsManagementPage;