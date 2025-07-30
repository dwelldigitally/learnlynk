import React from "react";
import { Program } from "@/types/program";

interface IntakeQuestionsStepProps {
  data: Partial<Program>;
  onDataChange: (data: Partial<Program>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const IntakeQuestionsStep: React.FC<IntakeQuestionsStepProps> = ({
  data,
  onDataChange
}) => {
  return (
    <div className="space-y-6">
      <p>Custom intake questions builder coming soon...</p>
    </div>
  );
};

export default IntakeQuestionsStep;