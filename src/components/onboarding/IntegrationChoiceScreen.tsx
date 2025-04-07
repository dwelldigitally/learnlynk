
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Info } from "lucide-react";

interface IntegrationChoiceProps {
  onFirstTime: () => void;
  onExistingUser: () => void;
}

const IntegrationChoiceScreen: React.FC<IntegrationChoiceProps> = ({
  onFirstTime,
  onExistingUser,
}) => {
  const [choice, setChoice] = useState<string | null>(null);

  const handleContinue = () => {
    if (choice === "first-time") {
      onFirstTime();
    } else if (choice === "existing-user") {
      onExistingUser();
    }
  };

  return (
    <div className="slide-container">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">
          Let's Connect Learnlynk to HubSpot
        </h1>
        <p className="text-saas-gray-medium">
          Select the option that best describes your situation
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6 flex items-start">
        <Info className="text-saas-blue mr-3 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-blue-700">
          Learnlynk works with your HubSpot data to optimize lead distribution and tracking. You'll need to connect your account to get started.
        </p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <RadioGroup value={choice || ""} onValueChange={setChoice}>
          <div className="flex items-start space-x-3 mb-4 p-3 rounded-md hover:bg-gray-50">
            <RadioGroupItem id="first-time" value="first-time" className="mt-1" />
            <div className="flex-1">
              <Label htmlFor="first-time" className="text-base font-medium block mb-1">
                First time connecting to HubSpot
              </Label>
              <p className="text-gray-600 text-sm">
                You haven't installed the Learnlynk app in your HubSpot portal yet.
                We'll guide you through setting up your organization and installing our app.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3 rounded-md hover:bg-gray-50">
            <RadioGroupItem id="existing-user" value="existing-user" className="mt-1" />
            <div className="flex-1">
              <Label htmlFor="existing-user" className="text-base font-medium block mb-1">
                Already installed Learnlynk
              </Label>
              <p className="text-gray-600 text-sm">
                You've already installed the Learnlynk app in your HubSpot portal.
                You'll need the unique code displayed in your HubSpot app to continue.
              </p>
            </div>
          </div>
        </RadioGroup>

        <div className="mt-6 flex justify-end">
          <Button
            onClick={handleContinue}
            disabled={!choice}
            className="bg-saas-blue hover:bg-blue-600"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default IntegrationChoiceScreen;
