
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
              className={`flex items-center justify-center w-12 h-12 rounded-full z-10 transition-all duration-300 ${
                index < currentStageIndex 
                  ? "bg-green-600 text-white shadow-lg" 
                  : index === currentStageIndex
                  ? "bg-orange-500 text-white shadow-lg animate-pulse ring-4 ring-orange-200"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {index < currentStageIndex ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5"/>
                </svg>
              ) : (
                stage.id
              )}
            </div>
            <div className={`text-xs font-medium mt-2 text-center max-w-[80px] ${
              index === currentStageIndex ? 'text-orange-600 font-bold' : 
              index < currentStageIndex ? 'text-green-600 font-semibold' : 'text-gray-500'
            }`}>
              {stage.label}
            </div>
          </div>
        ))}
      </div>
      {/* Progress line background */}
      <div className="absolute top-6 left-0 transform -translate-y-1/2 h-2 bg-gray-200 w-full z-0 rounded-full"></div>
      {/* Completed progress */}
      <div 
        className="absolute top-6 left-0 transform -translate-y-1/2 h-2 bg-green-500 z-0 rounded-full transition-all duration-500"
        style={{ width: `${(currentStageIndex / (stages.length - 1)) * 100}%` }}
      ></div>
      {/* Current progress indicator */}
      {currentStageIndex < stages.length - 1 && (
        <div 
          className="absolute top-6 left-0 transform -translate-y-1/2 h-2 bg-orange-400 z-0 rounded-full animate-pulse"
          style={{ 
            width: `${((currentStageIndex + 0.5) / (stages.length - 1)) * 100}%`,
            maxWidth: `${((currentStageIndex + 1) / (stages.length - 1)) * 100}%`
          }}
        ></div>
      )}
    </div>
  );
};

export default AdmissionsProgress;
