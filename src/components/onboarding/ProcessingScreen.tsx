
import React, { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const ProcessingScreen: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);
  
  const stages = [
    "Connecting to your CRM",
    "Importing selected data",
    "Analyzing team structure",
    "Processing historical performance",
    "Building AI assignment model",
    "Finalizing setup"
  ];
  
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prevProgress => {
        if (prevProgress >= 100) {
          clearInterval(timer);
          return 100;
        }
        
        const newProgress = prevProgress + 2;
        
        // Update the current stage based on progress
        if (newProgress > 15 && currentStage === 0) {
          setCurrentStage(1);
        } else if (newProgress > 35 && currentStage === 1) {
          setCurrentStage(2);
        } else if (newProgress > 55 && currentStage === 2) {
          setCurrentStage(3);
        } else if (newProgress > 75 && currentStage === 3) {
          setCurrentStage(4);
        } else if (newProgress > 95 && currentStage === 4) {
          setCurrentStage(5);
        }
        
        return newProgress;
      });
    }, 150);
    
    return () => clearInterval(timer);
  }, [currentStage]);

  return (
    <div className="slide-container">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">
          Building Your AI Model
        </h1>
        <p className="text-saas-gray-medium max-w-md mx-auto">
          We're processing your data and building a custom lead assignment model
        </p>
      </div>
      
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-saas-gray-medium">Processing</span>
          <span className="font-medium">{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
      
      <div className="space-y-4 max-w-md mx-auto">
        {stages.map((stage, index) => (
          <div key={index} className="flex items-center space-x-3">
            {index < currentStage ? (
              <div className="w-6 h-6 bg-saas-green rounded-full flex items-center justify-center">
                <Check className="text-white w-4 h-4" />
              </div>
            ) : index === currentStage ? (
              <div className="w-6 h-6 bg-saas-blue rounded-full flex items-center justify-center">
                <Loader2 className="text-white w-4 h-4 animate-spin" />
              </div>
            ) : (
              <div className="w-6 h-6 border border-gray-300 rounded-full" />
            )}
            <span className={index <= currentStage ? "font-medium" : "text-saas-gray-medium"}>
              {stage}
            </span>
          </div>
        ))}
      </div>
      
      <div className="mt-8 bg-saas-gray-light p-4 rounded-lg text-center">
        <p className="text-sm">
          This may take a few minutes. We're analyzing your data and creating a custom machine learning model for your team.
        </p>
      </div>
    </div>
  );
};

export default ProcessingScreen;
