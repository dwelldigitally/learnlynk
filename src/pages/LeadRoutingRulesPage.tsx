import { ModernAdminLayout } from '@/components/admin/ModernAdminLayout';
import { LeadRoutingRules } from '@/components/admin/LeadRoutingRules';

const LeadRoutingRulesPage = () => {
  return (
    <ModernAdminLayout>
      <div className="p-6 pt-8 w-full max-w-none">
        <LeadRoutingRules />
      </div>
    </ModernAdminLayout>
  );
};

export default LeadRoutingRulesPage;