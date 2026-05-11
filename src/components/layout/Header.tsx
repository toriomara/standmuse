"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { Menu, X, User, UserCheck, Search } from "lucide-react"
import { Logo } from "./Logo"
import { ThemeToggle } from "@/components/shared/ThemeToggle"
import { Button } from "@/components/ui/Button"
import { SearchModal } from "@/components/shared/SearchModal"
import { mainNav } from "@/constants/nav"
import { cn } from "@/lib/utils"

const PHONE_DISPLAY = "+7 927 522-16-12"
const PHONE_HREF = "tel:+79275221612"

export function Header({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => setMobileOpen(false), [pathname])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [])

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/")

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "bg-card/80 backdrop-blur-md border-b border-border shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-6">
          <Logo />

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium link-hover",
                  isActive(item.href)
                    ? "text-accent"
                    : "text-muted-foreground"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Search pill (lg+) / icon (md) */}
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Поиск"
              className="hidden md:flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-muted-foreground border border-border hover:border-border/80 hover:bg-muted transition-colors cursor-pointer lg:w-48"
            >
              <Search className="h-3.5 w-3.5 shrink-0" />
              <span className="hidden lg:inline flex-1 text-left">Поиск…</span>
              <kbd className="hidden lg:inline-flex text-[10px] text-muted-foreground/50 border border-border rounded px-1 py-0.5 ml-auto">
                Ctrl K
              </kbd>
            </button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Поиск"
              onClick={() => setSearchOpen(true)}
              className="md:hidden"
            >
              <Search className="h-4 w-4" />
            </Button>

            <ThemeToggle />

            <a
              href={PHONE_HREF}
              className="hidden md:flex items-center text-sm font-medium text-muted-foreground link-hover"
              aria-label="Позвонить"
            >
              {PHONE_DISPLAY}
            </a>

            <Link href="/account" className="hidden md:flex">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Личный кабинет"
                className={isLoggedIn ? "text-accent" : ""}
              >
                {isLoggedIn ? <UserCheck className="h-4 w-4" /> : <User className="h-4 w-4" />}
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Меню"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-card px-4 py-4">
          <nav className="flex flex-col gap-1">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-lg px-3 py-2.5 text-sm font-medium transition-colors link-hover",
                  isActive(item.href)
                    ? "bg-muted text-accent"
                    : "text-foreground hover:bg-muted"
                )}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/account"
              className={cn(
                "rounded-lg px-3 py-2.5 text-sm font-medium flex items-center gap-2 transition-colors link-hover",
                isLoggedIn ? "text-accent hover:bg-accent/10" : "text-foreground hover:bg-muted"
              )}
            >
              {isLoggedIn ? <UserCheck className="h-4 w-4" /> : <User className="h-4 w-4" />}
              Личный кабинет
            </Link>
            <a href={PHONE_HREF} className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted flex items-center gap-2 transition-colors link-hover">
              {PHONE_DISPLAY}
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}
