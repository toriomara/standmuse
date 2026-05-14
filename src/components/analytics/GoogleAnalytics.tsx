"use client"

import Script from "next/script"
import { usePathname } from "next/navigation"
import { useEffect } from "react"

const GA_ID = "G-98NYS4NF8K"

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    dataLayer?: unknown[]
  }
}

export function GoogleAnalytics() {
  const pathname = usePathname()

  useEffect(() => {
    window.gtag?.("config", GA_ID, { page_path: window.location.href })
  }, [pathname])

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments);}
gtag('js',new Date());
gtag('config','${GA_ID}');
          `,
        }}
      />
    </>
  )
}
