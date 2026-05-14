import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/providers/ThemeProvider"
import { ReduxProvider } from "@/components/providers/ReduxProvider"
import { YandexMetrika } from "@/components/analytics/YandexMetrika"
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics"

export const metadata: Metadata = {
  metadataBase: new URL("https://standmuse.ru"),
  title: {
    default: "StandMuse — Акустические стойки на заказ",
    template: "%s | StandMuse",
  },
  description:
    "Премиальные акустические стойки и HI-FI стойки ручной работы на заказ. Массив дерева, металл, виброразвязка. Изготовление 14 дней. Доставка СДЭК по всей России.",
  keywords: [
    "акустические стойки",
    "акустические стойки на заказ",
    "стойки для акустических колонок",
    "стойки под акустические колонки",
    "купить акустическую стойку",
    "комплект акустических стоек",
    "комплект стоек для акустических систем",
    "стойка под акустическую систему",
    "стойка напольная акустическая",
    "купить стойки для акустических колонок",
    "высота акустических стоек",
    "hi-fi стойки на заказ",
    "акустические панели",
    "виброразвязка",
    "standmuse",
  ],
  openGraph: {
    siteName: "StandMuse",
    locale: "ru_RU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "StandMuse — Акустические стойки на заказ",
    description:
      "Премиальные акустические и HI-FI стойки ручной работы. Массив дерева, металл, виброразвязка. Изготовление 14 дней.",
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" suppressHydrationWarning className="h-full">
      <body className="min-h-full flex flex-col antialiased">
        <ThemeProvider>
          <ReduxProvider>{children}</ReduxProvider>
        </ThemeProvider>
        <YandexMetrika />
        <GoogleAnalytics />
      </body>
    </html>
  )
}
