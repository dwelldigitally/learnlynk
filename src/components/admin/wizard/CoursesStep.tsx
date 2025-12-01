import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Trash2, 
  GripVertical,
  BookOpen,
  Clock,
  Monitor
} from "lucide-react";
import { Program, ProgramCourse } from "@/types/program";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

interface CoursesStepProps {
  data: Partial<Program>;
  onDataChange: (data: Partial<Program>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const CoursesStep: React.FC<CoursesStepProps> = ({
  data,
  onDataChange,
  onNext,
  onPrevious
}) => {
  const [editingCourse, setEditingCourse] = useState<ProgramCourse | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const courses = data.courses || [];

  const handleAddCourse = () => {
    const newCourse: ProgramCourse = {
      id: `course_${Date.now()}`,
      title: "",
      description: "",
      hours: 0,
      modality: "in-person",
      order: courses.length
    };
    setEditingCourse(newCourse);
    setIsAdding(true);
  };

  const handleSaveCourse = () => {
    if (!editingCourse || !editingCourse.title) return;

    let updatedCourses: ProgramCourse[];
    
    if (isAdding) {
      updatedCourses = [...courses, editingCourse];
    } else {
      updatedCourses = courses.map(c => 
        c.id === editingCourse.id ? editingCourse : c
      );
    }

    onDataChange({ courses: updatedCourses });
    setEditingCourse(null);
    setIsAdding(false);
  };

  const handleDeleteCourse = (courseId: string) => {
    onDataChange({
      courses: courses.filter(c => c.id !== courseId)
    });
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(courses);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const reordered = items.map((item, index) => ({
      ...item,
      order: index
    }));

    onDataChange({ courses: reordered });
  };

  const getModalityBadge = (modality: string) => {
    const variants = {
      'in-person': 'default',
      'online': 'secondary',
      'hybrid': 'outline'
    };
    return variants[modality as keyof typeof variants] || 'default';
  };

  const totalHours = courses.reduce((sum, course) => sum + (course.hours || 0), 0);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header with Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold">Program Courses</h2>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Add courses that make up this program
          </p>
        </div>
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="text-center sm:text-right">
            <p className="text-xs sm:text-sm text-muted-foreground">Total Courses</p>
            <p className="text-xl sm:text-2xl font-bold">{courses.length}</p>
          </div>
          <div className="text-center sm:text-right">
            <p className="text-xs sm:text-sm text-muted-foreground">Total Hours</p>
            <p className="text-xl sm:text-2xl font-bold">{totalHours}</p>
          </div>
        </div>
      </div>

      {/* Add Course Button */}
      {!editingCourse && (
        <Button onClick={handleAddCourse} className="w-full min-h-[44px]" variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Add Course
        </Button>
      )}

      {/* Course Editor */}
      {editingCourse && (
        <Card className="border-primary/50 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              {isAdding ? 'Add New Course' : 'Edit Course'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="course-title">Course Title *</Label>
              <Input
                id="course-title"
                value={editingCourse.title}
                onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })}
                placeholder="e.g., Introduction to Healthcare"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="course-description">Description</Label>
              <Textarea
                id="course-description"
                value={editingCourse.description}
                onChange={(e) => setEditingCourse({ ...editingCourse, description: e.target.value })}
                placeholder="Brief description of the course content and objectives..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="course-hours" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Course Hours *
                </Label>
                <Input
                  id="course-hours"
                  type="number"
                  min="0"
                  value={editingCourse.hours || ''}
                  onChange={(e) => setEditingCourse({ 
                    ...editingCourse, 
                    hours: parseInt(e.target.value) || 0 
                  })}
                  placeholder="e.g., 40"
                  className="min-h-[44px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="course-modality" className="flex items-center gap-2">
                  <Monitor className="h-4 w-4" />
                  Modality *
                </Label>
                <Select
                  value={editingCourse.modality}
                  onValueChange={(value: any) => setEditingCourse({ ...editingCourse, modality: value })}
                >
                  <SelectTrigger className="min-h-[44px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in-person">In-Person</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 justify-end pt-4 border-t">
              <Button 
                variant="outline" 
                onClick={() => {
                  setEditingCourse(null);
                  setIsAdding(false);
                }}
                className="w-full sm:w-auto min-h-[44px]"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSaveCourse}
                disabled={!editingCourse.title || editingCourse.hours <= 0}
                className="w-full sm:w-auto min-h-[44px]"
              >
                {isAdding ? 'Add Course' : 'Save Changes'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Courses List */}
      {courses.length > 0 && !editingCourse && (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="courses">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                {courses
                  .sort((a, b) => a.order - b.order)
                  .map((course, index) => (
                    <Draggable key={course.id} draggableId={course.id} index={index}>
                      {(provided, snapshot) => (
                        <Card
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`transition-shadow ${
                            snapshot.isDragging ? 'shadow-lg' : ''
                          }`}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start gap-4">
                              <div
                                {...provided.dragHandleProps}
                                className="cursor-grab active:cursor-grabbing mt-1"
                              >
                                <GripVertical className="h-5 w-5 text-muted-foreground" />
                              </div>

                              <div className="flex-1 space-y-2">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-lg">{course.title}</h4>
                                    {course.description && (
                                      <p className="text-sm text-muted-foreground mt-1">
                                        {course.description}
                                      </p>
                                    )}
                                  </div>
                                  <div className="flex gap-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        setEditingCourse(course);
                                        setIsAdding(false);
                                      }}
                                    >
                                      Edit
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleDeleteCourse(course.id)}
                                      className="text-destructive hover:text-destructive"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>

                                <div className="flex items-center gap-3">
                                  <Badge variant="outline" className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {course.hours} hours
                                  </Badge>
                                  <Badge variant={getModalityBadge(course.modality) as any}>
                                    <Monitor className="h-3 w-3 mr-1" />
                                    {course.modality}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}

      {/* Empty State */}
      {courses.length === 0 && !editingCourse && (
        <Card className="border-dashed">
          <CardContent className="py-16 text-center">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Courses Added</h3>
            <p className="text-muted-foreground mb-6">
              Start building your program by adding courses
            </p>
            <Button onClick={handleAddCourse}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Course
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CoursesStep;
