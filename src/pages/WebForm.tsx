import React, { useState } from 'react';
import { WebForm } from '@/components/WebForm';
import { WebFormEmbedGenerator } from '@/components/embed/WebFormEmbedGenerator';
import { Button } from '@/components/ui/button';
import { Code, ArrowLeft } from 'lucide-react';

export default function WebFormPage() {
  const [showEmbedGenerator, setShowEmbedGenerator] = useState(false);

  if (showEmbedGenerator) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => setShowEmbedGenerator(false)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Form
            </Button>
            <h1 className="text-2xl font-bold">Generate Embed Code</h1>
          </div>
          <WebFormEmbedGenerator />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <div className="flex justify-center">
          <Button 
            variant="outline" 
            onClick={() => setShowEmbedGenerator(true)}
            className="flex items-center gap-2"
          >
            <Code className="w-4 h-4" />
            Generate Embed Code
          </Button>
        </div>
        <WebForm />
      </div>
    </div>
  );
}