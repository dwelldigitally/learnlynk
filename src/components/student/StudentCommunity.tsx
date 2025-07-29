import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, Users, BookOpen, Heart, Share2, Search, Filter, Plus } from "lucide-react";

const StudentCommunity: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const forumPosts = [
    {
      id: 1,
      title: "Tips for Clinical Practicum Success",
      author: "Sarah M.",
      avatar: "/src/assets/author-sarah.jpg",
      program: "Health Care Assistant",
      category: "academics",
      content: "Just finished my practicum and wanted to share some tips that really helped me...",
      replies: 23,
      likes: 15,
      timeAgo: "2 hours ago",
      tags: ["practicum", "tips", "clinical"]
    },
    {
      id: 2,
      title: "Study Group for Anatomy & Physiology",
      author: "Mike R.",
      avatar: "/src/assets/author-robert.jpg",
      program: "Health Care Assistant",
      category: "study-groups",
      content: "Looking for 3-4 students to form a study group for the upcoming A&P exam...",
      replies: 8,
      likes: 12,
      timeAgo: "5 hours ago",
      tags: ["study-group", "anatomy", "exam-prep"]
    },
    {
      id: 3,
      title: "Job Interview Experience at VGH",
      author: "Jennifer K.",
      avatar: "/src/assets/alumni-nicole.jpg",
      program: "Health Care Assistant",
      category: "career",
      content: "Just had my interview at Vancouver General Hospital. Here's what they asked...",
      replies: 31,
      likes: 28,
      timeAgo: "1 day ago",
      tags: ["interview", "VGH", "career", "job-search"]
    },
    {
      id: 4,
      title: "Mental Health Resources and Support",
      author: "Alex T.",
      avatar: "/src/assets/author-ahmed.jpg",
      program: "Health Care Assistant",
      category: "wellness",
      content: "Sharing some mental health resources that have been helpful during studies...",
      replies: 19,
      likes: 34,
      timeAgo: "2 days ago",
      tags: ["mental-health", "wellness", "resources"]
    }
  ];

  const studyGroups = [
    {
      name: "Anatomy & Physiology Study Circle",
      members: 8,
      capacity: 10,
      subject: "HCA102",
      meetingTime: "Tuesdays 6 PM",
      location: "Library Room 201",
      description: "Weekly study sessions with quiz practice and group discussions"
    },
    {
      name: "Clinical Skills Practice Group",
      members: 6,
      capacity: 8,
      subject: "HCA201",
      meetingTime: "Saturdays 2 PM",
      location: "Skills Lab B",
      description: "Hands-on practice sessions for personal care skills"
    },
    {
      name: "Final Exam Prep Team",
      members: 12,
      capacity: 15,
      subject: "All Courses",
      meetingTime: "Daily 4 PM",
      location: "Online (Zoom)",
      description: "Intensive final exam preparation with study schedules and mock tests"
    }
  ];

  const mentorshipPairs = [
    {
      mentor: "Lisa Chen",
      mentee: "You",
      program: "Health Care Assistant",
      specialty: "Geriatric Care",
      avatar: "/src/assets/advisor-nicole.jpg",
      status: "active",
      nextMeeting: "March 20, 2024"
    },
    {
      mentor: "Available",
      mentee: "Open Spot",
      program: "Health Care Assistant",
      specialty: "Pediatric Care",
      avatar: null,
      status: "available",
      nextMeeting: null
    }
  ];

  const categories = [
    { id: "all", name: "All Posts", count: forumPosts.length },
    { id: "academics", name: "Academics", count: 1 },
    { id: "study-groups", name: "Study Groups", count: 1 },
    { id: "career", name: "Career", count: 1 },
    { id: "wellness", name: "Wellness", count: 1 }
  ];

  const filteredPosts = forumPosts.filter(post => {
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
    const matchesSearch = searchQuery === "" || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Student Community</h1>
        <p className="text-gray-600 mt-2">Connect, collaborate, and grow with your fellow students</p>
      </div>

      <Tabs defaultValue="forum" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="forum">Discussion Forum</TabsTrigger>
          <TabsTrigger value="study-groups">Study Groups</TabsTrigger>
          <TabsTrigger value="mentorship">Peer Mentorship</TabsTrigger>
          <TabsTrigger value="events">Community Events</TabsTrigger>
        </TabsList>

        <TabsContent value="forum" className="space-y-4">
          {/* Search and Filter */}
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-4 mb-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search discussions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  New Post
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className="flex items-center gap-2"
                  >
                    {category.name}
                    <Badge variant="secondary" className="text-xs">{category.count}</Badge>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Forum Posts */}
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={post.avatar} alt={post.author} />
                      <AvatarFallback>{post.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold hover:text-blue-600 cursor-pointer">{post.title}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span>{post.author}</span>
                            <span>•</span>
                            <span>{post.program}</span>
                            <span>•</span>
                            <span>{post.timeAgo}</span>
                          </div>
                        </div>
                        <Badge variant="outline">{post.category}</Badge>
                      </div>
                      
                      <p className="text-gray-700 text-sm">{post.content}</p>
                      
                      <div className="flex flex-wrap gap-1 mb-2">
                        {post.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <button className="flex items-center gap-1 hover:text-blue-600">
                          <MessageCircle className="h-4 w-4" />
                          {post.replies} replies
                        </button>
                        <button className="flex items-center gap-1 hover:text-red-600">
                          <Heart className="h-4 w-4" />
                          {post.likes} likes
                        </button>
                        <button className="flex items-center gap-1 hover:text-green-600">
                          <Share2 className="h-4 w-4" />
                          Share
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="study-groups" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Active Study Groups
              </CardTitle>
              <CardDescription>
                Join or create study groups to enhance your learning experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {studyGroups.map((group, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{group.name}</h3>
                      <div className="text-sm text-gray-600 mt-1">
                        <div>Subject: {group.subject}</div>
                        <div>Meets: {group.meetingTime}</div>
                        <div>Location: {group.location}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{group.members}/{group.capacity} members</div>
                      <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(group.members / group.capacity) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">{group.description}</p>
                  <Button className="w-full">
                    {group.members < group.capacity ? "Join Group" : "Join Waitlist"}
                  </Button>
                </div>
              ))}
              
              <Button variant="outline" className="w-full mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Create New Study Group
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mentorship" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Peer Mentorship Program
              </CardTitle>
              <CardDescription>
                Connect with senior students for guidance and support
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mentorshipPairs.map((pair, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                      {pair.avatar ? (
                        <AvatarImage src={pair.avatar} alt={pair.mentor} />
                      ) : (
                        <AvatarFallback>?</AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{pair.mentor}</h3>
                          <p className="text-sm text-gray-600">{pair.program}</p>
                          <p className="text-sm text-gray-500">Specialty: {pair.specialty}</p>
                        </div>
                        <Badge variant={pair.status === "active" ? "default" : "secondary"}>
                          {pair.status}
                        </Badge>
                      </div>
                      {pair.nextMeeting && (
                        <p className="text-sm text-blue-600 mt-2">Next meeting: {pair.nextMeeting}</p>
                      )}
                    </div>
                  </div>
                  <Button className="w-full">
                    {pair.status === "active" ? "Message Mentor" : "Request Mentorship"}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Community Events</CardTitle>
              <CardDescription>
                Student-organized events and social activities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No upcoming community events</p>
                <Button variant="outline" className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Organize an Event
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentCommunity;