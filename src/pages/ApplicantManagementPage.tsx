import React from 'react';
import { ApplicantManagement } from '@/components/admin/ApplicantManagement';
import { ModernAdminLayout } from '@/components/admin/ModernAdminLayout';

const ApplicantManagementPage = () => {
  return (
    <ModernAdminLayout>
      <ApplicantManagement />
    </ModernAdminLayout>
  );
};

export default ApplicantManagementPage;