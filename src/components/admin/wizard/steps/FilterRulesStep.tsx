import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Users, 
  Filter, 
  Globe, 
  GraduationCap, 
  MapPin,
  Star,
  Plus,
  X,
  Target,
  Info,
  CheckCircle
} from "lucide-react";
import { AIAgentData } from "../AIAgentWizard";

interface FilterRulesStepProps {
  data: AIAgentData;
  updateData: (updates: Partial<AIAgentData>) => void;
}

const SPECIALIZATION_OPTIONS = [
  { id: 'mba', label: 'MBA Programs', description: 'Master of Business Administration' },
  { id: 'undergraduate', label: 'Undergraduate Programs', description: 'Bachelor\'s degrees' },
  { id: 'graduate', label: 'Graduate Programs', description: 'Master\'s and PhD programs' },
  { id: 'executive', label: 'Executive Education', description: 'Executive and professional programs' },
  { id: 'online', label: 'Online Programs', description: 'Distance learning programs' },
  { id: 'certificate', label: 'Certificate Programs', description: 'Professional certificates' },
  { id: 'continuing', label: 'Continuing Education', description: 'Lifelong learning programs' },
  { id: 'international', label: 'International Programs', description: 'Global and exchange programs' }
];

const LEAD_SOURCE_OPTIONS = [
  { id: 'website', label: 'Website Forms', description: 'Direct website inquiries' },
  { id: 'social_media', label: 'Social Media', description: 'LinkedIn, Facebook, etc.' },
  { id: 'email_marketing', label: 'Email Marketing', description: 'Newsletter and campaigns' },
  { id: 'referrals', label: 'Referrals', description: 'Alumni and partner referrals' },
  { id: 'events', label: 'Events', description: 'Webinars and info sessions' },
  { id: 'advertising', label: 'Paid Advertising', description: 'Google Ads, social ads' },
  { id: 'phone', label: 'Phone Inquiries', description: 'Inbound phone calls' },
  { id: 'chat', label: 'Live Chat', description: 'Website chat widget' }
];

const GEOGRAPHIC_REGIONS = [
  { id: 'north_america', label: 'North America', countries: ['United States', 'Canada', 'Mexico'] },
  { id: 'europe', label: 'Europe', countries: ['United Kingdom', 'Germany', 'France', 'Spain'] },
  { id: 'asia_pacific', label: 'Asia Pacific', countries: ['Japan', 'Australia', 'Singapore', 'India'] },
  { id: 'latin_america', label: 'Latin America', countries: ['Brazil', 'Argentina', 'Chile', 'Colombia'] },
  { id: 'middle_east', label: 'Middle East', countries: ['UAE', 'Saudi Arabia', 'Israel', 'Qatar'] },
  { id: 'africa', label: 'Africa', countries: ['South Africa', 'Nigeria', 'Kenya', 'Egypt'] }
];

const PRIORITY_CRITERIA_OPTIONS = [
  { id: 'high_budget', label: 'High Budget Programs', description: 'Programs >$50,000' },
  { id: 'quick_start', label: 'Quick Start Dates', description: 'Starting within 6 months' },
  { id: 'previous_interest', label: 'Previous Interest', description: 'Returning prospects' },
  { id: 'referral_source', label: 'Referral Sources', description: 'Alumni and partner referrals' },
  { id: 'company_sponsored', label: 'Company Sponsored', description: 'Employer-funded students' },
  { id: 'international', label: 'International Students', description: 'Non-domestic applicants' }
];

export function FilterRulesStep({ data, updateData }: FilterRulesStepProps) {
  const [customSpecialization, setCustomSpecialization] = useState("");

  const toggleSpecialization = (specId: string) => {
    const current = data.specializations || [];
    const updated = current.includes(specId)
      ? current.filter(id => id !== specId)
      : [...current, specId];
    updateData({ specializations: updated });
  };

  const toggleLeadSource = (sourceId: string) => {
    const current = data.lead_sources || [];
    const updated = current.includes(sourceId)
      ? current.filter(id => id !== sourceId)
      : [...current, sourceId];
    updateData({ lead_sources: updated });
  };

  const toggleGeographicPreference = (regionId: string) => {
    const current = data.geographic_preferences || [];
    const updated = current.includes(regionId)
      ? current.filter(id => id !== regionId)
      : [...current, regionId];
    updateData({ geographic_preferences: updated });
  };

  const addCustomSpecialization = () => {
    if (customSpecialization.trim()) {
      const current = data.specializations || [];
      updateData({ 
        specializations: [...current, customSpecialization.trim().toLowerCase().replace(/\s+/g, '_')]
      });
      setCustomSpecialization("");
    }
  };

  const removeSpecialization = (specId: string) => {
    const current = data.specializations || [];
    updateData({ 
      specializations: current.filter(id => id !== specId)
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="p-3 bg-purple-100 rounded-full w-fit mx-auto">
          <Filter className="h-8 w-8 text-purple-600" />
        </div>
        <h2 className="text-2xl font-bold">Lead Filtering & Assignment</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Configure which types of leads your AI agent will handle. This ensures the right inquiries reach the right specialist.
        </p>
      </div>

      {/* Specializations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Program Specializations *
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Select the program types your agent will specialize in. At least one is required.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {SPECIALIZATION_OPTIONS.map((spec) => {
              const isSelected = data.specializations?.includes(spec.id);
              return (
                <Button
                  key={spec.id}
                  variant={isSelected ? "default" : "outline"}
                  className="h-auto p-4 justify-start text-left"
                  onClick={() => toggleSpecialization(spec.id)}
                >
                  <div className="flex items-start gap-3 w-full">
                    <Checkbox checked={isSelected} className="mt-1" />
                    <div className="flex-1">
                      <div className="font-medium">{spec.label}</div>
                      <div className="text-xs opacity-75 mt-1">{spec.description}</div>
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>

          {/* Custom Specialization */}
          <div className="flex gap-2 mt-4">
            <Input
              placeholder="Add custom specialization..."
              value={customSpecialization}
              onChange={(e) => setCustomSpecialization(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addCustomSpecialization()}
            />
            <Button onClick={addCustomSpecialization} disabled={!customSpecialization.trim()}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Selected Specializations */}
          {data.specializations && data.specializations.length > 0 && (
            <div className="space-y-2">
              <Label>Selected Specializations:</Label>
              <div className="flex flex-wrap gap-2">
                {data.specializations.map((specId) => {
                  const spec = SPECIALIZATION_OPTIONS.find(s => s.id === specId);
                  return (
                    <Badge key={specId} variant="secondary" className="flex items-center gap-1">
                      {spec?.label || specId.replace(/_/g, ' ')}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 w-4 h-4"
                        onClick={() => removeSpecialization(specId)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lead Sources */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Preferred Lead Sources
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Choose which lead sources your agent should prioritize
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {LEAD_SOURCE_OPTIONS.map((source) => {
              const isSelected = data.lead_sources?.includes(source.id);
              return (
                <div key={source.id} className="flex items-center space-x-2">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => toggleLeadSource(source.id)}
                  />
                  <div className="flex-1">
                    <Label className="font-medium">{source.label}</Label>
                    <p className="text-xs text-muted-foreground">{source.description}</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Geographic Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Geographic Focus
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Select regions your agent should focus on
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {GEOGRAPHIC_REGIONS.map((region) => {
              const isSelected = data.geographic_preferences?.includes(region.id);
              return (
                <div key={region.id} className="flex items-start space-x-2">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => toggleGeographicPreference(region.id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <Label className="font-medium">{region.label}</Label>
                    <p className="text-xs text-muted-foreground">
                      {region.countries.slice(0, 3).join(', ')}
                      {region.countries.length > 3 && ` +${region.countries.length - 3} more`}
                    </p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Priority Criteria */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Priority Criteria
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Define what makes a lead high-priority for your agent
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PRIORITY_CRITERIA_OPTIONS.map((criteria) => {
              const isSelected = data.priority_criteria?.[criteria.id];
              return (
                <Button
                  key={criteria.id}
                  variant={isSelected ? "default" : "outline"}
                  className="h-auto p-4 text-left justify-start"
                  onClick={() => updateData({
                    priority_criteria: {
                      ...data.priority_criteria,
                      [criteria.id]: !isSelected
                    }
                  })}
                >
                  <div className="flex items-start gap-3 w-full">
                    <Checkbox checked={isSelected} className="mt-1" />
                    <div className="flex-1">
                      <div className="font-medium text-sm">{criteria.label}</div>
                      <div className="text-xs opacity-75 mt-1">{criteria.description}</div>
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Filter Summary */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-primary" />
            Filter Configuration Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg text-center">
                <GraduationCap className="h-6 w-6 mx-auto mb-2 text-primary" />
                <div className="font-medium">{data.specializations?.length || 0} Specializations</div>
                <div className="text-sm text-muted-foreground">Program types</div>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg text-center">
                <Target className="h-6 w-6 mx-auto mb-2 text-primary" />
                <div className="font-medium">{data.lead_sources?.length || 0} Sources</div>
                <div className="text-sm text-muted-foreground">Lead channels</div>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg text-center">
                <Globe className="h-6 w-6 mx-auto mb-2 text-primary" />
                <div className="font-medium">{data.geographic_preferences?.length || 0} Regions</div>
                <div className="text-sm text-muted-foreground">Geographic focus</div>
              </div>
            </div>

            {data.specializations && data.specializations.length > 0 ? (
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">
                    Your agent is configured to handle leads for {data.specializations.length} program type(s)
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Info className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium text-orange-800">
                    Please select at least one specialization to continue
                  </span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}