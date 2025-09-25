import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Award, Search, CheckCircle, Clock, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useStudentAssignments, useSubmitCompetency, useStudentProgress } from "@/hooks/useStudentPracticum";
import { Alert, AlertDescription } from "@/components/ui/alert";

const competencySchema = z.object({
  assignment_id: z.string().min(1, "Assignment is required"),
  competency_ids: z.array(z.string()).min(1, "Please select at least one competency"),
  notes: z.string().optional()
});

type CompetencyFormData = z.infer<typeof competencySchema>;

// Demo competencies - in real app, these would come from the database
const DEMO_COMPETENCIES = [
  {
    id: "comp-1",
    name: "Patient Assessment",
    description: "Conduct comprehensive patient assessments including vital signs, physical examination, and health history",
    category: "Clinical Skills",
    status: "completed" as const
  },
  {
    id: "comp-2", 
    name: "Medication Administration",
    description: "Safely administer medications via various routes following proper protocols",
    category: "Clinical Skills",
    status: "in_progress" as const
  },
  {
    id: "comp-3",
    name: "Infection Control",
    description: "Implement and maintain infection prevention and control measures",
    category: "Safety & Quality",
    status: "not_started" as const
  },
  {
    id: "comp-4",
    name: "Documentation",
    description: "Accurately document patient care activities and observations",
    category: "Professional Practice",
    status: "in_progress" as const
  },
  {
    id: "comp-5",
    name: "Therapeutic Communication",
    description: "Demonstrate effective communication skills with patients and families",
    category: "Professional Practice", 
    status: "not_started" as const
  },
  {
    id: "comp-6",
    name: "Emergency Response",
    description: "Respond appropriately to medical emergencies and critical situations",
    category: "Clinical Skills",
    status: "not_started" as const
  }
];

export default function CompetencyTracker() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  const { data: assignments } = useStudentAssignments();
  const activeAssignment = assignments?.[0];
  const { data: progress } = useStudentProgress(activeAssignment?.id);
  const submitCompetency = useSubmitCompetency();

  const form = useForm<CompetencyFormData>({
    resolver: zodResolver(competencySchema),
    defaultValues: {
      assignment_id: activeAssignment?.id || "",
      competency_ids: [],
      notes: ""
    }
  });

  React.useEffect(() => {
    if (activeAssignment?.id) {
      form.setValue("assignment_id", activeAssignment.id);
    }
  }, [activeAssignment, form]);

  const categories = Array.from(new Set(DEMO_COMPETENCIES.map(c => c.category)));
  
  const filteredCompetencies = DEMO_COMPETENCIES.filter(competency => {
    const matchesSearch = competency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         competency.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || competency.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const watchedCompetencyIds = form.watch("competency_ids");

  const onSubmit = async (data: CompetencyFormData) => {
    try {
      // Ensure all required fields are defined before submission
      if (!data.assignment_id || !data.competency_ids || data.competency_ids.length === 0) {
        return; // Form validation will catch this
      }
      
      await submitCompetency.mutateAsync({
        assignment_id: data.assignment_id,
        competency_ids: data.competency_ids,
        notes: data.notes
      });
      form.setValue("competency_ids", []);
      form.setValue("notes", "");
    } catch (error) {
      console.error('Failed to submit competency:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "in_progress":
        return <Clock className="h-4 w-4 text-orange-500" />;
      default:
        return <div className="h-4 w-4 rounded-full border-2 border-gray-300" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Completed</Badge>;
      case "in_progress":
        return <Badge variant="secondary" className="bg-orange-100 text-orange-800">In Progress</Badge>;
      default:
        return <Badge variant="outline">Not Started</Badge>;
    }
  };

  const completedCompetencies = DEMO_COMPETENCIES.filter(c => c.status === "completed").length;
  const totalCompetencies = DEMO_COMPETENCIES.length;
  const progressPercentage = (completedCompetencies / totalCompetencies) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/student/practicum">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Competency Tracker</h1>
          <p className="text-muted-foreground">Track and submit the skills you've practiced</p>
        </div>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Competency Progress
          </CardTitle>
          <CardDescription>Your overall progress toward completing required competencies</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Completed Competencies</span>
              <span>{completedCompetencies} / {totalCompetencies}</span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
            <p className="text-xs text-muted-foreground">
              {Math.round(progressPercentage)}% complete
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Competency Selection */}
        <div className="lg:col-span-2 space-y-6">
          {/* Search and Filter */}
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search competencies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-input rounded-md text-sm"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Competency List */}
          <Card>
            <CardHeader>
              <CardTitle>Available Competencies</CardTitle>
              <CardDescription>
                Select the competencies you practiced today
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="competency_ids"
                    render={() => (
                      <FormItem>
                        <div className="space-y-4">
                          {filteredCompetencies.map((competency) => (
                            <FormField
                              key={competency.id}
                              control={form.control}
                              name="competency_ids"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={competency.id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(competency.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, competency.id])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== competency.id
                                                )
                                              )
                                        }}
                                      />
                                    </FormControl>
                                    <div className="flex-1 space-y-2">
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                          {getStatusIcon(competency.status)}
                                          <FormLabel className="text-sm font-medium">
                                            {competency.name}
                                          </FormLabel>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <Badge variant="outline" className="text-xs">
                                            {competency.category}
                                          </Badge>
                                          {getStatusBadge(competency.status)}
                                        </div>
                                      </div>
                                      <p className="text-xs text-muted-foreground">
                                        {competency.description}
                                      </p>
                                    </div>
                                  </FormItem>
                                )
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Selected Competencies Alert */}
                  {watchedCompetencyIds.length > 0 && (
                    <Alert>
                      <Award className="h-4 w-4" />
                      <AlertDescription>
                        {watchedCompetencyIds.length} competenc{watchedCompetencyIds.length === 1 ? 'y' : 'ies'} selected for submission
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Notes */}
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Notes (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Add any additional notes about your competency practice..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={submitCompetency.isPending || watchedCompetencyIds.length === 0}
                  >
                    {submitCompetency.isPending ? (
                      "Submitting..."
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Submit for Approval
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Instructions & Progress */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">How to Log Competencies:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Select competencies you practiced today</li>
                  <li>• Use search to find specific skills</li>
                  <li>• Filter by category for easier browsing</li>
                  <li>• Add notes for additional context</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Status Meanings:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span className="text-muted-foreground">Completed - Approved by preceptor</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3 text-orange-500" />
                    <span className="text-muted-foreground">In Progress - Partially completed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full border border-gray-300" />
                    <span className="text-muted-foreground">Not Started - Yet to begin</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{completedCompetencies}</div>
                  <div className="text-xs text-muted-foreground">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {DEMO_COMPETENCIES.filter(c => c.status === "in_progress").length}
                  </div>
                  <div className="text-xs text-muted-foreground">In Progress</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}