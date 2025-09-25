import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, ClipboardCheck, Plus, X, Send, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStudentAssignments, useSubmitSelfEvaluation } from "@/hooks/useStudentPracticum";

const ratingOptions = [
  { value: "needs_improvement", label: "Needs Improvement", description: "Below expectations, requires significant development" },
  { value: "making_progress", label: "Making Progress", description: "Approaching expectations, showing improvement" },
  { value: "satisfactory", label: "Satisfactory", description: "Meets expectations consistently" },
  { value: "competent", label: "Competent", description: "Exceeds expectations, demonstrates mastery" }
] as const;

// Demo competencies for evaluation
const EVALUATION_COMPETENCIES = [
  {
    id: "eval-1",
    name: "Clinical Reasoning",
    description: "Demonstrates critical thinking in patient care decisions"
  },
  {
    id: "eval-2", 
    name: "Technical Skills",
    description: "Performs clinical procedures safely and accurately"
  },
  {
    id: "eval-3",
    name: "Professional Communication",
    description: "Communicates effectively with patients, families, and team members"
  },
  {
    id: "eval-4",
    name: "Safety & Quality",
    description: "Maintains patient safety and follows quality standards"
  },
  {
    id: "eval-5",
    name: "Professional Behavior",
    description: "Demonstrates accountability, reliability, and ethical practice"
  }
];

const evaluationSchema = z.object({
  assignment_id: z.string().min(1, "Assignment is required"),
  evaluation_type: z.enum(["midterm", "final"]),
  competency_ratings: z.record(z.object({
    self_rating: z.enum(["needs_improvement", "making_progress", "satisfactory", "competent"]),
    comments: z.string().min(1, "Comments are required for each competency")
  })),
  overall_reflection: z.string().min(100, "Overall reflection must be at least 100 characters"),
  learning_goals: z.array(z.string().min(1, "Learning goal cannot be empty")).min(1, "At least one learning goal is required")
});

type EvaluationFormData = z.infer<typeof evaluationSchema>;

export default function SelfEvaluation() {
  const { data: assignments } = useStudentAssignments();
  const activeAssignment = assignments?.[0];
  const submitEvaluation = useSubmitSelfEvaluation();

  const form = useForm<EvaluationFormData>({
    resolver: zodResolver(evaluationSchema),
    defaultValues: {
      assignment_id: activeAssignment?.id || "",
      evaluation_type: "midterm",
      competency_ratings: {},
      overall_reflection: "",
      learning_goals: [""]
    }
  });

  React.useEffect(() => {
    if (activeAssignment?.id) {
      form.setValue("assignment_id", activeAssignment.id);
    }
  }, [activeAssignment, form]);

  const watchedGoals = form.watch("learning_goals");
  const watchedRatings = form.watch("competency_ratings");

  const addLearningGoal = () => {
    const current = form.getValues("learning_goals");
    form.setValue("learning_goals", [...current, ""]);
  };

  const removeLearningGoal = (index: number) => {
    const current = form.getValues("learning_goals");
    if (current.length > 1) {
      form.setValue("learning_goals", current.filter((_, i) => i !== index));
    }
  };

  const onSubmit = async (data: EvaluationFormData) => {
    try {
      await submitEvaluation.mutateAsync(data);
      form.reset({
        assignment_id: activeAssignment?.id || "",
        evaluation_type: "midterm",
        competency_ratings: {},
        overall_reflection: "",
        learning_goals: [""]
      });
    } catch (error) {
      console.error('Failed to submit evaluation:', error);
    }
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case "needs_improvement": return "text-red-600";
      case "making_progress": return "text-orange-600";
      case "satisfactory": return "text-blue-600";
      case "competent": return "text-green-600";
      default: return "text-gray-500";
    }
  };

  const getRatingStars = (rating: string) => {
    const starCount = ratingOptions.findIndex(opt => opt.value === rating) + 1;
    return Array.from({ length: 4 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < starCount ? 'fill-current text-yellow-400' : 'text-gray-300'}`}
      />
    ));
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
          <h1 className="text-3xl font-bold tracking-tight">Self-Evaluation</h1>
          <p className="text-muted-foreground">Complete your midterm or final practicum evaluation</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Evaluation Form */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardCheck className="h-5 w-5" />
                Practicum Self-Evaluation
              </CardTitle>
              <CardDescription>
                Assess your performance and reflect on your learning journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  {/* Evaluation Type */}
                  <FormField
                    control={form.control}
                    name="evaluation_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Evaluation Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select evaluation type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="midterm">Midterm Evaluation</SelectItem>
                            <SelectItem value="final">Final Evaluation</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Competency Ratings */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Competency Self-Assessment</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Rate your performance in each competency area and provide specific comments.
                      </p>
                    </div>

                    {EVALUATION_COMPETENCIES.map((competency) => (
                      <Card key={competency.id} className="border-l-4 border-l-primary/20">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">{competency.name}</CardTitle>
                          <CardDescription>{competency.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {/* Rating Selection */}
                          <FormField
                            control={form.control}
                            name={`competency_ratings.${competency.id}.self_rating`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium">Self-Rating</FormLabel>
                                <FormControl>
                                  <RadioGroup
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    className="grid grid-cols-1 md:grid-cols-2 gap-3"
                                  >
                                    {ratingOptions.map((option) => (
                                      <div key={option.value} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50">
                                        <RadioGroupItem value={option.value} id={`${competency.id}-${option.value}`} />
                                        <div className="flex-1">
                                          <label
                                            htmlFor={`${competency.id}-${option.value}`}
                                            className={`text-sm font-medium cursor-pointer ${getRatingColor(option.value)}`}
                                          >
                                            {option.label}
                                          </label>
                                          <p className="text-xs text-muted-foreground">{option.description}</p>
                                          <div className="flex mt-1">
                                            {getRatingStars(option.value)}
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </RadioGroup>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* Comments */}
                          <FormField
                            control={form.control}
                            name={`competency_ratings.${competency.id}.comments`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium">
                                  Comments & Evidence
                                  {watchedRatings[competency.id]?.self_rating && (
                                    <span className={`ml-2 text-xs ${getRatingColor(watchedRatings[competency.id].self_rating)}`}>
                                      ({ratingOptions.find(opt => opt.value === watchedRatings[competency.id]?.self_rating)?.label})
                                    </span>
                                  )}
                                </FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Provide specific examples and evidence to support your self-rating..."
                                    className="min-h-[80px]"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Overall Reflection */}
                  <FormField
                    control={form.control}
                    name="overall_reflection"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Overall Reflection</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Reflect on your overall practicum experience. What are your key achievements, challenges overcome, and areas for continued growth?"
                            className="min-h-[150px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Learning Goals */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <FormLabel>Future Learning Goals</FormLabel>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addLearningGoal}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Goal
                      </Button>
                    </div>
                    
                    {watchedGoals.map((_, index) => (
                      <FormField
                        key={index}
                        control={form.control}
                        name={`learning_goals.${index}`}
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex gap-2">
                              <FormControl>
                                <Input
                                  placeholder={`Learning goal ${index + 1}`}
                                  {...field}
                                />
                              </FormControl>
                              {watchedGoals.length > 1 && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removeLearningGoal(index)}
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

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={submitEvaluation.isPending}
                  >
                    {submitEvaluation.isPending ? (
                      "Submitting..."
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Submit Self-Evaluation
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Guidelines */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Evaluation Guide</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">Rating Scale:</h4>
                <div className="space-y-2 text-sm">
                  {ratingOptions.map((option) => (
                    <div key={option.value} className="flex items-start gap-2">
                      <div className="flex mt-1">
                        {getRatingStars(option.value)}
                      </div>
                      <div>
                        <p className={`font-medium ${getRatingColor(option.value)}`}>
                          {option.label}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {option.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tips for Success</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Be honest and reflective in your self-assessment</li>
                <li>• Provide specific examples and evidence</li>
                <li>• Focus on both strengths and areas for growth</li>
                <li>• Set realistic and measurable learning goals</li>
                <li>• Review your practicum objectives before rating</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                After submission, your preceptor will complete their evaluation and provide feedback. You'll receive a notification when their assessment is ready for review.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}