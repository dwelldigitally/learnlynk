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
    const embedUrl = generateEmbedUrl();
    return `<div id="webform-embed"></div>
<script>
(function() {
  var iframe = document.createElement('iframe');
  iframe.src = '${embedUrl}';
  iframe.width = '${config.width}';
  iframe.height = '${config.height}';
  iframe.frameBorder = '0';
  iframe.scrolling = 'auto';
  iframe.title = 'Application Form';
  
  // Listen for success messages from the embedded form
  window.addEventListener('message', function(event) {
    if (event.data.type === 'WEBFORM_SUCCESS') {
      console.log('Form submitted successfully:', event.data.data);
      // You can add custom logic here, such as:
      // - Redirecting to a thank you page
      // - Showing a success message
      // - Tracking the conversion
    }
  });
  
  document.getElementById('webform-embed').appendChild(iframe);
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
              <TabsTrigger value="iframe">Simple Iframe</TabsTrigger>
              <TabsTrigger value="script">Advanced Script</TabsTrigger>
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
                  Simple iframe embed - just copy and paste this code into your HTML.
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
                  Advanced embed with event handling - allows you to listen for form submission events.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}