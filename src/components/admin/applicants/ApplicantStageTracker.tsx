import React from "react";
import { Badge } from "@/components/ui/badge";

interface ApplicantStageTrackerProps {
  substage: string;
}

const STAGES: { key: string; label: string }[] = [
  { key: "application_started", label: "Started" },
  { key: "documents_submitted", label: "Documents" },
  { key: "under_review", label: "Review" },
  { key: "decision_pending", label: "Decision" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
];

export const ApplicantStageTracker: React.FC<ApplicantStageTrackerProps> = ({ substage }) => {
  const currentIndex = Math.max(
    0,
    STAGES.findIndex((s) => s.key === substage)
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        {STAGES.map((s, idx) => {
          const reached = idx <= currentIndex;
          return (
            <div key={s.key} className="flex-1 flex items-center">
              <div
                className={[
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium",
                  reached ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground",
                ].join(" ")}
                title={s.label}
              >
                {idx + 1}
              </div>
              {idx < STAGES.length - 1 && (
                <div className={[
                  "h-1 flex-1 mx-2 rounded-full",
                  idx < currentIndex ? "bg-primary/40" : "bg-muted",
                ].join(" ")} />
              )}
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        {STAGES.map((s) => (
          <span key={s.key} className="w-20 text-center">
            <Badge variant={s.key === substage ? "default" : "outline"}>{s.label}</Badge>
          </span>
        ))}
      </div>
    </div>
  );
};
