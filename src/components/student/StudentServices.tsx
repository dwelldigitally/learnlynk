import React from "react";
import { Link } from "react-router-dom";
import { HelpCircle, Phone, Building, ExternalLink, Briefcase, Clock, Shield, MessageCircle, ArrowRight, Users, Heart, Star } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const StudentServices: React.FC = () => {
  const services = [
    {
      title: "Student Support",
      description: "Get help and assistance with academic, personal, and technical support",
      icon: HelpCircle,
      path: "/student/support",
      gradient: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50/50",
      borderColor: "border-blue-200/50",
      features: ["Academic Help", "Personal Counseling", "Tech Support", "24/7 Available"]
    },
    {
      title: "Career Services",
      description: "Career guidance, job opportunities, resume help, and professional development",
      icon: Briefcase,
      path: "/student/career-services",
      gradient: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50/50",
      borderColor: "border-purple-200/50",
      features: ["Job Placement", "Resume Building", "Interview Prep", "Networking"]
    },
    {
      title: "Emergency Contacts",
      description: "Important contact information for emergencies and urgent situations",
      icon: Phone,
      path: "/student/emergency-contacts",
      gradient: "from-red-500 to-red-600",
      bgColor: "bg-red-50/50",
      borderColor: "border-red-200/50",
      features: ["Campus Security", "Medical Emergency", "Crisis Support", "Quick Response"]
    },
    {
      title: "Housing",
      description: "Accommodation information, residence hall details, and housing support",
      icon: Building,
      path: "/student/housing",
      gradient: "from-green-500 to-green-600",
      bgColor: "bg-green-50/50",
      borderColor: "border-green-200/50",
      features: ["Room Assignment", "Maintenance", "Community Events", "Residence Life"]
    }
  ];

  const quickStats = [
    { label: "Students Served", value: "2,500+", icon: Users },
    { label: "Satisfaction Rate", value: "98%", icon: Heart },
    { label: "Average Rating", value: "4.8/5", icon: Star },
    { label: "Response Time", value: "< 2hrs", icon: Clock }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/30">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/5" />
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium">
              <Shield className="w-4 h-4" />
              Comprehensive Student Support
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
              Student Services
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Your success is our priority. Access comprehensive support services and resources 
              designed to help you thrive throughout your academic journey.
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-4xl mx-auto">
              {quickStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="text-center"
                >
                  <div className="w-12 h-12 mx-auto mb-3 bg-primary/10 rounded-full flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-foreground mb-4">How Can We Help You?</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore our comprehensive range of student services designed to support every aspect of your college experience.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
            >
              <Link to={service.path} className="group block h-full">
                <Card className={`h-full transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:scale-[1.02] border-0 ${service.bgColor} backdrop-blur-sm group-hover:bg-opacity-80`}>
                  <CardHeader className="relative pb-6">
                    {/* Gradient Background */}
                    <div className={`absolute top-0 left-0 right-0 h-24 bg-gradient-to-r ${service.gradient} rounded-t-lg opacity-10 group-hover:opacity-20 transition-opacity duration-500`} />
                    
                    <div className="relative flex items-center gap-4 mb-4">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${service.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <service.icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                          {service.title}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary" className="text-xs">Available 24/7</Badge>
                          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <CardDescription className="text-base leading-relaxed text-muted-foreground">
                      {service.description}
                    </CardDescription>
                    
                    {/* Features List */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-foreground text-sm">Key Services:</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {service.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${service.gradient}`} />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-4">
                      <Button 
                        variant="outline" 
                        className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300"
                      >
                        Access Service
                        <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Emergency Contact Section */}
      <div className="bg-gradient-to-r from-red-50/50 via-orange-50/30 to-yellow-50/50 border-y border-border/50">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center space-y-8"
          >
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 rounded-full text-red-700 text-sm font-medium">
                <Phone className="w-4 h-4" />
                Emergency Information
              </div>
              <h2 className="text-3xl font-bold text-foreground">Need Immediate Help?</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Our emergency services are available 24/7 to ensure your safety and well-being.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
              <Card className="bg-white/80 backdrop-blur-sm border-red-200/50 hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">Campus Security</h3>
                    <p className="text-muted-foreground mb-4">24/7 Emergency Response</p>
                    <div className="space-y-2">
                      <p className="font-mono text-2xl font-bold text-red-600">(555) 123-0000</p>
                      <Badge variant="secondary">Press 1 for Emergency</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-blue-200/50 hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                    <MessageCircle className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">Student Help Desk</h3>
                    <p className="text-muted-foreground mb-4">Technical & Academic Support</p>
                    <div className="space-y-2">
                      <p className="font-mono text-2xl font-bold text-blue-600">(555) 123-HELP</p>
                      <Badge variant="secondary">Available 8am-8pm</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="pt-8">
              <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200/50 max-w-3xl mx-auto">
                <CardContent className="p-6 text-center">
                  <p className="text-amber-800 font-medium">
                    <strong>Remember:</strong> In case of a life-threatening emergency, always call 911 first, 
                    then contact campus security to inform them of the situation.
                  </p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default StudentServices;