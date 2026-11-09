import { auth } from "@/lib/auth"
import { jsonError } from "@/lib/api"
import { isAdmin } from "@/lib/session"

/** Возвращает ответ 403, если текущий пользователь — не администратор; иначе `null`. */
export async function requireAdmin() {
  return isAdmin(await auth()) ? null : jsonError("Forbidden", 403)
}
