import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Database, Users, BookOpen, Plus, Download, Zap } from 'lucide-react';

interface DataSetupScreenProps {
  data: any;
  onComplete: (data: any) => void;
  onNext: () => void;
  onSkip: () => void;
}

interface DataSetupData {
  dataChoice: 'sample' | 'manual' | 'fresh';
  leads?: Array<{
    name: string;
    email: string;
    phone: string;
    program: string;
    source: string;
  }>;
  students?: Array<{
    name: string;
    email: string;
    studentId: string;
    program: string;
    stage: string;
  }>;
  applications?: Array<{
    studentName: string;
    email: string;
    program: string;
    status: string;
  }>;
}

const DataSetupScreen: React.FC<DataSetupScreenProps> = ({
  data,
  onComplete,
  onNext,
  onSkip
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<DataSetupData>({
    dataChoice: data?.dataChoice || 'sample',
    leads: data?.leads || [{ name: '', email: '', phone: '', program: '', source: 'Website' }],
    students: data?.students || [{ name: '', email: '', studentId: '', program: '', stage: 'enrolled' }],
    applications: data?.applications || [{ studentName: '', email: '', program: '', status: 'submitted' }]
  });

  const handleDataChoiceChange = (choice: 'sample' | 'manual' | 'fresh') => {
    setFormData(prev => ({ ...prev, dataChoice: choice }));
  };

  const addLead = () => {
    setFormData(prev => ({
      ...prev,
      leads: [...(prev.leads || []), { name: '', email: '', phone: '', program: '', source: 'Website' }]
    }));
  };

  const addStudent = () => {
    setFormData(prev => ({
      ...prev,
      students: [...(prev.students || []), { name: '', email: '', studentId: '', program: '', stage: 'enrolled' }]
    }));
  };

  const addApplication = () => {
    setFormData(prev => ({
      ...prev,
      applications: [...(prev.applications || []), { studentName: '', email: '', program: '', status: 'submitted' }]
    }));
  };

  const updateLead = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      leads: prev.leads?.map((lead, i) => 
        i === index ? { ...lead, [field]: value } : lead
      )
    }));
  };

  const updateStudent = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      students: prev.students?.map((student, i) => 
        i === index ? { ...student, [field]: value } : student
      )
    }));
  };

  const updateApplication = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      applications: prev.applications?.map((app, i) => 
        i === index ? { ...app, [field]: value } : app
      )
    }));
  };

  const handleSave = () => {
    onComplete(formData);
    toast({
      title: "Data Setup Configured",
      description: `You chose to ${formData.dataChoice === 'sample' ? 'start with sample data' : formData.dataChoice === 'manual' ? 'add initial data manually' : 'start fresh'}.`,
    });
  };

  const isFormValid = () => {
    if (formData.dataChoice === 'manual') {
      const hasValidLead = formData.leads?.some(lead => lead.name && lead.email);
      const hasValidStudent = formData.students?.some(student => student.name && student.email);
      const hasValidApplication = formData.applications?.some(app => app.studentName && app.email);
      return hasValidLead || hasValidStudent || hasValidApplication;
    }
    return true;
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Database className="w-12 h-12 text-primary mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Set Up Your Initial Data</h3>
        <p className="text-muted-foreground">
          Choose how you'd like to start: with sample data to explore, manual entry, or a fresh start.
        </p>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Data Setup Options
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={formData.dataChoice}
            onValueChange={handleDataChoiceChange}
            className="space-y-4"
          >
            <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="sample" id="sample" className="mt-1" />
              <div className="flex-1">
                <Label htmlFor="sample" className="text-base font-medium cursor-pointer">
                  Start with Sample Data (Recommended)
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Pre-populate your system with realistic sample data including leads, routing rules, scoring criteria, and team setup. 
                  Perfect for exploring features and training your team.
                </p>
                <div className="grid grid-cols-2 gap-2 mt-2 text-xs text-muted-foreground">
                  <span>• 15+ Sample Leads</span>
                  <span>• 5 Routing Rules</span>
                  <span>• 8 Sample Students</span>
                  <span>• 6 Scoring Rules</span>
                  <span>• 6 Sample Applications</span>
                  <span>• 4 Advisor Teams</span>
                  <span>• Financial Records</span>
                  <span>• 4 Routing Templates</span>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="manual" id="manual" className="mt-1" />
              <div className="flex-1">
                <Label htmlFor="manual" className="text-base font-medium cursor-pointer">
                  Add Initial Data Manually
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Enter your first leads, students, or applications to get started with real data immediately.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="fresh" id="fresh" className="mt-1" />
              <div className="flex-1">
                <Label htmlFor="fresh" className="text-base font-medium cursor-pointer">
                  Start Fresh
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Begin with an empty system. You can import or add data later through the admin dashboard.
                </p>
              </div>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {formData.dataChoice === 'manual' && (
        <div className="space-y-6">
          {/* Leads Section */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Initial Leads
                </span>
                <Button onClick={addLead} size="sm" variant="outline">
                  <Plus className="w-4 h-4 mr-1" />
                  Add Lead
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.leads?.map((lead, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-lg">
                  <div>
                    <Label>Name</Label>
                    <Input
                      value={lead.name}
                      onChange={(e) => updateLead(index, 'name', e.target.value)}
                      placeholder="Full name"
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={lead.email}
                      onChange={(e) => updateLead(index, 'email', e.target.value)}
                      placeholder="email@example.com"
                    />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input
                      value={lead.phone}
                      onChange={(e) => updateLead(index, 'phone', e.target.value)}
                      placeholder="+1-555-0123"
                    />
                  </div>
                  <div>
                    <Label>Program Interest</Label>
                    <Input
                      value={lead.program}
                      onChange={(e) => updateLead(index, 'program', e.target.value)}
                      placeholder="Program name"
                    />
                  </div>
                  <div>
                    <Label>Source</Label>
                    <Select value={lead.source} onValueChange={(value) => updateLead(index, 'source', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Website">Website</SelectItem>
                        <SelectItem value="Social Media">Social Media</SelectItem>
                        <SelectItem value="Referral">Referral</SelectItem>
                        <SelectItem value="Advertisement">Advertisement</SelectItem>
                        <SelectItem value="Event">Event</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Students Section */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Current Students
                </span>
                <Button onClick={addStudent} size="sm" variant="outline">
                  <Plus className="w-4 h-4 mr-1" />
                  Add Student
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.students?.map((student, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-lg">
                  <div>
                    <Label>Name</Label>
                    <Input
                      value={student.name}
                      onChange={(e) => updateStudent(index, 'name', e.target.value)}
                      placeholder="Full name"
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={student.email}
                      onChange={(e) => updateStudent(index, 'email', e.target.value)}
                      placeholder="email@example.com"
                    />
                  </div>
                  <div>
                    <Label>Student ID</Label>
                    <Input
                      value={student.studentId}
                      onChange={(e) => updateStudent(index, 'studentId', e.target.value)}
                      placeholder="STU001"
                    />
                  </div>
                  <div>
                    <Label>Program</Label>
                    <Input
                      value={student.program}
                      onChange={(e) => updateStudent(index, 'program', e.target.value)}
                      placeholder="Program name"
                    />
                  </div>
                  <div>
                    <Label>Stage</Label>
                    <Select value={student.stage} onValueChange={(value) => updateStudent(index, 'stage', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="enrolled">Enrolled</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="graduated">Graduated</SelectItem>
                        <SelectItem value="on_leave">On Leave</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Applications Section */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Recent Applications
                </span>
                <Button onClick={addApplication} size="sm" variant="outline">
                  <Plus className="w-4 h-4 mr-1" />
                  Add Application
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.applications?.map((app, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
                  <div>
                    <Label>Student Name</Label>
                    <Input
                      value={app.studentName}
                      onChange={(e) => updateApplication(index, 'studentName', e.target.value)}
                      placeholder="Full name"
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={app.email}
                      onChange={(e) => updateApplication(index, 'email', e.target.value)}
                      placeholder="email@example.com"
                    />
                  </div>
                  <div>
                    <Label>Program</Label>
                    <Input
                      value={app.program}
                      onChange={(e) => updateApplication(index, 'program', e.target.value)}
                      placeholder="Program name"
                    />
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Select value={app.status} onValueChange={(value) => updateApplication(index, 'status', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="submitted">Submitted</SelectItem>
                        <SelectItem value="under_review">Under Review</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      <div className="flex justify-between items-center pt-6">
        <Button variant="outline" onClick={onSkip}>
          Skip This Step
        </Button>
        <Button 
          onClick={handleSave}
          disabled={!isFormValid()}
          className="bg-primary hover:bg-primary-hover"
        >
          Continue with Data Setup
        </Button>
      </div>
    </div>
  );
};

export default DataSetupScreen;