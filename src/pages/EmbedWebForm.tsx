import React from 'react';
import { useSearchParams } from 'react-router-dom';
import EmbeddableWebForm from '@/components/embed/EmbeddableWebForm';

export default function EmbedWebForm() {
  const [searchParams] = useSearchParams();
  
  // Parse embed configuration from URL parameters
  const embedConfig = {
    title: searchParams.get('title') || undefined,
    description: searchParams.get('description') || undefined,
    submitButtonText: searchParams.get('submitText') || undefined,
    successMessage: searchParams.get('successMessage') || undefined,
  };

  // Parse custom styles from URL parameters
  const customStyles: React.CSSProperties = {};
  
  const bgColor = searchParams.get('bgColor');
  const textColor = searchParams.get('textColor');
  const primaryColor = searchParams.get('primaryColor');
  
  if (bgColor) customStyles.backgroundColor = bgColor;
  if (textColor) customStyles.color = textColor;
  
  // Apply CSS custom properties for theme colors
  React.useEffect(() => {
    if (primaryColor) {
      document.documentElement.style.setProperty('--primary', primaryColor);
    }
  }, [primaryColor]);

  const handleSuccess = (data: { accessToken: string; portalUrl: string }) => {
    // For embedded forms, we can either redirect or post a message to parent
    const target = searchParams.get('target');
    
    if (target === 'parent' && window.parent !== window) {
      // Post message to parent window for iframe embeds
      window.parent.postMessage({
        type: 'WEBFORM_SUCCESS',
        data: {
          accessToken: data.accessToken,
          portalUrl: data.portalUrl
        }
      }, '*');
    } else {
      // Direct redirect
      window.location.href = data.portalUrl;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <EmbeddableWebForm
        onSuccess={handleSuccess}
        customStyles={customStyles}
        embedConfig={embedConfig}
      />
    </div>
  );
}