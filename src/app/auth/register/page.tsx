"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Logo } from "@/components/layout/Logo"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { registerSchema, type RegisterInput } from "@/lib/validations"

export default function RegisterPage() {
  const router = useRouter()
  const [error, setError] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) })

  const onSubmit = async (data: RegisterInput) => {
    setError("")
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    const json = await res.json()
    if (!res.ok) {
      setError(json.error ?? "Ошибка регистрации")
      return
    }
    await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    })
    router.push("/account")
    router.refresh()
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-background">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <Logo size="lg" />
        </div>

        <div className="bg-card border border-border rounded-2xl p-8">
          <h1 className="text-2xl font-bold mb-2">Регистрация</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Уже есть аккаунт?{" "}
            <Link href="/auth/login" className="text-accent hover:underline">
              Войти
            </Link>
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Input
              label="Имя"
              placeholder="Александр"
              error={errors.name?.message}
              {...register("name")}
            />
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register("email")}
            />
            <Input
              label="Телефон (необязательно)"
              type="tel"
              placeholder="+7 900 000 00 00"
              {...register("phone")}
            />
            <Input
              label="Пароль"
              type="password"
              placeholder="Минимум 8 символов"
              error={errors.password?.message}
              {...register("password")}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" size="lg" loading={isSubmitting} className="mt-2">
              Создать аккаунт
            </Button>
          </form>
        </div>

        <p className="text-center mt-4 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-accent transition-colors">
            ← Вернуться на сайт
          </Link>
        </p>
      </div>
    </div>
  )
}
