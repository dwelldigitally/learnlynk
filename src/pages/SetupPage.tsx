import React from 'react';
import { SetupTaskList } from '@/components/admin/setup/SetupTaskList';
import { ModernAdminLayout } from '@/components/admin/ModernAdminLayout';
import { SetupBanner } from '@/components/admin/setup/SetupBanner';

const SetupPage: React.FC = () => {
  return (
    <>
      <SetupBanner />
      <ModernAdminLayout>
        <div className="min-h-screen bg-background">
          <SetupTaskList />
        </div>
      </ModernAdminLayout>
    </>
  );
};

export default SetupPage;
