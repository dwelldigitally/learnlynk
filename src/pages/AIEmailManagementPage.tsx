import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AIEmailInbox } from '@/components/admin/communication/AIEmailInbox';
const AIEmailManagementPage: React.FC = () => {
  const navigate = useNavigate();
  return <div className="space-y-4 px-6 my-[50px] mx-[20px]">
      {/* Compact Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => navigate('/admin/communication')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">AI Email Management</h1>
        </div>
      </div>

      <AIEmailInbox />
    </div>;
};
export default AIEmailManagementPage;