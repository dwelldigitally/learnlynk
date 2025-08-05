import React from 'react';
import { UniversalBuilder } from '@/components/universal-builder/UniversalBuilder';
import { useNavigate } from 'react-router-dom';

export function UniversalBuilderPage() {
  const navigate = useNavigate();

  const handleSave = (config: any) => {
    console.log('Saving config:', config);
    // Here you would save to your backend
  };

  const handleCancel = () => {
    navigate('/admin');
  };

  return (
    <UniversalBuilder
      builderType="form"
      onSave={handleSave}
      onCancel={handleCancel}
    />
  );
}