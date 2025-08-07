import React from 'react';
import { ConfigurationManagement } from '@/components/admin/ConfigurationManagement';
import { ModernAdminLayout } from '@/components/admin/ModernAdminLayout';

const ConfigurationPage = () => {
  return (
    <ModernAdminLayout>
      <ConfigurationManagement />
    </ModernAdminLayout>
  );
};

export default ConfigurationPage;