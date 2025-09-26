import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, BookOpen, Clock, Users, Star, GraduationCap, Calendar } from 'lucide-react';

interface Program {
  id: string;
  code: string;
  title: string;
  description: string;
  duration: string;
  totalCourses: number;
  prerequisites: string[];
  coordinator: string;
  schedule: string;
  capacity: number;
  enrolled: number;
  rating: number;
  level: 'Certificate' | 'Diploma' | 'Degree';
  department: string;
  startDate: string;
  tuition: number;
}

const mockPrograms: Program[] = [
  {
    id: '1',
    code: 'HCA',
    title: 'Health Care Assistant',
    description: 'Comprehensive program preparing students for careers in healthcare assistance. Learn essential skills in patient care, medical procedures, and healthcare ethics.',
    duration: '6 months',
    totalCourses: 6,
    prerequisites: ['High School Diploma', 'First Aid/CPR'],
    coordinator: 'Dr. Sarah Chen',
    schedule: 'Full-time, Day',
    capacity: 30,
    enrolled: 25,
    rating: 4.8,
    level: 'Certificate',
    department: 'Health Sciences',
    startDate: 'September 2024',
    tuition: 12500
  },
  {
    id: '2',
    code: 'PSW',
    title: 'Personal Support Worker',
    description: 'Training program for personal support workers in residential and community settings. Focus on client-centered care and support services.',
    duration: '8 months',
    totalCourses: 8,
    prerequisites: ['High School Diploma', 'Background Check'],
    coordinator: 'Linda Thompson, RN',
    schedule: 'Full-time, Day',
    capacity: 25,
    enrolled: 23,
    rating: 4.6,
    level: 'Certificate',
    department: 'Health Sciences',
    startDate: 'January 2025',
    tuition: 14000
  },
  {
    id: '3',
    code: 'ECE',
    title: 'Early Childhood Education',
    description: 'Comprehensive diploma program preparing graduates to work with children in various early learning and care settings.',
    duration: '2 years',
    totalCourses: 16,
    prerequisites: ['High School Diploma', 'Vulnerable Sector Check'],
    coordinator: 'Maria Rodriguez',
    schedule: 'Full-time, Day',
    capacity: 40,
    enrolled: 35,
    rating: 4.7,
    level: 'Diploma',
    department: 'Education',
    startDate: 'September 2024',
    tuition: 28000
  },
  {
    id: '4',
    code: 'BA',
    title: 'Business Administration',
    description: 'Comprehensive business program covering management, marketing, finance, and entrepreneurship. Includes practical work experience.',
    duration: '2 years',
    totalCourses: 20,
    prerequisites: ['High School Diploma', 'Mathematics 12'],
    coordinator: 'Prof. David Kim',
    schedule: 'Full-time, Day/Evening',
    capacity: 50,
    enrolled: 42,
    rating: 4.5,
    level: 'Diploma',
    department: 'Business',
    startDate: 'September 2024',
    tuition: 32000
  },
  {
    id: '5',
    code: 'CIS',
    title: 'Computer Information Systems',
    description: 'Technology-focused program covering programming, database management, network administration, and cybersecurity fundamentals.',
    duration: '2 years',
    totalCourses: 18,
    prerequisites: ['High School Diploma', 'Computer Literacy'],
    coordinator: 'Dr. Jennifer Walsh',
    schedule: 'Full-time, Day',
    capacity: 35,
    enrolled: 30,
    rating: 4.9,
    level: 'Diploma',
    department: 'Technology',
    startDate: 'January 2025',
    tuition: 35000
  }
];

const ProgramCatalog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedStartDate, setSelectedStartDate] = useState('all');

  const departments = [...new Set(mockPrograms.map(program => program.department))];
  const levels = [...new Set(mockPrograms.map(program => program.level))];
  const startDates = [...new Set(mockPrograms.map(program => program.startDate))];

  const filteredPrograms = mockPrograms.filter(program => {
    const matchesSearch = program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         program.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || program.department === selectedDepartment;
    const matchesLevel = selectedLevel === 'all' || program.level === selectedLevel;
    const matchesStartDate = selectedStartDate === 'all' || program.startDate === selectedStartDate;
    
    return matchesSearch && matchesDepartment && matchesLevel && matchesStartDate;
  });

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">Program Catalog</h1>
          <p className="text-xl text-muted-foreground">
            Explore our comprehensive program offerings and find your path to success
          </p>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Search & Filter Programs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search programs by title or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex gap-4">
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {departments.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    {levels.map(level => (
                      <SelectItem key={level} value={level}>{level}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedStartDate} onValueChange={setSelectedStartDate}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Start Date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Dates</SelectItem>
                    {startDates.map(date => (
                      <SelectItem key={date} value={date}>{date}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrograms.map((program) => (
            <Card key={program.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <GraduationCap className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <Badge className="text-xs font-medium">{program.code}</Badge>
                      <CardTitle className="text-lg mt-1">{program.title}</CardTitle>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{program.rating}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {program.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    {program.totalCourses} courses
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {program.enrolled}/{program.capacity}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {program.description}
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="capitalize">{program.level}</Badge>
                    <span className="text-lg font-bold text-primary">${program.tuition.toLocaleString()}</span>
                  </div>
                  
                  <div className="text-sm">
                    <p className="font-medium text-foreground mb-1">Department: {program.department}</p>
                    <p className="text-muted-foreground">Coordinator: {program.coordinator}</p>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>Starts: {program.startDate}</span>
                  </div>
                  
                  {program.prerequisites.length > 0 && (
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium text-foreground">Prerequisites:</h5>
                      <div className="flex flex-wrap gap-1">
                        {program.prerequisites.map((prereq, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {prereq}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button size="sm" className="flex-1">
                    View Details
                  </Button>
                  <Button size="sm" variant="outline">
                    Apply Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPrograms.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No programs found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria or browse all available programs.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default ProgramCatalog;