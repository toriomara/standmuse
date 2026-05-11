import Link from "next/link";
import { Phone, Mail, Clock } from "lucide-react";
import { Logo } from "./Logo";
import { mainNav, categoryNav } from "@/constants/nav";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Logo size="md" />
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              StandMuse — место, где звук находит свою опору
            </p>
            <div className="mt-5 flex flex-col gap-2.5">
              <a
                href="tel:+79275221612"
                className="group link-hover flex items-center gap-3 text-sm text-muted-foreground"
              >
                <Phone className="h-3.5 w-3.5 shrink-0" />
                <span className="font-medium">+7 927 522-16-12</span>
              </a>
              <a
                href="mailto:info@standmuse.ru"
                className="group link-hover flex items-center gap-3 text-sm text-muted-foreground"
              >
                <Mail className="h-3.5 w-3.5 shrink-0" />
                info@standmuse.ru
              </a>
            </div>

            {/* Social links */}
            <div className="mt-5 flex items-center gap-2">
              <a
                href="https://t.me/standmuse"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Телеграм StandMuse"
                className="flex items-center justify-center h-8 w-8 rounded-lg text-muted-foreground hover:text-accent transition-colors"
              >
                {/* Telegram */}
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
              </a>
              <a
                href="https://instagram.com/standmuse"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Инстаграм StandMuse"
                className="flex items-center justify-center h-8 w-8 rounded-lg text-muted-foreground hover:text-accent transition-colors"
              >
                {/* Instagram */}
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Catalog */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">
              Каталог
            </h3>
            <ul className="flex flex-col gap-2">
              {categoryNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground link-hover"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">
              Навигация
            </h3>
            <ul className="flex flex-col gap-2">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground link-hover"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">
              Готовы к заказу?
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Настройте стойки под свою акустику — мы сделаем за 14 дней
            </p>
            <Link
              href="/order"
              className="inline-flex items-center justify-center h-10 px-5 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Сконфигурировать
            </Link>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} StandMuse. Все права защищены.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <Link href="/privacy" className="link-hover">
              Политика конфиденциальности
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
