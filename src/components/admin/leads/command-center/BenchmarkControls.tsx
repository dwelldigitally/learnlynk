import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { 
  Clock, 
  Target, 
  Settings, 
  Bell,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Save,
  RotateCcw,
  Zap,
  Users,
  DollarSign,
  Calendar,
  Phone,
  Mail
} from "lucide-react";

export function BenchmarkControls() {
  const [benchmarks, setBenchmarks] = useState({
    responseTime: {
      firstResponse: 24, // hours
      followUp: 72, // hours
      qualification: 7, // days
      enabled: true
    },
    conversion: {
      leadToQualified: 15, // percentage
      qualifiedToStudent: 25, // percentage
      overallTarget: 12, // percentage
      enabled: true
    },
    activity: {
      dailyContacts: 15,
      weeklyFollowUps: 25,
      monthlyConversions: 8,
      enabled: true
    },
    quality: {
      minCallDuration: 10, // minutes
      requiredFollowUps: 3,
      documentationScore: 80, // percentage
      enabled: true
    }
  });

  const [alertSettings, setAlertSettings] = useState({
    responseViolations: true,
    conversionDrops: true,
    qualityIssues: true,
    teamUtilization: true,
    emailNotifications: true,
    slackIntegration: false,
    escalationRules: true
  });

  const currentPerformance = {
    responseCompliance: 87,
    conversionRate: 14.7,
    qualityScore: 8.6,
    teamUtilization: 78,
    activeViolations: 5
  };

  const updateBenchmark = (category: string, field: string, value: any) => {
    setBenchmarks(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const resetToDefaults = () => {
    setBenchmarks({
      responseTime: {
        firstResponse: 24,
        followUp: 72,
        qualification: 7,
        enabled: true
      },
      conversion: {
        leadToQualified: 15,
        qualifiedToStudent: 25,
        overallTarget: 12,
        enabled: true
      },
      activity: {
        dailyContacts: 15,
        weeklyFollowUps: 25,
        monthlyConversions: 8,
        enabled: true
      },
      quality: {
        minCallDuration: 10,
        requiredFollowUps: 3,
        documentationScore: 80,
        enabled: true
      }
    });
  };

  const getComplianceColor = (actual: number, target: number) => {
    if (actual >= target) return "text-green-600";
    if (actual >= target * 0.8) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Benchmark Performance Overview
          </CardTitle>
          <CardDescription>
            Current performance against established benchmarks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{currentPerformance.responseCompliance}%</div>
              <div className="text-sm text-muted-foreground">Response Compliance</div>
              <Badge className={`mt-1 ${currentPerformance.responseCompliance >= 90 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                Target: 90%
              </Badge>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{currentPerformance.conversionRate}%</div>
              <div className="text-sm text-muted-foreground">Conversion Rate</div>
              <Badge className={`mt-1 ${currentPerformance.conversionRate >= benchmarks.conversion.overallTarget ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                Target: {benchmarks.conversion.overallTarget}%
              </Badge>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{currentPerformance.qualityScore}/10</div>
              <div className="text-sm text-muted-foreground">Quality Score</div>
              <Badge className={`mt-1 ${currentPerformance.qualityScore >= 8 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                Target: 8.0
              </Badge>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{currentPerformance.teamUtilization}%</div>
              <div className="text-sm text-muted-foreground">Team Utilization</div>
              <Badge className={`mt-1 ${currentPerformance.teamUtilization >= 75 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                Target: 75%
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Benchmark Configuration */}
      <Tabs defaultValue="response" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="response">Response SLAs</TabsTrigger>
          <TabsTrigger value="conversion">Conversion Targets</TabsTrigger>
          <TabsTrigger value="activity">Activity Goals</TabsTrigger>
          <TabsTrigger value="alerts">Alert Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="response" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Response Time Benchmarks
                </CardTitle>
                <Switch 
                  checked={benchmarks.responseTime.enabled}
                  onCheckedChange={(checked) => updateBenchmark('responseTime', 'enabled', checked)}
                />
              </div>
              <CardDescription>
                Set maximum response times for different interaction stages
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstResponse">First Response (hours)</Label>
                  <Input
                    id="firstResponse"
                    type="number"
                    value={benchmarks.responseTime.firstResponse}
                    onChange={(e) => updateBenchmark('responseTime', 'firstResponse', parseInt(e.target.value))}
                  />
                  <p className="text-xs text-muted-foreground">
                    Maximum time to respond to new leads
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="followUp">Follow-up Response (hours)</Label>
                  <Input
                    id="followUp"
                    type="number"
                    value={benchmarks.responseTime.followUp}
                    onChange={(e) => updateBenchmark('responseTime', 'followUp', parseInt(e.target.value))}
                  />
                  <p className="text-xs text-muted-foreground">
                    Maximum time between follow-up communications
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="qualification">Qualification Period (days)</Label>
                  <Input
                    id="qualification"
                    type="number"
                    value={benchmarks.responseTime.qualification}
                    onChange={(e) => updateBenchmark('responseTime', 'qualification', parseInt(e.target.value))}
                  />
                  <p className="text-xs text-muted-foreground">
                    Maximum time to complete lead qualification
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conversion" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Conversion Rate Targets
                </CardTitle>
                <Switch 
                  checked={benchmarks.conversion.enabled}
                  onCheckedChange={(checked) => updateBenchmark('conversion', 'enabled', checked)}
                />
              </div>
              <CardDescription>
                Define minimum conversion rates for each stage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <Label>Lead to Qualified (%)</Label>
                  <div className="px-3">
                    <Slider
                      value={[benchmarks.conversion.leadToQualified]}
                      onValueChange={(value) => updateBenchmark('conversion', 'leadToQualified', value[0])}
                      max={50}
                      min={5}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  <div className="text-center text-sm font-medium">
                    {benchmarks.conversion.leadToQualified}%
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Label>Qualified to Student (%)</Label>
                  <div className="px-3">
                    <Slider
                      value={[benchmarks.conversion.qualifiedToStudent]}
                      onValueChange={(value) => updateBenchmark('conversion', 'qualifiedToStudent', value[0])}
                      max={60}
                      min={10}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  <div className="text-center text-sm font-medium">
                    {benchmarks.conversion.qualifiedToStudent}%
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Label>Overall Target (%)</Label>
                  <div className="px-3">
                    <Slider
                      value={[benchmarks.conversion.overallTarget]}
                      onValueChange={(value) => updateBenchmark('conversion', 'overallTarget', value[0])}
                      max={25}
                      min={5}
                      step={0.5}
                      className="w-full"
                    />
                  </div>
                  <div className="text-center text-sm font-medium">
                    {benchmarks.conversion.overallTarget}%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Activity Benchmarks
                </CardTitle>
                <Switch 
                  checked={benchmarks.activity.enabled}
                  onCheckedChange={(checked) => updateBenchmark('activity', 'enabled', checked)}
                />
              </div>
              <CardDescription>
                Set minimum activity levels for team members
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="dailyContacts">Daily Contacts</Label>
                  <Input
                    id="dailyContacts"
                    type="number"
                    value={benchmarks.activity.dailyContacts}
                    onChange={(e) => updateBenchmark('activity', 'dailyContacts', parseInt(e.target.value))}
                  />
                  <p className="text-xs text-muted-foreground">
                    Minimum leads contacted per day
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="weeklyFollowUps">Weekly Follow-ups</Label>
                  <Input
                    id="weeklyFollowUps"
                    type="number"
                    value={benchmarks.activity.weeklyFollowUps}
                    onChange={(e) => updateBenchmark('activity', 'weeklyFollowUps', parseInt(e.target.value))}
                  />
                  <p className="text-xs text-muted-foreground">
                    Minimum follow-up communications per week
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="monthlyConversions">Monthly Conversions</Label>
                  <Input
                    id="monthlyConversions"
                    type="number"
                    value={benchmarks.activity.monthlyConversions}
                    onChange={(e) => updateBenchmark('activity', 'monthlyConversions', parseInt(e.target.value))}
                  />
                  <p className="text-xs text-muted-foreground">
                    Minimum conversions per month
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Alert & Notification Settings
              </CardTitle>
              <CardDescription>
                Configure when and how to receive alerts for benchmark violations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Alert Triggers</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="responseViolations">Response Time Violations</Label>
                      <Switch 
                        id="responseViolations"
                        checked={alertSettings.responseViolations}
                        onCheckedChange={(checked) => setAlertSettings(prev => ({...prev, responseViolations: checked}))}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="conversionDrops">Conversion Rate Drops</Label>
                      <Switch 
                        id="conversionDrops"
                        checked={alertSettings.conversionDrops}
                        onCheckedChange={(checked) => setAlertSettings(prev => ({...prev, conversionDrops: checked}))}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="qualityIssues">Quality Score Issues</Label>
                      <Switch 
                        id="qualityIssues"
                        checked={alertSettings.qualityIssues}
                        onCheckedChange={(checked) => setAlertSettings(prev => ({...prev, qualityIssues: checked}))}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="teamUtilization">Team Utilization Alerts</Label>
                      <Switch 
                        id="teamUtilization"
                        checked={alertSettings.teamUtilization}
                        onCheckedChange={(checked) => setAlertSettings(prev => ({...prev, teamUtilization: checked}))}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium">Notification Channels</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="emailNotifications">Email Notifications</Label>
                      <Switch 
                        id="emailNotifications"
                        checked={alertSettings.emailNotifications}
                        onCheckedChange={(checked) => setAlertSettings(prev => ({...prev, emailNotifications: checked}))}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="slackIntegration">Slack Integration</Label>
                      <Switch 
                        id="slackIntegration"
                        checked={alertSettings.slackIntegration}
                        onCheckedChange={(checked) => setAlertSettings(prev => ({...prev, slackIntegration: checked}))}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="escalationRules">Escalation Rules</Label>
                      <Switch 
                        id="escalationRules"
                        checked={alertSettings.escalationRules}
                        onCheckedChange={(checked) => setAlertSettings(prev => ({...prev, escalationRules: checked}))}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={resetToDefaults}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset to Defaults
        </Button>
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Advanced Settings
          </Button>
          <Button>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}