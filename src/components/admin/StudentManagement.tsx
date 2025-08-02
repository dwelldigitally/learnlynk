import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Filter, 
  Eye, 
  Send, 
  Download,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  X,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

const StudentManagement: React.FC = () => {
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStage, setFilterStage] = useState("all");
  const [filterProgram, setFilterProgram] = useState("all");
  const [filterIntake, setFilterIntake] = useState("all");
  const [filterCampus, setFilterCampus] = useState("all");
  const [filterStudentType, setFilterStudentType] = useState("all");
  const [filterRiskLevel, setFilterRiskLevel] = useState("all");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const students = [
    {
      id: "1",
      name: "Alex Thompson",
      email: "sarah.johnson@email.com",
      program: "Health Care Assistant",
      stage: "DOCUMENT_APPROVAL",
      progress: 75,
      leadScore: 85,
      advisor: "Nicole Adams",
      submissionDate: "2024-01-15",
      riskLevel: "low",
      lastActivity: "2 hours ago",
      intake: "Spring 2024",
      campus: "Downtown Campus",
      studentType: "International",
      country: "India"
    },
    {
      id: "2",
      name: "Jordan Smith",
      email: "michael.chen@email.com",
      program: "Early Childhood Education",
      stage: "FEE_PAYMENT",
      progress: 90,
      leadScore: 92,
      advisor: "Nicole Adams",
      submissionDate: "2024-01-10",
      riskLevel: "low",
      lastActivity: "1 day ago",
      intake: "Fall 2024",
      campus: "North Campus",
      studentType: "International",
      country: "China"
    },
    {
      id: "3",
      name: "Emma Davis",
      email: "emma.davis@email.com",
      program: "Aviation Maintenance",
      stage: "SEND_DOCUMENTS",
      progress: 45,
      leadScore: 60,
      advisor: "Robert Smith",
      submissionDate: "2024-01-20",
      riskLevel: "high",
      lastActivity: "7 days ago",
      intake: "Summer 2024",
      campus: "Technical Campus",
      studentType: "Domestic",
      country: "Canada"
    },
    {
      id: "4",
      name: "James Wilson",
      email: "james.wilson@email.com",
      program: "Education Assistant",
      stage: "ACCEPTED",
      progress: 100,
      leadScore: 95,
      advisor: "Sarah Kim",
      submissionDate: "2024-01-05",
      riskLevel: "low",
      lastActivity: "Active",
      intake: "Spring 2024",
      campus: "Downtown Campus",
      studentType: "Domestic",
      country: "Canada"
    },
    {
      id: "5",
      name: "Maria Rodriguez",
      email: "maria.rodriguez@email.com",
      program: "Health Care Assistant",
      stage: "LEAD_FORM",
      progress: 25,
      leadScore: 45,
      advisor: "Nicole Adams",
      submissionDate: "2024-01-25",
      riskLevel: "medium",
      lastActivity: "3 days ago",
      intake: "Fall 2024",
      campus: "Downtown Campus",
      studentType: "International",
      country: "Mexico"
    },
    {
      id: "6",
      name: "David Thompson",
      email: "david.thompson@email.com",
      program: "Aviation Maintenance",
      stage: "DOCUMENT_APPROVAL",
      progress: 80,
      leadScore: 88,
      advisor: "Robert Smith",
      submissionDate: "2024-01-12",
      riskLevel: "low",
      lastActivity: "1 hour ago",
      intake: "Summer 2024",
      campus: "Technical Campus",
      studentType: "Domestic",
      country: "Canada"
    }
  ];

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "LEAD_FORM": return "outline";
      case "SEND_DOCUMENTS": return "secondary";
      case "DOCUMENT_APPROVAL": return "default";
      case "FEE_PAYMENT": return "default";
      case "ACCEPTED": return "secondary";
      default: return "outline";
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high": return "text-red-600";
      case "medium": return "text-yellow-600";
      case "low": return "text-green-600";
      default: return "text-gray-600";
    }
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setFilterStage("all");
    setFilterProgram("all");
    setFilterIntake("all");
    setFilterCampus("all");
    setFilterStudentType("all");
    setFilterRiskLevel("all");
  };

  const activeFiltersCount = [
    filterStage !== "all",
    filterProgram !== "all",
    filterIntake !== "all",
    filterCampus !== "all",
    filterStudentType !== "all",
    filterRiskLevel !== "all",
    searchTerm !== ""
  ].filter(Boolean).length;

  const filteredStudents = students.filter(student => {
    // Search filter
    if (searchTerm && !student.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !student.email.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    
    // Stage filter
    if (filterStage !== "all" && student.stage !== filterStage) return false;
    
    // Program filter
    if (filterProgram !== "all" && student.program !== filterProgram) return false;
    
    // Intake filter
    if (filterIntake !== "all" && student.intake !== filterIntake) return false;
    
    // Campus filter
    if (filterCampus !== "all" && student.campus !== filterCampus) return false;
    
    // Student type filter
    if (filterStudentType !== "all" && student.studentType !== filterStudentType) return false;
    
    // Risk level filter
    if (filterRiskLevel !== "all" && student.riskLevel !== filterRiskLevel) return false;
    
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Student Management</h1>
          <p className="text-muted-foreground">Manage student applications and progress</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <Send className="h-4 w-4 mr-2" />
            Bulk Message
          </Button>
        </div>
      </div>

      {/* Pipeline Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[
          { stage: "Lead Form", count: 156, color: "bg-blue-500" },
          { stage: "Documents", count: 89, color: "bg-yellow-500" },
          { stage: "Approval", count: 45, color: "bg-orange-500" },
          { stage: "Payment", count: 23, color: "bg-purple-500" },
          { stage: "Accepted", count: 112, color: "bg-green-500" }
        ].map((item, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                <div>
                  <p className="text-sm text-muted-foreground">{item.stage}</p>
                  <p className="text-2xl font-bold">{item.count}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="all-students" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all-students">All Students</TabsTrigger>
          <TabsTrigger value="at-risk">At Risk</TabsTrigger>
          <TabsTrigger value="pending-approval">Pending Approval</TabsTrigger>
          <TabsTrigger value="new-applications">New Applications</TabsTrigger>
        </TabsList>

        <TabsContent value="all-students" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4 space-y-4">
              {/* Primary Filters Row */}
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search students..." 
                      className="pl-10" 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                
                <Select value={filterStage} onValueChange={setFilterStage}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Stages</SelectItem>
                    <SelectItem value="LEAD_FORM">Lead Form</SelectItem>
                    <SelectItem value="SEND_DOCUMENTS">Send Documents</SelectItem>
                    <SelectItem value="DOCUMENT_APPROVAL">Document Approval</SelectItem>
                    <SelectItem value="FEE_PAYMENT">Fee Payment</SelectItem>
                    <SelectItem value="ACCEPTED">Accepted</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={filterProgram} onValueChange={setFilterProgram}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Filter by program" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Programs</SelectItem>
                    <SelectItem value="Health Care Assistant">Health Care Assistant</SelectItem>
                    <SelectItem value="Early Childhood Education">Early Childhood Education</SelectItem>
                    <SelectItem value="Aviation Maintenance">Aviation Maintenance</SelectItem>
                    <SelectItem value="Education Assistant">Education Assistant</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button 
                  variant="outline" 
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className="relative"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Advanced Filters
                  {showAdvancedFilters ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
                  {activeFiltersCount > 0 && (
                    <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </div>

              {/* Advanced Filters Section */}
              {showAdvancedFilters && (
                <div className="border-t pt-4 space-y-4">
                  <div className="flex flex-wrap gap-4 items-center">
                    <Select value={filterIntake} onValueChange={setFilterIntake}>
                      <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="Intake" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Intakes</SelectItem>
                        <SelectItem value="Spring 2024">Spring 2024</SelectItem>
                        <SelectItem value="Summer 2024">Summer 2024</SelectItem>
                        <SelectItem value="Fall 2024">Fall 2024</SelectItem>
                        <SelectItem value="Winter 2025">Winter 2025</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select value={filterCampus} onValueChange={setFilterCampus}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Campus" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Campuses</SelectItem>
                        <SelectItem value="Downtown Campus">Downtown Campus</SelectItem>
                        <SelectItem value="North Campus">North Campus</SelectItem>
                        <SelectItem value="Technical Campus">Technical Campus</SelectItem>
                        <SelectItem value="Online Campus">Online Campus</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select value={filterStudentType} onValueChange={setFilterStudentType}>
                      <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="Student Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Students</SelectItem>
                        <SelectItem value="Domestic">Domestic</SelectItem>
                        <SelectItem value="International">International</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select value={filterRiskLevel} onValueChange={setFilterRiskLevel}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Risk Level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Risk Levels</SelectItem>
                        <SelectItem value="low">Low Risk</SelectItem>
                        <SelectItem value="medium">Medium Risk</SelectItem>
                        <SelectItem value="high">High Risk</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Clear Filters */}
                  {activeFiltersCount > 0 && (
                    <div className="flex justify-between items-center pt-2 border-t">
                      <p className="text-sm text-muted-foreground">
                        {activeFiltersCount} filter{activeFiltersCount > 1 ? 's' : ''} applied
                      </p>
                      <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                        <X className="h-4 w-4 mr-2" />
                        Clear All Filters
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Students Table */}
          <Card>
            <CardHeader>
              <CardTitle>Students ({filteredStudents.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Program</TableHead>
                    <TableHead>Intake</TableHead>
                    <TableHead>Campus</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Stage</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Lead Score</TableHead>
                    <TableHead>Risk</TableHead>
                    <TableHead className="w-24">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedStudents.includes(student.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedStudents([...selectedStudents, student.id]);
                            } else {
                              setSelectedStudents(selectedStudents.filter(id => id !== student.id));
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="/placeholder.svg" />
                            <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <Link 
                              to={`/admin/students/${student.id}`}
                              className="font-medium text-primary hover:underline"
                            >
                              {student.name}
                            </Link>
                            <p className="text-sm text-muted-foreground">{student.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{student.program}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {student.intake}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {student.campus}
                      </TableCell>
                      <TableCell>
                        <Badge variant={student.studentType === 'International' ? 'secondary' : 'default'} className="text-xs">
                          {student.studentType}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStageColor(student.stage)}>
                          {student.stage.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Progress value={student.progress} className="h-2 w-16" />
                          <span className="text-xs text-muted-foreground">{student.progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <span className="font-medium">{student.leadScore}</span>
                          <div className={`w-2 h-2 rounded-full ${
                            student.leadScore >= 80 ? 'bg-green-500' :
                            student.leadScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}></div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className={`flex items-center space-x-1 ${getRiskColor(student.riskLevel)}`}>
                          {student.riskLevel === 'high' && <AlertTriangle className="h-4 w-4" />}
                          {student.riskLevel === 'medium' && <Clock className="h-4 w-4" />}
                          {student.riskLevel === 'low' && <CheckCircle className="h-4 w-4" />}
                          <span className="text-xs capitalize">{student.riskLevel}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Link to={`/admin/students/${student.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Other tabs would have similar structure but filtered data */}
        <TabsContent value="at-risk">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                Students at Risk
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Students who haven't been active or need immediate attention.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending-approval">
          <Card>
            <CardHeader>
              <CardTitle>Pending Document Approval</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Students with documents waiting for review.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="new-applications">
          <Card>
            <CardHeader>
              <CardTitle>New Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Recent applications that need initial review.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentManagement;
