import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";

interface PersonalInfoData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  nationality?: string;
  countryOfResidence?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  emergencyContact?: {
    name?: string;
    relationship?: string;
    phone?: string;
    email?: string;
  };
}

interface PersonalInfoStepProps {
  data: PersonalInfoData;
  onUpdate: (data: PersonalInfoData) => void;
}

const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({ data, onUpdate }) => {
  const [formData, setFormData] = useState<PersonalInfoData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    nationality: '',
    countryOfResidence: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    emergencyContact: {
      name: '',
      relationship: '',
      phone: '',
      email: ''
    },
    ...data
  });

  useEffect(() => {
    onUpdate(formData);
  }, [formData, onUpdate]);

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateNestedField = (parent: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof PersonalInfoData] as object,
        [field]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card className="p-6">
        <h4 className="text-lg font-semibold mb-4">Basic Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => updateField('firstName', e.target.value)}
              placeholder="Enter your first name"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => updateField('lastName', e.target.value)}
              placeholder="Enter your last name"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => updateField('email', e.target.value)}
              placeholder="Enter your email address"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              placeholder="Enter your phone number"
            />
          </div>
          
          <div>
            <Label htmlFor="dateOfBirth">Date of Birth</Label>
            <Input
              id="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => updateField('dateOfBirth', e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="nationality">Nationality</Label>
            <Select value={formData.nationality} onValueChange={(value) => updateField('nationality', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select your nationality" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="us">United States</SelectItem>
                <SelectItem value="ca">Canada</SelectItem>
                <SelectItem value="uk">United Kingdom</SelectItem>
                <SelectItem value="au">Australia</SelectItem>
                <SelectItem value="de">Germany</SelectItem>
                <SelectItem value="fr">France</SelectItem>
                <SelectItem value="in">India</SelectItem>
                <SelectItem value="cn">China</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Address Information */}
      <Card className="p-6">
        <h4 className="text-lg font-semibold mb-4">Address Information</h4>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <Label htmlFor="street">Street Address</Label>
            <Input
              id="street"
              value={formData.address?.street}
              onChange={(e) => updateNestedField('address', 'street', e.target.value)}
              placeholder="Enter your street address"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.address?.city}
                onChange={(e) => updateNestedField('address', 'city', e.target.value)}
                placeholder="Enter your city"
              />
            </div>
            
            <div>
              <Label htmlFor="state">State/Province</Label>
              <Input
                id="state"
                value={formData.address?.state}
                onChange={(e) => updateNestedField('address', 'state', e.target.value)}
                placeholder="Enter your state/province"
              />
            </div>
            
            <div>
              <Label htmlFor="zipCode">ZIP/Postal Code</Label>
              <Input
                id="zipCode"
                value={formData.address?.zipCode}
                onChange={(e) => updateNestedField('address', 'zipCode', e.target.value)}
                placeholder="Enter your ZIP/postal code"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="country">Country of Residence</Label>
            <Select 
              value={formData.countryOfResidence} 
              onValueChange={(value) => updateField('countryOfResidence', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your country of residence" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="us">United States</SelectItem>
                <SelectItem value="ca">Canada</SelectItem>
                <SelectItem value="uk">United Kingdom</SelectItem>
                <SelectItem value="au">Australia</SelectItem>
                <SelectItem value="de">Germany</SelectItem>
                <SelectItem value="fr">France</SelectItem>
                <SelectItem value="in">India</SelectItem>
                <SelectItem value="cn">China</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Emergency Contact */}
      <Card className="p-6">
        <h4 className="text-lg font-semibold mb-4">Emergency Contact</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="emergencyName">Contact Name</Label>
            <Input
              id="emergencyName"
              value={formData.emergencyContact?.name}
              onChange={(e) => updateNestedField('emergencyContact', 'name', e.target.value)}
              placeholder="Enter emergency contact name"
            />
          </div>
          
          <div>
            <Label htmlFor="emergencyRelationship">Relationship</Label>
            <Select 
              value={formData.emergencyContact?.relationship} 
              onValueChange={(value) => updateNestedField('emergencyContact', 'relationship', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select relationship" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="parent">Parent</SelectItem>
                <SelectItem value="spouse">Spouse</SelectItem>
                <SelectItem value="sibling">Sibling</SelectItem>
                <SelectItem value="guardian">Guardian</SelectItem>
                <SelectItem value="friend">Friend</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="emergencyPhone">Phone Number</Label>
            <Input
              id="emergencyPhone"
              type="tel"
              value={formData.emergencyContact?.phone}
              onChange={(e) => updateNestedField('emergencyContact', 'phone', e.target.value)}
              placeholder="Enter emergency contact phone"
            />
          </div>
          
          <div>
            <Label htmlFor="emergencyEmail">Email Address</Label>
            <Input
              id="emergencyEmail"
              type="email"
              value={formData.emergencyContact?.email}
              onChange={(e) => updateNestedField('emergencyContact', 'email', e.target.value)}
              placeholder="Enter emergency contact email"
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PersonalInfoStep;