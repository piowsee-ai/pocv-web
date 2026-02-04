"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Bold, Italic, List, ListOrdered, Undo, Redo } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

interface RichTextEditorProps {
  /** HTML content string */
  value: string;
  /** Callback when content changes (returns HTML string) */
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  /** If true, shows list formatting buttons. Default: true */
  showListButtons?: boolean;
  /** Minimum height in pixels. Default: 100 */
  minHeight?: number;
  /** Maximum character length (plain text, not HTML). If set, content will be truncated. */
  maxLength?: number;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Tulis di sini...",
  className,
  showListButtons = true,
  minHeight = 100,
  maxLength,
}: RichTextEditorProps) {
  const isInternalUpdate = useRef(false);
  const [charCount, setCharCount] = useState(0);
  const isAtLimit = maxLength !== undefined && charCount >= maxLength;

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: "is-editor-empty",
      }),
    ],
    content: value || "",
    editorProps: {
      attributes: {
        class: `prose prose-sm max-w-none focus:outline-none px-3 py-2`,
        style: `min-height: ${minHeight}px`,
      },
      // Prevent input if at maxLength
      handleTextInput: maxLength ? (view, from, to, text) => {
        const currentLength = view.state.doc.textContent.length;
        const selectionLength = to - from;
        const newLength = currentLength - selectionLength + text.length;

        if (newLength > maxLength) {
          // Calculate how many chars we can still add
          const allowedChars = maxLength - (currentLength - selectionLength);
          if (allowedChars <= 0) {
            return true; // Block entire input
          }
          // Insert only the allowed portion
          const truncatedText = text.slice(0, allowedChars);
          const tr = view.state.tr.insertText(truncatedText, from, to);
          view.dispatch(tr);
          return true; // We handled it
        }
        return false; // Let default handling proceed
      } : undefined,
      // Handle paste with truncation
      handlePaste: maxLength ? (view, event) => {
        const clipboardText = event.clipboardData?.getData('text/plain') || '';
        if (!clipboardText) return false;

        const { from, to } = view.state.selection;
        const currentLength = view.state.doc.textContent.length;
        const selectionLength = to - from;
        const availableSpace = maxLength - (currentLength - selectionLength);

        if (clipboardText.length > availableSpace) {
          // Truncate pasted text
          const truncatedText = clipboardText.slice(0, Math.max(0, availableSpace));
          if (truncatedText) {
            const tr = view.state.tr.insertText(truncatedText, from, to);
            view.dispatch(tr);
          }
          return true; // We handled it
        }
        return false; // Let default handling proceed
      } : undefined,
    },
    onUpdate: ({ editor }) => {
      isInternalUpdate.current = true;

      const html = editor.getHTML();
      const plainTextLength = editor.getText().length;
      setCharCount(plainTextLength);

      // Only return empty string if truly empty
      const isEmpty = editor.isEmpty;
      onChange(isEmpty ? "" : html);

      setTimeout(() => {
        isInternalUpdate.current = false;
      }, 0);
    },
  });

  // Update editor content when value changes externally
  useEffect(() => {
    if (editor && !isInternalUpdate.current) {
      const currentHtml = editor.getHTML();
      // Normalize comparison - treat empty p tags as empty
      const normalizedCurrent = currentHtml === "<p></p>" ? "" : currentHtml;
      const normalizedValue = value === "<p></p>" ? "" : (value || "");

      if (normalizedCurrent !== normalizedValue) {
        editor.commands.setContent(normalizedValue);
      }

      // Always sync charCount with current editor content
      setCharCount(editor.getText().length);
    }
  }, [value, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div
      className={cn(
        "border rounded-md overflow-hidden focus-within:ring-2",
        isAtLimit
          ? "border-red-500 focus-within:ring-red-500 focus-within:border-red-500"
          : "border-neutral-200 focus-within:ring-emerald-500 focus-within:border-emerald-500",
        className
      )}
    >
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-1.5 border-b border-neutral-200 bg-neutral-50">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </ToolbarButton>

        {showListButtons && (
          <>
            <div className="w-px h-5 bg-neutral-300 mx-1" />
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              isActive={editor.isActive("bulletList")}
              title="Bullet List"
            >
              <List className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              isActive={editor.isActive("orderedList")}
              title="Numbered List"
            >
              <ListOrdered className="w-4 h-4" />
            </ToolbarButton>
          </>
        )}

        <div className="w-px h-5 bg-neutral-300 mx-1" />
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Undo"
        >
          <Undo className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Redo"
        >
          <Redo className="w-4 h-4" />
        </ToolbarButton>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} />

      {/* Character Counter - only show when maxLength is set */}
      {maxLength !== undefined && (
        <div className={cn(
          "px-3 py-1.5 text-xs text-right border-t",
          isAtLimit
            ? "text-red-500 bg-red-50 border-red-200"
            : "text-neutral-500 bg-neutral-50 border-neutral-200"
        )}>
          {charCount} / {maxLength}
        </div>
      )}

      <style jsx global>{`
        .ProseMirror {
          min-height: ${minHeight}px;
        }
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #a3a3a3;
          pointer-events: none;
          height: 0;
        }
        .ProseMirror ul {
          list-style-type: disc;
          padding-left: 1.5rem;
        }
        .ProseMirror ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
        }
        .ProseMirror li {
          margin-bottom: 0.25rem;
        }
        .ProseMirror p {
          margin-bottom: 0.5rem;
        }
        .ProseMirror p:last-child {
          margin-bottom: 0;
        }
        .ProseMirror:focus {
          outline: none;
        }
        .ProseMirror strong {
          font-weight: 600;
        }
        .ProseMirror em {
          font-style: italic;
        }
      `}</style>
    </div>
  );
}

function ToolbarButton({
  onClick,
  isActive,
  disabled,
  title,
  children,
}: {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        "p-1.5 rounded transition-colors",
        isActive
          ? "bg-emerald-100 text-emerald-700"
          : "text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      {children}
    </button>
  );
}

/**
 * Helper function to convert HTML to array of plain text lines
 * Used for backward compatibility with PDF templates that expect string[]
 */
export function htmlToLines(html: string): string[] {
  if (!html || typeof window === "undefined") return [];

  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;

  const lines: string[] = [];

  // Process list items
  tempDiv.querySelectorAll("li").forEach((li) => {
    const text = li.textContent?.trim();
    if (text) lines.push(text);
  });

  // If no list items, get paragraph text
  if (lines.length === 0) {
    tempDiv.querySelectorAll("p").forEach((p) => {
      const text = p.textContent?.trim();
      if (text) lines.push(text);
    });
  }

  // Fallback to raw text
  if (lines.length === 0) {
    const text = tempDiv.textContent?.trim();
    if (text) lines.push(text);
  }

  return lines;
}

/**
 * Helper function to convert array of text lines to HTML bullet list
 * Used for migrating old data format
 */
export function linesToHtml(lines: string[]): string {
  if (!lines || lines.length === 0) return "";
  return `<ul>${lines.map((line) => `<li><p>${line}</p></li>`).join("")}</ul>`;
}
