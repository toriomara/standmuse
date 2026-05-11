"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";

// ─── Контурная иллюстрация акустической стойки ──────────────────────────────

function SpeakerStandIllustration() {
  const fg = "var(--foreground)";
  const ac = "var(--accent)";

  return (
    <svg
      viewBox="0 0 320 560"
      className="w-full max-w-65 xl:max-w-75"
      fill="none"
      style={{ overflow: "visible" }}
    >
      {/* Плавная левитация всей иллюстрации после окончания рисования */}
      <motion.g
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 3.5 }}
      >

        {/* ── Шипы виброизоляции ── */}
        {[90, 230].map((cx, i) => (
          <motion.path key={cx}
            d={`M ${cx - 7},528 L ${cx},548 L ${cx + 7},528`}
            stroke={ac} strokeWidth="1.2" strokeOpacity="0.55"
            strokeLinecap="round" strokeLinejoin="round" fill="none"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.15 + i * 0.05, duration: 0.4 }}
          />
        ))}

        {/* ── Основание (массив дерева) ── */}
        <motion.rect
          x="56" y="498" width="210" height="30" rx="3" 
          stroke={ac} strokeWidth="1.5" strokeOpacity="0.55" fill="none"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        />
        <motion.line x1="85" y1="509" x2="235" y2="509"
          stroke={fg} strokeWidth="0.8" strokeOpacity="0.10"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.4 }}
        />
        <motion.line x1="85" y1="519" x2="235" y2="519"
          stroke={fg} strokeWidth="0.8" strokeOpacity="0.10"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.4 }}
        />

        {/* ── Колонна (стальная профтруба) ── */}
        <motion.rect
          x="130" y="288" width="60" height="210" rx="2"
          stroke={ac} strokeWidth="1.5" strokeOpacity="0.55" fill="none"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.7 }}
        />
        <motion.line x1="135" y1="290" x2="135" y2="497"
          stroke={fg} strokeWidth="0.7" strokeOpacity="0.10"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.4 }}
        />
        <motion.line x1="185" y1="290" x2="185" y2="497"
          stroke={fg} strokeWidth="0.7" strokeOpacity="0.10"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.4 }}
        />

        {/* ── Верхняя платформа (сталь) ── */}
        <motion.rect
          x="56" y="280" width="210" height="8" rx="2"
          stroke={ac} strokeWidth="1.5" strokeOpacity="0.55" fill="none"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.4 }}
        />

        {/* ── Корпус акустики ── */}
        <motion.rect
          x="55" y="20" width="210" height="260" rx="6"
          stroke={fg} strokeWidth="1.5" strokeOpacity="0.22" fill="none"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.8 }}
        />

        {/* Намёк на решётку: короткие горизонтальные линии слева */}
        {[80, 93, 106, 119, 132].map((y, i) => (
          <motion.line key={y}
            x1="57" y1={y} x2="88" y2={y}
            stroke={fg} strokeWidth="0.8" strokeOpacity="0.10"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 1.55 + i * 0.04, duration: 0.3 }}
          />
        ))}

        {/* ── Вуфер ── */}
        <motion.circle cx="160" cy="176" r="72"
          stroke={fg} strokeWidth="1.5" strokeOpacity="0.22" fill="none"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.6 }}
        />
        <motion.circle cx="160" cy="176" r="52"
          stroke={fg} strokeWidth="1" strokeOpacity="0.12" fill="none"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1.9, duration: 0.5 }}
        />
        <motion.circle cx="160" cy="176" r="26"
          stroke={ac} strokeWidth="1.2" strokeOpacity="0.40" fill="none"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 2.0, duration: 0.5 }}
        />

        {/* ── Твитер (верхняя часть АС) ── */}
        <motion.circle cx="160" cy="52" r="22"
          stroke={fg} strokeWidth="1.5" strokeOpacity="0.22" fill="none"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 2.1, duration: 0.4 }}
        />
        <motion.circle cx="160" cy="52" r="14"
          stroke={ac} strokeWidth="1.2" strokeOpacity="0.40" fill="none"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 0.4 }}
        />

        {/* ── Звуковые дуги (расходятся влево от x=55, центр — вуфер cy=176) ── */}
        <motion.path
          d="M 55,104 A 72,72 0 0,0 55,248"
          stroke={ac} strokeWidth="1.5" strokeLinecap="round" fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.35 }}
          transition={{ delay: 2.3, duration: 0.5, ease: "easeOut" }}
        />
        <motion.path
          d="M 55,84 A 92,92 0 0,0 55,268"
          stroke={ac} strokeWidth="1.2" strokeLinecap="round" fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.22 }}
          transition={{ delay: 2.5, duration: 0.5, ease: "easeOut" }}
        />
        <motion.path
          d="M 55,64 A 112,112 0 0,0 55,288"
          stroke={ac} strokeWidth="1" strokeLinecap="round" fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.13 }}
          transition={{ delay: 2.7, duration: 0.5, ease: "easeOut" }}
        />

      </motion.g>
    </svg>
  );
}

// ─── HeroSection ─────────────────────────────────────────────────────────────

export function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    const isDark = () => document.documentElement.classList.contains("dark");

    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      const waves = [
        { freq: 0.006, amp: 55, speed: 0.20, phase: 0,               yOffset:  0    },
        { freq: 0.009, amp: 42, speed: 0.30, phase: Math.PI * 0.7,   yOffset: -0.10 },
        { freq: 0.012, amp: 32, speed: 0.50, phase: Math.PI / 3,     yOffset:  0.10 },
        { freq: 0.008, amp: 48, speed: 0.25, phase: Math.PI,         yOffset: -0.15 },
        { freq: 0.015, amp: 22, speed: 0.70, phase: Math.PI * 1.5,   yOffset:  0.05 },
        { freq: 0.020, amp: 15, speed: 0.90, phase: Math.PI * 0.4,   yOffset: -0.05 },
        { freq: 0.005, amp: 60, speed: 0.15, phase: Math.PI * 1.2,   yOffset:  0.15 },
      ];

      waves.forEach((wave, i) => {
        ctx.beginPath();
        const alpha = isDark() ? 0.22 - i * 0.02 : 0.15 - i * 0.015;
        ctx.strokeStyle = isDark()
          ? `rgba(245, 197, 24, ${alpha})`
          : `rgba(37, 99, 235, ${alpha})`;
        ctx.lineWidth = isDark() ? 2.0 - i * 0.15 : 1.5 - i * 0.10;

        const centerY = h / 2 + h * wave.yOffset;
        for (let x = 0; x <= w; x += 2) {
          const y =
            centerY +
            Math.sin(x * wave.freq + t * wave.speed + wave.phase) * wave.amp +
            Math.sin(x * wave.freq * 2.3 + t * wave.speed * 1.2) *
              (wave.amp * 0.3);

          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      });

      t += 0.016;
      animId = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden">
      {/* Animated wave background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        aria-hidden="true"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--background)] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 xl:gap-20 items-center">

          {/* Левая колонка: иллюстрация (только десктоп) */}
          <motion.div
            className="hidden lg:flex items-center justify-center"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            aria-hidden="true"
          >
            <SpeakerStandIllustration />
          </motion.div>

          {/* Правая колонка: текст */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block text-xs font-semibold tracking-widest uppercase text-accent mb-6">
                Ручная работа · Инженерная точность
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display text-4xl sm:text-6xl lg:text-5xl xl:text-7xl font-bold tracking-tight leading-[0.95] text-balance mb-6 sm:mb-8"
            >
              Звук
              <br />
              <span className="text-accent">начинается</span>
              <br />с основания
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="text-lg sm:text-2xl text-muted-foreground max-w-xl leading-relaxed mb-8 sm:mb-10"
            >
              Наши стойки не просто украшают акустику — они помогают ей звучать
              так, как задумал производитель
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap items-center gap-4"
            >
              <Link href="/order">
                <Button size="lg" className="gap-2">
                  Конфигуратор <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </Link>
              <Link href="/catalog">
                <Button variant="outline" size="lg">
                  Смотреть каталог
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="flex items-center gap-5 sm:gap-8 mt-10 sm:mt-16"
            >
              {[
                { value: "14", label: "дней изготовления" },
                { value: "9+", label: "пород дерева" },
                { value: "100%", label: "ручная работа" },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col">
                  <span className="font-display text-5xl sm:text-7xl font-bold text-foreground leading-none">
                    {stat.value}
                  </span>
                  <span className="text-sm text-muted-foreground mt-1.5">
                    {stat.label}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>

        </div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.6, ease: "easeInOut", repeat: Infinity }}
          className="flex flex-col items-center gap-0.5 text-accent/70 hover:text-accent transition-colors cursor-default"
        >
          <ChevronDown className="h-10 w-10 opacity-70" strokeWidth={1.2} aria-hidden="true" />
        </motion.div>
      </motion.div>
    </section>
  );
}
