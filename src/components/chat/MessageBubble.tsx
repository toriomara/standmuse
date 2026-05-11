interface MessageBubbleProps {
  text: string | null
  imageUrl: string | null
  isOwn: boolean
  createdAt: string | Date
}

export function MessageBubble({ text, imageUrl, isOwn, createdAt }: MessageBubbleProps) {
  const time = new Date(createdAt).toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
          isOwn
            ? "bg-accent text-accent-foreground rounded-br-sm"
            : "bg-muted text-foreground rounded-bl-sm"
        }`}
      >
        {imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt="Изображение"
            className="rounded-lg max-w-full mb-1.5 max-h-64 object-contain"
          />
        )}
        {text && <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{text}</p>}
        <p className={`text-[10px] mt-1 ${isOwn ? "text-accent-foreground/60" : "text-muted-foreground"} text-right`}>
          {time}
        </p>
      </div>
    </div>
  )
}
