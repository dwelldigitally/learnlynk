import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Globe, 
  Phone, 
  Mail, 
  MapPin, 
  Edit3, 
  Check, 
  ArrowRight,
  Palette,
  Calendar
} from 'lucide-react';

interface InstitutionReviewProps {
  institution: {
    name: string;
    description: string;
    website: string;
    phone?: string;
    email?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    logo_url?: string;
    primary_color?: string;
    founded_year?: number;
    employee_count?: number;
  };
  onConfirm: (institution: any) => void;
  onEdit: () => void;
}

const InstitutionReview: React.FC<InstitutionReviewProps> = ({
  institution,
  onConfirm,
  onEdit
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedInstitution, setEditedInstitution] = useState(institution);

  const handleSave = () => {
    setIsEditing(false);
    onConfirm(editedInstitution);
  };

  const handleFieldChange = (field: string, value: string | number) => {
    setEditedInstitution(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (isEditing) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-xl mb-4">
            <Edit3 className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Review Institution Details
          </h3>
          <p className="text-muted-foreground">
            Please review and edit the extracted institution information
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Institution Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Institution Name</Label>
                <Input
                  id="name"
                  value={editedInstitution.name}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                  placeholder="Institution Name"
                />
              </div>
              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={editedInstitution.website}
                  onChange={(e) => handleFieldChange('website', e.target.value)}
                  placeholder="https://example.com"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={editedInstitution.phone || ''}
                  onChange={(e) => handleFieldChange('phone', e.target.value)}
                  placeholder="Phone number"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={editedInstitution.email || ''}
                  onChange={(e) => handleFieldChange('email', e.target.value)}
                  placeholder="contact@example.com"
                />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={editedInstitution.city || ''}
                  onChange={(e) => handleFieldChange('city', e.target.value)}
                  placeholder="City"
                />
              </div>
              <div>
                <Label htmlFor="state">State/Province</Label>
                <Input
                  id="state"
                  value={editedInstitution.state || ''}
                  onChange={(e) => handleFieldChange('state', e.target.value)}
                  placeholder="State/Province"
                />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={editedInstitution.country || ''}
                  onChange={(e) => handleFieldChange('country', e.target.value)}
                  placeholder="Country"
                />
              </div>
              <div>
                <Label htmlFor="founded_year">Founded Year</Label>
                <Input
                  id="founded_year"
                  type="number"
                  value={editedInstitution.founded_year || ''}
                  onChange={(e) => handleFieldChange('founded_year', parseInt(e.target.value) || 0)}
                  placeholder="Year founded"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={editedInstitution.description}
                onChange={(e) => handleFieldChange('description', e.target.value)}
                placeholder="Institution description"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={editedInstitution.address || ''}
                onChange={(e) => handleFieldChange('address', e.target.value)}
                placeholder="Full address"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center space-x-3">
          <Button variant="outline" onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Check className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-xl mb-4">
          <Building2 className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Institution Review
        </h3>
        <p className="text-muted-foreground">
          Review the extracted institution information before proceeding
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Institution Information</CardTitle>
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            <Edit3 className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Main Info */}
          <div className="flex items-start space-x-4">
            {editedInstitution.logo_url && (
              <img 
                src={editedInstitution.logo_url} 
                alt="Institution Logo" 
                className="w-16 h-16 object-contain rounded-lg border"
              />
            )}
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-foreground">{editedInstitution.name}</h4>
              <p className="text-muted-foreground mt-1">{editedInstitution.description}</p>
              {editedInstitution.founded_year && (
                <Badge variant="outline" className="mt-2">
                  <Calendar className="w-3 h-3 mr-1" />
                  Founded {editedInstitution.founded_year}
                </Badge>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {editedInstitution.website && (
              <div className="flex items-center space-x-3">
                <Globe className="w-4 h-4 text-muted-foreground" />
                <div>
                  <Label className="text-sm text-muted-foreground">Website</Label>
                  <p className="text-sm font-medium">{editedInstitution.website}</p>
                </div>
              </div>
            )}
            
            {editedInstitution.phone && (
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <div>
                  <Label className="text-sm text-muted-foreground">Phone</Label>
                  <p className="text-sm font-medium">{editedInstitution.phone}</p>
                </div>
              </div>
            )}
            
            {editedInstitution.email && (
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <div>
                  <Label className="text-sm text-muted-foreground">Email</Label>
                  <p className="text-sm font-medium">{editedInstitution.email}</p>
                </div>
              </div>
            )}
            
            {(editedInstitution.city || editedInstitution.address) && (
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <div>
                  <Label className="text-sm text-muted-foreground">Location</Label>
                  <p className="text-sm font-medium">
                    {editedInstitution.address || `${editedInstitution.city}, ${editedInstitution.state}, ${editedInstitution.country}`}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Additional Details */}
          {(editedInstitution.primary_color || editedInstitution.employee_count) && (
            <div className="flex flex-wrap gap-4">
              {editedInstitution.primary_color && (
                <div className="flex items-center space-x-2">
                  <Palette className="w-4 h-4 text-muted-foreground" />
                  <Label className="text-sm text-muted-foreground">Brand Color</Label>
                  <div 
                    className="w-4 h-4 rounded border"
                    style={{ backgroundColor: editedInstitution.primary_color }}
                  />
                  <span className="text-sm font-medium">{editedInstitution.primary_color}</span>
                </div>
              )}
              
              {editedInstitution.employee_count && (
                <Badge variant="outline">
                  {editedInstitution.employee_count} employees
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-center space-x-3">
        <Button variant="outline" onClick={onEdit}>
          Edit Institution
        </Button>
        <Button onClick={() => onConfirm(editedInstitution)}>
          <Check className="w-4 h-4 mr-2" />
          Confirm & Continue
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default InstitutionReview;