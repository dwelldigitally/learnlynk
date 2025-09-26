import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, BookOpen, Clock, Users, Star } from 'lucide-react';

interface Course {
  id: string;
  code: string;
  title: string;
  description: string;
  credits: number;
  prerequisites: string[];
  instructor: string;
  schedule: string;
  capacity: number;
  enrolled: number;
  rating: number;
  level: 'Undergraduate' | 'Graduate' | 'Certificate';
  department: string;
  semester: 'Fall' | 'Spring' | 'Summer';
}

const mockCourses: Course[] = [
  {
    id: '1',
    code: 'NURS 1010',
    title: 'Fundamentals of Nursing',
    description: 'Introduction to basic nursing principles, patient care, and healthcare ethics.',
    credits: 4,
    prerequisites: ['BIOL 1010', 'CHEM 1010'],
    instructor: 'Dr. Sarah Johnson',
    schedule: 'MWF 9:00-10:30',
    capacity: 30,
    enrolled: 28,
    rating: 4.8,
    level: 'Undergraduate',
    department: 'Nursing',
    semester: 'Fall'
  },
  {
    id: '2',
    code: 'COMP 2714',
    title: 'Database Systems',
    description: 'Database design, SQL, normalization, and database management systems.',
    credits: 3,
    prerequisites: ['COMP 1510'],
    instructor: 'Prof. Michael Chen',
    schedule: 'TTh 2:00-3:30',
    capacity: 35,
    enrolled: 32,
    rating: 4.6,
    level: 'Undergraduate',
    department: 'Computer Science',
    semester: 'Fall'
  },
  {
    id: '3',
    code: 'BUSN 3300',
    title: 'International Business',
    description: 'Global business practices, international trade, and cross-cultural management.',
    credits: 3,
    prerequisites: ['BUSN 2200'],
    instructor: 'Dr. Emily Rodriguez',
    schedule: 'MW 1:00-2:30',
    capacity: 40,
    enrolled: 35,
    rating: 4.7,
    level: 'Undergraduate',
    department: 'Business',
    semester: 'Spring'
  }
];

export default function CourseCatalog() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedSemester, setSelectedSemester] = useState('all');

  const departments = [...new Set(mockCourses.map(course => course.department))];
  const levels = [...new Set(mockCourses.map(course => course.level))];
  const semesters = [...new Set(mockCourses.map(course => course.semester))];

  const filteredCourses = mockCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || course.department === selectedDepartment;
    const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;
    const matchesSemester = selectedSemester === 'all' || course.semester === selectedSemester;
    
    return matchesSearch && matchesDepartment && matchesLevel && matchesSemester;
  });

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">Course Catalog</h1>
          <p className="text-xl text-muted-foreground">
            Explore our comprehensive course offerings and plan your academic journey
          </p>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Search & Filter
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search courses by title, code, or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex gap-4">
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger className="w-[200px]">
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
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    {levels.map(level => (
                      <SelectItem key={level} value={level}>{level}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Semester" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Semesters</SelectItem>
                    {semesters.map(semester => (
                      <SelectItem key={semester} value={semester}>{semester}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Course Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{course.code}</CardTitle>
                    <h3 className="font-semibold text-foreground mt-1">{course.title}</h3>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{course.rating}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline">{course.level}</Badge>
                  <Badge variant="secondary">{course.department}</Badge>
                  <Badge variant="outline">{course.semester}</Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {course.description}
                </p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <span>{course.credits} Credits</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span>{course.schedule}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    <span>{course.enrolled}/{course.capacity} enrolled</span>
                  </div>
                  
                  <div>
                    <span className="font-medium">Instructor:</span> {course.instructor}
                  </div>
                  
                  {course.prerequisites.length > 0 && (
                    <div>
                      <span className="font-medium">Prerequisites:</span>{' '}
                      {course.prerequisites.join(', ')}
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button size="sm" className="flex-1">
                    View Details
                  </Button>
                  <Button size="sm" variant="outline">
                    Add to Wishlist
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No courses found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria or filters to find courses.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}