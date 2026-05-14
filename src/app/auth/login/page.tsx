"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signIn, getSession } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Logo } from "@/components/layout/Logo"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { loginSchema, type LoginInput } from "@/lib/validations"

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (data: LoginInput) => {
    setError("")
    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    })

    if (res?.error) {
      setError("Неверный email или пароль")
      return
    }
    const session = await getSession()
    const role = (session?.user as { role?: string })?.role
    router.push(role === "ADMIN" ? "/admin" : "/account")
    router.refresh()
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-[var(--background)]">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <Logo size="lg" />
        </div>

        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-8">
          <h1 className="text-2xl font-bold mb-2">Войти</h1>
          <p className="text-sm text-[var(--muted-foreground)] mb-6">
            Нет аккаунта?{" "}
            <Link href="/auth/register" className="text-[var(--accent)] hover:underline">
              Зарегистрироваться
            </Link>
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register("email")}
            />
            <Input
              label="Пароль"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register("password")}
            />
            {error && <p className="text-sm text-[var(--destructive)]">{error}</p>}
            <Button type="submit" size="lg" loading={isSubmitting} className="mt-2">
              Войти
            </Button>
          </form>
        </div>

        <p className="text-center mt-4 text-xs text-[var(--muted-foreground)]">
          <Link href="/" className="hover:text-accent transition-colors">
            ← Вернуться на сайт
          </Link>
        </p>
      </div>
    </div>
  )
}
