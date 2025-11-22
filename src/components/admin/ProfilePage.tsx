import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User, Bell, Shield, Settings, Upload, Save, Mail, Phone, MapPin, Globe, Clock, Palette, Eye, CalendarCheck, Link as LinkIcon, Database, Sparkles, AlertCircle } from "lucide-react";
import { useMvpMode } from "@/contexts/MvpModeContext";
import { useUserSettings } from "@/hooks/useUserSettings";
import { DemoDataService, useDemoDataAccess } from "@/services/demoDataService";
import { useQueryClient } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ProfileData {
  id?: string;
  user_id?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  title?: string;
  department?: string;
  bio?: string;
  avatar_url?: string;
  timezone?: string;
  language?: string;
  theme_preference?: string;
  notification_email?: boolean;
  notification_sms?: boolean;
  notification_in_app?: boolean;
}

const ProfilePage: React.FC = () => {
  const { toast } = useToast();
  const { isMvpMode, toggleMvpMode } = useMvpMode();
  const [loading, setLoading] = useState(false);
  const { settings, updateSettings, connectOutlook, disconnectOutlook, loading: settingsLoading } = useUserSettings();
  const [emailSignature, setEmailSignature] = useState('');
  const [showDemoConfirm, setShowDemoConfirm] = useState(false);
  const [demoActionType, setDemoActionType] = useState<'enable' | 'disable'>('enable');
  const queryClient = useQueryClient();
  const { data: hasDemoAccess, isLoading: isDemoLoading } = useDemoDataAccess();
  const [profileData, setProfileData] = useState<ProfileData>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    title: '',
    department: '',
    bio: '',
    timezone: 'UTC',
    language: 'en',
    theme_preference: 'light',
    notification_email: true,
    notification_sms: false,
    notification_in_app: true,
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (settings?.email_signature) {
      setEmailSignature(settings.email_signature);
    }
  }, [settings]);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        return;
      }

      if (data) {
        setProfileData(data);
      } else {
        // Create default profile if none exists
        setProfileData(prev => ({
          ...prev,
          user_id: user.id,
          email: user.email || '',
        }));
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const updateData = {
        ...profileData,
        user_id: user.id,
      };

      const { error } = await supabase
        .from('profiles')
        .upsert(updateData);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been saved successfully.",
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof ProfileData, value: any) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveSignature = async () => {
    await updateSettings({ email_signature: emailSignature });
  };

  const handleConnectOutlook = async () => {
    await connectOutlook();
  };

  const handleDisconnectOutlook = async () => {
    try {
      await disconnectOutlook();
      toast({
        title: "Outlook Disconnected",
        description: "Your Outlook account has been disconnected successfully.",
      });
    } catch (error) {
      console.error('Error disconnecting Outlook:', error);
      toast({
        title: "Error",
        description: "Failed to disconnect Outlook account.",
        variant: "destructive",
      });
    }
  };

  const handleToggleDemoMode = (enable: boolean) => {
    setDemoActionType(enable ? 'enable' : 'disable');
    setShowDemoConfirm(true);
  };

  const handleConfirmDemoToggle = async () => {
    try {
      const enable = demoActionType === 'enable';
      const success = await DemoDataService.assignDemoDataToUser(
        profileData.email || '',
        enable
      );

      if (success) {
        // Invalidate all data queries to refresh with/without demo data
        queryClient.invalidateQueries();
        
        toast({
          title: enable ? "Demo Mode Enabled" : "Demo Mode Disabled",
          description: enable 
            ? "Sample data has been imported. Refresh the page to see the changes."
            : "Demo data has been removed. Your real data is now displayed.",
        });

        // Reload the page to show updated data
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        toast({
          title: "Error",
          description: "Failed to toggle demo mode. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error toggling demo mode:', error);
      toast({
        title: "Error",
        description: "An error occurred while toggling demo mode.",
        variant: "destructive",
      });
    }
    setShowDemoConfirm(false);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your account settings and preferences
          </p>
        </div>
        <Button onClick={handleSave} disabled={loading} className="gap-2">
          <Save className="h-4 w-4" />
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
          <TabsTrigger value="personal" className="gap-2">
            <User className="h-4 w-4" />
            Personal
          </TabsTrigger>
          <TabsTrigger value="email" className="gap-2">
            <Mail className="h-4 w-4" />
            Email
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="preferences" className="gap-2">
            <Settings className="h-4 w-4" />
            Preferences
          </TabsTrigger>
        </TabsList>

        {/* Personal Information Tab */}
        <TabsContent value="personal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal details and profile information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profileData.avatar_url} />
                  <AvatarFallback className="text-lg">
                    {profileData.first_name?.[0]}{profileData.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Upload className="h-4 w-4" />
                    Change Photo
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    JPG, GIF or PNG. 1MB max.
                  </p>
                </div>
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={profileData.first_name || ''}
                    onChange={(e) => handleInputChange('first_name', e.target.value)}
                    placeholder="Enter your first name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={profileData.last_name || ''}
                    onChange={(e) => handleInputChange('last_name', e.target.value)}
                    placeholder="Enter your last name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email || ''}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Enter your email"
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      value={profileData.phone || ''}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="Enter your phone number"
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title</Label>
                  <Input
                    id="title"
                    value={profileData.title || ''}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter your job title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={profileData.department || ''}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    placeholder="Enter your department"
                  />
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profileData.bio || ''}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Tell us about yourself..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email & Integrations Tab */}
        <TabsContent value="email" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Signature</CardTitle>
              <CardDescription>
                Add a personal signature to your outgoing emails
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signature">Signature</Label>
                <Textarea
                  id="signature"
                  value={emailSignature}
                  onChange={(e) => setEmailSignature(e.target.value)}
                  placeholder="Best regards,&#10;Your Name&#10;Your Title&#10;Your Company"
                  rows={6}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  This signature will be automatically added to emails sent through the system
                </p>
              </div>
              <Button onClick={handleSaveSignature} disabled={settingsLoading}>
                <Save className="h-4 w-4 mr-2" />
                Save Signature
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarCheck className="h-5 w-5" />
                Outlook Calendar & Email Integration
              </CardTitle>
              <CardDescription>
                Connect your personal Outlook account to sync calendar and send emails
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {settings?.outlook_connected ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                      <div>
                        <p className="font-medium">Connected to Outlook</p>
                        <p className="text-sm text-muted-foreground">
                          {settings.outlook_email}
                        </p>
                      </div>
                    </div>
                    <Badge variant="default">Active</Badge>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Permissions</Label>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span>Read and write calendar events</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span>Send emails on your behalf</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span>Read your email messages</span>
                      </div>
                    </div>
                  </div>

                  <Button 
                    variant="destructive" 
                    onClick={handleDisconnectOutlook}
                    disabled={settingsLoading}
                  >
                    <LinkIcon className="h-4 w-4 mr-2" />
                    Disconnect Outlook
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg border border-dashed">
                    <div className="flex items-start gap-3">
                      <CalendarCheck className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div className="space-y-2">
                        <p className="text-sm font-medium">No Outlook account connected</p>
                        <p className="text-sm text-muted-foreground">
                          Connect your personal Outlook account to:
                        </p>
                        <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                          <li>• Sync calendar events automatically</li>
                          <li>• Send emails directly from Outlook</li>
                          <li>• Access your contacts and meetings</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={handleConnectOutlook}
                    disabled={settingsLoading}
                    className="gap-2"
                  >
                    <LinkIcon className="h-4 w-4" />
                    Connect Outlook Account
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose how you want to be notified about important updates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch
                    checked={profileData.notification_email}
                    onCheckedChange={(checked) => handleInputChange('notification_email', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via SMS
                    </p>
                  </div>
                  <Switch
                    checked={profileData.notification_sms}
                    onCheckedChange={(checked) => handleInputChange('notification_sms', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">In-App Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications within the application
                    </p>
                  </div>
                  <Switch
                    checked={profileData.notification_in_app}
                    onCheckedChange={(checked) => handleInputChange('notification_in_app', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your account security and authentication
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <h4 className="font-medium">Password</h4>
                    <p className="text-sm text-muted-foreground">
                      Last changed 3 months ago
                    </p>
                  </div>
                  <Button variant="outline">Change Password</Button>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <h4 className="font-medium">Two-Factor Authentication</h4>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Badge variant="secondary">Not Enabled</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Application Preferences</CardTitle>
              <CardDescription>
                Customize your application experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Select
                      value={profileData.timezone}
                      onValueChange={(value) => handleInputChange('timezone', value)}
                    >
                      <SelectTrigger className="pl-10">
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="America/New_York">Eastern Time</SelectItem>
                        <SelectItem value="America/Chicago">Central Time</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Select
                      value={profileData.language}
                      onValueChange={(value) => handleInputChange('language', value)}
                    >
                      <SelectTrigger className="pl-10">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme Preference</Label>
                  <Select
                    value={profileData.theme_preference}
                    onValueChange={(value) => handleInputChange('theme_preference', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* View Mode Toggle */}
              <div className="mt-8 p-6 border border-border rounded-lg bg-muted/30">
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2">
                      <Eye className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold">View Mode</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant={isMvpMode ? "default" : "secondary"} className="text-xs">
                          {isMvpMode ? "MVP Mode" : "Full Mode"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {isMvpMode 
                          ? "Streamlined view with essential features only. Advanced practicum and recruiter management features are hidden."
                          : "Complete view with all features including practicum management, recruiter tools, and advanced analytics."
                        }
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-medium">{isMvpMode ? "MVP" : "Full"}</p>
                      <p className="text-xs text-muted-foreground">Mode</p>
                    </div>
                    <Switch
                      checked={!isMvpMode}
                      onCheckedChange={() => toggleMvpMode()}
                      className="data-[state=checked]:bg-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Demo Mode Section */}
              <div className="mt-6 p-6 border border-border rounded-lg bg-muted/30">
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-2">
                        <Database className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-semibold">Demo Mode</h3>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant={hasDemoAccess ? "default" : "secondary"} className="text-xs">
                            {isDemoLoading ? "Checking..." : hasDemoAccess ? "Enabled" : "Disabled"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {hasDemoAccess 
                            ? "Demo data is currently active. Sample data is displayed when you don't have real data."
                            : "Demo mode is disabled. You'll see empty states until you add your own data."
                          }
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm font-medium">{hasDemoAccess ? "On" : "Off"}</p>
                        <p className="text-xs text-muted-foreground">Status</p>
                      </div>
                      <Switch
                        checked={hasDemoAccess || false}
                        onCheckedChange={handleToggleDemoMode}
                        disabled={isDemoLoading}
                        className="data-[state=checked]:bg-primary"
                      />
                    </div>
                  </div>

                  {/* Info Box */}
                  <div className="flex gap-3 p-4 rounded-lg bg-background/50 border border-border/50">
                    <Sparkles className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div className="space-y-2 flex-1">
                      <p className="text-sm font-medium">What is Demo Mode?</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Demo mode imports sample data to showcase the full capabilities of the CRM. This includes sample leads, students, programs, communications, financial records, events, and more.
                      </p>
                      <div className="mt-3 pt-3 border-t border-border/50">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                          <p className="text-xs text-muted-foreground">
                            Your real data remains unchanged. Demo data is automatically hidden once you add your own data.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sample Data List */}
                  {hasDemoAccess && (
                    <div className="p-4 rounded-lg bg-background/30 border border-border/30">
                      <p className="text-sm font-medium mb-3">Includes Sample Data:</p>
                      <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          <span>15+ Sample Leads</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          <span>10+ Students</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          <span>5+ Programs</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          <span>Sample Communications</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          <span>Financial Records</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          <span>Events & More</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Demo Mode Confirmation Dialog */}
      <AlertDialog open={showDemoConfirm} onOpenChange={setShowDemoConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {demoActionType === 'enable' ? 'Enable Demo Mode?' : 'Disable Demo Mode?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {demoActionType === 'enable' 
                ? 'This will import sample data across all sections of the CRM to showcase its capabilities. Your real data will remain unchanged and will take priority over demo data.'
                : 'This will remove access to demo data. You will see empty states in sections where you haven\'t added your own data yet.'
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDemoToggle}>
              {demoActionType === 'enable' ? 'Enable Demo Mode' : 'Disable Demo Mode'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProfilePage;