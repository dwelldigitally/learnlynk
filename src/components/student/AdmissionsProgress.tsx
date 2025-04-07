
import React from "react";
import { AdmissionStage } from "@/types/student";

interface AdmissionsProgressProps {
  currentStage: AdmissionStage;
}

const AdmissionsProgress: React.FC<AdmissionsProgressProps> = ({ currentStage }) => {
  const stages = [
    { id: 1, name: "LEAD_FORM", label: "LEAD FORM" },
    { id: 2, name: "SEND_DOCUMENTS", label: "SEND DOCUMENTS" },
    { id: 3, name: "DOCUMENT_APPROVAL", label: "DOCUMENT APPROVAL" },
    { id: 4, name: "FEE_PAYMENT", label: "FEE PAYMENT" },
    { id: 5, name: "ACCEPTED", label: "ACCEPTED" },
  ];

  // Find the current stage index
  const currentStageIndex = stages.findIndex(stage => stage.name === currentStage);

  return (
    <div className="relative">
      <div className="flex justify-between items-center">
        {stages.map((stage, index) => (
          <div key={stage.id} className="flex flex-col items-center">
            <div 
              className={`flex items-center justify-center w-10 h-10 rounded-full z-10 ${
                index <= currentStageIndex 
                  ? "bg-purple-600 text-white" 
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {stage.id}
            </div>
            <div className="text-xs font-medium mt-2 text-center max-w-[70px]">{stage.label}</div>
          </div>
        ))}
      </div>
      {/* Progress line */}
      <div className="absolute top-5 left-0 transform -translate-y-1/2 h-1 bg-gray-200 w-full z-0"></div>
      <div 
        className="absolute top-5 left-0 transform -translate-y-1/2 h-1 bg-purple-600 z-0"
        style={{ width: `${(currentStageIndex / (stages.length - 1)) * 100}%` }}
      ></div>
    </div>
  );
};

export default AdmissionsProgress;
