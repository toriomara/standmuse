export function SaveStatus({ done, error }: { done: boolean; error: string }) {
  if (error) return <span className="text-sm text-destructive">{error}</span>
  if (done) return <span className="text-sm text-green-600 dark:text-green-400">Сохранено</span>
  return null
}
