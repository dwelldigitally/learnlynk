import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  X, 
  User, 
  Calendar, 
  Phone, 
  Mail, 
  MessageSquare, 
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign 
} from "lucide-react";

interface AlertDetailPanelProps {
  selectedItem: any;
  onClose: () => void;
  onQuickAction: (itemId: string, action: string) => void;
}

export function AlertDetailPanel({ selectedItem, onClose, onQuickAction }: AlertDetailPanelProps) {
  if (!selectedItem) return null;

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'high':
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case 'medium':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
    }
  };

  const getActionButtons = () => {
    if (selectedItem.actions) {
      return selectedItem.actions.slice(0, 3).map((action: string) => (
        <Button
          key={action}
          variant="outline"
          size="sm"
          onClick={() => onQuickAction(selectedItem.id, action)}
          className="flex-1"
        >
          {action}
        </Button>
      ));
    }
    return [];
  };

  return (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getSeverityIcon(selectedItem.severity)}
            <Badge variant={selectedItem.severity === 'critical' ? 'destructive' : 'outline'}>
              {selectedItem.severity}
            </Badge>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <CardTitle className="text-lg">{selectedItem.title}</CardTitle>
        <CardDescription>{selectedItem.category}</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium text-sm mb-2">Description</h4>
          <p className="text-sm text-muted-foreground">{selectedItem.description}</p>
        </div>

        {/* Student/Lead Information */}
        {selectedItem.studentName && (
          <>
            <Separator />
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Lead Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedItem.studentName}</span>
                </div>
                {selectedItem.program && (
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {selectedItem.program}
                    </Badge>
                  </div>
                )}
                {selectedItem.timeAgo && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{selectedItem.timeAgo}</span>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Additional Details */}
        {(selectedItem.leads || selectedItem.count || selectedItem.totalValue) && (
          <>
            <Separator />
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Details</h4>
              <div className="space-y-1 text-sm">
                {selectedItem.leads && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Affected Leads:</span>
                    <span className="font-medium">{selectedItem.leads}</span>
                  </div>
                )}
                {selectedItem.count && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Count:</span>
                    <span className="font-medium">{selectedItem.count}</span>
                  </div>
                )}
                {selectedItem.totalValue && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Value:</span>
                    <span className="font-medium">{selectedItem.totalValue}</span>
                  </div>
                )}
                {selectedItem.avgOverage && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Average Overage:</span>
                    <span className="font-medium">{selectedItem.avgOverage}</span>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Quick Actions */}
        <Separator />
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Quick Actions</h4>
          <div className="flex flex-col gap-2">
            {getActionButtons()}
          </div>
        </div>

        {/* Contact Actions */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1 gap-2">
            <Phone className="h-4 w-4" />
            Call
          </Button>
          <Button variant="outline" size="sm" className="flex-1 gap-2">
            <Mail className="h-4 w-4" />
            Email
          </Button>
          <Button variant="outline" size="sm" className="flex-1 gap-2">
            <MessageSquare className="h-4 w-4" />
            SMS
          </Button>
        </div>

        {/* Meta Information */}
        <div className="text-xs text-muted-foreground pt-2 border-t">
          <div className="flex justify-between">
            <span>Alert ID: {selectedItem.id}</span>
            <span>Category: {selectedItem.segment}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}