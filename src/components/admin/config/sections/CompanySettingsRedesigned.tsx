import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2, Mail, Phone, MapPin, Globe, Upload, X, Linkedin, Twitter, Facebook, Instagram } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { PageHeader } from '@/components/modern/PageHeader';

const timezones = [
  { value: 'America/Toronto', label: 'Eastern Time (Toronto)', offset: 'UTC-5' },
  { value: 'America/New_York', label: 'Eastern Time (New York)', offset: 'UTC-5' },
  { value: 'America/Chicago', label: 'Central Time (Chicago)', offset: 'UTC-6' },
  { value: 'America/Denver', label: 'Mountain Time (Denver)', offset: 'UTC-7' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (Los Angeles)', offset: 'UTC-8' },
  { value: 'America/Vancouver', label: 'Pacific Time (Vancouver)', offset: 'UTC-8' },
  { value: 'Europe/London', label: 'British Time (London)', offset: 'UTC+0' },
  { value: 'Europe/Paris', label: 'Central European Time (Paris)', offset: 'UTC+1' },
  { value: 'Asia/Tokyo', label: 'Japan Time (Tokyo)', offset: 'UTC+9' },
];

const languages = [
  { value: 'en', label: 'English', flag: '🇬🇧' },
  { value: 'fr', label: 'Français', flag: '🇫🇷' },
  { value: 'es', label: 'Español', flag: '🇪🇸' },
  { value: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { value: 'zh', label: '中文', flag: '🇨🇳' },
];

const currencies = [
  { value: 'USD', label: 'US Dollar', symbol: '$' },
  { value: 'CAD', label: 'Canadian Dollar', symbol: 'CA$' },
  { value: 'EUR', label: 'Euro', symbol: '€' },
  { value: 'GBP', label: 'British Pound', symbol: '£' },
  { value: 'JPY', label: 'Japanese Yen', symbol: '¥' },
];

const dataResidencyRegions = [
  { value: 'CA', label: 'Canada', description: 'Data stored on Canadian servers' },
  { value: 'US', label: 'United States', description: 'Data stored on US servers' },
  { value: 'EU', label: 'Europe', description: 'Data stored on EU servers' },
  { value: 'UK', label: 'United Kingdom', description: 'Data stored on UK servers' },
];

export function CompanySettingsRedesigned() {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [existingProfileId, setExistingProfileId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    logo_url: '',
    primary_color: '#3b82f6',
    secondary_color: '#6b7280',
    accent_color: '#10b981',
    website: '',
    founded_year: new Date().getFullYear(),
    email: '',
    phone: '',
    street_address: '',
    city: '',
    state_province: '',
    country: 'Canada',
    postal_code: '',
    social_linkedin: '',
    social_twitter: '',
    social_facebook: '',
    social_instagram: '',
    timezone: 'America/Toronto',
    default_language: 'en',
    currency: 'USD',
    data_residency_region: 'CA',
  });

  useEffect(() => {
    loadCompanyProfile();
  }, []);

  const loadCompanyProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('company_profile')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(1)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setExistingProfileId(data.id);
        setFormData({
          name: data.name || '',
          logo_url: data.logo_url || '',
          primary_color: data.primary_color || '#3b82f6',
          secondary_color: data.secondary_color || '#6b7280',
          accent_color: data.accent_color || '#10b981',
          website: data.website || '',
          founded_year: data.founded_year || new Date().getFullYear(),
          email: data.email || '',
          phone: data.phone || '',
          street_address: data.street_address || '',
          city: data.city || '',
          state_province: data.state_province || '',
          country: data.country || 'Canada',
          postal_code: data.postal_code || '',
          social_linkedin: data.social_linkedin || '',
          social_twitter: data.social_twitter || '',
          social_facebook: data.social_facebook || '',
          social_instagram: data.social_instagram || '',
          timezone: data.timezone || 'America/Toronto',
          default_language: data.default_language || 'en',
          currency: data.currency || 'USD',
          data_residency_region: data.data_residency_region || 'CA',
        });
        if (data.logo_url) {
          setLogoPreview(data.logo_url);
        }
      }
    } catch (error) {
      console.error('Error loading company profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to load company profile',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: 'Error',
        description: 'File size must be less than 2MB',
        variant: 'destructive',
      });
      return;
    }

    setLogoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const uploadLogo = async () => {
    if (!logoFile) return formData.logo_url;

    try {
      const fileExt = logoFile.name.split('.').pop();
      const fileName = `logo-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('company-assets')
        .upload(filePath, logoFile, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('company-assets')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading logo:', error);
      throw error;
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let logoUrl = formData.logo_url;
      if (logoFile) {
        logoUrl = await uploadLogo();
      }

      const profileData = {
        name: formData.name,
        logo_url: logoUrl,
        primary_color: formData.primary_color,
        secondary_color: formData.secondary_color,
        accent_color: formData.accent_color,
        website: formData.website,
        founded_year: formData.founded_year,
        email: formData.email,
        phone: formData.phone,
        street_address: formData.street_address,
        city: formData.city,
        state_province: formData.state_province,
        country: formData.country,
        postal_code: formData.postal_code,
        social_linkedin: formData.social_linkedin,
        social_twitter: formData.social_twitter,
        social_facebook: formData.social_facebook,
        social_instagram: formData.social_instagram,
        timezone: formData.timezone,
        default_language: formData.default_language,
        currency: formData.currency,
        data_residency_region: formData.data_residency_region,
        updated_at: new Date().toISOString(),
      };

      let error;

      if (existingProfileId) {
        // Update existing record
        const result = await supabase
          .from('company_profile')
          .update(profileData)
          .eq('id', existingProfileId);
        error = result.error;
      } else {
        // Insert new record
        const result = await supabase
          .from('company_profile')
          .insert(profileData)
          .select()
          .single();
        error = result.error;
        if (result.data) {
          setExistingProfileId(result.data.id);
        }
      }

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Company settings saved successfully',
      });

      setLogoFile(null);
    } catch (error) {
      console.error('Error saving company profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to save company settings',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="px-4 sm:px-6 md:px-[100px] py-4 sm:py-6 md:py-[50px] space-y-6">
      <PageHeader 
        title="Company Settings" 
        subtitle="Manage your institution's profile, branding, and operational settings"
        className="text-left"
      />

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">
            <Building2 className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="contact">
            <Mail className="h-4 w-4 mr-2" />
            Contact
          </TabsTrigger>
          <TabsTrigger value="regional">
            <Globe className="h-4 w-4 mr-2" />
            Regional
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Institution Profile */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Institution Information</CardTitle>
              <CardDescription>Basic information and branding for your institution</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Institution Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your Institution Name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://www.example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Institution Logo</Label>
                <div className="flex items-center gap-4">
                  {logoPreview && (
                    <div className="relative w-24 h-24 border rounded-lg overflow-hidden">
                      <img src={logoPreview} alt="Logo preview" className="w-full h-full object-contain" />
                      <button
                        onClick={() => {
                          setLogoPreview(null);
                          setLogoFile(null);
                          setFormData({ ...formData, logo_url: '' });
                        }}
                        className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                  <div className="flex-1">
                    <label htmlFor="logo-upload" className="cursor-pointer">
                      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                        <p className="text-xs text-muted-foreground mt-1">PNG, JPG, SVG up to 2MB</p>
                      </div>
                    </label>
                    <input
                      id="logo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="founded_year">Founded Year</Label>
                <Input
                  id="founded_year"
                  type="number"
                  value={formData.founded_year}
                  onChange={(e) => setFormData({ ...formData, founded_year: parseInt(e.target.value) })}
                  className="w-32"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Brand Colors</CardTitle>
              <CardDescription>Customize your institution's color palette</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="primary_color">Primary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primary_color"
                      type="color"
                      value={formData.primary_color}
                      onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                      className="w-20 h-10"
                    />
                    <Input
                      value={formData.primary_color}
                      onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
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
                      value={formData.secondary_color}
                      onChange={(e) => setFormData({ ...formData, secondary_color: e.target.value })}
                      className="w-20 h-10"
                    />
                    <Input
                      value={formData.secondary_color}
                      onChange={(e) => setFormData({ ...formData, secondary_color: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accent_color">Accent Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="accent_color"
                      type="color"
                      value={formData.accent_color}
                      onChange={(e) => setFormData({ ...formData, accent_color: e.target.value })}
                      className="w-20 h-10"
                    />
                    <Input
                      value={formData.accent_color}
                      onChange={(e) => setFormData({ ...formData, accent_color: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Contact Information */}
        <TabsContent value="contact" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Primary Contact
              </CardTitle>
              <CardDescription>Main contact details for your institution</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="contact@institution.edu"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Physical Address
              </CardTitle>
              <CardDescription>Your institution's main location</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="street_address">Street Address</Label>
                <Textarea
                  id="street_address"
                  value={formData.street_address}
                  onChange={(e) => setFormData({ ...formData, street_address: e.target.value })}
                  placeholder="123 Main Street, Suite 100"
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Toronto"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state_province">State/Province</Label>
                  <Input
                    id="state_province"
                    value={formData.state_province}
                    onChange={(e) => setFormData({ ...formData, state_province: e.target.value })}
                    placeholder="Ontario"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    placeholder="Canada"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postal_code">Postal/ZIP Code</Label>
                  <Input
                    id="postal_code"
                    value={formData.postal_code}
                    onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                    placeholder="M5H 2N2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Social Media</CardTitle>
              <CardDescription>Your institution's social media presence</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="linkedin" className="flex items-center gap-2">
                  <Linkedin className="h-4 w-4" />
                  LinkedIn
                </Label>
                <Input
                  id="linkedin"
                  value={formData.social_linkedin}
                  onChange={(e) => setFormData({ ...formData, social_linkedin: e.target.value })}
                  placeholder="https://linkedin.com/company/..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twitter" className="flex items-center gap-2">
                  <Twitter className="h-4 w-4" />
                  Twitter/X
                </Label>
                <Input
                  id="twitter"
                  value={formData.social_twitter}
                  onChange={(e) => setFormData({ ...formData, social_twitter: e.target.value })}
                  placeholder="https://twitter.com/..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="facebook" className="flex items-center gap-2">
                  <Facebook className="h-4 w-4" />
                  Facebook
                </Label>
                <Input
                  id="facebook"
                  value={formData.social_facebook}
                  onChange={(e) => setFormData({ ...formData, social_facebook: e.target.value })}
                  placeholder="https://facebook.com/..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagram" className="flex items-center gap-2">
                  <Instagram className="h-4 w-4" />
                  Instagram
                </Label>
                <Input
                  id="instagram"
                  value={formData.social_instagram}
                  onChange={(e) => setFormData({ ...formData, social_instagram: e.target.value })}
                  placeholder="https://instagram.com/..."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Regional & Localization */}
        <TabsContent value="regional" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Regional Settings</CardTitle>
              <CardDescription>Configure timezone, language, and currency preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="timezone">Time Zone</Label>
                <Select value={formData.timezone} onValueChange={(value) => setFormData({ ...formData, timezone: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timezones.map((tz) => (
                      <SelectItem key={tz.value} value={tz.value}>
                        {tz.label} ({tz.offset})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="language">Default Language</Label>
                  <Select value={formData.default_language} onValueChange={(value) => setFormData({ ...formData, default_language: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value}>
                          {lang.flag} {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={formData.currency} onValueChange={(value) => setFormData({ ...formData, currency: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((curr) => (
                        <SelectItem key={curr.value} value={curr.value}>
                          {curr.symbol} {curr.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Residency</CardTitle>
              <CardDescription>Choose where your institution's data is stored</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="data_residency">Data Residency Region</Label>
                <Select value={formData.data_residency_region} onValueChange={(value) => setFormData({ ...formData, data_residency_region: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {dataResidencyRegions.map((region) => (
                      <SelectItem key={region.value} value={region.value}>
                        <div>
                          <div className="font-medium">{region.label}</div>
                          <div className="text-xs text-muted-foreground">{region.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-2">
                  Data residency affects where your institution's data is physically stored. This may have implications for data privacy regulations and compliance requirements.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </Tabs>
    </div>
  );
}
