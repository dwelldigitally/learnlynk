import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Briefcase, TrendingUp, Users, Calendar, Star, MapPin, Building } from "lucide-react";

const CareerServices: React.FC = () => {
  const [selectedIndustry, setSelectedIndustry] = useState<string>("all");

  const jobPlacementStats = {
    employmentRate: 94,
    averageSalary: "$45,000",
    placementTime: "3 months",
    topEmployers: ["VGH", "BC Children's Hospital", "Richmond Hospital", "Fraser Health"]
  };

  const mentors = [
    {
      name: "Sarah Chen",
      title: "Senior Healthcare Administrator",
      company: "Vancouver General Hospital",
      experience: "8 years",
      avatar: "/src/assets/advisor-nicole.jpg",
      expertise: ["Healthcare Management", "Patient Care", "Team Leadership"],
      rating: 4.9,
      sessions: 45
    },
    {
      name: "Michael Rodriguez",
      title: "Charge Nurse",
      company: "BC Children's Hospital",
      experience: "6 years",
      avatar: "/src/assets/author-ahmed.jpg",
      expertise: ["Pediatric Care", "Emergency Response", "Staff Training"],
      rating: 4.8,
      sessions: 32
    },
    {
      name: "Jennifer Kim",
      title: "Care Coordinator",
      company: "Fraser Health",
      experience: "5 years",
      avatar: "/src/assets/author-sarah.jpg",
      expertise: ["Patient Advocacy", "Care Planning", "Communication"],
      rating: 4.9,
      sessions: 28
    }
  ];

  const jobOpportunities = [
    {
      title: "Healthcare Assistant",
      company: "Richmond Hospital",
      location: "Richmond, BC",
      salary: "$22-26/hour",
      type: "Full-time",
      posted: "2 days ago",
      requirements: ["HCA Certificate", "Clean Criminal Record", "First Aid/CPR"],
      urgent: true
    },
    {
      title: "Personal Care Assistant",
      company: "Comfort Keepers",
      location: "Vancouver, BC",
      salary: "$20-24/hour",
      type: "Part-time",
      posted: "1 week ago",
      requirements: ["HCA Certificate", "Valid Driver's License", "Compassionate Care"],
      urgent: false
    },
    {
      title: "Residential Care Aide",
      company: "Revera",
      location: "Burnaby, BC",
      salary: "$24-28/hour",
      type: "Full-time",
      posted: "3 days ago",
      requirements: ["HCA Certificate", "Experience Preferred", "Team Player"],
      urgent: false
    }
  ];

  const networkingEvents = [
    {
      title: "Healthcare Professionals Mixer",
      date: "March 15, 2024",
      time: "6:00 PM - 8:00 PM",
      location: "Vancouver Convention Centre",
      attendees: 120,
      type: "Networking"
    },
    {
      title: "Career Fair: Healthcare Opportunities",
      date: "March 22, 2024",
      time: "10:00 AM - 4:00 PM",
      location: "WCC Main Campus",
      attendees: 85,
      type: "Career Fair"
    },
    {
      title: "Industry Panel: Future of Healthcare",
      date: "April 5, 2024",
      time: "2:00 PM - 4:00 PM",
      location: "Online Webinar",
      attendees: 200,
      type: "Industry Talk"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Career Services</h1>
        <p className="text-gray-600 mt-2">Launch your career with expert guidance and industry connections</p>
      </div>

      {/* Job Placement Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Program Success Metrics
          </CardTitle>
          <CardDescription>Real outcomes from our graduates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{jobPlacementStats.employmentRate}%</div>
              <div className="text-sm text-gray-600">Employment Rate</div>
              <Progress value={jobPlacementStats.employmentRate} className="mt-2" />
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{jobPlacementStats.averageSalary}</div>
              <div className="text-sm text-gray-600">Average Starting Salary</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{jobPlacementStats.placementTime}</div>
              <div className="text-sm text-gray-600">Avg. Time to Employment</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-medium mb-2">Top Employers</div>
              <div className="space-y-1">
                {jobPlacementStats.topEmployers.slice(0, 2).map((employer, index) => (
                  <div key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">{employer}</div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="mentorship" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="mentorship">Mentorship</TabsTrigger>
          <TabsTrigger value="jobs">Job Board</TabsTrigger>
          <TabsTrigger value="networking">Networking</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="mentorship" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Alumni Mentors
              </CardTitle>
              <CardDescription>
                Connect with successful graduates in your field
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mentors.map((mentor, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={mentor.avatar} alt={mentor.name} />
                      <AvatarFallback>{mentor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{mentor.name}</h3>
                          <p className="text-sm text-gray-600">{mentor.title}</p>
                          <p className="text-sm text-gray-500">{mentor.company}</p>
                        </div>
                        <div className="text-right text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            {mentor.rating}
                          </div>
                          <div>{mentor.sessions} sessions</div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {mentor.expertise.map((skill, skillIndex) => (
                          <Badge key={skillIndex} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{mentor.experience} experience</p>
                    </div>
                  </div>
                  <Button className="w-full">Request Mentorship</Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="jobs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Current Job Opportunities
              </CardTitle>
              <CardDescription>
                Exclusive job postings for WCC students and graduates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {jobOpportunities.map((job, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{job.title}</h3>
                        {job.urgent && <Badge className="bg-red-100 text-red-800">Urgent</Badge>}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <div className="flex items-center gap-1">
                          <Building className="h-3 w-3" />
                          {job.company}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {job.location}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-green-600">{job.salary}</div>
                      <Badge variant="outline">{job.type}</Badge>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-medium text-gray-700 mb-1">Requirements:</h4>
                    <div className="flex flex-wrap gap-1">
                      {job.requirements.map((req, reqIndex) => (
                        <Badge key={reqIndex} variant="secondary" className="text-xs">
                          {req}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Posted {job.posted}</span>
                    <Button>Apply Now</Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="networking" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Upcoming Networking Events
              </CardTitle>
              <CardDescription>
                Build connections and explore opportunities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {networkingEvents.map((event, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{event.title}</h3>
                      <div className="text-sm text-gray-600 mt-1">
                        <div>{event.date} • {event.time}</div>
                        <div className="flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3" />
                          {event.location}
                        </div>
                      </div>
                    </div>
                    <Badge>{event.type}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{event.attendees} registered</span>
                    <Button>Register</Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Resume Building</CardTitle>
                <CardDescription>Create a standout healthcare resume</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Healthcare-specific resume templates</li>
                  <li>• Skills assessment and recommendations</li>
                  <li>• Professional review and feedback</li>
                </ul>
                <Button className="w-full mt-4">Access Templates</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Interview Preparation</CardTitle>
                <CardDescription>Ace your healthcare interviews</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Common healthcare interview questions</li>
                  <li>• Mock interview scheduling</li>
                  <li>• Professional etiquette guide</li>
                </ul>
                <Button className="w-full mt-4">Start Prep</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CareerServices;