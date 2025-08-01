import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  Database, 
  Download, 
  Upload, 
  History, 
  Settings,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

export const AdvancedSettings = () => {
  const [settings, setSettings] = useState({
    dataRetention: '365',
    auditLogging: true,
    backupFrequency: 'daily',
    anonymization: false,
    apiRateLimit: '1000',
    maintenanceMode: false
  });

  const DataMappings = () => (
    <div className="space-y-4">
      <div>
        <h4 className="text-lg font-medium">Field Mappings</h4>
        <p className="text-sm text-muted-foreground">Configure how data maps between different systems</p>
      </div>
      
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">CRM Integration Mappings</CardTitle>
            <CardDescription>Map internal fields to external CRM fields</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Internal Field</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select internal field" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="first_name">First Name</SelectItem>
                      <SelectItem value="last_name">Last Name</SelectItem>
                      <SelectItem value="email">Email Address</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>External Field</Label>
                  <Input placeholder="External field name" />
                </div>
              </div>
              <Button variant="outline" size="sm">Add Mapping</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const BackupRestore = () => (
    <div className="space-y-4">
      <div>
        <h4 className="text-lg font-medium">Backup & Restore</h4>
        <p className="text-sm text-muted-foreground">Manage system backups and data recovery</p>
      </div>
      
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Backup Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Backup Frequency</Label>
                <Select value={settings.backupFrequency}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Retention Period (days)</Label>
                <Input value={settings.dataRetention} />
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button className="flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Create Backup</span>
              </Button>
              <Button variant="outline" className="flex items-center space-x-2">
                <Upload className="h-4 w-4" />
                <span>Restore Backup</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Backups</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {['2024-01-15 09:00', '2024-01-14 09:00', '2024-01-13 09:00'].map((date, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded">
                  <span className="text-sm">{date}</span>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">Download</Button>
                    <Button variant="outline" size="sm">Restore</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const AuditTrail = () => (
    <div className="space-y-4">
      <div>
        <h4 className="text-lg font-medium">Audit & Compliance</h4>
        <p className="text-sm text-muted-foreground">Configure audit logging and compliance settings</p>
      </div>
      
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Audit Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Enable Audit Logging</Label>
                <p className="text-sm text-muted-foreground">Track all user actions and data changes</p>
              </div>
              <Switch checked={settings.auditLogging} />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Data Anonymization</Label>
                <p className="text-sm text-muted-foreground">Anonymize sensitive data in logs</p>
              </div>
              <Switch checked={settings.anonymization} />
            </div>
            
            <div>
              <Label>Log Retention (days)</Label>
              <Input value="90" placeholder="Number of days" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                'User login: admin@university.edu',
                'Database backup completed',
                'Integration settings updated',
                'Custom field created: Emergency Contact'
              ].map((activity, index) => (
                <div key={index} className="flex items-center space-x-2 p-2 border rounded text-sm">
                  <History className="h-4 w-4 text-muted-foreground" />
                  <span>{activity}</span>
                  <span className="text-muted-foreground ml-auto">2 hours ago</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const SystemConfig = () => (
    <div className="space-y-4">
      <div>
        <h4 className="text-lg font-medium">System Configuration</h4>
        <p className="text-sm text-muted-foreground">Global system settings and performance tuning</p>
      </div>
      
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Performance Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>API Rate Limit (requests/hour)</Label>
              <Input value={settings.apiRateLimit} />
            </div>
            
            <div>
              <Label>Session Timeout (minutes)</Label>
              <Input value="60" />
            </div>
            
            <div>
              <Label>Max File Upload Size (MB)</Label>
              <Input value="10" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Maintenance Mode</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">Temporarily disable user access for maintenance</p>
                </div>
                <Switch checked={settings.maintenanceMode} />
              </div>
              
              {settings.maintenanceMode && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Maintenance mode is currently enabled. Users will see a maintenance page.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Database Connection</span>
                <div className="flex items-center space-x-1">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600">Connected</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span>External Integrations</span>
                <div className="flex items-center space-x-1">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600">Active</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span>Email Service</span>
                <div className="flex items-center space-x-1">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600">Operational</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Advanced Settings</h3>
          <p className="text-sm text-muted-foreground">
            System-wide configurations, data mappings, and maintenance tools
          </p>
        </div>
        <Button variant="outline" className="flex items-center space-x-2">
          <Settings className="h-4 w-4" />
          <span>Export Settings</span>
        </Button>
      </div>

      <Tabs defaultValue="mappings" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="mappings">Data Mappings</TabsTrigger>
          <TabsTrigger value="backup">Backup & Restore</TabsTrigger>
          <TabsTrigger value="audit">Audit Trail</TabsTrigger>
          <TabsTrigger value="system">System Config</TabsTrigger>
        </TabsList>

        <TabsContent value="mappings">
          <DataMappings />
        </TabsContent>

        <TabsContent value="backup">
          <BackupRestore />
        </TabsContent>

        <TabsContent value="audit">
          <AuditTrail />
        </TabsContent>

        <TabsContent value="system">
          <SystemConfig />
        </TabsContent>
      </Tabs>
    </div>
  );
};