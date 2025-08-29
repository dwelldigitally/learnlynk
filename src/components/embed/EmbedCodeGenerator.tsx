import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Eye, Code2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function EmbedCodeGenerator() {
  const [config, setConfig] = useState({
    title: 'Submit Your Documents',
    description: 'Upload your application documents and get instant access to your student portal',
    submitButtonText: 'Submit Document & Access Portal',
    successMessage: 'Document Submitted Successfully!',
    width: '800',
    height: '1000',
    bgColor: '#ffffff',
    textColor: '#000000',
    primaryColor: '#3b82f6'
  });

  const baseUrl = window.location.origin;
  
  const generateEmbedUrl = () => {
    const params = new URLSearchParams();
    if (config.title !== 'Submit Your Documents') params.set('title', config.title);
    if (config.description !== 'Upload your application documents and get instant access to your student portal') {
      params.set('description', config.description);
    }
    if (config.submitButtonText !== 'Submit Document & Access Portal') {
      params.set('submitText', config.submitButtonText);
    }
    if (config.successMessage !== 'Document Submitted Successfully!') {
      params.set('successMessage', config.successMessage);
    }
    if (config.bgColor !== '#ffffff') params.set('bgColor', config.bgColor);
    if (config.textColor !== '#000000') params.set('textColor', config.textColor);
    if (config.primaryColor !== '#3b82f6') params.set('primaryColor', config.primaryColor);
    
    params.set('target', 'parent');
    
    const queryString = params.toString();
    return `${baseUrl}/embed/document-form${queryString ? `?${queryString}` : ''}`;
  };

  const generateIframeCode = () => {
    const embedUrl = generateEmbedUrl();
    return `<iframe 
  src="${embedUrl}"
  width="${config.width}" 
  height="${config.height}"
  frameborder="0"
  style="border: none; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);"
  allow="camera; microphone"
></iframe>`;
  };

  const generateScriptCode = () => {
    const embedUrl = generateEmbedUrl();
    return `<!-- LearnLynk Document Submission Form -->
<div id="learnlynk-document-form"></div>
<script>
(function() {
  var iframe = document.createElement('iframe');
  iframe.src = '${embedUrl}';
  iframe.width = '${config.width}';
  iframe.height = '${config.height}';
  iframe.frameBorder = '0';
  iframe.style.border = 'none';
  iframe.style.borderRadius = '8px';
  iframe.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
  iframe.allow = 'camera; microphone';
  
  // Listen for success messages
  window.addEventListener('message', function(event) {
    if (event.data.type === 'DOCUMENT_FORM_SUCCESS') {
      console.log('Document form submitted successfully:', event.data.data);
      // You can add custom success handling here
      // For example: window.location.href = event.data.data.portalUrl;
    }
  });
  
  document.getElementById('learnlynk-document-form').appendChild(iframe);
})();
</script>`;
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: `${type} code copied to clipboard.`
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Please copy the code manually.",
        variant: "destructive"
      });
    }
  };

  const openPreview = () => {
    const embedUrl = generateEmbedUrl();
    window.open(embedUrl, '_blank', 'width=900,height=1100,scrollbars=yes,resizable=yes');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code2 className="w-5 h-5" />
            Embed Code Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Form Configuration</h3>
              
              <div>
                <Label htmlFor="title">Form Title</Label>
                <Input
                  id="title"
                  value={config.title}
                  onChange={(e) => setConfig(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={config.description}
                  onChange={(e) => setConfig(prev => ({ ...prev, description: e.target.value }))}
                  rows={2}
                />
              </div>
              
              <div>
                <Label htmlFor="submitText">Submit Button Text</Label>
                <Input
                  id="submitText"
                  value={config.submitButtonText}
                  onChange={(e) => setConfig(prev => ({ ...prev, submitButtonText: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="successMessage">Success Message</Label>
                <Input
                  id="successMessage"
                  value={config.successMessage}
                  onChange={(e) => setConfig(prev => ({ ...prev, successMessage: e.target.value }))}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold">Styling & Dimensions</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="width">Width (px)</Label>
                  <Input
                    id="width"
                    value={config.width}
                    onChange={(e) => setConfig(prev => ({ ...prev, width: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="height">Height (px)</Label>
                  <Input
                    id="height"
                    value={config.height}
                    onChange={(e) => setConfig(prev => ({ ...prev, height: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="bgColor">Background</Label>
                  <div className="flex gap-2">
                    <Input
                      id="bgColor"
                      type="color"
                      value={config.bgColor}
                      onChange={(e) => setConfig(prev => ({ ...prev, bgColor: e.target.value }))}
                      className="w-12 h-10 p-1"
                    />
                    <Input
                      value={config.bgColor}
                      onChange={(e) => setConfig(prev => ({ ...prev, bgColor: e.target.value }))}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="textColor">Text Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="textColor"
                      type="color"
                      value={config.textColor}
                      onChange={(e) => setConfig(prev => ({ ...prev, textColor: e.target.value }))}
                      className="w-12 h-10 p-1"
                    />
                    <Input
                      value={config.textColor}
                      onChange={(e) => setConfig(prev => ({ ...prev, textColor: e.target.value }))}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={config.primaryColor}
                      onChange={(e) => setConfig(prev => ({ ...prev, primaryColor: e.target.value }))}
                      className="w-12 h-10 p-1"
                    />
                    <Input
                      value={config.primaryColor}
                      onChange={(e) => setConfig(prev => ({ ...prev, primaryColor: e.target.value }))}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={openPreview} variant="outline" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Preview Form
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Embed Code</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="iframe" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="iframe">Simple Iframe</TabsTrigger>
              <TabsTrigger value="script">Advanced Script</TabsTrigger>
            </TabsList>
            
            <TabsContent value="iframe" className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Simple iframe embed - just copy and paste this code into your website:
              </p>
              <div className="relative">
                <Textarea
                  value={generateIframeCode()}
                  readOnly
                  className="font-mono text-sm min-h-[120px]"
                />
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(generateIframeCode(), 'Iframe')}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="script" className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Advanced script embed with event handling - ideal for custom integrations:
              </p>
              <div className="relative">
                <Textarea
                  value={generateScriptCode()}
                  readOnly
                  className="font-mono text-sm min-h-[200px]"
                />
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(generateScriptCode(), 'Script')}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}