"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import ImageExtension from "@tiptap/extension-image"
import LinkExtension from "@tiptap/extension-link"
import Underline from "@tiptap/extension-underline"
import TextAlign from "@tiptap/extension-text-align"
import Placeholder from "@tiptap/extension-placeholder"
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  Heading1, Heading2, Heading3, List, ListOrdered,
  AlignLeft, AlignCenter, AlignRight,
  Link as LinkIcon, Image as ImageIcon,
  Undo, Redo, Quote, Code,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useEffect } from "react"

function ToolbarBtn({
  onClick, active, title, children,
}: {
  onClick: () => void
  active?: boolean
  title: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={cn(
        "h-7 w-7 flex items-center justify-center rounded transition-colors",
        active
          ? "bg-accent text-accent-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      {children}
    </button>
  )
}

function Sep() {
  return <div className="h-5 w-px bg-border mx-0.5" />
}

interface Props {
  value: string
  onChange: (html: string) => void
  placeholder?: string
  label?: string
  error?: string
}

export function RichEditor({ value, onChange, placeholder = "Начните вводить текст...", label, error }: Props) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      LinkExtension.configure({ openOnClick: false }),
      ImageExtension,
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: { class: "rich-editor-content" },
    },
  })

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "", { emitUpdate: false })
    }
  }, [value, editor])

  const addLink = () => {
    const url = window.prompt("URL ссылки:")
    if (url) editor?.chain().focus().setLink({ href: url }).run()
  }

  const addImage = () => {
    const url = window.prompt("URL изображения:")
    if (url) editor?.chain().focus().setImage({ src: url }).run()
  }

  return (
    <div className="flex flex-col gap-1.5">
      {label && <span className="text-sm font-medium">{label}</span>}
      <div className={cn("border rounded-lg overflow-hidden bg-input", error && "border-destructive")}>
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-0.5 p-1.5 border-b bg-card">
          <ToolbarBtn onClick={() => editor?.chain().focus().toggleBold().run()} active={editor?.isActive("bold")} title="Жирный">
            <Bold className="h-3.5 w-3.5" />
          </ToolbarBtn>
          <ToolbarBtn onClick={() => editor?.chain().focus().toggleItalic().run()} active={editor?.isActive("italic")} title="Курсив">
            <Italic className="h-3.5 w-3.5" />
          </ToolbarBtn>
          <ToolbarBtn onClick={() => editor?.chain().focus().toggleUnderline().run()} active={editor?.isActive("underline")} title="Подчёркивание">
            <UnderlineIcon className="h-3.5 w-3.5" />
          </ToolbarBtn>
          <ToolbarBtn onClick={() => editor?.chain().focus().toggleStrike().run()} active={editor?.isActive("strike")} title="Зачёркивание">
            <Strikethrough className="h-3.5 w-3.5" />
          </ToolbarBtn>

          <Sep />

          <ToolbarBtn onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()} active={editor?.isActive("heading", { level: 1 })} title="Заголовок 1">
            <Heading1 className="h-3.5 w-3.5" />
          </ToolbarBtn>
          <ToolbarBtn onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} active={editor?.isActive("heading", { level: 2 })} title="Заголовок 2">
            <Heading2 className="h-3.5 w-3.5" />
          </ToolbarBtn>
          <ToolbarBtn onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()} active={editor?.isActive("heading", { level: 3 })} title="Заголовок 3">
            <Heading3 className="h-3.5 w-3.5" />
          </ToolbarBtn>

          <Sep />

          <ToolbarBtn onClick={() => editor?.chain().focus().toggleBulletList().run()} active={editor?.isActive("bulletList")} title="Маркированный список">
            <List className="h-3.5 w-3.5" />
          </ToolbarBtn>
          <ToolbarBtn onClick={() => editor?.chain().focus().toggleOrderedList().run()} active={editor?.isActive("orderedList")} title="Нумерованный список">
            <ListOrdered className="h-3.5 w-3.5" />
          </ToolbarBtn>
          <ToolbarBtn onClick={() => editor?.chain().focus().toggleBlockquote().run()} active={editor?.isActive("blockquote")} title="Цитата">
            <Quote className="h-3.5 w-3.5" />
          </ToolbarBtn>
          <ToolbarBtn onClick={() => editor?.chain().focus().toggleCodeBlock().run()} active={editor?.isActive("codeBlock")} title="Блок кода">
            <Code className="h-3.5 w-3.5" />
          </ToolbarBtn>

          <Sep />

          <ToolbarBtn onClick={() => editor?.chain().focus().setTextAlign("left").run()} active={editor?.isActive({ textAlign: "left" })} title="По левому краю">
            <AlignLeft className="h-3.5 w-3.5" />
          </ToolbarBtn>
          <ToolbarBtn onClick={() => editor?.chain().focus().setTextAlign("center").run()} active={editor?.isActive({ textAlign: "center" })} title="По центру">
            <AlignCenter className="h-3.5 w-3.5" />
          </ToolbarBtn>
          <ToolbarBtn onClick={() => editor?.chain().focus().setTextAlign("right").run()} active={editor?.isActive({ textAlign: "right" })} title="По правому краю">
            <AlignRight className="h-3.5 w-3.5" />
          </ToolbarBtn>

          <Sep />

          <ToolbarBtn onClick={addLink} active={editor?.isActive("link")} title="Ссылка">
            <LinkIcon className="h-3.5 w-3.5" />
          </ToolbarBtn>
          <ToolbarBtn onClick={addImage} title="Вставить изображение по URL">
            <ImageIcon className="h-3.5 w-3.5" />
          </ToolbarBtn>

          <Sep />

          <ToolbarBtn onClick={() => editor?.chain().focus().undo().run()} title="Отменить">
            <Undo className="h-3.5 w-3.5" />
          </ToolbarBtn>
          <ToolbarBtn onClick={() => editor?.chain().focus().redo().run()} title="Повторить">
            <Redo className="h-3.5 w-3.5" />
          </ToolbarBtn>
        </div>

        <EditorContent editor={editor} />
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
