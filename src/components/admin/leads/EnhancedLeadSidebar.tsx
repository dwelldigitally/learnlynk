import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, CheckCircle, User, Users, Mail, Phone, MessageSquare, FileText, Clock, AlertTriangle, TrendingUp, Lightbulb, Brain, ShieldAlert, GraduationCap, BookOpenCheck, Activity, UserPlus, UserCheck, UserX, Briefcase, Building2, MapPin, Link, Tag, Edit, Save, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DatePicker } from '@/components/ui/date-picker';
import { Lead, LeadStatus } from '@/types/lead';
import { LeadService } from '@/services/leadService';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface EnhancedLeadSidebarProps {
  lead: Lead;
  onUpdate: () => void;
}

// Data sources for dropdowns
const availablePrograms = [
  'Computer Science',
  'Business Administration', 
  'Engineering',
  'Psychology',
  'Nursing',
  'Culinary Arts',
  'Medical Assistant',
  'Information Technology',
  'Marketing',
  'Healthcare Administration'
];

const leadSources = [
  'web',
  'referral',
  'social_media',
  'email_campaign',
  'phone_call',
  'walk_in',
  'partner',
  'advertisement',
  'direct_mail',
  'event'
];

const intakeDates = [
  'March 2025',
  'June 2025', 
  'September 2025',
  'December 2025',
  'March 2026',
  'June 2026'
];

const paymentPlanOptions = [
  'Full Payment Upfront',
  '12 Monthly Payments',
  '24 Monthly Payments',
  'Bi-weekly Payments',
  'Custom Payment Plan',
  'Financial Aid'
];

// Extended lead interface for additional fields
interface ExtendedLead extends Lead {
  program_intake?: string;
  payment_plan?: string;
}

export function EnhancedLeadSidebar({ lead, onUpdate }: EnhancedLeadSidebarProps) {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editedLead, setEditedLead] = useState<ExtendedLead>(lead);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setEditedLead(lead);
  }, [lead]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedLead(prev => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (status: LeadStatus) => {
    setEditedLead(prev => ({ ...prev, status }));
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setEditedLead(prev => ({ ...prev, date_of_birth: date.toISOString() }));
    }
  };

  const handleSaveChanges = async () => {
    setLoading(true);
    try {
      await LeadService.updateLead(lead.id, editedLead);
      toast({
        title: 'Success',
        description: 'Lead updated successfully',
        duration: 3000,
      });
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error('Error updating lead:', error);
      toast({
        title: 'Error',
        description: 'Failed to update lead',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLead = async () => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      setLoading(true);
      try {
        await LeadService.deleteLead(lead.id);
        toast({
          title: 'Success',
          description: 'Lead deleted successfully',
          duration: 3000,
        });
        // Redirect to leads overview or another appropriate page
        window.location.href = '/admin/leads';
      } catch (error) {
        console.error('Error deleting lead:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete lead',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const getStatusColor = (status: LeadStatus) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'contacted': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'qualified': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'converted': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200';
      case 'lost': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const calculateAIScore = () => {
    // Mock AI score calculation based on lead data
    const firstNameScore = lead.first_name ? 10 : 0;
    const lastNameScore = lead.last_name ? 10 : 0;
    const emailScore = lead.email ? 15 : 0;
    const phoneScore = lead.phone ? 15 : 0;
    const statusScore = lead.status === 'qualified' ? 20 : lead.status === 'converted' ? 25 : 5;
    const leadScoreScore = lead.lead_score ? Math.min(lead.lead_score / 10, 20) : 0; // Scale lead_score to max 20
    const aiScore = firstNameScore + lastNameScore + emailScore + phoneScore + statusScore + leadScoreScore;
    return Math.min(aiScore, 100); // Cap the score at 100
  };

  const aiScore = calculateAIScore();

  const getNextBestActions = () => {
    const actions = [];

    if (lead.status === 'new') {
      actions.push('Contact the lead to introduce our programs');
      actions.push('Send welcome email with program information');
    } else if (lead.status === 'contacted') {
      actions.push('Schedule a follow-up call to discuss their interests');
      actions.push('Send detailed program brochure');
    } else if (lead.status === 'qualified') {
      actions.push('Schedule enrollment consultation');
      actions.push('Send application link and requirements');
      actions.push('Provide financial aid information');
    } else if (lead.status === 'converted') {
      actions.push('Complete enrollment documentation');
      actions.push('Schedule orientation session');
    } else if (lead.status === 'lost') {
      actions.push('Send re-engagement campaign');
      actions.push('Offer alternative programs or schedules');
    }

    if (!lead.email) {
      actions.push('Request the lead\'s email address for communication');
    }

    if (lead.lead_score < 50) {
      actions.push('Conduct qualification assessment to improve score');
    }

    return actions;
  };

  const nextBestActions = getNextBestActions();

  const getRiskAssessment = () => {
    const risks = [];

    if (!lead.email || !lead.phone) {
      risks.push('Missing contact information may hinder communication');
    }

    if (lead.status === 'lost') {
      risks.push('Lead has been marked as lost, indicating disinterest');
    }

    if (lead.lead_score < 30) {
      risks.push('Low lead score suggests a weak fit or lack of engagement');
    }

    return risks;
  };

  const riskAssessment = getRiskAssessment();

  const getEngagementPrediction = () => {
    let likelihood = 50; // Default likelihood

    // Adjust likelihood based on lead data
    if (lead.status === 'qualified' || lead.status === 'converted') {
      likelihood += 20;
    } else if (lead.status === 'lost') {
      likelihood -= 30;
    }

    if (lead.lead_score > 70) {
      likelihood += 15;
    } else if (lead.lead_score < 30) {
      likelihood -= 15;
    }

    // Ensure likelihood stays within 0-100 range
    likelihood = Math.max(0, Math.min(100, likelihood));

    return likelihood;
  };

  const engagementPrediction = getEngagementPrediction();

  return (
    <div className="w-80 bg-card border-r border-border flex flex-col">
      {/* Contact Card */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-blue-500" />
            <h3 className="text-lg font-semibold">Contact Information</h3>
          </div>
          {isEditing ? (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setEditedLead(lead); // Revert changes
                  setIsEditing(false);
                }}
                disabled={loading}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleSaveChanges} disabled={loading}>
                <Save className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)} disabled={loading}>
              <Edit className="h-4 w-4" />
            </Button>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                type="text"
                id="firstName"
                name="first_name"
                value={editedLead.first_name || ''}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                type="text"
                id="lastName"
                name="last_name"
                value={editedLead.last_name || ''}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={editedLead.email || ''}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                type="tel"
                id="phone"
                name="phone"
                value={editedLead.phone || ''}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                value={editedLead.notes || ''}
                onChange={handleInputChange}
                className="resize-none"
              />
            </div>
            <div>
              <Label htmlFor="program_interest">Program Interest</Label>
              <Select 
                value={editedLead.program_interest?.[0] || ''} 
                onValueChange={(value) => {
                  setEditedLead(prev => ({
                    ...prev,
                    program_interest: value ? [value] : []
                  }));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select program of interest" />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border shadow-lg z-50">
                  {availablePrograms.map((program) => (
                    <SelectItem key={program} value={program}>
                      {program}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="created_at">Created Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !editedLead.created_at && "text-muted-foreground"
                    )}
                    disabled
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {editedLead.created_at ? (
                      format(new Date(editedLead.created_at), "PPP")
                    ) : (
                      <span>No date set</span>
                    )}
                  </Button>
                </PopoverTrigger>
              </Popover>
            </div>
            <div>
              <Label htmlFor="source">Lead Source</Label>
              <Select 
                value={editedLead.source || ''} 
                onValueChange={(value) => {
                  setEditedLead(prev => ({
                    ...prev,
                    source: value as any
                  }));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select lead source" />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border shadow-lg z-50">
                  {leadSources.map((source) => (
                    <SelectItem key={source} value={source}>
                      {source.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="program_intake">Program Intake</Label>
              <Select 
                value={(editedLead as ExtendedLead).program_intake || ''} 
                onValueChange={(value) => {
                  setEditedLead(prev => ({
                    ...prev,
                    program_intake: value
                  }));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select intake date" />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border shadow-lg z-50">
                  {intakeDates.map((intake) => (
                    <SelectItem key={intake} value={intake}>
                      {intake}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="payment_plan">Payment Plan Preference</Label>
              <Select 
                value={(editedLead as ExtendedLead).payment_plan || ''} 
                onValueChange={(value) => {
                  setEditedLead(prev => ({
                    ...prev,
                    payment_plan: value
                  }));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment plan" />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border shadow-lg z-50">
                  {paymentPlanOptions.map((plan) => (
                    <SelectItem key={plan} value={plan}>
                      {plan}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="tags">Tags</Label>
              <Input
                type="text"
                id="tags"
                name="tags"
                value={editedLead.tags?.join(', ') || ''}
                onChange={handleInputChange}
                placeholder="Enter tags separated by commas"
              />
            </div>
            <div>
              <Label htmlFor="city">Location</Label>
              <Input
                type="text"
                id="city"
                name="city"
                value={[editedLead.city, editedLead.state, editedLead.country].filter(Boolean).join(', ') || ''}
                onChange={handleInputChange}
                placeholder="City, State, Country"
              />
            </div>
            <div>
              <Label htmlFor="source_details">Source Details</Label>
              <Input
                type="text"
                id="source_details"
                name="source_details"
                value={editedLead.source_details || ''}
                onChange={handleInputChange}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="text-sm">
              <span className="font-semibold">Name:</span> {lead.first_name} {lead.last_name}
            </div>
            <div className="text-sm">
              <span className="font-semibold">Email:</span> {lead.email || 'N/A'}
            </div>
            <div className="text-sm">
              <span className="font-semibold">Phone:</span> {lead.phone || 'N/A'}
            </div>
            <div className="text-sm">
              <span className="font-semibold">Notes:</span> {lead.notes || 'N/A'}
            </div>
            <div className="text-sm">
              <span className="font-semibold">Program Interest:</span> {lead.program_interest?.join(', ') || 'N/A'}
            </div>
            <div className="text-sm">
              <span className="font-semibold">Program Intake:</span> {(lead as any).program_intake || 'N/A'}
            </div>
            <div className="text-sm">
              <span className="font-semibold">Payment Plan:</span> {(lead as any).payment_plan || 'N/A'}
            </div>
            <div className="text-sm">
              <span className="font-semibold">Created Date:</span> {lead.created_at ? new Date(lead.created_at).toLocaleDateString() : 'N/A'}
            </div>
            <div className="text-sm">
              <span className="font-semibold">Lead Source:</span> {lead.source || 'N/A'}
            </div>
            <div className="text-sm">
              <span className="font-semibold">Tags:</span> {lead.tags?.join(', ') || 'N/A'}
            </div>
            <div className="text-sm">
              <span className="font-semibold">Location:</span> {[lead.city, lead.state, lead.country].filter(Boolean).join(', ') || 'N/A'}
            </div>
            <div className="text-sm">
              <span className="font-semibold">Source Details:</span> {lead.source_details || 'N/A'}
            </div>
          </div>
        )}
      </div>

      {/* AI Insights Card */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">AI Insights</h3>
          </div>
          <Badge variant="secondary">{aiScore}%</Badge>
        </div>
        <Progress value={aiScore} className="mb-4" />
        <p className="text-sm text-muted-foreground">
          AI-driven analysis of lead engagement and potential.
        </p>
      </div>

      {/* Lead Scoring Card */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            <h3 className="text-lg font-semibold">Lead Scoring</h3>
          </div>
          {isEditing ? (
            <Input
              type="number"
              id="leadScore"
              name="lead_score"
              value={editedLead.lead_score?.toString() || ''}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                setEditedLead(prev => ({ ...prev, lead_score: isNaN(value) ? 0 : value }));
              }}
              className="w-20 h-8 text-sm"
            />
          ) : (
            <Badge variant="secondary">{lead.lead_score}</Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground mb-2">
          Score: {lead.lead_score}. Adjust the lead score based on engagement.
        </p>
        {isEditing ? null : (
          <input
            type="range"
            min="0"
            max="100"
            value={lead.lead_score}
            onChange={() => {}}
            className="w-full"
          />
        )}
      </div>

      {/* Next Best Actions Card */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          <h3 className="text-lg font-semibold">Next Best Actions</h3>
        </div>
        <ul className="list-disc pl-4 space-y-2">
          {nextBestActions.map((action, index) => (
            <li key={index} className="text-sm text-muted-foreground">
              {action}
            </li>
          ))}
        </ul>
      </div>

      {/* Risk Assessment Card */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-2 mb-4">
          <ShieldAlert className="h-5 w-5 text-red-500" />
          <h3 className="text-lg font-semibold">Risk Assessment</h3>
        </div>
        {riskAssessment.length > 0 ? (
          <ul className="list-disc pl-4 space-y-2">
            {riskAssessment.map((risk, index) => (
              <li key={index} className="text-sm text-muted-foreground">
                {risk}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">No risks identified.</p>
        )}
      </div>

      {/* Engagement Prediction Card */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-2 mb-4">
          <GraduationCap className="h-5 w-5 text-purple-500" />
          <h3 className="text-lg font-semibold">Engagement Prediction</h3>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold">{engagementPrediction}%</div>
          <p className="text-sm text-muted-foreground">
            Likelihood of lead engagement.
          </p>
          <Progress value={engagementPrediction} className="mt-2" />
        </div>
      </div>

      {/* Recent Activity Timeline */}
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="h-5 w-5 text-gray-500" />
          <h3 className="text-lg font-semibold">Recent Activity</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-sm text-muted-foreground">Email sent</span>
            <span className="ml-auto text-xs">2 hours ago</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span className="text-sm text-muted-foreground">Call scheduled</span>
            <span className="ml-auto text-xs">1 day ago</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-orange-500"></div>
            <span className="text-sm text-muted-foreground">Status updated</span>
            <span className="ml-auto text-xs">2 days ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}
