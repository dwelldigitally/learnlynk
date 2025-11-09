import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ConfigurationSidebar } from './ConfigurationSidebar';
import { LeadRoutingRulesConfiguration } from './config/LeadRoutingRulesConfiguration';
import { LeadScoringConfiguration } from './config/LeadScoringConfiguration';
import { StudentManagementConfiguration } from './config/StudentManagementConfiguration';

export const ConfigurationManagement = () => {
  return (
    <div className="flex h-[calc(100vh-120px)]">
      <ConfigurationSidebar />
      <div className="flex-1 overflow-y-auto">
        <Routes>
          <Route path="routing" element={<LeadRoutingRulesConfiguration />} />
          <Route path="scoring" element={<LeadScoringConfiguration />} />
          <Route path="students" element={<StudentManagementConfiguration />} />
          <Route path="*" element={<Navigate to="/admin/configuration/routing" replace />} />
        </Routes>
      </div>
    </div>
  );
};