import React from 'react';
import { useLocation } from 'react-router-dom';
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

export const ConfigurationManagement = () => {
  const location = useLocation();
  
  // Route to the correct configuration component based on path
  const renderConfigurationContent = () => {
    const path = location.pathname;
    
    if (path.includes('/routing')) return <LeadRoutingRulesConfiguration />;
    if (path.includes('/scoring')) return <LeadScoringConfiguration />;
    if (path.includes('/students')) return <StudentManagementConfiguration />;
    if (path.includes('/applicants')) return <ApplicantManagementConfiguration />;
    if (path.includes('/setup')) return <SetupOnboardingPage />;
    if (path.includes('/custom-fields')) return <CustomFieldsManagement />;
    if (path.includes('/campuses')) return <CampusesConfiguration />;
    if (path.includes('/teams')) return <TeamManagement />;
    if (path.includes('/company')) return <CompanyProfileConfiguration />;
    if (path.includes('/integrations')) return <EnhancedIntegrationHub />;
    
    // Default to routing rules
    return <LeadRoutingRulesConfiguration />;
  };
  
  return (
    <div className="w-full h-full">
      {renderConfigurationContent()}
    </div>
  );
};