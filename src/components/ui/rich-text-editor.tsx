import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  Strikethrough, 
  Code,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List, 
  ListOrdered,
  Heading1,
  Heading2,
  Quote,
  Link as LinkIcon,
  Minus,
  Undo,
  Redo,
  Maximize2,
  Minimize2,
  RemoveFormatting
} from 'lucide-react';
import { PersonalizationPicker } from '@/components/universal-builder/PersonalizationPicker';
import { EmailTemplateSelector } from '@/components/universal-builder/EmailTemplateSelector';
import { Separator } from './separator';
import React from 'react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

export const RichTextEditor = ({ content, onChange, placeholder, className }: RichTextEditorProps) => {
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline',
        },
      }),
      Placeholder.configure({
        placeholder: placeholder || 'Start typing your email content...',
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const insertPersonalizationToken = (token: string) => {
    if (editor) {
      editor.chain().focus().insertContent(token).run();
    }
  };

  const loadTemplate = (html: string) => {
    if (editor) {
      editor.commands.setContent(html);
    }
  };

  const addLink = () => {
    const url = window.prompt('Enter URL:');
    if (url && editor) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <div className={cn(
      "border rounded-lg bg-background",
      isFullscreen && "fixed inset-4 z-50 shadow-2xl",
      className
    )}>
      {/* Main Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 border-b bg-muted/30">
        {/* Templates & Variables */}
        <div className="flex gap-1 pr-2 border-r">
          <EmailTemplateSelector onSelect={loadTemplate} />
          <PersonalizationPicker onInsert={insertPersonalizationToken} />
        </div>

        {/* Text Formatting */}
        <div className="flex gap-1 pr-2 border-r">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive('bold') ? 'bg-accent' : ''}
            title="Bold"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive('italic') ? 'bg-accent' : ''}
            title="Italic"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={editor.isActive('underline') ? 'bg-accent' : ''}
            title="Underline"
          >
            <UnderlineIcon className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={editor.isActive('strike') ? 'bg-accent' : ''}
            title="Strikethrough"
          >
            <Strikethrough className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={editor.isActive('code') ? 'bg-accent' : ''}
            title="Code"
          >
            <Code className="h-4 w-4" />
          </Button>
        </div>

        {/* Headings & Styles */}
        <div className="flex gap-1 pr-2 border-r">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={editor.isActive('heading', { level: 1 }) ? 'bg-accent' : ''}
            title="Heading 1"
          >
            <Heading1 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={editor.isActive('heading', { level: 2 }) ? 'bg-accent' : ''}
            title="Heading 2"
          >
            <Heading2 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={editor.isActive('blockquote') ? 'bg-accent' : ''}
            title="Quote"
          >
            <Quote className="h-4 w-4" />
          </Button>
        </div>

        {/* Alignment */}
        <div className="flex gap-1 pr-2 border-r">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={editor.isActive({ textAlign: 'left' }) ? 'bg-accent' : ''}
            title="Align Left"
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={editor.isActive({ textAlign: 'center' }) ? 'bg-accent' : ''}
            title="Align Center"
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={editor.isActive({ textAlign: 'right' }) ? 'bg-accent' : ''}
            title="Align Right"
          >
            <AlignRight className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            className={editor.isActive({ textAlign: 'justify' }) ? 'bg-accent' : ''}
            title="Justify"
          >
            <AlignJustify className="h-4 w-4" />
          </Button>
        </div>

        {/* Lists */}
        <div className="flex gap-1 pr-2 border-r">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive('bulletList') ? 'bg-accent' : ''}
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive('orderedList') ? 'bg-accent' : ''}
            title="Numbered List"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
        </div>

        {/* Links & Other */}
        <div className="flex gap-1 pr-2 border-r">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={addLink}
            className={editor.isActive('link') ? 'bg-accent' : ''}
            title="Add Link"
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            title="Horizontal Rule"
          >
            <Minus className="h-4 w-4" />
          </Button>
        </div>

        {/* Undo/Redo */}
        <div className="flex gap-1 pr-2 border-r">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="Undo"
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="Redo"
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>

        {/* Clear & Fullscreen */}
        <div className="flex gap-1 ml-auto">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
            title="Clear Formatting"
          >
            <RemoveFormatting className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Editor Content */}
      <EditorContent 
        editor={editor} 
        className={cn(
          "prose prose-sm max-w-none p-6 focus:outline-none overflow-y-auto",
          isFullscreen ? "h-[calc(100vh-10rem)]" : "min-h-[400px]"
        )}
      />
    </div>
  );
};
