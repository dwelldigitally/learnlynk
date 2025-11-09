import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ConfigurationSidebar } from './ConfigurationSidebar';
import { LeadRoutingRulesConfiguration } from './config/LeadRoutingRulesConfiguration';
import { LeadScoringConfiguration } from './config/LeadScoringConfiguration';
import { StudentManagementConfiguration } from './config/StudentManagementConfiguration';
import { ApplicantManagementConfiguration } from './config/ApplicantManagementConfiguration';
import { CustomFieldsManagement } from './database/CustomFieldsManagement';
import { CampusesConfiguration } from './config/sections/CampusesConfiguration';
import { TeamManagement } from './routing/TeamManagement';
import { CompanyProfileConfiguration } from './config/sections/CompanyProfileConfiguration';
import { EnhancedIntegrationHub } from './database/EnhancedIntegrationHub';
import { SetupOnboardingPage } from '@/pages/admin/config/SetupOnboardingPage';
import { useMvpMode } from '@/contexts/MvpModeContext';

export const ConfigurationManagement = () => {
  const { isMvpMode } = useMvpMode();
  
  return (
    <div className="flex h-full w-full">
      <ConfigurationSidebar />
      <div className="flex-1 overflow-y-auto">
        <Routes>
          <Route path="routing" element={<LeadRoutingRulesConfiguration />} />
          <Route path="scoring" element={<LeadScoringConfiguration />} />
          <Route path="students" element={<StudentManagementConfiguration />} />
          <Route path="applicants" element={<ApplicantManagementConfiguration />} />
          <Route path="setup" element={<SetupOnboardingPage />} />
          <Route path="custom-fields" element={<CustomFieldsManagement />} />
          <Route path="campuses" element={<CampusesConfiguration />} />
          <Route path="teams" element={<TeamManagement />} />
          <Route path="company" element={<CompanyProfileConfiguration />} />
          <Route path="integrations" element={<EnhancedIntegrationHub />} />
          <Route index element={<Navigate to={isMvpMode ? "routing" : "routing"} replace />} />
        </Routes>
      </div>
    </div>
  );
};