import type { Session } from "next-auth"

type SessionLike = Pick<Session, "user"> | null | undefined

export function getSessionUserId(session: SessionLike): string | undefined {
  const id = (session?.user as { id?: unknown } | undefined)?.id
  return typeof id === "string" ? id : undefined
}

export function getSessionUserRole(session: SessionLike): string | undefined {
  const role = (session?.user as { role?: unknown } | undefined)?.role
  return typeof role === "string" ? role : undefined
}

export function isAdmin(session: SessionLike): boolean {
  return getSessionUserRole(session) === "ADMIN"
}
