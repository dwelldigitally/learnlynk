import React from 'react';
import { useLocation } from 'react-router-dom';
import { LeadRoutingRulesConfiguration } from './config/LeadRoutingRulesConfiguration';
import { LeadScoringConfiguration } from './config/LeadScoringConfiguration';

import { CustomFieldsManagement } from './database/CustomFieldsManagement';
import { CampusesConfiguration } from './config/sections/CampusesConfiguration';
import { TeamManagement } from './routing/TeamManagement';
import { CompanySettingsRedesigned } from './config/sections/CompanySettingsRedesigned';
import { EnhancedIntegrationHub } from './database/EnhancedIntegrationHub';
import { SetupDashboard } from '@/pages/admin/setup/SetupDashboard';
import { PaymentConfiguration } from './config/PaymentConfiguration';

export const ConfigurationManagement = () => {
  const location = useLocation();
  
  // Route to the correct configuration component based on path
  const renderConfigurationContent = () => {
    const path = location.pathname;
    
    if (path.includes('/routing')) return <LeadRoutingRulesConfiguration />;
    if (path.includes('/scoring')) return <LeadScoringConfiguration />;
    
    if (path.includes('/setup')) return <SetupDashboard />;
    if (path.includes('/custom-fields')) return <CustomFieldsManagement />;
    if (path.includes('/campuses')) return <CampusesConfiguration />;
    if (path.includes('/teams')) return <TeamManagement />;
    if (path.includes('/company')) return <CompanySettingsRedesigned />;
    if (path.includes('/payments')) return <PaymentConfiguration />;
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