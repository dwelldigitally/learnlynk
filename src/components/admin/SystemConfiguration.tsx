import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Settings, 
  Building, 
  Palette,
  Calendar,
  Mail,
  Phone,
  Globe,
  Upload,
  Save,
  Database,
  Shield,
  Bell
} from "lucide-react";

const SystemConfiguration: React.FC = () => {
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const campuses = [
    {
      id: "1",
      name: "Surrey Campus",
      address: "13450 102 Ave, Surrey, BC V3T 0A3",
      phone: "(604) 930-5447",
      isMain: true,
      programs: ["Health Care Assistant", "Early Childhood Education"]
    },
    {
      id: "2", 
      name: "Vancouver Campus",
      address: "788 W Broadway, Vancouver, BC V5Z 1K1",
      phone: "(604) 734-4488",
      isMain: false,
      programs: ["Education Assistant", "Business Administration"]
    },
    {
      id: "3",
      name: "Richmond Campus", 
      address: "8800 Cambie Rd, Richmond, BC V6X 3X9",
      phone: "(604) 278-6161",
      isMain: false,
      programs: ["Aviation Maintenance"]
    }
  ];

  const integrations = [
    {
      name: "Google Calendar",
      description: "Sync events and appointments with Google Calendar",
      status: "connected",
      lastSync: "2 hours ago"
    },
    {
      name: "Microsoft Outlook",
      description: "Integrate with Outlook for email and calendar",
      status: "disconnected",
      lastSync: "Never"
    },
    {
      name: "Stripe",
      description: "Process payments securely with Stripe",
      status: "connected", 
      lastSync: "Active"
    },
    {
      name: "HubSpot CRM",
      description: "Sync lead and customer data with HubSpot",
      status: "connected",
      lastSync: "5 minutes ago"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">System Configuration</h1>
          <p className="text-muted-foreground">Configure organization settings and integrations</p>
        </div>
        <Button>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="organization" className="space-y-4">
        <TabsList>
          <TabsTrigger value="organization">Organization</TabsTrigger>
          <TabsTrigger value="campuses">Campuses</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="organization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Organization Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Organization Name</Label>
                  <Input value="West Coast College" />
                </div>
                <div className="space-y-2">
                  <Label>Short Name</Label>
                  <Input value="WCC" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Mission Statement</Label>
                <Textarea 
                  value="Empowering students with practical skills and knowledge for successful careers in healthcare, education, and technical fields."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Website URL</Label>
                  <Input value="https://westcoastcollege.ca" />
                </div>
                <div className="space-y-2">
                  <Label>Main Phone</Label>
                  <Input value="(604) 930-5447" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Admin Email</Label>
                  <Input value="admin@westcoastcollege.ca" />
                </div>
                <div className="space-y-2">
                  <Label>Support Email</Label>
                  <Input value="support@westcoastcollege.ca" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>About Us Content</Label>
                <Textarea 
                  value="West Coast College has been providing quality education and training for over 20 years. We offer hands-on learning experiences that prepare students for immediate employment in their chosen fields."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campuses" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Campus Management</CardTitle>
                <Button>
                  <Building className="h-4 w-4 mr-2" />
                  Add Campus
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campuses.map((campus) => (
                  <div key={campus.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{campus.name}</h3>
                          {campus.isMain && <Badge>Main Campus</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground">{campus.address}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="outline" size="sm">Delete</Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Phone</p>
                        <p className="font-medium">{campus.phone}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Programs Offered</p>
                        <p className="font-medium">{campus.programs.length}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Programs:</p>
                      <div className="flex flex-wrap gap-1">
                        {campus.programs.map((program, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {program}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branding" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Brand Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label>Organization Logo</Label>
                  <div className="mt-2 flex items-center space-x-4">
                    <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center">
                      <span className="text-primary-foreground font-bold">WCC</span>
                    </div>
                    <div>
                      <Button variant="outline">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload New Logo
                      </Button>
                      <p className="text-xs text-muted-foreground mt-1">
                        Recommended: 200x200px, PNG or SVG
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Primary Color</Label>
                    <div className="flex items-center space-x-2">
                      <Input type="color" value="#2563eb" className="w-16 h-10" />
                      <Input value="#2563eb" className="flex-1" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Secondary Color</Label>
                    <div className="flex items-center space-x-2">
                      <Input type="color" value="#10b981" className="w-16 h-10" />
                      <Input value="#10b981" className="flex-1" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Favicon</Label>
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                      <span className="text-primary-foreground font-bold text-xs">W</span>
                    </div>
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Favicon
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>External Integrations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {integrations.map((integration, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${
                        integration.status === 'connected' ? 'bg-green-500' : 'bg-gray-400'
                      }`}></div>
                      <div>
                        <h3 className="font-medium">{integration.name}</h3>
                        <p className="text-sm text-muted-foreground">{integration.description}</p>
                        <p className="text-xs text-muted-foreground">
                          Last sync: {integration.lastSync}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={integration.status === 'connected' ? 'default' : 'secondary'}>
                        {integration.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        {integration.status === 'connected' ? 'Configure' : 'Connect'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { 
                  title: "New Application Notifications",
                  description: "Notify team when new applications are submitted",
                  enabled: true
                },
                {
                  title: "Document Upload Alerts", 
                  description: "Alert when students upload new documents",
                  enabled: true
                },
                {
                  title: "Payment Confirmations",
                  description: "Send notifications when payments are received",
                  enabled: true
                },
                {
                  title: "Deadline Reminders",
                  description: "Remind students of upcoming deadlines",
                  enabled: false
                },
                {
                  title: "System Maintenance Alerts",
                  description: "Notify users of scheduled maintenance",
                  enabled: true
                }
              ].map((setting, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{setting.title}</h4>
                    <p className="text-sm text-muted-foreground">{setting.description}</p>
                  </div>
                  <Switch checked={setting.enabled} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Two-Factor Authentication</h4>
                    <p className="text-sm text-muted-foreground">Require 2FA for all admin users</p>
                  </div>
                  <Switch checked={true} />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Session Timeout</h4>
                    <p className="text-sm text-muted-foreground">Auto-logout inactive users</p>
                  </div>
                  <Select defaultValue="30">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Data Encryption</h4>
                    <p className="text-sm text-muted-foreground">Encrypt sensitive student data</p>
                  </div>
                  <Switch checked={true} disabled />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Audit Logging</h4>
                    <p className="text-sm text-muted-foreground">Log all admin actions</p>
                  </div>
                  <Switch checked={true} />
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">Data Backup</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Last Backup</p>
                    <p className="font-medium">2 hours ago</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Backup Frequency</p>
                    <p className="font-medium">Every 6 hours</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="mt-2">
                  <Database className="h-4 w-4 mr-2" />
                  Create Backup Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemConfiguration;