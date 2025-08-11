import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  GraduationCap, 
  Calendar,
  MessageSquare,
  Plus,
  Eye,
  Filter,
  BookOpen,
  Clock
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface QuickStudentLookupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuickStudentLookupModal({ open, onOpenChange }: QuickStudentLookupModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("students");
  const navigate = useNavigate();

  const students = [
    {
      id: "1",
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      phone: "+1 (555) 123-4567",
      program: "MBA",
      stage: "Enrolled",
      location: "New York, NY",
      lastActivity: "2 hours ago",
      status: "active"
    },
    {
      id: "2", 
      name: "Mike Davis",
      email: "mike.davis@email.com",
      phone: "+1 (555) 987-6543",
      program: "Computer Science",
      stage: "Application Review",
      location: "Los Angeles, CA",
      lastActivity: "1 day ago",
      status: "pending"
    },
    {
      id: "3",
      name: "Emma Wilson", 
      email: "emma.wilson@email.com",
      phone: "+1 (555) 456-7890",
      program: "Psychology",
      stage: "Document Submission",
      location: "Chicago, IL",
      lastActivity: "3 hours ago",
      status: "incomplete"
    }
  ];

  const leads = [
    {
      id: "1",
      name: "James Brown",
      email: "james.brown@email.com",
      phone: "+1 (555) 234-5678",
      interest: "Engineering",
      source: "Website",
      score: 85,
      lastContact: "1 hour ago",
      status: "hot"
    },
    {
      id: "2",
      name: "Lisa Garcia", 
      email: "lisa.garcia@email.com",
      phone: "+1 (555) 345-6789",
      interest: "Business Administration",
      source: "Social Media",
      score: 72,
      lastContact: "4 hours ago",
      status: "warm"
    }
  ];

  const recentSearches = [
    "Sarah Johnson",
    "MBA students",
    "Computer Science applications",
    "Overdue payments"
  ];

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.program.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredLeads = leads.filter(lead =>
    lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.interest.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleQuickAction = (action: string, id: string, type: 'student' | 'lead') => {
    switch (action) {
      case 'view':
        navigate(`/admin/${type === 'student' ? 'students' : 'leads'}/${id}`);
        onOpenChange(false);
        break;
      case 'message':
        // Open communication modal
        break;
      case 'note':
        // Open note modal  
        break;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': case 'hot': return 'bg-green-500';
      case 'pending': case 'warm': return 'bg-yellow-500';
      case 'incomplete': case 'cold': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Quick Lookup</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search students, leads, programs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Recent Searches */}
          {!searchQuery && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Recent searches:</p>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setSearchQuery(search)}
                    className="text-xs"
                  >
                    <Clock className="h-3 w-3 mr-1" />
                    {search}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Results Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="students" className="flex items-center space-x-2">
                <GraduationCap className="h-4 w-4" />
                <span>Students ({filteredStudents.length})</span>
              </TabsTrigger>
              <TabsTrigger value="leads" className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Leads ({filteredLeads.length})</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="students" className="space-y-3">
              {filteredStudents.map((student) => (
                <div key={student.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{student.name}</h3>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span className="flex items-center space-x-1">
                              <Mail className="h-3 w-3" />
                              <span>{student.email}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Phone className="h-3 w-3" />
                              <span>{student.phone}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <BookOpen className="h-3 w-3" />
                          <span>{student.program}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3" />
                          <span>{student.location}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(student.status)}`} />
                          <span>{student.stage}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{student.lastActivity}</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex items-center space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleQuickAction('view', student.id, 'student')}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleQuickAction('message', student.id, 'student')}
                      >
                        <MessageSquare className="h-3 w-3 mr-1" />
                        Message
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleQuickAction('note', student.id, 'student')}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Note
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredStudents.length === 0 && searchQuery && (
                <div className="text-center py-8 text-muted-foreground">
                  <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No students found matching "{searchQuery}"</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="leads" className="space-y-3">
              {filteredLeads.map((lead) => (
                <div key={lead.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-orange-500/10 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{lead.name}</h3>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span className="flex items-center space-x-1">
                              <Mail className="h-3 w-3" />
                              <span>{lead.email}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Phone className="h-3 w-3" />
                              <span>{lead.phone}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <BookOpen className="h-3 w-3" />
                          <span>{lead.interest}</span>
                        </div>
                        <div>
                          Source: {lead.source}
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(lead.status)}`} />
                          <span>Score: {lead.score}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{lead.lastContact}</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex items-center space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleQuickAction('view', lead.id, 'lead')}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleQuickAction('message', lead.id, 'lead')}
                      >
                        <MessageSquare className="h-3 w-3 mr-1" />
                        Message
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleQuickAction('note', lead.id, 'lead')}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Note
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredLeads.length === 0 && searchQuery && (
                <div className="text-center py-8 text-muted-foreground">
                  <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No leads found matching "{searchQuery}"</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}