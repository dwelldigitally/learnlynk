import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Users, Building, Plus, Search, Edit, Trash2, Eye, Map as MapIcon, BookOpen, UserCheck } from 'lucide-react';
import { usePracticumSites, usePracticumSiteMutations, usePracticumPrograms } from '@/hooks/usePracticum';
import { useAuth } from '@/contexts/AuthContext';
import Map from '@/components/Map';
import type { PracticumSiteInsert } from '@/types/practicum';
import { PreceptorManagement } from '@/components/admin/practicum/PreceptorManagement';

export function SiteManagement() {
  const { session } = useAuth();
  const { data: sites, isLoading } = usePracticumSites(session?.user?.id || '');
  const { data: programs } = usePracticumPrograms(session?.user?.id || '');
  const { createSite, updateSite } = usePracticumSiteMutations();
  
  const [activeTab, setActiveTab] = useState('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSite, setEditingSite] = useState<string | null>(null);
  const [selectedSiteForPreceptors, setSelectedSiteForPreceptors] = useState<{id: string, name: string} | null>(null);
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([]);
  const [formData, setFormData] = useState<Partial<PracticumSiteInsert>>({
    name: '',
    organization: '',
    address: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'Canada',
    contact_person: '',
    contact_email: '',
    contact_phone: '',
    latitude: null,
    longitude: null,
    max_capacity_per_month: 5,
    max_capacity_per_year: 50,
    max_capacity_per_semester: 25,
    is_active: true,
    specializations: [],
    requirements: {}
  });

  const filteredSites = sites?.filter(site =>
    site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    site.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
    site.city.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const siteData = {
      ...formData,
      user_id: session?.user?.id || ''
    } as PracticumSiteInsert;

    try {
      if (editingSite) {
        await updateSite.mutateAsync({ id: editingSite, updates: siteData });
      } else {
        await createSite.mutateAsync(siteData);
      }
      
      setIsDialogOpen(false);
      setEditingSite(null);
      setFormData({
        name: '',
        organization: '',
        address: '',
        city: '',
        state: '',
        postal_code: '',
        country: 'Canada',
        contact_person: '',
        contact_email: '',
        contact_phone: '',
        latitude: null,
        longitude: null,
        max_capacity_per_month: 5,
        max_capacity_per_year: 50,
        max_capacity_per_semester: 25,
        is_active: true,
        specializations: [],
        requirements: {}
      });
      setSelectedPrograms([]);
    } catch (error) {
      console.error('Error saving site:', error);
    }
  };

  const handleEdit = (site: any) => {
    setEditingSite(site.id);
    setFormData({
      name: site.name,
      organization: site.organization,
      address: site.address,
      city: site.city,
      state: site.state,
      postal_code: site.postal_code,
      country: site.country,
      contact_person: site.contact_person,
      contact_email: site.contact_email,
      contact_phone: site.contact_phone,
      latitude: site.latitude,
      longitude: site.longitude,
      max_capacity_per_month: site.max_capacity_per_month,
      max_capacity_per_year: site.max_capacity_per_year,
      max_capacity_per_semester: site.max_capacity_per_semester,
      is_active: site.is_active,
      specializations: site.specializations,
      requirements: site.requirements
    });
    // TODO: Load existing program associations
    setSelectedPrograms([]);
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="h-8 bg-muted rounded w-48"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-muted rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Site Management</h1>
          <p className="text-muted-foreground">Manage practicum placement sites, their capacity, and program associations</p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingSite(null)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Site
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingSite ? 'Edit Site' : 'Add New Site'}</DialogTitle>
                <DialogDescription>
                  Configure practicum site details, capacity limits, and program associations
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="basic">Basic Info</TabsTrigger>
                    <TabsTrigger value="contact">Contact</TabsTrigger>
                    <TabsTrigger value="capacity">Capacity</TabsTrigger>
                    <TabsTrigger value="programs">Programs</TabsTrigger>
                  </TabsList>
                
                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Site Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="General Hospital - ICU"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="organization">Organization</Label>
                      <Input
                        id="organization"
                        value={formData.organization}
                        onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                        placeholder="General Hospital"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="123 Main Street"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        placeholder="Toronto"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">Province/State</Label>
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        placeholder="ON"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postal_code">Postal Code</Label>
                      <Input
                        id="postal_code"
                        value={formData.postal_code}
                        onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                        placeholder="M5V 3A8"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="latitude">Latitude</Label>
                      <Input
                        id="latitude"
                        type="number"
                        step="any"
                        value={formData.latitude || ''}
                        onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) || null })}
                        placeholder="43.6532"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="longitude">Longitude</Label>
                      <Input
                        id="longitude"
                        type="number"
                        step="any"
                        value={formData.longitude || ''}
                        onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) || null })}
                        placeholder="-79.3832"
                      />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="contact" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact_person">Contact Person</Label>
                    <Input
                      id="contact_person"
                      value={formData.contact_person}
                      onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                      placeholder="Dr. Sarah Johnson"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contact_email">Contact Email</Label>
                      <Input
                        id="contact_email"
                        type="email"
                        value={formData.contact_email}
                        onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                        placeholder="sarah.johnson@hospital.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact_phone">Contact Phone</Label>
                      <Input
                        id="contact_phone"
                        value={formData.contact_phone}
                        onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                        placeholder="(416) 555-0123"
                        required
                      />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="capacity" className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="max_capacity_monthly">Monthly Capacity</Label>
                      <Input
                        id="max_capacity_monthly"
                        type="number"
                        min="1"
                        value={formData.max_capacity_per_month}
                        onChange={(e) => setFormData({ ...formData, max_capacity_per_month: parseInt(e.target.value) })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="max_capacity_semester">Semester Capacity</Label>
                      <Input
                        id="max_capacity_semester"
                        type="number"
                        min="1"
                        value={formData.max_capacity_per_semester}
                        onChange={(e) => setFormData({ ...formData, max_capacity_per_semester: parseInt(e.target.value) })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="max_capacity_yearly">Yearly Capacity</Label>
                      <Input
                        id="max_capacity_yearly"
                        type="number"
                        min="1"
                        value={formData.max_capacity_per_year}
                        onChange={(e) => setFormData({ ...formData, max_capacity_per_year: parseInt(e.target.value) })}
                        required
                      />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="programs" className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-base font-medium">Associated Programs</Label>
                      <p className="text-sm text-muted-foreground">Select which practicum programs can use this site</p>
                    </div>
                    
                    {programs && programs.length > 0 ? (
                      <div className="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto">
                        {programs.map((program) => (
                          <div key={program.id} className="flex items-center space-x-2 p-3 border rounded-lg">
                            <Checkbox
                              id={`program-${program.id}`}
                              checked={selectedPrograms.includes(program.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedPrograms([...selectedPrograms, program.id]);
                                } else {
                                  setSelectedPrograms(selectedPrograms.filter(id => id !== program.id));
                                }
                              }}
                            />
                            <div className="flex-1">
                              <Label 
                                htmlFor={`program-${program.id}`} 
                                className="font-medium cursor-pointer"
                              >
                                {program.program_name}
                              </Label>
                              <p className="text-sm text-muted-foreground">
                                {program.total_hours_required} hours • {program.weeks_duration} weeks
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>No programs available. Create programs first to associate them with sites.</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createSite.isPending || updateSite.isPending}>
                  {editingSite ? 'Update Site' : 'Create Site'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="list" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Sites List
          </TabsTrigger>
          <TabsTrigger value="map" className="flex items-center gap-2">
            <MapIcon className="h-4 w-4" />
            Map View
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-6">
          {/* Search */}
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search sites..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Sites Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSites.map((site) => (
              <Card key={site.id} className="hover-scale">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{site.name}</CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <Building className="h-3 w-3" />
                        {site.organization}
                      </CardDescription>
                    </div>
                    <Badge variant={site.is_active ? "default" : "secondary"}>
                      {site.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>
                      {site.address}<br />
                      {site.city}, {site.state} {site.postal_code}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Monthly Capacity:</span>
                      <span className="font-medium">{site.max_capacity_per_month}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Semester Capacity:</span>
                      <span className="font-medium">{site.max_capacity_per_semester}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Yearly Capacity:</span>
                      <span className="font-medium">{site.max_capacity_per_year}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 pt-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(site)}>
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setSelectedSiteForPreceptors({id: site.id, name: site.name})}
                    >
                      <UserCheck className="h-3 w-3 mr-1" />
                      Preceptors
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredSites.length === 0 && (
            <div className="text-center py-12">
              <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium mb-2">No sites found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? 'Try adjusting your search terms' : 'Start by adding your first practicum site'}
              </p>
              {!searchTerm && (
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Site
                </Button>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="map" className="space-y-6">
          <div className="h-[600px] w-full">
            <Map 
              sites={sites?.map(site => ({
                id: site.id,
                name: site.name,
                latitude: site.latitude || undefined,
                longitude: site.longitude || undefined,
                address: site.address || '',
                city: site.city || '',
                state: site.state || ''
              }))}
              onSiteClick={(siteId) => {
                const site = sites?.find(s => s.id === siteId);
                if (site) {
                  handleEdit(site);
                }
              }}
              className="h-full w-full"
            />
          </div>
          
          <div className="text-center text-sm text-muted-foreground">
            <p>Click on map markers to edit site details. Sites without coordinates won't appear on the map.</p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Preceptor Management Dialog */}
      <Dialog 
        open={!!selectedSiteForPreceptors} 
        onOpenChange={(open) => !open && setSelectedSiteForPreceptors(null)}
      >
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Preceptors</DialogTitle>
          </DialogHeader>
          {selectedSiteForPreceptors && (
            <PreceptorManagement 
              siteId={selectedSiteForPreceptors.id}
              siteName={selectedSiteForPreceptors.name}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}