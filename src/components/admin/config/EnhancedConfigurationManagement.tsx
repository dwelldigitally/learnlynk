import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Settings, Database, Workflow, Users, Filter, 
  Building2, MapPin, TrendingUp, Phone, Mail, 
  FileText, ClipboardList, AlertTriangle, Calendar,
  CreditCard, Upload, Target, MessageSquare, Video,
  Megaphone, GitBranch, Zap, Search, Brain, GraduationCap,
  Route
} from "lucide-react";

// Import configuration components
import StageManagement from "../workflow/StageManagement";
import { CustomFieldsManagement } from "../database/CustomFieldsManagement";
import { TeamManagement } from "../routing/TeamManagement";

// New configuration components
import { ProgramsConfiguration } from './sections/ProgramsConfiguration';
import { CampusesConfiguration } from './sections/CampusesConfiguration';
import { MarketingSourcesConfiguration } from './sections/MarketingSourcesConfiguration';
import { LeadStatusesConfiguration } from './sections/LeadStatusesConfiguration';
import { CallTypesConfiguration } from './sections/CallTypesConfiguration';
import { CommunicationTemplatesConfiguration } from './sections/CommunicationTemplatesConfiguration';
import { DocumentTemplatesConfiguration } from './sections/DocumentTemplatesConfiguration';
import { RequirementsConfiguration } from './sections/RequirementsConfiguration';
import { LeadPrioritiesConfiguration } from './sections/LeadPrioritiesConfiguration';
import { TeamsConfiguration } from './sections/TeamsConfiguration';
import { NotificationFiltersConfiguration } from './sections/NotificationFiltersConfiguration';
import { RoutingConfiguration } from './sections/RoutingConfiguration';
import { CompanyProfileConfiguration } from './sections/CompanyProfileConfiguration';
import { EnhancedIntegrationHub } from '../database/EnhancedIntegrationHub';
import { LeadConfiguration } from './LeadConfiguration';
import { LeadRoutingRulesConfiguration } from './LeadRoutingRulesConfiguration';
import { LeadScoringConfiguration } from './LeadScoringConfiguration';

interface ConfigurationSection {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  category: string;
  component: React.ReactNode;
  badge?: string;
  isNew?: boolean;
}

const configurationSections: ConfigurationSection[] = [
  // Leads Configuration
  {
    id: 'lead-intelligence',
    label: 'Intelligence & AI',
    icon: Brain,
    description: 'Configure Agentic AI and lead management settings',
    category: 'Leads',
    component: <LeadConfiguration />
  },
  {
    id: 'routing-rules',
    label: 'Routing Rules',
    icon: Route,
    description: 'Configure intelligent lead assignment and routing',
    category: 'Leads',
    component: <LeadRoutingRulesConfiguration />
  },
  {
    id: 'lead-scoring',
    label: 'Lead Scoring',
    icon: Target,
    description: 'Configure automatic lead scoring rules and algorithms',
    category: 'Leads',
    component: <LeadScoringConfiguration />
  },
  
  // Students Configuration  
  {
    id: 'student-management',
    label: 'Student Management',
    icon: GraduationCap,
    description: 'Configure student lifecycle and management settings',
    category: 'Students',
    component: <div className="p-8 text-center text-muted-foreground">Student configuration coming soon</div>
  },
  
  // Applicants Configuration
  {
    id: 'applicant-management', 
    label: 'Applicant Management',
    icon: FileText,
    description: 'Configure application process and requirements',
    category: 'Applicants',
    component: <div className="p-8 text-center text-muted-foreground">Applicant configuration coming soon</div>
  },

  // System - Data & Database
  {
    id: 'stages',
    label: 'Stages & Substages',
    icon: Workflow,
    description: 'Configure lead, applicant, and student stages with substages',
    category: 'System',
    component: <StageManagement />
  },
  {
    id: 'custom-fields',
    label: 'Custom Fields',
    icon: Database,
    description: 'Manage custom fields for each stage',
    category: 'System',
    component: <CustomFieldsManagement />
  },
  {
    id: 'programs',
    label: 'Programs',
    icon: Building2,
    description: 'Manage academic programs and their configurations',
    category: 'System',
    component: <ProgramsConfiguration />,
    isNew: true
  },
  {
    id: 'campuses',
    label: 'Campuses',
    icon: MapPin,
    description: 'Configure campus locations and facilities',
    category: 'System',
    component: <CampusesConfiguration />,
    isNew: true
  },
  {
    id: 'marketing-sources',
    label: 'Marketing Sources',
    icon: TrendingUp,
    description: 'Track and manage lead sources',
    category: 'System',
    component: <MarketingSourcesConfiguration />,
    isNew: true
  },
  
  // System - Communication & Templates
  {
    id: 'communication-templates',
    label: 'Communication Templates',
    icon: MessageSquare,
    description: 'Email, SMS, and meeting templates',
    category: 'System',
    component: <CommunicationTemplatesConfiguration />,
    isNew: true
  },
  {
    id: 'document-templates',
    label: 'Document Templates',
    icon: FileText,
    description: 'Document requirements and templates',
    category: 'System',
    component: <DocumentTemplatesConfiguration />,
    isNew: true
  },
  {
    id: 'call-types',
    label: 'Call Types',
    icon: Phone,
    description: 'Configure call categories and templates',
    category: 'System',
    component: <CallTypesConfiguration />,
    isNew: true
  },
  {
    id: 'notification-filters',
    label: 'Notification Filters',
    icon: Filter,
    description: 'Configure notification rules and filters',
    category: 'System',
    component: <NotificationFiltersConfiguration />,
    isNew: true
  },
  {
    id: 'requirements',
    label: 'Requirements',
    icon: ClipboardList,
    description: 'Academic and entry requirements',
    category: 'System',
    component: <RequirementsConfiguration />,
    isNew: true
  },

  // System - Team Management
  {
    id: 'internal-teams',
    label: 'Internal Teams',
    icon: Users,
    description: 'Configure internal team assignments',
    category: 'System',
    component: <TeamManagement />
  },
  {
    id: 'external-teams',
    label: 'External Recruiters',
    icon: Users,
    description: 'Manage external recruiter teams',
    category: 'System',
    component: <TeamsConfiguration />,
    isNew: true
  },
  {
    id: 'team-routing-rules',
    label: 'Team Routing Rules',
    icon: GitBranch,
    description: 'Configure team-based lead routing and assignment rules',
    category: 'System',
    component: <RoutingConfiguration />,
    isNew: true
  },

  // System - Company & Integrations
  {
    id: 'company-profile',
    label: 'Company Profile',
    icon: Building2,
    description: 'Manage company information, branding, and contact details',
    category: 'System',
    component: <CompanyProfileConfiguration />,
    isNew: true
  },
  {
    id: 'external-integrations',
    label: 'External Integrations',
    icon: Zap,
    description: 'Connect with external services and APIs',
    category: 'System',
    component: <EnhancedIntegrationHub />,
    isNew: true
  },
  {
    id: 'automation',
    label: 'Automation',
    icon: Workflow,
    description: 'Automated processes and triggers',
    category: 'System',
    component: <div className="p-6 text-center text-muted-foreground">Automation configuration coming soon...</div>
  }
];

export const EnhancedConfigurationManagement = () => {
  // Determine initial section based on URL
  const getInitialSection = () => {
    const path = window.location.pathname;
    if (path.includes('/master-data')) {
      return 'campuses'; // Default to campuses for master data
    }
    if (path.includes('/templates')) {
      return 'communication-templates'; // Default to communication templates
    }
    if (path.includes('/routing')) {
      return 'routing-rules'; // Default to routing rules
    }
    if (path.includes('/company')) {
      return 'company-profile'; // Default to company profile
    }
    return 'lead-intelligence';
  };

  const [activeSection, setActiveSection] = useState(getInitialSection());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(() => {
    const path = window.location.pathname;
    if (path.includes('/master-data')) return 'Data & Database';
    if (path.includes('/templates')) return 'Communication';
    if (path.includes('/routing')) return 'Leads';
    if (path.includes('/company')) return 'Company Settings';
    return null;
  });

  // Get unique categories
  const categories = [...new Set(configurationSections.map(section => section.category))];

  // Filter sections based on search and category
  const filteredSections = configurationSections.filter(section => {
    const matchesSearch = section.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         section.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || section.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const activeConfig = configurationSections.find(section => section.id === activeSection);

  return (
    <div className="flex h-[calc(100vh-120px)] bg-background">
      {/* Sidebar */}
      <div className="w-80 border-r bg-card">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold">Configuration</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage all system configurations
          </p>
        </div>

        {/* Search */}
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search configurations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="p-4 border-b">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
            >
              All
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Configuration List */}
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-2">
            {categories.map(category => {
              const categoryItems = filteredSections.filter(section => section.category === category);
              if (categoryItems.length === 0) return null;

              return (
                <div key={category}>
                  {(!selectedCategory || selectedCategory === category) && (
                    <>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2 px-2 truncate">
                        {category}
                      </h3>
                      {categoryItems.map((section) => {
                        const IconComponent = section.icon;
                        return (
                          <Button
                            key={section.id}
                            variant={activeSection === section.id ? "default" : "ghost"}
                            className="w-full justify-start h-auto p-3 mb-2 text-left"
                            onClick={() => setActiveSection(section.id)}
                          >
                            <div className="flex items-start gap-3 w-full min-w-0">
                              <IconComponent className="w-5 h-5 mt-0.5 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-medium truncate">{section.label}</span>
                                  {section.isNew && (
                                    <Badge variant="secondary" className="text-xs px-1.5 py-0.5 flex-shrink-0">
                                      New
                                    </Badge>
                                  )}
                                  {section.badge && (
                                    <Badge variant="outline" className="text-xs px-1.5 py-0.5 flex-shrink-0">
                                      {section.badge}
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                  {section.description}
                                </p>
                              </div>
                            </div>
                          </Button>
                        );
                      })}
                      <Separator className="my-4" />
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-6">
            {activeConfig && (
              <>
                {/* Header */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <activeConfig.icon className="w-6 h-6" />
                    <h1 className="text-3xl font-bold">{activeConfig.label}</h1>
                    {activeConfig.isNew && (
                      <Badge variant="secondary">New</Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground text-lg">
                    {activeConfig.description}
                  </p>
                </div>

                {/* Content */}
                <div className="space-y-6">
                  {activeConfig.component}
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};