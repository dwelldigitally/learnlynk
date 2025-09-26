import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { 
  GraduationCap, 
  MapPin, 
  Clock, 
  FileText, 
  Users, 
  CheckCircle,
  AlertCircle,
  Calendar,
  BookOpen,
  Award,
  TrendingUp,
  Star,
  Target,
  Activity,
  ArrowRight,
  Eye
} from 'lucide-react';
import { usePracticumOverview } from '@/hooks/usePracticum';
import { useAuth } from '@/contexts/AuthContext';
import { GlassCard } from '@/components/modern/GlassCard';
import { NeoCard } from '@/components/modern/NeoCard';
import { supabase } from '@/integrations/supabase/client';

// Dummy data for demonstration
const dummyOverview = {
  ready_to_end: [
    {
      id: '1',
      leads: { first_name: 'Sarah', last_name: 'Johnson' },
      practicum_programs: { program_name: 'Nursing Practicum' },
      practicum_sites: { name: 'General Hospital' },
      end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      completion_percentage: 85,
      status: 'active'
    },
    {
      id: '2',
      leads: { first_name: 'Michael', last_name: 'Chen' },
      practicum_programs: { program_name: 'Clinical Psychology' },
      practicum_sites: { name: 'Mental Health Center' },
      end_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      completion_percentage: 92,
      status: 'active'
    }
  ],
  ready_to_begin: [
    {
      id: '3',
      leads: { first_name: 'Emma', last_name: 'Williams' },
      practicum_programs: { program_name: 'Physical Therapy' },
      practicum_sites: { name: 'Rehabilitation Center' },
      start_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'confirmed'
    },
    {
      id: '4',
      leads: { first_name: 'David', last_name: 'Rodriguez' },
      practicum_programs: { program_name: 'Occupational Therapy' },
      practicum_sites: { name: 'Children\'s Hospital' },
      start_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'pending'
    }
  ],
  missing_documents: [
    { id: '5', student_name: 'Alex Thompson', missing_docs: ['Health Certificate', 'Background Check'] },
    { id: '6', student_name: 'Lisa Martinez', missing_docs: ['Immunization Records'] }
  ],
  pending_approvals: [
    {
      id: '7',
      practicum_assignments: {
        leads: { first_name: 'James', last_name: 'Wilson' },
        practicum_sites: { name: 'University Clinic' }
      },
      competency_name: 'Patient Assessment',
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      final_status: 'pending'
    }
  ]
};

export function PracticumDashboard() {
  const { session } = useAuth();
  const { data: overview, isLoading, refetch } = usePracticumOverview(session?.user?.id || '');
  const [isSeeding, setIsSeeding] = useState(false);
  
  const handleAddDummyData = async () => {
    console.log('🚀 Add Sample Data clicked');
    console.log('User session:', session?.user?.id);
    
    if (!session?.user?.id) {
      console.error('❌ No user session found');
      toast.error('You must be logged in to add sample data');
      return;
    }

    setIsSeeding(true);
    console.log('💾 Starting database operations...');
    try {
      // Create practicum sites
      const sites = [
        {
          user_id: session.user.id,
          name: 'General Hospital',
          organization: 'City Medical Center',
          contact_person: 'Dr. Sarah Johnson',
          contact_email: 'sarah.johnson@generalhospital.com',
          contact_phone: '(555) 123-4567',
          address: '123 Medical Drive',
          city: 'Metro City',
          state: 'CA',
          country: 'USA',
          postal_code: '12345',
          max_capacity_per_semester: 8,
          specializations: ['Emergency Medicine', 'Internal Medicine', 'Surgery'],
          requirements: { documents: ['Medical clearance', 'Background check', 'Immunizations'] },
          is_active: true
        },
        {
          user_id: session.user.id,
          name: 'Mental Health Center',
          organization: 'Community Health Services',
          contact_person: 'Dr. Michael Chen',
          contact_email: 'michael.chen@mhcenter.org',
          contact_phone: '(555) 234-5678',
          address: '456 Wellness Ave',
          city: 'Metro City',
          state: 'CA',
          country: 'USA',
          postal_code: '12346',
          max_capacity_per_semester: 5,
          specializations: ['Clinical Psychology', 'Counseling', 'Psychiatric Care'],
          requirements: { documents: ['Psychology background', 'Certification', 'Training hours'] },
          is_active: true
        },
        {
          user_id: session.user.id,
          name: 'Rehabilitation Center',
          organization: 'Recovery Health Group',
          contact_person: 'Dr. Emma Williams',
          contact_email: 'emma.williams@rehabcenter.com',
          contact_phone: '(555) 345-6789',
          address: '789 Recovery Blvd',
          city: 'Metro City',
          state: 'CA',
          country: 'USA',
          postal_code: '12347',
          max_capacity_per_semester: 6,
          specializations: ['Physical Therapy', 'Occupational Therapy', 'Speech Therapy'],
          requirements: { documents: ['Therapy certification', 'Health clearance', 'CPR certification'] },
          is_active: true
        }
      ];

      console.log('📍 Inserting practicum sites...');
      const { data: siteData, error: siteError } = await supabase
        .from('practicum_sites')
        .insert(sites)
        .select();

      if (siteError) {
        console.error('❌ Site insertion error:', siteError);
        throw siteError;
      }
      console.log('✅ Sites inserted successfully:', siteData);

      // Create practicum programs
      const programs = [
        {
          user_id: session.user.id,
          program_name: 'Nursing Practicum',
          total_hours_required: 480,
          weeks_duration: 12,
          competencies_required: ['Patient care', 'Medication administration', 'Clinical documentation', 'Emergency procedures'],
          documents_required: ['Medical clearance', 'CPR certification', 'Nursing license verification'],
          evaluation_criteria: {
            clinical_skills: 40,
            communication: 20,
            professionalism: 20,
            documentation: 20
          },
          is_active: true
        },
        {
          user_id: session.user.id,
          program_name: 'Clinical Psychology',
          total_hours_required: 600,
          weeks_duration: 16,
          competencies_required: ['Assessment', 'Therapy techniques', 'Case management', 'Ethics application'],
          documents_required: ['Psychology degree verification', 'Ethics training certificate', 'Background check'],
          evaluation_criteria: {
            assessment_skills: 30,
            therapeutic_techniques: 30,
            ethics_application: 25,
            documentation: 15
          },
          is_active: true
        },
        {
          user_id: session.user.id,
          program_name: 'Physical Therapy',
          total_hours_required: 400,
          weeks_duration: 10,
          competencies_required: ['Exercise prescription', 'Manual therapy', 'Patient education', 'Treatment planning'],
          documents_required: ['PT coursework transcript', 'Health clearance', 'CPR certification'],
          evaluation_criteria: {
            hands_on_skills: 40,
            patient_interaction: 25,
            treatment_planning: 20,
            documentation: 15
          },
          is_active: true
        }
      ];

      console.log('📚 Inserting practicum programs...');
      const { data: programData, error: programError } = await supabase
        .from('practicum_programs')
        .insert(programs)
        .select();

      if (programError) {
        console.error('❌ Program insertion error:', programError);
        throw programError;
      }
      console.log('✅ Programs inserted successfully:', programData);

      // Create practicum journeys
      const journeys = [
        {
          user_id: session.user.id,
          journey_name: 'Standard Clinical Practicum',
          program_id: programData?.[0]?.id,
          steps: [
            {
              id: '1',
              name: 'Pre-placement Agreement',
              description: 'Sign placement agreement and orientation materials',
              type: 'agreement',
              required: true,
              approvers: ['instructor'],
              order_index: 1,
              configuration: { documents: ['placement_agreement', 'orientation_checklist'] }
            },
            {
              id: '2',
              name: 'Documentation Submission',
              description: 'Submit required health and background documents',
              type: 'document_upload',
              required: true,
              approvers: ['site_coordinator'],
              order_index: 2,
              configuration: { required_docs: ['health_clearance', 'background_check', 'immunizations'] }
            },
            {
              id: '3',
              name: 'Clinical Hours',
              description: 'Complete required clinical hours at placement site',
              type: 'attendance',
              required: true,
              approvers: ['preceptor'],
              order_index: 3,
              configuration: { min_hours: 480, tracking_method: 'daily_log' }
            },
            {
              id: '4',
              name: 'Competency Assessment',
              description: 'Demonstrate clinical competencies',
              type: 'competency',
              required: true,
              approvers: ['preceptor', 'instructor'],
              order_index: 4,
              configuration: { competencies: ['patient_care', 'documentation', 'communication'] }
            },
            {
              id: '5',
              name: 'Final Evaluation',
              description: 'Complete final performance evaluation',
              type: 'evaluation',
              required: true,
              approvers: ['instructor'],
              order_index: 5,
              configuration: { evaluation_type: 'comprehensive', scoring_method: 'rubric' }
            }
          ],
          is_default: true,
          is_active: true
        }
      ];

      console.log('🗺️ Inserting practicum journeys...');
      const { data: journeyInserted, error: journeyError } = await supabase
        .from('practicum_journeys')
        .insert(journeys)
        .select('id');

      if (journeyError) {
        console.error('❌ Journey insertion error:', journeyError);
        throw journeyError;
      }
      console.log('✅ Journeys inserted successfully', journeyInserted);

      // Create practicum assignments so the dashboard shows data
      console.log('🧩 Inserting practicum assignments...');
      const today = new Date();
      const formatDate = (d: Date) => d.toISOString().slice(0, 10);
      const assignments = [
        {
          user_id: session.user.id,
          program_id: programData?.[0]?.id,
          site_id: siteData?.[0]?.id,
          status: 'active',
          start_date: formatDate(new Date(today.getTime() - 60 * 24 * 60 * 60 * 1000)),
          end_date: formatDate(new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)),
          completion_percentage: 85
        },
        {
          user_id: session.user.id,
          program_id: programData?.[1]?.id,
          site_id: siteData?.[1]?.id,
          status: 'assigned',
          start_date: formatDate(new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000)),
          end_date: formatDate(new Date(today.getTime() + 120 * 24 * 60 * 60 * 1000)),
          completion_percentage: 0
        }
      ].filter((a) => a.program_id && a.site_id);

      if (assignments.length > 0) {
        const { error: assignError } = await supabase
          .from('practicum_assignments')
          .insert(assignments);
        if (assignError) {
          console.error('❌ Assignment insertion error:', assignError);
          throw assignError;
        }
        console.log('✅ Assignments inserted successfully');
      } else {
        console.warn('⚠️ Skipping assignments insert due to missing IDs');
      }

      // Refresh the data
      await refetch();
      await refetch();
      
      toast.success('Sample practicum data added successfully!');
    } catch (error) {
      console.error('Error adding sample data:', error);
      toast.error('Failed to add sample data. Please try again.');
    } finally {
      setIsSeeding(false);
    }
  };
  
  // Use dummy data if no real data is available
  const data = overview || dummyOverview;

  if (isLoading) {
    return (
      <div className="space-y-8 animate-fade-in p-6">
        <div className="h-8 bg-gradient-to-r from-muted to-muted/50 rounded-lg w-64 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-40 bg-gradient-to-br from-muted to-muted/50 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: "Ready to End",
      count: data?.ready_to_end?.length || 0,
      icon: <CheckCircle className="h-5 w-5" />,
      gradient: "from-emerald-500 to-green-600",
      bgGradient: "from-emerald-50 to-green-50",
      description: "Practicum placements ending soon",
      trend: "+12%",
      trendDirection: "up"
    },
    {
      title: "Ready to Begin", 
      count: data?.ready_to_begin?.length || 0,
      icon: <Calendar className="h-5 w-5" />,
      gradient: "from-blue-500 to-indigo-600",
      bgGradient: "from-blue-50 to-indigo-50",
      description: "Students starting practicum soon",
      trend: "+8%",
      trendDirection: "up"
    },
    {
      title: "Missing Documents",
      count: data?.missing_documents?.length || 0,
      icon: <FileText className="h-5 w-5" />,
      gradient: "from-amber-500 to-orange-600",
      bgGradient: "from-amber-50 to-orange-50",
      description: "Students with incomplete documentation",
      trend: "-5%",
      trendDirection: "down"
    },
    {
      title: "Pending Approvals",
      count: data?.pending_approvals?.length || 0,
      icon: <AlertCircle className="h-5 w-5" />,
      gradient: "from-red-500 to-rose-600",
      bgGradient: "from-red-50 to-rose-50",
      description: "Records awaiting review",
      trend: "-15%",
      trendDirection: "down"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="space-y-8 animate-fade-in p-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Practicum Management
            </h1>
            <p className="text-lg text-muted-foreground">Monitor student placements and progress with real-time insights</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              variant="outline" 
              className="neo-button group"
              onClick={handleAddDummyData}
              disabled={isSeeding}
            >
              <FileText className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform" />
              {isSeeding ? 'Adding Data...' : 'Add Sample Data'}
            </Button>
            <Button variant="outline" className="neo-button group">
              <FileText className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform" />
              Export Report
            </Button>
            <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg">
              <Users className="h-4 w-4 mr-2" />
              Assign Students
            </Button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <GlassCard key={index} className="group hover:scale-105 transition-all duration-300 border-0 shadow-lg">
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-50 rounded-lg`}></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} text-white shadow-lg group-hover:scale-110 transition-transform`}>
                    {stat.icon}
                  </div>
                  <div className="flex items-center gap-1 text-xs font-medium">
                    <TrendingUp className={`h-3 w-3 ${stat.trendDirection === 'up' ? 'text-emerald-500' : 'text-red-500'}`} />
                    <span className={stat.trendDirection === 'up' ? 'text-emerald-600' : 'text-red-600'}>
                      {stat.trend}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">{stat.title}</h3>
                  <div className="text-3xl font-bold text-foreground">{stat.count}</div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {stat.description}
                  </p>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Detailed Views */}
        <div className="bg-card/30 backdrop-blur-sm rounded-2xl p-6 border shadow-xl">
          <Tabs defaultValue="ready-to-end" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 h-12 bg-muted/50 rounded-xl p-1">
              <TabsTrigger value="ready-to-end" className="rounded-lg font-medium">Ready to End</TabsTrigger>
              <TabsTrigger value="ready-to-begin" className="rounded-lg font-medium">Ready to Begin</TabsTrigger>
              <TabsTrigger value="missing-docs" className="rounded-lg font-medium">Missing Documents</TabsTrigger>
              <TabsTrigger value="pending-approvals" className="rounded-lg font-medium">Pending Approvals</TabsTrigger>
            </TabsList>

            <TabsContent value="ready-to-end" className="space-y-6">
              <NeoCard className="border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 text-white">
                      <CheckCircle className="h-5 w-5" />
                    </div>
                    Students Ready to Complete Practicum
                  </CardTitle>
                  <CardDescription className="text-base">
                    Practicum placements ending within the next 2 weeks
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {data?.ready_to_end?.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center mx-auto mb-4">
                        <GraduationCap className="h-8 w-8 opacity-50" />
                      </div>
                      <p className="text-lg font-medium">No students ready to complete practicum</p>
                      <p className="text-sm mt-1">Check back later for updates</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {data?.ready_to_end?.map((assignment) => (
                        <div key={assignment.id} className="group p-6 border rounded-xl hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-background to-muted/30">
                          <div className="flex items-center justify-between">
                            <div className="space-y-3 flex-1">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center text-white font-medium text-sm">
                                  {assignment.leads?.first_name?.[0]}{assignment.leads?.last_name?.[0]}
                                </div>
                                <div>
                                  <p className="font-semibold text-lg">
                                    {assignment.leads?.first_name} {assignment.leads?.last_name}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {assignment.practicum_programs?.program_name}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-1 text-muted-foreground">
                                  <MapPin className="h-4 w-4" />
                                  {assignment.practicum_sites?.name}
                                </div>
                                <div className="flex items-center gap-1 text-muted-foreground">
                                  <Calendar className="h-4 w-4" />
                                  Ends: {new Date(assignment.end_date!).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-center">
                                <div className="text-2xl font-bold text-emerald-600">{assignment.completion_percentage}%</div>
                                <Progress value={assignment.completion_percentage || 0} className="w-20 mt-1" />
                              </div>
                              <Button size="sm" variant="outline" className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                <Eye className="h-4 w-4 mr-2" />
                                View Progress
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </NeoCard>
            </TabsContent>

            <TabsContent value="ready-to-begin" className="space-y-6">
              <NeoCard className="border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                      <Calendar className="h-5 w-5" />
                    </div>
                    Students Ready to Begin Practicum
                  </CardTitle>
                  <CardDescription className="text-base">
                    Students starting practicum within the next week
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {data?.ready_to_begin?.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center mx-auto mb-4">
                        <Calendar className="h-8 w-8 opacity-50" />
                      </div>
                      <p className="text-lg font-medium">No students starting practicum soon</p>
                      <p className="text-sm mt-1">All students are properly scheduled</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {data?.ready_to_begin?.map((assignment) => (
                        <div key={assignment.id} className="group p-6 border rounded-xl hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-background to-blue-50/30">
                          <div className="flex items-center justify-between">
                            <div className="space-y-3 flex-1">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-medium text-sm">
                                  {assignment.leads?.first_name?.[0]}{assignment.leads?.last_name?.[0]}
                                </div>
                                <div>
                                  <p className="font-semibold text-lg">
                                    {assignment.leads?.first_name} {assignment.leads?.last_name}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {assignment.practicum_programs?.program_name}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-1 text-muted-foreground">
                                  <MapPin className="h-4 w-4" />
                                  {assignment.practicum_sites?.name}
                                </div>
                                <div className="flex items-center gap-1 text-muted-foreground">
                                  <Clock className="h-4 w-4" />
                                  Starts: {new Date(assignment.start_date!).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge 
                                variant={assignment.status === 'confirmed' ? 'default' : 'secondary'}
                                className="capitalize"
                              >
                                {assignment.status}
                              </Badge>
                              <Button size="sm" className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
                                <ArrowRight className="h-4 w-4 mr-2" />
                                Send Reminder
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </NeoCard>
            </TabsContent>

            <TabsContent value="missing-docs" className="space-y-6">
              <NeoCard className="border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 text-white">
                      <FileText className="h-5 w-5" />
                    </div>
                    Students with Missing Documents
                  </CardTitle>
                  <CardDescription className="text-base">
                    Students who haven't submitted required documentation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {data?.missing_documents?.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-100 to-green-100 flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="h-8 w-8 text-emerald-500" />
                      </div>
                      <p className="text-lg font-medium">All documents are complete!</p>
                      <p className="text-sm mt-1">Every student has submitted their required documentation</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {data?.missing_documents?.map((student) => (
                        <div key={student.id} className="group p-6 border rounded-xl hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-background to-amber-50/30">
                          <div className="flex items-center justify-between">
                            <div className="space-y-3 flex-1">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-medium text-sm">
                                  <FileText className="h-5 w-5" />
                                </div>
                                <div>
                                  <p className="font-semibold text-lg">{student.student_name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    Missing {student.missing_docs.length} document{student.missing_docs.length > 1 ? 's' : ''}
                                  </p>
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {student.missing_docs.map((doc, index) => (
                                  <Badge key={index} variant="destructive" className="text-xs">
                                    {doc}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Button size="sm" variant="outline" className="group-hover:bg-amber-500 group-hover:text-white transition-colors">
                                <AlertCircle className="h-4 w-4 mr-2" />
                                Send Reminder
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </NeoCard>
            </TabsContent>

            <TabsContent value="pending-approvals" className="space-y-6">
              <NeoCard className="border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-red-500 to-rose-600 text-white">
                      <AlertCircle className="h-5 w-5" />
                    </div>
                    Records Pending Approval
                  </CardTitle>
                  <CardDescription className="text-base">
                    Student submissions awaiting instructor or admin review
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {data?.pending_approvals?.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-100 to-green-100 flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="h-8 w-8 text-emerald-500" />
                      </div>
                      <p className="text-lg font-medium">No pending approvals</p>
                      <p className="text-sm mt-1">All records are up to date and reviewed</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {data?.pending_approvals?.map((record) => (
                        <div key={record.id} className="group p-6 border rounded-xl hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-background to-red-50/30">
                          <div className="flex items-center justify-between">
                            <div className="space-y-3 flex-1">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-400 to-rose-500 flex items-center justify-center text-white font-medium text-sm">
                                  {record.practicum_assignments?.leads?.first_name?.[0]}{record.practicum_assignments?.leads?.last_name?.[0]}
                                </div>
                                <div>
                                  <p className="font-semibold text-lg">
                                    {record.practicum_assignments?.leads?.first_name} {record.practicum_assignments?.leads?.last_name}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {record.competency_name}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-1 text-muted-foreground">
                                  <MapPin className="h-4 w-4" />
                                  {record.practicum_assignments?.practicum_sites?.name}
                                </div>
                                <div className="flex items-center gap-1 text-muted-foreground">
                                  <Clock className="h-4 w-4" />
                                  Submitted: {new Date(record.created_at).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge 
                                variant={record.final_status === 'pending' ? 'destructive' : 'secondary'}
                                className="capitalize"
                              >
                                {record.final_status}
                              </Badge>
                              <Button size="sm" className="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700">
                                <Eye className="h-4 w-4 mr-2" />
                                Review
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </NeoCard>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}