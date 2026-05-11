import { prisma } from "@/lib/prisma"
import { triggerPusher } from "@/lib/pusher-server"

type CreateMessageInput = {
  conversationId: string
  senderId: string
  senderRole: "USER" | "ADMIN"
  text?: string | null
  imageUrl?: string | null
}

export async function createConversationMessage(input: CreateMessageInput) {
  const message = await prisma.message.create({
    data: {
      conversationId: input.conversationId,
      senderId: input.senderId,
      senderRole: input.senderRole,
      text: input.text?.trim() || null,
      imageUrl: input.imageUrl || null,
    },
  })

  await prisma.conversation.update({
    where: { id: input.conversationId },
    data: { lastMessageAt: new Date() },
  })

  await triggerPusher(`private-chat-${input.conversationId}`, "new-message", {
    id: message.id,
    senderId: message.senderId,
    senderRole: message.senderRole,
    text: message.text,
    imageUrl: message.imageUrl,
    createdAt: message.createdAt,
  })

  return message
}
