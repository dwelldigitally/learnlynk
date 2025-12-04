import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Building2, MapPin, Phone, Mail, Globe, Clock, Save, RotateCcw, Loader2 } from "lucide-react";

export const CompanyProfileConfiguration = () => {
  const [companyProfile, setCompanyProfile] = useState({
    name: '',
    description: '',
    address: '',
    city: '',
    state: '',
    country: '',
    zip_code: '',
    phone: '',
    email: '',
    website: '',
    timezone: 'UTC',
    mission: '',
    vision: '',
    values: '',
    logo_url: '',
    primary_color: '#3B82F6',
    secondary_color: '#EF4444',
    employee_count: null,
    founded_year: null
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [initialProfile, setInitialProfile] = useState<any>(null);

  useEffect(() => {
    fetchCompanyProfile();
  }, []);

  const fetchCompanyProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('company_profile')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (data) {
        setCompanyProfile(data);
        setInitialProfile(data);
      }
    } catch (error) {
      console.error('Error fetching company profile:', error);
      toast.error('Failed to load company profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      const { data: existingData } = await supabase
        .from('company_profile')
        .select('id')
        .limit(1)
        .maybeSingle();

      if (existingData) {
        const { error } = await supabase
          .from('company_profile')
          .update(companyProfile)
          .eq('id', existingData.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('company_profile')
          .insert([companyProfile]);

        if (error) throw error;
      }

      setInitialProfile(companyProfile);
      setHasChanges(false);
      toast.success('Company profile saved successfully');
    } catch (error) {
      console.error('Error saving company profile:', error);
      toast.error('Failed to save company profile');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (initialProfile) {
      setCompanyProfile(initialProfile);
      setHasChanges(false);
      toast.info('Changes have been reset');
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setCompanyProfile(prev => ({
      ...prev,
      [field]: value
    }));
    setHasChanges(true);
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6 pb-24">
      {/* Page Header with Save Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Company Profile</h2>
          <p className="text-muted-foreground">
            Manage your institution's information and branding
          </p>
        </div>
        <div className="flex items-center gap-2">
          {hasChanges && (
            <span className="text-sm text-amber-600 dark:text-amber-400">
              Unsaved changes
            </span>
          )}
          <Button variant="outline" onClick={handleReset} disabled={!hasChanges || saving}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Company Name</Label>
              <Input
                id="name"
                value={companyProfile.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter company name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={companyProfile.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                placeholder="https://www.company.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={companyProfile.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Brief description of your institution"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="employee_count">Employee Count</Label>
              <Input
                id="employee_count"
                type="number"
                value={companyProfile.employee_count || ''}
                onChange={(e) => handleInputChange('employee_count', parseInt(e.target.value) || null)}
                placeholder="Number of employees"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="founded_year">Founded Year</Label>
              <Input
                id="founded_year"
                type="number"
                value={companyProfile.founded_year || ''}
                onChange={(e) => handleInputChange('founded_year', parseInt(e.target.value) || null)}
                placeholder="Year founded"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={companyProfile.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={companyProfile.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="contact@company.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={companyProfile.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Street address"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={companyProfile.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                placeholder="City"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State/Province</Label>
              <Input
                id="state"
                value={companyProfile.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                placeholder="State or Province"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={companyProfile.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                placeholder="Country"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="zip_code">Postal Code</Label>
              <Input
                id="zip_code"
                value={companyProfile.zip_code}
                onChange={(e) => handleInputChange('zip_code', e.target.value)}
                placeholder="Postal/ZIP code"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Input
                id="timezone"
                value={companyProfile.timezone}
                onChange={(e) => handleInputChange('timezone', e.target.value)}
                placeholder="UTC, America/New_York, etc."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mission, Vision & Values */}
      <Card>
        <CardHeader>
          <CardTitle>Mission, Vision & Values</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mission">Mission Statement</Label>
            <Textarea
              id="mission"
              value={companyProfile.mission}
              onChange={(e) => handleInputChange('mission', e.target.value)}
              placeholder="Our mission is to..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="vision">Vision Statement</Label>
            <Textarea
              id="vision"
              value={companyProfile.vision}
              onChange={(e) => handleInputChange('vision', e.target.value)}
              placeholder="Our vision is to..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="values">Core Values</Label>
            <Textarea
              id="values"
              value={companyProfile.values}
              onChange={(e) => handleInputChange('values', e.target.value)}
              placeholder="Our core values include..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Branding */}
      <Card>
        <CardHeader>
          <CardTitle>Branding</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="logo_url">Logo URL</Label>
            <Input
              id="logo_url"
              value={companyProfile.logo_url}
              onChange={(e) => handleInputChange('logo_url', e.target.value)}
              placeholder="https://example.com/logo.png"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primary_color">Primary Color</Label>
              <div className="flex gap-2">
                <Input
                  id="primary_color"
                  type="color"
                  value={companyProfile.primary_color}
                  onChange={(e) => handleInputChange('primary_color', e.target.value)}
                  className="w-16 h-10 p-1"
                />
                <Input
                  value={companyProfile.primary_color}
                  onChange={(e) => handleInputChange('primary_color', e.target.value)}
                  placeholder="#3B82F6"
                  className="flex-1"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="secondary_color">Secondary Color</Label>
              <div className="flex gap-2">
                <Input
                  id="secondary_color"
                  type="color"
                  value={companyProfile.secondary_color}
                  onChange={(e) => handleInputChange('secondary_color', e.target.value)}
                  className="w-16 h-10 p-1"
                />
                <Input
                  value={companyProfile.secondary_color}
                  onChange={(e) => handleInputChange('secondary_color', e.target.value)}
                  placeholder="#EF4444"
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sticky Save Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-t p-4 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            {hasChanges && (
              <span className="text-sm text-amber-600 dark:text-amber-400 flex items-center gap-1">
                <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                You have unsaved changes
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleReset} disabled={!hasChanges || saving}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button onClick={handleSave} disabled={saving} size="lg">
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Company Profile
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};