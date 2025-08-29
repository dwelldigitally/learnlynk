import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Building, Globe, Users, MapPin, Phone, Mail } from 'lucide-react';

interface CompanySetupScreenProps {
  data: any;
  websiteData?: any;
  onComplete: (data: any) => void;
  onNext: () => void;
  onSkip: () => void;
}

interface CompanyData {
  institutionName: string;
  institutionType: string;
  website: string;
  description: string;
  established: string;
  accreditation: string;
  studentCapacity: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  email: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
}

const INSTITUTION_TYPES = [
  'University',
  'College',
  'Community College',
  'Trade School',
  'Vocational Institute',
  'Technical College',
  'Art School',
  'Business School',
  'Medical School',
  'Law School'
];

const STUDENT_CAPACITIES = [
  'Under 500',
  '500 - 1,000',
  '1,000 - 2,500',
  '2,500 - 5,000',
  '5,000 - 10,000',
  '10,000 - 25,000',
  '25,000+'
];

const CompanySetupScreen: React.FC<CompanySetupScreenProps> = ({
  data,
  websiteData,
  onComplete,
  onNext,
  onSkip
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<CompanyData>({
    institutionName: data?.institutionName || websiteData?.institution?.name || '',
    institutionType: data?.institutionType || '',
    website: data?.website || websiteData?.url || '',
    description: data?.description || websiteData?.institution?.description || '',
    established: data?.established || websiteData?.institution?.founded_year?.toString() || '',
    accreditation: data?.accreditation || '',
    studentCapacity: data?.studentCapacity || '',
    address: data?.address || websiteData?.institution?.address || '',
    city: data?.city || websiteData?.institution?.city || '',
    state: data?.state || websiteData?.institution?.state || '',
    zipCode: data?.zipCode || '',
    country: data?.country || websiteData?.institution?.country || 'United States',
    phone: data?.phone || websiteData?.institution?.phone || '',
    email: data?.email || websiteData?.institution?.email || '',
    logoUrl: data?.logoUrl || websiteData?.institution?.logo_url || '',
    primaryColor: data?.primaryColor || websiteData?.institution?.primary_color || '#3B82F6',
    secondaryColor: data?.secondaryColor || '#10B981'
  });

  const handleInputChange = (field: keyof CompanyData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // Validate required fields
    const requiredFields = ['institutionName', 'institutionType', 'website', 'email'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof CompanyData]);

    if (missingFields.length > 0) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in all required fields before continuing.",
        variant: "destructive"
      });
      return;
    }

    onComplete(formData);
    onNext();
  };

  const isFormValid = formData.institutionName && formData.institutionType && formData.website && formData.email;

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 xl:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building className="w-5 h-5 mr-2 text-primary" />
              Institution Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="institutionName" className="text-foreground font-medium">
                Institution Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="institutionName"
                value={formData.institutionName}
                onChange={(e) => handleInputChange('institutionName', e.target.value)}
                placeholder="e.g., Tech University"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="institutionType" className="text-foreground font-medium">
                Institution Type <span className="text-destructive">*</span>
              </Label>
              <Select value={formData.institutionType} onValueChange={(value) => handleInputChange('institutionType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select institution type" />
                </SelectTrigger>
                <SelectContent>
                  {INSTITUTION_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="website" className="text-foreground font-medium">
                Website URL <span className="text-destructive">*</span>
              </Label>
              <Input
                id="website"
                type="url"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                placeholder="https://your-institution.edu"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-foreground font-medium">
                Institution Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Brief description of your institution..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="established" className="text-foreground font-medium">
                  Established Year
                </Label>
                <Input
                  id="established"
                  type="number"
                  value={formData.established}
                  onChange={(e) => handleInputChange('established', e.target.value)}
                  placeholder="1985"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="studentCapacity" className="text-foreground font-medium">
                  Student Capacity
                </Label>
                <Select value={formData.studentCapacity} onValueChange={(value) => handleInputChange('studentCapacity', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select capacity" />
                  </SelectTrigger>
                  <SelectContent>
                    {STUDENT_CAPACITIES.map((capacity) => (
                      <SelectItem key={capacity} value={capacity}>{capacity}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="accreditation" className="text-foreground font-medium">
                Accreditation
              </Label>
              <Input
                id="accreditation"
                value={formData.accreditation}
                onChange={(e) => handleInputChange('accreditation', e.target.value)}
                placeholder="e.g., ABET Accredited"
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-accent" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-medium">
                Primary Email <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="admissions@your-institution.edu"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-foreground font-medium">
                Phone Number
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="(555) 123-4567"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-foreground font-medium">
                Street Address
              </Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="123 University Ave"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city" className="text-foreground font-medium">
                  City
                </Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="Tech City"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state" className="text-foreground font-medium">
                  State/Province
                </Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  placeholder="TC"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="zipCode" className="text-foreground font-medium">
                  ZIP/Postal Code
                </Label>
                <Input
                  id="zipCode"
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  placeholder="12345"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country" className="text-foreground font-medium">
                  Country
                </Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  placeholder="United States"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Branding Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="w-5 h-5 mr-2 text-success" />
            Branding (Optional)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 xl:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="logoUrl" className="text-foreground font-medium">
                Logo URL
              </Label>
              <Input
                id="logoUrl"
                type="url"
                value={formData.logoUrl}
                onChange={(e) => handleInputChange('logoUrl', e.target.value)}
                placeholder="https://your-domain.com/logo.png"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="primaryColor" className="text-foreground font-medium">
                Primary Color
              </Label>
              <div className="flex space-x-2">
                <Input
                  id="primaryColor"
                  type="color"
                  value={formData.primaryColor}
                  onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                  className="w-16 h-10 p-1"
                />
                <Input
                  value={formData.primaryColor}
                  onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                  placeholder="#3B82F6"
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="secondaryColor" className="text-foreground font-medium">
                Secondary Color
              </Label>
              <div className="flex space-x-2">
                <Input
                  id="secondaryColor"
                  type="color"
                  value={formData.secondaryColor}
                  onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                  className="w-16 h-10 p-1"
                />
                <Input
                  value={formData.secondaryColor}
                  onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                  placeholder="#10B981"
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <Button variant="outline" onClick={onSkip} className="glass-button">
          Skip This Step
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={!isFormValid}
          className="bg-primary hover:bg-primary-hover"
        >
          Save & Continue
        </Button>
      </div>
    </div>
  );
};

export default CompanySetupScreen;