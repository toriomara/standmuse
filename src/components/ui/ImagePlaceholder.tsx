export function ImagePlaceholder() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <svg
        viewBox="0 0 100 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-2/5 max-w-[88px]"
      >
        {/* Dashed frame */}
        <rect
          x="1.5" y="1.5" width="97" height="77" rx="6"
          stroke="var(--muted-foreground)" strokeWidth="1.5"
          strokeDasharray="6 4" strokeOpacity="0.22"
        />
        {/* Sun — accent */}
        <circle
          cx="31" cy="29" r="9"
          stroke="var(--accent)" strokeWidth="1.5" strokeOpacity="0.4"
        />
        {/* Landscape */}
        <path
          d="M9 62 L31 35 L53 50 L68 37 L91 62"
          stroke="var(--muted-foreground)" strokeWidth="2"
          strokeOpacity="0.22" strokeLinecap="round" strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}
