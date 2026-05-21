import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { FloatingMenu, BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import BubbleMenuExtension from '@tiptap/extension-bubble-menu';
import FloatingMenuExtension from '@tiptap/extension-floating-menu';
import { motion } from 'motion/react';
import { Bold, Italic, Heading2, Heading3, List, ListOrdered } from 'lucide-react';

interface ProposalEditorProps {
  content: string;
  onChange: (html: string) => void;
}

const ProposalEditor = ({ content, onChange }: ProposalEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      BubbleMenuExtension,
      FloatingMenuExtension,
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose prose-sm md:prose-base focus:outline-none max-w-none prose-slate min-h-[500px] p-8 bg-white rounded-3xl border border-slate-200 shadow-sm transition-all text-start',
      },
    },
  });

  // Re-sync content if it changes externally (e.g. AI generation)
  React.useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="relative group">
      <BubbleMenu editor={editor}>
        <div className="flex items-center gap-1 bg-slate-900 text-white p-1 rounded-xl shadow-2xl border border-slate-800">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded-lg hover:bg-slate-800 transition-colors ${editor.isActive('bold') ? 'text-primary bg-slate-800' : ''}`}
          >
            <Bold size={16} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded-lg hover:bg-slate-800 transition-colors ${editor.isActive('italic') ? 'text-primary bg-slate-800' : ''}`}
          >
            <Italic size={16} />
          </button>
          <div className="w-px h-4 bg-slate-700 mx-1" />
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`p-2 rounded-lg hover:bg-slate-800 transition-colors ${editor.isActive('heading', { level: 2 }) ? 'text-primary bg-slate-800' : ''}`}
          >
            <Heading2 size={16} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`p-2 rounded-lg hover:bg-slate-800 transition-colors ${editor.isActive('heading', { level: 3 }) ? 'text-primary bg-slate-800' : ''}`}
          >
            <Heading3 size={16} />
          </button>
        </div>
      </BubbleMenu>

      <FloatingMenu editor={editor}>
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl shadow-xl border border-slate-200">
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className="p-2 text-slate-500 hover:text-primary hover:bg-slate-50 rounded-lg flex items-center gap-2 text-xs font-bold"
          >
            <Heading2 size={14} /> Title
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className="p-2 text-slate-500 hover:text-primary hover:bg-slate-50 rounded-lg flex items-center gap-2 text-xs font-bold"
          >
            <List size={14} /> Bullet List
          </button>
        </div>
      </FloatingMenu>

      <EditorContent editor={editor} />
    </div>
  );
};

export default ProposalEditor;
