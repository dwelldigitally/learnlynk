import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AlertTriangle, 
  Clock, 
  FileX, 
  DollarSign, 
  Shield, 
  CheckCircle,
  X,
  Eye
} from "lucide-react";

export function RegistrarAlertCenter() {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: "document_missing",
      title: "Missing Transcripts",
      description: "5 applications missing official transcripts, deadline tomorrow",
      severity: "critical",
      count: 5,
      timestamp: "2 minutes ago",
      applications: ["APP-2024-001", "APP-2024-045", "APP-2024-067"]
    },
    {
      id: 2,
      type: "sla_violation",
      title: "Processing SLA Exceeded",
      description: "Applications exceed 72-hour processing time",
      severity: "high",
      count: 3,
      timestamp: "15 minutes ago",
      applications: ["APP-2024-023", "APP-2024-034", "APP-2024-078"]
    },
    {
      id: 3,
      type: "payment_overdue",
      title: "Tuition Payment Overdue",
      description: "Students risk enrollment cancellation",
      severity: "high",
      count: 7,
      timestamp: "1 hour ago",
      applications: ["APP-2024-012", "APP-2024-056"]
    },
    {
      id: 4,
      type: "compliance_deadline",
      title: "Regulatory Reporting Due",
      description: "State compliance report due in 48 hours",
      severity: "medium",
      count: 1,
      timestamp: "2 hours ago",
      applications: []
    },
    {
      id: 5,
      type: "document_quality",
      title: "Document Quality Issues",
      description: "Submitted documents require resubmission",
      severity: "medium",
      count: 4,
      timestamp: "3 hours ago",
      applications: ["APP-2024-089", "APP-2024-091"]
    }
  ]);

  const resolveAlert = (alertId: number) => {
    setAlerts(alerts.filter(alert => alert.id !== alertId));
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'document_missing':
      case 'document_quality':
        return FileX;
      case 'sla_violation':
        return Clock;
      case 'payment_overdue':
        return DollarSign;
      case 'compliance_deadline':
        return Shield;
      default:
        return AlertTriangle;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'high':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const criticalAlerts = alerts.filter(alert => alert.severity === 'critical');
  const highAlerts = alerts.filter(alert => alert.severity === 'high');
  const mediumAlerts = alerts.filter(alert => alert.severity === 'medium');

  return (
    <div className="space-y-6">
      {/* Alert Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-red-200 bg-red-50/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <p className="font-semibold text-red-900">Critical</p>
                <p className="text-2xl font-bold text-red-600">{criticalAlerts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-600" />
              <div>
                <p className="font-semibold text-orange-900">High</p>
                <p className="text-2xl font-bold text-orange-600">{highAlerts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-200 bg-yellow-50/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileX className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="font-semibold text-yellow-900">Medium</p>
                <p className="text-2xl font-bold text-yellow-600">{mediumAlerts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-semibold text-green-900">Resolved Today</p>
                <p className="text-2xl font-bold text-green-600">12</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alert Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Alerts ({alerts.length})</TabsTrigger>
          <TabsTrigger value="critical">Critical ({criticalAlerts.length})</TabsTrigger>
          <TabsTrigger value="high">High ({highAlerts.length})</TabsTrigger>
          <TabsTrigger value="medium">Medium ({mediumAlerts.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <AlertList alerts={alerts} resolveAlert={resolveAlert} getAlertIcon={getAlertIcon} getSeverityColor={getSeverityColor} />
        </TabsContent>

        <TabsContent value="critical">
          <AlertList alerts={criticalAlerts} resolveAlert={resolveAlert} getAlertIcon={getAlertIcon} getSeverityColor={getSeverityColor} />
        </TabsContent>

        <TabsContent value="high">
          <AlertList alerts={highAlerts} resolveAlert={resolveAlert} getAlertIcon={getAlertIcon} getSeverityColor={getSeverityColor} />
        </TabsContent>

        <TabsContent value="medium">
          <AlertList alerts={mediumAlerts} resolveAlert={resolveAlert} getAlertIcon={getAlertIcon} getSeverityColor={getSeverityColor} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function AlertList({ alerts, resolveAlert, getAlertIcon, getSeverityColor }: any) {
  return (
    <div className="space-y-4">
      {alerts.map((alert: any) => {
        const AlertIcon = getAlertIcon(alert.type);
        return (
          <Card key={alert.id} className={`border-l-4 ${getSeverityColor(alert.severity)}`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <AlertIcon className="h-5 w-5 mt-0.5" />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{alert.title}</h4>
                      <Badge variant="outline">{alert.count}</Badge>
                      <Badge variant="secondary" className="text-xs">
                        {alert.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {alert.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {alert.timestamp}
                    </div>
                    {alert.applications.length > 0 && (
                      <div className="flex gap-1 mt-2">
                        {alert.applications.slice(0, 3).map((appId: string) => (
                          <Badge key={appId} variant="outline" className="text-xs">
                            {appId}
                          </Badge>
                        ))}
                        {alert.applications.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{alert.applications.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => resolveAlert(alert.id)}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Resolve
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
      {alerts.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Alerts</h3>
            <p className="text-muted-foreground">
              All registration operations are running smoothly.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}