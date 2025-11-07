import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AIEmailInbox } from '@/components/admin/communication/AIEmailInbox';
import { PageHeader } from '@/components/modern/PageHeader';

const AIEmailManagementPage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-6 py-8">
        {/* Modern Header */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/admin/communication')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Communication
          </Button>
          
          <PageHeader
            title="AI Email Management"
            subtitle="Intelligent email inbox with AI-powered insights, lead matching, and automated response suggestions"
          />
        </div>

        <AIEmailInbox />
      </div>
    </div>
  );
};

export default AIEmailManagementPage;