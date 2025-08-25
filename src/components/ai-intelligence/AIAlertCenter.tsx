import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  AlertTriangle, 
  Bell, 
  CheckCircle, 
  XCircle, 
  Clock, 
  TrendingDown,
  TrendingUp,
  Settings,
  Mail,
  MessageSquare,
  Smartphone
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface AIAlert {
  id: string;
  type: 'performance' | 'threshold' | 'bias' | 'error' | 'maintenance';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  timestamp: string;
  status: 'active' | 'acknowledged' | 'resolved';
  metrics?: {
    currentValue: number;
    threshold: number;
    trend: 'up' | 'down' | 'stable';
  };
  affectedModels?: string[];
  actionRequired?: string;
}

interface AlertRule {
  id: string;
  name: string;
  type: string;
  condition: string;
  threshold: number;
  severity: string;
  enabled: boolean;
  notifications: {
    email: boolean;
    sms: boolean;
    slack: boolean;
  };
}

export function AIAlertCenter() {
  const [alerts, setAlerts] = useState<AIAlert[]>([
    {
      id: 'alert_001',
      type: 'performance',
      severity: 'high',
      title: 'Model Accuracy Below Threshold',
      description: 'Enrollment Optimizer Pro accuracy has dropped to 82.1%, below the 85% threshold.',
      timestamp: '2024-03-21T14:30:00Z',
      status: 'active',
      metrics: {
        currentValue: 82.1,
        threshold: 85,
        trend: 'down'
      },
      affectedModels: ['Enrollment Optimizer Pro v3.2'],
      actionRequired: 'Review recent data inputs and consider model retraining.'
    },
    {
      id: 'alert_002',
      type: 'bias',
      severity: 'medium',
      title: 'Geographic Bias Detected',
      description: 'Potential bias detected in geographic distribution of recommendations.',
      timestamp: '2024-03-21T13:15:00Z',
      status: 'acknowledged',
      metrics: {
        currentValue: 78,
        threshold: 85,
        trend: 'down'
      },
      affectedModels: ['Enrollment Optimizer Pro v3.2'],
      actionRequired: 'Review geographic weighting in model configuration.'
    },
    {
      id: 'alert_003',
      type: 'threshold',
      severity: 'low',
      title: 'Processing Time Increase',
      description: 'Average processing time has increased to 1.8s, above the 1.5s target.',
      timestamp: '2024-03-21T12:00:00Z',
      status: 'resolved',
      metrics: {
        currentValue: 1.8,
        threshold: 1.5,
        trend: 'up'
      },
      affectedModels: ['All Models'],
      actionRequired: 'Monitor system resources and consider scaling.'
    }
  ]);

  const [alertRules, setAlertRules] = useState<AlertRule[]>([
    {
      id: 'rule_001',
      name: 'Model Accuracy Threshold',
      type: 'performance',
      condition: 'accuracy < threshold',
      threshold: 85,
      severity: 'high',
      enabled: true,
      notifications: { email: true, sms: false, slack: true }
    },
    {
      id: 'rule_002',
      name: 'Processing Time Limit',
      type: 'performance',
      condition: 'avg_processing_time > threshold',
      threshold: 2.0,
      severity: 'medium',
      enabled: true,
      notifications: { email: true, sms: false, slack: false }
    },
    {
      id: 'rule_003',
      name: 'Bias Detection',
      type: 'bias',
      condition: 'bias_score < threshold',
      threshold: 85,
      severity: 'high',
      enabled: true,
      notifications: { email: true, sms: true, slack: true }
    }
  ]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'high':
        return 'bg-red-500/10 text-red-600 border-red-500/20';
      case 'medium':
        return 'bg-warning/10 text-warning border-warning/20';
      default:
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return <AlertTriangle className="h-4 w-4" />;
      case 'medium':
        return <Clock className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'acknowledged':
        return <Clock className="h-4 w-4 text-warning" />;
      default:
        return <XCircle className="h-4 w-4 text-destructive" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-destructive" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-destructive" />;
      default:
        return <div className="h-4 w-4" />;
    }
  };

  const handleAlertAction = (alertId: string, action: 'acknowledge' | 'resolve') => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { ...alert, status: action === 'acknowledge' ? 'acknowledged' : 'resolved' }
        : alert
    ));
  };

  const toggleAlertRule = (ruleId: string) => {
    setAlertRules(prev => prev.map(rule =>
      rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
    ));
  };

  const activeAlerts = alerts.filter(alert => alert.status === 'active');
  const acknowledgedAlerts = alerts.filter(alert => alert.status === 'acknowledged');
  const resolvedAlerts = alerts.filter(alert => alert.status === 'resolved');

  return (
    <div className="space-y-6">
      {/* Header with Summary */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">AI Alert Center</h2>
          <p className="text-muted-foreground">
            Monitor AI performance and manage alerts
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Badge variant="destructive" className="h-6">
              {activeAlerts.length} Active
            </Badge>
            <Badge variant="outline" className="h-6 bg-warning/10 text-warning border-warning/20">
              {acknowledgedAlerts.length} Acknowledged
            </Badge>
            <Badge variant="outline" className="h-6 bg-success/10 text-success border-success/20">
              {resolvedAlerts.length} Resolved
            </Badge>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Configure Alerts
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Alert Configuration</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="space-y-3">
                  {alertRules.map((rule) => (
                    <Card key={rule.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <Switch 
                              checked={rule.enabled}
                              onCheckedChange={() => toggleAlertRule(rule.id)}
                            />
                            <div>
                              <div className="font-medium">{rule.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {rule.condition.replace('threshold', rule.threshold.toString())}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className={getSeverityColor(rule.severity)}>
                            {rule.severity}
                          </Badge>
                          <div className="flex space-x-1">
                            {rule.notifications.email && <Mail className="h-4 w-4 text-muted-foreground" />}
                            {rule.notifications.sms && <Smartphone className="h-4 w-4 text-muted-foreground" />}
                            {rule.notifications.slack && <MessageSquare className="h-4 w-4 text-muted-foreground" />}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
                
                <Button className="w-full">
                  <Settings className="h-4 w-4 mr-2" />
                  Add New Alert Rule
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Active Alerts */}
      {activeAlerts.length > 0 && (
        <Card className="border-destructive/20 bg-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              <span>Active Alerts ({activeAlerts.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeAlerts.map((alert) => (
                <Card key={alert.id} className="border-destructive/20">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <Badge variant="outline" className={getSeverityColor(alert.severity)}>
                            {getSeverityIcon(alert.severity)}
                            <span className="ml-1 capitalize">{alert.severity}</span>
                          </Badge>
                          <Badge variant="outline">
                            {alert.type}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {new Date(alert.timestamp).toLocaleString()}
                          </span>
                        </div>
                        
                        <h4 className="font-semibold mb-1">{alert.title}</h4>
                        <p className="text-sm text-muted-foreground mb-3">{alert.description}</p>
                        
                        {alert.metrics && (
                          <div className="flex items-center space-x-4 mb-3">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm">Current:</span>
                              <span className="font-medium">{alert.metrics.currentValue}%</span>
                              {getTrendIcon(alert.metrics.trend)}
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm">Threshold:</span>
                              <span className="font-medium">{alert.metrics.threshold}%</span>
                            </div>
                          </div>
                        )}
                        
                        {alert.actionRequired && (
                          <div className="bg-warning/10 p-3 rounded-lg mb-3">
                            <div className="text-sm font-medium text-warning mb-1">Action Required</div>
                            <div className="text-sm">{alert.actionRequired}</div>
                          </div>
                        )}
                        
                        {alert.affectedModels && (
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-muted-foreground">Affected Models:</span>
                            {alert.affectedModels.map((model, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {model}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex space-x-2 ml-4">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleAlertAction(alert.id, 'acknowledge')}
                        >
                          Acknowledge
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => handleAlertAction(alert.id, 'resolve')}
                        >
                          Resolve
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Alerts History */}
      <Card>
        <CardHeader>
          <CardTitle>Alert History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-4">
                  {getStatusIcon(alert.status)}
                  <div>
                    <div className="font-medium">{alert.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(alert.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className={getSeverityColor(alert.severity)}>
                    {alert.severity}
                  </Badge>
                  <Badge variant="outline" className={
                    alert.status === 'resolved' ? 'bg-success/10 text-success border-success/20' :
                    alert.status === 'acknowledged' ? 'bg-warning/10 text-warning border-warning/20' :
                    'bg-destructive/10 text-destructive border-destructive/20'
                  }>
                    {alert.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}