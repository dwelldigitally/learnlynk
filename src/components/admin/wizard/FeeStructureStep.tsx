import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Program } from "@/types/program";

interface FeeStructureStepProps {
  data: Partial<Program>;
  onDataChange: (data: Partial<Program>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const FeeStructureStep: React.FC<FeeStructureStepProps> = ({
  data,
  onDataChange
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Tuition Fee (CAD) *</Label>
          <Input
            type="number"
            value={data.feeStructure?.tuitionFee || ''}
            onChange={(e) => onDataChange({
              feeStructure: {
                ...data.feeStructure,
                tuitionFee: Number(e.target.value),
                currency: 'CAD',
                additionalFees: [],
                paymentPlans: [],
                scholarships: []
              }
            })}
            placeholder="15000"
          />
        </div>
      </div>
    </div>
  );
};

export default FeeStructureStep;