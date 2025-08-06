import React from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Sparkles, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AIEmailInbox } from '@/components/admin/communication/AIEmailInbox';
import EmailManagement from '@/components/admin/EmailManagement';

const AIEmailManagementPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 px-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/admin/communication')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Communication Hub
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">AI Email Management</h1>
            <p className="text-muted-foreground">Advanced email management with AI-powered insights and automation</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="ai-inbox" className="space-y-4">
        <TabsList>
          <TabsTrigger value="ai-inbox" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            AI Email Hub
          </TabsTrigger>
          <TabsTrigger value="email-management" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email Management
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ai-inbox" className="space-y-4">
          <AIEmailInbox />
        </TabsContent>

        <TabsContent value="email-management" className="space-y-4">
          <EmailManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIEmailManagementPage;