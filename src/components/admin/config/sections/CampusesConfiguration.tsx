import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { MasterCampus } from "@/types/masterData";
import { useToast } from "@/hooks/use-toast";
import { 
  MapPin, 
  Plus, 
  Edit, 
  Trash2, 
  Building2, 
  Users, 
  Globe, 
  Phone, 
  Mail,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Navigation
} from 'lucide-react';

export const CampusesConfiguration = () => {
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
      const { data, error } = await supabase
        .from('master_campuses')
        .select('*')
        .order('name');

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
        const { error } = await supabase
          .from('master_campuses')
          .update(campusData)
          .eq('id', editingCampus.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('master_campuses')
          .insert(campusData);
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
      const { error } = await supabase
        .from('master_campuses')
        .delete()
        .eq('id', campus.id);

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

  // Filter campuses based on search
  const filteredCampuses = campuses.filter(campus =>
    campus.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    campus.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    campus.country?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate stats
  const activeCampuses = campuses.filter(c => c.is_active).length;
  const totalCapacity = campuses.reduce((sum, c) => sum + (c.capacity || 0), 0);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Campus Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage your institution's campus locations and facilities
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Campuses</p>
                  <p className="text-3xl font-bold text-blue-700 dark:text-blue-300 mt-2">{campuses.length}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/20 dark:to-green-900/20 border-green-200 dark:border-green-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">Active Campuses</p>
                  <p className="text-3xl font-bold text-green-700 dark:text-green-300 mt-2">{activeCampuses}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/20 dark:to-purple-900/20 border-purple-200 dark:border-purple-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Total Capacity</p>
                  <p className="text-3xl font-bold text-purple-700 dark:text-purple-300 mt-2">{totalCapacity.toLocaleString()}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                  <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search campuses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button 
            onClick={() => {
              resetForm();
              setEditingCampus(null);
              setIsModalOpen(true);
            }}
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Campus
          </Button>
        </div>
      </div>

      {/* Campus Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-40 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredCampuses.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Building2 className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No campuses found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {searchQuery ? 'Try adjusting your search' : 'Get started by adding your first campus'}
            </p>
            {!searchQuery && (
              <Button onClick={() => {
                resetForm();
                setIsModalOpen(true);
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Campus
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCampuses.map((campus) => (
            <Card 
              key={campus.id} 
              className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/30 overflow-hidden"
            >
              <div className={`h-2 ${campus.is_active ? 'bg-green-500' : 'bg-gray-400'}`} />
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Building2 className="h-5 w-5 text-primary" />
                      {campus.name}
                    </CardTitle>
                    {campus.code && (
                      <Badge variant="secondary" className="mt-2">
                        {campus.code}
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(campus)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(campus)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {campus.address && (
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-foreground">{campus.address}</p>
                      <p className="text-muted-foreground">
                        {[campus.city, campus.state, campus.country].filter(Boolean).join(', ')}
                      </p>
                      {campus.postal_code && (
                        <p className="text-muted-foreground">{campus.postal_code}</p>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                  {campus.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground truncate">{campus.phone}</span>
                    </div>
                  )}
                  {campus.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground truncate">{campus.email}</span>
                    </div>
                  )}
                  {campus.website && (
                    <div className="flex items-center gap-2 text-sm col-span-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <a 
                        href={campus.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline truncate"
                      >
                        {campus.website}
                      </a>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">
                      Capacity: <span className="font-semibold">{campus.capacity || 0}</span>
                    </span>
                  </div>
                  {campus.timezone && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{campus.timezone}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-2">
                  {campus.is_active ? (
                    <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      <XCircle className="h-3 w-3 mr-1" />
                      Inactive
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <Building2 className="h-6 w-6 text-primary" />
              {editingCampus ? 'Edit Campus' : 'Add New Campus'}
            </DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="basic" className="flex-1 overflow-hidden flex flex-col">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="location">Location</TabsTrigger>
              <TabsTrigger value="contact">Contact & Settings</TabsTrigger>
            </TabsList>
            
            <div className="flex-1 overflow-y-auto pr-2">
              <TabsContent value="basic" className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Campus Name *</Label>
                    <Input
                      id="name"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Main Campus"
                      className="mt-1.5"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="code">Campus Code</Label>
                    <Input
                      id="code"
                      value={formData.code || ''}
                      onChange={(e) => setFormData({...formData, code: e.target.value})}
                      placeholder="MC"
                      className="mt-1.5"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="capacity">Student Capacity</Label>
                    <Input
                      id="capacity"
                      type="number"
                      value={formData.capacity || 0}
                      onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value) || 0})}
                      placeholder="5000"
                      className="mt-1.5"
                    />
                  </div>

                  <div className="md:col-span-2 flex items-center space-x-2 p-4 bg-muted/50 rounded-lg">
                    <Switch
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
                    />
                    <Label htmlFor="is_active" className="cursor-pointer">
                      Active Campus (Students can enroll)
                    </Label>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="location" className="space-y-4 mt-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="address">Street Address</Label>
                    <Input
                      id="address"
                      value={formData.address || ''}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      placeholder="123 University Avenue"
                      className="mt-1.5"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={formData.city || ''}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                        placeholder="Sydney"
                        className="mt-1.5"
                      />
                    </div>

                    <div>
                      <Label htmlFor="postal_code">Postal Code</Label>
                      <Input
                        id="postal_code"
                        value={formData.postal_code || ''}
                        onChange={(e) => setFormData({...formData, postal_code: e.target.value})}
                        placeholder="2000"
                        className="mt-1.5"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="state">State/Province</Label>
                      <Input
                        id="state"
                        value={formData.state || ''}
                        onChange={(e) => setFormData({...formData, state: e.target.value})}
                        placeholder="NSW"
                        className="mt-1.5"
                      />
                    </div>

                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        value={formData.country || ''}
                        onChange={(e) => setFormData({...formData, country: e.target.value})}
                        placeholder="Australia"
                        className="mt-1.5"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="timezone">Timezone</Label>
                    <Input
                      id="timezone"
                      value={formData.timezone || 'UTC'}
                      onChange={(e) => setFormData({...formData, timezone: e.target.value})}
                      placeholder="Australia/Sydney"
                      className="mt-1.5"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Used for scheduling and time-based communications
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="contact" className="space-y-4 mt-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone || ''}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="+61 2 1234 5678"
                      className="mt-1.5"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email || ''}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="campus@university.edu"
                      className="mt-1.5"
                    />
                  </div>

                  <div>
                    <Label htmlFor="website">Website URL</Label>
                    <Input
                      id="website"
                      value={formData.website || ''}
                      onChange={(e) => setFormData({...formData, website: e.target.value})}
                      placeholder="https://campus.university.edu"
                      className="mt-1.5"
                    />
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
              {editingCampus ? 'Update Campus' : 'Create Campus'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
