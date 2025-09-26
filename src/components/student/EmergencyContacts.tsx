import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Phone, 
  AlertTriangle, 
  Shield, 
  MapPin, 
  Clock, 
  Users,
  Heart,
  Stethoscope,
  Car,
  Home,
  Edit,
  Save,
  Plus
} from 'lucide-react';

interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  address?: string;
  isPrimary: boolean;
}

interface CampusService {
  id: string;
  name: string;
  description: string;
  phone: string;
  email?: string;
  location: string;
  hours: string;
  type: 'emergency' | 'health' | 'security' | 'support';
  priority: 'high' | 'medium' | 'low';
}

const mockPersonalContacts: EmergencyContact[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    relationship: 'Mother',
    phone: '(604) 555-0123',
    email: 'sarah.johnson@email.com',
    address: '123 Main St, Vancouver, BC V6B 1A1',
    isPrimary: true
  },
  {
    id: '2',
    name: 'Michael Johnson',
    relationship: 'Father',
    phone: '(604) 555-0124',
    email: 'michael.johnson@email.com',
    address: '123 Main St, Vancouver, BC V6B 1A1',
    isPrimary: false
  }
];

const campusServices: CampusService[] = [
  {
    id: '1',
    name: 'Campus Emergency Line',
    description: 'Immediate emergency response and campus security',
    phone: '911',
    location: 'Campus-wide',
    hours: '24/7',
    type: 'emergency',
    priority: 'high'
  },
  {
    id: '2',
    name: 'Campus Security',
    description: 'Non-emergency security assistance and escort services',
    phone: '(604) 555-SAFE',
    email: 'security@westcoastcollege.ca',
    location: 'Security Office - Building A, Room 101',
    hours: '24/7',
    type: 'security',
    priority: 'high'
  },
  {
    id: '3',
    name: 'Health Services',
    description: 'Medical clinic and first aid services',
    phone: '(604) 555-HLTH',
    email: 'health@westcoastcollege.ca',
    location: 'Health Center - Building B, 2nd Floor',
    hours: 'Mon-Fri 8:00 AM - 5:00 PM',
    type: 'health',
    priority: 'high'
  },
  {
    id: '4',
    name: 'Crisis Counseling',
    description: 'Mental health crisis support and counseling',
    phone: '(604) 555-HELP',
    email: 'counseling@westcoastcollege.ca',
    location: 'Student Services - Building C, Room 205',
    hours: 'Mon-Fri 9:00 AM - 6:00 PM',
    type: 'support',
    priority: 'high'
  },
  {
    id: '5',
    name: 'Maintenance Emergency',
    description: 'Building maintenance emergencies (flooding, heating, etc.)',
    phone: '(604) 555-MAINT',
    email: 'maintenance@westcoastcollege.ca',
    location: 'Facilities Office - Building D, Basement',
    hours: '24/7 Emergency Line',
    type: 'support',
    priority: 'medium'
  }
];

export default function EmergencyContacts() {
  const [editingContact, setEditingContact] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [personalContacts, setPersonalContacts] = useState(mockPersonalContacts);

  const getServiceIcon = (type: string) => {
    switch (type) {
      case 'emergency': return <AlertTriangle className="h-6 w-6" />;
      case 'health': return <Stethoscope className="h-6 w-6" />;
      case 'security': return <Shield className="h-6 w-6" />;
      case 'support': return <Heart className="h-6 w-6" />;
      default: return <Phone className="h-6 w-6" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const handleQuickCall = (phone: string) => {
    if (phone === '911') {
      if (confirm('This will call emergency services (911). Are you sure?')) {
        window.location.href = `tel:${phone}`;
      }
    } else {
      window.location.href = `tel:${phone}`;
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">Emergency Contacts</h1>
          <p className="text-xl text-muted-foreground">
            Important contacts for campus emergencies and personal emergency situations
          </p>
        </div>

        {/* Quick Emergency Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-red-200 bg-red-50 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleQuickCall('911')}>
            <CardContent className="p-6 text-center">
              <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2 text-red-800">Emergency Services</h3>
              <p className="text-red-700 mb-4">Call 911 for immediate emergencies</p>
              <Badge className="bg-red-600 text-white">EMERGENCY</Badge>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleQuickCall('(604) 555-SAFE')}>
            <CardContent className="p-6 text-center">
              <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2 text-blue-800">Campus Security</h3>
              <p className="text-blue-700 mb-4">(604) 555-SAFE</p>
              <Badge className="bg-blue-600 text-white">24/7 Available</Badge>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleQuickCall('(604) 555-HLTH')}>
            <CardContent className="p-6 text-center">
              <Stethoscope className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2 text-green-800">Health Services</h3>
              <p className="text-green-700 mb-4">(604) 555-HLTH</p>
              <Badge className="bg-green-600 text-white">Medical Support</Badge>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="campus" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="campus">Campus Emergency Services</TabsTrigger>
            <TabsTrigger value="personal">Personal Emergency Contacts</TabsTrigger>
          </TabsList>

          <TabsContent value="campus" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Campus Emergency Services
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {campusServices.map((service) => (
                    <Card key={service.id} className="relative">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-lg ${service.type === 'emergency' ? 'bg-red-100' : 
                                          service.type === 'health' ? 'bg-green-100' :
                                          service.type === 'security' ? 'bg-blue-100' : 'bg-purple-100'}`}>
                            <div className={`${service.type === 'emergency' ? 'text-red-600' : 
                                             service.type === 'health' ? 'text-green-600' :
                                             service.type === 'security' ? 'text-blue-600' : 'text-purple-600'}`}>
                              {getServiceIcon(service.type)}
                            </div>
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-semibold text-lg text-foreground">{service.name}</h3>
                              <div className={`w-3 h-3 rounded-full ${getPriorityColor(service.priority)}`} />
                            </div>
                            
                            <p className="text-muted-foreground mb-4">{service.description}</p>
                            
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-primary" />
                                <span className="font-medium">{service.phone}</span>
                              </div>
                              
                              {service.email && (
                                <div className="flex items-center gap-2">
                                  <span className="text-muted-foreground">{service.email}</span>
                                </div>
                              )}
                              
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-primary" />
                                <span>{service.location}</span>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-primary" />
                                <span>{service.hours}</span>
                              </div>
                            </div>
                            
                            <div className="flex gap-2 mt-4">
                              <Button size="sm" onClick={() => handleQuickCall(service.phone)}>
                                <Phone className="h-4 w-4 mr-2" />
                                Call Now
                              </Button>
                              {service.email && (
                                <Button size="sm" variant="outline" 
                                        onClick={() => window.location.href = `mailto:${service.email}`}>
                                  Email
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="personal" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Personal Emergency Contacts
                  </CardTitle>
                  <Button onClick={() => setShowAddForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Contact
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {personalContacts.map((contact) => (
                    <Card key={contact.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-lg">{contact.name}</h3>
                              {contact.isPrimary && (
                                <Badge className="bg-primary text-primary-foreground">Primary</Badge>
                              )}
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <p><span className="font-medium">Relationship:</span> {contact.relationship}</p>
                                <p><span className="font-medium">Phone:</span> {contact.phone}</p>
                                {contact.email && (
                                  <p><span className="font-medium">Email:</span> {contact.email}</p>
                                )}
                              </div>
                              
                              {contact.address && (
                                <div>
                                  <p className="font-medium">Address:</p>
                                  <p className="text-muted-foreground">{contact.address}</p>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => handleQuickCall(contact.phone)}>
                              <Phone className="h-4 w-4 mr-2" />
                              Call
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setEditingContact(contact.id)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {showAddForm && (
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle>Add Emergency Contact</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input placeholder="Full Name" />
                        <Input placeholder="Relationship" />
                        <Input placeholder="Phone Number" />
                        <Input placeholder="Email (Optional)" />
                      </div>
                      <Input placeholder="Address (Optional)" />
                      
                      <div className="flex gap-2">
                        <Button>
                          <Save className="h-4 w-4 mr-2" />
                          Save Contact
                        </Button>
                        <Button variant="outline" onClick={() => setShowAddForm(false)}>
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}