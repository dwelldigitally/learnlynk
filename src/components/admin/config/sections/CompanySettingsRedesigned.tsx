import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Building2, Mail, Phone, MapPin, Globe, Clock, Calendar, Heart, Upload, X, Linkedin, Twitter, Facebook, Instagram } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { PageHeader } from '@/components/modern/PageHeader';

interface WorkingHours {
  [key: string]: {
    start: string;
    end: string;
    enabled: boolean;
  };
}

interface Holiday {
  id: string;
  name: string;
  date: string;
  recurring: boolean;
  type: string;
}

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

const weekDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export function CompanySettingsRedesigned() {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    logo_url: '',
    primary_color: '#3b82f6',
    secondary_color: '#6b7280',
    accent_color: '#10b981',
    description: '',
    website: '',
    founded_year: new Date().getFullYear(),
    employee_count: 0,
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
    mission_statement: '',
    vision_statement: '',
    core_values: '',
    working_hours: {
      monday: { start: '09:00', end: '17:00', enabled: true },
      tuesday: { start: '09:00', end: '17:00', enabled: true },
      wednesday: { start: '09:00', end: '17:00', enabled: true },
      thursday: { start: '09:00', end: '17:00', enabled: true },
      friday: { start: '09:00', end: '17:00', enabled: true },
      saturday: { start: '09:00', end: '17:00', enabled: false },
      sunday: { start: '09:00', end: '17:00', enabled: false },
    } as WorkingHours,
    holidays: [] as Holiday[],
  });

  const [newHoliday, setNewHoliday] = useState({
    name: '',
    date: '',
    recurring: false,
    type: 'national',
  });

  useEffect(() => {
    loadCompanyProfile();
  }, []);

  const loadCompanyProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('company_profile')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setFormData({
          name: data.name || '',
          logo_url: data.logo_url || '',
          primary_color: data.primary_color || '#3b82f6',
          secondary_color: data.secondary_color || '#6b7280',
          accent_color: data.accent_color || '#10b981',
          description: data.description || '',
          website: data.website || '',
          founded_year: data.founded_year || new Date().getFullYear(),
          employee_count: data.employee_count || 0,
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
          mission_statement: data.mission_statement || '',
          vision_statement: data.vision_statement || '',
          core_values: data.core_values || '',
          working_hours: (data.working_hours as unknown as WorkingHours) || formData.working_hours,
          holidays: (data.holidays as unknown as Holiday[]) || [],
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

      const { error } = await supabase
        .from('company_profile')
        .upsert({
          name: formData.name,
          primary_color: formData.primary_color,
          secondary_color: formData.secondary_color,
          accent_color: formData.accent_color,
          description: formData.description,
          website: formData.website,
          founded_year: formData.founded_year,
          employee_count: formData.employee_count,
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
          mission_statement: formData.mission_statement,
          vision_statement: formData.vision_statement,
          core_values: formData.core_values,
          working_hours: formData.working_hours as any,
          holidays: formData.holidays as any,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Company settings saved successfully',
      });

      setLogoFile(null);
      await loadCompanyProfile();
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

  const updateWorkingHours = (day: string, field: 'start' | 'end' | 'enabled', value: string | boolean) => {
    setFormData({
      ...formData,
      working_hours: {
        ...formData.working_hours,
        [day]: {
          ...formData.working_hours[day],
          [field]: value,
        },
      },
    });
  };

  const copyToAllDays = (day: string) => {
    const dayConfig = formData.working_hours[day];
    const newWorkingHours = { ...formData.working_hours };
    weekDays.forEach(d => {
      newWorkingHours[d] = { ...dayConfig };
    });
    setFormData({ ...formData, working_hours: newWorkingHours });
    toast({
      title: 'Success',
      description: `${day.charAt(0).toUpperCase() + day.slice(1)}'s hours copied to all days`,
    });
  };

  const setBusinessHours = () => {
    const newWorkingHours = { ...formData.working_hours };
    weekDays.forEach(day => {
      newWorkingHours[day] = {
        start: '09:00',
        end: '17:00',
        enabled: !['saturday', 'sunday'].includes(day),
      };
    });
    setFormData({ ...formData, working_hours: newWorkingHours });
  };

  const addHoliday = () => {
    if (!newHoliday.name || !newHoliday.date) {
      toast({
        title: 'Error',
        description: 'Please fill in holiday name and date',
        variant: 'destructive',
      });
      return;
    }

    const holiday: Holiday = {
      id: Date.now().toString(),
      ...newHoliday,
    };

    setFormData({
      ...formData,
      holidays: [...formData.holidays, holiday],
    });

    setNewHoliday({ name: '', date: '', recurring: false, type: 'national' });
  };

  const deleteHoliday = (id: string) => {
    setFormData({
      ...formData,
      holidays: formData.holidays.filter(h => h.id !== id),
    });
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
        <TabsList className="grid w-full grid-cols-5">
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
          <TabsTrigger value="hours">
            <Clock className="h-4 w-4 mr-2" />
            Hours & Holidays
          </TabsTrigger>
          <TabsTrigger value="mission">
            <Heart className="h-4 w-4 mr-2" />
            Mission
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
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of your institution..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="founded_year">Founded Year</Label>
                  <Input
                    id="founded_year"
                    type="number"
                    value={formData.founded_year}
                    onChange={(e) => setFormData({ ...formData, founded_year: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employee_count">Employee Count</Label>
                  <Input
                    id="employee_count"
                    type="number"
                    value={formData.employee_count}
                    onChange={(e) => setFormData({ ...formData, employee_count: parseInt(e.target.value) })}
                  />
                </div>
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

        {/* Tab 4: Working Hours & Holidays */}
        <TabsContent value="hours" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Default Working Hours</CardTitle>
              <CardDescription>Set your institution's standard operating hours</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2 mb-4">
                <Button variant="outline" size="sm" onClick={setBusinessHours}>
                  Set Business Hours (9-5)
                </Button>
              </div>

              <div className="space-y-3">
                {weekDays.map((day) => (
                  <div key={day} className="flex items-center gap-4 p-3 border rounded-lg">
                    <Switch
                      checked={formData.working_hours[day]?.enabled}
                      onCheckedChange={(checked) => updateWorkingHours(day, 'enabled', checked)}
                    />
                    <div className="w-24 font-medium capitalize">{day}</div>
                    <div className="flex items-center gap-2 flex-1">
                      <Input
                        type="time"
                        value={formData.working_hours[day]?.start}
                        onChange={(e) => updateWorkingHours(day, 'start', e.target.value)}
                        disabled={!formData.working_hours[day]?.enabled}
                        className="w-32"
                      />
                      <span className="text-muted-foreground">to</span>
                      <Input
                        type="time"
                        value={formData.working_hours[day]?.end}
                        onChange={(e) => updateWorkingHours(day, 'end', e.target.value)}
                        disabled={!formData.working_hours[day]?.enabled}
                        className="w-32"
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToAllDays(day)}
                    >
                      Copy to all
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Holiday Calendar
              </CardTitle>
              <CardDescription>Manage your institution's holidays and closures</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Holiday name"
                  value={newHoliday.name}
                  onChange={(e) => setNewHoliday({ ...newHoliday, name: e.target.value })}
                />
                <Input
                  type="date"
                  value={newHoliday.date}
                  onChange={(e) => setNewHoliday({ ...newHoliday, date: e.target.value })}
                  className="w-40"
                />
                <Select value={newHoliday.type} onValueChange={(value) => setNewHoliday({ ...newHoliday, type: value })}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="national">National</SelectItem>
                    <SelectItem value="company">Company</SelectItem>
                    <SelectItem value="regional">Regional</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={addHoliday}>Add</Button>
              </div>

              <div className="space-y-2">
                {formData.holidays.map((holiday) => (
                  <div key={holiday.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant={holiday.type === 'national' ? 'default' : 'secondary'}>
                        {holiday.type}
                      </Badge>
                      <div>
                        <div className="font-medium">{holiday.name}</div>
                        <div className="text-sm text-muted-foreground">{holiday.date}</div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteHoliday(holiday.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {formData.holidays.length === 0 && (
                  <div className="text-center py-6 text-muted-foreground">
                    No holidays added yet
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 5: Mission & Values */}
        <TabsContent value="mission" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Mission Statement</CardTitle>
              <CardDescription>Your institution's core purpose and goals</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.mission_statement}
                onChange={(e) => setFormData({ ...formData, mission_statement: e.target.value })}
                placeholder="Describe your institution's mission..."
                rows={4}
              />
              <p className="text-xs text-muted-foreground mt-2">
                {formData.mission_statement.length} characters
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Vision Statement</CardTitle>
              <CardDescription>Your institution's aspirations for the future</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.vision_statement}
                onChange={(e) => setFormData({ ...formData, vision_statement: e.target.value })}
                placeholder="Describe your institution's vision..."
                rows={4}
              />
              <p className="text-xs text-muted-foreground mt-2">
                {formData.vision_statement.length} characters
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Core Values</CardTitle>
              <CardDescription>The principles that guide your institution</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.core_values}
                onChange={(e) => setFormData({ ...formData, core_values: e.target.value })}
                placeholder="List your institution's core values..."
                rows={6}
              />
              <p className="text-xs text-muted-foreground mt-2">
                {formData.core_values.length} characters
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button variant="outline" onClick={loadCompanyProfile}>
          Reset
        </Button>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
}
