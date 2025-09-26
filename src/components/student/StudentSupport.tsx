import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageCircle, 
  Phone, 
  Mail, 
  Clock, 
  Users, 
  BookOpen,
  Heart,
  Shield,
  HelpCircle,
  Search,
  Send,
  Star
} from 'lucide-react';

interface SupportTicket {
  id: string;
  subject: string;
  category: 'Academic' | 'Technical' | 'Financial' | 'Personal' | 'Administrative';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  createdDate: string;
  lastUpdate: string;
  assignedTo: string;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  helpful: number;
}

const mockTickets: SupportTicket[] = [
  {
    id: 'T001',
    subject: 'Unable to access course materials',
    category: 'Technical',
    status: 'In Progress',
    priority: 'Medium',
    createdDate: '2024-12-20',
    lastUpdate: '2024-12-21',
    assignedTo: 'IT Support Team'
  },
  {
    id: 'T002',
    subject: 'Grade appeal for NURS 1010',
    category: 'Academic',
    status: 'Open',
    priority: 'High',
    createdDate: '2024-12-19',
    lastUpdate: '2024-12-19',
    assignedTo: 'Academic Affairs'
  }
];

const mockFAQs: FAQ[] = [
  {
    id: '1',
    question: 'How do I reset my student portal password?',
    answer: 'You can reset your password by clicking "Forgot Password" on the login page and following the instructions sent to your email.',
    category: 'Technical',
    helpful: 45
  },
  {
    id: '2',
    question: 'When are tuition payment deadlines?',
    answer: 'Tuition payments are due by the 15th of each month. Late fees apply after the deadline. You can set up payment plans through the financial aid office.',
    category: 'Financial',
    helpful: 38
  },
  {
    id: '3',
    question: 'How do I request transcripts?',
    answer: 'Official transcripts can be requested through the Registrar\'s office. Processing takes 3-5 business days. There is a $10 fee per transcript.',
    category: 'Administrative',
    helpful: 42
  }
];

export default function StudentSupport() {
  const [searchTerm, setSearchTerm] = useState('');
  const [newTicket, setNewTicket] = useState({
    subject: '',
    category: '',
    priority: '',
    description: ''
  });

  const filteredFAQs = mockFAQs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-blue-500';
      case 'In Progress': return 'bg-yellow-500';
      case 'Resolved': return 'bg-green-500';
      case 'Closed': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Low': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">Student Support Center</h1>
          <p className="text-xl text-muted-foreground">
            Get help with academic, technical, and personal support services
          </p>
        </div>

        {/* Quick Contact Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <MessageCircle className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Live Chat</h3>
              <p className="text-muted-foreground mb-4">Chat with our support team instantly</p>
              <Badge className="bg-green-100 text-green-800">Available Now</Badge>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Phone className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Phone Support</h3>
              <p className="text-muted-foreground mb-4">(604) 555-0123</p>
              <Badge className="bg-blue-100 text-blue-800">Mon-Fri 8AM-6PM</Badge>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Mail className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Email Support</h3>
              <p className="text-muted-foreground mb-4">support@westcoastcollege.ca</p>
              <Badge className="bg-yellow-100 text-yellow-800">24-48hr Response</Badge>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="help" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="help">Help & FAQ</TabsTrigger>
            <TabsTrigger value="tickets">My Tickets</TabsTrigger>
            <TabsTrigger value="new-ticket">Submit Ticket</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          <TabsContent value="help" className="space-y-6">
            {/* Search FAQs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" />
                  Frequently Asked Questions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search for answers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="space-y-4">
                  {filteredFAQs.map((faq) => (
                    <Card key={faq.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-foreground">{faq.question}</h3>
                          <Badge variant="outline">{faq.category}</Badge>
                        </div>
                        <p className="text-muted-foreground mb-3">{faq.answer}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Star className="h-4 w-4" />
                          <span>{faq.helpful} people found this helpful</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tickets" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Support Tickets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockTickets.map((ticket) => (
                    <Card key={ticket.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold text-foreground">#{ticket.id} - {ticket.subject}</h3>
                            <p className="text-sm text-muted-foreground">Assigned to: {ticket.assignedTo}</p>
                          </div>
                          <div className="flex gap-2">
                            <Badge className={getPriorityColor(ticket.priority)}>
                              {ticket.priority}
                            </Badge>
                            <Badge variant="outline">{ticket.category}</Badge>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>Created: {new Date(ticket.createdDate).toLocaleDateString()}</span>
                            <span>Updated: {new Date(ticket.lastUpdate).toLocaleDateString()}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${getStatusColor(ticket.status)}`} />
                            <span className="text-sm font-medium">{ticket.status}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="new-ticket" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Submit a Support Ticket</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Subject</label>
                    <Input
                      placeholder="Brief description of your issue"
                      value={newTicket.subject}
                      onChange={(e) => setNewTicket({...newTicket, subject: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <select 
                      className="w-full p-2 border rounded-md"
                      value={newTicket.category}
                      onChange={(e) => setNewTicket({...newTicket, category: e.target.value})}
                    >
                      <option value="">Select Category</option>
                      <option value="Academic">Academic</option>
                      <option value="Technical">Technical</option>
                      <option value="Financial">Financial</option>
                      <option value="Personal">Personal</option>
                      <option value="Administrative">Administrative</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Priority</label>
                    <select 
                      className="w-full p-2 border rounded-md"
                      value={newTicket.priority}
                      onChange={(e) => setNewTicket({...newTicket, priority: e.target.value})}
                    >
                      <option value="">Select Priority</option>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Urgent">Urgent</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <Textarea
                    placeholder="Please provide detailed information about your issue..."
                    value={newTicket.description}
                    onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
                    rows={6}
                  />
                </div>
                
                <Button className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Submit Ticket
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <BookOpen className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Academic Support</h3>
                  <p className="text-muted-foreground mb-4">Tutoring, study groups, and academic coaching</p>
                  <Button variant="outline" size="sm">Learn More</Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Counseling Services</h3>
                  <p className="text-muted-foreground mb-4">Mental health and wellness support</p>
                  <Button variant="outline" size="sm">Get Help</Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Campus Safety</h3>
                  <p className="text-muted-foreground mb-4">Emergency contacts and safety resources</p>
                  <Button variant="outline" size="sm">View Resources</Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Student Organizations</h3>
                  <p className="text-muted-foreground mb-4">Join clubs and student groups</p>
                  <Button variant="outline" size="sm">Explore</Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">24/7 Crisis Line</h3>
                  <p className="text-muted-foreground mb-4">Immediate support when you need it</p>
                  <Button variant="outline" size="sm">Contact Now</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
