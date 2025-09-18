import React from "react";
import { Briefcase, FileText, Users, Calendar, TrendingUp, MapPin, Clock, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePageEntranceAnimation, useStaggeredReveal } from "@/hooks/useAnimations";

const CareerServices: React.FC = () => {
  const isLoaded = usePageEntranceAnimation();
  const { visibleItems, ref: staggerRef } = useStaggeredReveal(8, 150);

  const careerResources = [
    {
      title: "Resume Builder",
      description: "Create professional resumes with industry-specific templates",
      icon: FileText,
      action: "Start Building",
      color: "blue"
    },
    {
      title: "Interview Preparation",
      description: "Practice with mock interviews and get feedback",
      icon: Users,
      action: "Schedule Session",
      color: "green"
    },
    {
      title: "Job Search Portal",
      description: "Access exclusive job postings from our partner employers",
      icon: Briefcase,
      action: "Browse Jobs",
      color: "purple"
    },
    {
      title: "Career Assessment",
      description: "Discover careers that match your interests and skills",
      icon: TrendingUp,
      action: "Take Assessment",
      color: "orange"
    }
  ];

  const upcomingEvents = [
    {
      title: "Career Fair 2024",
      date: "March 15, 2024",
      time: "10:00 AM - 4:00 PM",
      location: "Student Center",
      companies: "50+ Companies",
      type: "career-fair"
    },
    {
      title: "Resume Writing Workshop",
      date: "March 8, 2024",
      time: "2:00 PM - 3:30 PM",
      location: "Career Services Office",
      instructor: "Sarah Johnson",
      type: "workshop"
    },
    {
      title: "LinkedIn Optimization",
      date: "March 12, 2024",
      time: "1:00 PM - 2:00 PM",
      location: "Virtual",
      instructor: "Mike Davis",
      type: "workshop"
    }
  ];

  const jobOpportunities = [
    {
      title: "Marketing Intern",
      company: "TechStart Inc.",
      location: "Remote",
      type: "Internship",
      salary: "$15/hour",
      deadline: "March 20, 2024"
    },
    {
      title: "Junior Developer",
      company: "Web Solutions LLC",
      location: "New York, NY",
      type: "Full-time",
      salary: "$55,000/year",
      deadline: "March 25, 2024"
    },
    {
      title: "Business Analyst",
      company: "Finance Corp",
      location: "Boston, MA",
      type: "Full-time",
      salary: "$60,000/year",
      deadline: "April 1, 2024"
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-100 text-blue-600';
      case 'green':
        return 'bg-green-100 text-green-600';
      case 'purple':
        return 'bg-purple-100 text-purple-600';
      case 'orange':
        return 'bg-orange-100 text-orange-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className={`space-y-6 ${isLoaded ? 'animate-fade-up' : 'opacity-0'}`}>
      {/* Header */}
      <div className="animate-slide-down">
        <h1 className="text-2xl font-bold">Career Services</h1>
        <p className="text-muted-foreground">Explore career opportunities, build professional skills, and connect with employers</p>
      </div>

      {/* Career Resources */}
      <div ref={staggerRef}>
        <h2 className="text-xl font-semibold mb-4">Career Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {careerResources.map((resource, index) => (
            <Card key={index} className={`p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] ${visibleItems[index] ? `animate-stagger-${Math.min(index + 1, 5)}` : 'opacity-0'}`}>
              <div className="flex flex-col items-center text-center space-y-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClasses(resource.color)}`}>
                  <resource.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">{resource.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{resource.description}</p>
                </div>
                <Button size="sm" className="w-full">{resource.action}</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Upcoming Events */}
      <Card className={`p-6 ${visibleItems[4] ? 'animate-stagger-5' : 'opacity-0'}`}>
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5" />
          <h2 className="text-xl font-semibold">Upcoming Events</h2>
        </div>
        <div className="space-y-4">
          {upcomingEvents.map((event, index) => (
            <div key={index} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold">{event.title}</h3>
                    <Badge variant="outline" className="text-xs">
                      {event.type}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {event.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {event.time}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {event.location}
                    </div>
                  </div>
                  {event.companies && (
                    <p className="text-sm text-green-600 font-medium mt-1">{event.companies} attending</p>
                  )}
                  {event.instructor && (
                    <p className="text-sm text-blue-600 mt-1">Instructor: {event.instructor}</p>
                  )}
                </div>
                <Button size="sm">Register</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Job Opportunities */}
      <Card className={`p-6 ${visibleItems[5] ? 'animate-stagger-6' : 'opacity-0'}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            <h2 className="text-xl font-semibold">Featured Job Opportunities</h2>
          </div>
          <Button variant="outline" size="sm">
            View All Jobs
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </div>
        <div className="space-y-4">
          {jobOpportunities.map((job, index) => (
            <div key={index} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold">{job.title}</h3>
                    <Badge variant="outline" className="text-xs">
                      {job.type}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-1">{job.company}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {job.location}
                    </div>
                    <div className="font-medium text-green-600">{job.salary}</div>
                  </div>
                  <p className="text-xs text-red-600 mt-1">Application Deadline: {job.deadline}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">View Details</Button>
                  <Button size="sm">Apply Now</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className={`p-6 text-center ${visibleItems[6] ? 'animate-stagger-7' : 'opacity-0'}`}>
          <h3 className="text-2xl font-bold text-primary">92%</h3>
          <p className="text-muted-foreground">Graduate Employment Rate</p>
        </Card>
        <Card className={`p-6 text-center ${visibleItems[7] ? 'animate-stagger-8' : 'opacity-0'}`}>
          <h3 className="text-2xl font-bold text-green-600">$58,000</h3>
          <p className="text-muted-foreground">Average Starting Salary</p>
        </Card>
        <Card className={`p-6 text-center ${visibleItems[8] ? 'animate-stagger-9' : 'opacity-0'}`}>
          <h3 className="text-2xl font-bold text-blue-600">200+</h3>
          <p className="text-muted-foreground">Partner Employers</p>
        </Card>
      </div>

      {/* Contact Career Services */}
      <Card className="p-6 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Need Personalized Career Guidance?</h2>
          <p className="text-muted-foreground mb-4">Schedule a one-on-one appointment with our career counselors</p>
          <div className="flex justify-center gap-4">
            <Button>Schedule Appointment</Button>
            <Button variant="outline">Contact Us</Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CareerServices;