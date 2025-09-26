import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Home, 
  MapPin, 
  DollarSign, 
  Users, 
  Wifi, 
  Car, 
  Utensils,
  WashingMachine,
  Shield,
  Star,
  Calendar,
  Search,
  Heart,
  Phone,
  Mail
} from 'lucide-react';

interface HousingOption {
  id: string;
  name: string;
  type: 'dormitory' | 'apartment' | 'shared' | 'studio';
  price: number;
  availability: 'available' | 'waitlist' | 'full';
  capacity: number;
  occupied: number;
  description: string;
  amenities: string[];
  images: string[];
  location: string;
  distance: string;
  rating: number;
  reviews: number;
}

interface HousingApplication {
  id: string;
  applicantName: string;
  housingOption: string;
  applicationDate: string;
  status: 'submitted' | 'under_review' | 'approved' | 'waitlisted' | 'rejected';
  preferences: {
    roomType: string;
    moveInDate: string;
    specialRequests: string;
  };
}

const mockHousingOptions: HousingOption[] = [
  {
    id: '1',
    name: 'Pacific Residence Hall',
    type: 'dormitory',
    price: 1200,
    availability: 'available',
    capacity: 200,
    occupied: 185,
    description: 'Modern dormitory with shared facilities and meal plans included.',
    amenities: ['WiFi', 'Laundry', 'Cafeteria', 'Study Rooms', 'Gym', 'Security'],
    images: ['/api/placeholder/400/300'],
    location: 'On-Campus',
    distance: '0.1 km from main building',
    rating: 4.5,
    reviews: 128
  },
  {
    id: '2',
    name: 'Westwood Apartments',
    type: 'apartment',
    price: 1800,
    availability: 'available',
    capacity: 50,
    occupied: 42,
    description: 'Fully furnished 2-bedroom apartments for students.',
    amenities: ['WiFi', 'Parking', 'Kitchen', 'Living Room', 'Utilities Included'],
    images: ['/api/placeholder/400/300'],
    location: 'Near Campus',
    distance: '0.5 km from campus',
    rating: 4.7,
    reviews: 89
  },
  {
    id: '3',
    name: 'Shared Student Housing',
    type: 'shared',
    price: 800,
    availability: 'waitlist',
    capacity: 100,
    occupied: 100,
    description: 'Affordable shared housing with 4 students per unit.',
    amenities: ['WiFi', 'Shared Kitchen', 'Laundry', 'Study Areas'],
    images: ['/api/placeholder/400/300'],
    location: 'Off-Campus',
    distance: '1.2 km from campus',
    rating: 4.2,
    reviews: 156
  }
];

const mockApplications: HousingApplication[] = [
  {
    id: 'APP001',
    applicantName: 'John Smith',
    housingOption: 'Pacific Residence Hall',
    applicationDate: '2024-12-15',
    status: 'under_review',
    preferences: {
      roomType: 'Single Room',
      moveInDate: '2025-01-15',
      specialRequests: 'Ground floor preferred due to mobility needs'
    }
  }
];

const Housing = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState('all');
  const [housingType, setHousingType] = useState('all');
  const [availability, setAvailability] = useState('all');

  const filteredOptions = mockHousingOptions.filter(option => {
    const matchesSearch = option.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         option.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrice = priceRange === 'all' || 
                        (priceRange === 'low' && option.price < 1000) ||
                        (priceRange === 'medium' && option.price >= 1000 && option.price < 1500) ||
                        (priceRange === 'high' && option.price >= 1500);
    const matchesType = housingType === 'all' || option.type === housingType;
    const matchesAvailability = availability === 'all' || option.availability === availability;
    
    return matchesSearch && matchesPrice && matchesType && matchesAvailability;
  });

  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'waitlist': return 'bg-yellow-100 text-yellow-800';
      case 'full': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'under_review': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'waitlisted': return 'bg-orange-100 text-orange-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'wifi': return <Wifi className="h-4 w-4" />;
      case 'parking': case 'car': return <Car className="h-4 w-4" />;
      case 'cafeteria': case 'kitchen': return <Utensils className="h-4 w-4" />;
      case 'laundry': return <WashingMachine className="h-4 w-4" />;
      case 'security': return <Shield className="h-4 w-4" />;
      default: return <Home className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">Housing & Accommodation</h1>
          <p className="text-xl text-muted-foreground">
            Find the perfect place to call home during your studies
          </p>
        </div>

        <Tabs defaultValue="browse" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="browse">Browse Housing</TabsTrigger>
            <TabsTrigger value="applications">My Applications</TabsTrigger>
            <TabsTrigger value="apply">Apply for Housing</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Search & Filter Housing Options
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Search housing by name or description..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex gap-4">
                    <Select value={priceRange} onValueChange={setPriceRange}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Price Range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Prices</SelectItem>
                        <SelectItem value="low">Under $1,000</SelectItem>
                        <SelectItem value="medium">$1,000 - $1,500</SelectItem>
                        <SelectItem value="high">Over $1,500</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={housingType} onValueChange={setHousingType}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Housing Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="dormitory">Dormitory</SelectItem>
                        <SelectItem value="apartment">Apartment</SelectItem>
                        <SelectItem value="shared">Shared Housing</SelectItem>
                        <SelectItem value="studio">Studio</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={availability} onValueChange={setAvailability}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Availability" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="waitlist">Waitlist</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Housing Options Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredOptions.map((option) => (
                <Card key={option.id} className="hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img 
                      src={option.images[0]} 
                      alt={option.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <Badge className={`absolute top-2 right-2 ${getAvailabilityColor(option.availability)}`}>
                      {option.availability}
                    </Badge>
                  </div>
                  
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{option.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="capitalize">{option.type}</Badge>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">{option.rating} ({option.reviews})</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">${option.price}</p>
                        <p className="text-sm text-muted-foreground">per month</p>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground text-sm">{option.description}</p>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span>{option.location} • {option.distance}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-primary" />
                        <span>{option.occupied}/{option.capacity} occupied</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {option.amenities.slice(0, 4).map((amenity, index) => (
                        <div key={index} className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md text-xs">
                          {getAmenityIcon(amenity)}
                          <span>{amenity}</span>
                        </div>
                      ))}
                      {option.amenities.length > 4 && (
                        <div className="text-xs text-muted-foreground px-2 py-1">
                          +{option.amenities.length - 4} more
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" className="flex-1">
                        View Details
                      </Button>
                      <Button size="sm" variant="outline">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="applications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Housing Applications</CardTitle>
              </CardHeader>
              <CardContent>
                {mockApplications.length > 0 ? (
                  <div className="space-y-4">
                    {mockApplications.map((application) => (
                      <Card key={application.id}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="font-semibold text-lg">Application #{application.id}</h3>
                              <p className="text-muted-foreground">{application.housingOption}</p>
                            </div>
                            <Badge className={getStatusColor(application.status)}>
                              {application.status.replace('_', ' ')}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="font-medium">Room Type:</p>
                              <p>{application.preferences.roomType}</p>
                            </div>
                            <div>
                              <p className="font-medium">Move-in Date:</p>
                              <p>{new Date(application.preferences.moveInDate).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <p className="font-medium">Applied Date:</p>
                              <p>{new Date(application.applicationDate).toLocaleDateString()}</p>
                            </div>
                          </div>
                          
                          {application.preferences.specialRequests && (
                            <div className="mt-3 p-3 bg-muted rounded-lg">
                              <p className="text-sm font-medium mb-1">Special Requests:</p>
                              <p className="text-sm">{application.preferences.specialRequests}</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Home className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No applications yet</h3>
                    <p className="text-muted-foreground">You haven't submitted any housing applications.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="apply" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Housing Application Form</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Housing Preference</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select housing option" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockHousingOptions.map(option => (
                          <SelectItem key={option.id} value={option.id}>
                            {option.name} - ${option.price}/month
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Room Type</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select room type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single">Single Room</SelectItem>
                        <SelectItem value="double">Double Room</SelectItem>
                        <SelectItem value="shared">Shared Room</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Preferred Move-in Date</label>
                    <Input type="date" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Expected Length of Stay</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-semester">1 Semester</SelectItem>
                        <SelectItem value="2-semester">2 Semesters</SelectItem>
                        <SelectItem value="1-year">1 Year</SelectItem>
                        <SelectItem value="2-years">2+ Years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Special Requests or Accommodations</label>
                  <Textarea 
                    placeholder="Please describe any special needs, accessibility requirements, or other requests..."
                    rows={4}
                  />
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-medium">Emergency Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input placeholder="Emergency Contact Name" />
                    <Input placeholder="Relationship" />
                    <Input placeholder="Phone Number" />
                    <Input placeholder="Email Address" />
                  </div>
                </div>
                
                <Button className="w-full">
                  Submit Housing Application
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <Home className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Housing Guide</h3>
                  <p className="text-muted-foreground mb-4">Complete guide to student housing options and policies</p>
                  <Button variant="outline" size="sm">Download Guide</Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <DollarSign className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Financial Aid</h3>
                  <p className="text-muted-foreground mb-4">Housing assistance and payment plan options</p>
                  <Button variant="outline" size="sm">Learn More</Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Phone className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Housing Office</h3>
                  <p className="text-muted-foreground mb-4">(604) 555-HOUSE</p>
                  <Button variant="outline" size="sm">Contact Us</Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Calendar className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Important Dates</h3>
                  <p className="text-muted-foreground mb-4">Housing application and move-in deadlines</p>
                  <Button variant="outline" size="sm">View Calendar</Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Roommate Matching</h3>
                  <p className="text-muted-foreground mb-4">Find compatible roommates through our matching service</p>
                  <Button variant="outline" size="sm">Get Matched</Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Campus Map</h3>
                  <p className="text-muted-foreground mb-4">Interactive map of all housing locations</p>
                  <Button variant="outline" size="sm">View Map</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default Housing;