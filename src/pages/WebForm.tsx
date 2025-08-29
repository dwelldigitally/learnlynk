import React from 'react';
import { WebForm } from '@/components/WebForm';

export default function WebFormPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center p-4">
      <WebForm />
    </div>
  );
}