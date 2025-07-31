import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Building2, Upload, Save, Globe, Mail, Phone, MapPin, Users, Calendar, Palette, TrendingUp, Award, FileText } from "lucide-react";

interface CompanyProfileData {
  id?: string;
  name?: string;
  description?: string;
  mission?: string;
  vision?: string;
  values?: string;
  logo_url?: string;
  primary_color?: string;
  secondary_color?: string;
  website?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
  timezone?: string;
  founded_year?: number;
  employee_count?: number;
}

const CompanyPage: React.FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [companyData, setCompanyData] = useState<CompanyProfileData>({
    name: '',
    description: '',
    mission: '',
    vision: '',
    values: '',
    primary_color: '#3B82F6',
    secondary_color: '#10B981',
    website: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    country: 'United States',
    timezone: 'UTC',
    founded_year: new Date().getFullYear(),
    employee_count: 0,
  });

  useEffect(() => {
    fetchCompanyProfile();
  }, []);

  const fetchCompanyProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('company_profile')
        .select('*')
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching company profile:', error);
        return;
      }

      if (data) {
        setCompanyData(data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const updateData = {
        ...companyData,
        name: companyData.name || 'Your Institution'
      };

      const { error } = await supabase
        .from('company_profile')
        .upsert(updateData);

      if (error) throw error;

      toast({
        title: "Company profile updated",
        description: "Your organization details have been saved successfully.",
      });
    } catch (error) {
      console.error('Error saving company profile:', error);
      toast({
        title: "Error",
        description: "Failed to save company profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof CompanyProfileData, value: any) => {
    setCompanyData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Company Profile</h1>
          <p className="text-muted-foreground mt-2">
            Manage your organization's information and branding
          </p>
        </div>
        <Button onClick={handleSave} disabled={loading} className="gap-2">
          <Save className="h-4 w-4" />
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
          <TabsTrigger value="overview" className="gap-2">
            <Building2 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="branding" className="gap-2">
            <Palette className="h-4 w-4" />
            Branding
          </TabsTrigger>
          <TabsTrigger value="contact" className="gap-2">
            <MapPin className="h-4 w-4" />
            Contact
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="compliance" className="gap-2">
            <Award className="h-4 w-4" />
            Compliance
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Info Card */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Organization Information</CardTitle>
                <CardDescription>
                  Basic details about your institution
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Institution Name</Label>
                  <Input
                    id="name"
                    value={companyData.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter institution name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={companyData.description || ''}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Brief description of your institution..."
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="foundedYear">Founded Year</Label>
                    <Input
                      id="foundedYear"
                      type="number"
                      value={companyData.founded_year || ''}
                      onChange={(e) => handleInputChange('founded_year', parseInt(e.target.value))}
                      placeholder="Year founded"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="employeeCount">Staff Count</Label>
                    <Input
                      id="employeeCount"
                      type="number"
                      value={companyData.employee_count || ''}
                      onChange={(e) => handleInputChange('employee_count', parseInt(e.target.value))}
                      placeholder="Number of staff"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Active Students</span>
                  <Badge variant="secondary">1,247</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Programs</span>
                  <Badge variant="secondary">28</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Applications</span>
                  <Badge variant="secondary">342</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Staff Members</span>
                  <Badge variant="secondary">{companyData.employee_count || 0}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Mission, Vision, Values */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={companyData.mission || ''}
                  onChange={(e) => handleInputChange('mission', e.target.value)}
                  placeholder="Our mission statement..."
                  rows={4}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={companyData.vision || ''}
                  onChange={(e) => handleInputChange('vision', e.target.value)}
                  placeholder="Our vision for the future..."
                  rows={4}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Values</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={companyData.values || ''}
                  onChange={(e) => handleInputChange('values', e.target.value)}
                  placeholder="Our core values..."
                  rows={4}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Branding Tab */}
        <TabsContent value="branding" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Logo & Visual Identity</CardTitle>
                <CardDescription>
                  Manage your institution's visual branding
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center">
                    {companyData.logo_url ? (
                      <img src={companyData.logo_url} alt="Logo" className="w-full h-full object-contain rounded-lg" />
                    ) : (
                      <Building2 className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Upload className="h-4 w-4" />
                      Upload Logo
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      PNG or SVG. 2MB max.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Brand Colors</CardTitle>
                <CardDescription>
                  Define your brand color palette
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex gap-2">
                    <div 
                      className="w-10 h-10 rounded border"
                      style={{ backgroundColor: companyData.primary_color }}
                    />
                    <Input
                      id="primaryColor"
                      type="color"
                      value={companyData.primary_color || '#3B82F6'}
                      onChange={(e) => handleInputChange('primary_color', e.target.value)}
                      className="w-20"
                    />
                    <Input
                      value={companyData.primary_color || '#3B82F6'}
                      onChange={(e) => handleInputChange('primary_color', e.target.value)}
                      placeholder="#3B82F6"
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <div className="flex gap-2">
                    <div 
                      className="w-10 h-10 rounded border"
                      style={{ backgroundColor: companyData.secondary_color }}
                    />
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={companyData.secondary_color || '#10B981'}
                      onChange={(e) => handleInputChange('secondary_color', e.target.value)}
                      className="w-20"
                    />
                    <Input
                      value={companyData.secondary_color || '#10B981'}
                      onChange={(e) => handleInputChange('secondary_color', e.target.value)}
                      placeholder="#10B981"
                      className="flex-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Contact Tab */}
        <TabsContent value="contact" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                Official contact details for your institution
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="website"
                      value={companyData.website || ''}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      placeholder="https://www.institution.edu"
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={companyData.email || ''}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="info@institution.edu"
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
                      value={companyData.phone || ''}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="(555) 123-4567"
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={companyData.timezone}
                    onValueChange={(value) => handleInputChange('timezone', value)}
                  >
                    <SelectTrigger>
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

              <div className="space-y-4">
                <Label>Address</Label>
                <div className="space-y-4">
                  <Input
                    value={companyData.address || ''}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Street address"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      value={companyData.city || ''}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="City"
                    />
                    <Input
                      value={companyData.state || ''}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      placeholder="State/Province"
                    />
                    <Input
                      value={companyData.zip_code || ''}
                      onChange={(e) => handleInputChange('zip_code', e.target.value)}
                      placeholder="ZIP/Postal Code"
                    />
                  </div>
                  <Input
                    value={companyData.country || ''}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    placeholder="Country"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Applications</p>
                    <p className="text-2xl font-bold">2,847</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  <span className="text-green-600">+12%</span> from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Acceptance Rate</p>
                    <p className="text-2xl font-bold">67%</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  <span className="text-green-600">+3%</span> from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Revenue</p>
                    <p className="text-2xl font-bold">$124K</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  <span className="text-green-600">+8%</span> from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Programs</p>
                    <p className="text-2xl font-bold">28</p>
                  </div>
                  <Building2 className="h-8 w-8 text-orange-600" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  <span className="text-green-600">+2</span> new this quarter
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Accreditation & Compliance</CardTitle>
              <CardDescription>
                Track your institution's certifications and compliance status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <Award className="h-5 w-5 text-green-600" />
                    <div>
                      <h4 className="font-medium">Regional Accreditation</h4>
                      <p className="text-sm text-muted-foreground">Valid until December 2025</p>
                    </div>
                  </div>
                  <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-yellow-600" />
                    <div>
                      <h4 className="font-medium">FERPA Compliance</h4>
                      <p className="text-sm text-muted-foreground">Annual review due March 2024</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Review Due</Badge>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <Award className="h-5 w-5 text-green-600" />
                    <div>
                      <h4 className="font-medium">Title IV Eligibility</h4>
                      <p className="text-sm text-muted-foreground">Valid until June 2026</p>
                    </div>
                  </div>
                  <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CompanyPage;