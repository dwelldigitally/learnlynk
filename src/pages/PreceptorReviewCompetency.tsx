import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { 
  ArrowLeft, 
  Award, 
  User,
  CheckCircle,
  XCircle,
  Star,
  Target,
  ClipboardCheck,
  MessageSquare
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const PreceptorReviewCompetency = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [rating, setRating] = useState("");
  const [feedback, setFeedback] = useState("");
  const [decision, setDecision] = useState<"approve" | "reject" | null>(null);

  const competencyRecord = {
    id: 2,
    student: {
      name: "Michael Torres",
      id: "MT-2024-002",
      program: "Nursing - RN Program",
      avatar: "/placeholder-avatar.jpg"
    },
    competency: {
      title: "IV Insertion Technique",
      category: "Clinical Skills",
      description: "Demonstrate proper sterile technique for peripheral IV insertion including site selection, preparation, insertion, and securing of IV catheter",
      requiredLevel: "Competent",
      attemptNumber: 2,
      maxAttempts: 3
    },
    submission: {
      date: "March 15, 2024",
      time: "2:30 PM",
      location: "Emergency Department",
      details: "Successfully inserted 18G IV catheter in left antecubital vein on first attempt. Maintained sterile technique throughout procedure. Patient tolerated well with no complications.",
      selfAssessment: "Competent",
      confidenceLevel: "High"
    },
    criteria: [
      { item: "Proper hand hygiene and PPE use", required: true },
      { item: "Correct site selection and assessment", required: true },
      { item: "Sterile technique maintained", required: true },
      { item: "Proper catheter insertion technique", required: true },
      { item: "Appropriate securing and documentation", required: true },
      { item: "Patient comfort and communication", required: false }
    ]
  };

  const ratingOptions = [
    { value: "needs-improvement", label: "Needs Improvement", color: "text-red-600", description: "Requires additional practice and supervision" },
    { value: "developing", label: "Developing", color: "text-yellow-600", description: "Making progress but not yet competent" },
    { value: "competent", label: "Competent", color: "text-green-600", description: "Meets expected standards" },
    { value: "proficient", label: "Proficient", color: "text-blue-600", description: "Exceeds expected standards" }
  ];

  const handleApprove = () => {
    if (!rating) {
      toast.error("Please select a competency rating");
      return;
    }
    setDecision("approve");
    toast.success(`Competency approved with ${rating} rating`);
    setTimeout(() => navigate("/preceptor/dashboard"), 1500);
  };

  const handleReject = () => {
    if (!feedback.trim()) {
      toast.error("Please provide detailed feedback before rejecting");
      return;
    }
    setDecision("reject");
    toast.error("Competency rejected - student will need to resubmit");
    setTimeout(() => navigate("/preceptor/dashboard"), 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      {/* Header */}
      <div className="border-b bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/preceptor/dashboard")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-primary to-primary/80 rounded-full p-2">
                <Award className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Review Competency</h1>
                <p className="text-sm text-muted-foreground">Evaluate student skill demonstration</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Student Info */}
        <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-full p-3">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">{competencyRecord.student.name}</h2>
              <p className="text-muted-foreground">ID: {competencyRecord.student.id}</p>
              <p className="text-sm text-muted-foreground">{competencyRecord.student.program}</p>
            </div>
            <div className="ml-auto">
              <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                Attempt {competencyRecord.competency.attemptNumber} of {competencyRecord.competency.maxAttempts}
              </Badge>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Competency Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Competency Info */}
            <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50">
              <div className="flex items-center gap-3 mb-4">
                <Target className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Competency Details</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-lg">{competencyRecord.competency.title}</h4>
                  <Badge variant="secondary" className="mt-1">{competencyRecord.competency.category}</Badge>
                </div>
                
                <div className="bg-background/50 p-4 rounded-lg">
                  <p className="text-sm">{competencyRecord.competency.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg">
                    <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Required Level</p>
                    <p className="text-blue-600 dark:text-blue-400">{competencyRecord.competency.requiredLevel}</p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded-lg">
                    <p className="text-sm font-medium text-green-800 dark:text-green-200">Student Self-Assessment</p>
                    <p className="text-green-600 dark:text-green-400">{competencyRecord.submission.selfAssessment}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Submission Details */}
            <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50">
              <h3 className="text-lg font-semibold mb-4">Submission Details</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="space-y-3">
                  <div className="bg-background/50 p-3 rounded-lg">
                    <p className="text-sm font-medium">Date & Time</p>
                    <p className="text-sm text-muted-foreground">{competencyRecord.submission.date} at {competencyRecord.submission.time}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="bg-background/50 p-3 rounded-lg">
                    <p className="text-sm font-medium">Location</p>
                    <p className="text-sm text-muted-foreground">{competencyRecord.submission.location}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-background/50 p-4 rounded-lg">
                <p className="text-sm font-medium mb-2">Student Description</p>
                <p className="text-sm">{competencyRecord.submission.details}</p>
              </div>
            </Card>

            {/* Competency Criteria */}
            <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <ClipboardCheck className="h-5 w-5" />
                Evaluation Criteria
              </h3>
              
              <div className="space-y-3">
                {competencyRecord.criteria.map((criterion, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm flex-1">{criterion.item}</span>
                    {criterion.required && (
                      <Badge variant="secondary" className="text-xs">Required</Badge>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Review Actions */}
          <div className="space-y-6">
            {/* Rating */}
            <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Star className="h-5 w-5" />
                Competency Rating
              </h3>
              
              <RadioGroup value={rating} onValueChange={setRating} className="space-y-3">
                {ratingOptions.map((option) => (
                  <div key={option.value} className="border rounded-lg p-3 hover:bg-background/50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value={option.value} id={option.value} />
                      <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                        <div>
                          <p className={`font-medium ${option.color}`}>{option.label}</p>
                          <p className="text-xs text-muted-foreground">{option.description}</p>
                        </div>
                      </Label>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </Card>

            {/* Feedback */}
            <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Preceptor Feedback
              </h3>
              <Textarea
                placeholder="Provide specific feedback about the student's performance, areas for improvement, or commendations..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="min-h-[120px]"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Detailed feedback helps students understand their progress and areas for growth.
              </p>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                onClick={handleApprove}
                disabled={decision !== null}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {decision === "approve" ? "Approved!" : "Approve Competency"}
              </Button>
              
              <Button 
                variant="destructive" 
                className="w-full"
                onClick={handleReject}
                disabled={decision !== null}
              >
                <XCircle className="h-4 w-4 mr-2" />
                {decision === "reject" ? "Rejected!" : "Reject & Request Resubmission"}
              </Button>
            </div>

            {decision && (
              <div className="text-center p-4 bg-background/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Student will be notified with feedback
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreceptorReviewCompetency;