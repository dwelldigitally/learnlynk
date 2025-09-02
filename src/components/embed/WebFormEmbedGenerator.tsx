import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Copy, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function WebFormEmbedGenerator() {
  const { toast } = useToast();
  const [config, setConfig] = useState({
    title: 'Apply Now',
    description: 'Submit your application to get started with your educational journey.',
    submitButtonText: 'Submit Application',
    successMessage: 'Thank you for your application! We will contact you soon.',
    width: '600',
    height: '800',
    bgColor: '#ffffff',
    textColor: '#000000',
    primaryColor: '#3B82F6'
  });

  const generateEmbedUrl = () => {
    const params = new URLSearchParams();
    if (config.title !== 'Apply Now') params.set('title', config.title);
    if (config.description !== 'Submit your application to get started with your educational journey.') params.set('description', config.description);
    if (config.submitButtonText !== 'Submit Application') params.set('submitText', config.submitButtonText);
    if (config.successMessage !== 'Thank you for your application! We will contact you soon.') params.set('successMessage', config.successMessage);
    if (config.bgColor !== '#ffffff') params.set('bgColor', config.bgColor);
    if (config.textColor !== '#000000') params.set('textColor', config.textColor);
    if (config.primaryColor !== '#3B82F6') params.set('primaryColor', config.primaryColor);
    params.set('target', 'parent');
    
    const baseUrl = window.location.origin;
    return `${baseUrl}/embed/webform${params.toString() ? '?' + params.toString() : ''}`;
  };

  const generateIframeCode = () => {
    const embedUrl = generateEmbedUrl();
    return `<iframe 
  src="${embedUrl}" 
  width="${config.width}" 
  height="${config.height}"
  frameborder="0" 
  scrolling="auto"
  title="Application Form">
</iframe>`;
  };

  const generateScriptCode = () => {
    const baseUrl = window.location.origin;
    
    const embedConfig = {
      title: config.title,
      description: config.description,
      submitText: config.submitButtonText,
      successMessage: config.successMessage,
      bgColor: config.bgColor,
      textColor: config.textColor,
      primaryColor: config.primaryColor
    };
    
    return `<div id="wcc-webform-container"></div>
<script>
(function() {
  var config = ${JSON.stringify(embedConfig)};
  var baseUrl = '${baseUrl}';
  var container = document.getElementById('wcc-webform-container');
  
  // Create the form HTML directly
  var formHtml = \`
    <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; background: \${config.bgColor}; color: \${config.textColor}; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
      <h2 style="margin-bottom: 8px; font-size: 24px; font-weight: bold;">\${config.title}</h2>
      <p style="margin-bottom: 24px; color: #666;">\${config.description}</p>
      
      <form id="wcc-embed-form">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
          <div>
            <label style="display: block; margin-bottom: 8px; font-weight: 500;">First Name *</label>
            <input type="text" name="firstName" required style="width: 100%; padding: 8px 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px;">
          </div>
          <div>
            <label style="display: block; margin-bottom: 8px; font-weight: 500;">Last Name *</label>
            <input type="text" name="lastName" required style="width: 100%; padding: 8px 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px;">
          </div>
        </div>
        
        <div style="margin-bottom: 16px;">
          <label style="display: block; margin-bottom: 8px; font-weight: 500;">Email Address *</label>
          <input type="email" name="email" required style="width: 100%; padding: 8px 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px;">
        </div>
        
        <div style="margin-bottom: 24px;">
          <label style="display: block; margin-bottom: 8px; font-weight: 500;">Program of Interest *</label>
          <select name="programInterest" required style="width: 100%; padding: 8px 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px;">
            <option value="">Select a program</option>
            <option value="Health Care Assistant">Health Care Assistant</option>
            <option value="Education Assistant">Education Assistant</option>
            <option value="Aviation">Aviation</option>
            <option value="Hospitality">Hospitality</option>
            <option value="ECE">ECE</option>
            <option value="MLA">MLA</option>
          </select>
        </div>
        
        <button type="submit" style="width: 100%; padding: 12px; background: \${config.primaryColor}; color: white; border: none; border-radius: 4px; font-size: 16px; font-weight: 500; cursor: pointer;">\${config.submitText}</button>
      </form>
      
      <div id="wcc-success-message" style="display: none; text-align: center; padding: 20px;">
        <div style="color: #22c55e; font-size: 18px; font-weight: bold; margin-bottom: 8px;">✓ Success!</div>
        <p>\${config.successMessage}</p>
      </div>
    </div>
  \`;
  
  container.innerHTML = formHtml;
  
  // Handle form submission
  document.getElementById('wcc-embed-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    var formData = new FormData(e.target);
    var data = {
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      email: formData.get('email'),
      phone: '',
      country: '',
      programInterest: [formData.get('programInterest')],
      notes: 'Application submitted via embedded webform for ' + formData.get('programInterest'),
      applicationType: 'embedded-webform'
    };
    
    var submitButton = e.target.querySelector('button[type="submit"]');
    submitButton.textContent = 'Submitting...';
    submitButton.disabled = true;
    
    // Submit to Supabase edge function
    fetch(baseUrl + '/functions/v1/submit-document-form', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(result) {
      if (result.error) {
        throw new Error(result.error.message || 'Submission failed');
      }
      
      // Hide form and show success message
      document.getElementById('wcc-embed-form').style.display = 'none';
      document.getElementById('wcc-success-message').style.display = 'block';
      
      // Redirect to portal after delay
      if (result.portalUrl) {
        setTimeout(function() {
          window.location.href = result.portalUrl;
        }, 2000);
      }
    })
    .catch(function(error) {
      console.error('Error:', error);
      alert('There was an error submitting your application. Please try again.');
      submitButton.textContent = config.submitText;
      submitButton.disabled = false;
    });
  });
})();
</script>`;
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied!",
        description: `${type} code copied to clipboard.`,
      });
    });
  };

  const openPreview = () => {
    window.open(generateEmbedUrl(), '_blank');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Generate Embed Code for Application Form
          </CardTitle>
          <CardDescription>
            Customize your application form and generate embed code for your website.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Form Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Form Title</Label>
              <Input
                id="title"
                value={config.title}
                onChange={(e) => setConfig(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Apply Now"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="submitText">Submit Button Text</Label>
              <Input
                id="submitText"
                value={config.submitButtonText}
                onChange={(e) => setConfig(prev => ({ ...prev, submitButtonText: e.target.value }))}
                placeholder="Submit Application"
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Form Description</Label>
              <Textarea
                id="description"
                value={config.description}
                onChange={(e) => setConfig(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Submit your application to get started with your educational journey."
                rows={2}
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="successMessage">Success Message</Label>
              <Textarea
                id="successMessage"
                value={config.successMessage}
                onChange={(e) => setConfig(prev => ({ ...prev, successMessage: e.target.value }))}
                placeholder="Thank you for your application! We will contact you soon."
                rows={2}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="width">Width (px)</Label>
              <Input
                id="width"
                type="number"
                value={config.width}
                onChange={(e) => setConfig(prev => ({ ...prev, width: e.target.value }))}
                placeholder="600"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="height">Height (px)</Label>
              <Input
                id="height"
                type="number"
                value={config.height}
                onChange={(e) => setConfig(prev => ({ ...prev, height: e.target.value }))}
                placeholder="800"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bgColor">Background Color</Label>
              <div className="flex gap-2">
                <Input
                  id="bgColor"
                  value={config.bgColor}
                  onChange={(e) => setConfig(prev => ({ ...prev, bgColor: e.target.value }))}
                  placeholder="#ffffff"
                />
                <input
                  type="color"
                  value={config.bgColor}
                  onChange={(e) => setConfig(prev => ({ ...prev, bgColor: e.target.value }))}
                  className="w-12 h-10 rounded border"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="textColor">Text Color</Label>
              <div className="flex gap-2">
                <Input
                  id="textColor"
                  value={config.textColor}
                  onChange={(e) => setConfig(prev => ({ ...prev, textColor: e.target.value }))}
                  placeholder="#000000"
                />
                <input
                  type="color"
                  value={config.textColor}
                  onChange={(e) => setConfig(prev => ({ ...prev, textColor: e.target.value }))}
                  className="w-12 h-10 rounded border"
                />
              </div>
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="primaryColor">Primary Color (buttons, links)</Label>
              <div className="flex gap-2">
                <Input
                  id="primaryColor"
                  value={config.primaryColor}
                  onChange={(e) => setConfig(prev => ({ ...prev, primaryColor: e.target.value }))}
                  placeholder="#3B82F6"
                />
                <input
                  type="color"
                  value={config.primaryColor}
                  onChange={(e) => setConfig(prev => ({ ...prev, primaryColor: e.target.value }))}
                  className="w-12 h-10 rounded border"
                />
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={openPreview} variant="outline" className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              Preview Form
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Generated Code */}
      <Card>
        <CardHeader>
          <CardTitle>Embed Code</CardTitle>
          <CardDescription>
            Copy and paste this code into your website where you want the form to appear.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="iframe" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="iframe">Iframe (Limited)</TabsTrigger>
              <TabsTrigger value="script">JavaScript Shortcode</TabsTrigger>
            </TabsList>
            
            <TabsContent value="iframe" className="space-y-4">
              <div className="space-y-2">
                <Label>Iframe Embed Code</Label>
                <div className="relative">
                  <Textarea
                    value={generateIframeCode()}
                    readOnly
                    className="font-mono text-sm"
                    rows={8}
                  />
                  <Button
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(generateIframeCode(), "Iframe")}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  <strong>⚠️ Limited:</strong> Iframe embeds cannot redirect users to the student portal. Use JavaScript Shortcode for full functionality.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="script" className="space-y-4">
              <div className="space-y-2">
                <Label>JavaScript Embed Code</Label>
                <div className="relative">
                  <Textarea
                    value={generateScriptCode()}
                    readOnly
                    className="font-mono text-sm"
                    rows={15}
                  />
                  <Button
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(generateScriptCode(), "Script")}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  <strong>✅ Recommended:</strong> Full functionality with proper portal redirection. The form is injected directly into your page.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}