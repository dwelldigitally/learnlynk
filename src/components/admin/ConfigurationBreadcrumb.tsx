import React from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Settings } from 'lucide-react';

const routeLabels: Record<string, string> = {
  'custom-fields': 'Custom Fields',
  'master-data': 'Master Data',
  'integrations': 'Integrations',
  'templates': 'Templates',
  'ai-agents': 'AI Agents',
  'ai-models': 'AI Models',
  'ai-analytics': 'Performance Analytics',
  'workflows': 'Visual Builder',
  'automation-rules': 'Automation Rules',
  'behavior': 'Behavior Analytics',
  'routing': 'Routing Rules',
  'scoring': 'Scoring Engine',
  'company': 'Company Profile',
  'payments': 'Payment Configuration',
  'system': 'System Configuration',
};

export const ConfigurationBreadcrumb: React.FC = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  
  // Extract the current configuration section
  const currentSection = pathSegments[pathSegments.length - 1];
  const sectionLabel = routeLabels[currentSection] || 'Configuration';

  return (
    <Breadcrumb className="mb-6">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/admin" className="flex items-center">
            <Settings className="h-4 w-4 mr-1" />
            Admin
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/admin/configuration">Configuration</BreadcrumbLink>
        </BreadcrumbItem>
        {currentSection && currentSection !== 'configuration' && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{sectionLabel}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
};