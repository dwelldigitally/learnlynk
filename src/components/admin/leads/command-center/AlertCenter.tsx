import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Clock, User, DollarSign, FileX, CheckCircle, XCircle, MoreHorizontal, Search, Filter, Zap, Users, MessageSquare, TrendingUp, CreditCard, FileText } from "lucide-react";
import { SegmentCard } from "./SegmentCard";
import { SavedViewsManager } from "./SavedViewsManager";
import { AlertDetailPanel } from "./AlertDetailPanel";
import { useAIActions } from "@/hooks/useAIActions";
import { useRealTimeAlerts } from "@/hooks/useRealTimeAlerts";
import { useSavedViews } from "@/hooks/useSavedViews";
import { useBulkActions } from "@/hooks/useBulkActions";
import { useToast } from "@/hooks/use-toast";

export function AlertCenter() {
  const { toast } = useToast();
  const { isProcessing, performAITriage, performAIAssignment, generateAIDraft } = useAIActions();
  const { alerts: realTimeAlerts, isLoading: alertsLoading, resolveAlert, resolveMultipleAlerts } = useRealTimeAlerts();
  const { currentView, applyView } = useSavedViews();
  const { bulkResolve, bulkAssign, bulkSnooze, isProcessing: bulkProcessing } = useBulkActions();

  const alerts = {
    critical: [
      {
        id: "crit-1",
        type: "payment_failure",
        title: "Payment Processing Failed",
        description: "Student payment for Masters Program requires immediate attention",
        studentName: "Sarah Johnson",
        program: "MBA - Finance",
        timeAgo: "5 minutes ago",
        actions: ["Contact Finance", "Retry Payment", "Escalate"]
      },
      {
        id: "crit-2",
        type: "high_value_unresponded",
        title: "High-Value Lead Unresponded",
        description: "Premium program lead (£45K value) awaiting response for 48+ hours",
        studentName: "Michael Chen",
        program: "Executive MBA",
        timeAgo: "2 hours ago",
        actions: ["Assign to Senior Advisor", "Schedule Call", "Send Priority Email"]
      }
    ],
    slaViolations: [
      {
        id: "sla-1",
        type: "response_time",
        title: "Response Time SLA Breach",
        description: "First response exceeded 24-hour SLA",
        leads: 8,
        avgOverage: "14 hours",
        actions: ["Auto-assign", "Escalate to Manager", "AI Response"]
      },
      {
        id: "sla-2",
        type: "follow_up",
        title: "Follow-up SLA Violation",
        description: "Follow-up communications overdue by 2+ days",
        leads: 12,
        avgOverage: "3.2 days",
        actions: ["Bulk Follow-up", "Reassign", "Template Send"]
      }
    ],
    unassigned: [
      {
        id: "una-1",
        type: "high_priority",
        title: "Unassigned High-Priority Leads",
        description: "Premium program applications without advisor assignment",
        count: 5,
        totalValue: "£180K",
        programs: ["MBA", "Executive Programs", "Masters"],
        actions: ["Auto-assign", "Round Robin", "Manual Review"]
      },
      {
        id: "una-2",
        type: "international",
        title: "International Leads Pending",
        description: "Overseas applications requiring specialist attention",
        count: 8,
        countries: ["USA", "Canada", "Australia", "UAE"],
        actions: ["Assign Specialist", "Schedule Timezone Call", "Send Information Pack"]
      }
    ],
    noFollowUp: [
      {
        id: "nfu-1",
        type: "qualified_stale",
        title: "Qualified Leads - No Recent Contact",
        description: "Qualified leads with no communication in 7+ days",
        count: 23,
        avgDaysSince: 12,
        riskLevel: "Medium",
        actions: ["Re-engagement Campaign", "Phone Outreach", "Assign to AI"]
      },
      {
        id: "nfu-2",
        type: "application_incomplete",
        title: "Incomplete Applications Stalled",
        description: "Applications started but not completed for 14+ days",
        count: 31,
        avgCompletion: "65%",
        riskLevel: "High",
        actions: ["Reminder Campaign", "Document Assistance", "Phone Support"]
      }
    ]
  };

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [severityFilter, setSeverityFilter] = useState("all");
  const [segmentFilter, setSegmentFilter] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  // Apply saved view on mount
  useEffect(() => {
    if (currentView) {
      const filters = currentView.filters;
      if (filters.severityFilter) setSeverityFilter(filters.severityFilter);
      if (filters.segmentFilter !== undefined) setSegmentFilter(filters.segmentFilter);
      if (filters.query) setQuery(filters.query);
    }
  }, [currentView]);

  // Segment data for overview cards
  const segments = {
    unassigned: {
      title: "Unassigned Leads",
      icon: Users,
      count: 12,
      items: [
        { id: "u1", title: "Sarah Johnson", subtitle: "High value lead - $50k potential", urgency: "high" as const, meta: "2 hours ago" },
        { id: "u2", title: "Tech Corp Inc", subtitle: "Enterprise inquiry", urgency: "high" as const, meta: "4 hours ago" },
        { id: "u3", title: "Mike Wilson", subtitle: "Referral from existing client", urgency: "medium" as const, meta: "6 hours ago" },
        { id: "u4", title: "Healthcare Plus", subtitle: "Demo request", urgency: "medium" as const, meta: "8 hours ago" },
        { id: "u5", title: "Lisa Chen", subtitle: "Pricing inquiry", urgency: "low" as const, meta: "1 day ago" }
      ]
    },
    unresponsive: {
      title: "Unresponsive High-Quality",
      icon: MessageSquare,
      count: 8,
      items: [
        { id: "ur1", title: "Global Solutions Ltd", subtitle: "No response to proposal", urgency: "high" as const, meta: "3 days silent" },
        { id: "ur2", title: "David Kim", subtitle: "$75k opportunity going cold", urgency: "high" as const, meta: "5 days silent" },
        { id: "ur3", title: "Innovation Hub", subtitle: "Follow-up needed", urgency: "medium" as const, meta: "7 days silent" },
        { id: "ur4", title: "Future Tech", subtitle: "Demo scheduled, no show", urgency: "medium" as const, meta: "4 days silent" },
        { id: "ur5", title: "Smart Systems", subtitle: "Contract review pending", urgency: "medium" as const, meta: "6 days silent" }
      ]
    },
    pipeline: {
      title: "Pipeline",
      icon: TrendingUp,
      count: 24,
      items: [
        { id: "p1", title: "Closing this week", subtitle: "$245k total value", urgency: "high" as const, meta: "3 opportunities" },
        { id: "p2", title: "Proposal stage", subtitle: "$180k in proposals", urgency: "medium" as const, meta: "5 opportunities" },
        { id: "p3", title: "Demo scheduled", subtitle: "$95k potential", urgency: "medium" as const, meta: "4 opportunities" },
        { id: "p4", title: "Qualification needed", subtitle: "$320k early stage", urgency: "low" as const, meta: "12 opportunities" }
      ]
    },
    slaViolations: {
      title: "SLA Violations",
      icon: AlertTriangle,
      count: 5,
      items: [
        { id: "s1", title: "Response overdue", subtitle: "Emma Thompson - 6 hours past SLA", urgency: "high" as const, meta: "Critical" },
        { id: "s2", title: "Follow-up missed", subtitle: "Acme Corp - 2 days overdue", urgency: "high" as const, meta: "High value" },
        { id: "s3", title: "Demo not scheduled", subtitle: "Quick Systems - 4 days past commitment", urgency: "medium" as const, meta: "Enterprise" },
        { id: "s4", title: "Proposal delayed", subtitle: "NextGen Solutions - 1 day overdue", urgency: "medium" as const, meta: "Large deal" },
        { id: "s5", title: "Check-in missed", subtitle: "BuildTech - Weekly check-in overdue", urgency: "low" as const, meta: "Routine" }
      ]
    },
    payments: {
      title: "Payments",
      icon: CreditCard,
      count: 7,
      items: [
        { id: "pay1", title: "Overdue payment", subtitle: "TechFlow Inc - $15k overdue", urgency: "high" as const, meta: "30 days past due" },
        { id: "pay2", title: "Payment processing", subtitle: "DataCorp - $8.5k pending", urgency: "medium" as const, meta: "Awaiting approval" },
        { id: "pay3", title: "Invoice dispute", subtitle: "CloudSystems - $12k disputed", urgency: "medium" as const, meta: "Under review" },
        { id: "pay4", title: "Auto-pay failed", subtitle: "SmartTech - $3.2k failed", urgency: "medium" as const, meta: "Card declined" },
        { id: "pay5", title: "Renewal due", subtitle: "Enterprise Solutions - $25k due", urgency: "low" as const, meta: "7 days remaining" }
      ]
    },
    stalledApplications: {
      title: "Stalled Applications",
      icon: FileText,
      count: 9,
      items: [
        { id: "app1", title: "Documentation missing", subtitle: "GlobalTech - Compliance docs needed", urgency: "high" as const, meta: "Blocking deployment" },
        { id: "app2", title: "Approval pending", subtitle: "MegaCorp - Legal review stuck", urgency: "high" as const, meta: "14 days pending" },
        { id: "app3", title: "Integration issues", subtitle: "FastData - Technical blockers", urgency: "medium" as const, meta: "Dev team engaged" },
        { id: "app4", title: "Budget approval", subtitle: "InnovateCorp - Finance hold", urgency: "medium" as const, meta: "Awaiting CFO" },
        { id: "app5", title: "Onboarding stalled", subtitle: "QuickStart - Training incomplete", urgency: "low" as const, meta: "Scheduling conflict" }
      ]
    }
  };

  const triageItems = [
    ...alerts.critical.map(alert => ({
      ...alert,
      severity: "critical" as const,
      category: "Critical Issue",
      segment: "critical"
    })),
    ...alerts.slaViolations.map(alert => ({
      ...alert,
      severity: "high" as const,
      category: "SLA Violation",
      segment: "slaViolations"
    })),
    ...alerts.unassigned.map(alert => ({
      ...alert,
      severity: "medium" as const,
      category: "Unassigned",
      segment: "unassigned"
    })),
    ...alerts.noFollowUp.map(alert => ({
      ...alert,
      severity: "medium" as const,
      category: "No Follow-up",
      segment: "unresponsive"
    }))
  ];

  const filtered = triageItems
    .filter(item => {
      const matchesQuery = item.title.toLowerCase().includes(query.toLowerCase()) ||
                          item.description.toLowerCase().includes(query.toLowerCase());
      const matchesSeverity = severityFilter === "all" || item.severity === severityFilter;
      const matchesSegment = !segmentFilter || item.segment === segmentFilter;
      return matchesQuery && matchesSeverity && matchesSegment;
    })
    .sort((a, b) => {
      const severityOrder = { critical: 3, high: 2, medium: 1, low: 0 };
      return severityOrder[b.severity] - severityOrder[a.severity];
    });

  const toggleSelectAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map(item => item.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const resolveItems = async (ids: string[]) => {
    try {
      await bulkResolve(ids);
      await resolveMultipleAlerts(ids);
      setSelectedIds([]);
    } catch (error) {
      console.error("Error resolving items:", error);
    }
  };

  const snoozeItems = async (ids: string[]) => {
    try {
      await bulkSnooze(ids, "2 hours");
      setSelectedIds([]);
    } catch (error) {
      console.error("Error snoozing items:", error);
    }
  };

  const assignItems = async (ids: string[]) => {
    try {
      await bulkAssign(ids, "auto-advisor");
      setSelectedIds([]);
    } catch (error) {
      console.error("Error assigning items:", error);
    }
  };

  const handleQuickAction = async (itemId: string, action: string) => {
    console.log("Quick action:", action, "on item:", itemId);
    
    // Handle different quick actions
    if (action === "Assign" || action === "Auto-assign") {
      handleAIAssign([itemId]);
    } else if (action === "View") {
      setSelectedItem(triageItems.find(item => item.id === itemId));
    } else if (action === "Message") {
      handleAIDraftOutreach(itemId);
    }
  };

  const handleSegmentViewAll = (segment: string) => {
    setSegmentFilter(segment);
  };

  // AI Action Handlers
  const handleAITriage = async () => {
    try {
      const result = await performAITriage(filtered);
      toast({
        title: "AI Triage Complete",
        description: result.summary
      });
    } catch (error) {
      console.error("AI Triage failed:", error);
    }
  };

  const handleAIAssign = async (leadIds?: string[]) => {
    try {
      const idsToAssign = leadIds || selectedIds;
      if (idsToAssign.length === 0) {
        toast({
          title: "No Items Selected",
          description: "Please select items to assign.",
          variant: "destructive"
        });
        return;
      }

      // Mock available advisors - in real app, fetch from database
      const availableAdvisors = ['advisor-1', 'advisor-2', 'advisor-3'];
      const result = await performAIAssignment(idsToAssign, availableAdvisors);
      
      toast({
        title: "AI Assignment Complete",
        description: `Generated assignments for ${idsToAssign.length} item(s).`
      });
      setSelectedIds([]);
    } catch (error) {
      console.error("AI Assignment failed:", error);
    }
  };

  const handleAIDraftOutreach = async (leadId?: string) => {
    try {
      const targetId = leadId || selectedIds[0];
      if (!targetId) {
        toast({
          title: "No Lead Selected",
          description: "Please select a lead to draft outreach.",
          variant: "destructive"
        });
        return;
      }

      const context = triageItems.find(item => item.id === targetId);
      const result = await generateAIDraft(targetId, context);
      
      toast({
        title: "AI Draft Generated",
        description: "Generated personalized outreach content."
      });
    } catch (error) {
      console.error("AI Draft failed:", error);
    }
  };

  const handleApplyFilters = (filters: any) => {
    if (filters.severityFilter !== undefined) setSeverityFilter(filters.severityFilter);
    if (filters.segmentFilter !== undefined) setSegmentFilter(filters.segmentFilter);
    if (filters.query !== undefined) setQuery(filters.query);
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Filter and AI Actions Bar */}
      <div className="flex items-center justify-between gap-4 p-4 bg-muted/30 rounded-lg">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search alerts..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severities</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
          {segmentFilter && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setSegmentFilter(null)}
            >
              Clear filter
            </Button>
          )}
        </div>
        
        {/* AI Quick Actions */}
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            onClick={handleAITriage}
            disabled={isProcessing || filtered.length === 0}
          >
            <Zap className="h-4 w-4" />
            AI Triage
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            onClick={() => handleAIAssign()}
            disabled={isProcessing || selectedIds.length === 0}
          >
            <Users className="h-4 w-4" />
            AI Assign
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            onClick={() => handleAIDraftOutreach()}
            disabled={isProcessing || selectedIds.length === 0}
          >
            <MessageSquare className="h-4 w-4" />
            AI Draft Outreach
          </Button>
          <SavedViewsManager 
            currentFilters={{ severityFilter, segmentFilter, query }}
            onApplyFilters={handleApplyFilters}
          />
        </div>
      </div>

      {/* Segment Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <SegmentCard
          title={segments.unassigned.title}
          icon={segments.unassigned.icon}
          count={segments.unassigned.count}
          items={segments.unassigned.items}
          onViewAll={() => handleSegmentViewAll("unassigned")}
          onQuickAction={handleQuickAction}
        />
        <SegmentCard
          title={segments.unresponsive.title}
          icon={segments.unresponsive.icon}
          count={segments.unresponsive.count}
          items={segments.unresponsive.items}
          onViewAll={() => handleSegmentViewAll("unresponsive")}
          onQuickAction={handleQuickAction}
        />
        <SegmentCard
          title={segments.pipeline.title}
          icon={segments.pipeline.icon}
          count={segments.pipeline.count}
          items={segments.pipeline.items}
          onViewAll={() => handleSegmentViewAll("pipeline")}
          onQuickAction={handleQuickAction}
        />
        <SegmentCard
          title={segments.slaViolations.title}
          icon={segments.slaViolations.icon}
          count={segments.slaViolations.count}
          items={segments.slaViolations.items}
          onViewAll={() => handleSegmentViewAll("slaViolations")}
          onQuickAction={handleQuickAction}
        />
        <SegmentCard
          title={segments.payments.title}
          icon={segments.payments.icon}
          count={segments.payments.count}
          items={segments.payments.items}
          onViewAll={() => handleSegmentViewAll("payments")}
          onQuickAction={handleQuickAction}
        />
        <SegmentCard
          title={segments.stalledApplications.title}
          icon={segments.stalledApplications.icon}
          count={segments.stalledApplications.count}
          items={segments.stalledApplications.items}
          onViewAll={() => handleSegmentViewAll("stalledApplications")}
          onQuickAction={handleQuickAction}
        />
      </div>

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <Card className="border-border">
          <CardContent className="p-3 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {selectedIds.length} selected
            </p>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => resolveItems(selectedIds)}
                disabled={isProcessing || bulkProcessing}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Resolve Selected
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => snoozeItems(selectedIds)}
                disabled={isProcessing || bulkProcessing}
              >
                <Clock className="h-4 w-4 mr-1" />
                Snooze
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => assignItems(selectedIds)}
                disabled={isProcessing || bulkProcessing}
              >
                <User className="h-4 w-4 mr-1" />
                Assign
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Triage Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={selectedIds.length === filtered.length && filtered.length > 0}
                    onCheckedChange={toggleSelectAll}
                  />
                  <h3 className="font-semibold">Prioritized Alert Queue</h3>
                </div>
                <Badge variant="secondary">{filtered.length} items</Badge>
              </div>
            </div>
            <CardContent className="p-0">
              <div className="divide-y">
                {filtered.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors">
                    <Checkbox
                      checked={selectedIds.includes(item.id)}
                      onCheckedChange={() => toggleSelect(item.id)}
                    />
                    <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setSelectedItem(item)}>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={item.severity === "critical" ? "destructive" : "outline"} className="text-xs">
                          {item.severity}
                        </Badge>
                        <h4 className="font-medium text-sm">{item.title}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{item.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {'timeAgo' in item ? item.timeAgo : 'avgOverage' in item ? `${item.leads} leads • +${item.avgOverage}` : 'count' in item ? `${item.count} items` : ''}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => setSelectedItem(item)}>
                        View
                      </Button>
                      <Button variant="ghost" size="sm">
                        Assign
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => resolveItems([item.id])}>
                        Resolve
                      </Button>
                    </div>
                  </div>
                ))}
                {filtered.length === 0 && (
                  <div className="p-8 text-center text-muted-foreground">
                    No alerts match your current filters.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Details Panel */}
        <div className="lg:col-span-1">
          {selectedItem ? (
            <AlertDetailPanel
              selectedItem={selectedItem}
              onClose={() => setSelectedItem(null)}
              onQuickAction={handleQuickAction}
            />
          ) : (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                Select an alert to view details and take action.
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}