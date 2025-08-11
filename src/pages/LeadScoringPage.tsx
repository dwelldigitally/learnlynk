import { ModernAdminLayout } from '@/components/admin/ModernAdminLayout';
import { LeadScoringEngine } from '@/components/admin/LeadScoringEngine';

const LeadScoringPage = () => {
  return (
    <ModernAdminLayout>
      <div className="p-6 pt-8 w-full max-w-none">
        <LeadScoringEngine />
      </div>
    </ModernAdminLayout>
  );
};

export default LeadScoringPage;