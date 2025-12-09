import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { MasterCampus } from "@/types/masterData";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Plus, Edit, Trash2, Building2, Users, Globe, Phone, Mail, Search, CheckCircle2, XCircle, Clock, TrendingUp } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { PageHeader } from '@/components/modern/PageHeader';

export const CampusesConfiguration = () => {
  const isMobile = useIsMobile();
  const [campuses, setCampuses] = useState<MasterCampus[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCampus, setEditingCampus] = useState<MasterCampus | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<MasterCampus>>({
    name: '',
    code: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postal_code: '',
    phone: '',
    email: '',
    website: '',
    timezone: 'UTC',
    is_active: true,
    capacity: 0,
    facilities: []
  });

  useEffect(() => {
    fetchCampuses();
  }, []);

  const fetchCampuses = async () => {
    try {
      const { data, error } = await supabase.from('master_campuses').select('*').order('name');
      if (error) throw error;
      setCampuses(data || []);
    } catch (error) {
      console.error('Error fetching campuses:', error);
      toast({
        title: "Error",
        description: "Failed to fetch campuses",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      if (!formData.name?.trim()) {
        toast({
          title: "Error",
          description: "Campus name is required",
          variant: "destructive"
        });
        return;
      }
      const campusData = {
        ...formData,
        user_id: user.id,
        name: formData.name.trim()
      };
      if (editingCampus) {
        const { error } = await supabase.from('master_campuses').update(campusData).eq('id', editingCampus.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('master_campuses').insert(campusData);
        if (error) throw error;
      }
      toast({
        title: "Success",
        description: `Campus ${editingCampus ? 'updated' : 'created'} successfully`
      });
      setIsModalOpen(false);
      setEditingCampus(null);
      resetForm();
      fetchCampuses();
    } catch (error) {
      console.error('Error saving campus:', error);
      toast({
        title: "Error",
        description: "Failed to save campus",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (campus: MasterCampus) => {
    setEditingCampus(campus);
    setFormData(campus);
    setIsModalOpen(true);
  };

  const handleDelete = async (campus: MasterCampus) => {
    if (!confirm('Are you sure you want to delete this campus?')) return;
    try {
      const { error } = await supabase.from('master_campuses').delete().eq('id', campus.id);
      if (error) throw error;
      toast({
        title: "Success",
        description: "Campus deleted successfully"
      });
      fetchCampuses();
    } catch (error) {
      console.error('Error deleting campus:', error);
      toast({
        title: "Error",
        description: "Failed to delete campus",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      address: '',
      city: '',
      state: '',
      country: '',
      postal_code: '',
      phone: '',
      email: '',
      website: '',
      timezone: 'UTC',
      is_active: true,
      capacity: 0,
      facilities: []
    });
  };

  const filteredCampuses = campuses.filter(campus => 
    campus.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    campus.city?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    campus.country?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCampuses = campuses.filter(c => c.is_active).length;
  const totalCapacity = campuses.reduce((sum, c) => sum + (c.capacity || 0), 0);
  const uniqueCountries = new Set(campuses.map(c => c.country).filter(Boolean)).size;

  return (
    <div className="space-y-6 px-4 sm:px-6 md:px-[100px] py-4 sm:py-6 md:py-[50px]">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-border/50 p-6 md:p-8">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="relative z-10">
          <PageHeader 
            title="Campus Management" 
            subtitle="Manage your institution's campus locations and facilities"
            className="text-left mb-0"
          />
        </div>
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 p-4 transition-all duration-300 hover:shadow-lg hover:border-blue-500/40">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Campuses</p>
              <p className="text-2xl font-bold text-foreground mt-1">{campuses.length}</p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Building2 className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 p-4 transition-all duration-300 hover:shadow-lg hover:border-green-500/40">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Active</p>
              <p className="text-2xl font-bold text-foreground mt-1">{activeCampuses}</p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-green-500/20 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 p-4 transition-all duration-300 hover:shadow-lg hover:border-purple-500/40">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Capacity</p>
              <p className="text-2xl font-bold text-foreground mt-1">{totalCapacity.toLocaleString()}</p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-orange-500/10 to-orange-600/5 border border-orange-500/20 p-4 transition-all duration-300 hover:shadow-lg hover:border-orange-500/40">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Countries</p>
              <p className="text-2xl font-bold text-foreground mt-1">{uniqueCountries}</p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
              <Globe className="h-5 w-5 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search campuses by name, city, or country..." 
            value={searchQuery} 
            onChange={e => setSearchQuery(e.target.value)} 
            className="pl-10 bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary/50"
          />
        </div>
        <Button 
          onClick={() => {
            resetForm();
            setEditingCampus(null);
            setIsModalOpen(true);
          }} 
          className="w-full sm:w-auto bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Campus
        </Button>
      </div>

      {/* Campus Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse rounded-xl border border-border/50 bg-card/50 p-6">
              <div className="h-6 bg-muted rounded w-3/4 mb-4" />
              <div className="h-4 bg-muted rounded w-1/2 mb-2" />
              <div className="h-4 bg-muted rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : filteredCampuses.length === 0 ? (
        <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-border/50 bg-gradient-to-br from-muted/30 to-muted/10 p-12">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <Building2 className="h-8 w-8 text-primary/60" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No campuses found</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm">
              {searchQuery ? 'Try adjusting your search criteria' : 'Get started by adding your first campus location'}
            </p>
            {!searchQuery && (
              <Button onClick={() => { resetForm(); setIsModalOpen(true); }} className="shadow-lg shadow-primary/20">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Campus
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCampuses.map(campus => (
            <div 
              key={campus.id} 
              className="group relative overflow-hidden rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:border-primary/30 hover:-translate-y-1"
            >
              {/* Status Bar */}
              <div className={`h-1 ${campus.is_active ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-gray-400 to-gray-500'}`} />
              
              {/* Card Content */}
              <div className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Building2 className="h-4 w-4 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground text-lg leading-tight">{campus.name}</h3>
                    </div>
                    {campus.code && (
                      <Badge variant="secondary" className="mt-2 font-mono text-xs">
                        {campus.code}
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleEdit(campus)} 
                      className="h-8 w-8 hover:bg-primary/10"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDelete(campus)} 
                      className="h-8 w-8 hover:bg-destructive/10 text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Location */}
                {campus.address && (
                  <div className="flex items-start gap-2 text-sm mb-4 p-3 rounded-lg bg-muted/30">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-foreground">{campus.address}</p>
                      <p className="text-muted-foreground text-xs mt-0.5">
                        {[campus.city, campus.state, campus.country].filter(Boolean).join(', ')}
                        {campus.postal_code && ` ${campus.postal_code}`}
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Contact Info */}
                <div className="space-y-2 mb-4">
                  {campus.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-muted-foreground truncate">{campus.phone}</span>
                    </div>
                  )}
                  {campus.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-muted-foreground truncate">{campus.email}</span>
                    </div>
                  )}
                  {campus.website && (
                    <div className="flex items-center gap-2 text-sm">
                      <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                      <a href={campus.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate text-xs">
                        {campus.website.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">{campus.capacity || 0}</span> capacity
                      </span>
                    </div>
                    {campus.timezone && (
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{campus.timezone}</span>
                      </div>
                    )}
                  </div>
                  {campus.is_active ? (
                    <Badge className="bg-green-500/10 text-green-600 border-green-500/20 hover:bg-green-500/20 text-xs">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-xs">
                      <XCircle className="h-3 w-3 mr-1" />
                      Inactive
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="pb-4 border-b border-border/50">
            <DialogTitle className="text-xl flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              {editingCampus ? 'Edit Campus' : 'Add New Campus'}
            </DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="basic" className="flex-1 overflow-hidden flex flex-col">
            <TabsList className="grid w-full grid-cols-3 bg-muted/50">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="location">Location</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
            </TabsList>
            
            <div className="flex-1 overflow-y-auto pr-2 py-4">
              <TabsContent value="basic" className="space-y-4 mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Campus Name *</Label>
                    <Input 
                      id="name" 
                      value={formData.name || ''} 
                      onChange={e => setFormData({ ...formData, name: e.target.value })} 
                      placeholder="Main Campus"
                      className="bg-background/50"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="code">Campus Code</Label>
                    <Input 
                      id="code" 
                      value={formData.code || ''} 
                      onChange={e => setFormData({ ...formData, code: e.target.value })} 
                      placeholder="MC"
                      className="bg-background/50"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="capacity">Student Capacity</Label>
                    <Input 
                      id="capacity" 
                      type="number" 
                      value={formData.capacity || 0} 
                      onChange={e => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })} 
                      placeholder="5000"
                      className="bg-background/50"
                    />
                  </div>

                  <div className="md:col-span-2 flex items-center gap-3 p-4 bg-muted/30 rounded-xl border border-border/50">
                    <Switch 
                      id="is_active" 
                      checked={formData.is_active} 
                      onCheckedChange={checked => setFormData({ ...formData, is_active: checked })}
                    />
                    <div>
                      <Label htmlFor="is_active" className="cursor-pointer font-medium">Active Campus</Label>
                      <p className="text-xs text-muted-foreground">Students can enroll in programs at this campus</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="location" className="space-y-4 mt-0">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Street Address</Label>
                    <Input 
                      id="address" 
                      value={formData.address || ''} 
                      onChange={e => setFormData({ ...formData, address: e.target.value })} 
                      placeholder="123 University Avenue"
                      className="bg-background/50"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input 
                        id="city" 
                        value={formData.city || ''} 
                        onChange={e => setFormData({ ...formData, city: e.target.value })} 
                        placeholder="Sydney"
                        className="bg-background/50"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="postal_code">Postal Code</Label>
                      <Input 
                        id="postal_code" 
                        value={formData.postal_code || ''} 
                        onChange={e => setFormData({ ...formData, postal_code: e.target.value })} 
                        placeholder="2000"
                        className="bg-background/50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="state">State/Province</Label>
                      <Input 
                        id="state" 
                        value={formData.state || ''} 
                        onChange={e => setFormData({ ...formData, state: e.target.value })} 
                        placeholder="NSW"
                        className="bg-background/50"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input 
                        id="country" 
                        value={formData.country || ''} 
                        onChange={e => setFormData({ ...formData, country: e.target.value })} 
                        placeholder="Australia"
                        className="bg-background/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Input 
                      id="timezone" 
                      value={formData.timezone || 'UTC'} 
                      onChange={e => setFormData({ ...formData, timezone: e.target.value })} 
                      placeholder="Australia/Sydney"
                      className="bg-background/50"
                    />
                    <p className="text-xs text-muted-foreground">
                      Used for scheduling and time-based communications
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="contact" className="space-y-4 mt-0">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      value={formData.phone || ''} 
                      onChange={e => setFormData({ ...formData, phone: e.target.value })} 
                      placeholder="+61 2 1234 5678"
                      className="bg-background/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={formData.email || ''} 
                      onChange={e => setFormData({ ...formData, email: e.target.value })} 
                      placeholder="campus@university.edu"
                      className="bg-background/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Website URL</Label>
                    <Input 
                      id="website" 
                      value={formData.website || ''} 
                      onChange={e => setFormData({ ...formData, website: e.target.value })} 
                      placeholder="https://campus.university.edu"
                      className="bg-background/50"
                    />
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>

          <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
              {editingCampus ? 'Update Campus' : 'Create Campus'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
