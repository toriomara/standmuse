export function Field({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</dt>
      <dd className="text-sm">{value}</dd>
    </div>
  )
}
