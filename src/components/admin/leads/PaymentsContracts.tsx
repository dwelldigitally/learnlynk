import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign } from 'lucide-react';
import { Lead } from '@/types/lead';

interface PaymentsContractsProps {
  lead: Lead;
  onUpdate: () => void;
}

export function PaymentsContracts({ lead }: PaymentsContractsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Payments & Contracts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Payment management coming soon...</p>
      </CardContent>
    </Card>
  );
}