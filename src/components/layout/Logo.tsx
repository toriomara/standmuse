"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { useState, useRef } from "react"
import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

const WAVE_PATH =
  "M2 16 C4 10, 6 6, 8 16 C10 26, 12 28, 14 16 C16 4, 18 2, 20 16 C22 30, 24 30, 26 16 C28 2, 30 4, 32 16 C34 28, 36 26, 38 16"

const SIZES = { sm: "h-6", md: "h-8", lg: "h-10" }
const TEXT_SIZES = { sm: "text-lg", md: "text-xl", lg: "text-2xl" }

export function Logo({ className, size = "md" }: LogoProps) {
  const [focused, setFocused] = useState(false)
  const [hovered, setHovered] = useState(false)
  const hoverBlocked = useRef(false)

  return (
    <Link
      href="/"
      className={cn("flex items-center", className)}
      aria-label="StandMuse — на главную"
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onClick={() => {
        setHovered(false)
        hoverBlocked.current = true
        setTimeout(() => { hoverBlocked.current = false }, 500)
      }}
    >
      <motion.div
        className="flex items-center gap-2.5"
        initial="rest"
        animate={(hovered || focused) ? "hover" : "rest"}
        onHoverStart={() => { if (!hoverBlocked.current) setHovered(true) }}
        onHoverEnd={() => setHovered(false)}
      >
        <svg
          className={cn(SIZES[size], "w-auto text-accent shrink-0")}
          viewBox="0 0 40 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d={WAVE_PATH}
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            opacity={0.18}
          />
          <motion.path
            d={WAVE_PATH}
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            variants={{
              rest: {
                opacity: 1,
                pathLength: 1,
                pathOffset: 0,
                transition: {
                  opacity: { duration: 0.2 },
                  pathLength: { duration: 0.35 },
                  pathOffset: { duration: 0.35 },
                },
              },
              hover: {
                opacity: 1,
                pathLength: 0.2,
                pathOffset: [0, 1],
                transition: {
                  opacity: { duration: 0.15 },
                  pathLength: { duration: 0 },
                  pathOffset: { duration: 2.4, ease: "linear", repeat: Infinity },
                },
              },
            }}
          />
        </svg>

        <span className={cn("font-display font-bold tracking-tight", TEXT_SIZES[size])}>
          <motion.span
            variants={{
              rest: { color: "var(--foreground)" },
              hover: { color: "var(--accent)", transition: { duration: 0.25 } },
            }}
          >
            Stand
          </motion.span>
          <motion.span
            variants={{
              rest: { color: "var(--accent)" },
              hover: { color: "var(--foreground)", transition: { duration: 0.25 } },
            }}
          >
            Muse
          </motion.span>
        </span>
      </motion.div>
    </Link>
  )
}
