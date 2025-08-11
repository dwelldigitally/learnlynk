import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  HelpCircle, 
  Search, 
  Book, 
  Video, 
  MessageCircle, 
  ExternalLink,
  Star,
  Clock,
  Users,
  Lightbulb,
  Settings,
  Mail,
  Phone
} from "lucide-react";

export function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState("");

  const quickHelp = [
    {
      title: "How to add a new student",
      category: "Student Management",
      type: "guide",
      views: 245,
      rating: 4.8
    },
    {
      title: "Setting up automated workflows",
      category: "Automation", 
      type: "video",
      views: 189,
      rating: 4.9
    },
    {
      title: "Managing lead assignments",
      category: "Lead Management",
      type: "guide",
      views: 156,
      rating: 4.7
    },
    {
      title: "Configuring email templates",
      category: "Communication",
      type: "guide",
      views: 134,
      rating: 4.6
    }
  ];

  const categories = [
    {
      icon: Users,
      title: "Student Management",
      description: "Manage student records, applications, and enrollment",
      articles: 12,
      color: "bg-blue-500/10 text-blue-600"
    },
    {
      icon: Mail,
      title: "Communication",
      description: "Email setup, templates, and messaging features",
      articles: 8,
      color: "bg-green-500/10 text-green-600"
    },
    {
      icon: Settings,
      title: "System Configuration",
      description: "Setup, integrations, and advanced settings",
      articles: 15,
      color: "bg-purple-500/10 text-purple-600"
    },
    {
      icon: Lightbulb,
      title: "Best Practices",
      description: "Tips and strategies for optimizing workflows",
      articles: 6,
      color: "bg-orange-500/10 text-orange-600"
    }
  ];

  const faqs = [
    {
      question: "How do I reset a student's password?",
      answer: "Navigate to Student Management → Select the student → Click 'Reset Password' in the actions menu.",
      category: "Student Management"
    },
    {
      question: "Can I customize the application form fields?",
      answer: "Yes, go to Configuration → Custom Fields to add, edit, or remove form fields for applications.",
      category: "Configuration"
    },
    {
      question: "How do I set up automated email reminders?",
      answer: "Use the Workflow Management section to create automated rules based on triggers like application status or payment due dates.",
      category: "Automation"
    },
    {
      question: "What payment methods are supported?",
      answer: "The system supports credit cards, bank transfers, and payment plans. Configure options in Financial Management settings.",
      category: "Payments"
    }
  ];

  const videos = [
    {
      title: "Getting Started with the Platform",
      duration: "5:30",
      thumbnail: "/placeholder.svg",
      category: "Onboarding"
    },
    {
      title: "Advanced Lead Management",
      duration: "8:45", 
      thumbnail: "/placeholder.svg",
      category: "Lead Management"
    },
    {
      title: "Setting Up Integrations",
      duration: "12:15",
      thumbnail: "/placeholder.svg",
      category: "Integrations"
    }
  ];

  const filteredHelp = quickHelp.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Help Center</h1>
          <p className="text-muted-foreground">Find answers, guides, and support resources</p>
        </div>
        <Button className="flex items-center space-x-2">
          <MessageCircle className="h-4 w-4" />
          <span>Contact Support</span>
        </Button>
      </div>

      {/* Search */}
      <div className="max-w-2xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search help articles, guides, and FAQs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs defaultValue="articles" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="articles">Articles</TabsTrigger>
          <TabsTrigger value="videos">Video Guides</TabsTrigger>
          <TabsTrigger value="faqs">FAQs</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
        </TabsList>

        <TabsContent value="articles" className="space-y-6">
          {/* Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4 text-center">
                    <div className={`w-12 h-12 mx-auto rounded-lg flex items-center justify-center mb-3 ${category.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold mb-2">{category.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{category.description}</p>
                    <Badge variant="secondary">{category.articles} articles</Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Popular Articles */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Popular Articles</h2>
            <div className="space-y-3">
              {filteredHelp.map((item, index) => (
                <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          {item.type === 'video' ? 
                            <Video className="h-4 w-4 text-red-500" /> : 
                            <Book className="h-4 w-4 text-blue-500" />
                          }
                          <Badge variant="outline" className="text-xs">{item.category}</Badge>
                        </div>
                        <h3 className="font-medium mb-2">{item.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span className="flex items-center space-x-1">
                            <Users className="h-3 w-3" />
                            <span>{item.views} views</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span>{item.rating}</span>
                          </span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="videos" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map((video, index) => (
              <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                <div className="aspect-video bg-muted rounded-t-lg flex items-center justify-center">
                  <Video className="h-12 w-12 text-muted-foreground" />
                </div>
                <CardContent className="p-4">
                  <Badge variant="outline" className="text-xs mb-2">{video.category}</Badge>
                  <h3 className="font-medium mb-2">{video.title}</h3>
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{video.duration}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="faqs" className="space-y-4">
          {faqs.map((faq, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>{faq.question}</span>
                  <Badge variant="outline">{faq.category}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{faq.answer}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="contact" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Mail className="h-5 w-5" />
                  <span>Email Support</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-muted-foreground">Get help via email with detailed responses</p>
                <p className="text-sm"><strong>Response time:</strong> Within 24 hours</p>
                <Button className="w-full">Send Email</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageCircle className="h-5 w-5" />
                  <span>Live Chat</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-muted-foreground">Chat with our support team in real-time</p>
                <p className="text-sm"><strong>Available:</strong> Mon-Fri, 9AM-6PM EST</p>
                <Button className="w-full">Start Chat</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}