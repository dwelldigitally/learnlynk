import React from 'react';
import { SetupTaskList } from '@/components/admin/setup/SetupTaskList';

const SetupPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <SetupTaskList />
    </div>
  );
};

export default SetupPage;
