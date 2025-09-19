
import React from "react";
import { AdmissionStage } from "@/types/student";
import { useProgressAnimation } from "@/hooks/useAnimations";

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
  const progressPercentage = (currentStageIndex / (stages.length - 1)) * 100;
  const { progress, ref } = useProgressAnimation(progressPercentage, 2000);

  return (
    <div ref={ref} className="animate-fade-up">
      <div className="flex justify-between items-center mb-4">
        {stages.map((stage, index) => (
          <div 
            key={stage.id} 
            className="flex flex-col items-center"
          >
            <div 
              className={`flex items-center justify-center w-12 h-12 rounded-full z-10 transition-colors duration-200 ${
                index < currentStageIndex 
                  ? "bg-green-600 text-white shadow-lg" 
                  : index === currentStageIndex
                  ? "bg-orange-500 text-white shadow-lg ring-2 ring-orange-200"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {index < currentStageIndex ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="animate-scale-in">
                  <path d="M20 6 9 17l-5-5"/>
                </svg>
              ) : (
                <span className="animate-counter">{stage.id}</span>
              )}
            </div>
            <div className={`text-xs font-medium mt-2 text-center max-w-[80px] transition-colors duration-200 ${
              index === currentStageIndex ? 'text-orange-600 font-bold' :
              index < currentStageIndex ? 'text-green-600 font-semibold' : 'text-gray-500'
            }`}>
              {stage.label}
            </div>
          </div>
        ))}
      </div>
      
      {/* Progress line background */}
      <div className="relative h-2 bg-gray-200 w-full rounded-full">
        {/* Animated progress fill */}
        <div 
          className="absolute top-0 left-0 h-2 bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-1000 ease-out shadow-sm"
          style={{ width: `${progress}%` }}
        ></div>
        {/* Current progress indicator with glow effect */}
        {currentStageIndex < stages.length - 1 && (
          <div 
            className="absolute top-0 left-0 h-2 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full animate-pulse shadow-lg"
            style={{ 
              width: `${Math.min(progress + 10, 100)}%`,
              maxWidth: `${((currentStageIndex + 1) / (stages.length - 1)) * 100}%`,
              filter: 'drop-shadow(0 0 8px rgba(251, 146, 60, 0.5))'
            }}
          ></div>
        )}
      </div>
    </div>
  );
};

export default AdmissionsProgress;
