import React, { useState } from "react";
import { Calendar, MapPin, Users, Heart, Clock, ChevronRight, Phone, Star, Trophy, Building, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/modern/GlassCard";
import { motion } from "framer-motion";

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
      name: "Central Surrey Campus",
      address: "Unit 900 13761 96 Ave, Surrey, BC V3V 1Z2 Canada",
      phone: "+1 (604) 594-3500",
      facilities: ["Administrative Offices", "Classrooms", "Student Services", "Library"],
      coordinates: { lat: 49.1913, lng: -122.7946 }
    },
    {
      name: "Scott Road, Surrey Campus",
      address: "Unit 201 8318 120 St Surrey, BC V3W 3N4",
      phone: "+1 (604) 594-3500",
      facilities: ["Specialized Programs", "Labs", "Study Areas"],
      coordinates: { lat: 49.1666, lng: -122.8756 }
    },
    {
      name: "Abbotsford Campus",
      address: "Unit 201, 3670 Townline Rd Abbotsford, BC V2T 5W8",
      phone: "+1 (604) 776-1301",
      facilities: ["Health Sciences", "Simulation Labs", "Clinical Training"],
      coordinates: { lat: 49.0504, lng: -122.3045 }
    },
    {
      name: "Aviation Campus - Abbotsford",
      address: "Hangar F, 120-1185 Townline Road Abbotsford BC, V2T 6E1",
      phone: "+1 (604) 594-3500",
      facilities: ["Aircraft Training", "Flight Simulators", "Aviation Labs", "Hangar Facilities"],
      coordinates: { lat: 49.0252, lng: -122.3606 }
    },
    {
      name: "Agassiz Campus",
      address: "2812 Chewal Road Agassiz, BC V0M 1A0",
      phone: "+1 (604) 594-3500",
      facilities: ["Agricultural Programs", "Field Labs", "Equipment Training"],
      coordinates: { lat: 49.2308, lng: -121.7644 }
    },
    {
      name: "King George Campus",
      address: "10449 King George Blvd, Surrey, BC V3T 8Z8 Canada",
      phone: "+1 (604) 594-3500",
      facilities: ["Business Programs", "Technology Labs", "Conference Rooms"],
      coordinates: { lat: 49.1867, lng: -122.8452 }
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
    <div className="min-h-screen hero-gradient">
      {/* Modern Header */}
      <div className="border-b border-border/40 bg-background/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
                <Heart className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Life at WCC
                </h1>
                <p className="text-muted-foreground text-lg mt-1">
                  Experience a vibrant campus community where learning extends beyond the classroom
                </p>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <GlassCard className="p-6 min-w-[280px]">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Trophy className="h-5 w-5 text-primary" />
                    <span className="text-2xl font-bold text-foreground">2500+</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Active Students</p>
                  <div className="mt-3 pt-3 border-t border-border/30">
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>95% Employment Rate</span>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">
        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <GlassCard className="p-6 text-center hover-scale transition-all duration-300">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Users className="h-5 w-5 text-blue-500" />
              <span className="text-3xl font-bold text-foreground">2500+</span>
            </div>
            <p className="text-sm text-muted-foreground">Active Students</p>
          </GlassCard>
          
          <GlassCard className="p-6 text-center hover-scale transition-all duration-300">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Trophy className="h-5 w-5 text-green-500" />
              <span className="text-3xl font-bold text-foreground">95%</span>
            </div>
            <p className="text-sm text-muted-foreground">Employment Rate</p>
          </GlassCard>
          
          <GlassCard className="p-6 text-center hover-scale transition-all duration-300">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Calendar className="h-5 w-5 text-purple-500" />
              <span className="text-3xl font-bold text-foreground">50+</span>
            </div>
            <p className="text-sm text-muted-foreground">Campus Events/Year</p>
          </GlassCard>
          
          <GlassCard className="p-6 text-center hover-scale transition-all duration-300">
            <div className="flex items-center justify-center gap-2 mb-2">
              <BookOpen className="h-5 w-5 text-orange-500" />
              <span className="text-3xl font-bold text-foreground">15</span>
            </div>
            <p className="text-sm text-muted-foreground">Programs Offered</p>
          </GlassCard>
        </motion.div>

        {/* Featured Events Section */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
          >
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Upcoming Events</h2>
              <p className="text-muted-foreground">Join our vibrant campus community events</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {eventTypes.map((type) => (
                <Button
                  key={type.value}
                  variant={selectedEventType === type.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedEventType(type.value)}
                  className="bg-background/50 backdrop-blur-sm border-border/30"
                >
                  {type.label}
                </Button>
              ))}
            </div>
          </motion.div>

          {/* Featured Events Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {filteredEvents.filter(event => event.featured).map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <GlassCard hover className="overflow-hidden h-full">
                  <div className="relative h-56">
                    <img 
                      src={event.image} 
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <Badge className="absolute top-4 right-4 bg-primary/90 text-primary-foreground backdrop-blur-sm">
                      Featured
                    </Badge>
                    <div className="absolute bottom-4 left-4 text-white">
                      <div className="flex items-center gap-2 text-sm mb-1">
                        <Calendar className="w-4 h-4" />
                        {event.date}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-foreground mb-2">{event.title}</h3>
                    <p className="text-muted-foreground mb-4 line-clamp-2">{event.description}</p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          {event.time}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users className="w-4 h-4" />
                          {event.attendees} attending
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        {event.location}
                      </div>
                      
                      <Button className="w-full mt-4">Register Now</Button>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          {/* Smaller Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredEvents.filter(event => !event.featured).map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <GlassCard className="p-4 hover-scale transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <img 
                      src={event.image} 
                      alt={event.title}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-foreground mb-1 truncate">{event.title}</h4>
                      <div className="text-sm text-muted-foreground mb-2">
                        {event.date} • {event.time}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">{event.location}</span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Join
                    </Button>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Student Life Features */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">Student Life at WCC</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover world-class facilities, vibrant campus life, and comprehensive support services
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {studentLifeFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <GlassCard hover className="overflow-hidden h-full">
                  <div className="relative h-56">
                    <img 
                      src={feature.image} 
                      alt={feature.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed">{feature.description}</p>
                    
                    <div className="space-y-3">
                      <h4 className="font-semibold text-foreground text-sm">Key Features:</h4>
                      {feature.stats.map((stat, statIndex) => (
                        <div key={statIndex} className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                          <span className="text-sm text-muted-foreground">{stat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </section>

        {/* WCC Family Support */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            <GlassCard className="p-12">
              <div className="text-center mb-12">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="p-3 bg-primary/10 rounded-xl">
                    <Heart className="h-8 w-8 text-primary" />
                  </div>
                  <h2 className="text-3xl font-bold text-foreground">WCC Family Support</h2>
                </div>
                <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
                  At WCC, we believe that education is a family journey. We provide comprehensive support 
                  to ensure families feel welcomed, informed, and connected to our community.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {familySupport.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                  >
                    <div className="p-6 text-center bg-background/30 rounded-xl border border-border/30 hover:bg-background/50 transition-all duration-300">
                      <div className="flex justify-center mb-4">
                        <div className="p-3 bg-primary/10 rounded-full">
                          <item.icon className="w-6 h-6 text-primary" />
                        </div>
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="text-center">
                <Button size="lg" className="bg-primary hover:bg-primary-hover">
                  Learn More About Family Support
                </Button>
              </div>
            </GlassCard>
          </motion.div>
        </section>

        {/* Campus Locations */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">Campus Locations</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our strategically located campuses across British Columbia
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {campusLocations.map((location, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <GlassCard className="p-6 h-full hover-scale transition-all duration-300">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-foreground mb-1">{location.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{location.address}</p>
                      <div className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{location.phone}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <h4 className="font-semibold text-sm text-foreground">Facilities:</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {location.facilities.map((facility, facilityIndex) => (
                        <div key={facilityIndex} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                          <span className="text-sm text-muted-foreground">{facility}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button size="sm" variant="outline" className="text-xs">
                      <MapPin className="w-3 h-3 mr-1" />
                      Directions
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs">
                      Virtual Tour
                    </Button>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          {/* Interactive Map */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.3 }}
          >
            <GlassCard className="p-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Interactive Campus Map</h3>
                  <p className="text-muted-foreground">Explore all our campus locations in one view</p>
                </div>
                <Button variant="outline">
                  <ChevronRight className="w-4 h-4 mr-2" />
                  Full Screen Map
                </Button>
              </div>
              
              <div className="bg-muted/30 rounded-xl h-64 flex items-center justify-center border border-border/30">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Interactive campus map will be loaded here</p>
                  <Button variant="outline" size="sm" className="mt-4">
                    Load Map
                  </Button>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </section>
      </div>
    </div>
  );
};

export default LifeAtWCC;