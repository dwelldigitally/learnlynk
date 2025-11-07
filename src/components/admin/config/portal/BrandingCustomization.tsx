import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { usePortalBranding, useBrandingMutations } from "@/hooks/useStudentPortalAdmin";
import { Loader2, Upload, Palette } from "lucide-react";
import { toast } from "sonner";

export const BrandingCustomization = () => {
  const { data: branding, isLoading } = usePortalBranding();
  const { saveBranding } = useBrandingMutations();

  const [formData, setFormData] = useState({
    logo_url: branding?.logo_url || '',
    primary_color: branding?.primary_color || 'var(--primary)',
    secondary_color: branding?.secondary_color || 'var(--secondary)',
    accent_color: branding?.accent_color || 'var(--accent)',
    font_family_heading: branding?.font_family_heading || 'system-ui',
    font_family_body: branding?.font_family_body || 'system-ui',
    footer_text: branding?.footer_text || '',
  });

  React.useEffect(() => {
    if (branding) {
      setFormData({
        logo_url: branding.logo_url || '',
        primary_color: branding.primary_color || 'var(--primary)',
        secondary_color: branding.secondary_color || 'var(--secondary)',
        accent_color: branding.accent_color || 'var(--accent)',
        font_family_heading: branding.font_family_heading || 'system-ui',
        font_family_body: branding.font_family_body || 'system-ui',
        footer_text: branding.footer_text || '',
      });
    }
  }, [branding]);

  const handleSave = () => {
    saveBranding.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Logo & Images */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Logo & Images
          </CardTitle>
          <CardDescription>
            Upload your institution's branding assets
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="logo_url">Portal Logo URL</Label>
            <Input
              id="logo_url"
              value={formData.logo_url}
              onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
              placeholder="https://example.com/logo.png"
            />
          </div>
        </CardContent>
      </Card>

      {/* Color Scheme */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Color Scheme
          </CardTitle>
          <CardDescription>
            Customize your portal's color palette (use CSS variable names like var(--primary) or HSL values)
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="primary_color">Primary Color</Label>
            <Input
              id="primary_color"
              value={formData.primary_color}
              onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
              placeholder="var(--primary)"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="secondary_color">Secondary Color</Label>
            <Input
              id="secondary_color"
              value={formData.secondary_color}
              onChange={(e) => setFormData({ ...formData, secondary_color: e.target.value })}
              placeholder="var(--secondary)"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="accent_color">Accent Color</Label>
            <Input
              id="accent_color"
              value={formData.accent_color}
              onChange={(e) => setFormData({ ...formData, accent_color: e.target.value })}
              placeholder="var(--accent)"
            />
          </div>
        </CardContent>
      </Card>

      {/* Typography */}
      <Card>
        <CardHeader>
          <CardTitle>Typography</CardTitle>
          <CardDescription>
            Configure fonts for your portal
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="font_family_heading">Heading Font</Label>
            <Input
              id="font_family_heading"
              value={formData.font_family_heading}
              onChange={(e) => setFormData({ ...formData, font_family_heading: e.target.value })}
              placeholder="system-ui"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="font_family_body">Body Font</Label>
            <Input
              id="font_family_body"
              value={formData.font_family_body}
              onChange={(e) => setFormData({ ...formData, font_family_body: e.target.value })}
              placeholder="system-ui"
            />
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <Card>
        <CardHeader>
          <CardTitle>Footer</CardTitle>
          <CardDescription>
            Customize your portal footer content
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="footer_text">Footer Text</Label>
            <Textarea
              id="footer_text"
              value={formData.footer_text}
              onChange={(e) => setFormData({ ...formData, footer_text: e.target.value })}
              placeholder="© 2025 Your Institution. All rights reserved."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <Button
          onClick={handleSave}
          disabled={saveBranding.isPending}
        >
          {saveBranding.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Branding Settings
        </Button>
      </div>
    </div>
  );
};
