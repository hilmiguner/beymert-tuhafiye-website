"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useState } from "react";

import type { Json } from "@/types/database";

type RichTextEditorProps = {
  name: string;
  initialValue: Json | null;
  initialText: string;
  label: string;
  placeholder: string;
};

function initialDocument(value: Json | null, fallbackText: string) {
  if (
    value &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    value.type === "doc"
  ) {
    return value;
  }

  return {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: fallbackText
          ? [
              {
                type: "text",
                text: fallbackText,
              },
            ]
          : [],
      },
    ],
  };
}

export function RichTextEditor({
  name,
  initialValue,
  initialText,
  label,
  placeholder,
}: RichTextEditorProps) {
  const initialContent = initialDocument(initialValue, initialText);
  const [serialized, setSerialized] = useState(() =>
    JSON.stringify(initialContent),
  );

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
    ],
    content: initialContent,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "min-h-56 px-4 py-4 text-sm leading-7 text-foreground outline-none " +
          "[&_h2]:mb-3 [&_h2]:mt-5 [&_h2]:text-2xl [&_h2]:font-extrabold " +
          "[&_h3]:mb-2 [&_h3]:mt-4 [&_h3]:text-xl [&_h3]:font-extrabold " +
          "[&_p]:my-3 [&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-6 " +
          "[&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-6 " +
          "[&_blockquote]:my-4 [&_blockquote]:border-l-4 [&_blockquote]:border-primary/30 " +
          "[&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted",
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      setSerialized(JSON.stringify(currentEditor.getJSON()));
    },
  });

  const toolbarButton =
    "min-h-9 rounded-control border border-border bg-white px-3 text-xs font-extrabold " +
    "transition hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 " +
    "focus-visible:ring-primary/40";

  return (
    <div className="md:col-span-2">
      <span className="mb-2 block text-sm font-extrabold">{label}</span>
      <input type="hidden" name={name} value={serialized} />

      <div className="overflow-hidden rounded-control border border-border bg-white focus-within:border-primary">
        <div
          className="flex flex-wrap gap-2 border-b border-border bg-surface-muted p-2"
          aria-label="Metin biçimlendirme araçları"
        >
          <button
            type="button"
            className={toolbarButton}
            onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
          >
            Başlık
          </button>
          <button
            type="button"
            className={toolbarButton}
            onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
          >
            Alt Başlık
          </button>
          <button
            type="button"
            className={toolbarButton}
            onClick={() => editor?.chain().focus().toggleBold().run()}
          >
            Kalın
          </button>
          <button
            type="button"
            className={toolbarButton}
            onClick={() => editor?.chain().focus().toggleItalic().run()}
          >
            İtalik
          </button>
          <button
            type="button"
            className={toolbarButton}
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
          >
            • Liste
          </button>
          <button
            type="button"
            className={toolbarButton}
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          >
            1. Liste
          </button>
          <button
            type="button"
            className={toolbarButton}
            onClick={() => editor?.chain().focus().toggleBlockquote().run()}
          >
            Alıntı
          </button>
          <button
            type="button"
            className={toolbarButton}
            onClick={() => editor?.chain().focus().undo().run()}
          >
            Geri Al
          </button>
          <button
            type="button"
            className={toolbarButton}
            onClick={() => editor?.chain().focus().redo().run()}
          >
            İleri Al
          </button>
        </div>

        {!editor ? (
          <div className="min-h-56 p-4 text-sm text-muted">Editör hazırlanıyor…</div>
        ) : (
          <EditorContent editor={editor} />
        )}
      </div>

      <p className="mt-2 text-xs leading-5 text-muted">{placeholder}</p>
    </div>
  );
}
