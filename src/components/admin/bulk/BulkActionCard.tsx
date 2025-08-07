import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface BulkActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
  lastUsed?: string;
}

export function BulkActionCard({ title, description, icon: Icon, onClick, lastUsed }: BulkActionCardProps) {
  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1 space-y-1">
            <h3 className="font-medium">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
            {lastUsed && (
              <p className="text-xs text-muted-foreground">Last used: {lastUsed}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}