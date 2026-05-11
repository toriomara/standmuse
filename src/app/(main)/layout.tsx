import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { auth } from "@/lib/auth"

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-9999 focus:px-4 focus:py-2 focus:rounded-lg focus:bg-card focus:text-foreground focus:border focus:border-border focus:text-sm focus:font-medium focus:shadow-lg"
      >
        Перейти к основному содержимому
      </a>
      <Header isLoggedIn={!!session?.user} />
      <main id="main-content" className="flex-1">{children}</main>
      <Footer />
    </>
  )
}
