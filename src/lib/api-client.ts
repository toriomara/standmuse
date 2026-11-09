export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE"
  body?: unknown
}

/**
 * fetch-обёртка для клиентских компонентов: JSON in/out и, главное, ошибка при
 * не-2xx ответе — чтобы интерфейс не показывал «Сохранено» после упавшего запроса.
 */
export async function apiRequest<T = unknown>(
  url: string,
  { method = "GET", body }: RequestOptions = {},
): Promise<T> {
  let res: Response
  try {
    res = await fetch(url, {
      method,
      ...(body !== undefined && {
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }),
    })
  } catch {
    throw new ApiError("Нет соединения с сервером", 0)
  }

  if (!res.ok) {
    const json = await res.json().catch(() => null)
    throw new ApiError(json?.error ?? "Ошибка запроса", res.status)
  }

  return (res.status === 204 ? undefined : await res.json()) as T
}

export function errorMessage(error: unknown, fallback = "Не удалось выполнить действие"): string {
  return error instanceof ApiError ? error.message : fallback
}
