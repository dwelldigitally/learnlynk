import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Code, Eye, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmailContentEditorProps {
  content: string;
  htmlContent?: string;
  contentFormat: 'plain' | 'html' | 'rich';
  onContentChange: (content: string, htmlContent?: string, format?: 'plain' | 'html' | 'rich') => void;
  onPreview?: () => void;
}

export function EmailContentEditor({
  content,
  htmlContent,
  contentFormat,
  onContentChange,
  onPreview,
}: EmailContentEditorProps) {
  const [activeTab, setActiveTab] = useState<'visual' | 'html' | 'plain'>(
    contentFormat === 'html' ? 'html' : contentFormat === 'rich' ? 'visual' : 'plain'
  );

  const handleTabChange = (value: string) => {
    const tab = value as 'visual' | 'html' | 'plain';
    setActiveTab(tab);
    
    if (tab === 'visual') {
      onContentChange(content, htmlContent, 'rich');
    } else if (tab === 'html') {
      onContentChange(content, htmlContent || content, 'html');
    } else {
      onContentChange(content, undefined, 'plain');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Email Content</Label>
        {onPreview && (
          <Button variant="outline" size="sm" onClick={onPreview}>
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="visual" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Visual Editor
          </TabsTrigger>
          <TabsTrigger value="html" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            HTML Code
          </TabsTrigger>
          <TabsTrigger value="plain" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Plain Text
          </TabsTrigger>
        </TabsList>

        <TabsContent value="visual" className="mt-4">
          <RichTextEditor
            content={htmlContent || content}
            onChange={(newContent) => {
              onContentChange(newContent, newContent, 'rich');
            }}
            placeholder="Compose your email with rich formatting..."
            className="min-h-[400px]"
          />
        </TabsContent>

        <TabsContent value="html" className="mt-4">
          <Textarea
            value={htmlContent || content}
            onChange={(e) => onContentChange(content, e.target.value, 'html')}
            placeholder="Enter HTML code for your email..."
            className="min-h-[400px] font-mono text-sm"
          />
          <p className="text-sm text-muted-foreground mt-2">
            Enter raw HTML code. Variables like {'{{first_name}}'} will be replaced when sending.
          </p>
        </TabsContent>

        <TabsContent value="plain" className="mt-4">
          <Textarea
            value={content}
            onChange={(e) => onContentChange(e.target.value, undefined, 'plain')}
            placeholder="Enter plain text for your email..."
            className="min-h-[400px]"
          />
          <p className="text-sm text-muted-foreground mt-2">
            Plain text fallback. Variables like {'{{first_name}}'} will be replaced when sending.
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
