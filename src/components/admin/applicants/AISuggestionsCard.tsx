import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, Wand2, Clock } from "lucide-react";

interface AISuggestionsCardProps {
  onApply?: (suggestion: string) => void;
}

const SUGGESTIONS = [
  {
    title: "Document Collection Sequence",
    description: "Send reminder + checklist + schedule a call in 48h",
    eta: "~3 mins setup",
  },
  {
    title: "Review & Decision Sequence",
    description: "Assign reviewer, set SLA 24h, notify applicant",
    eta: "~1 min setup",
  },
  {
    title: "Payment Nudge",
    description: "Send fee link + deadline reminder + SMS follow-up",
    eta: "~2 mins setup",
  },
];

export const AISuggestionsCard: React.FC<AISuggestionsCardProps> = ({ onApply }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Lightbulb className="h-4 w-4 text-primary" /> AI Suggestions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {SUGGESTIONS.map((s) => (
          <div key={s.title} className="p-3 rounded-md border">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-medium">{s.title}</div>
                <div className="text-sm text-muted-foreground">{s.description}</div>
                <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" /> {s.eta}
                </div>
              </div>
              <Button size="sm" variant="secondary" onClick={() => onApply?.(s.title)}>
                <Wand2 className="h-4 w-4 mr-1" /> Apply
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
