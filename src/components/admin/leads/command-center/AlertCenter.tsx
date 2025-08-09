import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { 
  Clock,
  CheckCircle,
  Flag
} from "lucide-react";

export function AlertCenter() {
  // deprecated: was used in old tabbed layout

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
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [query, setQuery] = useState<string>("");

  const severityPriority: Record<string, number> = { critical: 4, high: 3, medium: 2, low: 1 };

  const triageItems = [
    ...alerts.critical.map((a) => ({
      id: a.id,
      category: "critical",
      severity: "critical",
      title: a.title,
      description: a.description,
      meta: a.timeAgo || "",
      count: 1,
    })),
    ...alerts.slaViolations.map((a) => ({
      id: a.id,
      category: "sla",
      severity: "high",
      title: a.title,
      description: a.description,
      meta: `${a.leads || 0} leads • +${a.avgOverage}`,
      count: a.leads || 0,
    })),
    ...alerts.unassigned.map((a) => ({
      id: a.id,
      category: "unassigned",
      severity: "medium",
      title: a.title,
      description: a.description,
      meta: `${a.count} leads`,
      count: a.count,
    })),
    ...alerts.noFollowUp.map((a) => ({
      id: a.id,
      category: "followup",
      severity: "low",
      title: a.title,
      description: a.description,
      meta: `${a.count} leads`,
      count: a.count,
    })),
  ];

  const filtered = triageItems
    .filter((i) => (severityFilter === "all" || i.severity === severityFilter) &&
      (query === "" || i.title.toLowerCase().includes(query.toLowerCase()) || i.description.toLowerCase().includes(query.toLowerCase())))
    .sort((a, b) => severityPriority[b.severity] - severityPriority[a.severity]);

  const allSelected = filtered.length > 0 && filtered.every((i) => selectedIds.includes(i.id));
  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !filtered.some((i) => i.id === id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...filtered.map((i) => i.id)])));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const resolveItems = (ids: string[]) => {
    // Simulate resolve action
    setSelectedIds((prev) => prev.filter((id) => !ids.includes(id)));
    if (selectedItem && ids.includes(selectedItem.id)) setSelectedItem(null);
  };
  return (
    <div className="space-y-4">
      {/* Filter Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search alerts"
                  className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label="Search alerts"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="severity" className="text-sm text-muted-foreground">Severity</label>
              <select
                id="severity"
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="h-10 rounded-md border border-input bg-background px-2 text-sm"
              >
                <option value="all">All</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Triage List */}
        <div className="lg:col-span-2 space-y-3">
          {/* Bulk actions */}
          {selectedIds.length > 0 && (
            <Card className="border-border">
              <CardContent className="p-3 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {selectedIds.length} selected
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => resolveItems(selectedIds)}>
                    <CheckCircle className="h-4 w-4 mr-1" /> Resolve Selected
                  </Button>
                  <Button variant="outline" size="sm">
                    <Clock className="h-4 w-4 mr-1" /> Snooze
                  </Button>
                  <Button variant="outline" size="sm">
                    <Flag className="h-4 w-4 mr-1" /> Assign
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleSelectAll}
                    aria-label="Select all"
                  />
                  <CardTitle className="text-base">Prioritized alert queue</CardTitle>
                </div>
                <CardDescription>
                  {filtered.length} items
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {filtered.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-4 hover:bg-accent/40">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(item.id)}
                      onChange={() => toggleSelect(item.id)}
                      aria-label={`Select ${item.title}`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs capitalize">
                          {item.severity}
                        </Badge>
                        <button className="text-left truncate font-medium" onClick={() => setSelectedItem(item)}>
                          {item.title}
                        </button>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{item.description}</p>
                    </div>
                    <div className="hidden sm:block text-sm text-muted-foreground mr-2">
                      {item.meta}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => setSelectedItem(item)}>View</Button>
                      <Button variant="outline" size="sm">Assign</Button>
                      <Button variant="outline" size="sm">Snooze</Button>
                      <Button variant="outline" size="sm" onClick={() => resolveItems([item.id])}>Resolve</Button>
                    </div>
                  </div>
                ))}
                {filtered.length === 0 && (
                  <div className="p-6 text-center text-sm text-muted-foreground">No alerts match your filters.</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Details Panel */}
        <div className="lg:col-span-1">
          {selectedItem ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Flag className="h-4 w-4" />
                  {selectedItem.title}
                </CardTitle>
                <CardDescription className="capitalize">Severity: {selectedItem.severity}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p className="text-sm">{selectedItem.description}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Meta</p>
                  <p className="text-sm">{selectedItem.meta}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Assign</Button>
                  <Button variant="outline" size="sm">Snooze</Button>
                  <Button variant="outline" size="sm" onClick={() => resolveItems([selectedItem.id])}>
                    <CheckCircle className="h-4 w-4 mr-1" /> Resolve
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6 text-sm text-muted-foreground">
                Select an alert to see details and take action.
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}