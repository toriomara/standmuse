"use client"

import { useEffect, useRef, useState } from "react"
import { getPusherClient } from "@/lib/pusher-client"
import { MessageBubble } from "./MessageBubble"
import { MessageInput } from "./MessageInput"

interface ChatMessage {
  id: string
  senderId: string
  senderRole: string
  text: string | null
  imageUrl: string | null
  createdAt: string | Date
}

interface ChatWindowProps {
  conversationId: string
  currentUserId: string
  role: "USER" | "ADMIN"
  initialMessages: ChatMessage[]
  apiPath: string
}

export function ChatWindow({
  conversationId,
  currentUserId,
  role,
  initialMessages,
  apiPath,
}: ChatWindowProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "instant" })
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    const pusher = getPusherClient()
    if (!pusher) return

    const channel = pusher.subscribe(`private-chat-${conversationId}`)
    channel.bind("new-message", (data: ChatMessage) => {
      setMessages((prev) =>
        prev.some((m) => m.id === data.id) ? prev : [...prev, data]
      )
    })

    return () => {
      channel.unbind_all()
      pusher.unsubscribe(`private-chat-${conversationId}`)
    }
  }, [conversationId])

  const handleSend = async (text: string, imageUrl?: string) => {
    const res = await fetch(apiPath, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversationId, text, imageUrl }),
    })
    if (res.ok) {
      const msg: ChatMessage = await res.json()
      setMessages((prev) =>
        prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]
      )
    } else {
      console.error("Failed to send message", res.status)
    }
  }

  return (
    <div className="flex flex-col border border-border rounded-xl overflow-hidden bg-background" style={{ height: "600px" }}>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
            Напишите первое сообщение
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              text={msg.text}
              imageUrl={msg.imageUrl}
              isOwn={
                role === "ADMIN"
                  ? msg.senderRole === "ADMIN"
                  : msg.senderId === currentUserId
              }
              createdAt={msg.createdAt}
            />
          ))
        )}
        <div ref={bottomRef} />
      </div>

      <MessageInput onSend={handleSend} />
    </div>
  )
}
