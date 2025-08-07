import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2, MapPin, CreditCard, GraduationCap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { RequirementsManagement as RequirementsManagementComponent } from './RequirementsManagement';

export const MasterDataManagement = () => {
  const [campuses, setCampuses] = useState([]);
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [requirements, setRequirements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchMasterData();
  }, []);

  const fetchMasterData = async () => {
    try {
      setIsLoading(true);
      
      // Use sample data that matches the database structure for now
      setCampuses([
        { id: '1', name: 'Sydney Campus', location: 'Sydney CBD', country: 'Australia', is_active: true },
        { id: '2', name: 'Melbourne Campus', location: 'Melbourne CBD', country: 'Australia', is_active: true },
        { id: '3', name: 'Brisbane Campus', location: 'Brisbane City', country: 'Australia', is_active: false }
      ]);
      
      setPaymentTypes([
        { id: '1', name: 'Credit Card', description: 'Visa, MasterCard, AMEX accepted', is_active: true },
        { id: '2', name: 'Bank Transfer', description: 'Direct bank transfer', is_active: true },
        { id: '3', name: 'Payment Plan', description: 'Installment payment plan', is_active: true },
        { id: '4', name: 'Student Loan', description: 'Government student loan', is_active: false }
      ]);
      
      setRequirements([
        { id: '1', name: 'High School Certificate', description: 'Completed secondary education', type: 'Educational', is_required: true },
        { id: '2', name: 'IELTS 6.5', description: 'English language proficiency', type: 'Language', is_required: true },
        { id: '3', name: 'Work Experience', description: 'Minimum 2 years relevant experience', type: 'Professional', is_required: false },
        { id: '4', name: 'Portfolio', description: 'Design or project portfolio', type: 'Creative', is_required: false }
      ]);

      toast({
        title: "Success",
        description: "Master data loaded successfully",
      });
    } catch (error) {
      console.error('Error fetching master data:', error);
      toast({
        title: "Error",
        description: "Failed to load master data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const CampusManagement = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-lg font-medium">Campus Locations</h4>
          <p className="text-sm text-muted-foreground">Manage your institution's campus locations</p>
        </div>
        <Button className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Campus</span>
        </Button>
      </div>

      <div className="grid gap-4">
        {campuses.map((campus: any) => (
          <Card key={campus.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle className="text-base">{campus.name}</CardTitle>
                    <CardDescription>{campus.location}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={campus.is_active ? 'default' : 'secondary'}>
                    {campus.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Campus Name</Label>
                  <Input value={campus.name} />
                </div>
                <div>
                  <Label>Location</Label>
                  <Input value={campus.location} />
                </div>
                <div className="col-span-2">
                  <Label>Address</Label>
                  <Textarea placeholder="Full campus address..." />
                </div>
                <div>
                  <Label>Contact Phone</Label>
                  <Input placeholder="+1 (555) 123-4567" />
                </div>
                <div>
                  <Label>Contact Email</Label>
                  <Input placeholder="campus@university.edu" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const PaymentTypesManagement = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-lg font-medium">Payment Types</h4>
          <p className="text-sm text-muted-foreground">Configure available payment methods</p>
        </div>
        <Button className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Payment Type</span>
        </Button>
      </div>

      <div className="grid gap-4">
        {paymentTypes.map((payment: any) => (
          <Card key={payment.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle className="text-base">{payment.name}</CardTitle>
                    <CardDescription>{payment.description}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={payment.is_active ? 'default' : 'secondary'}>
                    {payment.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                  <Switch checked={payment.is_active} />
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );

  const RequirementsManagement = () => {
    return <RequirementsManagementComponent />;
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="campuses" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="campuses">Campus Locations</TabsTrigger>
          <TabsTrigger value="payments">Payment Types</TabsTrigger>
          <TabsTrigger value="requirements">Entry Requirements</TabsTrigger>
        </TabsList>

        <TabsContent value="campuses">
          <CampusManagement />
        </TabsContent>

        <TabsContent value="payments">
          <PaymentTypesManagement />
        </TabsContent>

        <TabsContent value="requirements">
          <RequirementsManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};