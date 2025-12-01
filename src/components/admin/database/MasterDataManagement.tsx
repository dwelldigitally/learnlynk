import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2, MapPin, CreditCard, GraduationCap, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { RequirementsManagement as RequirementsManagementComponent } from './RequirementsManagement';
import { useCampuses } from '@/hooks/useCampuses';

export const MasterDataManagement = () => {
  const { data: campuses = [], isLoading: campusesLoading, refetch: refetchCampuses } = useCampuses();
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
      
      // Payment types and requirements still use sample data
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

      {campusesLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Loading campuses...</span>
        </div>
      ) : campuses.length === 0 ? (
        <div className="text-center py-8 bg-muted/30 rounded-lg border-2 border-dashed border-border">
          <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No campuses configured</h3>
          <p className="text-muted-foreground mb-4">
            Add your first campus location to get started
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add First Campus
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {campuses.map((campus: any) => (
            <Card key={campus.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-primary" />
                    <div>
                      <CardTitle className="text-base">{campus.name}</CardTitle>
                      <CardDescription>{campus.city || campus.address || 'No location set'}</CardDescription>
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
                    <Input value={campus.name} readOnly />
                  </div>
                  <div>
                    <Label>City</Label>
                    <Input value={campus.city || ''} readOnly />
                  </div>
                  <div className="col-span-2">
                    <Label>Address</Label>
                    <Textarea value={campus.address || ''} readOnly placeholder="No address set" />
                  </div>
                  <div>
                    <Label>Contact Phone</Label>
                    <Input value={campus.phone || ''} readOnly placeholder="Not set" />
                  </div>
                  <div>
                    <Label>Contact Email</Label>
                    <Input value={campus.email || ''} readOnly placeholder="Not set" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
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