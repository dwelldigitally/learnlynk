import React from "react";
import { Badge } from "@/components/ui/badge";
import { Mail } from "lucide-react";
import { Applicant } from "@/types/applicant";

interface StudentProfileSectionProps {
  applicant: Applicant;
  getInitials: (applicant: Applicant) => string;
}

export const StudentProfileSection: React.FC<StudentProfileSectionProps> = ({
  applicant,
  getInitials
}) => {
  return (
    <div className="flex items-start gap-6 flex-1">
      <div className="relative">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-2xl font-bold shadow-lg">
          {getInitials(applicant)}
        </div>
        <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-success rounded-full border-2 border-background flex items-center justify-center">
          <div className="h-2 w-2 bg-background rounded-full"></div>
        </div>
      </div>
      <div className="flex-1 space-y-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {applicant.master_records 
              ? `${applicant.master_records.first_name} ${applicant.master_records.last_name}`
              : 'Applicant'
            }
          </h1>
          <p className="text-muted-foreground flex items-center gap-2 mt-1">
            <Mail className="h-4 w-4" />
            {applicant.master_records?.email || 'No email'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-background/50 backdrop-blur">
            {applicant.program}
          </Badge>
          <Badge variant={applicant.payment_status === 'completed' ? 'default' : 'secondary'}>
            {applicant.payment_status}
          </Badge>
        </div>
      </div>
    </div>
  );
};