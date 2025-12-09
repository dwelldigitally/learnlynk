import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, 
  Users, 
  Mail, 
  Bell,
  Eye,
  Star,
  Globe,
  RotateCcw,
  Power
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Program {
  id: string;
  name: string;
  status: string;
  enrollment_status?: string;
  metadata?: Record<string, unknown> | null;
}

interface ProgramSettings {
  is_active: boolean;
  waitlist_enabled: boolean;
  contact_email: string;
  email_notifications: boolean;
  publicly_visible: boolean;
  featured_program: boolean;
  allow_online_applications: boolean;
}

interface ProgramSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  program: Program | null;
  onSettingsSaved?: () => void;
}

const DEFAULT_SETTINGS: ProgramSettings = {
  is_active: true,
  waitlist_enabled: true,
  contact_email: "",
  email_notifications: true,
  publicly_visible: true,
  featured_program: false,
  allow_online_applications: true,
};

export const ProgramSettingsModal = ({ isOpen, onClose, program, onSettingsSaved }: ProgramSettingsModalProps) => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<ProgramSettings>(DEFAULT_SETTINGS);
  const [isSaving, setIsSaving] = useState(false);

  // Load settings from program metadata when modal opens
  useEffect(() => {
    if (program && isOpen) {
      const metadata = program.metadata as Record<string, unknown> | null;
      const savedSettings = metadata?.settings as Partial<ProgramSettings> | undefined;
      
      // Determine if program is active from enrollment_status or metadata
      const isActive = program.enrollment_status === 'open' || 
                       (metadata?.status === 'active') ||
                       program.status === 'active';
      
      setSettings({
        is_active: savedSettings?.is_active ?? isActive,
        waitlist_enabled: savedSettings?.waitlist_enabled ?? DEFAULT_SETTINGS.waitlist_enabled,
        contact_email: savedSettings?.contact_email ?? DEFAULT_SETTINGS.contact_email,
        email_notifications: savedSettings?.email_notifications ?? DEFAULT_SETTINGS.email_notifications,
        publicly_visible: savedSettings?.publicly_visible ?? DEFAULT_SETTINGS.publicly_visible,
        featured_program: savedSettings?.featured_program ?? DEFAULT_SETTINGS.featured_program,
        allow_online_applications: savedSettings?.allow_online_applications ?? DEFAULT_SETTINGS.allow_online_applications,
      });
    }
  }, [program, isOpen]);

  const handleSettingChange = (key: keyof ProgramSettings, value: boolean | string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = async () => {
    if (!program) return;
    
    setIsSaving(true);
    try {
      // Get existing metadata and merge with new settings
      const existingMetadata = (program.metadata as Record<string, unknown>) || {};
      const updatedMetadata = {
        ...existingMetadata,
        status: settings.is_active ? 'active' : 'draft',
        settings: {
          is_active: settings.is_active,
          waitlist_enabled: settings.waitlist_enabled,
          contact_email: settings.contact_email,
          email_notifications: settings.email_notifications,
          publicly_visible: settings.publicly_visible,
          featured_program: settings.featured_program,
          allow_online_applications: settings.allow_online_applications,
        },
      };

      // Update both enrollment_status and metadata
      const { error } = await supabase
        .from('programs')
        .update({ 
          enrollment_status: settings.is_active ? 'open' : 'closed',
          metadata: updatedMetadata as unknown as Record<string, never> 
        })
        .eq('id', program.id);

      if (error) throw error;

      toast({
        title: "Settings Saved",
        description: "Program settings have been updated successfully.",
      });
      
      onSettingsSaved?.();
      onClose();
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    toast({
      title: "Settings Reset",
      description: "All settings have been reset to defaults.",
    });
  };

  if (!program) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            <DialogTitle>Program Settings</DialogTitle>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{program.name}</p>
        </DialogHeader>

        <Card className="border-border/50">
          <CardContent className="pt-6 space-y-5">
            {/* Program Active Status - First and prominent */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${settings.is_active ? 'bg-success/20' : 'bg-muted'}`}>
                  <Power className={`h-4 w-4 ${settings.is_active ? 'text-success' : 'text-muted-foreground'}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <Label className="font-medium">Program Status</Label>
                    <Badge variant={settings.is_active ? "default" : "secondary"} className={settings.is_active ? "bg-success text-success-foreground" : ""}>
                      {settings.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {settings.is_active ? "Program is accepting applications" : "Program is not accepting applications"}
                  </p>
                </div>
              </div>
              <Switch
                checked={settings.is_active}
                onCheckedChange={(value) => handleSettingChange('is_active', value)}
              />
            </div>

            {/* Enable Waitlist */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <Label className="font-medium">Enable Waitlist</Label>
                  <p className="text-xs text-muted-foreground">
                    Allow students to join waitlist when full
                  </p>
                </div>
              </div>
              <Switch
                checked={settings.waitlist_enabled}
                onCheckedChange={(value) => handleSettingChange('waitlist_enabled', value)}
              />
            </div>

            {/* Contact Email */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <Label className="font-medium">Contact Email for Inquiries</Label>
              </div>
              <Input
                type="email"
                value={settings.contact_email}
                onChange={(e) => handleSettingChange('contact_email', e.target.value)}
                placeholder="admissions@institution.edu"
                className="ml-11"
              />
            </div>

            {/* Email Notifications */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Bell className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <Label className="font-medium">Email Notifications</Label>
                  <p className="text-xs text-muted-foreground">
                    Receive email alerts for all applications
                  </p>
                </div>
              </div>
              <Switch
                checked={settings.email_notifications}
                onCheckedChange={(value) => handleSettingChange('email_notifications', value)}
              />
            </div>

            {/* Publicly Visible */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Eye className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <Label className="font-medium">Publicly Visible</Label>
                  <p className="text-xs text-muted-foreground">
                    Show on public website and catalog
                  </p>
                </div>
              </div>
              <Switch
                checked={settings.publicly_visible}
                onCheckedChange={(value) => handleSettingChange('publicly_visible', value)}
              />
            </div>

            {/* Featured Program */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Star className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <Label className="font-medium">Featured Program</Label>
                  <p className="text-xs text-muted-foreground">
                    Highlight on homepage and marketing
                  </p>
                </div>
              </div>
              <Switch
                checked={settings.featured_program}
                onCheckedChange={(value) => handleSettingChange('featured_program', value)}
              />
            </div>

            {/* Allow Online Applications */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Globe className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <Label className="font-medium">Allow Online Applications</Label>
                  <p className="text-xs text-muted-foreground">
                    Enable online application submissions
                  </p>
                </div>
              </div>
              <Switch
                checked={settings.allow_online_applications}
                onCheckedChange={(value) => handleSettingChange('allow_online_applications', value)}
              />
            </div>
          </CardContent>
        </Card>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button 
            variant="outline" 
            onClick={handleResetSettings}
            className="gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset to Defaults
          </Button>
          <Button 
            onClick={handleSaveSettings}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Settings"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
