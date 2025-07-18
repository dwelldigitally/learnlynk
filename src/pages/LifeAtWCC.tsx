import React, { useState } from "react";
import { Calendar, MapPin, Users, Heart, Clock, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const LifeAtWCC: React.FC = () => {
  const [selectedEventType, setSelectedEventType] = useState<string>("all");

  // Mock events data
  const events = [
    {
      id: 1,
      title: "Healthcare Career Fair",
      date: "March 25, 2025",
      time: "10:00 AM - 4:00 PM",
      location: "Main Campus Auditorium",
      type: "career",
      image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81",
      description: "Connect with leading healthcare employers and explore career opportunities",
      attendees: 150,
      featured: true
    },
    {
      id: 2,
      title: "Student Wellness Workshop",
      date: "March 20, 2025",
      time: "2:00 PM - 4:00 PM",
      location: "Student Center",
      type: "wellness",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
      description: "Learn stress management techniques and wellness strategies",
      attendees: 80
    },
    {
      id: 3,
      title: "WCC Family BBQ",
      date: "April 15, 2025",
      time: "12:00 PM - 6:00 PM",
      location: "Campus Courtyard",
      type: "social",
      image: "https://images.unsplash.com/photo-1472396961693-142e6e269027",
      description: "Annual family gathering with food, games, and community building",
      attendees: 300,
      featured: true
    },
    {
      id: 4,
      title: "Technology in Healthcare Seminar",
      date: "April 8, 2025",
      time: "1:00 PM - 3:00 PM",
      location: "Innovation Lab",
      type: "academic",
      image: "https://images.unsplash.com/photo-1483058712412-4245e9b90334",
      description: "Exploring the latest technological advances in healthcare",
      attendees: 60
    }
  ];

  const studentLifeFeatures = [
    {
      title: "Modern Learning Facilities",
      description: "State-of-the-art classrooms equipped with the latest technology and simulation labs for hands-on practice.",
      image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742",
      stats: ["15 Smart Classrooms", "5 Simulation Labs", "24/7 Library Access"]
    },
    {
      title: "Campus Recreation",
      description: "Beautiful outdoor spaces and recreational facilities for students to relax and connect with nature.",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
      stats: ["10 Acre Campus", "Walking Trails", "Outdoor Study Areas"]
    },
    {
      title: "Student Support Services",
      description: "Comprehensive support services including academic tutoring, career counseling, and mental health resources.",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
      stats: ["Academic Tutoring", "Career Services", "Counseling Support"]
    }
  ];

  const familySupport = [
    {
      icon: Heart,
      title: "Family Orientation Programs",
      description: "Special orientation sessions for families to understand our programs and support systems."
    },
    {
      icon: Users,
      title: "Parent-Student Network",
      description: "Connect with other families and build a supportive community throughout your academic journey."
    },
    {
      icon: Calendar,
      title: "Family Events",
      description: "Regular family-friendly events including BBQs, graduation ceremonies, and cultural celebrations."
    },
    {
      icon: MapPin,
      title: "Campus Tours for Families",
      description: "Guided tours specifically designed for families to explore our facilities and meet faculty."
    }
  ];

  const campusLocations = [
    {
      name: "Main Campus",
      address: "123 Education Drive, Vancouver, BC",
      facilities: ["Administrative Offices", "Library", "Student Center", "Cafeteria"],
      coordinates: { lat: 49.2827, lng: -123.1207 }
    },
    {
      name: "Health Sciences Building",
      address: "456 Healthcare Ave, Vancouver, BC", 
      facilities: ["Simulation Labs", "Clinical Skills Lab", "Nursing Stations"],
      coordinates: { lat: 49.2847, lng: -123.1147 }
    },
    {
      name: "Student Residence",
      address: "789 Campus Road, Vancouver, BC",
      facilities: ["Student Housing", "Recreation Center", "Dining Hall"],
      coordinates: { lat: 49.2807, lng: -123.1187 }
    }
  ];

  const filteredEvents = selectedEventType === "all" 
    ? events 
    : events.filter(event => event.type === selectedEventType);

  const eventTypes = [
    { value: "all", label: "All Events" },
    { value: "career", label: "Career" },
    { value: "wellness", label: "Wellness" },
    { value: "social", label: "Social" },
    { value: "academic", label: "Academic" }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative h-96 rounded-xl overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb" 
          alt="WCC Campus"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-blue-600/60 flex items-center">
          <div className="px-8 text-white max-w-2xl">
            <h1 className="text-4xl font-bold mb-4">Life at WCC</h1>
            <p className="text-xl mb-6">
              Experience a vibrant campus community where learning extends beyond the classroom.
              Join us in creating memories, building connections, and growing together.
            </p>
            <Button size="lg" className="bg-white text-blue-900 hover:bg-gray-100">
              Explore Campus Life
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold text-blue-600">2,500+</div>
          <div className="text-sm text-muted-foreground">Active Students</div>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold text-green-600">95%</div>
          <div className="text-sm text-muted-foreground">Employment Rate</div>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold text-purple-600">50+</div>
          <div className="text-sm text-muted-foreground">Campus Events/Year</div>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold text-orange-600">15</div>
          <div className="text-sm text-muted-foreground">Programs Offered</div>
        </Card>
      </div>

      {/* Upcoming Events */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Upcoming Events</h2>
          <div className="flex gap-2">
            {eventTypes.map((type) => (
              <Button
                key={type.value}
                variant={selectedEventType === type.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedEventType(type.value)}
              >
                {type.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {filteredEvents.filter(event => event.featured).map((event) => (
            <Card key={event.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <img 
                  src={event.image} 
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Badge className="absolute top-4 right-4 bg-white/90 text-gray-900">
                  Featured
                </Badge>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Calendar className="w-4 h-4" />
                  {event.date} • {event.time}
                </div>
                <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                <p className="text-muted-foreground mb-4">{event.description}</p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    {event.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    {event.attendees} attending
                  </div>
                </div>
                <Button className="w-full mt-4">Register Now</Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEvents.filter(event => !event.featured).map((event) => (
            <Card key={event.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <img 
                  src={event.image} 
                  alt={event.title}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">{event.title}</h4>
                  <div className="text-sm text-muted-foreground mb-2">
                    {event.date} • {event.time}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    {event.location}
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  Join
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Student Life Features */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Student Life at WCC</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {studentLifeFeatures.map((feature, index) => (
            <Card key={index} className="overflow-hidden group hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <img 
                  src={feature.image} 
                  alt={feature.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground mb-4">{feature.description}</p>
                <div className="space-y-2">
                  {feature.stats.map((stat, statIndex) => (
                    <div key={statIndex} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span className="text-sm">{stat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* WCC Family Support */}
      <section className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-4">WCC Family Support</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            At WCC, we believe that education is a family journey. We provide comprehensive support 
            to ensure families feel welcomed, informed, and connected to our community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {familySupport.map((item, index) => (
            <Card key={index} className="p-6 text-center hover:shadow-md transition-shadow">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <item.icon className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <h3 className="font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
            Learn More About Family Support
          </Button>
        </div>
      </section>

      {/* Campus Maps */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Campus Locations</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {campusLocations.map((location, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <MapPin className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">{location.name}</h3>
                  <p className="text-sm text-muted-foreground">{location.address}</p>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <h4 className="font-medium text-sm">Facilities:</h4>
                {location.facilities.map((facility, facilityIndex) => (
                  <div key={facilityIndex} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                    <span className="text-sm text-muted-foreground">{facility}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <MapPin className="w-4 h-4 mr-2" />
                  Directions
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  Virtual Tour
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Interactive Campus Map Placeholder */}
        <Card className="mt-8 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Interactive Campus Map</h3>
            <Button variant="outline" size="sm">
              <ChevronRight className="w-4 h-4 mr-2" />
              Full Screen Map
            </Button>
          </div>
          <div className="bg-gradient-to-br from-green-100 to-blue-100 rounded-lg h-96 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h4 className="font-semibold text-lg mb-2">Interactive Campus Map</h4>
              <p className="text-muted-foreground">
                Click to explore our campus locations, buildings, and facilities in detail.
              </p>
              <Button className="mt-4">Launch Interactive Map</Button>
            </div>
          </div>
        </Card>
      </section>

      {/* Call to Action */}
      <Card className="p-8 text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <h2 className="text-2xl font-bold mb-4">Ready to Join the WCC Family?</h2>
        <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
          Experience the vibrant community, world-class facilities, and comprehensive support 
          that makes WCC the perfect place to pursue your healthcare career.
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" variant="secondary">
            Schedule a Campus Visit
          </Button>
          <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
            Apply Now
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default LifeAtWCC;