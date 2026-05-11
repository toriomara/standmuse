import { cn } from "@/lib/utils"

interface SectionTitleProps {
  tag?: string
  title: string
  subtitle?: string
  align?: "left" | "center"
  className?: string
}

export function SectionTitle({
  tag,
  title,
  subtitle,
  align = "left",
  className,
}: SectionTitleProps) {
  return (
    <div className={cn("flex flex-col gap-3", align === "center" && "items-center text-center", className)}>
      {tag && (
        <span className="text-xs font-semibold tracking-widest uppercase text-[var(--accent)]">
          {tag}
        </span>
      )}
      <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight text-balance leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  )
}
