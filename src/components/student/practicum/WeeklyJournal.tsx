import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, FileText, Plus, X, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useStudentAssignments, useSubmitJournal } from "@/hooks/useStudentPracticum";

const journalSchema = z.object({
  assignment_id: z.string().min(1, "Assignment is required"),
  week_of: z.string().min(1, "Week date is required"),
  reflection_content: z.string().min(50, "Reflection must be at least 50 characters"),
  learning_objectives: z.array(z.string().min(1, "Learning objective cannot be empty")).min(1, "At least one learning objective is required"),
  resources_links: z.array(z.string().url("Must be a valid URL")).optional()
});

type JournalFormData = z.infer<typeof journalSchema>;

export default function WeeklyJournal() {
  const { data: assignments } = useStudentAssignments();
  const activeAssignment = assignments?.[0];
  const submitJournal = useSubmitJournal();

  const form = useForm<JournalFormData>({
    resolver: zodResolver(journalSchema),
    defaultValues: {
      assignment_id: activeAssignment?.id || "",
      week_of: getWeekStart(new Date()).toISOString().split('T')[0],
      reflection_content: "",
      learning_objectives: [""],
      resources_links: []
    }
  });

  React.useEffect(() => {
    if (activeAssignment?.id) {
      form.setValue("assignment_id", activeAssignment.id);
    }
  }, [activeAssignment, form]);

  // Get start of current week (Monday)
  function getWeekStart(date: Date): Date {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  }

  const watchedObjectives = form.watch("learning_objectives");
  const watchedResources = form.watch("resources_links") || [];

  const addLearningObjective = () => {
    const current = form.getValues("learning_objectives");
    form.setValue("learning_objectives", [...current, ""]);
  };

  const removeLearningObjective = (index: number) => {
    const current = form.getValues("learning_objectives");
    if (current.length > 1) {
      form.setValue("learning_objectives", current.filter((_, i) => i !== index));
    }
  };

  const addResource = () => {
    const current = form.getValues("resources_links") || [];
    form.setValue("resources_links", [...current, ""]);
  };

  const removeResource = (index: number) => {
    const current = form.getValues("resources_links") || [];
    form.setValue("resources_links", current.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: JournalFormData) => {
    try {
      // Filter out empty resource links
      const cleanData = {
        ...data,
        resources_links: data.resources_links?.filter(link => link.trim() !== "")
      };
      
      await submitJournal.mutateAsync(cleanData);
      form.reset({
        assignment_id: activeAssignment?.id || "",
        week_of: getWeekStart(new Date()).toISOString().split('T')[0],
        reflection_content: "",
        learning_objectives: [""],
        resources_links: []
      });
    } catch (error) {
      console.error('Failed to submit journal:', error);
    }
  };

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
          <h1 className="text-3xl font-bold tracking-tight">Weekly Journal</h1>
          <p className="text-muted-foreground">Reflect on your learning and document your progress</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Journal Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Weekly Reflection
              </CardTitle>
              <CardDescription>
                Document your learning experiences and growth
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Week Selection */}
                  <FormField
                    control={form.control}
                    name="week_of"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Week Starting</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Reflection Content */}
                  <FormField
                    control={form.control}
                    name="reflection_content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weekly Reflection</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Reflect on your week at the practicum site. What did you learn? What challenges did you face? How did you grow professionally?"
                            className="min-h-[200px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Learning Objectives */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <FormLabel>Learning Objectives Met</FormLabel>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addLearningObjective}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Objective
                      </Button>
                    </div>
                    
                    {watchedObjectives.map((_, index) => (
                      <FormField
                        key={index}
                        control={form.control}
                        name={`learning_objectives.${index}`}
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex gap-2">
                              <FormControl>
                                <Input
                                  placeholder={`Learning objective ${index + 1}`}
                                  {...field}
                                />
                              </FormControl>
                              {watchedObjectives.length > 1 && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removeLearningObjective(index)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>

                  {/* Resources & Links */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <FormLabel>Helpful Resources & Links (Optional)</FormLabel>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addResource}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Resource
                      </Button>
                    </div>
                    
                    {watchedResources.map((_, index) => (
                      <FormField
                        key={index}
                        control={form.control}
                        name={`resources_links.${index}`}
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex gap-2">
                              <FormControl>
                                <Input
                                  placeholder="https://example.com"
                                  type="url"
                                  {...field}
                                />
                              </FormControl>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removeResource(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={submitJournal.isPending}
                  >
                    {submitJournal.isPending ? (
                      "Submitting..."
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Submit Journal
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Guidelines & Tips */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Reflection Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">What to Include:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Key learning experiences</li>
                  <li>• Challenges faced and how you overcame them</li>
                  <li>• Skills practiced and developed</li>
                  <li>• Patient interactions and outcomes</li>
                  <li>• Professional growth observations</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Reflection Questions:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• What was the most significant learning moment?</li>
                  <li>• How did you apply classroom knowledge?</li>
                  <li>• What would you do differently?</li>
                  <li>• How did you contribute to patient care?</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Learning Objectives</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Document the specific learning objectives you achieved this week. These should align with your program's competency requirements.
                </p>
                <div className="space-y-1 text-sm">
                  <p className="font-medium">Examples:</p>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• Demonstrated safe medication administration</li>
                    <li>• Completed comprehensive patient assessment</li>
                    <li>• Practiced therapeutic communication skills</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Share any helpful resources you discovered this week - research articles, educational videos, clinical guidelines, or tools that enhanced your learning.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}