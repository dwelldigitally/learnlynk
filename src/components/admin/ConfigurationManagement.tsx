import React from 'react';
import { useLocation } from 'react-router-dom';
import { CustomFieldsManagement } from './database/CustomFieldsManagement';
import { MasterDataManagement } from './database/MasterDataManagement';
import { IntegrationHub } from './database/IntegrationHub';
import { SystemTemplates } from './database/SystemTemplates';
import AIAgentsHub from './database/AIAgentsHub';
import BehaviorAnalytics from './database/BehaviorAnalytics';
import { LeadRoutingRules } from './LeadRoutingRules';
import { LeadScoringEngine } from './LeadScoringEngine';
import { CompanySettings } from './CompanySettings';
import SystemConfiguration from './SystemConfiguration';
import { ConfigurationSidebar } from './ConfigurationSidebar';
import { ConfigurationBreadcrumb } from './ConfigurationBreadcrumb';

export const ConfigurationManagement = () => {
  const location = useLocation();

  const renderContent = () => {
    const path = location.pathname;
    
    switch (path) {
      case '/admin/configuration/custom-fields':
        return <CustomFieldsManagement />;
      case '/admin/configuration/master-data':
        return <MasterDataManagement />;
      case '/admin/configuration/integrations':
        return <IntegrationHub />;
      case '/admin/configuration/templates':
        return <SystemTemplates />;
      case '/admin/configuration/ai-agents':
        return <AIAgentsHub />;
      case '/admin/configuration/behavior':
        return <BehaviorAnalytics />;
      case '/admin/configuration/routing':
        return <LeadRoutingRules />;
      case '/admin/configuration/scoring':
        return <LeadScoringEngine />;
      case '/admin/configuration/company':
        return <CompanySettings />;
      case '/admin/configuration/system':
        return <SystemConfiguration />;
      default:
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Welcome to Configuration</h2>
            <p className="text-muted-foreground">
              Select a configuration section from the sidebar to get started.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-full">
      <ConfigurationSidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <ConfigurationBreadcrumb />
          {renderContent()}
        </div>
      </div>
    </div>
  );
};