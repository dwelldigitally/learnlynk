import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Program } from "@/types/program";

interface PreviewStepProps {
  data: Partial<Program>;
  onDataChange: (data: Partial<Program>) => void;
  onNext: () => void;
  onPrevious: () => void;
  onSave: () => void;
}

const PreviewStep: React.FC<PreviewStepProps> = ({
  data,
  onSave
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {data.name}
            <Badge>{data.type}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">{data.description}</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><strong>Duration:</strong> {data.duration}</div>
            <div><strong>Campus:</strong> {data.campus?.join(', ')}</div>
            <div><strong>Tuition:</strong> ${data.feeStructure?.tuitionFee?.toLocaleString()}</div>
            <div><strong>Intakes:</strong> {data.intakes?.length || 0}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PreviewStep;