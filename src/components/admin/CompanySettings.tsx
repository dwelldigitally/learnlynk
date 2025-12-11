import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Building2, Globe, Mail, Phone, MapPin, Loader2 } from 'lucide-react';
import { useTenant } from '@/contexts/TenantContext';
import { TenantService, CompanyProfileData } from '@/services/tenantService';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export function CompanySettings() {
  const { tenantId, loading: tenantLoading } = useTenant();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<CompanyProfileData | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    email: '',
    phone: '',
    website: '',
    street_address: '',
    city: '',
    state_province: '',
    postal_code: '',
    country: '',
    primary_color: '#3b82f6',
    secondary_color: '#6b7280',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!tenantId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await TenantService.getCompanyProfile(tenantId);
        if (data) {
          setProfile(data);
          setFormData({
            name: data.name || '',
            description: data.description || '',
            email: data.email || '',
            phone: data.phone || '',
            website: data.website || '',
            street_address: data.street_address || '',
            city: data.city || '',
            state_province: data.state_province || '',
            postal_code: data.postal_code || '',
            country: data.country || '',
            primary_color: data.primary_color || '#3b82f6',
            secondary_color: data.secondary_color || '#6b7280',
          });
        }
      } catch (error) {
        console.error('Error fetching company profile:', error);
        toast({
          title: 'Error',
          description: 'Failed to load company profile',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    if (!tenantLoading) {
      fetchProfile();
    }
  }, [tenantId, tenantLoading, toast]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!tenantId) {
      toast({
        title: 'Error',
        description: 'No organization found. Please contact support.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setSaving(true);
      await TenantService.updateCompanyProfile(tenantId, formData);
      toast({
        title: 'Success',
        description: 'Company profile saved successfully',
      });
    } catch (error) {
      console.error('Error saving company profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to save company profile',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset to original profile data
    if (profile) {
      setFormData({
        name: profile.name || '',
        description: profile.description || '',
        email: profile.email || '',
        phone: profile.phone || '',
        website: profile.website || '',
        street_address: profile.street_address || '',
        city: profile.city || '',
        state_province: profile.state_province || '',
        postal_code: profile.postal_code || '',
        country: profile.country || '',
        primary_color: profile.primary_color || '#3b82f6',
        secondary_color: profile.secondary_color || '#6b7280',
      });
    }
  };

  if (loading || tenantLoading) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <Skeleton className="h-9 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-72" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!tenantId) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-12 text-center">
            <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Organization Found</h2>
            <p className="text-muted-foreground">
              You don't appear to be part of an organization. Please contact support or create a new institution.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Company Settings</h1>
        <p className="text-muted-foreground">
          Manage your organization's profile and configuration
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Company Information
            </CardTitle>
            <CardDescription>
              Update your company's basic information and branding
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company-name">Company Name</Label>
                <Input 
                  id="company-name" 
                  placeholder="Your Company Name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company-country">Country</Label>
                <Input 
                  id="company-country" 
                  placeholder="Country"
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-description">Description</Label>
              <Textarea 
                id="company-description" 
                placeholder="Brief description of your organization..."
                rows={3}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Contact Information
            </CardTitle>
            <CardDescription>
              Primary contact details for your organization
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company-email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Address
                </Label>
                <Input 
                  id="company-email" 
                  type="email" 
                  placeholder="contact@company.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company-phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone Number
                </Label>
                <Input 
                  id="company-phone" 
                  placeholder="+1 (555) 123-4567"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-website" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Website
              </Label>
              <Input 
                id="company-website" 
                placeholder="https://www.company.com"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-address">Street Address</Label>
              <Input 
                id="company-address" 
                placeholder="123 Main Street"
                value={formData.street_address}
                onChange={(e) => handleInputChange('street_address', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company-city">City</Label>
                <Input 
                  id="company-city" 
                  placeholder="City"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company-state">State/Province</Label>
                <Input 
                  id="company-state" 
                  placeholder="State/Province"
                  value={formData.state_province}
                  onChange={(e) => handleInputChange('state_province', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company-postal">Postal Code</Label>
                <Input 
                  id="company-postal" 
                  placeholder="Postal Code"
                  value={formData.postal_code}
                  onChange={(e) => handleInputChange('postal_code', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Branding & Appearance</CardTitle>
            <CardDescription>
              Customize your organization's visual identity
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Company Logo</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <p className="text-muted-foreground">Click to upload or drag and drop</p>
                <p className="text-sm text-muted-foreground">PNG, JPG up to 2MB</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="primary-color">Primary Color</Label>
                <Input 
                  id="primary-color" 
                  type="color" 
                  value={formData.primary_color}
                  onChange={(e) => handleInputChange('primary_color', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="secondary-color">Secondary Color</Label>
                <Input 
                  id="secondary-color" 
                  type="color" 
                  value={formData.secondary_color}
                  onChange={(e) => handleInputChange('secondary_color', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={handleCancel} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
