import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Building2, Users, Plus, Search, Filter, Edit, Trash2, Eye } from 'lucide-react';
import { RecruiterService } from '@/services/recruiterService';
import { useToast } from '@/hooks/use-toast';
import type { RecruiterCompany, RecruiterUser } from '@/types/recruiter';

export default function RecruiterManagement() {
  const [companies, setCompanies] = useState<RecruiterCompany[]>([]);
  const [users, setUsers] = useState<RecruiterUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<RecruiterCompany | null>(null);
  const [selectedUser, setSelectedUser] = useState<RecruiterUser | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [companiesData, usersData] = await Promise.all([
        RecruiterService.getRecruiterCompanies(),
        RecruiterService.getRecruiterUsers()
      ]);
      setCompanies(companiesData);
      setUsers(usersData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load recruiter data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (company.email && company.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || company.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleCreateCompany = async (data: Partial<RecruiterCompany>) => {
    try {
      await RecruiterService.createRecruiterCompany(data);
      await loadData();
      setShowCompanyModal(false);
      toast({
        title: "Success",
        description: "Recruiter company created successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create recruiter company",
        variant: "destructive"
      });
    }
  };

  const handleUpdateCompany = async (id: string, data: Partial<RecruiterCompany>) => {
    try {
      await RecruiterService.updateRecruiterCompany(id, data);
      await loadData();
      setShowCompanyModal(false);
      setSelectedCompany(null);
      toast({
        title: "Success",
        description: "Recruiter company updated successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update recruiter company",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'bg-success text-success-foreground',
      inactive: 'bg-muted text-muted-foreground',
      suspended: 'bg-destructive text-destructive-foreground'
    };
    return <Badge className={variants[status as keyof typeof variants] || variants.inactive}>{status}</Badge>;
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Recruiter Management</h1>
          <p className="text-muted-foreground">Manage external recruiter companies and users</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showCompanyModal} onOpenChange={setShowCompanyModal}>
            <DialogTrigger asChild>
              <Button onClick={() => setSelectedCompany(null)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Company
              </Button>
            </DialogTrigger>
            <CompanyModal 
              company={selectedCompany}
              onSave={selectedCompany ? 
                (data) => handleUpdateCompany(selectedCompany.id, data) : 
                handleCreateCompany
              }
            />
          </Dialog>
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search companies or users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="companies" className="space-y-4">
        <TabsList>
          <TabsTrigger value="companies" className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Companies ({filteredCompanies.length})
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Users ({filteredUsers.length})
          </TabsTrigger>
          <TabsTrigger value="portal" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Portal Management
          </TabsTrigger>
        </TabsList>

        <TabsContent value="companies">
          <Card>
            <CardHeader>
              <CardTitle>Recruiter Companies</CardTitle>
              <CardDescription>Manage external recruiter companies and their settings</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Commission</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-24">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCompanies.map((company) => (
                    <TableRow key={company.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{company.name}</div>
                          <div className="text-sm text-muted-foreground">{company.country}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="text-sm">{company.email}</div>
                          <div className="text-sm text-muted-foreground">{company.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {company.commission_rate}% ({company.commission_type})
                      </TableCell>
                      <TableCell>{getStatusBadge(company.status)}</TableCell>
                      <TableCell>{new Date(company.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedCompany(company);
                              setShowCompanyModal(true);
                            }}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Recruiter Users</CardTitle>
              <CardDescription>Manage individual recruiter user accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead className="w-24">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{user.first_name} {user.last_name}</div>
                          <div className="text-sm text-muted-foreground">{user.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.company?.name}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === 'company_admin' ? 'default' : 'secondary'}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.is_active ? 'default' : 'secondary'}>
                          {user.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.last_login_at ? new Date(user.last_login_at).toLocaleDateString() : 'Never'}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-3 h-3" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="portal">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Portal Management</CardTitle>
                <CardDescription>Configure and manage the recruiter portal</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full" onClick={() => window.open('/admin/recruiter-portal-management', '_blank')}>
                  <Settings className="w-4 h-4 mr-2" />
                  Manage Portal Content
                </Button>
                <Button className="w-full" onClick={() => window.open('/admin/recruiter-portal-preview', '_blank')}>
                  <Eye className="w-4 h-4 mr-2" />
                  Preview Portal
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
                <CardDescription>Portal overview and metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Active Companies</span>
                    <span className="font-medium">{filteredCompanies.filter(c => c.status === 'active').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Users</span>
                    <span className="font-medium">{filteredUsers.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Portal Status</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function CompanyModal({ 
  company, 
  onSave 
}: { 
  company: RecruiterCompany | null; 
  onSave: (data: Partial<RecruiterCompany>) => void;
}) {
  const [formData, setFormData] = useState<{
    name: string;
    country: string;
    website: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    state: string;
    zip_code: string;
    assigned_contact: string;
    commission_rate: number;
    commission_type: 'percentage' | 'fixed';
    status: 'active' | 'inactive' | 'suspended';
    notes: string;
  }>({
    name: '',
    country: '',
    website: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    assigned_contact: '',
    commission_rate: 5,
    commission_type: 'percentage',
    status: 'active',
    notes: ''
  });

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name || '',
        country: company.country || '',
        website: company.website || '',
        phone: company.phone || '',
        email: company.email || '',
        address: company.address || '',
        city: company.city || '',
        state: company.state || '',
        zip_code: company.zip_code || '',
        assigned_contact: company.assigned_contact || '',
        commission_rate: company.commission_rate || 5,
        commission_type: company.commission_type || 'percentage',
        status: company.status || 'active',
        notes: company.notes || ''
      });
    }
  }, [company]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{company ? 'Edit Company' : 'Add New Company'}</DialogTitle>
        <DialogDescription>
          {company ? 'Update company information' : 'Create a new recruiter company'}
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Company Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>
          <div>
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              value={formData.country}
              onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            value={formData.website}
            onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="commission_rate">Commission Rate</Label>
            <Input
              id="commission_rate"
              type="number"
              min="0"
              max="100"
              value={formData.commission_rate}
              onChange={(e) => setFormData(prev => ({ ...prev, commission_rate: Number(e.target.value) }))}
            />
          </div>
          <div>
            <Label htmlFor="commission_type">Commission Type</Label>
            <Select value={formData.commission_type} onValueChange={(value: 'percentage' | 'fixed') => setFormData(prev => ({ ...prev, commission_type: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percentage">Percentage</SelectItem>
                <SelectItem value="fixed">Fixed Amount</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value: 'active' | 'inactive' | 'suspended') => setFormData(prev => ({ ...prev, status: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            rows={3}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button type="submit">
            {company ? 'Update Company' : 'Create Company'}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
}