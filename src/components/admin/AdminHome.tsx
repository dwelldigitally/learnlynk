import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  Search,
  Calendar,
  Users,
  MessageSquare,
  Plus,
  StickyNote,
  FileText,
  Activity,
  HelpCircle,
  ClipboardList,
  ChevronDown,
  CheckCircle2,
  Sparkles
} from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { useNavigate } from "react-router-dom";
import { QuickCommunicationModal } from "./QuickCommunicationModal";
import { QuickTaskModal } from "./QuickTaskModal";
import { QuickNoteModal } from "./QuickNoteModal";
import { QuickStudentLookupModal } from "./QuickStudentLookupModal";

const AdminHome: React.FC = () => {
  const { profile } = useProfile();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isQuickStartOpen, setIsQuickStartOpen] = useState(false);
  const [showCommunicationModal, setShowCommunicationModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showLookupModal, setShowLookupModal] = useState(false);

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const firstName = profile?.first_name || "there";

  const quickActions = [
    {
      title: "Daily Catch Up",
      description: "See what needs your attention today",
      icon: Calendar,
      color: "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20",
      onClick: () => navigate("/admin/overview")
    },
    {
      title: "Student Lookup",
      description: "Find and view student information",
      icon: Users,
      color: "bg-green-500/10 text-green-600 hover:bg-green-500/20",
      onClick: () => setShowLookupModal(true)
    },
    {
      title: "Send Message",
      description: "Communicate with students or staff",
      icon: MessageSquare,
      color: "bg-purple-500/10 text-purple-600 hover:bg-purple-500/20",
      onClick: () => setShowCommunicationModal(true)
    },
    {
      title: "Create Task",
      description: "Add a new task or reminder",
      icon: Plus,
      color: "bg-orange-500/10 text-orange-600 hover:bg-orange-500/20",
      onClick: () => setShowTaskModal(true)
    },
    {
      title: "Add Note",
      description: "Quick note about a student or event",
      icon: StickyNote,
      color: "bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20",
      onClick: () => setShowNoteModal(true)
    },
    {
      title: "Recent Activity",
      description: "View latest system activity",
      icon: Activity,
      color: "bg-pink-500/10 text-pink-600 hover:bg-pink-500/20",
      onClick: () => navigate("/admin/overview")
    },
    {
      title: "Help Center",
      description: "Get help and browse documentation",
      icon: HelpCircle,
      color: "bg-gray-500/10 text-gray-600 hover:bg-gray-500/20",
      onClick: () => navigate("/admin/help")
    },
    {
      title: "My Assignments",
      description: "Tasks assigned to you",
      icon: ClipboardList,
      color: "bg-teal-500/10 text-teal-600 hover:bg-teal-500/20",
      onClick: () => navigate("/admin/assignments")
    }
  ];

  const quickStartSteps = [
    { title: "Set up your profile", completed: true },
    { title: "Configure notification preferences", completed: true },
    { title: "Add team members", completed: false },
    { title: "Import student data", completed: false },
    { title: "Create your first program", completed: false }
  ];

  const completedSteps = quickStartSteps.filter(step => step.completed).length;
  const progressPercentage = (completedSteps / quickStartSteps.length) * 100;

  return (
    <div className="min-h-screen bg-background p-6 pt-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Greeting Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground tracking-tight">
            {getGreeting()}, {firstName}!
          </h1>
          <p className="text-xl text-muted-foreground">
            What would you like to work on today?
          </p>
        </div>

        {/* AI Search Bar */}
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Sparkles className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary" />
            <Input
              placeholder="How can I help you? Try 'Find students in Biology program' or 'Send reminder emails'"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-12 py-6 text-lg bg-card border-2 border-border hover:border-primary/50 focus:border-primary transition-colors"
            />
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Card 
                key={index}
                className="border-0 shadow-soft hover:shadow-lg transition-all duration-300 cursor-pointer group hover:scale-105"
                onClick={action.onClick}
              >
                <CardContent className="p-6 text-center space-y-4">
                  <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center transition-colors ${action.color}`}>
                    <Icon className="h-8 w-8" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {action.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Start Guide */}
        <Card className="border-0 shadow-soft">
          <Collapsible open={isQuickStartOpen} onOpenChange={setIsQuickStartOpen}>
            <CollapsibleTrigger asChild>
              <Button 
                variant="ghost" 
                className="w-full justify-between p-6 h-auto hover:bg-muted/50"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-lg">Quick Start Guide</h3>
                    <p className="text-sm text-muted-foreground">
                      {completedSteps} of {quickStartSteps.length} steps completed ({Math.round(progressPercentage)}%)
                    </p>
                  </div>
                </div>
                <ChevronDown className={`h-5 w-5 transition-transform ${isQuickStartOpen ? 'rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="px-6 pb-6 space-y-4">
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <div className="space-y-3">
                  {quickStartSteps.map((step, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        step.completed 
                          ? 'bg-primary text-white' 
                          : 'bg-muted border-2 border-border'
                      }`}>
                        {step.completed && <CheckCircle2 className="h-4 w-4" />}
                      </div>
                      <span className={`text-sm ${
                        step.completed 
                          ? 'text-muted-foreground line-through' 
                          : 'text-foreground'
                      }`}>
                        {step.title}
                      </span>
                      {step.completed && (
                        <Badge variant="secondary" className="text-xs">
                          Done
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      </div>
      
      {/* Modal Components */}
      <QuickCommunicationModal 
        open={showCommunicationModal} 
        onOpenChange={setShowCommunicationModal} 
      />
      <QuickTaskModal 
        open={showTaskModal} 
        onOpenChange={setShowTaskModal} 
      />
      <QuickNoteModal 
        open={showNoteModal} 
        onOpenChange={setShowNoteModal} 
      />
      <QuickStudentLookupModal 
        open={showLookupModal} 
        onOpenChange={setShowLookupModal} 
      />
    </div>
  );
};

export default AdminHome;