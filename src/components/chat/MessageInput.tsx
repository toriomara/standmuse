"use client"

import { useState, useRef, KeyboardEvent } from "react"
import { Send, Paperclip, X } from "lucide-react"
import { useUploadThing } from "@/lib/uploadthing-client"

interface MessageInputProps {
  onSend: (text: string, imageUrl?: string) => Promise<void>
  disabled?: boolean
}

export function MessageInput({ onSend, disabled }: MessageInputProps) {
  const [text, setText] = useState("")
  const [pendingImage, setPendingImage] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [sending, setSending] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const { startUpload } = useUploadThing("chatImageUploader", {
    onClientUploadComplete: (res) => {
      if (res?.[0]?.url) setPendingImage(res[0].url)
      setUploading(false)
    },
    onUploadError: () => setUploading(false),
  })

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    await startUpload([file])
    if (fileRef.current) fileRef.current.value = ""
  }

  const handleSend = async () => {
    if ((!text.trim() && !pendingImage) || sending) return
    setSending(true)
    try {
      await onSend(text.trim(), pendingImage ?? undefined)
      setText("")
      setPendingImage(null)
    } finally {
      setSending(false)
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const isLoading = disabled || uploading || sending
  const canSend = (text.trim() || pendingImage) && !isLoading

  return (
    <div className="border-t border-border bg-background p-3 flex flex-col gap-2">
      {pendingImage && (
        <div className="relative inline-block self-start">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={pendingImage} alt="Прикреплённое изображение" className="h-20 rounded-lg object-cover" />
          <button
            onClick={() => setPendingImage(null)}
            className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"
            aria-label="Удалить изображение"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      <div className="flex items-end gap-2">
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={isLoading}
          aria-label="Прикрепить изображение"
          className="flex-shrink-0 h-9 w-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-50"
        >
          {uploading ? (
            <span className="h-4 w-4 rounded-full border-2 border-accent border-t-transparent animate-spin" />
          ) : (
            <Paperclip className="h-4 w-4" />
          )}
        </button>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          placeholder="Написать сообщение… (Enter — отправить)"
          rows={1}
          className="flex-1 resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 disabled:opacity-50 max-h-32 overflow-y-auto"
          style={{ minHeight: "36px" }}
        />

        <button
          type="button"
          onClick={handleSend}
          disabled={!canSend}
          aria-label="Отправить"
          className="flex-shrink-0 h-9 w-9 rounded-lg flex items-center justify-center bg-accent text-accent-foreground hover:opacity-90 transition-opacity disabled:opacity-40"
        >
          {sending ? (
            <span className="h-4 w-4 rounded-full border-2 border-accent-foreground border-t-transparent animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  )
}
