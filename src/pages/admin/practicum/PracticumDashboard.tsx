import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { 
  Users, 
  Activity,
  Target,
  AlertTriangle,
  TrendingUp,
  Download,
  Send,
  Settings,
  FileText,
  Plus,
  Zap
} from 'lucide-react';
import { usePracticumOverview } from '@/hooks/usePracticum';
import { useAuth } from '@/contexts/AuthContext';
import { GlassCard } from '@/components/modern/GlassCard';
import { supabase } from '@/integrations/supabase/client';
import { PROGRAM_INTAKE_DATES } from '@/constants/intakeDates';
import { BatchFilters } from '@/components/admin/practicum/BatchFilters';
import { BatchTable } from '@/components/admin/practicum/BatchTable';
import { BatchDetailsModal } from '@/components/admin/practicum/BatchDetailsModal';

// Types for batch management
interface BatchData {
  id: string;
  program: string;
  intakeDate: string;
  studentCount: number;
  capacity: number;
  status: 'about-to-start' | 'active' | 'about-to-end' | 'unscheduled' | 'missing-docs' | 'missing-attendance' | 'completed';
  completionRate?: number;
  attendanceRate?: number;
  documentComplianceRate?: number;
  site?: string;
  startDate?: string;
  endDate?: string;
  urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
  students: Array<{
    id: string;
    name: string;
    progress: number;
    missingItems?: string[];
    lastActivity?: string;
  }>;
}

// Generate realistic batch data based on intake dates
const generateBatchData = (): BatchData[] => {
  const programs = Object.keys(PROGRAM_INTAKE_DATES);
  const batches: BatchData[] = [];
  const now = new Date();
  
  // First, add some guaranteed active practicum batches
  const activePracticumBatches: BatchData[] = [
    {
      id: 'active-hca-1',
      program: 'Health Care Assistant',
      intakeDate: new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days ago
      studentCount: 24,
      capacity: 30,
      status: 'active',
      urgencyLevel: 'medium',
      completionRate: 67,
      attendanceRate: 94,
      documentComplianceRate: 89,
      site: 'General Hospital',
      startDate: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(now.getTime() + 75 * 24 * 60 * 60 * 1000).toISOString(),
      students: Array.from({ length: 24 }, (_, i) => ({
        id: `active-hca-1-student-${i}`,
        name: `HCA Student ${i + 1}`,
        progress: Math.floor(50 + Math.random() * 40), // 50-90% progress
        lastActivity: new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000).toISOString()
      }))
    },
    {
      id: 'active-ece-1',
      program: 'ECE',
      intakeDate: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
      studentCount: 18,
      capacity: 20,
      status: 'active',
      urgencyLevel: 'medium',
      completionRate: 78,
      attendanceRate: 96,
      documentComplianceRate: 92,
      site: 'Children Development Center',
      startDate: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      students: Array.from({ length: 18 }, (_, i) => ({
        id: `active-ece-1-student-${i}`,
        name: `ECE Student ${i + 1}`,
        progress: Math.floor(60 + Math.random() * 35), // 60-95% progress
        lastActivity: new Date(Date.now() - Math.random() * 2 * 24 * 60 * 60 * 1000).toISOString()
      }))
    },
    {
      id: 'missing-attendance-av-1',
      program: 'Aviation',
      intakeDate: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days ago
      studentCount: 35,
      capacity: 40,
      status: 'missing-attendance',
      urgencyLevel: 'high',
      completionRate: 45,
      attendanceRate: 78, // Lower attendance rate
      documentComplianceRate: 85,
      site: 'Regional Airport Training Center',
      startDate: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      students: Array.from({ length: 35 }, (_, i) => ({
        id: `missing-attendance-av-1-student-${i}`,
        name: `Aviation Student ${i + 1}`,
        progress: Math.floor(30 + Math.random() * 50), // 30-80% progress (more variation)
        missingItems: Math.random() > 0.6 ? ['Attendance Log', 'Flight Hours'] : undefined,
        lastActivity: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
      }))
    },
    {
      id: 'active-hosp-1',
      program: 'Hospitality',
      intakeDate: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000).toISOString(), // 25 days ago
      studentCount: 28,
      capacity: 35,
      status: 'active',
      urgencyLevel: 'medium',
      completionRate: 85,
      attendanceRate: 98,
      documentComplianceRate: 95,
      site: 'Grand Hotel & Resort',
      startDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(now.getTime() + 95 * 24 * 60 * 60 * 1000).toISOString(),
      students: Array.from({ length: 28 }, (_, i) => ({
        id: `active-hosp-1-student-${i}`,
        name: `Hospitality Student ${i + 1}`,
        progress: Math.floor(70 + Math.random() * 25), // 70-95% progress
        lastActivity: new Date(Date.now() - Math.random() * 1 * 24 * 60 * 60 * 1000).toISOString()
      }))
    }
  ];
  
  batches.push(...activePracticumBatches);
  
  // Then add the original logic for other batches
  programs.forEach(program => {
    const intakeDates = PROGRAM_INTAKE_DATES[program as keyof typeof PROGRAM_INTAKE_DATES];
    
    intakeDates.forEach(intake => {
      const intakeDate = new Date(intake.date);
      const daysDiff = Math.floor((intakeDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      // Skip if we already have active batches for this program
      if ((program === 'Health Care Assistant' || program === 'ECE' || program === 'Aviation' || program === 'Hospitality') && 
          (daysDiff < -14 && daysDiff > -120)) {
        return; // Skip to avoid duplicates with our manual active batches
      }
      
      // Determine batch status based on timeline
      let status: BatchData['status'] = 'unscheduled';
      let urgencyLevel: BatchData['urgencyLevel'] = 'low';
      
      if (daysDiff < -120) { // Completed
        status = 'completed';
      } else if (daysDiff < -14) { // Active practicum
        status = Math.random() > 0.7 ? 'missing-attendance' : 'active';
        urgencyLevel = status === 'missing-attendance' ? 'high' : 'medium';
      } else if (daysDiff < 14) { // About to end
        status = 'about-to-end';
        urgencyLevel = 'high';
      } else if (daysDiff < 60) { // About to start
        status = Math.random() > 0.8 ? 'missing-docs' : 'about-to-start';
        urgencyLevel = status === 'missing-docs' ? 'critical' : 'medium';
      }
      
      // Generate students for this batch
      const studentCount = Math.min(intake.enrolled, intake.capacity);
      const students = Array.from({ length: studentCount }, (_, i) => ({
        id: `${intake.id}-student-${i}`,
        name: `Student ${i + 1}`,
        progress: Math.floor(Math.random() * 100),
        missingItems: status === 'missing-docs' ? ['Health Certificate', 'Background Check'] : undefined,
        lastActivity: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
      }));
      
      if (studentCount > 0) {
        batches.push({
          id: intake.id,
          program,
          intakeDate: intake.date,
          studentCount,
          capacity: intake.capacity,
          status,
          urgencyLevel,
          completionRate: Math.floor(Math.random() * 100),
          attendanceRate: Math.floor(80 + Math.random() * 20),
          documentComplianceRate: Math.floor(70 + Math.random() * 30),
          site: `Site ${Math.floor(Math.random() * 5) + 1}`,
          startDate: new Date(intakeDate.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date(intakeDate.getTime() + 150 * 24 * 60 * 60 * 1000).toISOString(),
          students
        });
      }
    });
  });
  
  return batches.sort((a, b) => new Date(a.intakeDate).getTime() - new Date(b.intakeDate).getTime());
};

export function PracticumDashboard() {
  const { session } = useAuth();
  const { data: overview, isLoading, refetch } = usePracticumOverview(session?.user?.id || '');
  const [isSeeding, setIsSeeding] = useState(false);
  const [batchData] = useState(() => generateBatchData());
  const [selectedBatches, setSelectedBatches] = useState<Set<string>>(new Set());
  const [selectedBatch, setSelectedBatch] = useState<BatchData | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    program: '',
    urgency: '',
    dateRange: { from: undefined as Date | undefined, to: undefined as Date | undefined }
  });
  
  // Filtered and sorted batches
  const filteredBatches = useMemo(() => {
    let result = [...batchData];
    
    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(batch => 
        batch.program.toLowerCase().includes(searchLower) ||
        batch.site?.toLowerCase().includes(searchLower) ||
        batch.students.some(student => student.name.toLowerCase().includes(searchLower))
      );
    }
    
    // Apply status filter
    if (filters.status) {
      result = result.filter(batch => batch.status === filters.status);
    }
    
    // Apply program filter
    if (filters.program) {
      result = result.filter(batch => batch.program === filters.program);
    }
    
    // Apply urgency filter
    if (filters.urgency) {
      result = result.filter(batch => batch.urgencyLevel === filters.urgency);
    }
    
    // Apply date range filter
    if (filters.dateRange.from || filters.dateRange.to) {
      result = result.filter(batch => {
        const batchDate = new Date(batch.intakeDate);
        if (filters.dateRange.from && batchDate < filters.dateRange.from) return false;
        if (filters.dateRange.to && batchDate > filters.dateRange.to) return false;
        return true;
      });
    }
    
    // Sort by urgency and then by date
    result.sort((a, b) => {
      const urgencyOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      if (urgencyOrder[a.urgencyLevel] !== urgencyOrder[b.urgencyLevel]) {
        return urgencyOrder[a.urgencyLevel] - urgencyOrder[b.urgencyLevel];
      }
      return new Date(a.intakeDate).getTime() - new Date(b.intakeDate).getTime();
    });
    
    return result;
  }, [batchData, filters]);
  
  // Priority batches for alert section
  const priorityBatches = useMemo(() => {
    return batchData
      .filter(batch => 
        batch.urgencyLevel === 'critical' || 
        batch.status === 'missing-docs' || 
        batch.status === 'missing-attendance'
      )
      .slice(0, 5);
  }, [batchData]);
  
  const programs = useMemo(() => {
    return Array.from(new Set(batchData.map(batch => batch.program))).sort();
  }, [batchData]);
  
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.status) count++;
    if (filters.program) count++;
    if (filters.urgency) count++;
    if (filters.dateRange.from || filters.dateRange.to) count++;
    return count;
  }, [filters]);
  
  const handleSelectBatch = (batchId: string, selected: boolean) => {
    const newSelected = new Set(selectedBatches);
    if (selected) {
      newSelected.add(batchId);
    } else {
      newSelected.delete(batchId);
    }
    setSelectedBatches(newSelected);
  };
  
  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedBatches(new Set(filteredBatches.map(batch => batch.id)));
    } else {
      setSelectedBatches(new Set());
    }
  };
  
  const handleBatchClick = (batch: BatchData) => {
    setSelectedBatch(batch);
    setIsDetailsModalOpen(true);
  };
  
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

      await refetch();
      toast.success('Sample practicum data added successfully!');
    } catch (error) {
      console.error('Error adding sample data:', error);
      toast.error('Failed to add sample data. Please try again.');
    } finally {
      setIsSeeding(false);
    }
  };
  
  // Calculate KPIs
  const totalStudents = batchData.reduce((sum, batch) => sum + batch.studentCount, 0);
  const activePracticums = batchData.filter(b => b.status === 'active' || b.status === 'missing-attendance').length;
  const averageCompletion = Math.round(
    batchData.reduce((sum, batch) => sum + (batch.completionRate || 0), 0) / batchData.length
  );
  const criticalIssues = batchData.filter(b => b.urgencyLevel === 'critical').length;

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

  const kpiStats = [
    {
      title: "Total Students",
      count: totalStudents,
      icon: <Users className="h-5 w-5" />,
      gradient: "from-blue-500 to-indigo-600",
      description: "Students across all batches",
      trend: "+12%"
    },
    {
      title: "Active Practicums", 
      count: activePracticums,
      icon: <Activity className="h-5 w-5" />,
      gradient: "from-green-500 to-emerald-600",
      description: "Currently in practicum",
      trend: "+8%"
    },
    {
      title: "Avg Completion",
      count: `${averageCompletion}%`,
      icon: <Target className="h-5 w-5" />,
      gradient: "from-purple-500 to-violet-600",
      description: "Average completion rate",
      trend: "+5%"
    },
    {
      title: "Critical Issues",
      count: criticalIssues,
      icon: <AlertTriangle className="h-5 w-5" />,
      gradient: "from-red-500 to-rose-600",
      description: "Requiring immediate attention",
      trend: "-15%"
    }
  ];

  const handleBulkAction = (action: string) => {
    const selectedCount = selectedBatches.size;
    if (selectedCount === 0) {
      toast.error('Please select at least one batch');
      return;
    }
    
    switch (action) {
      case 'email':
        toast.success(`Sending email to ${selectedCount} batch(es)`);
        break;
      case 'export':
        toast.success(`Exporting data for ${selectedCount} batch(es)`);
        break;
      case 'archive':
        toast.success(`Archiving ${selectedCount} batch(es)`);
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="space-y-6 animate-fade-in p-6 max-w-[1600px] mx-auto">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Practicum Batch Management
            </h1>
            <p className="text-lg text-muted-foreground">Monitor and manage student batches across all practicum stages</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/admin/practicum/scheduling'}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0"
            >
              <Zap className="h-4 w-4 mr-2" />
              Smart Scheduling
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleBulkAction('export')}
              disabled={selectedBatches.size === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Export ({selectedBatches.size})
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleBulkAction('email')}
              disabled={selectedBatches.size === 0}
            >
              <Send className="h-4 w-4 mr-2" />
              Email Selected
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Batch
            </Button>
          </div>
        </div>

        {/* Priority Alerts Section */}
        {priorityBatches.length > 0 && (
          <Card className="border-amber-200 bg-amber-50/50">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-amber-600" />
                <CardTitle className="text-amber-800">Priority Actions Required</CardTitle>
              </div>
              <CardDescription className="text-amber-700">
                {priorityBatches.length} batch(es) require immediate attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {priorityBatches.map((batch) => (
                  <div
                    key={batch.id}
                    className="flex-shrink-0 p-3 bg-white border border-amber-200 rounded-lg cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleBatchClick(batch)}
                  >
                    <div className="font-medium text-sm">{batch.program}</div>
                    <div className="text-xs text-muted-foreground">{batch.site}</div>
                    <Badge 
                      variant={batch.urgencyLevel === 'critical' ? 'destructive' : 'secondary'} 
                      className="mt-1 text-xs"
                    >
                      {batch.status.replace('-', ' ')}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* KPI Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiStats.map((stat, index) => (
            <GlassCard key={index} className="group hover:scale-105 transition-all duration-300 border-0 shadow-lg">
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} text-white shadow-lg group-hover:scale-110 transition-transform`}>
                    {stat.icon}
                  </div>
                  <div className="flex items-center gap-1 text-xs font-medium">
                    <TrendingUp className="h-3 w-3 text-emerald-500" />
                    <span className="text-emerald-600">{stat.trend}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    {stat.count}
                  </h3>
                  <p className="text-lg font-semibold text-foreground/90">{stat.title}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{stat.description}</p>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Filters */}
        <BatchFilters
          filters={filters}
          onFiltersChange={setFilters}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          programs={programs}
          activeFilterCount={activeFilterCount}
        />

        {/* Results Summary */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div>
            Showing {filteredBatches.length} of {batchData.length} batches
            {selectedBatches.size > 0 && (
              <span className="ml-2 text-primary font-medium">
                • {selectedBatches.size} selected
              </span>
            )}
          </div>
          {activeFilterCount > 0 && (
            <div>
              {activeFilterCount} filter(s) applied
            </div>
          )}
        </div>

        {/* Batch Table */}
        <BatchTable
          batches={filteredBatches}
          selectedBatches={selectedBatches}
          onSelectBatch={handleSelectBatch}
          onSelectAll={handleSelectAll}
          onBatchClick={handleBatchClick}
        />

        {/* Batch Details Modal */}
        <BatchDetailsModal
          batch={selectedBatch}
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setSelectedBatch(null);
          }}
        />
      </div>
    </div>
  );
}